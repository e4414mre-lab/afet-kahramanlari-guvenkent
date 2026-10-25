import type {
  FinalAnswer,
  PublicQuestion,
} from "../data/assessmentPresentation";
import type { ActivityRecord } from "./finalAssessmentFlow";
import {
  currentStudent,
  studentApi,
  type AttemptResult,
} from "../lib/classroom.ts";
export interface RemoteFinalState {
  open: boolean;
  phase: "intro" | "activity" | "result";
  index: number;
  seed: number | string | null;
  bankVersion: string;
  question: PublicQuestion | null;
  questionIds: string[];
  answered: number;
  record: ActivityRecord | null;
  draft: FinalAnswer | null;
  points: number;
  hintLevel: number;
  hint: string | null;
  error: string;
  cardOrder: string[];
  attempts: number;
  first: AttemptResult | null;
  last: AttemptResult | null;
  best: AttemptResult | null;
  busy: boolean;
  source: "class-server" | "practice-server";
}
export class RemoteFinalFlow {
  private state: RemoteFinalState = {
    open: false,
    phase: "intro",
    index: 0,
    seed: null,
    bankVersion: "1.1.0",
    question: null,
    questionIds: [],
    answered: 0,
    record: null,
    draft: null,
    points: 0,
    hintLevel: 0,
    hint: null,
    error: "",
    cardOrder: [],
    attempts: 0,
    first: null,
    last: null,
    best: null,
    busy: false,
    source: currentStudent() ? "class-server" : "practice-server",
  };
  private token = "";
  private studentId = currentStudent()?.studentId;
  private attempt: any = null;
  private drafts: Record<string, FinalAnswer> = {};
  private keys: Record<string, string> = {};
  private practiceRecords: Record<
    string,
    { practiceAnswer: FinalAnswer; practiceCorrect: number }
  > = {};
  private changed: () => void;
  constructor(changed: () => void) {
    this.changed = changed;
  }
  get open() {
    return this.state.open;
  }
  show() {
    this.state.open = true;
    this.state.error = "";
  }
  close() {
    this.state.open = false;
  }
  snapshot() {
    return structuredClone(this.state);
  }
  private async run(action: string, extra: Record<string, unknown> = {}) {
    if (this.state.busy) return;
    this.state.busy = true;
    this.state.error = "";
    this.changed();
    try {
      if (this.state.source === "class-server")
        await this.classAction(action, extra);
      else {
        const send = async (action: string) => {
          const r = await fetch("/api/guvenkent-practice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(this.token ? { "X-Practice-Session": this.token } : {}),
            },
            body: JSON.stringify({ action, ...extra }),
            signal: AbortSignal.timeout(15000),
            cache: "no-store",
          });
          const data = await r
            .json()
            .catch(() => ({
              error:
                "Alıştırma sunucusu bağlı değil. Sınıf puanı kaydedilmedi.",
            }));
          if (!r.ok)
            throw Error(data.error || "Alıştırma sunucusu kullanılamıyor");
          this.token = data.token;
          const open = this.state.open;
          this.state = {
            ...data.state,
            open,
            busy: true,
            source: "practice-server",
          };
          this.restoreDraft();
        };
        if (!this.token) await send("connect");
        await send(action);
      }
    } catch (e) {
      this.state.error =
        e instanceof Error
          ? e.message
          : "Bağlantı kurulamadı; ilerleme korunuyor. Tekrar bağlan.";
    } finally {
      this.state.busy = false;
      this.changed();
    }
  }
  private restoreDraft() {
    const id = this.state.question?.id;
    this.state.draft = id ? (this.drafts[id] ?? null) : null;
  }
  private applyAttempt(data: any) {
    this.attempt = data;
    const q = data.questions[this.state.index] as PublicQuestion;
    this.state = {
      ...this.state,
      phase: data.status === "completed" ? "result" : "activity",
      question: q,
      questionIds: data.questionIds,
      answered: Object.keys(data.records).length,
      record: data.records[q.id] ?? null,
      points: Object.values(data.records).reduce(
        (s: number, r: any) => s + r.points,
        0,
      ),
      bankVersion: data.bankVersion,
      cardOrder:
        q.type === "matching"
          ? q.targets.map((t) => t.id)
          : q.type === "drag_drop"
            ? q.items.map((i) => i.id)
            : [],
      seed: data.attemptId,
    };
    // A completed response is authoritative even if the following history call drops.
    if (data.status === 'completed' && data.result) {
      this.state.last = data.result;
      this.state.first ??= data.result;
      if (!this.state.best || data.result.total > this.state.best.total) this.state.best = data.result;
    }
    if (this.practiceRecords[q.id] && this.state.record)
      Object.assign(this.state.record, this.practiceRecords[q.id]);
    this.restoreDraft();
  }
  private async classAction(action: string, extra: Record<string, unknown>) {
    if (currentStudent()?.studentId !== this.studentId)
      throw Error(
        "Öğrenci oturumu sona erdi. Sınıf bağlantısıyla yeniden katıl.",
      );
    if (action === "start" || action === "retry") {
      this.state.index = 0;
      this.drafts = {};
      this.keys = {};
      this.practiceRecords = {};
      this.applyAttempt(await studentApi("start_attempt"));
      await this.history();
    } else if (action === "resume") {
      if (this.attempt) {
        this.applyAttempt(
          await studentApi("get_attempt", {
            attemptId: this.attempt.attemptId,
          }),
        );
        await this.history();
      }
    } else if (action === "submit") {
      const q = this.state.question!;
      this.keys[q.id] ??= crypto.randomUUID();
      this.applyAttempt(
        await studentApi("submit_answer", {
          attemptId: this.attempt.attemptId,
          questionId: q.id,
          answer: extra.answer,
          idempotencyKey: this.keys[q.id],
        }),
      );
    } else if (action === "practice") {
      const q = this.state.question!;
      const r = await studentApi("practice_answer", {
        attemptId: this.attempt.attemptId,
        questionId: q.id,
        answer: extra.answer,
      });
      this.practiceRecords[q.id] = {
        practiceAnswer: extra.answer as FinalAnswer,
        practiceCorrect: r.correct,
      };
      this.applyAttempt(this.attempt);
    } else if (action === "move") {
      const n = this.state.index + Number(extra.delta);
      if (n >= 0 && n < 15 && (Number(extra.delta) < 0 || this.state.record)) {
        this.state.index = n;
        this.state.hint = null;
        this.state.hintLevel = 0;
        this.applyAttempt(this.attempt);
      }
    } else if (action === "finalize") {
      this.applyAttempt(
        await studentApi("finalize_attempt", {
          attemptId: this.attempt.attemptId,
        }),
      );
      await this.history();
    } else if (action === "hint") {
      this.state.hintLevel = Math.min(3, this.state.hintLevel + 1);
      this.state.hint =
        this.state.hintLevel === 3 && this.state.record
          ? this.state.question!.explanation
          : [
              "AFİ: Güvenli gözlem konumunu ve yetişkin desteğini hatırla.",
              "Durumu ve hedefi bütünüyle oku. Hazırlık tehlikeyi tamamen yok eder mi?",
              "Her ilişkiyi ayrı düşün. Yanıtından sonra gerekçeleri birlikte inceleyebiliriz.",
            ][this.state.hintLevel - 1];
    }
  }
  private async history() {
    const h = await studentApi("assessment_history");
    Object.assign(this.state, h);
  }
  start(_ignoredSeed?: number) {
    return this.run("start");
  }
  retry(_ignoredSeed?: number) {
    this.drafts = {};
    this.keys = {};
    this.practiceRecords = {};
    return this.run("retry");
  }
  submit(answer: FinalAnswer) {
    return this.run("submit", { answer });
  }
  practice(answer: FinalAnswer) {
    return this.run("practice", { answer });
  }
  hint() {
    return this.run("hint");
  }
  move(delta: number) {
    if (delta !== 1 && delta !== -1) return;
    return this.run("move", { delta });
  }
  finalize() {
    return this.run("finalize");
  }
  reconnect() {
    return this.run("resume");
  }
  saveDraft(answer: FinalAnswer) {
    if (this.state.question && !this.state.record)
      this.drafts[this.state.question.id] = structuredClone(answer);
  }
}
