/*
|-----------------------------------------
| setting up Globe3d.tsx for the App
| @author: Toufiquer Rahman
|-----------------------------------------
*/

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { iconMap } from "@/components/all-icons/all-icons-jsx";

const Compass = iconMap.Navigation;

export interface CountryPoint {
  id: string;
  name: string;
  fullName: string;
  flag: string;
  lat: number;
  lng: number;
  color: string;
}

export const CITIES: Record<string, CountryPoint> = {
  BANGLADESH: {
    id: "BANGLADESH",
    name: "BANGLADESH",
    fullName: "Bangladesh (Dhaka)",
    flag: "🇧🇩",
    lat: 23.8103,
    lng: 90.4125,
    color: "#06b6d4", // Cyan
  },
  CANADA: {
    id: "CANADA",
    name: "CANADA",
    fullName: "Canada",
    flag: "🇨🇦",
    lat: 56.1304,
    lng: -106.3468,
    color: "#f59e0b", // Amber
  },
  USA: {
    id: "USA",
    name: "USA",
    fullName: "United States",
    flag: "🇺🇸",
    lat: 39.8283,
    lng: -98.5795,
    color: "#f59e0b",
  },
  UK: {
    id: "UK",
    name: "UK",
    fullName: "UK (London)",
    flag: "🇬🇧",
    lat: 51.5074,
    lng: -0.1278,
    color: "#f59e0b",
  },
  AUSTRALIA: {
    id: "AUSTRALIA",
    name: "AUSTRALIA",
    fullName: "Australia (Sydney)",
    flag: "🇦🇺",
    lat: -33.8688,
    lng: 151.2093,
    color: "#f59e0b",
  },
};

// Helper: Convert Lat/Lng to 3D Cartesian Coordinates on Sphere of radius R
function latLngToVector3(lat: number, lng: number, radius: number, alt: number = 0): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const r = radius + alt;

  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Helper: Create 3D Curved Arc Between 2 Lat/Lng Locations
function createFlightArc(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  radius: number,
): THREE.CubicBezierCurve3 {
  const vStart = latLngToVector3(start.lat, start.lng, radius);
  const vEnd = latLngToVector3(end.lat, end.lng, radius);

  // Distance between points
  const dist = vStart.distanceTo(vEnd);
  const midHeight = radius + Math.min(dist * 0.35, radius * 0.6);

  // Midpoint projected outwards
  const vMid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
  vMid.normalize().multiplyScalar(midHeight);

  // Control points for cubic Bezier
  const control1 = new THREE.Vector3().addVectors(vStart, vMid).multiplyScalar(0.5);
  control1.normalize().multiplyScalar(midHeight * 0.95);

  const control2 = new THREE.Vector3().addVectors(vEnd, vMid).multiplyScalar(0.5);
  control2.normalize().multiplyScalar(midHeight * 0.95);

  return new THREE.CubicBezierCurve3(vStart, control1, control2, vEnd);
}

// Helper: Create 3D Canvas Text Sprite for Country Name Badges
function createCountryLabelSprite(text: string, flag: string, isBD: boolean): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Background pill shape
    ctx.fillStyle = isBD ? "rgba(6, 182, 212, 0.92)" : "rgba(15, 23, 42, 0.90)";
    ctx.strokeStyle = isBD ? "#67e8f9" : "#f59e0b";
    ctx.lineWidth = 6;

    const x = 12,
      y = 12,
      w = 488,
      h = 104,
      r = 24;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw Country Flag & Name Text
    ctx.font = 'bold 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isBD ? "#020617" : "#fef3c7";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${flag} ${text}`, 256, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(3.6, 0.9, 1);
  return sprite;
}

