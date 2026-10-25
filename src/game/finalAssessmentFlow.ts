import {
  FINAL_BANK,
  HAZARDS,
  TYPES,
  selectExam,
  scoreAnswer,
  questionHints,
  shuffled,
  seededRandom,
  type FinalQuestion,
  type FinalAnswer,
} from "../data/finalAssessment.ts";
export interface ActivityRecord {
  answer: FinalAnswer;
  points: number;
  correct: number;
  total: number;
  practiceAnswer: FinalAnswer | null;
  practiceCorrect: number | null;
}
export interface FinalRecord {
  id: number;
  seed: number;
  bankVersion: string;
  total: number;
  byType: { type: (typeof TYPES)[number]; points: number; maximum: number }[];
  byHazard: {
    hazard: (typeof HAZARDS)[number];
    points: number;
    maximum: number;
  }[];
  questionIds: string[];
  answers: Record<string, ActivityRecord>;
}
/** One open in-memory session. First submissions count; optional corrections teach without farming points. */
export class FinalAssessmentFlow {
  open = false;
  phase: "intro" | "activity" | "result" = "intro";
  private questions: FinalQuestion[] = [];
  private records: Record<string, ActivityRecord> = {};
  private drafts: Record<string, FinalAnswer> = {};
  private hints: Record<string, number> = {};
  private completed: FinalRecord[] = [];
  private seed: number | null = null;
  index = 0;
  error = "";
  show() {
    this.open = true;
    this.error = "";
  }
  close() {
    this.open = false;
    this.error = "";
  }
  start(seed: number) {
    if (this.phase !== "intro") return;
    this.create(seed);
  }
  private create(seed: number) {
    const questions = selectExam(seed);
    this.questions = questions;
    this.seed = seed;
    this.index = 0;
    this.records = {};
    this.drafts = {};
    this.hints = {};
    this.phase = "activity";
    this.error = "";
  }
  retry(seed: number) {
    if (this.phase !== "result") return;
    if (seed === this.seed) seed = (seed + 1) >>> 0;
    this.create(seed);
  }
  saveDraft(answer: FinalAnswer) {
    if (this.phase !== "activity") return;
    const q = this.questions[this.index];
    if (!this.records[q.id]) this.drafts[q.id] = structuredClone(answer);
  }
  submit(answer: FinalAnswer) {
    if (this.phase !== "activity") return;
    const q = this.questions[this.index];
    if (this.records[q.id]) return;
    try {
      const result = scoreAnswer(q, answer);
      this.records[q.id] = {
        ...result,
        answer: structuredClone(answer),
        practiceAnswer: null,
        practiceCorrect: null,
      };
      this.error = "";
    } catch (e) {
      this.error = e instanceof Error ? e.message : "Yanıt kontrol edilemedi";
    }
  }
  practice(answer: FinalAnswer) {
    if (this.phase !== "activity") return;
    const q = this.questions[this.index],
      record = this.records[q.id];
    if (!record) return;
    try {
      const result = scoreAnswer(q, answer);
      record.practiceAnswer = structuredClone(answer);
      record.practiceCorrect = result.correct;
      this.error = "";
    } catch (e) {
      this.error = e instanceof Error ? e.message : "Kartları tamamla";
    }
  }
  hint() {
    if (this.phase === "activity") {
      const id = this.questions[this.index].id;
      this.hints[id] = Math.min(3, (this.hints[id] ?? 0) + 1);
    }
  }
  move(delta: number) {
    if (this.phase !== "activity") return;
    const next = this.index + delta;
    if (
      next < 0 ||
      next >= 15 ||
      (delta > 0 && !this.records[this.questions[this.index].id])
    )
      return;
    this.index = next;
    this.error = "";
  }
  finalize() {
    if (this.phase !== "activity" || Object.keys(this.records).length !== 15)
      return;
    const points = (filter: (q: FinalQuestion) => boolean) =>
      this.questions
        .filter(filter)
        .reduce((sum, q) => sum + this.records[q.id].points, 0);
    this.completed.push(
      structuredClone({
        id: this.completed.length + 1,
        seed: this.seed!,
        bankVersion: FINAL_BANK.version,
        total: points(() => true),
        byType: TYPES.map((type) => ({
          type,
          points: points((q) => q.type === type),
          maximum: 100,
        })),
        byHazard: HAZARDS.map((hazard) => ({
          hazard,
          points: points((q) => q.hazard === hazard),
          maximum: 60,
        })),
        questionIds: this.questions.map((q) => q.id),
        answers: this.records,
      }),
    );
    this.phase = "result";
    this.error = "";
  }
  snapshot() {
    const q = this.questions[this.index] ?? null,
      count = q ? (this.hints[q.id] ?? 0) : 0;
    return structuredClone({
      open: this.open,
      phase: this.phase,
      index: this.index,
      seed: this.seed,
      bankVersion: FINAL_BANK.version,
      question: q,
      questionIds: this.questions.map((q) => q.id),
      answered: Object.keys(this.records).length,
      record: q ? (this.records[q.id] ?? null) : null,
      draft: q ? (this.drafts[q.id] ?? null) : null,
      points: Object.values(this.records).reduce((sum, r) => sum + r.points, 0),
      hintLevel: count,
      hint: q && count ? questionHints(q)[count - 1] : null,
      error: this.error,
      cardOrder:
        q && q.type !== "true_false"
          ? shuffled(
              q.type === "matching"
                ? q.pairs.map((p) => p.id)
                : q.items.map((i) => i.id),
              seededRandom((this.seed! ^ this.index ^ 0x5bd1e995) >>> 0),
            )
          : [],
      attempts: this.completed.length,
      first: this.completed[0] ?? null,
      last: this.completed.at(-1) ?? null,
      best: this.completed.reduce<FinalRecord | null>(
        (best, r) => (!best || r.total > best.total ? r : best),
        null,
      ),
    });
  }
}
export function newExamSeed() {
  const value = new Uint32Array(1);
  globalThis.crypto.getRandomValues(value);
  return value[0];
}
export type FinalState = ReturnType<FinalAssessmentFlow["snapshot"]>;
