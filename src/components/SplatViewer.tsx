"use client";

import { useEffect, useRef, useState } from "react";
import type { Annotation, SplatModel } from "@/data/site";
import { whenIdle } from "@/lib/whenIdle";

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
  shift = NO_OFFSET,
  cycle,
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
  /**
   * Lens shift: move the model by [x, y] fractions of the canvas (x right, y up) without moving the
   * canvas, so a full-bleed canvas can still put the model off-centre.
   */
  shift?: [number, number];
  /**
   * Open the callouts one at a time as the model turns: `cycle.order` lists annotation indexes in the
   * order they open, each for an equal third of a turn; `cycle.leaveAt` is how far (radians) the camera
   * turns past the first one's surface normal before it closes and the next opens.
   */
  cycle?: { order: number[]; leaveAt: number };
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frontRefs = useRef<(SVGGElement | null)[]>([]);
  const backRefs = useRef<(SVGGElement | null)[]>([]);
  // Callouts: one can be pinned open by a click; any click elsewhere closes it.
  const [pinned, setPinned] = useState<number | null>(null);
  // The callout opened automatically as the model turns (hover and click still work on top of it).
  const [auto, setAuto] = useState<number | null>(cycle ? cycle.order[0] : null);
  const [hovering, setHovering] = useState(false);
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
        if (disposed) return;
        const isMesh = model.kind === "glb";

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: isMesh, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);

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
            camera.setViewOffset(w, virtualH, -shift[0] * w, virtualH - canvasH + shift[1] * h, w, canvasH);
          } else {
            camera.fov = BASE_FOV;
            camera.aspect = w / h;
            if (shift[0] || shift[1]) camera.setViewOffset(w, h, -shift[0] * w, shift[1] * h, w, h);
            else camera.clearViewOffset();
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

        // The model. `mesh` is the object whose own space the annotation anchors are written in.
        let mesh: InstanceType<typeof THREE.Object3D>;
        let onFrame = () => {};
        let disposeExtra = () => {};
        if (isMesh) {
          // CAD mesh in the studio look: environment reflections, a key light that casts a soft shadow,
          // a rim light, and a faint pool of light on the ground.
          const [{ GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }, look] = await Promise.all([
            import("three/examples/jsm/loaders/GLTFLoader.js"),
            import("three/examples/jsm/libs/meshopt_decoder.module.js"),
            import("three/examples/jsm/environments/RoomEnvironment.js"),
            import("@/lib/cadLook"),
          ]);
          if (disposed) return;
          renderer.toneMapping = THREE.NeutralToneMapping;
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          const pmrem = new THREE.PMREMGenerator(renderer);
          const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
          scene.environment = env;

          const key = new THREE.DirectionalLight(0xffffff, 2.2);
          key.castShadow = true;
          key.shadow.mapSize.setScalar(stage.clientWidth < 700 ? 1024 : 2048);
          key.shadow.bias = -0.0004;
          key.shadow.normalBias = 0.02;
          key.shadow.radius = 6;
          Object.assign(key.shadow.camera, { left: -1.6, right: 1.6, top: 1.6, bottom: -1.6, near: 0.5, far: 12 });
          const rim = new THREE.DirectionalLight(0xffffff, 2.4);
          scene.add(key, key.target, rim, new THREE.HemisphereLight(0xffffff, 0x222222, 0.3));

          const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(model.src);
          if (disposed) return;
          const inner = gltf.scene;
          await look.styleCadModel(THREE, inner);
          await look.addArmWordmark(THREE, inner, renderer);
          if (disposed) return;
          // Centre the machine on the origin and scale it so its length matches `model.scale`.
          const box = new THREE.Box3().setFromObject(inner);
          const c = box.getCenter(new THREE.Vector3());
          const dims = box.getSize(new THREE.Vector3());
          const k = model.scale / Math.max(dims.x, dims.z);
          inner.position.set(-c.x, -c.y, -c.z);
          const wrapper = new THREE.Group();
          wrapper.add(inner);
          wrapper.scale.setScalar(k);
          wrapper.rotation.set(model.rotX, model.rotY, 0);
          wrapper.position.y = model.y;
          scene.add(wrapper);
          const groundY = model.y + (box.min.y - c.y) * k;
          // The faint floor light is for the full-bleed hero; framed cards and pages get the shadow only.
          const ground = look.makeGround(THREE, model.scale, { pool: !bare && !compact });
          ground.position.y = groundY;
          scene.add(ground);
          key.target.position.set(0, groundY, 0);
          mesh = inner;

          // The light turns with the camera, so dragging reads as turning the machine under a fixed
          // light: the shadow sweeps around on the ground while the light stays put on screen.
          onFrame = () => {
            const az = Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z);
            key.position.set(Math.sin(az + 0.9) * 4, groundY + 5, Math.cos(az + 0.9) * 4);
            rim.position.set(Math.sin(az + Math.PI - 0.6) * 4, groundY + 3.5, Math.cos(az + Math.PI - 0.6) * 4);
          };
          disposeExtra = () => {
            env.dispose();
            pmrem.dispose();
          };
          setStatus("live");
        } else {
          const { SparkRenderer, SplatMesh } = await import("@sparkjsdev/spark");
          if (disposed) return;
          scene.add(new SparkRenderer({ renderer }));
          const splat = new SplatMesh({ url: model.src });
          splat.rotation.set(model.rotX, model.rotY, 0);
          splat.scale.setScalar(model.scale);
          splat.position.y = model.y;
          scene.add(splat);
          splat.initialized
            .then(() => !disposed && setStatus("live"))
            .catch(() => {
              if (!disposed) setStatus("error");
            });
          mesh = splat;
          disposeExtra = () => splat.dispose?.();
        }

        // Annotation anchors in model space; re-projected to the screen every frame.
        const anchors = annotations.map((a) => new THREE.Vector3(...a.anchor));
        const normals = annotations.map((a) => new THREE.Vector3(...a.normal));
        const world = new THREE.Vector3();
        const dir = new THREE.Vector3();
        const toCam = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        let lastAuto = -1;
        let firstK = -2;
        const placeLines = () => {
          if (!annotations.length) return;
          // Labels grow and shrink as they open, so their underline ends are measured every frame.
          measureLabels();
          const w = stage.clientWidth;
          const h = canvasH;
          mesh.getWorldQuaternion(quat);
          if (cycle) {
            // Which third of the turn the camera is in, measured from where the first callout's part
            // turns away. Auto-rotate turns the camera clockwise (azimuth decreasing).
            const n = dir.copy(normals[cycle.order[0]]).applyQuaternion(quat);
            const partAz = Math.atan2(n.x, n.z);
            const camAz = Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z);
            const TAU = Math.PI * 2;
            const phase = (((partAz - cycle.leaveAt - camAz) % TAU) + TAU) % TAU; // 0 at the hand-off
            const k = Math.floor(phase / (TAU / cycle.order.length));
            // phase 0..1/3 belongs to the 2nd callout, and so on; the first owns the last third.
            const pick = cycle.order[(k + 1) % cycle.order.length];
            // The first callout stays open from page load until the turn first crosses into a new third.
            if (firstK === -2) firstK = k;
            if (lastAuto === -1 && k === firstK) {
              // still in the starting third
            } else if (pick !== lastAuto) {
              lastAuto = pick;
              setAuto(pick);
            }
          }
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
        const io = new IntersectionObserver((es) => (visible = es[es.length - 1].isIntersecting)); // latest entry wins
        io.observe(stage);
        renderer.setAnimationLoop(() => {
          if (!visible) return;
          controls.update();
          onFrame();
          renderer.render(scene, camera);
          placeLines();
        });

        cleanup = () => {
          renderer.setAnimationLoop(null);
          ro.disconnect();
          io.disconnect();
          controls.dispose();
          disposeExtra();
          renderer.dispose();
        };
      } catch {
        if (!disposed) setStatus("error");
      }
    };

    // Cards load after the page has settled (or as soon as they come near), so their loading doesn't
    // land in the middle of the visitor's first scroll.
    let near: IntersectionObserver | undefined;
    let idle = () => {};
    if (bare) {
      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        near?.disconnect();
        start();
      };
      near = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && go(), { rootMargin: "300px 0px" });
      near.observe(stage);
      idle = whenIdle(go, 1200);
    } else {
      start();
    }

    return () => {
      disposed = true;
      idle();
      near?.disconnect();
      cleanup();
    };
  }, [model, compact, bare, annotations, bleed, startAngle, offset, shift, cycle]);

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
            <ol
              className="anno-labels"
              data-live={status === "live"}
              aria-label="Callouts"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {annotations.map((a, i) => (
                <li
                  key={a.title}
                  className={`anno anno-${a.slot}`}
                  // A clicked callout wins; while the pointer is over the labels, hover decides; otherwise
                  // the one the turning model is showing is open.
                  data-open={pinned !== null ? pinned === i : !hovering && auto === i}
                >
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