// Helper: Create a detailed stylized 3D Airliner Plane
function createAirplaneMesh(): THREE.Group {
  const planeGroup = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.6,
    roughness: 0.2,
    emissive: 0x0f172a,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8, // Vibrant Cyan / Sky Blue
    emissive: 0x0284c7,
    emissiveIntensity: 0.8,
  });

  const engineMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.9,
    roughness: 0.1,
  });

  // Tail anchor offset: shift all geometries forward by +0.40 along Z
  // so local origin (0, 0, 0) is at the rear/tail of the aircraft.
  const TAIL_OFFSET_Z = 0.4;

  // Fuselage Body (Cylinder rotated so top +Y becomes +Z pointing forward to destination)
  const fuselageGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.8, 16);
  fuselageGeo.rotateX(Math.PI / 2); // Pointing forward along +Z
  const fuselage = new THREE.Mesh(fuselageGeo, bodyMat);
  fuselage.position.z = TAIL_OFFSET_Z;
  planeGroup.add(fuselage);

  // Nose Cone at front (+Z direction -> towards Destination)
  const noseGeo = new THREE.ConeGeometry(0.09, 0.28, 16);
  noseGeo.rotateX(Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, accentMat);
  nose.position.z = 0.54 + TAIL_OFFSET_Z; // Nose tip pointing towards +Z
  planeGroup.add(nose);

  // Main Swept Wings (swept back towards -Z tail direction)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.15);
  wingShape.lineTo(0.75, -0.15);
  wingShape.lineTo(0.75, -0.28);
  wingShape.lineTo(0, -0.08);
  wingShape.lineTo(-0.75, -0.28);
  wingShape.lineTo(-0.75, -0.15);
  wingShape.closePath();

  const extrudeSettings = {
    depth: 0.02,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.01,
    bevelThickness: 0.01,
  };
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
  wingGeo.rotateX(Math.PI / 2);
  const wings = new THREE.Mesh(wingGeo, bodyMat);
  wings.position.set(0, 0, 0.05 + TAIL_OFFSET_Z);
  planeGroup.add(wings);

  // Wingtip LED Lights
  const tipL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), accentMat);
  tipL.position.set(0.76, 0, -0.1 + TAIL_OFFSET_Z);
  planeGroup.add(tipL);

  const tipR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), accentMat);
  tipR.position.set(-0.76, 0, -0.1 + TAIL_OFFSET_Z);
  planeGroup.add(tipR);

  // Tail Wings (Horizontal Stabilizers at -Z = Bangladesh tail side)
  const tailWingShape = new THREE.Shape();
  tailWingShape.moveTo(0, 0.05);
  tailWingShape.lineTo(0.3, -0.1);
  tailWingShape.lineTo(0.3, -0.18);
  tailWingShape.lineTo(0, -0.08);
  tailWingShape.lineTo(-0.3, -0.18);
  tailWingShape.lineTo(-0.3, -0.1);
  tailWingShape.closePath();

  const tailWingGeo = new THREE.ExtrudeGeometry(tailWingShape, extrudeSettings);
  tailWingGeo.rotateX(Math.PI / 2);
  const tailWings = new THREE.Mesh(tailWingGeo, bodyMat);
  tailWings.position.set(0, 0, -0.32 + TAIL_OFFSET_Z);
  planeGroup.add(tailWings);

  // Vertical Tail Fin (at -Z = Bangladesh tail side)
  const finGeo = new THREE.BoxGeometry(0.02, 0.22, 0.16);
  const fin = new THREE.Mesh(finGeo, accentMat);
  fin.position.set(0, 0.12, -0.32 + TAIL_OFFSET_Z);
  planeGroup.add(fin);

  // Jet Engine Pods under wings
  const engineGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.22, 12);
  engineGeo.rotateX(Math.PI / 2);
  const engine1 = new THREE.Mesh(engineGeo, engineMat);
  engine1.position.set(0.24, -0.06, 0.05 + TAIL_OFFSET_Z);
  planeGroup.add(engine1);

  const engine2 = new THREE.Mesh(engineGeo, engineMat);
  engine2.position.set(-0.24, -0.06, 0.05 + TAIL_OFFSET_Z);
  planeGroup.add(engine2);

  // Scale up plane so it is clear and visible
  planeGroup.scale.set(0.72, 0.72, 0.72);

  return planeGroup;
}

