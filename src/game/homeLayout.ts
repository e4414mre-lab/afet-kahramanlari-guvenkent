import { HOME_ITEMS, type HomeId, type HomeFlow } from "./homeFlow.ts";
import type { Hotspot, Obstacle } from "./townHallData.ts";
export const HOME_WORLD = { width: 1920, height: 1280 };
export const HOME_WALK = { left: 300, right: 1620, top: 600, bottom: 1100 };
export function homePlacement(id: HomeId, home: HomeFlow) {
  const o = HOME_ITEMS.find((o) => o.id === id)!;
  const p = { x: o.x, y: o.y, width: o.width, approach: { ...o.approach } };
  if (home.findings[id] === "fixed") {
    if (id === "homeSofa")
      return { ...p, x: 570, y: 800, approach: { x: 800, y: 820 } };
    if (id === "homeDecor")
      return { ...p, x: 570, y: 450, width: 145, approach: { x: 570, y: 660 } };
    if (id === "homeHeavy")
      return { ...p, x: 620, y: 570, approach: { x: 620, y: 660 } };
  }
  return p;
}
export function homeObstacles(home: HomeFlow): readonly Obstacle[] {
  return [
    { left: 1380, right: 1580, top: 575, bottom: 630 },
    { left: 950, right: 1170, top: 775, bottom: 845 },
    { left: 299, right: 800, top: 915, bottom: 1101 },
    { left: 1160, right: 1621, top: 915, bottom: 1101 },
    ...(home.findings.homeSofa === "fixed"
      ? [{ left: 440, right: 700, top: 750, bottom: 815 }]
      : [{ left: 790, right: 1000, top: 900, bottom: 980 }]),
  ];
}
export function homeHotspots(home: HomeFlow): Hotspot[] {
  return [
    ...HOME_ITEMS.map((o) => {
      const p = homePlacement(o.id, home);
      return {
        id: o.id,
        name: o.name,
        x: p.approach.x,
        y: p.approach.y,
        radius: 80,
        hit: { x: p.x, y: p.y - 65, width: p.width, height: 150 },
      };
    }),
    {
      id: "homeExit",
      name: home.evacuation ? "Buluşma alanına güvenli çıkış" : "Meydana dön",
      x: 1040,
      y: 1080,
      radius: 80,
      hit: { x: 1070, y: 1130, width: 130, height: 150 },
    },
  ];
}
export const HOME_ASSETS = [
  ["home-room", "room"],
  ["home-courtyard", "courtyard"],
  ["home-protect", "protect"],
  ...HOME_ITEMS.map((o) => ["home-" + o.asset, o.asset]),
];
