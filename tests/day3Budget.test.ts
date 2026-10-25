import test from "node:test";
import assert from "node:assert/strict";
import {
  MEASURES,
  REGIONS,
  REASONS,
  STARTING_BUDGET,
  calculateRemainingBudget,
  toggleMeasure,
  buildRegionalOutcomes,
} from "../src/data/day3.ts";
import { Day3Flow } from "../src/game/day3Flow.ts";
import { GameSession } from "../src/game/story.ts";
function ready() {
  const f = new Day3Flow();
  f.enter();
  f.show();
  f.beginConsulting();
  for (const r of REGIONS) f.viewRegion(r.id);
  f.plan();
  return f;
}
function pick(f: Day3Flow, id: (typeof MEASURES)[number]["id"]) {
  f.choose(id);
  f.explain(REASONS[0]);
}
test("exact catalog: 1000 planning points, 12 distinct options, 1520 total, three per region", () => {
  assert.equal(STARTING_BUDGET, 1000);
  assert.equal(MEASURES.length, 12);
  assert.equal(new Set(MEASURES.map((m) => m.id)).size, 12);
  assert.equal(
    MEASURES.reduce((s, m) => s + m.cost, 0),
    1520,
  );
  for (const r of REGIONS)
    assert.equal(MEASURES.filter((m) => m.region === r.id).length, 3);
});
test("all 4096 subsets: exact unique cost, no overspend, immutable toggle and exact refund", () => {
  for (let mask = 0; mask < 4096; mask++) {
    const selected = MEASURES.filter((_, i) => mask & (1 << i)),
      ids = selected.map((m) => m.id),
      cost = selected.reduce((s, m) => s + m.cost, 0);
    if (cost > 1000) {
      assert.throws(() => calculateRemainingBudget(ids));
      continue;
    }
    assert.equal(calculateRemainingBudget(ids), 1000 - cost);
    assert.equal(calculateRemainingBudget([...ids, ...ids]), 1000 - cost);
    for (const m of MEASURES) {
      const before = [...ids],
        nextCost = cost + (ids.includes(m.id) ? -m.cost : m.cost);
      if (nextCost > 1000) assert.throws(() => toggleMeasure(ids, m.id));
      else {
        const next = toggleMeasure(ids, m.id);
        assert.equal(calculateRemainingBudget(next), 1000 - nextCost);
        assert.equal(new Set(next).size, next.length);
        assert.deepEqual(new Set(toggleMeasure(next, m.id)), new Set(ids));
      }
      assert.deepEqual(ids, before);
    }
  }
});
test("reject malformed amounts and unknown IDs rather than store negative or NaN balance", () => {
  assert.throws(() => calculateRemainingBudget(["bad"]));
  assert.throws(() => toggleMeasure([], "bad"));
  for (const cost of [-1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1])
    assert.throws(() =>
      calculateRemainingBudget([], [{ ...MEASURES[0], cost }]),
    );
  assert.throws(() => calculateRemainingBudget([], [MEASURES[0], MEASURES[0]]));
  assert.throws(() => buildRegionalOutcomes([], NaN));
  assert.throws(() => buildRegionalOutcomes([], -1));
});
test("regional adapter reuses existing models with identical scenario forcing before/after and qualitative tradeoffs", () => {
  const a = buildRegionalOutcomes(["F1", "W2", "L3", "A2"]);
  assert.equal(a.length, 4);
  for (const r of a) {
    assert.deepEqual(r.before.baselineScenario, r.after.baselineScenario);
    assert.equal(r.rows.length, 4);
    assert.match(r.residualRisk, /Risk sürer/);
  }
  const flood = a[0];
  assert.equal(flood.before.modelFrame.elapsed, flood.after.modelFrame.elapsed);
  assert.equal(
    (flood.before.modelFrame as any).riverLevel,
    (flood.after.modelFrame as any).riverLevel,
  );
  for (const r of a.slice(1))
    for (const key of Object.keys(r.before.baselineScenario))
      assert.deepEqual(
        (r.before.modelFrame as any)[key],
        (r.after.modelFrame as any)[key],
      );
  assert.notDeepEqual(
    buildRegionalOutcomes(["F1"])[0].rows,
    buildRegionalOutcomes(["F2"])[0].rows,
  );
  for (const r of buildRegionalOutcomes([])) {
    assert.deepEqual(r.before.modelFrame, r.after.modelFrame);
    assert.equal(r.selectedIds.length, 0);
  }
  const other = buildRegionalOutcomes(["A3"]);
  assert.deepEqual(other[0], buildRegionalOutcomes([])[0]);
});
test("consultation and reasons gate plans; two replans preserve revisions, refunds, reports and separate score", () => {
  const f = new Day3Flow();
  f.enter();
  f.show();
  f.plan();
  assert.equal(f.step, "briefing");
  f.beginConsulting();
  f.viewRegion("flood");
  f.plan();
  assert.equal(f.step, "consulting");
  for (const r of REGIONS) f.viewRegion(r.id);
  f.plan();
  f.choose("F1");
  f.apply();
  assert.equal(f.history.length, 0);
  assert.equal(f.remainingBudget, 1000);
  f.explain(REASONS[0]);
  assert.equal(f.remainingBudget, 870);
  for (let i = 0; i < 3; i++) {
    f.apply();
    assert.equal(f.step, "simulating");
    f.tick(3);
    f.compare();
    assert.equal(f.step, "simulating");
    f.summary();
    assert.equal(f.step, "comparing");
    if (i < 2) {
      f.replan();
      pick(f, i === 0 ? "A3" : "L3");
    }
  }
  assert.equal(f.history.length, 3);
  assert.deepEqual(f.history[0].selectedIds, ["F1"]);
  assert.equal(f.history[1].remainingBudget, 790);
  f.setFinalReason(REASONS[2]);
  f.finalize();
  assert.equal(f.step, "comparing");
  for (const r of REGIONS) f.viewRegion(r.id);
  f.finalize();
  f.finalize();
  assert.equal(f.completionCount, 1);
  assert.equal(f.step, "finalized");
  const s = f.snapshot();
  assert.equal(s.studentScore, null);
  assert.equal(s.outcomes.length, 4);
  s.history[0].selectedIds.length = 0;
  s.selectedIds.length = 0;
  assert.equal(f.selectedIds.length, 3);
  assert.equal(f.history[0].selectedIds.length, 1);
  f.close();
  f.enter();
  f.show();
  assert.equal(f.history.length, 3);
  f.replan();
  f.choose("F1");
  assert.equal(f.remainingBudget, 820);
});
test("unfunded or one-region plans are transparent, legal choices; zero plan is not fake success score", () => {
  const f = ready();
  f.apply();
  f.summary();
  for (const r of REGIONS) f.viewRegion(r.id);
  f.setFinalReason(REASONS[0]);
  f.finalize();
  assert.equal(f.remainingBudget, 1000);
  assert.equal(f.snapshot().missingRegions.length, 4);
  assert.equal(f.completionCount, 1);
  const g = ready();
  for (const id of ["F1", "F2", "F3"] as const) pick(g, id);
  g.apply();
  assert.equal(g.remainingBudget, 610);
  assert.equal(g.snapshot().missingRegions.length, 3);
});
test("day three unlock requires all four regions and only enters from city; preserves regional progress", () => {
  const s = new GameSession(
    {
      voice: false,
      text: false,
      music: false,
      ambience: false,
      effects: false,
      reducedMotion: true,
    },
    () => {},
  );
  for (const f of [s.flood, s.forest, s.landslide]) f.completionCount = 1;
  s.requestDay3();
  assert.equal(s.day3EntryRequested, false);
  s.avalanche.completionCount = 1;
  s.scene = "Flood";
  s.requestDay3();
  assert.equal(s.day3EntryRequested, false);
  s.scene = "CitySquare";
  s.requestDay3();
  assert.equal(s.day3EntryRequested, true);
  assert.equal(s.day3.active, true);
  assert.deepEqual(
    [s.flood, s.forest, s.landslide, s.avalanche].map((f) => f.completionCount),
    [1, 1, 1, 1],
  );
});

test("an unconfirmed reason cancels when browsing another region; visitor education has its own effect", () => {
  const f = ready();
  f.viewRegion("flood");
  f.choose("F1");
  f.viewRegion("avalanche");
  assert.equal(f.pending, null);
  assert.equal(f.remainingBudget, 1000);
  assert.deepEqual(f.selectedIds, []);
  const before = buildRegionalOutcomes(["A1"])[3],
    after = buildRegionalOutcomes(["A3"])[3];
  assert.notEqual(before.rows[3].after, after.rows[3].after);
  assert.match(after.rows[3].after, /kış güvenliği/);
});
