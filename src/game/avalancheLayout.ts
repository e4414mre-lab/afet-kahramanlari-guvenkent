import { AVALANCHE_RISKS } from "../data/avalanche.ts";
import type { Hotspot, Obstacle } from "./townHallData.ts";
export const AVALANCHE_WORLD = { width: 1920, height: 1280 };
// All observation approaches are inside the fenced visitor clearing.
export const AVALANCHE_WALK = {
  left: 540,
  right: 1140,
  top: 470,
  bottom: 1010,
};
export const AVALANCHE_OBSTACLES: readonly Obstacle[] = [
  { left: 790, right: 850, top: 690, bottom: 720 }, // Zeynep's footprint
  { left: 550, right: 620, top: 480, bottom: 510 }, // information board
  { left: 685, right: 755, top: 520, bottom: 550 }, // visitors on safe ground
  ...Array.from({ length: 6 }, (_, i) => {
    const top = 470 + i * 100;
    return {
      left: Math.min(1130, 790 + (top - 470) * 0.82),
      right: 1921,
      top: top - 1,
      bottom: top + 101,
    };
  }),
];
export const AVALANCHE_HOTSPOTS: readonly Hotspot[] = [
  {
    id: "zeynep",
    name: "Çığ Uzmanı Zeynep",
    x: 820,
    y: 770,
    radius: 85,
    hit: { x: 820, y: 650, width: 100, height: 150 },
  },
  ...AVALANCHE_RISKS.map((r) => ({
    id: r.id,
    name: r.name,
    x: r.approach.x,
    y: r.approach.y,
    radius: 80,
    hit: { x: r.x, y: r.y - 60, width: r.width, height: 120 },
  })),
  {
    id: "avalanchePreparedness",
    name: "Uzman hazırlık panosu",
    x: 650,
    y: 570,
    radius: 80,
    hit: { x: 585, y: 460, width: 125, height: 140 },
  },
  {
    id: "avalancheExit",
    name: "Meydana dön",
    x: 900,
    y: 990,
    radius: 75,
    hit: { x: 900, y: 1050, width: 150, height: 80 },
  },
];
