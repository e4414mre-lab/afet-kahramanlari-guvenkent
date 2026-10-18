import test from "node:test";
import assert from "node:assert/strict";
import { findWalkPath } from "../src/game/navigation.ts";
import {
  SCHOOL_WALK,
  DESKS,
  SCHOOL_OBSTACLES,
  schoolHotspots,
} from "../src/game/schoolLayout.ts";
import { RiskHunt } from "../src/game/riskHunt.ts";
import { RISKS } from "../src/game/classroomData.ts";
import { blocked } from "../src/game/townHallData.ts";
function walkable(
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const path = findWalkPath(start, end, SCHOOL_WALK, SCHOOL_OBSTACLES);
  assert.ok(path, JSON.stringify({ start, end }));
  let previous = start;
  for (const p of path) {
    for (let t = 0; t <= 1; t += 0.02)
      assert.equal(
        blocked(
          previous.x + (p.x - previous.x) * t,
          previous.y + (p.y - previous.y) * t,
          SCHOOL_OBSTACLES,
        ),
        false,
      );
    previous = p;
  }
  assert.deepEqual(path.at(-1), end);
}
test("all 10 classroom approaches and the door are reachable around real desk footprints", () => {
  const hotspots = schoolHotspots(new RiskHunt().snapshot());
  for (const h of hotspots) walkable({ x: 1000, y: 1075 }, h);
  for (const a of hotspots) for (const b of hotspots) walkable(a, b);
});
test("adult relocation keeps every object reachable and distinct", () => {
  const h = new RiskHunt();
  for (const r of RISKS) h.findings[r.id] = "verifiedFixed";
  const points = schoolHotspots(h.snapshot());
  assert.equal(new Set(points.map((p) => p.id)).size, 11);
  for (const p of points) walkable({ x: 1000, y: 1075 }, p);
});
test("no route goes through a desk or outside the classroom", () => {
  assert.equal(
    findWalkPath(
      { x: 1000, y: 1075 },
      { x: DESKS[0].x, y: DESKS[0].y - 15 },
      SCHOOL_WALK,
      SCHOOL_OBSTACLES,
    ),
    null,
  );
  assert.equal(
    findWalkPath(
      { x: 1000, y: 1075 },
      { x: 100, y: 700 },
      SCHOOL_WALK,
      SCHOOL_OBSTACLES,
    ),
    null,
  );
});