// Helper: Create a highly detailed realistic 3D Satellite Mesh
function createSatelliteMesh(): { satGroup: THREE.Group; beaconMesh: THREE.Mesh } {
  const satGroup = new THREE.Group();

  // Materials
  const foilMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Gold thermal insulation foil
    metalness: 0.95,
    roughness: 0.15,
    emissive: 0x78350f,
    emissiveIntensity: 0.3,
  });

  const metallicMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0, // Titanium silver body
    metalness: 0.9,
    roughness: 0.2,
  });

  const solarPanelMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8, // Deep blue solar cells
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0x1e40af,
    emissiveIntensity: 0.4,
    side: THREE.DoubleSide,
  });

  const dishMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.85,
    roughness: 0.15,
  });

  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // Cyan LED status beacon
    emissive: 0x06b6d4,
    emissiveIntensity: 2.0,
  });

  // 1. Central Bus / Satellite Core Box
  const busGeo = new THREE.BoxGeometry(0.28, 0.28, 0.42);
  const bus = new THREE.Mesh(busGeo, foilMat);
  satGroup.add(bus);

  // Cylindrical Sensor Modules
  const capGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12);
  const capTop = new THREE.Mesh(capGeo, metallicMat);
  capTop.position.set(0, 0.17, 0);
  satGroup.add(capTop);

  // 2. Solar Panel Truss Arms & Solar Wings
  const armGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.28, 8);
  armGeo.rotateZ(Math.PI / 2);

  const armLeft = new THREE.Mesh(armGeo, metallicMat);
  armLeft.position.set(0.26, 0, 0);
  satGroup.add(armLeft);

  const armRight = new THREE.Mesh(armGeo, metallicMat);
  armRight.position.set(-0.26, 0, 0);
  satGroup.add(armRight);

  // Solar Wings (Left & Right)
  const panelGeo = new THREE.BoxGeometry(0.75, 0.01, 0.26);

  const panelLeft = new THREE.Mesh(panelGeo, solarPanelMat);
  panelLeft.position.set(0.72, 0, 0);
  satGroup.add(panelLeft);

  const panelRight = new THREE.Mesh(panelGeo, solarPanelMat);
  panelRight.position.set(-0.72, 0, 0);
  satGroup.add(panelRight);

  // Solar Panel Frame Accents
  const frameGeo = new THREE.BoxGeometry(0.77, 0.015, 0.02);
  const frameLeft = new THREE.Mesh(frameGeo, metallicMat);
  frameLeft.position.set(0.72, 0, 0.13);
  satGroup.add(frameLeft);

  const frameRight = new THREE.Mesh(frameGeo, metallicMat);
  frameRight.position.set(-0.72, 0, 0.13);
  satGroup.add(frameRight);

  // 3. Parabolic Communications Dish Antenna (Points down at Earth)
  const dishGeo = new THREE.SphereGeometry(0.16, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
  dishGeo.rotateX(-Math.PI / 2);
  const dish = new THREE.Mesh(dishGeo, dishMat);
  dish.position.set(0, -0.16, 0);
  satGroup.add(dish);

  // Antenna Feed Horn
  const feedGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8);
  feedGeo.rotateX(-Math.PI / 2);
  const feed = new THREE.Mesh(feedGeo, metallicMat);
  feed.position.set(0, -0.22, 0);
  satGroup.add(feed);

  // 4. Status LED Telemetry Beacon
  const beaconGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
  beaconMesh.position.set(0, 0.2, 0.22);
  satGroup.add(beaconMesh);

  // Scale Satellite
  satGroup.scale.set(0.6, 0.6, 0.6);

  return { satGroup, beaconMesh };
}

export interface PlaneControlState {
  id: string;
  name: string;
  destName: string;
  flag: string;
  mode: "live" | "manual";
  position: number;
  axisX: number;
  axisY: number;
  axisZ: number;
  altitude: number;
}

export interface PlaneKeyframe {
  pitch: number;
  yaw: number;
  roll: number;
  alt: number;
}

