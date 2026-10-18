import type { Settings } from "../lib/settings";
import type { Point } from "./cityModel";

export type StoryQuest =
  | "notStarted"
  | "speakToMayor"
  | "inspectCertificate"
  | "reviewCityPlan"
  | "goToSchool";
export type SceneId = "CitySquare" | "TownHall";
export type InteriorObject =
  | "mayor"
  | "certificate"
  | "plan"
  | "journal"
  | "exit";
export type InteractionId = InteriorObject | "townHall" | "school" | "afi";
export type Controls = {
  x: number;
  y: number;
  interact: boolean;
  next: boolean;
  hint: boolean;
};
export type Dialogue = {
  pages: readonly string[];
  index: number;
  accept?: "mayor" | "certificate" | "plan";
  label?: string;
};
export const SAFETY =
  "Unvanın temsili; gerçek belediye veya acil durum yetkisi vermez.";
export const OBJECTIVES: Record<StoryQuest, string> = {
  notStarted: "Belediye binasına gir",
  speakToMayor: "Belediye başkanıyla konuş",
  inspectCertificate: "Masadaki görev beratını incele",
  reviewCityPlan: "Kent planında okulu bul",
  goToSchool: "Güvenkent İlkokuluna git",
};
export const CONVERSATIONS = {
  mayor: [
    "Başkan: Hoş geldin Çağrı! Güvenkent’i birlikte tanımaya hazır mısın?",
    "Başkan: Çocuk Belediye Başkanı unvanın temsili. Gerçek belediye veya acil durum yetkisi vermez.",
  ],
  certificate: [
    "Berat: Güvenkent’i güvenle gözlemlemeye davetlisin. Temsilî görevi kabul ediyor musun?",
  ],
  plan: [
    "AFİ: Güvenkent İlkokuluna git, güvenli sınıfı birlikte keşfedelim. Okul meydanın sağında.",
  ],
} as const;
const HINTS: Record<StoryQuest, readonly string[]> = {
  notStarted: [
    "AFİ: Meydanda bizi bekleyen biri var.",
    "AFİ: Saat kulesi olan binaya bakalım.",
    "AFİ: Soldaki belediyeye yaklaş; E, Enter veya Etkileşim ile içeri gir.",
  ],
  speakToMayor: [
    "AFİ: Yeni bir yerde önce merhaba deriz.",
    "AFİ: Turkuaz ceketli başkan bizi bekliyor.",
    "AFİ: Başkana yaklaş ve E, Enter veya dokunarak konuş.",
  ],
  inspectCertificate: [
    "AFİ: Başkan sana küçük bir hatıra hazırladı.",
    "AFİ: Ahşap masanın üzerindeki mühürlü kâğıda bak.",
    "AFİ: Görev beratına yaklaş, incele ve kabul et.",
  ],
  reviewCityPlan: [
    "AFİ: Gideceğimiz yeri bulalım.",
    "AFİ: Soldaki ahşap kent planına bakalım.",
    "AFİ: Kent planını incele; okul rotasını görev defterine not et.",
  ],
  goToSchool: [
    "AFİ: Artık ilk keşif için hazırız.",
    "AFİ: İçerideysen ön kapıdan meydana çık.",
    "AFİ: Meydanın sağındaki okul girişine git; sınıf sahnesi sonraki aşamada.",
  ],
};
export type GameStatus = {
  scene: SceneId;
  quest: StoryQuest;
  objective: string;
  nearby: string | null;
  dialogue: Dialogue | null;
  schoolVisited: boolean;
  transitioning: boolean;
  assetErrors: string[];
};
/** In-memory session only: survives scene restarts, never claims a database save. */
export class GameSession {
  quest: StoryQuest = "notStarted";
  scene: SceneId = "CitySquare";
  positions: Partial<Record<SceneId, Point>> = {};
  controls: Controls = {
    x: 0,
    y: 0,
    interact: false,
    next: false,
    hint: false,
  };
  paused = false;
  transitioning = false;
  schoolVisited = false;
  dialogue: Dialogue | null = null;
  nearby: string | null = null;
  assetErrors: string[] = [];
  private hintLevel = 0;
  private last = "";
  settings: Settings;
  private report: (s: GameStatus) => void;
  constructor(settings: Settings, report: (s: GameStatus) => void) {
    this.settings = settings;
    this.report = report;
  }
  status(): GameStatus {
    return {
      scene: this.scene,
      quest: this.quest,
      objective: OBJECTIVES[this.quest],
      nearby: this.nearby,
      dialogue: this.dialogue ? { ...this.dialogue } : null,
      schoolVisited: this.schoolVisited,
      transitioning: this.transitioning,
      assetErrors: [...this.assetErrors],
    };
  }
  notify() {
    const s = this.status();
    const json = JSON.stringify(s);
    if (json !== this.last) {
      this.last = json;
      this.report(s);
    }
  }
  say(pages: readonly string[], accept?: Dialogue["accept"], label?: string) {
    this.dialogue = { pages, index: 0, accept, label };
    this.notify();
  }
  private advance(next: StoryQuest) {
    this.quest = next;
    this.hintLevel = 0;
  }
  enter() {
    if (this.quest === "notStarted") this.advance("speakToMayor");
    this.dialogue = null;
    this.notify();
  }
  next() {
    const d = this.dialogue;
    if (!d) return;
    if (d.index < d.pages.length - 1) {
      this.dialogue = { ...d, index: d.index + 1 };
    } else {
      if (d.accept === "mayor" && this.quest === "speakToMayor")
        this.advance("inspectCertificate");
      if (d.accept === "certificate" && this.quest === "inspectCertificate")
        this.advance("reviewCityPlan");
      if (d.accept === "plan" && this.quest === "reviewCityPlan")
        this.advance("goToSchool");
      this.dialogue = null;
    }
    this.notify();
  }
  skip() {
    if (!this.dialogue) return;
    const d = this.dialogue;
    // The mayor's safety page cannot be skipped; certificate acceptance is explicit.
    if (d.index < d.pages.length - 1)
      this.dialogue = { ...d, index: d.pages.length - 1 };
    else if (d.accept !== "mayor") this.dialogue = null;
    this.notify();
  }
  hint() {
    const hints = HINTS[this.quest];
    this.say([hints[Math.min(this.hintLevel, 2)]]);
    this.hintLevel = Math.min(2, this.hintLevel + 1);
  }
  interact(id: InteractionId) {
    if (id === "mayor") {
      if (this.quest === "speakToMayor")
        this.say(CONVERSATIONS.mayor, "mayor", "Beratı inceleyelim");
      else
        this.say([
          "Başkan: Hoş geldin! Güvenli gözlem yap; tehlikeli işleri her zaman yetişkinlere bırak.",
        ]);
    } else if (id === "certificate") {
      if (this.quest === "speakToMayor" || this.quest === "notStarted")
        this.say([
          "AFİ: Önce başkanla tanışalım; sonra beratı birlikte inceleyelim.",
        ]);
      else if (this.quest === "inspectCertificate")
        this.say(CONVERSATIONS.certificate, "certificate", "Beratı kabul et");
      else
        this.say([
          "AFİ: Temsilî görev beratını aldın. Sıradaki hedefini defterde bulabilirsin.",
        ]);
    } else if (id === "plan") {
      if (this.quest === "reviewCityPlan")
        this.say(CONVERSATIONS.plan, "plan", "Rotayı not et");
      else if (this.quest === "goToSchool") this.say(CONVERSATIONS.plan);
      else
        this.say([
          "AFİ: Önce başkanla konuşup görev beratını kabul edelim. Sonra okul rotasını işaretleyeceğiz.",
        ]);
    } else if (id === "journal")
      this.say([
        `Görev defteri: ${OBJECTIVES[this.quest]}. Bu ilerleme yalnızca açık oyun oturumunda tutulur.`,
      ]);
    else if (id === "school") {
      if (this.quest === "goToSchool") {
        this.schoolVisited = true;
        this.say([
          "AFİ: Güvenkent İlkokuluna ulaştık! Güvenli sınıf keşfi sonraki aşamada açılacak.",
        ]);
      } else
        this.say(["AFİ: İlk görev için önce belediye başkanına uğrayalım."]);
    } else if (id === "afi") this.hint();
    this.notify();
  }
}
