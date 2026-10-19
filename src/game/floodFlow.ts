import {
  FLOOD_RISKS,
  FLOOD_OBJECTIVES,
  PREPAREDNESS,
  RAIN_SCENARIO,
  floodForcing,
  type FloodRiskId,
  type PreparednessId,
} from "../data/flood.ts";
export type FloodPhase = keyof typeof FLOOD_OBJECTIVES;
export type RiskProgress =
  | "unseen"
  | "identified"
  | "decisionMade"
  | "reviewed";
export type FloodPreparationRecord = {
  version: 1;
  region: "dere";
  measures: PreparednessId[];
  scenario: typeof RAIN_SCENARIO;
};
export class FloodFlow {
  phase: FloodPhase = "notStarted";
  risks: Record<FloodRiskId, RiskProgress> = {
    floodStorage: "unseen",
    floodDrain: "unseen",
    floodBridge: "unseen",
  };
  openId: FloodRiskId | "hasan" | "preparedness" | null = null;
  feedback = "";
  retry = false;
  hintLevel = 0;
  elapsed = 0;
  completionCount = 0;
  measures: PreparednessId[] = [];
  travel: "city" | null = null;
  get investigated() {
    return Object.values(this.risks).filter((s) => s === "reviewed").length;
  }
  get simulation() {
    return (
      this.phase === "beforeSimulation" || this.phase === "afterSimulation"
    );
  }
  get locked() {
    return (
      !!this.openId ||
      this.simulation ||
      this.phase === "compare" ||
      this.phase === "completed"
    );
  }
  enter() {
    if (this.phase === "notStarted") this.phase = "meetHasan";
  }
  open(id: FloodRiskId | "hasan" | "preparedness") {
    if (
      this.simulation ||
      this.phase === "compare" ||
      this.phase === "completed"
    )
      return;
    this.feedback = "";
    this.retry = false;
    if (this.openId !== id) this.hintLevel = 0;
    if (id === "hasan") {
      this.openId = id;
      return;
    }
    if (this.phase === "meetHasan") {
      this.openId = "hasan";
      return;
    }
    if (id === "preparedness") {
      if (this.investigated < 3) {
        this.feedback = "Önce üç riski güvenli meydandan inceleyelim.";
        return;
      }
    } else if (this.risks[id] === "unseen") this.risks[id] = "identified";
    this.openId = id;
  }
  meet() {
    if (this.openId !== "hasan") return;
    if (this.phase === "meetHasan") this.phase = "investigate3";
    this.close();
  }
  close() {
    this.openId = null;
    this.feedback = "";
    this.retry = false;
  }
  answer(choice: string) {
    const item = FLOOD_RISKS.find((r) => r.id === this.openId);
    if (!item || this.risks[item.id] !== "identified") return;
    const c = item.choices.find((c) => c.id === choice);
    if (!c) return;
    this.retry = !c.correct;
    this.feedback =
      (c.correct ? "Güvenli karar. " : "Tekrar düşünelim. ") + item.why;
    if (c.correct) this.risks[item.id] = "decisionMade";
  }
  review() {
    const id = this.openId;
    if (
      !id ||
      id === "hasan" ||
      id === "preparedness" ||
      this.risks[id] !== "decisionMade"
    )
      return;
    this.risks[id] = "reviewed";
    this.close();
    if (this.investigated === 3) this.phase = "choosePreparedness";
  }
  toggle(id: PreparednessId) {
    if (
      this.phase !== "choosePreparedness" ||
      this.openId !== "preparedness" ||
      !PREPAREDNESS.some((p) => p.id === id)
    )
      return;
    this.measures = this.measures.includes(id)
      ? this.measures.filter((v) => v !== id)
      : [...this.measures, id];
    this.retry = false;
    this.feedback =
      "Öneriler yetkili ekipler ve yetişkinler içindir; bu oyunda gerçek bildirim gönderilmez.";
  }
  unsafePreparation() {
    if (this.phase === "choosePreparedness") {
      this.retry = true;
      this.feedback =
        "Taşkın suyunu veya alçak köprüyü hızlıca geçmek güvenli değildir. Yüksek güvenli güzergâhı ve uyarıları izle.";
    }
  }
  start() {
    if (this.phase !== "choosePreparedness" || !this.measures.length) return;
    this.close();
    this.elapsed = 0;
    this.phase = "beforeSimulation";
  }
  tick(dt: number) {
    if (this.simulation)
      this.elapsed = Math.min(45, this.elapsed + Math.max(0, dt));
  }
  summary() {
    if (this.simulation) this.elapsed = 45;
  }
  next() {
    if (this.phase === "beforeSimulation" && this.elapsed === 45) {
      this.phase = "afterSimulation";
      this.elapsed = 0;
    } else if (this.phase === "afterSimulation" && this.elapsed === 45)
      this.phase = "compare";
    else if (this.phase === "compare") {
      this.phase = "completed";
      this.completionCount = 1;
    }
  }
  replay() {
    if (this.phase === "completed") {
      this.phase = "choosePreparedness";
      this.openId = "preparedness";
      this.elapsed = 0;
      this.feedback = "";
      this.retry = false;
    }
  }
  hint() {
    const r =
      FLOOD_RISKS.find((r) => r.id === this.openId) ??
      FLOOD_RISKS.find((r) => this.risks[r.id] !== "reviewed");
    const level = Math.min(2, this.hintLevel++);
    return r
      ? r.hint[level]
      : [
          "AFİ: Hazırlıkları birlikte düşünelim.",
          "AFİ: Meydandaki ahşap bilgi panosuna bak.",
          "AFİ: Hazırlık panosunu incele, en az bir güvenli öneri seç; iki yağış senaryosunu karşılaştır.",
        ][level];
  }
  exportPreparation(): FloodPreparationRecord {
    return {
      version: 1,
      region: "dere",
      measures: [...this.measures],
      scenario: { ...RAIN_SCENARIO },
    };
  }
  snapshot() {
    const common = {
      risks: { ...this.risks },
      openId: this.openId,
      feedback: this.feedback,
      retry: this.retry,
      investigated: this.investigated,
      measures: [...this.measures],
      elapsed: Math.floor(this.elapsed),
      completionCount: this.completionCount,
      hintLevel: Math.min(3, this.hintLevel),
      scenario: { ...RAIN_SCENARIO },
      forcing: floodForcing(this.elapsed),
      preparation: this.exportPreparation(),
    };
    if (this.phase === "beforeSimulation" || this.phase === "afterSimulation")
      return { ...common, phase: this.phase, simulation: true as const };
    return { ...common, phase: this.phase, simulation: false as const };
  }
}
/** Discriminated public state: simulation phases carry simulation:true. */
export type FloodState = ReturnType<FloodFlow["snapshot"]>;
