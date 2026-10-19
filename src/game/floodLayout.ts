import { FLOOD_RISKS } from "../data/flood.ts";
import type { Hotspot, Obstacle } from "./townHallData.ts";
export const FLOOD_WORLD = { width: 1920, height: 1280 };
export const FLOOD_WALK = { left: 500, right: 1200, top: 480, bottom: 1080 };
// Conservative staircase follows the diagonal planted setback. Both the low bank
// and the river remain inaccessible, in dry weather and in either simulation.
export const FLOOD_OBSTACLES: readonly Obstacle[] = [
  // Footprints on the raised plaza, clear of the observation approaches.
  { left: 690, right: 750, top: 730, bottom: 755 },
  { left: 820, right: 880, top: 600, bottom: 625 },
  { left: 595, right: 705, top: 560, bottom: 590 },
  { left: 499, right: 650, top: 900, bottom: 1081 },
  ...Array.from({ length: 7 }, (_, i) => {
    const top = 480 + i * 100;
    return {
      left: 1460 - 0.4 * (top + 100),
      right: 1921,
      top: top - 1,
      bottom: top + 101,
    };
  }),
];
export const FLOOD_HOTSPOTS: readonly Hotspot[] = [
  {
    id: "hasan",
    name: "Hasan Amca",
    x: 720,
    y: 790,
    radius: 80,
    hit: { x: 720, y: 680, width: 100, height: 160 },
  },
  ...FLOOD_RISKS.map((r) => ({
    id: r.id,
    name: r.name,
    x: r.approach.x,
    y: r.approach.y,
    radius: 75,
    hit: { x: r.x, y: r.y - 65, width: r.width, height: 150 },
  })),
  {
    id: "floodPreparedness",
    name: "Hazırlık panosu",
    x: 650,
    y: 650,
    radius: 75,
    hit: { x: 650, y: 520, width: 150, height: 155 },
  },
  {
    id: "floodExit",
    name: "Meydana dön",
    x: 780,
    y: 1060,
    radius: 70,
    hit: { x: 780, y: 1110, width: 140, height: 85 },
  },
];
