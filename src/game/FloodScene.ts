import Phaser from "phaser";
import { AdventureScene } from "./AdventureScene";
import type { GameSession, InteractionId } from "./story";
import {
  FLOOD_RISKS,
  FLOOD_INTRO,
  RAIN_SCENARIO,
  FLOOD_SAFETY,
  simulationFrame,
} from "../data/flood";
import {
  FLOOD_WORLD,
  FLOOD_WALK,
  FLOOD_OBSTACLES,
  FLOOD_HOTSPOTS,
} from "./floodLayout";
export class FloodScene extends AdventureScene {
  private water!: Phaser.GameObjects.Graphics;
  private rain!: Phaser.GameObjects.Graphics;
  private puddle!: Phaser.GameObjects.Ellipse;
  private resident?: Phaser.GameObjects.Image;
  private flags: Phaser.GameObjects.Text[] = [];
  private visualTime = 0;
  private wasLocked = false;
  private narrationKey = "";
  private phaseBefore = "";
  private preparedSign?: Phaser.GameObjects.Image;
  constructor(session: GameSession) {
    super("Flood", session, {
      world: FLOOD_WORLD,
      walk: FLOOD_WALK,
      spawn: { x: 780, y: 1000 },
      hotspots: FLOOD_HOTSPOTS,
      obstacles: FLOOD_OBSTACLES,
      pathfinding: true,
      cycleNearby: true,
      hideIdleHalos: true,
      followOffsetY: 0,
    });
  }
  protected preloadWorld() {
    for (const a of [
      "area",
      "bridge",
      "store",
      "drain",
      "hasan",
      "notice",
      "residents",
    ])
      this.asset("flood-" + a, `/assets/flood/${a}.png`);
  }
  private prop(key: string, x: number, y: number, width: number) {
    if (!this.textures.exists(key)) return;
    const frame = this.textures.getFrame(key);
    return this.picture(
      key,
      x,
      y,
      width,
      (width * frame.realHeight) / frame.realWidth,
    );
  }
  protected drawWorld() {
    this.picture("flood-area", 960, 1280, 1920, 1280)?.setDepth(0);
    this.water = this.add.graphics().setDepth(1);
    this.rain = this.add.graphics().setDepth(2500);
    this.puddle = this.add
      .ellipse(1250, 960, 130, 28, 0x609aab, 0.3)
      .setDepth(1)
      .setVisible(false);
    this.flags = [];
    FLOOD_RISKS.forEach((r) => {
      const image = this.prop("flood-" + r.asset, r.x, r.y, r.width);
      if (image) this.props.set(r.id, image);
    });
    const hasan = this.prop("flood-hasan", 720, 750, 74);
    if (hasan) this.props.set("hasan", hasan);
    this.resident = this.prop("flood-residents", 850, 620, 95);
    this.prop("flood-notice", 650, 585, 135);
    this.preparedSign = this.prop("flood-notice", 540, 510, 70)?.setVisible(
      false,
    );
    this.add
      .zone(1740, 700, 360, 1100)
      .setDepth(2900)
      .setInteractive()
      .on(
        "pointerdown",
        (
          _p: unknown,
          _x: unknown,
          _y: unknown,
          e: Phaser.Types.Input.EventData,
        ) => {
          e.stopPropagation();
          if (!this.session.flood.locked) this.session.say([FLOOD_SAFETY]);
        },
      );
    for (const r of FLOOD_RISKS) {
      const image = this.props.get(r.id),
        h = this.definition.hotspots.find((h) => h.id === r.id)!;
      if (image)
        h.hit = {
          x: r.x,
          y: r.y - image.displayHeight / 2,
          width: r.width,
          height: image.displayHeight,
        };
    }
    this.add
      .text(780, 1120, "MEYDAN ↑", {
        fontFamily: "Arial",
        fontSize: "13px",
        color: "#fffbe8",
        backgroundColor: "#416d60",
        padding: { x: 6, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(1200);
    this.flags.push(
      this.add
        .text(1360, 1040, "KAPALI", {
          fontFamily: "Arial",
          fontSize: "12px",
          color: "#fff8e1",
          backgroundColor: "#786242",
          padding: { x: 6, y: 3 },
        })
        .setOrigin(0.5)
        .setDepth(1100),
    );
    this.flags.push(
      this.add
        .text(1350, 710, "SU SEVİYESİ ↑", {
          fontFamily: "Arial",
          fontSize: "12px",
          color: "#fffbe8",
          backgroundColor: "#526f78",
          padding: { x: 5, y: 3 },
        })
        .setOrigin(0.5)
        .setDepth(1100)
        .setVisible(false),
    );
  }
  create() {
    this.session.flood.enter();
    super.create();
    this.visualTime = 0;
    this.wasLocked = false;
    this.narrationKey = "";
    this.phaseBefore = "";
    // Native controls own their taps before Phaser's global touch handler.
    const stage = this.game.canvas.parentElement?.parentElement;
    const stop = (e: TouchEvent) => {
      if (e.target instanceof Element && e.target.closest("button"))
        e.stopPropagation();
    };
    stage?.addEventListener("touchstart", stop);
    this.events.once("shutdown", () => {
      stage?.removeEventListener("touchstart", stop);
      this.stopVoice();
    });
  }
  private stopVoice() {
    if (this.narrationKey && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
    this.narrationKey = "";
  }
  configure() {
    super.configure();
    if (!this.session.settings.voice || this.session.paused) this.stopVoice();
  }
  private speak() {
    const f = this.session.flood;
    const key = f.openId === "hasan" ? FLOOD_INTRO.speech : f.feedback;
    if (
      !this.session.settings.voice ||
      !key ||
      key === this.narrationKey ||
      !("speechSynthesis" in window)
    )
      return;
    this.stopVoice();
    this.narrationKey = key;
    // Optional browser Turkish TTS; mandatory directions always remain written.
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith("tr"));
    if (!voice) return;
    const speech = new SpeechSynthesisUtterance(key);
    speech.lang = "tr-TR";
    speech.voice = voice;
    speech.rate = 0.9;
    speech.volume = 0.55;
    window.speechSynthesis.speak(speech);
  }
  protected activate(id: InteractionId) {
    const f = this.session.flood;
    if (f.locked) return;
    if (id === "floodExit") {
      this.switchTo("CitySquare");
      return;
    }
    if (id === "hasan") f.open("hasan");
    else if (id === "floodPreparedness") f.open("preparedness");
    else if (FLOOD_RISKS.some((r) => r.id === id))
      f.open(id as (typeof FLOOD_RISKS)[number]["id"]);
    this.session.notify();
  }
  protected updateWorld() {
    const f = this.session.flood,
      after =
        f.phase === "afterSimulation" ||
        f.phase === "compare" ||
        f.phase === "completed";
    const active =
      f.simulation || f.phase === "compare" || f.phase === "completed";
    if (f.phase !== this.phaseBefore) {
      this.phaseBefore = f.phase;
      const early = after && f.measures.includes("warning");
      if (this.resident && (f.simulation || !active))
        this.resident.setPosition(early ? 620 : 850, early ? 540 : 620);
    }
    this.preparedSign?.setVisible(after && f.measures.includes("planning"));
    const frame = simulationFrame(
      after ? "after" : "before",
      f.elapsed,
      f.measures,
    );
    const level = active ? frame.riverLevel : 0.2;
    const mobile = this.scale.width < 600;
    this.cameras.main.setZoom(
      mobile
        ? active
          ? 0.8
          : 0.55
        : Math.max(0.8, this.scale.width / 1920, this.scale.height / 1280),
    );
    if (f.locked) {
      const risk = FLOOD_RISKS.find((r) => r.id === f.openId);
      this.cameras.main.stopFollow();
      const x = risk
        ? (risk.x + risk.approach.x) / 2
        : active
          ? mobile
            ? 1510
            : 1330
          : 720;
      this.cameras.main.centerOn(
        x,
        risk ? risk.y + 35 : active ? (mobile ? 1100 : 730) : 650,
      );
    } else this.cameras.main.setFollowOffset(mobile ? -220 : 0, 0);
    this.water.clear();
    // A separate clipped river surface follows the right-hand stream, never the plaza.
    if (active) {
      this.water.fillStyle(0x6f9fab, 0.16 + level * 0.12);
      this.water.fillEllipse(1400, 705, 180 + level * 90, 28 + level * 30);
    }
    this.water.fillStyle(0x6aa9b6, active ? 0.12 + level * 0.16 : 0.07);
    this.water.fillPoints(
      [
        { x: 1655, y: 130 },
        { x: 1795, y: 170 },
        { x: 1830, y: 530 },
        { x: 1770, y: 900 },
        { x: 1860, y: 1280 },
        { x: 1500, y: 1280 },
        { x: 1500, y: 1000 },
        { x: 1570, y: 670 },
        { x: 1620, y: 340 },
      ],
      true,
    );
    this.water.lineStyle(2, 0xb5e4e1, 0.3);
    const motion = this.session.settings.reducedMotion
      ? 0
      : (active ? f.elapsed : this.visualTime) * 18;
    for (let i = 0; i < 11; i++) {
      const y = 250 + ((i * 88 + motion) % 940);
      const x = 1660 + Math.sin(i) * 45;
      this.water.beginPath();
      this.water.moveTo(x, y);
      this.water.lineTo(x + 36, y + 8);
      this.water.strokePath();
    }
    this.puddle
      .setVisible(active)
      .setScale(0.7 + frame.localAccumulation * 0.8);
    this.flags[1]?.setVisible(active);
    this.rain.clear();
    if (active) {
      this.rain.lineStyle(
        1,
        0x87a2b4,
        this.session.settings.reducedMotion ? 0.18 : 0.35,
      );
      for (
        let i = 0;
        i < (this.session.settings.reducedMotion ? 12 : 40);
        i++
      ) {
        const x = 500 + ((i * 173 + RAIN_SCENARIO.seed) % 1250),
          y =
            360 +
            ((i * 89 +
              (this.session.settings.reducedMotion ? 0 : f.elapsed * 180)) %
              680);
        this.rain.lineBetween(x, y, x - 5, y + 14);
      }
    }
    if (this.resident) {
      const early = after && f.measures.includes("warning");
      const safe = active && (early || f.elapsed >= 32);
      const target = safe ? { x: 620, y: 540 } : { x: 850, y: 620 };
      if (this.session.settings.reducedMotion)
        this.resident.setPosition(target.x, target.y);
      else {
        this.resident.x += (target.x - this.resident.x) * 0.035;
        this.resident.y += (target.y - this.resident.y) * 0.035;
      }
      this.resident.setDepth(this.resident.y);
    }
    // Residents remain on raised ground; no approach into risk areas.
    this.water.fillStyle(0x71915b, 0.55);
    for (let i = 0; i < 5; i++)
      this.water.fillEllipse(
        520 + i * 12,
        310 +
          (this.session.settings.reducedMotion
            ? 0
            : Math.sin(this.visualTime + i) * 2),
        4,
        2,
      );
    this.speak();
  }
  update(time: number, delta: number) {
    const f = this.session.flood;
    if (f.travel) {
      f.travel = null;
      this.switchTo("CitySquare");
      return;
    }
    if (this.session.paused || this.session.transitioning) return;
    if (f.locked !== this.wasLocked) {
      this.configure();
      this.wasLocked = f.locked;
      if (!f.locked)
        this.cameras.main.startFollow(
          this.child,
          true,
          this.session.settings.reducedMotion ? 1 : 0.09,
          this.session.settings.reducedMotion ? 1 : 0.09,
        );
    }
    this.visualTime += Math.min(delta, 50) / 1000;
    f.tick(Math.min(delta, 50) / 1000);
    if (f.locked) {
      this.updateWorld();
      this.session.nearby = null;
      this.session.notify();
      return;
    }
    super.update(time, delta);
  }
  diagnostics() {
    return {
      ...super.diagnostics(),
      floodLocked: this.session.flood.locked,
      floodRiverAccessible: false,
      waterAnimation: !this.session.settings.reducedMotion,
      voiceAvailable:
        "speechSynthesis" in window &&
        window.speechSynthesis.getVoices().some((v) => v.lang.startsWith("tr")),
      floodRainStrokes: this.session.settings.reducedMotion ? 12 : 40,
    };
  }
}
