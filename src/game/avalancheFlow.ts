import {
  AVALANCHE_RISKS,
  AVALANCHE_OBJECTIVES,
  AVALANCHE_MEASURES,
  AVALANCHE_SCENARIO,
  avalancheForcing,
  type AvalancheRiskId,
  type AvalancheMeasureId,
} from "../data/avalanche.ts";
export type AvalanchePhase = keyof typeof AVALANCHE_OBJECTIVES;
export type RiskProgress = "unseen" | "identified" | "decided" | "explained";
export type AvalanchePreparationRecord = {
  version: 1;
  region: "karlitepe";
  measures: AvalancheMeasureId[];
  scenario: typeof AVALANCHE_SCENARIO;
};
export class AvalancheFlow {
  phase: AvalanchePhase = "notStarted";
  risks: Record<AvalancheRiskId, RiskProgress> = {
    iceRoad: "unseen",
    snowSlope: "unseen",
    routeSign: "unseen",
  };
  openId: AvalancheRiskId | "zeynep" | "preparedness" | null = null;
  voiceVolume: 0.25 | 0.5 = 0.5;
  setVoiceVolume(volume: 0.25 | 0.5) {
    this.voiceVolume = volume;
  }
  feedback = "";
  retry = false;
  hintLevel = 0;
  elapsed = 0;
  completionCount = 0;
  measures: AvalancheMeasureId[] = [];
  travel: "city" | null = null;
  get investigated() {
    return Object.values(this.risks).filter((s) => s === "explained").length;
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
    if (this.phase === "notStarted") this.phase = "meetZeynep";
  }
  open(id: AvalancheRiskId | "zeynep" | "preparedness") {
    if (
      this.simulation ||
      this.phase === "compare" ||
      this.phase === "completed"
    )
      return;
    this.feedback = "";
    this.retry = false;
    if (this.openId !== id) this.hintLevel = 0;
    if (id === "zeynep") {
      this.openId = id;
      return;
    }
    if (this.phase === "meetZeynep") {
      this.openId = "zeynep";
      return;
    }
    if (id === "preparedness") {
      if (this.investigated < 3) {
        this.feedback = "Önce üç riski güvenli platformdan inceleyelim.";
        return;
      }
    } else if (this.risks[id] === "unseen") this.risks[id] = "identified";
    this.openId = id;
  }
  meet() {
    if (this.openId !== "zeynep") return;
    if (this.phase === "meetZeynep") this.phase = "inspectThreeRisks";
    this.close();
  }
  close() {
    this.openId = null;
    this.feedback = "";
    this.retry = false;
  }
  answer(choice: string) {
    const item = AVALANCHE_RISKS.find((r) => r.id === this.openId);
    if (!item || this.risks[item.id] !== "identified") return;
    const c = item.choices.find((c) => c.id === choice);
    if (!c) return;
    this.retry = !c.correct;
    this.feedback =
      (c.correct ? "Güvenli karar. " : "Tekrar düşünelim. ") + item.why;
    if (c.correct) this.risks[item.id] = "decided";
  }
  review() {
    const id = this.openId;
    if (
      !id ||
      id === "zeynep" ||
      id === "preparedness" ||
      this.risks[id] !== "decided"
    )
      return;
    this.risks[id] = "explained";
    this.close();
    if (this.investigated === 3) this.phase = "selectPreparedness";
  }
  toggle(id: AvalancheMeasureId) {
    if (
      this.phase !== "selectPreparedness" ||
      this.openId !== "preparedness" ||
      !AVALANCHE_MEASURES.some((p) => p.id === id)
    )
      return;
    this.measures = this.measures.includes(id)
      ? this.measures.filter((v) => v !== id)
      : [...this.measures, id];
    this.retry = false;
    this.feedback =
      "Öneriler yetkili ekipler ve yetişkinler içindir; bu oyunda gerçek bildirim gönderilmez.";
  }
  start() {
    if (this.phase !== "selectPreparedness" || !this.measures.length) return;
    this.close();
    this.elapsed = 0;
    this.phase = "beforeSimulation";
  }
  tick(dt: number) {
    if (this.simulation)
      this.elapsed = Math.min(40, this.elapsed + Math.max(0, dt));
  }
  summary() {
    if (this.simulation) this.elapsed = 40;
  }
  next() {
    if (this.phase === "beforeSimulation" && this.elapsed === 40) {
      this.phase = "afterSimulation";
      this.elapsed = 0;
    } else if (this.phase === "afterSimulation" && this.elapsed === 40)
      this.phase = "compare";
    else if (this.phase === "compare") {
      this.phase = "completed";
      this.completionCount = 1;
    }
  }
  replay() {
    if (this.phase === "completed") {
      this.phase = "selectPreparedness";
      this.openId = "preparedness";
      this.elapsed = 0;
      this.feedback = "";
      this.retry = false;
    }
  }
  hint() {
    const r =
      AVALANCHE_RISKS.find((r) => r.id === this.openId) ??
      AVALANCHE_RISKS.find((r) => this.risks[r.id] !== "explained");
    const level = Math.min(2, this.hintLevel++);
    return r
      ? r.hint[level]
      : [
          "AFİ: Hazırlıkları birlikte düşünelim.",
          "AFİ: Güvenli platformdaki bilgi panosuna bak.",
          "AFİ: Hazırlık panosunu incele, en az bir güvenli öneri seç; aynı kar ve kış koşullarında iki hazırlığı karşılaştır.",
        ][level];
  }
  exportPreparation(): AvalanchePreparationRecord {
    return {
      version: 1,
      region: "karlitepe",
      measures: [...this.measures],
      scenario: { ...AVALANCHE_SCENARIO },
    };
  }
  snapshot() {
    const common = {
      risks: { ...this.risks },
      voiceVolume: this.voiceVolume,
      openId: this.openId,
      feedback: this.feedback,
      retry: this.retry,
      investigated: this.investigated,
      measures: [...this.measures],
      elapsed: Math.floor(this.elapsed),
      completionCount: this.completionCount,
      hintLevel: Math.min(3, this.hintLevel),
      scenario: { ...AVALANCHE_SCENARIO },
      forcing: avalancheForcing(Math.floor(this.elapsed)),
      preparation: this.exportPreparation(),
    };
    if (this.phase === "beforeSimulation" || this.phase === "afterSimulation")
      return { ...common, phase: this.phase, simulation: true as const };
    return { ...common, phase: this.phase, simulation: false as const };
  }
}
/** Discriminated public state: simulation phases carry simulation:true. */
export type AvalancheState = ReturnType<AvalancheFlow["snapshot"]>;
