export type HomePhase =
  | "homeIntro"
  | "inspectHome"
  | "drillReady"
  | "shaking"
  | "afterShaking"
  | "gatheringPoint"
  | "completed";
export type HomeId =
  | "homeBookshelf"
  | "homeDecor"
  | "homeHeavy"
  | "homeSofa"
  | "homeTable"
  | "homeBag";
export type HomeItem = {
  id: HomeId;
  name: string;
  asset: string;
  risk: boolean;
  detail: string;
  why: string;
  action: string;
  wrong: string;
  fix: string;
  x: number;
  y: number;
  width: number;
  approach: { x: number; y: number };
};
export const HOME_ITEMS: readonly HomeItem[] = [
  {
    id: "homeBookshelf",
    name: "Aile kitaplığı",
    asset: "bookshelf",
    risk: true,
    detail: "Yüksek kitaplığın duvar bağlantısı görünmüyor.",
    why: "Sarsıntıda devrilip geçişi kapatabilir.",
    action:
      "Bir yetişkine bildir; teknik personel uygun bağlantıyla sabitlesin.",
    wrong: "Kitaplığı tek başıma duvara iterim.",
    fix: "Canlandırma: yetkili yetişkin kitaplığı uygun yöntemle sabitledi.",
    x: 430,
    y: 565,
    width: 160,
    approach: { x: 460, y: 670 },
  },
  {
    id: "homeDecor",
    name: "Kanepenin üzerindeki ağır çerçeve",
    asset: "decor",
    risk: true,
    detail: "Ağır çerçeve oturma alanının üzerinde, askısı gevşek.",
    why: "Düşerse oturan kişiyi yaralayabilir.",
    action:
      "Yetişkine bildir; daha güvenli yerleşimi ve bağlantıyı yetkili kişi kontrol etsin.",
    wrong: "Kanepeye çıkıp çerçeveyi kendim indiririm.",
    fix: "Canlandırma: yetişkin ağır çerçeveyi oturma alanından uzaktaki alçak konuma aldı.",
    x: 1480,
    y: 340,
    width: 190,
    approach: { x: 1430, y: 660 },
  },
  {
    id: "homeHeavy",
    name: "Dolap üstündeki ağır eşya",
    asset: "heavy",
    risk: true,
    detail: "Ağır sandık ve seramik kap dolabın üstünde.",
    why: "Yüksekten düşüp yaralanmaya neden olabilir.",
    action:
      "Yetkili yetişkinden ağır eşyayı alçak ve güvenli yere almasını iste.",
    wrong: "Sandalyeye çıkıp ağır eşyayı aşağı taşırım.",
    fix: "Canlandırma: yetişkin ağır eşyayı zemine yakın güvenli depolamaya aldı.",
    x: 730,
    y: 315,
    width: 125,
    approach: { x: 730, y: 660 },
  },
  {
    id: "homeSofa",
    name: "Duvar kenarındaki kanepe",
    asset: "sofa",
    risk: true,
    detail: "Kanepe kapıdan uzakta, sol duvar kenarında. Yanındaki kısa geçiş yine de dar kalıyor.",
    why: "Kapı açık olsa bile dar yan geçiş takılmayı ve güvenli ilerlemeyi zorlaştırabilir.",
    action:
      "Bir yetişkine bildir; kanepeyi duvar boyunca biraz geriye aldırıp yan geçişi açık tut.",
    wrong: "Ağır kanepeyi tek başıma sürüklerim.",
    fix: "Canlandırma: yetişkin kanepeyi sol duvar boyunca geriye aldı; yan geçiş genişledi. Kapı önü açık.",
    x: 570,
    y: 850,
    width: 270,
    approach: { x: 800, y: 860 },
  },
  {
    id: "homeTable",
    name: "Sağlam masa",
    asset: "table",
    risk: false,
    detail: "Masa sağlam ve yerinde; altında korunmaya elverişli boşluk var.",
    why: "Bu senaryoda pencereden uzak masa altında baş ve boynu koruyup sağlam ayağa tutunabiliriz. Hiçbir yer için kesin güvenlik garantisi değildir.",
    action: "Bu güvenli özelliği not et.",
    wrong: "",
    fix: "",
    x: 1060,
    y: 830,
    width: 270,
    approach: { x: 1040, y: 920 },
  },
  {
    id: "homeBag",
    name: "Afet ve acil durum çantası",
    asset: "bag",
    risk: false,
    detail: "Çanta ulaşılabilir yerde ve çıkış yolunun dışında.",
    why: "Su, temel ihtiyaçlar ve kişiye uygun malzemeler aileyle hazırlanır, düzenli kontrol edilir. Çantayı almak için tehlikeli yere geri dönmeyiz.",
    action: "Bu güvenli özelliği not et.",
    wrong: "",
    fix: "",
    x: 1560,
    y: 880,
    width: 90,
    approach: { x: 1460, y: 890 },
  },
];
export type DrillDecision =
  | "protect"
  | "window"
  | "stairs"
  | "lift"
  | "evacuate"
  | "return";
export type HomeFinding = "unseen" | "reported" | "fixed";
export const HOME_SAFETY =
  "Planlı eğitim tatbikatı. Ağır eşya taşıma, sabitleme, gaz veya elektrik tesisatına müdahale etme; yetişkine bildir.";
