"use client";

import { useEffect, useRef, useState } from "react";

/** One feature's view: which parts are shown as a studio render, and where the camera sits. */
export type FeatureView = {
  /** Base parts ("pack", "arm", "bucket") and/or feature tags ("controls", "pumps") to light up. */
  highlight: string[];
  /** Camera angle around the machine, radians from the rear (+z) toward the arm side (+x). */
  az: number;
  /** Camera height angle, radians. */
  el: number;
};

const MODEL = "/models/ht1-cad.glb";
const DURATION = 1400; // ms for the camera to swing between features
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * The HT-1 drawn as a frosted, see-through shell with one system picked out in the full studio look.
 * When `active` changes the camera swings to that feature's angle and the highlight moves with it.
 * Falls back to the feature images when WebGL isn't available.
 */
export default function TechModel({
  active,
  views,
  fallback,
  dist = 2.1,
  shiftY = 0,
}: {
  active: number;
  views: FeatureView[];
  fallback: { src: string; alt: string }[];
  /** Camera distance; larger frames want the camera further back. */
  dist?: number;
  /** Lens shift as a fraction of the frame height (positive moves the machine up). */
  shiftY?: number;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "live" | "error">("loading");
  // The latest requested feature, read by the render loop.
  const want = useRef(active);
  useEffect(() => {
    want.current = active;
  }, [active]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      try {
        const [THREE, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }, look] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/libs/meshopt_decoder.module.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
          import("@/lib/cadLook"),
        ]);
        if (disposed) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.NeutralToneMapping;
        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = env;
        const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50);

        const key = new THREE.DirectionalLight(0xffffff, 1.8);
        key.shadow.mapSize.setScalar(1024);
        key.shadow.radius = 6;
        key.shadow.bias = -0.0004;
        key.shadow.normalBias = 0.02;
        Object.assign(key.shadow.camera, { left: -1.6, right: 1.6, top: 1.6, bottom: -1.6, near: 0.5, far: 12 });
        const rim = new THREE.DirectionalLight(0xffffff, 1.2);
        scene.add(key, key.target, rim, new THREE.HemisphereLight(0xffffff, 0x222222, 0.45));

        const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(MODEL);
        if (disposed) return;
        const inner = gltf.scene;
        await look.styleCadModel(THREE, inner);
        const wordmark = await look.addArmWordmark(THREE, inner, renderer);
        if (disposed) return;

        // Same framing as the hero: machine centred, 1.3 units long, standing on the ground.
        const LENGTH = 1.3;
        const box = new THREE.Box3().setFromObject(inner);
        const c = box.getCenter(new THREE.Vector3());
        const dims = box.getSize(new THREE.Vector3());
        const k = LENGTH / Math.max(dims.x, dims.z);
        inner.position.set(-c.x, -c.y, -c.z);
        const wrapper = new THREE.Group();
        wrapper.add(inner);
        wrapper.scale.setScalar(k);
        scene.add(wrapper);
        const groundY = (box.min.y - c.y) * k;
        key.target.position.set(0, groundY, 0);

        // Frosted shell for everything that isn't featured. Light on a dark page, dark ink on a light one.
        const shell = new THREE.MeshPhysicalMaterial({
          color: 0xf4f4f2, roughness: 0.55, transparent: true, opacity: 0.17, depthWrite: false,
          emissive: 0x1a1a1a, side: THREE.DoubleSide, envMapIntensity: 0.7,
        });
        const hidden = new THREE.MeshBasicMaterial({ visible: false });
        const isLight = () => {
          const t = document.documentElement.dataset.theme;
          return t ? t === "light" : window.matchMedia("(prefers-color-scheme: light)").matches;
        };
        const tint = () => {
          const light = isLight();
          shell.color.set(light ? 0x2c2a27 : 0xf4f4f2);
          shell.emissive.set(light ? 0x000000 : 0x1a1a1a);
          shell.opacity = light ? 0.14 : 0.17;
        };
        tint();
        const themeWatch = new MutationObserver(tint);
        themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        // Highlighted parts keep their studio materials (the ones styleCadModel gave them).
        type Entry = { m: InstanceType<typeof THREE.Mesh>; part: string; tag: string; studio: InstanceType<typeof THREE.Material> };
        const meshes: Entry[] = [];
        inner.traverse((o) => {
          const m = o as InstanceType<typeof THREE.Mesh>;
          if (!m.isMesh || m === wordmark) return;
          meshes.push({ m, part: look.partOf(m), tag: look.tagOf(m), studio: m.material as InstanceType<typeof THREE.Material> });
        });
        const highlight = (i: number) => {
          const on = new Set(views[i]?.highlight ?? []);
          for (const x of meshes) {
            const lit = on.has(x.part) || (x.tag !== "" && on.has(x.tag));
            x.m.material = lit ? x.studio : x.part === "glass" ? hidden : shell;
            x.m.castShadow = false; // no shadows in the feature views
          }
          wordmark.visible = on.has("arm");
        };

        // Camera rig: orbit angles around the machine, eased between features.
        const target = new THREE.Vector3(0, -0.13, 0);
        let az = views[0].az, el = views[0].el;
        let from = { az, el }, to = { az, el }, t0 = 0, shown = -1;
        const DIST = dist;
        const place = (a: number, e: number) => {
          camera.position.set(Math.sin(a) * Math.cos(e) * DIST, target.y + Math.sin(e) * DIST, Math.cos(a) * Math.cos(e) * DIST);
          camera.lookAt(target);
          // Light stays fixed relative to the viewer, so the shadow moves as the machine turns.
          key.position.set(Math.sin(a + 0.9) * 4, groundY + 5, Math.cos(a + 0.9) * 4);
          rim.position.set(Math.sin(a + Math.PI - 0.6) * 4, groundY + 3.5, Math.cos(a + Math.PI - 0.6) * 4);
        };

        const size = () => {
          const w = stage.clientWidth, h = stage.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          // Pull back on tall, narrow frames so the whole machine stays in view.
          camera.zoom = Math.min(1, w / h / 1.45) * (window.innerWidth < 861 ? 0.82 : 1);
          if (shiftY) camera.setViewOffset(w, h, 0, shiftY * h, w, h);
          else camera.clearViewOffset();
          camera.updateProjectionMatrix();
        };
        size();
        const ro = new ResizeObserver(size);
        ro.observe(stage);

        // Drag to turn the machine (and tilt it a little). Picking another feature swings it back to
        // that feature's view. Vertical swipes on touch screens still scroll the page.
        let drag: { x: number; y: number; az: number; el: number } | null = null;
        let held = false; // the visitor has turned it since the last feature change: no idle drift
        canvas.style.touchAction = "pan-y";
        const onDown = (e: PointerEvent) => {
          drag = { x: e.clientX, y: e.clientY, az, el };
          held = true;
          canvas.setPointerCapture(e.pointerId);
          canvas.dataset.dragging = "true";
        };
        const onMove = (e: PointerEvent) => {
          if (!drag) return;
          az = drag.az - (e.clientX - drag.x) * 0.008;
          el = Math.min(1.1, Math.max(0.05, drag.el + (e.clientY - drag.y) * 0.004));
          from = to = { az, el };
        };
        const onUp = () => {
          drag = null;
          delete canvas.dataset.dragging;
        };
        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerup", onUp);
        canvas.addEventListener("pointercancel", onUp);

        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(stage);
        renderer.setAnimationLoop((now) => {
          if (!visible) return;
          if (want.current !== shown) {
            shown = want.current;
            highlight(shown);
            const v = views[shown];
            // Turn the short way round.
            let d = v.az - az;
            d = Math.atan2(Math.sin(d), Math.cos(d));
            from = { az, el };
            to = { az: az + d, el: v.el };
            t0 = now;
            held = false;
          }
          if (!drag) {
            const p = reduce ? 1 : Math.min(1, (now - t0) / DURATION);
            const s = ease(p);
            az = from.az + (to.az - from.az) * s;
            el = from.el + (to.el - from.el) * s;
          }
          // A slow drift keeps the scene alive between changes (until the visitor takes over).
          const drift = reduce || held ? 0 : Math.sin(now / 2600) * 0.06;
          place(az + drift, el);
          renderer.render(scene, camera);
        });
        setStatus("live");

        cleanup = () => {
          renderer.setAnimationLoop(null);
          canvas.removeEventListener("pointerdown", onDown);
          canvas.removeEventListener("pointermove", onMove);
          canvas.removeEventListener("pointerup", onUp);
          canvas.removeEventListener("pointercancel", onUp);
          ro.disconnect();
          io.disconnect();
          themeWatch.disconnect();
          env.dispose();
          pmrem.dispose();
          renderer.dispose();
        };
      } catch {
        if (!disposed) setStatus("error");
      }
    };

    // Load when the section is near, not with the page.
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          near.disconnect();
          start();
        }
      },
      { rootMargin: "400px 0px" },
    );
    near.observe(stage);
    return () => {
      disposed = true;
      near.disconnect();
      cleanup();
    };
  }, [views, dist, shiftY]);

  return (
    <div ref={stageRef} className="tech-model" data-live={status === "live"}>
      {status === "error"
        ? fallback.map((f, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={f.src + i} src={f.src} alt={i === active ? f.alt : ""} className="rotator-img is-render" data-active={i === active} />
          ))
        : null}
      <canvas ref={canvasRef} className="tech-model-canvas" aria-label={fallback[active]?.alt} role="img" />
    </div>
  );
}