const PLANE_PROFILES: Record<number, { k5: PlaneKeyframe; k50: PlaneKeyframe; k95: PlaneKeyframe }> = {
  0: {
    k5: { pitch: -45, yaw: 1, roll: 0, alt: 0 },
    k50: { pitch: -45, yaw: 22, roll: 13, alt: 0.6 },
    k95: { pitch: -45, yaw: 30, roll: 13, alt: 0 },
  },
  1: {
    k5: { pitch: -45, yaw: -8, roll: -4, alt: 0 },
    k50: { pitch: -45, yaw: 14, roll: 8, alt: 0.8 },
    k95: { pitch: -45, yaw: 24, roll: 10, alt: 0 },
  },
  2: {
    k5: { pitch: -45, yaw: 6, roll: 3, alt: 0 },
    k50: { pitch: -45, yaw: 28, roll: 16, alt: 0.7 },
    k95: { pitch: -45, yaw: 36, roll: 18, alt: 0 },
  },
  3: {
    k5: { pitch: -45, yaw: -14, roll: -8, alt: 0 },
    k50: { pitch: -45, yaw: 10, roll: 6, alt: 0.9 },
    k95: { pitch: -45, yaw: 20, roll: 9, alt: 0 },
  },
};

export function getRouteAxisForProgress(progress: number, planeIdx: number = 0) {
  const p = Math.max(0, Math.min(1, progress));
  const idx = Math.abs(planeIdx) % 4;
  const profile = PLANE_PROFILES[idx] || PLANE_PROFILES[0];
  const { k5, k50, k95 } = profile;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  if (p <= 0.05) {
    const t = p / 0.05;
    return {
      pitch: Math.round(lerp(k5.pitch, k5.pitch, t)),
      yaw: Math.round(lerp(k5.yaw, k5.yaw, t)),
      roll: Math.round(lerp(0, k5.roll, t)),
      altitude: parseFloat(lerp(0, k5.alt, t).toFixed(2)),
    };
  } else if (p <= 0.5) {
    const t = (p - 0.05) / 0.45;
    return {
      pitch: Math.round(lerp(k5.pitch, k50.pitch, t)),
      yaw: Math.round(lerp(k5.yaw, k50.yaw, t)),
      roll: Math.round(lerp(k5.roll, k50.roll, t)),
      altitude: parseFloat(lerp(k5.alt, k50.alt, t).toFixed(2)),
    };
  } else if (p <= 0.95) {
    const t = (p - 0.5) / 0.45;
    return {
      pitch: Math.round(lerp(k50.pitch, k95.pitch, t)),
      yaw: Math.round(lerp(k50.yaw, k95.yaw, t)),
      roll: Math.round(lerp(k50.roll, k95.roll, t)),
      altitude: parseFloat(lerp(k50.alt, k95.alt, t).toFixed(2)),
    };
  } else {
    const t = (p - 0.95) / 0.05;
    return {
      pitch: Math.round(lerp(k95.pitch, k95.pitch, t)),
      yaw: Math.round(lerp(k95.yaw, k95.yaw, t)),
      roll: Math.round(lerp(k95.roll, 0, t)),
      altitude: parseFloat(lerp(k95.alt, 0, t).toFixed(2)),
    };
  }
}

const INITIAL_PLANES: PlaneControlState[] = [
  {
    id: "plane1",
    name: "Plane 1",
    destName: "Canada",
    flag: "🇨🇦",
    mode: "manual",
    position: 0.05,
    axisX: getRouteAxisForProgress(0.05, 0).pitch,
    axisY: getRouteAxisForProgress(0.05, 0).yaw,
    axisZ: getRouteAxisForProgress(0.05, 0).roll,
    altitude: getRouteAxisForProgress(0.05, 0).altitude,
  },
  {
    id: "plane2",
    name: "Plane 2",
    destName: "USA",
    flag: "🇺🇸",
    mode: "live",
    position: 0.35,
    axisX: getRouteAxisForProgress(0.35, 1).pitch,
    axisY: getRouteAxisForProgress(0.35, 1).yaw,
    axisZ: getRouteAxisForProgress(0.35, 1).roll,
    altitude: getRouteAxisForProgress(0.35, 1).altitude,
  },
  {
    id: "plane3",
    name: "Plane 3",
    destName: "UK",
    flag: "🇬🇧",
    mode: "live",
    position: 0.6,
    axisX: getRouteAxisForProgress(0.6, 2).pitch,
    axisY: getRouteAxisForProgress(0.6, 2).yaw,
    axisZ: getRouteAxisForProgress(0.6, 2).roll,
    altitude: getRouteAxisForProgress(0.6, 2).altitude,
  },
  {
    id: "plane4",
    name: "Plane 4",
    destName: "Australia",
    flag: "🇦🇺",
    mode: "live",
    position: 0.85,
    axisX: getRouteAxisForProgress(0.85, 3).pitch,
    axisY: getRouteAxisForProgress(0.85, 3).yaw,
    axisZ: getRouteAxisForProgress(0.85, 3).roll,
    altitude: getRouteAxisForProgress(0.85, 3).altitude,
  },
];

