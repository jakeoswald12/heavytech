"use client";

import { useEffect, useRef, useState } from "react";
import type { Annotation, SplatModel } from "@/data/site";

type Status = "loading" | "live" | "error";
const NO_ANNOTATIONS: Annotation[] = [];
const NO_OFFSET: [number, number] = [0, 0]; // stable default so the effect doesn't re-run every render

/**
 * Interactive Gaussian-splat viewer. Stays blank until the model is ready, then fades it in (the studio
 * render only appears if 3D can't run on the device). Auto-rotates slowly and pauses while the viewer drags.
 */
export default function SplatViewer({
  model,
  poster,
  alt,
  className = "",
  compact = false,
  bare = false,
  showStatus = !bare,
  annotations = NO_ANNOTATIONS,
  bleed = 0,
  startAngle = 0,
  offset = NO_OFFSET,
}: {
  model: SplatModel;
  poster: string;
  alt: string;
  className?: string;
  /** Pull the camera back for smaller frames. */
  compact?: boolean;
  /** Card mode: no auto-rotate, no status line, and only loads when scrolled near. */
  bare?: boolean;
  /** Show the small "Drag to rotate" status line under the model. */
  showStatus?: boolean;
  /** CAD-style callouts whose leader lines stay pinned to points on the model. */
  annotations?: Annotation[];
  /**
   * Let the canvas run this fraction of the stage height past its bottom edge, so a model that sits
   * low isn't cropped. The model keeps exactly the same size and position as without bleed.
   */
  bleed?: number;
  /** Rotate the starting camera position around the model (radians; negative turns the view right). */
  startAngle?: number;
  /** Nudge the rendered model by [x, y] pixels without moving the labels (leader lines follow it). */
  offset?: [number, number];
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frontRefs = useRef<(SVGGElement | null)[]>([]);
  const backRefs = useRef<(SVGGElement | null)[]>([]);
  // Callouts: one can be pinned open by a click; any click elsewhere closes it.
  const [pinned, setPinned] = useState<number | null>(null);
  useEffect(() => {
    if (pinned === null) return;
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.(".anno-box")) setPinned(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [pinned]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        const { SparkRenderer, SplatMesh } = await import("@sparkjsdev/spark");
        if (disposed) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
        scene.add(new SparkRenderer({ renderer }));

        const controls = new OrbitControls(camera, canvas);
        // OrbitControls claims every touch (touch-action: none), which blocks page scrolling on phones.
        // Hand vertical swipes back to the browser: they scroll the page, sideways drags turn the model.
        canvas.style.touchAction = "pan-y";
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.minPolarAngle = Math.PI * 0.18;
        controls.maxPolarAngle = Math.PI * 0.52;
        // Large viewers turn slowly on their own; cards stay still until dragged.
        const spin = !bare && !reduce;
        controls.autoRotate = spin;
        controls.autoRotateSpeed = 1.1;
        let idle: ReturnType<typeof setTimeout> | undefined;
        controls.addEventListener("start", () => {
          controls.autoRotate = false;
          clearTimeout(idle);
        });
        controls.addEventListener("end", () => {
          clearTimeout(idle);
          if (spin) idle = setTimeout(() => (controls.autoRotate = true), 3500);
        });

        camera.position.set(1.55, 0.75, 1.65).applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle);
        // Cards aim slightly low so the machine sits centered in its frame instead of running off the bottom.
        controls.target.set(0, bare ? -0.05 : 0, 0);
        const BASE_FOV = 32;
        let canvasH = 0;
        const size = () => {
          const w = stage.clientWidth;
          const h = stage.clientHeight;
          canvasH = Math.round(h * (1 + bleed));
          renderer.setSize(w, canvasH, false);
          if (bleed > 0) {
            // Render a taller canvas without changing what the stage-sized view shows: widen the
            // vertical field of view to a virtual frame centred where the stage centre was, then crop it
            // so the original view fills the top of the canvas and the extra rows hang below.
            const virtualH = 2 * canvasH - h;
            const t = Math.tan(((BASE_FOV / 2) * Math.PI) / 180) * (virtualH / h);
            camera.fov = (2 * Math.atan(t) * 180) / Math.PI;
            camera.aspect = w / virtualH;
            camera.setViewOffset(w, virtualH, 0, virtualH - canvasH, w, canvasH);
          } else {
            camera.fov = BASE_FOV;
            camera.aspect = w / h;
            camera.clearViewOffset();
          }
          camera.position.setLength(bare ? 2.65 * (model.cardFit ?? 1) : (compact ? 3.1 : w < 700 ? 3.25 : 2.45) * (model.fit ?? 1));
          camera.updateProjectionMatrix();
        };
        // Leader-line start points: the inner end of each label's underline, relative to the stage.
        let starts: { x: number; y: number }[] = [];
        const measureLabels = () => {
          const s = stage.getBoundingClientRect();
          starts = annotations.map((a, i) => {
            const r = labelRefs.current[i]?.getBoundingClientRect();
            if (!r) return { x: 0, y: 0 };
            // The underline is the box's 1px bottom border; aim for its centre line (bottom - 0.5px),
            // not the box's outer edge, so the leader line meets it exactly.
            return { x: (a.slot === "left" ? r.right : r.left) - s.left, y: r.bottom - s.top - 0.5 };
          });
        };
        size();
        const ro = new ResizeObserver(size);
        ro.observe(stage);

        const mesh = new SplatMesh({ url: model.src });
        mesh.rotation.set(model.rotX, model.rotY, 0);
        mesh.scale.setScalar(model.scale);
        mesh.position.y = model.y;
        scene.add(mesh);
        mesh.initialized
          .then(() => !disposed && setStatus("live"))
          .catch(() => {
            if (!disposed) setStatus("error");
          });

        // Annotation anchors in model space; re-projected to the screen every frame.
        const anchors = annotations.map((a) => new THREE.Vector3(...a.anchor));
        const normals = annotations.map((a) => new THREE.Vector3(...a.normal));
        const world = new THREE.Vector3();
        const dir = new THREE.Vector3();
        const toCam = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        const placeLines = () => {
          if (!annotations.length) return;
          // Labels grow and shrink as they open, so their underline ends are measured every frame.
          measureLabels();
          const w = stage.clientWidth;
          const h = canvasH;
          mesh.getWorldQuaternion(quat);
          annotations.forEach((_, i) => {
            world.copy(anchors[i]);
            mesh.localToWorld(world);
            toCam.copy(camera.position).sub(world);
            const facing = dir.copy(normals[i]).applyQuaternion(quat).dot(toCam) > 0;
            const p = world.clone().project(camera);
            const x = ((p.x + 1) / 2) * w + offset[0];
            const y = ((1 - p.y) / 2) * h + offset[1];
            const s = starts[i] ?? { x: 0, y: 0 };
            // Draw the line in front of the model when its point faces the camera, behind it otherwise.
            for (const [g, show] of [
              [frontRefs.current[i], facing],
              [backRefs.current[i], !facing],
            ] as const) {
              if (!g) continue;
              // Crossfade between the front and back layers rather than snapping (see .anno-lines g).
              g.style.opacity = show ? "1" : "0";
              const line = g.querySelector("line");
              const dot = g.querySelector("circle");
              line?.setAttribute("x1", String(s.x));
              line?.setAttribute("y1", String(s.y));
              line?.setAttribute("x2", String(x));
              line?.setAttribute("y2", String(y));
              dot?.setAttribute("cx", String(x));
              dot?.setAttribute("cy", String(y));
            }
          });
        };

        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(stage);
        renderer.setAnimationLoop(() => {
          if (!visible) return;
          controls.update();
          renderer.render(scene, camera);
          placeLines();
        });

        cleanup = () => {
          renderer.setAnimationLoop(null);
          ro.disconnect();
          io.disconnect();
          controls.dispose();
          mesh.dispose?.();
          renderer.dispose();
        };
      } catch {
        if (!disposed) setStatus("error");
      }
    };

    // Cards wait until they're near the viewport so the page doesn't load every model at once.
    let near: IntersectionObserver | undefined;
    if (bare) {
      near = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            near?.disconnect();
            start();
          }
        },
        { rootMargin: "300px 0px" },
      );
      near.observe(stage);
    } else {
      start();
    }

    return () => {
      disposed = true;
      near?.disconnect();
      cleanup();
    };
  }, [model, compact, bare, annotations, bleed, startAngle, offset]);

  // Blank while loading, then the model fades in. The studio render is only a fallback for devices without WebGL.
  const showPoster = status === "error";
  const statusText = status === "live" ? "Drag to rotate" : status === "loading" ? "Loading 3D model…" : "Studio render";

  return (
    <div className={`splat ${bare ? "splat-bare" : ""} ${className}`}>
      <div ref={stageRef} className="splat-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {showPoster ? <img className="splat-poster" src={poster} alt={alt} /> : null}
        {annotations.length ? (
          <svg className="anno-lines anno-back" aria-hidden="true" data-live={status === "live"}>
            {annotations.map((a, i) => (
              <g key={a.title} ref={(el) => void (backRefs.current[i] = el)} style={{ opacity: 0 }}>
                <line />
                <circle r="3" />
              </g>
            ))}
          </svg>
        ) : null}
        <canvas
          ref={canvasRef}
          className="splat-canvas"
          aria-label={`Interactive 3D view: ${alt}. Drag to rotate.`}
          data-live={status === "live"}
          style={{
            visibility: status === "error" ? "hidden" : "visible",
            height: bleed ? `${(1 + bleed) * 100}%` : undefined,
            translate: offset[0] || offset[1] ? `${offset[0]}px ${offset[1]}px` : undefined,
          }}
        />
        {annotations.length ? (
          <>
            <svg className="anno-lines anno-front" aria-hidden="true" data-live={status === "live"}>
              {annotations.map((a, i) => (
                <g key={a.title} ref={(el) => void (frontRefs.current[i] = el)} style={{ opacity: 0 }}>
                  <line />
                  <circle r="3" />
                </g>
              ))}
            </svg>
            <ol className="anno-labels" data-live={status === "live"} aria-label="Callouts">
              {annotations.map((a, i) => (
                <li key={a.title} className={`anno anno-${a.slot}`} data-open={pinned === i}>
                  <div ref={(el) => void (labelRefs.current[i] = el)} className="anno-box">
                    <button
                      type="button"
                      className="anno-title"
                      aria-expanded={pinned === i}
                      onClick={() => setPinned((p) => (p === i ? null : i))}
                    >
                      <span className="anno-n">{String(i + 1).padStart(2, "0")}</span> — {a.title}
                    </button>
                    <span className="anno-body">
                      <span className="anno-text">
                        <span>{a.text}</span>
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </>
        ) : null}
      </div>
      {!showStatus ? null : (
        <div className="splat-ctl">
          <span className="label splat-status" data-live={status === "live"}>
            <span className="dot" aria-hidden="true" />
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
}
