import test from "node:test";
import assert from "node:assert/strict";
import { FloodFlow } from "../src/game/floodFlow.ts";
import {
  FLOOD_RISKS,
  RAIN_SCENARIO,
  floodForcing,
  simulationFrame,
} from "../src/data/flood.ts";
import {
  FLOOD_HOTSPOTS,
  FLOOD_WALK,
  FLOOD_OBSTACLES,
} from "../src/game/floodLayout.ts";
import { findWalkPath } from "../src/game/navigation.ts";
import { blocked } from "../src/game/townHallData.ts";
function prepared() {
  const f = new FloodFlow();
  f.enter();
  f.open("hasan");
  f.meet();
  for (const r of FLOOD_RISKS) {
    f.open(r.id);
    f.answer(r.choices[0].id);
    f.review();
  }
  f.open("preparedness");
  f.toggle("maintenance");
  f.toggle("warning");
  return f;
}
test("Hasan, three real findings, explanation and review gate preparedness; wrong/repeated answers do not advance", () => {
  const f = new FloodFlow();
  f.enter();
  f.open("floodDrain");
  assert.equal(f.openId, "hasan");
  f.meet();
  f.open("preparedness");
  assert.equal(f.openId, null);
  for (const r of FLOOD_RISKS) {
    f.open(r.id);
    assert.equal(f.risks[r.id], "identified");
    f.answer(r.choices[1].id);
    assert.equal(f.retry, true);
    assert.equal(f.risks[r.id], "identified");
    f.answer(r.choices[0].id);
    assert.equal(f.risks[r.id], "decisionMade");
    f.review();
    f.review();
  }
  assert.equal(f.investigated, 3);
  assert.equal(f.phase, "choosePreparedness");
  f.open("preparedness");
  f.unsafePreparation();
  assert.equal(f.retry, true);
  f.start();
  assert.equal(f.phase, "choosePreparedness");
  f.toggle("planning");
  f.start();
  assert.equal(f.phase, "beforeSimulation");
});
test("both simulations share every rainfall parameter and river level; preparedness cannot reopen flooded roads", () => {
  for (let t = 0; t <= 45; t += 0.5) {
    const before = simulationFrame("before", t, []),
      after = simulationFrame("after", t, [
        "maintenance",
        "warning",
        "planning",
      ]);
    assert.equal(before.riverLevel, after.riverLevel);
    assert.equal(before.intensity, after.intensity);
    assert.equal(before.elapsed, after.elapsed);
    assert.equal(after.passageClosed, true);
    assert.equal(after.bridgeClosed, true);
    assert.ok(after.localAccumulation <= before.localAccumulation);
  }
  const f = prepared();
  f.start();
  const scenario = f.snapshot().scenario;
  f.tick(44);
  f.next();
  assert.equal(f.phase, "beforeSimulation");
  f.tick(1);
  assert.deepEqual(f.snapshot().forcing, floodForcing(45));
  f.next();
  assert.deepEqual(f.snapshot().scenario, scenario);
  assert.deepEqual(scenario, RAIN_SCENARIO);
  assert.equal(f.elapsed, 0);
  f.summary();
  f.next();
  assert.equal(f.phase, "compare");
  f.next();
  f.next();
  assert.equal(f.completionCount, 1);
  f.replay();
  f.start();
  f.summary();
  f.next();
  f.summary();
  f.next();
  f.next();
  assert.equal(f.completionCount, 1);
  assert.deepEqual(
    JSON.parse(JSON.stringify(f.exportPreparation())),
    f.exportPreparation(),
  );
});
test("three hint levels stop at the concrete guidance, copies cannot mutate flow, every approach stays on safe land", () => {
  const f = new FloodFlow();
  assert.notEqual(f.hint(), f.hint());
  const third = f.hint();
  assert.equal(f.hint(), third);
  const copy = f.snapshot();
  copy.risks.floodDrain = "reviewed";
  assert.equal(f.investigated, 0);
  assert.ok(blocked(720, 745, FLOOD_OBSTACLES), "Hasan foot position");
  assert.ok(blocked(650, 575, FLOOD_OBSTACLES), "notice board base");
  assert.ok(blocked(560, 1030, FLOOD_OBSTACLES), "foreground garden wall");
  for (const h of FLOOD_HOTSPOTS)
    assert.ok(
      findWalkPath({ x: 780, y: 1000 }, h, FLOOD_WALK, FLOOD_OBSTACLES),
      h.id,
    );
  assert.equal(
    findWalkPath(
      { x: 780, y: 1000 },
      { x: 1550, y: 1030 },
      FLOOD_WALK,
      FLOOD_OBSTACLES,
    ),
    null,
  );
  for (let y = 480; y <= 1080; y += 20)
    assert.ok(blocked(1300, y, FLOOD_OBSTACLES));
});
test("second-day entry remains locked until an actual completed home drill", async () => {
  const { GameSession } = await import("../src/game/story.ts");
  const { HOME_ITEMS } = await import("../src/game/homeFlow.ts");
  const session = new GameSession(
    {
      voice: false,
      text: true,
      ambience: false,
      music: false,
      effects: false,
      reducedMotion: true,
    },
    () => {},
  );
  session.requestFlood();
  assert.equal(session.floodEntryRequested, false);
  assert.equal(session.status().floodUnlocked, false);
  const h = session.home;
  h.intro();
  for (const item of HOME_ITEMS) {
    h.open(item.id);
    h.answer(true);
    h.fix();
    h.close();
  }
  h.open("homeTable");
  h.start();
  h.decide("protect");
  h.tick(6);
  h.decide("evacuate");
  h.exit();
  h.gather();
  assert.equal(session.status().floodUnlocked, true);
  session.requestFlood();
  assert.equal(session.floodEntryRequested, true);
});