export class HomeFlow {
  phase: HomePhase = "homeIntro";
  findings: Record<HomeId, HomeFinding> = {
    homeBookshelf: "unseen",
    homeDecor: "unseen",
    homeHeavy: "unseen",
    homeSofa: "unseen",
    homeTable: "unseen",
    homeBag: "unseen",
  };
  openId: HomeId | null = null;
  readyOpen = false;
  feedback = "";
  retry = false;
  protected = false;
  elapsed = 0;
  evacuation = false;
  completedOnce = false;
  completionCount = 0;
  travel: "city" | "home" | null = null;
  get locked() {
    return (
      this.phase === "homeIntro" ||
      this.openId !== null ||
      this.readyOpen ||
      this.phase === "shaking" ||
      (this.phase === "afterShaking" && !this.evacuation) ||
      this.phase === "completed"
    );
  }
  snapshot() {
    return {
      phase: this.phase,
      findings: { ...this.findings },
      openId: this.openId,
      readyOpen: this.readyOpen,
      feedback: this.feedback,
      retry: this.retry,
      protected: this.protected,
      elapsed: this.elapsed,
      evacuation: this.evacuation,
      completedOnce: this.completedOnce,
      completionCount: this.completionCount,
      risks: HOME_ITEMS.filter((o) => o.risk && this.findings[o.id] === "fixed")
        .length,
      safe: HOME_ITEMS.filter((o) => !o.risk && this.findings[o.id] === "fixed")
        .length,
    };
  }
  intro() {
    if (this.phase === "homeIntro") this.phase = "inspectHome";
  }
  open(id: HomeId) {
    if (!["inspectHome", "drillReady"].includes(this.phase)) return;
    this.feedback = "";
    this.retry = false;
    if (id === "homeTable" && this.phase === "drillReady") {
      this.readyOpen = true;
      return;
    }
    this.openId = id;
  }
  close() {
    this.openId = null;
    this.readyOpen = false;
    this.feedback = "";
    this.retry = false;
  }
  answer(correct: boolean) {
    const o = HOME_ITEMS.find((o) => o.id === this.openId);
    if (!o) return;
    if (this.findings[o.id] !== "unseen") return;
    this.retry = !correct;
    if (!correct) {
      this.feedback = `Tekrar düşünelim. ${o.why} Ağır eşya taşıma veya tırmanma; bir yetişkine bildir.`;
      return;
    }
    this.feedback =
      o.why +
      (o.risk
        ? " Güvenli karar: yetişkine bildirdik. Uygulamayı yetkili kişi yapacak."
        : "");
    this.findings[o.id] = o.risk ? "reported" : "fixed";
    this.checkReady();
  }
  fix() {
    const o = HOME_ITEMS.find((o) => o.id === this.openId);
    if (o?.risk && this.findings[o.id] === "reported") {
      this.findings[o.id] = "fixed";
      this.feedback = o.fix;
      this.checkReady();
    }
  }
  private checkReady() {
    if (
      HOME_ITEMS.every((o) => this.findings[o.id] === "fixed") &&
      this.phase === "inspectHome"
    )
      this.phase = "drillReady";
  }
  start() {
    if (this.phase !== "drillReady" || !this.readyOpen) return;
    this.close();
    this.phase = "shaking";
    this.protected = false;
    this.elapsed = 0;
    this.feedback = "";
    this.evacuation = false;
  }
  decide(id: DrillDecision) {
    if (this.phase === "shaking" && !this.protected) {
      const wrong: Record<string, string> = {
        window: "Pencere ve camlardan uzak dur; sarsıntıda cam kırılabilir.",
        stairs:
          "Sarsıntı sürerken merdivene veya çıkışa koşma; düşme ve düşen eşya riski vardır.",
        lift: "Asansör arızalanabilir veya durabilir; sarsıntı sırasında asansöre binme.",
      };
      if (id === "protect") {
        this.protected = true;
        this.retry = false;
        this.feedback =
          "Doğru karar: Çök, baş ve boynunu koruyarak kapan, sağlam masa ayağına tutun. Sarsıntı bitene kadar korun.";
      } else if (wrong[id]) {
        this.retry = true;
        this.feedback =
          "Tekrar düşünelim. " + wrong[id] + " Güvenli korunmayı seçebilirsin.";
      }
    } else if (this.phase === "afterShaking" && !this.evacuation) {
      if (id === "evacuate") {
        this.evacuation = true;
        this.retry = false;
        this.feedback =
          "Sarsıntı bitti. Yetişkin yönlendirmesiyle açık çıkışa yürü; hasarlı alanlardan ve devrilebilecek eşyalardan uzak dur. Asansör kullanma.";
      } else {
        this.retry = true;
        this.feedback =
          "Tekrar düşünelim. Eşya almak için geri dönme, gaz/elektrik tesisatına dokunma. Yetişkin yönlendirmesiyle güvenli çıkışı kullan.";
      }
    }
  }
  tick(seconds: number) {
    if (this.phase === "shaking" && this.protected) {
      this.elapsed = Math.min(6, this.elapsed + seconds);
      if (this.elapsed >= 6) {
        this.phase = "afterShaking";
        this.protected = false;
        this.feedback =
          "Sarsıntı sona erdi. Şimdi kontrollü tahliyeyi planlayalım.";
      }
    }
  }
  exit() {
    if (this.phase === "afterShaking" && this.evacuation) {
      this.phase = "gatheringPoint";
      this.feedback = "";
      return "gathering" as const;
    }
    if (
      ["homeIntro", "inspectHome", "drillReady", "completed"].includes(
        this.phase,
      )
    )
      return "city" as const;
    return null;
  }
  gather() {
    if (this.phase !== "gatheringPoint") return;
    this.phase = "completed";
    this.completedOnce = true;
    this.completionCount = 1;
    this.feedback =
      "Sarsıntı sırasında korunmayı ve sonrasında güvenli çıkışı seçtin. Güvenkent’e yardım etmeye hazırsın!";
  }
  replay() {
    if (this.phase !== "completed") return;
    this.phase = "drillReady";
    this.close();
    this.protected = false;
    this.elapsed = 0;
    this.evacuation = false;
    this.travel = "home";
  }
}
