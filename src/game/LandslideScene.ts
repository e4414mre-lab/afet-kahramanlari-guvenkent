import Phaser from "phaser";
import { AdventureScene } from "./AdventureScene";
import type { GameSession, InteractionId } from "./story";
import {
  LANDSLIDE_RISKS,
  LANDSLIDE_SAFETY,
  LANDSLIDE_INTRO,
  landslideFrame,
} from "../data/landslide";
import {
  LANDSLIDE_WORLD,
  LANDSLIDE_WALK,
  LANDSLIDE_OBSTACLES,
  LANDSLIDE_HOTSPOTS,
} from "./landslideLayout";
export class LandslideScene extends AdventureScene {
  private rain!: Phaser.GameObjects.Graphics;
  private flow!: Phaser.GameObjects.Graphics;
  private earth?: Phaser.GameObjects.Image;
  private residents?: Phaser.GameObjects.Image;
  private plan?: Phaser.GameObjects.Image;
  private route?: Phaser.GameObjects.Image;
  private roadLabel?: Phaser.GameObjects.Text;
  private wasLocked = false;
  private narrationKey = "";
  private lastVolume = 0.5;
  constructor(session: GameSession) {
    super("Landslide", session, {
      world: LANDSLIDE_WORLD,
      walk: LANDSLIDE_WALK,
      spawn: { x: 900, y: 970 },
      hotspots: LANDSLIDE_HOTSPOTS,
      obstacles: LANDSLIDE_OBSTACLES,
      pathfinding: true,
      cycleNearby: true,
      hideIdleHalos: true,
      followOffsetY: 0,
    });
  }
  protected preloadWorld() {
    for (const a of ["area", "murat", "crack", "house", "drain", "earth"])
      this.asset("landslide-" + a, `/assets/landslide/${a}.png`);
    this.asset("landslide-residents", "/assets/flood/residents.png");
    this.asset("landslide-board", "/assets/flood/notice.png");
  }
  private prop(key: string, x: number, y: number, width: number) {
    if (!this.textures.exists(key)) return;
    const f = this.textures.getFrame(key);
    return this.picture(key, x, y, width, (width * f.realHeight) / f.realWidth);
  }
  protected drawWorld() {
    this.picture("landslide-area", 960, 1280, 1920, 1280)?.setDepth(0);
    this.flow = this.add.graphics().setDepth(1100);
    this.rain = this.add.graphics().setDepth(2500);
    this.earth = this.prop("landslide-earth", 1480, 870, 190)?.setVisible(
      false,
    );
    LANDSLIDE_RISKS.forEach((r) => {
      const im = this.prop("landslide-" + r.asset, r.x, r.y, r.width);
      if (im) {
        this.props.set(r.id, im);
        this.definition.hotspots.find((h) => h.id === r.id)!.hit = {
          x: r.x,
          y: r.y - im.displayHeight / 2,
          width: r.width,
          height: im.displayHeight,
        };
      }
    });
    const murat = this.prop("landslide-murat", 820, 720, 85);
    if (murat) this.props.set("murat", murat);
    this.prop("landslide-board", 585, 510, 110);
    this.residents = this.prop("landslide-residents", 720, 550, 85);
    this.plan = this.prop("landslide-board", 650, 480, 75)?.setVisible(false);
    this.route = this.prop("landslide-board", 910, 1020, 65)?.setVisible(false);
    const warn = (
      _p: unknown,
      _x: unknown,
      _y: unknown,
      e: Phaser.Types.Input.EventData,
    ) => {
      e.stopPropagation();
      if (!this.session.landslide.locked && !this.session.paused)
        this.session.say([LANDSLIDE_SAFETY]);
    };
    // Right-side staircase blocks taps and navigation; only safe observation
    // approaches are targets of higher-priority object hotspots.
    for (const b of LANDSLIDE_OBSTACLES.slice(3))
      this.add
        .zone(
          (b.left + b.right) / 2,
          (b.top + b.bottom) / 2,
          b.right - b.left,
          b.bottom - b.top,
        )
        .setDepth(2900)
        .setInteractive()
        .on("pointerdown", warn);
    this.add
      .zone(1550, 210, 700, 420)
      .setDepth(2900)
      .setInteractive()
      .on("pointerdown", warn);
    this.roadLabel = this.add
      .text(1520, 600, "YOL KAPALI", {
        fontFamily: "Arial",
        fontSize: "12px",
        color: "#fff8e1",
        backgroundColor: "#786242",
        padding: { x: 5, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(1200);
    this.add
      .text(900, 1070, "MEYDAN ↓", {
        fontFamily: "Arial",
        fontSize: "12px",
        color: "#fffbe8",
        backgroundColor: "#496c55",
        padding: { x: 5, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(1200);
  }
  create() {
    this.session.landslide.enter();
    super.create();
    this.wasLocked = false;
    this.narrationKey = "";
    const stage = this.game.canvas.parentElement?.parentElement;
    const stop = (e: TouchEvent) => {
      if (e.target instanceof Element && e.target.closest("button, select"))
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
    const f = this.session.landslide;
    if (f.voiceVolume !== this.lastVolume) {
      this.stopVoice();
      this.lastVolume = f.voiceVolume;
    }
    const key = f.openId === "murat" ? LANDSLIDE_INTRO.murat : f.feedback;
    if (
      !this.session.settings.voice ||
      !key ||
      key === this.narrationKey ||
      !("speechSynthesis" in window)
    )
      return;
    this.stopVoice();
    this.narrationKey = key;
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("tr"));
    if (!voice) return;
    const speech = new SpeechSynthesisUtterance(key);
    speech.lang = "tr-TR";
    speech.voice = voice;
    speech.rate = 0.9;
    speech.volume = f.voiceVolume;
    window.speechSynthesis.speak(speech);
  }

  protected activate(id: InteractionId) {
    const f = this.session.landslide;
    if (f.locked) return;
    if (id === "landslideExit") {
      this.switchTo("CitySquare");
      return;
    }
    if (id === "murat") f.open("murat");
    else if (id === "landslidePreparedness") f.open("preparedness");
    else if (LANDSLIDE_RISKS.some((r) => r.id === id))
      f.open(id as (typeof LANDSLIDE_RISKS)[number]["id"]);
    this.session.notify();
  }
  protected updateWorld() {
    const f = this.session.landslide,
      after = ["afterSimulation", "compare", "completed"].includes(f.phase),
      active = f.simulation || after;
    const frame = landslideFrame(
        after ? "after" : "before",
        f.elapsed,
        f.measures,
      ),
      mobile = this.scale.width < 600,
      reduced = this.session.settings.reducedMotion;
    this.cameras.main.setZoom(
      mobile
        ? active
          ? 0.63
          : 0.52
        : Math.max(0.8, this.scale.width / 1920, this.scale.height / 1280),
    );
    if (f.locked) {
      const r = LANDSLIDE_RISKS.find((r) => r.id === f.openId);
      this.cameras.main.stopFollow();
      this.cameras.main.centerOn(
        r
          ? mobile
            ? r.x
            : (r.x + r.approach.x) / 2
          : active
            ? mobile
              ? 1390
              : 1120
            : 820,
        r ? r.y + (mobile ? 230 : 20) : active ? (mobile ? 820 : 600) : 650,
      );
    } else this.cameras.main.setFollowOffset(mobile ? -220 : 0, 0);
    this.plan?.setVisible(active && frame.surveyPlanned);
    this.route?.setVisible(active && frame.warningEarly);
    const stage = reduced ? Math.floor(f.elapsed / 20) / 2 : f.elapsed / 40;
    // Only this small remote soil patch moves. The crack, houses and platform
    // are not translated; neither run makes the susceptible slope disappear.
    this.earth
      ?.setVisible(active)
      .setPosition(1480 + stage * 8, 870 + stage * 12);
    if (this.residents) {
      // Reproducible initial positions for both runs, independent of frame rate
      // or the previous trial; prepared guidance changes departure, not origin.
      const progress = reduced
        ? frame.residentsDirected
          ? 1
          : 0
        : frame.residentProgress;
      this.residents
        .setPosition(720 + 140 * progress, 550 + 400 * progress)
        .setDepth(550 + 400 * progress);
    }
    this.roadLabel?.setVisible(active);
    this.flow.clear();
    this.rain.clear();
    if (active) {
      this.flow.lineStyle(2 + frame.localRunoff * 3, 0x759fa2, 0.45);
      this.flow.beginPath();
      this.flow.moveTo(1330, 810);
      this.flow.lineTo(1340, 880);
      this.flow.lineTo(1320, 950);
      this.flow.strokePath();
      const t = reduced ? Math.floor(f.elapsed / 20) * 20 : f.elapsed;
      this.rain.lineStyle(1, 0x809aa9, reduced ? 0.17 : 0.3);
      for (let i = 0; i < (reduced ? 8 : 28); i++) {
        const x = 1050 + ((i * 127 + 83) % 700),
          y = 280 + ((i * 71 + (reduced ? 0 : t * 110)) % 750);
        this.rain.lineBetween(x, y, x - 4, y + 12);
      }
    }
    this.speak();
  }
  update(time: number, delta: number) {
    const f = this.session.landslide;
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
    const dt = Math.min(delta, 50) / 1000;
    f.tick(dt);
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
      landslideLocked: this.session.landslide.locked,
      landslideAnimated: !this.session.settings.reducedMotion,
      landslideFrame: landslideFrame(
        this.session.landslide.phase === "beforeSimulation"
          ? "before"
          : "after",
        this.session.landslide.elapsed,
        this.session.landslide.measures,
      ),
      earthVisual: this.earth
        ? { x: this.earth.x, y: this.earth.y, visible: this.earth.visible }
        : null,
      residents: this.residents
        ? { x: this.residents.x, y: this.residents.y }
        : null,
    };
  }
}
