import Phaser from "phaser";
import { AdventureScene } from "./AdventureScene";
import type { GameSession, InteractionId } from "./story";
import {
  FOREST_RISKS,
  FOREST_SAFETY,
  FOREST_INTRO,
  forestFrame,
} from "../data/forestFire";
import {
  FOREST_WORLD,
  FOREST_WALK,
  FOREST_OBSTACLES,
  FOREST_HOTSPOTS,
} from "./forestLayout";
export class CamlikForestScene extends AdventureScene {
  private smoke!: Phaser.GameObjects.Graphics;
  private visitors?: Phaser.GameObjects.Image;
  private experts: Phaser.GameObjects.Image[] = [];
  private route?: Phaser.GameObjects.Image;
  private wasLocked = false;
  private narrationKey = "";
  private smokePlume?: Phaser.GameObjects.Image;
  private managedPatch?: Phaser.GameObjects.Image;
  constructor(session: GameSession) {
    super("CamlikForest", session, {
      world: FOREST_WORLD,
      walk: FOREST_WALK,
      spawn: { x: 900, y: 970 },
      hotspots: FOREST_HOTSPOTS,
      obstacles: FOREST_OBSTACLES,
      pathfinding: true,
      cycleNearby: true,
      hideIdleHalos: true,
      followOffsetY: 0,
    });
  }
  protected preloadWorld() {
    for (const a of [
      "area",
      "elif",
      "embers",
      "brush",
      "sign",
      "managed",
      "smoke",
    ])
      this.asset("forest-" + a, `/assets/forest/${a}.png`);
    this.asset("forest-visitors", "/assets/flood/residents.png");
    this.asset("forest-board", "/assets/flood/notice.png");
  }
  private prop(key: string, x: number, y: number, width: number) {
    if (!this.textures.exists(key)) return;
    const f = this.textures.getFrame(key);
    return this.picture(key, x, y, width, (width * f.realHeight) / f.realWidth);
  }
  protected drawWorld() {
    this.picture("forest-area", 960, 1280, 1920, 1280)?.setDepth(0);
    this.smoke = this.add.graphics().setDepth(200);
    this.experts = [];
    this.smokePlume = this.prop("forest-smoke", 1560, 275, 120)
      ?.setDepth(205)
      .setVisible(false);
    this.managedPatch = this.prop("forest-managed", 1370, 920, 160)?.setVisible(
      false,
    );
    FOREST_RISKS.forEach((r) => {
      const im = this.prop("forest-" + r.asset, r.x, r.y, r.width);
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
    const elif = this.prop("forest-elif", 820, 720, 90);
    if (elif) this.props.set("elif", elif);
    this.prop("forest-board", 585, 510, 110);
    this.visitors = this.prop("forest-visitors", 720, 550, 85);
    this.route = this.prop("forest-board", 880, 1060, 75)?.setVisible(false);
    for (const dx of [0, 45]) {
      const im = this.prop("forest-elif", 1430 + dx, 380, 39)?.setVisible(
        false,
      );
      if (im) this.experts.push(im);
    }
    for (const b of FOREST_OBSTACLES.slice(3)) {
      this.add
        .zone(
          (b.left + b.right) / 2,
          (b.top + b.bottom) / 2,
          b.right - b.left,
          b.bottom - b.top,
        )
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
            if (!this.session.forest.locked && !this.session.paused)
              this.session.say([FOREST_SAFETY]);
          },
        );
    }
    // Far ridge is a read-only observation layer. Input never creates a path there.
    this.add
      .zone(1540, 220, 650, 400)
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
          const f = this.session.forest;
          if (f.locked || this.session.paused) return;
          if (f.phase === "smokeDecision") f.open("smoke");
          else this.session.say([FOREST_SAFETY]);
          this.session.notify();
        },
      );
    this.add
      .text(900, 1080, "MEYDAN ↓", {
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
    this.session.forest.enter();
    super.create();
    this.wasLocked = false;
    this.narrationKey = "";
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
    const f = this.session.forest,
      key = f.openId === "elif" ? FOREST_INTRO.elif : f.feedback;
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
    speech.volume = 0.5;
    window.speechSynthesis.speak(speech);
  }
  protected activate(id: InteractionId) {
    const f = this.session.forest;
    if (f.locked) return;
    if (id === "forestExit") {
      this.switchTo("CitySquare");
      return;
    }
    if (id === "elif") f.open("elif");
    else if (id === "forestPreparedness") f.open("preparedness");
    else if (id === "forestSmoke") f.open("smoke");
    else if (FOREST_RISKS.some((r) => r.id === id))
      f.open(id as (typeof FOREST_RISKS)[number]["id"]);
    this.session.notify();
  }
  protected updateWorld() {
    const f = this.session.forest,
      after = ["afterSimulation", "compare", "completed"].includes(f.phase),
      active = f.simulation || after;
    const frame = forestFrame(
        after ? "after" : "before",
        f.elapsed,
        f.measures,
      ),
      mobile = this.scale.width < 600;
    this.cameras.main.setZoom(
      mobile
        ? active || f.openId === "smoke"
          ? 0.64
          : 0.6
        : Math.max(0.8, this.scale.width / 1920, this.scale.height / 1280),
    );
    if (f.locked) {
      const risk = FOREST_RISKS.find((r) => r.id === f.openId);
      this.cameras.main.stopFollow();
      this.cameras.main.centerOn(
        risk
          ? (risk.x + risk.approach.x) / 2
          : active || f.openId === "smoke"
            ? mobile
              ? 1430
              : 1120
            : 820,
        risk ? risk.y + 20 : active || f.openId === "smoke" ? 500 : 650,
      );
    } else this.cameras.main.setFollowOffset(mobile ? -100 : 0, 0);
    this.route?.setVisible(active && after && f.measures.includes("routes"));
    const managed = active && frame.managedFuel;
    this.managedPatch?.setVisible(managed);
    this.props.get("forestBrush")?.setVisible(!managed);
    const directed = active && frame.visitorsDirected,
      target = directed ? { x: 860, y: 950 } : { x: 720, y: 550 };
    if (this.visitors) {
      if (this.session.settings.reducedMotion)
        this.visitors.setPosition(target.x, target.y);
      else {
        this.visitors.x += (target.x - this.visitors.x) * 0.025;
        this.visitors.y += (target.y - this.visitors.y) * 0.025;
      }
      this.visitors.setDepth(this.visitors.y);
    }
    this.experts.forEach((im) =>
      im.setVisible(active && frame.expertsNotified),
    );
    this.smoke.clear();
    const emitting = active || f.phase === "smokeDecision";
    this.smokePlume?.setVisible(emitting);
    if (emitting) {
      // One soft alpha sprite stays entirely on the distant ridge. The same
      // elapsed-time function drives both runs; reduced motion uses static stages.
      const seconds = active ? f.elapsed : 8;
      const t = this.session.settings.reducedMotion
        ? Math.floor(seconds / 14) * 14
        : seconds;
      const progress = t / 40,
        width = 180 + progress * 30;
      this.smokePlume
        ?.setPosition(1640 + (t % 20), 350)
        .setDisplaySize(width, width * 1.5)
        .setAlpha(0.7 + progress * 0.1);
      this.smoke.fillStyle(0xd99a57, 0.06);
      this.smoke.fillEllipse(1640, 350, 100, 18);
    }
    this.speak();
  }
  update(time: number, delta: number) {
    const f = this.session.forest;
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
      forestLocked: this.session.forest.locked,
      smokeVisible: this.smokePlume?.visible ?? false,
      smokeVisual: this.smokePlume
        ? {
            x: this.smokePlume.x,
            y: this.smokePlume.y,
            width: this.smokePlume.displayWidth,
            alpha: this.smokePlume.alpha,
          }
        : null,
      managedFuelArt: this.managedPatch?.visible ?? false,
      forestSmokeAnimated: !this.session.settings.reducedMotion,
      forestFrame: forestFrame(
        this.session.forest.phase === "beforeSimulation" ? "before" : "after",
        this.session.forest.elapsed,
        this.session.forest.measures,
      ),
      visitors: this.visitors
        ? { x: this.visitors.x, y: this.visitors.y }
        : null,
      expertCount: this.experts.filter((im) => im.visible).length,
    };
  }
}
