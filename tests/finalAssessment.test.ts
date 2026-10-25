import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  FINAL_BANK,
  HAZARDS,
  TYPES,
  validateBank,
  selectExam,
  scoreAnswer,
  questionHints,
  type FinalQuestion,
  type FinalAnswer,
} from "../src/data/finalAssessment.ts";
import { FinalAssessmentFlow } from "../src/game/finalAssessmentFlow.ts";
import { GameSession } from "../src/game/story.ts";
import { DEFAULT_SETTINGS } from "../src/lib/settings.ts";
const correct = (q: FinalQuestion): FinalAnswer =>
  q.type === "true_false"
    ? q.correct
    : q.type === "matching"
      ? Object.fromEntries(q.pairs.map((p) => [p.id, p.id]))
      : Object.fromEntries(q.items.map((i) => [i.id, i.correctZone]));
function finish(f: FinalAssessmentFlow, wrong = false) {
  for (let i = 0; i < 15; i++) {
    const q = f.snapshot().question!;
    let a = correct(q);
    if (wrong) {
      if (q.type === "true_false") a = !q.correct;
      else if (q.type === "matching")
        a = Object.fromEntries(
          q.pairs.map((p, j) => [p.id, q.pairs[(j + 1) % 3].id]),
        );
      else
        a = Object.fromEntries(
          q.items.map((t) => [
            t.id,
            q.zones.find((z) => z.id !== t.correctZone)!.id,
          ]),
        );
    }
    f.submit(a);
    f.move(1);
  }
  f.finalize();
}
test("60 authored records keep original IDs and group metadata; v1.1 has actual unique situation/action pairs and specific feedback", () => {
  const original = JSON.parse(
    readFileSync(
      new URL("../docs/data/final-question-bank-v1.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(FINAL_BANK.version, "1.1.0");
  assert.deepEqual(
    FINAL_BANK.questions.map((q) => [
      q.id,
      q.type,
      q.hazard,
      q.difficulty,
      q.points,
    ]),
    original.questions.map((q: FinalQuestion) => [
      q.id,
      q.type,
      q.hazard,
      q.difficulty,
      q.points,
    ]),
  );
  for (const q of FINAL_BANK.questions) {
    assert.ok(q.explanation.length > 50);
    assert.equal(questionHints(q).length, 3);
    if (q.type === "matching") {
      assert.ok(
        q.pairs.every(
          (p) =>
            !["Durum", "Güvenli yanıt", "Kaçınılacak davranış"].includes(
              p.left,
            ),
        ),
      );
      assert.equal(new Set(q.pairs.map((p) => p.right)).size, 3);
    }
  }
});
test("runtime schema rejects malformed JSON, duplicate IDs, group/difficulty/points errors and invalid matching/drop targets", () => {
  for (const bad of [null, [], {}, "bank"])
    assert.throws(() => validateBank(bad));
  for (const mutate of [
    (b: any) => b.questions.pop(),
    (b: any) => (b.questions[0].id = b.questions[1].id),
    (b: any) => (b.questions[0].points = 300),
    (b: any) => (b.questions[0].difficulty = "medium"),
    (b: any) => (b.questions[0].correct = "true"),
    (b: any) => (b.questions[4].pairs[0].left = ""),
    (b: any) => (b.questions[4].pairs[1].id = "p1"),
    (b: any) => (b.questions[8].items[0].correctZone = "absent"),
    (b: any) => (b.questions[8].zones[1].label = b.questions[8].zones[0].label),
  ]) {
    const b = structuredClone(FINAL_BANK);
    mutate(b);
    assert.throws(() => validateBank(b));
  }
});
test("10000 seeds satisfy feasible 5/6/4 and all fifteen hazard/type groups exactly once, reproducibly; all pool entries reachable", () => {
  const reached = new Set<string>(),
    orders = new Set<string>();
  for (let seed = 0; seed < 10000; seed++) {
    const exam = selectExam(seed);
    assert.equal(exam.length, 15);
    assert.equal(new Set(exam.map((q) => q.id)).size, 15);
    for (const h of HAZARDS)
      for (const t of TYPES)
        assert.equal(
          exam.filter((q) => q.hazard === h && q.type === t).length,
          1,
        );
    assert.deepEqual(
      ["easy", "medium", "hard"].map(
        (d) => exam.filter((q) => q.difficulty === d).length,
      ),
      [5, 6, 4],
    );
    exam.forEach((q) => reached.add(q.id));
    orders.add(exam.map((q) => q.id).join(","));
    if (seed < 100) assert.deepEqual(exam, selectExam(seed));
  }
  assert.equal(reached.size, 60);
  assert.ok(orders.size > 9900);
  assert.throws(() => selectExam(-1));
  assert.throws(() => selectExam(NaN));
  assert.throws(() => selectExam(1.5));
  const missing = structuredClone(FINAL_BANK);
  missing.questions = [];
  assert.throws(() => selectExam(0, missing));
});
test("all 60 answers score exactly20, incomplete/extra/invalid answers rejected; matching 0/1/3 pairs and drop 0/1/2 use rounding once", () => {
  for (const q of FINAL_BANK.questions) {
    assert.equal(scoreAnswer(q, correct(q)).points, 20);
    assert.throws(() => scoreAnswer(q, {}));
    if (q.type === "true_false") {
      assert.equal(scoreAnswer(q, !q.correct).points, 0);
    } else {
      assert.throws(() =>
        scoreAnswer(q, {
          ...(correct(q) as Record<string, string>),
          foreign: "p1",
        }),
      );
      if (q.type === "matching") {
        assert.equal(
          scoreAnswer(q, { p1: "p1", p2: "p3", p3: "p2" }).points,
          7,
        );
        assert.equal(
          scoreAnswer(q, { p1: "p2", p2: "p3", p3: "p1" }).points,
          0,
        );
        assert.throws(() => scoreAnswer(q, { p1: "p1", p2: "p1", p3: "p1" }));
      } else {
        const a = correct(q) as Record<string, string>;
        assert.equal(
          scoreAnswer(q, { ...a, i2: q.zones.find((z) => z.id !== a.i2)!.id })
            .points,
          10,
        );
        assert.equal(
          scoreAnswer(
            q,
            Object.fromEntries(
              q.items.map((i) => [
                i.id,
                q.zones.find((z) => z.id !== i.correctZone)!.id,
              ]),
            ),
          ).points,
          0,
        );
      }
    }
  }
});
test("first response locks score; practice, repeated submits, navigation, close/reopen and snapshot mutation cannot farm points or lose seed", () => {
  const f = new FinalAssessmentFlow();
  f.show();
  f.start(42);
  const before = f.snapshot();
  f.submit({});
  assert.equal(f.snapshot().answered, 0);
  f.move(1);
  assert.equal(f.index, 0);
  f.finalize();
  assert.equal(f.snapshot().attempts, 0);
  const q = f.snapshot().question!;
  f.submit(correct(q));
  f.submit(correct(q));
  assert.equal(f.snapshot().points, 20);
  f.practice(correct(q));
  assert.equal(f.snapshot().points, 20);
  f.hint();
  f.hint();
  f.hint();
  f.hint();
  assert.equal(f.snapshot().hintLevel, 3);
  f.close();
  f.show();
  assert.equal(f.snapshot().seed, 42);
  assert.equal(f.snapshot().answered, 1);
  assert.deepEqual(f.snapshot().questionIds, before.questionIds);
  const stolen = f.snapshot();
  stolen.record!.points = 300;
  stolen.questionIds.length = 0;
  assert.equal(f.snapshot().points, 20);
  assert.equal(f.snapshot().questionIds.length, 15);
  finish(f);
  assert.equal(f.snapshot().last!.total, 300);
  f.finalize();
  assert.equal(f.snapshot().attempts, 1);
  assert.equal(
    f.snapshot().last!.byType.reduce((s, r) => s + r.points, 0),
    300,
  );
  assert.equal(
    f.snapshot().last!.byHazard.reduce((s, r) => s + r.points, 0),
    300,
  );
});
test("wrong/partial answers never block completion; first last best survive repeated fresh exams without cumulative rewards", () => {
  const f = new FinalAssessmentFlow();
  f.start(7);
  finish(f, true);
  assert.equal(f.snapshot().last!.total, 0);
  assert.equal(f.snapshot().phase, "result");
  f.retry(7);
  assert.notEqual(f.snapshot().seed, 7);
  assert.equal(f.snapshot().points, 0);
  finish(f);
  assert.equal(f.snapshot().first!.total, 0);
  assert.equal(f.snapshot().last!.total, 300);
  assert.equal(f.snapshot().best!.total, 300);
  f.retry(99);
  finish(f, true);
  assert.equal(f.snapshot().attempts, 3);
  assert.equal(f.snapshot().last!.total, 0);
  assert.equal(f.snapshot().best!.total, 300);
  assert.equal(f.snapshot().first!.total, 0);
});
test("municipal report gates entry, budget stays separate, safe return preserves report and unfinished assessment", () => {
  const s = new GameSession(DEFAULT_SETTINGS, () => {});
  s.requestFinalAssessment();
  assert.equal(s.finalAssessment.open, false);
  s.scene = "TownHall";
  s.day3.completionCount = 1;
  s.requestFinalAssessment();
  assert.equal(s.finalAssessment.open, false);
  s.day3.step = "finalized";
  s.day3.active = true;
  s.requestFinalAssessment();
  assert.equal(s.finalAssessment.open, true);
  assert.equal(s.day3.open, false);
  // The game now uses an asynchronous server adapter, never a client answer key.
  // Scoring/resume are exercised through the practice HTTP and real PostgreSQL tests.
  s.closeFinalAssessment();
  assert.equal(s.day3.open, true);
  s.requestFinalAssessment();
  assert.equal(s.finalAssessment.snapshot().points, 0);
  assert.equal(s.finalAssessment.snapshot().phase, "intro");
  assert.equal(s.day3.remainingBudget, 1000);
  assert.equal(s.day3.snapshot().studentScore, null);
});

test("unfinished draft survives safe return without submitting or changing selection", () => {
 const f=new FinalAssessmentFlow();f.start(44);const draft=correct(f.snapshot().question!);f.saveDraft(draft);f.close();f.show();assert.deepEqual(f.snapshot().draft,draft);assert.equal(f.snapshot().answered,0);assert.equal(f.snapshot().points,0);assert.equal(f.snapshot().seed,44);
});
