"use client";

import { useEffect, useRef, useState } from "react";
import type { SplatModel } from "@/data/site";

type Status = "loading" | "live" | "error";

/**
 * Interactive Gaussian-splat viewer. Shows the studio render as a poster until the
 * splat has loaded, auto-rotates slowly, and pauses rotation while the viewer drags.
 */
export default function SplatViewer({
  model,
  poster,
  alt,
  className = "",
  compact = false,
  bare = false,
}: {
  model: SplatModel;
  poster: string;
  alt: string;
  className?: string;
  /** Pull the camera back for smaller frames. */
  compact?: boolean;
  /** No status line, and only start loading when scrolled near (for cards). */
  bare?: boolean;
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
        controls.autoRotate = !reduce;
        controls.autoRotateSpeed = 1.1;
        let idle: ReturnType<typeof setTimeout> | undefined;
        controls.addEventListener("start", () => {
          controls.autoRotate = false;
          clearTimeout(idle);
        });
        controls.addEventListener("end", () => {
          clearTimeout(idle);
          idle = setTimeout(() => (controls.autoRotate = !reduce), 3500);
        });

        camera.position.set(1.55, 0.75, 1.65);
        controls.target.set(0, 0, 0);
        const size = () => {
          const w = stage.clientWidth;
          const h = stage.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.position.setLength((compact ? 1.9 : w < 700 ? 3.1 : 2.45) * (model.fit ?? 1));
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

  // The studio render stands in until the 3D model is ready (or if 3D can't run on this device).
  const showPoster = status !== "live";
  const statusText = status === "live" ? "Drag to rotate" : status === "loading" ? "Loading 3D model…" : "Studio render";

  return (
    <div className={`splat ${bare ? "splat-bare" : ""} ${className}`}>
      <div ref={stageRef} className="splat-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="splat-poster" src={poster} alt={alt} style={{ opacity: showPoster ? 1 : 0 }} />
        <canvas
          ref={canvasRef}
          className="splat-canvas"
          aria-label={`Interactive 3D view: ${alt}. Drag to rotate.`}
          style={{ visibility: status === "error" ? "hidden" : "visible" }}
        />
      </div>
      {bare ? null : (
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