interface Globe3DProps {
  activeCountry: string | null;
  onSelectCountry: (id: string | null) => void;
  backgroundColor?: string;
  gridColor?: string;
  accentColor?: string;
  singleBackground?: boolean;
}

export default function Globe3D({
  activeCountry,
  backgroundColor = "#ffffff",
  gridColor = "#e5e7eb",
  accentColor = "#cf0a2c",
  singleBackground = false,
}: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate] = useState(true); // Internal smooth rotation
  const [rotationSpeed] = useState<number>((2 * Math.PI) / 60); // 1 full rotation in 60 seconds

  // 4 Plane Controllers state
  const [planes] = useState<PlaneControlState[]>(INITIAL_PLANES);
  const [selectedPlaneIdx] = useState<number>(0);
  const [viewUpperSide] = useState<boolean>(false);

  const autoRotateRef = useRef(autoRotate);
  const rotationSpeedRef = useRef(rotationSpeed);
  const planesRef = useRef<PlaneControlState[]>(planes);
  const selectedPlaneIdxRef = useRef<number>(selectedPlaneIdx);
  const viewUpperSideRef = useRef<boolean>(viewUpperSide);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    planesRef.current = planes;
  }, [planes]);

  useEffect(() => {
    selectedPlaneIdxRef.current = selectedPlaneIdx;
  }, [selectedPlaneIdx]);

  useEffect(() => {
    viewUpperSideRef.current = viewUpperSide;
  }, [viewUpperSide]);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Interaction State - Initial rotation places Bangladesh on middle-left side
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const initialY = -CITIES.BANGLADESH.lng * (Math.PI / 180) - Math.PI / 2 + 0.85;
  const targetRotationRef = useRef({ x: 0.25, y: initialY });
  const currentRotationRef = useRef({ x: 0.25, y: initialY });

  // Jet pulse plane mesh references for animating along 3D curves
  const jetPulsesRef = useRef<
    { curve: THREE.CubicBezierCurve3; mesh: THREE.Object3D; progress: number; speed: number }[]
  >([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const getCameraDistance = (screenWidth: number) => {
      if (screenWidth < 640) return 40;
      if (screenWidth < 1024) return 38;
      return 36;
    };

    const getCameraY = (screenWidth: number) => {
      if (screenWidth < 640) return -2.2;
      if (screenWidth < 1024) return -1;
      return 0;
    };

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, getCameraY(window.innerWidth), getCameraDistance(window.innerWidth));
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(20, 20, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 1.2);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    // 5. Globe Group (Rotatable)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const GLOBE_RADIUS = 8;

    // Earth Sphere Geometry & Textures
    const textureLoader = new THREE.TextureLoader();

    // High-res equirectangular NASA Blue Marble & planet textures
    const blueMarbleTexture = textureLoader.load("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");
    const specularMap = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg",
    );
    const normalMap = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg",
    );
    const cloudsTexture = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_2048.png",
    );

    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      map: blueMarbleTexture,
      specularMap: specularMap,
      specular: new THREE.Color(0x3388ff),
      shininess: 25,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      emissive: new THREE.Color(0x021526),
      emissiveIntensity: 0.15,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Drifting Real Cloud Layer
    const cloudsGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.018, 64, 64);
    const cloudsMat = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);

    // Inner & Outer Atmosphere Rayleigh Glow
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.12, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // Star field particles surrounding 3D globe
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 1200;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 200;
      starPositions[i + 1] = (Math.random() - 0.5) * 200;
      starPositions[i + 2] = (Math.random() - 0.5) * 200;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xcbd5e1, size: 0.6, transparent: true, opacity: 0.5 });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 6. Add Country 3D Markers & Arcs
    const bd = CITIES.BANGLADESH;
    const destinations = [CITIES.CANADA, CITIES.USA, CITIES.UK, CITIES.AUSTRALIA];

    // Marker Material
    const bdPos = latLngToVector3(bd.lat, bd.lng, GLOBE_RADIUS, 0.1);

    // Bangladesh Marker (Dhaka Star Pin)
    const bdPinGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const bdPinMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.5,
    });
    const bdPinMesh = new THREE.Mesh(bdPinGeo, bdPinMat);
    bdPinMesh.position.copy(bdPos);
    globeGroup.add(bdPinMesh);

    // Bangladesh Country Name Label Billboard
    const bdLabelPos = latLngToVector3(bd.lat, bd.lng, GLOBE_RADIUS, 0.8);
    const bdLabelSprite = createCountryLabelSprite("BANGLADESH", "🇧🇩", true);
    bdLabelSprite.position.copy(bdLabelPos);
    globeGroup.add(bdLabelSprite);

    // Add Pulsing Ring around Bangladesh
    const bdRingGeo = new THREE.RingGeometry(0.3, 0.6, 32);
    const bdRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const bdRingMesh = new THREE.Mesh(bdRingGeo, bdRingMat);
    bdRingMesh.position.copy(bdPos);
    bdRingMesh.lookAt(bdPos.clone().multiplyScalar(2));
    globeGroup.add(bdRingMesh);

    // Destination Markers, Country Labels & 3D Flight Arcs
    jetPulsesRef.current = [];

    destinations.forEach((dest, idx) => {
      const destPos = latLngToVector3(dest.lat, dest.lng, GLOBE_RADIUS, 0.1);

      // Destination Pin
      const destPinGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const destPinMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.2,
      });
      const destPinMesh = new THREE.Mesh(destPinGeo, destPinMat);
      destPinMesh.position.copy(destPos);
      globeGroup.add(destPinMesh);

      // Destination Country Name Label Billboard
      const destLabelPos = latLngToVector3(dest.lat, dest.lng, GLOBE_RADIUS, 0.75);
      const destLabelSprite = createCountryLabelSprite(dest.name, dest.flag, false);
      destLabelSprite.position.copy(destLabelPos);
      globeGroup.add(destLabelSprite);

      // Dotted 3D Arc Curve from Bangladesh to Destination
      const arcCurve = createFlightArc(bd, dest, GLOBE_RADIUS);
      const points = arcCurve.getPoints(100);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      // Dashed / Dotted Line for Flight Arc Path
      const arcMat = new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.35,
        gapSize: 0.2,
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.computeLineDistances(); // Required for THREE.LineDashedMaterial
      globeGroup.add(arcLine);

      // Traveling 3D Plane along Arc
      const airplaneMesh = createAirplaneMesh();
      globeGroup.add(airplaneMesh);

      jetPulsesRef.current.push({
        curve: arcCurve,
        mesh: airplaneMesh,
        progress: (idx * 0.25) % 1.0,
        speed: 0.05, // 1.0 progress in 20 seconds (0.05 per second)
      });
    });

    // 6.5 Add Realistic 3D Satellites in Orbit
    const satelliteConfigs = [
      {
        name: "ISS Space Station",
        radius: GLOBE_RADIUS * 1.35,
        inclination: 0.9,
        yRot: 0.5,
        speed: 0.16,
        initialAngle: 0.2,
        color: 0x38bdf8,
      },
      {
        name: "Landsat-9",
        radius: GLOBE_RADIUS * 1.45,
        inclination: 1.7,
        yRot: 2.1,
        speed: 0.12,
        initialAngle: 1.5,
        color: 0x06b6d4,
      },
      {
        name: "Starlink-Constellation",
        radius: GLOBE_RADIUS * 1.38,
        inclination: -0.6,
        yRot: 3.5,
        speed: 0.22,
        initialAngle: 3.1,
        color: 0x38bdf8,
      },
      {
        name: "GeoSat-Telecom",
        radius: GLOBE_RADIUS * 1.55,
        inclination: 0.25,
        yRot: 5.0,
        speed: 0.08,
        initialAngle: 4.2,
        color: 0xf59e0b,
      },
    ];

    const satellitesList: {
      mesh: THREE.Group;
      beaconMesh: THREE.Mesh;
      radius: number;
      inclination: number;
      yRot: number;
      speed: number;
      angle: number;
    }[] = [];

    satelliteConfigs.forEach((cfg) => {
      // Create Satellite Mesh (without visible orbital trajectory lines)
      const { satGroup, beaconMesh } = createSatelliteMesh();
      globeGroup.add(satGroup);

      satellitesList.push({
        mesh: satGroup,
        beaconMesh: beaconMesh,
        radius: cfg.radius,
        inclination: cfg.inclination,
        yRot: cfg.yRot,
        speed: cfg.speed,
        angle: cfg.initialAngle,
      });
    });

    // 7. Mouse / Touch Controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;

      // Clamp vertical pitch to prevent flipping
      targetRotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationRef.current.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const touch = event.touches[0];
      if (!touch) return;

      event.preventDefault();
      const deltaX = touch.clientX - previousMousePositionRef.current.x;
      const deltaY = touch.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.006;
      targetRotationRef.current.x += deltaY * 0.006;
      targetRotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationRef.current.x));
      previousMousePositionRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Zoom disabled
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    domElement.addEventListener("touchmove", onTouchMove, { passive: false });
    domElement.addEventListener("touchend", onTouchEnd);
    domElement.addEventListener("touchcancel", onTouchEnd);
    domElement.addEventListener("wheel", onWheel, { passive: false });

    // 8. Animation Loop
    const timer = new THREE.Timer();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      timer.update();
      const delta = timer.getDelta();

      // Auto Rotate if enabled and user isn't dragging (10s per 1 full rotation)
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += rotationSpeedRef.current * delta;
      }

      // Smooth Rotation Damping
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = currentRotationRef.current.x;
        globeGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Rotate real cloud layer slightly faster than globe for atmospheric movement
      if (cloudsMesh) {
        cloudsMesh.rotation.y += rotationSpeedRef.current * delta * 1.1;
      }

      // Animate Traveling 3D Airplanes along 3D Arcs
      jetPulsesRef.current.forEach((item, idx) => {
        item.progress = (item.progress + item.speed * delta) % 1.0;

        // Automatically calculate flight keyframes (Pitch, Yaw, Roll, Altitude) based on route percentage
        const routeAxis = getRouteAxisForProgress(item.progress, idx);

        const point = item.curve.getPoint(item.progress);
        const tangent = item.curve.getTangent(item.progress).normalize();

        // Apply Altitude offset along normal vector
        const normal = point.clone().normalize();
        const adjustedPos = point.clone();
        if (routeAxis.altitude !== 0) {
          adjustedPos.addScaledVector(normal, routeAxis.altitude);
        }

        item.mesh.position.copy(adjustedPos);

        // Orient airplane: head/nose (+Z) points to Destination, tail (-Z) points to Bangladesh, top (+Y) faces skyward
        item.mesh.up.copy(normal);
        const lookTarget = adjustedPos.clone().add(tangent);
        item.mesh.lookAt(lookTarget);

        // Apply Route Axis Rotations (Pitch X, Yaw Y, Roll Z)
        if (routeAxis.pitch !== 0) {
          item.mesh.rotateX(THREE.MathUtils.degToRad(routeAxis.pitch));
        }
        if (routeAxis.yaw !== 0) {
          item.mesh.rotateY(THREE.MathUtils.degToRad(routeAxis.yaw));
        }
        if (routeAxis.roll !== 0) {
          item.mesh.rotateZ(THREE.MathUtils.degToRad(routeAxis.roll));
        }
      });

      // View Upper Side Tracking: continuously align view directly above the currently selected airplane
      if (viewUpperSideRef.current && jetPulsesRef.current.length > 0) {
        const trackedPlane = jetPulsesRef.current[selectedPlaneIdxRef.current] || jetPulsesRef.current[0];
        if (trackedPlane) {
          const pos = trackedPlane.mesh.position.clone().normalize();
          const lat = Math.asin(pos.y);
          const lng = Math.atan2(pos.z, pos.x);

          targetRotationRef.current.x = lat;
          targetRotationRef.current.y = -lng + Math.PI / 2;
        }
      }

      // Animate Realistic 3D Satellites along Orbits
      const elapsedTime = timer.getElapsed();
      satellitesList.forEach((sat) => {
        sat.angle += sat.speed * delta;

        // Position along inclined 3D orbit
        const pos = new THREE.Vector3(sat.radius * Math.cos(sat.angle), 0, sat.radius * Math.sin(sat.angle));
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.inclination);
        pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), sat.yRot);

        sat.mesh.position.copy(pos);

        // Velocity tangent vector for orientation
        const tangent = new THREE.Vector3(-sat.radius * Math.sin(sat.angle), 0, sat.radius * Math.cos(sat.angle));
        tangent.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.inclination);
        tangent.applyAxisAngle(new THREE.Vector3(0, 1, 0), sat.yRot);
        tangent.normalize();

        const normal = pos.clone().normalize();
        sat.mesh.up.copy(normal);
        sat.mesh.lookAt(pos.clone().add(tangent));

        // Pulse Telemetry Beacon LED
        if (sat.beaconMesh && sat.beaconMesh.material) {
          (sat.beaconMesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
            1.2 + Math.sin(elapsedTime * 8.0 + sat.angle) * 1.8;
        }
      });

      // Slowly rotate background stars
      starField.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.position.y = getCameraY(window.innerWidth);
      cameraRef.current.position.z = getCameraDistance(window.innerWidth);
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("touchstart", onTouchStart);
      domElement.removeEventListener("touchmove", onTouchMove);
      domElement.removeEventListener("touchend", onTouchEnd);
      domElement.removeEventListener("touchcancel", onTouchEnd);
      domElement.removeEventListener("wheel", onWheel);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, []);

  // Update Camera Target when country is selected
  useEffect(() => {
    if (!activeCountry || !CITIES[activeCountry]) return;

    const city = CITIES[activeCountry];
    // Convert lat/lng to target rotation angles
    // Y rotation aligns longitude (negated and converted)
    let targetLngRad = -city.lng * (Math.PI / 180) - Math.PI / 2;
    if (activeCountry === "BANGLADESH") {
      targetLngRad += 0.85; // Position Bangladesh on middle-left
    }
    const targetLatRad = city.lat * (Math.PI / 180);

    targetRotationRef.current = {
      x: targetLatRad * 0.6,
      y: targetLngRad,
    };
  }, [activeCountry]);

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-visible"
      style={{
        backgroundColor: singleBackground ? "transparent" : backgroundColor,
        backgroundImage: singleBackground
          ? "none"
          : `radial-gradient(circle at 24% 44%, color-mix(in srgb, ${accentColor} 8%, transparent), transparent 42%), linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
        backgroundSize: singleBackground ? undefined : "auto, 48px 48px, 48px 48px",
      }}
    >
      {!singleBackground && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-32 bg-gradient-to-r from-transparent to-white lg:block"
        />
      )}
      {/* THREE.JS WebGL Canvas Container */}
      <div ref={containerRef} className="h-full w-full flex-1 cursor-grab touch-none active:cursor-grabbing" />

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
        {/* Navigation Helper Text */}
        <div className="flex items-center justify-between gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] text-slate-600 shadow-sm backdrop-blur-md lg:flex">
            <Compass className="h-3.5 w-3.5 text-[#cf0a2c]" />
            <span>Click & Drag to Orbit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
