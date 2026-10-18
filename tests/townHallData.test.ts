import test from "node:test";
import assert from "node:assert/strict";
import {
  HALL_HOTSPOTS,
  HALL_OBSTACLES,
  HALL_WALK,
  closest,
  blocked,
} from "../src/game/townHallData.ts";
test("all five unique approaches are reachable, in bounds, and distinguishable", () => {
  assert.equal(new Set(HALL_HOTSPOTS.map((h) => h.id)).size, 5);
  for (const h of HALL_HOTSPOTS) {
    assert.equal(closest(h, HALL_HOTSPOTS)?.id, h.id);
    assert.equal(blocked(h.x, h.y, HALL_OBSTACLES), false);
    assert.ok(
      h.x >= HALL_WALK.left &&
        h.x <= HALL_WALK.right &&
        h.y >= HALL_WALK.top &&
        h.y <= HALL_WALK.bottom,
    );
  }
});
test("table and mayor footprints block walking while the front aisle stays clear", () => {
  assert.equal(blocked(720, 500, HALL_OBSTACLES), true);
  assert.equal(blocked(1000, 580, HALL_OBSTACLES), true);
  assert.equal(blocked(1180, 660, HALL_OBSTACLES), true);
  for (let x = HALL_WALK.left; x <= HALL_WALK.right; x += 20)
    assert.equal(blocked(x, 755, HALL_OBSTACLES), false);
});

test("front walls stop walking while the doorway remains open", () => {
  assert.equal(blocked(400, 820, HALL_OBSTACLES), true);
  assert.equal(blocked(1180, 820, HALL_OBSTACLES), true);
  assert.equal(blocked(760, 855, HALL_OBSTACLES), false);
});
