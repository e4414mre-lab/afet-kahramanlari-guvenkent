import test from "node:test";
import assert from "node:assert/strict";
import { HomeFlow, HOME_ITEMS } from "../src/game/homeFlow.ts";
import {
  homeHotspots,
  homeObstacles,
  HOME_WALK,
} from "../src/game/homeLayout.ts";
import { blocked } from "../src/game/townHallData.ts";
import { findWalkPath } from "../src/game/navigation.ts";
function ready() {
  const h = new HomeFlow();
  h.intro();
  for (const o of HOME_ITEMS) {
    h.open(o.id);
    h.answer(true);
    h.fix();
    h.close();
  }
  return h;
}
test("four home risks and two safe objects are distinct, adult-only and gated", () => {
  const h = new HomeFlow();
  h.start();
  h.decide("protect");
  h.gather();
  assert.equal(h.phase, "homeIntro");
  h.intro();
  for (const o of HOME_ITEMS) {
    h.open(o.id);
    h.answer(false);
    assert.equal(h.findings[o.id], "unseen");
    h.answer(true);
    if (o.risk) {
      assert.equal(h.findings[o.id], "reported");
      h.fix();
    }
    assert.equal(h.findings[o.id], "fixed");
    h.close();
  }
  assert.equal(h.phase, "drillReady");
  assert.equal(h.snapshot().risks, 4);
  assert.equal(h.snapshot().safe, 2);
});
test("wrong drill choices never move or authorize evacuation; protection precedes elapsed shaking", () => {
  const h = ready();
  h.open("homeTable");
  h.start();
  for (const id of ["window", "stairs", "lift"] as const) {
    h.decide(id);
    assert.equal(h.retry, true);
    assert.equal(h.protected, false);
    assert.equal(h.exit(), null);
  }
  h.tick(30);
  assert.equal(h.phase, "shaking");
  h.decide("protect");
  h.tick(5.9);
  assert.equal(h.phase, "shaking");
  assert.equal(h.exit(), null);
  h.tick(0.1);
  assert.equal(h.phase, "afterShaking");
  h.decide("return");
  assert.equal(h.evacuation, false);
  h.decide("evacuate");
  assert.equal(h.exit(), "gathering");
  h.gather();
  assert.equal(h.completionCount, 1);
  h.replay();
  h.open("homeTable");
  h.start();
  h.decide("protect");
  h.tick(6);
  h.decide("evacuate");
  h.exit();
  h.gather();
  assert.equal(h.completionCount, 1);
});
test("all home interactions remain reachable before and after adult furniture movement", () => {
  for (const h of [new HomeFlow(), ready()])
    for (const point of homeHotspots(h))
      assert.ok(
        findWalkPath({ x: 1040, y: 1080 }, point, HOME_WALK, homeObstacles(h)),
        point.id,
      );
});

test("the full entrance aisle is clear before and after the adult sofa adjustment", () => {
  for (const home of [new HomeFlow(), ready()]) {
    for (let x = 850; x <= 1120; x += 15)
      for (let y = 870; y <= 1100; y += 10)
        assert.equal(blocked(x, y, homeObstacles(home)), false, `${x},${y}`);
  }
});
