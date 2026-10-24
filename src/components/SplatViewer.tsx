"use client";

import { useEffect, useRef, useState } from "react";
import type { SplatModel } from "@/data/site";

type Status = "loading" | "live" | "error";

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
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("loading");

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

        camera.position.set(1.55, 0.75, 1.65);
        // Cards aim slightly low so the machine sits centered in its frame instead of running off the bottom.
        controls.target.set(0, bare ? -0.05 : 0, 0);
        const size = () => {
          const w = stage.clientWidth;
          const h = stage.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.position.setLength(bare ? 2.65 * (model.cardFit ?? 1) : (compact ? 3.1 : w < 700 ? 3.1 : 2.45) * (model.fit ?? 1));
          camera.updateProjectionMatrix();
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

        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(stage);
        renderer.setAnimationLoop(() => {
          if (!visible) return;
          controls.update();
          renderer.render(scene, camera);
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
  }, [model, compact, bare]);

  // Blank while loading, then the model fades in. The studio render is only a fallback for devices without WebGL.
  const showPoster = status === "error";
  const statusText = status === "live" ? "Drag to rotate" : status === "loading" ? "Loading 3D model…" : "Studio render";

  return (
    <div className={`splat ${bare ? "splat-bare" : ""} ${className}`}>
      <div ref={stageRef} className="splat-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {showPoster ? <img className="splat-poster" src={poster} alt={alt} /> : null}
        <canvas
          ref={canvasRef}
          className="splat-canvas"
          aria-label={`Interactive 3D view: ${alt}. Drag to rotate.`}
          data-live={status === "live"}
          style={{ visibility: status === "error" ? "hidden" : "visible" }}
        />
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
