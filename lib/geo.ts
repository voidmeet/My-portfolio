import { locations } from "./data";

/**
 * Simplified outline of Gujarat (lon, lat), clockwise from the Kutch coast.
 * It only drives a stylised dot-matrix, so ~45 vertices is plenty.
 */
const GUJARAT: [number, number][] = [
  [68.15, 23.65], [68.6, 24.25], [69.4, 24.3], [70.0, 24.6], [70.6, 24.4],
  [71.1, 24.65], [71.6, 24.6], [72.2, 24.6], [72.8, 24.35], [73.4, 24.1],
  [73.6, 23.6], [74.0, 23.4], [74.3, 22.9], [74.1, 22.4], [73.9, 21.9],
  [73.8, 21.6], [73.9, 21.2], [73.5, 20.7], [73.2, 20.2], [72.85, 20.2],
  [72.75, 20.7], [72.65, 21.1], [72.55, 21.7], [72.6, 22.2], [72.35, 22.3],
  [72.1, 21.9], [72.15, 21.5], [71.9, 21.1], [71.3, 20.8], [70.9, 20.7],
  [70.4, 20.85], [69.9, 21.3], [69.55, 21.65], [69.1, 22.2], [68.95, 22.4],
  [69.3, 22.45], [69.8, 22.4], [70.3, 22.75], [70.45, 23.0], [70.1, 23.02],
  [69.7, 22.8], [69.2, 22.85], [68.75, 23.05], [68.4, 23.4],
];

const BOUNDS = { minLon: 67.9, maxLon: 74.6, minLat: 19.9, maxLat: 24.9 };
const LAT0 = 22.4;
const K = Math.cos((LAT0 * Math.PI) / 180);

export const MAP_WIDTH = (BOUNDS.maxLon - BOUNDS.minLon) * K * 100;
export const MAP_HEIGHT = (BOUNDS.maxLat - BOUNDS.minLat) * 100;

/** Equirectangular projection with a cosine correction — accurate enough at this scale. */
export function project(lon: number, lat: number) {
  return {
    x: (lon - BOUNDS.minLon) * K * 100,
    y: (BOUNDS.maxLat - lat) * 100,
  };
}

function inside(lon: number, lat: number) {
  let hit = false;
  for (let i = 0, j = GUJARAT.length - 1; i < GUJARAT.length; j = i++) {
    const [xi, yi] = GUJARAT[i];
    const [xj, yj] = GUJARAT[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

export interface MapDot {
  x: number;
  y: number;
  /** 0..1 proximity to the two operational cities. */
  heat: number;
}

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

export const cityPoints = {
  rajkot: project(locations.rajkot.lon, locations.rajkot.lat),
  ahmedabad: project(locations.ahmedabad.lon, locations.ahmedabad.lat),
};

export const mapDots: MapDot[] = (() => {
  const dots: MapDot[] = [];
  const step = 0.105;
  for (let lat = BOUNDS.minLat; lat <= BOUNDS.maxLat; lat += step) {
    // offset alternate rows for a hex-like matrix
    const row = Math.round((lat - BOUNDS.minLat) / step);
    for (let lon = BOUNDS.minLon + (row % 2 ? step / 2 : 0); lon <= BOUNDS.maxLon; lon += step / K) {
      if (!inside(lon, lat)) continue;
      const p = project(lon, lat);
      const d = Math.min(distance(p, cityPoints.rajkot), distance(p, cityPoints.ahmedabad));
      dots.push({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), heat: +Math.max(0, 1 - d / 120).toFixed(3) });
    }
  }
  return dots;
})();

export const outlinePath =
  GUJARAT.map(([lon, lat], i) => {
    const p = project(lon, lat);
    return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(" ") + " Z";

/** Graticule lines every whole degree inside the bounds. */
export const graticule = {
  lats: [20, 21, 22, 23, 24].map((lat) => ({ lat, y: project(BOUNDS.minLon, lat).y })),
  lons: [68, 69, 70, 71, 72, 73, 74].map((lon) => ({ lon, x: project(lon, BOUNDS.minLat).x })),
};

/** Curved link between the two cities (quadratic Bézier lifted to the north). */
export const linkPath = (() => {
  const a = cityPoints.rajkot;
  const b = cityPoints.ahmedabad;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 70;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
})();
