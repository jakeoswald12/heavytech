// Studio look for the HT-1 CAD mesh: gloss gold cab and powertrain, satin black chassis, bare-metal
// rollers and bolts, dark red glass tail lights, tinted glass, and the HEAVYTECH wordmark on the arm.
// Mirrors the "Studio" look in /lab/ht1 (public/lab/ht1/index.html), where the colours were tuned.
import type * as T from "three";

type Three = typeof import("three");

const PARTS = ["body", "cab", "pack", "dark", "sensor", "track", "bucket", "arm", "glass", "taillight", "metal", "fan"] as const;

export function studioMaterials(THREE: Three) {
  const phys = (o: T.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide, ...o });
  const yellow = phys({ color: 0x9a5d00, roughness: 0.38, clearcoat: 0.3, clearcoatRoughness: 0.25 });
  const black = phys({ color: 0x111111, roughness: 0.55, clearcoat: 0.18, clearcoatRoughness: 0.45 });
  return {
    cab: yellow,
    pack: yellow,
    body: black,
    arm: black,
    bucket: black,
    track: phys({ color: 0x121211, roughness: 0.9 }),
    dark: phys({ color: 0x141414, roughness: 0.75 }),
    fan: phys({ color: 0x121212, roughness: 0.6 }),
    sensor: phys({ color: 0x2a2a29, roughness: 0.25, metalness: 0.6 }),
    metal: phys({ color: 0xc9c9c6, metalness: 1, roughness: 0.22 }),
    taillight: phys({ color: 0x4a0208, emissive: 0x120001, roughness: 0.06, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.6 }),
    glass: phys({ color: 0x0b0f12, roughness: 0.04, transparent: true, opacity: 0.62, depthWrite: false }),
  } as Record<(typeof PARTS)[number], T.Material>;
}

/** Base part of a mesh ("cab", "pack", …). Meshes are named "<part>" or "<part>_<feature tag>". */
export function partOf(m: T.Object3D) {
  const name = `${m.name} ${m.parent?.name ?? ""}`.toLowerCase();
  return PARTS.find((p) => name.includes(p)) ?? "body";
}

/** Feature tag of a mesh ("controls", "pumps", …), or "" when it has none. */
export function tagOf(m: T.Object3D) {
  const name = (m.name || m.parent?.name || "").toLowerCase();
  const i = name.indexOf("_");
  return i < 0 ? "" : name.slice(i + 1).replace(/[^a-z]+.*$/, "");
}

/** Applies the studio materials (and smooth-but-creased normals) to every mesh in the loaded CAD model. */
export async function styleCadModel(THREE: Three, model: T.Object3D) {
  const { toCreasedNormals } = await import("three/examples/jsm/utils/BufferGeometryUtils.js");
  const mats = studioMaterials(THREE);
  model.traverse((o) => {
    const m = o as T.Mesh;
    if (!m.isMesh) return;
    const part = partOf(m);
    m.geometry = toCreasedNormals(m.geometry, THREE.MathUtils.degToRad(32));
    m.material = mats[part];
    m.castShadow = part !== "glass";
    m.receiveShadow = true;
  });
}

/** HEAVYTECH in the site's display font, laid flat on the outer face of the lift arm. */
export async function addArmWordmark(THREE: Three, model: T.Object3D, renderer: T.WebGLRenderer) {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-tomorrow").trim() || "sans-serif";
  const font = `700 200px ${family}`;
  try {
    await document.fonts.load(font, "HEAVYTECH");
  } catch {}
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = font;
  probe.letterSpacing = "6px";
  const cv = document.createElement("canvas");
  cv.width = Math.ceil(probe.measureText("HEAVYTECH").width) + 48;
  cv.height = 256;
  const g = cv.getContext("2d")!;
  g.font = font;
  g.letterSpacing = "6px";
  g.fillStyle = "#ffffff";
  g.textBaseline = "middle";
  g.textAlign = "center";
  g.fillText("HEAVYTECH", cv.width / 2, 136);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 0.19),
    new THREE.MeshPhysicalMaterial({
      map: tex, transparent: true, depthWrite: false, roughness: 0.4, clearcoat: 0.4, clearcoatRoughness: 0.25,
      polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
    }),
  );
  // The plate faces +x and climbs toward the rear; the text runs down toward the bucket.
  const U = new THREE.Vector3(0, -0.339, -0.941).normalize();
  const N = new THREE.Vector3(1, 0, 0);
  const V = new THREE.Vector3().crossVectors(N, U);
  mesh.matrixAutoUpdate = false;
  mesh.matrix.makeBasis(U, V, N).setPosition(0.8379, 0.8357, 0.4958);
  mesh.renderOrder = 2;
  model.add(mesh);
  return mesh;
}

/**
 * Ground for the hero: a shadow catcher plus a very faint pool of light, both transparent so the page
 * background shows through.
 */
export function makeGround(THREE: Three, radius: number, { pool: withPool = true } = {}) {
  const group = new THREE.Group();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(radius * 6, radius * 6), new THREE.ShadowMaterial({ opacity: 0.42 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.receiveShadow = true;
  group.add(shadow);

  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, "rgba(255,255,255,0.1)");
  r.addColorStop(0.5, "rgba(255,255,255,0.04)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2.2, radius * 1.8),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = 0.002;
  pool.renderOrder = -1;
  if (withPool) group.add(pool);
  return group;
}
