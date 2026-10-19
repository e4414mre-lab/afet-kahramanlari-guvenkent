import Phaser from "phaser";
import { AdventureScene } from "./AdventureScene";
import type { GameSession, InteractionId } from "./story";
import { HOME_ITEMS, type HomeId } from "./homeFlow";
import {
  HOME_WORLD,
  HOME_WALK,
  HOME_ASSETS,
  homeHotspots,
  homeObstacles,
  homePlacement,
} from "./homeLayout";
export class HomeScene extends AdventureScene {
  private shadows = new Map<HomeId, Phaser.GameObjects.Ellipse>();
  private fixedKey = "";
  private lockedBefore = false;
  private previousPhase = "";
  private tone?: Phaser.Sound.BaseSound;
  private pose?: Phaser.GameObjects.Image;
  private shelter?: Phaser.GameObjects.Ellipse;
  constructor(session: GameSession) {
    super("Home", session, {
      world: HOME_WORLD,
      walk: HOME_WALK,
      spawn: { x: 1040, y: 1080 },
      hotspots: homeHotspots(session.home),
      obstacles: homeObstacles(session.home),
      pathfinding: true,
      cycleNearby: true,
      hideIdleHalos: true,
      followOffsetY: 110,
    });
  }
  protected preloadWorld() {
    HOME_ASSETS.forEach(([key, name]) =>
      this.asset(key, `/assets/home/${name}.png`),
    );
    this.load.audio("home-soft", "/assets/home/drill-soft.wav");
  }
  create() {
    if (this.session.home.phase === "completed") {
      this.session.home.phase = "drillReady";
      this.session.home.close();
    }
    super.create();
    this.fixedKey = "";
    this.previousPhase = "";
    this.tone = this.cache.audio.exists("home-soft")
      ? this.sound.add("home-soft", { loop: true, volume: 0.12 })
      : undefined;
    const stage = this.game.canvas.parentElement?.parentElement;
    const stop = (e: TouchEvent) => {
      if (e.target instanceof Element && e.target.closest("button"))
        e.stopPropagation();
    };
    stage?.addEventListener("touchstart", stop);
    this.events.once("shutdown", () => {
      stage?.removeEventListener("touchstart", stop);
      this.tone?.stop();
      this.tone?.destroy();
      this.tone = undefined;
    });
  }
  private prop(key: string, x: number, y: number, width: number) {
    if (!this.textures.exists(key)) return;
    const f = this.textures.getFrame(key);
    return this.picture(key, x, y, width, (width * f.realHeight) / f.realWidth);
  }
  protected drawWorld() {
    this.shadows.clear();
    this.picture("home-room", 960, 1280, 1920, 1280)?.setDepth(0);
    // Low decorative objects stay on the built-in cabinet, outside all walkways.
    this.prop("home-plant-books", 570, 315, 105);
    this.add.ellipse(1480, 620, 165, 30, 0x4b3c28, 0.14).setDepth(624.9);
    this.prop("home-sofa", 1480, 625, 230);
    HOME_ITEMS.forEach((o) => {
      const p = homePlacement(o.id, this.session.home);
      if (o.id !== "homeDecor")
        this.shadows.set(
          o.id,
          this.add
            .ellipse(
              p.x,
              p.y - 3,
              p.width * 0.72,
              p.width * 0.14,
              0x4b3c28,
              0.14,
            )
            .setDepth(p.y - 0.1)
            .setVisible(o.id !== "homeHeavy"),
        );
      const image = this.prop("home-" + o.asset, p.x, p.y, p.width);
      if (image) this.props.set(o.id, image);
    });
    this.shelter = this.add
      .ellipse(1060, 805, 210, 55, 0xc8e6c2, 0.18)
      .setStrokeStyle(2, 0xc8e6c2, 0.7)
      .setDepth(1)
      .setVisible(false);
    this.pose = this.prop("home-protect", 1050, 830, 64)
      ?.setDepth(829.8)
      .setVisible(false);
    this.add
      .text(1110, 1075, "ÇIKIŞ ↓", {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#fffbe8",
        backgroundColor: "#416d60",
        padding: { x: 7, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(1200);
  }
  protected activate(id: InteractionId) {
    const h = this.session.home;
    if (h.locked) return;
    if (id === "homeExit") {
      const next = h.exit();
      if (next === "gathering") this.switchTo("GatheringPoint");
      else if (next === "city") this.switchTo("CitySquare");
    } else if (HOME_ITEMS.some((o) => o.id === id)) {
      h.open(id as HomeId);
      this.session.notify();
    }
  }
  configure() {
    super.configure();
    if (this.session.settings.reducedMotion)
      this.cameras?.main?.shakeEffect.reset();
    if (!this.session.settings.effects || this.session.paused)
      this.tone?.stop();
  }
  protected updateWorld() {
    const h = this.session.home,
      key = JSON.stringify(h.findings);
    if (key !== this.fixedKey) {
      this.fixedKey = key;
      this.definition.obstacles = homeObstacles(h);
      HOME_ITEMS.forEach((o) => {
        const p = homePlacement(o.id, h),
          image = this.props.get(o.id);
        this.shadows
          .get(o.id)
          ?.setPosition(p.x, p.y - 3)
          .setDepth(p.y - 0.1)
          .setVisible(o.id !== "homeHeavy" || h.findings[o.id] === "fixed");
        image
          ?.setPosition(p.x, p.y)
          .setDepth(p.y)
          .setTint(h.findings[o.id] === "fixed" ? 0xf1ffe6 : 0xffffff);
        if (image) {
          const frame = image.frame;
          image.setDisplaySize(
            p.width,
            (p.width * frame.realHeight) / frame.realWidth,
          );
        }
        const spot = this.definition.hotspots.find((s) => s.id === o.id)!;
        spot.x = p.approach.x;
        spot.y = p.approach.y;
        spot.hit = {
          x: p.x,
          y: p.y - (image?.displayHeight ?? 150) / 2,
          width: p.width,
          height: image?.displayHeight ?? 150,
        };
        this.zones
          .get(o.id)
          ?.setPosition(spot.hit.x, spot.hit.y)
          .setSize(spot.hit.width, spot.hit.height);
      });
    }
    const exitSpot = this.definition.hotspots.find((s) => s.id === "homeExit");
    if (exitSpot)
      exitSpot.name = h.evacuation
        ? "Buluşma alanına güvenli çıkış"
        : "Meydana dön";
    this.shelter?.setVisible(h.protected);
    this.pose?.setVisible(h.protected);
    this.child?.setVisible(!h.protected);
    this.robot?.setVisible(true);
    if (h.phase !== this.previousPhase) {
      this.previousPhase = h.phase;
      if (h.phase === "shaking" && !this.session.settings.reducedMotion)
        this.cameras.main.shake(450, 0.0012);
    }
    if (
      h.phase === "shaking" &&
      !this.session.paused &&
      this.session.settings.effects
    ) {
      if (!this.tone?.isPlaying) this.tone?.play();
    } else this.tone?.stop();
  }
  update(time: number, delta: number) {
    if (this.session.paused || this.session.transitioning) {
      this.tone?.stop();
      return;
    }
    const locked = this.session.home.locked;
    if (locked !== this.lockedBefore) {
      this.configure();
      this.lockedBefore = locked;
    }
    this.session.home.tick(Math.min(delta, 50) / 1000);
    this.updateWorld();
    if (this.session.home.locked) {
      this.session.nearby = null;
      this.session.notify();
      return;
    }
    super.update(time, delta);
  }
  diagnostics() {
    return {
      ...super.diagnostics(),
      homeAudioPlaying: this.tone?.isPlaying ?? false,
      homeShakeActive: this.cameras.main.shakeEffect.isRunning,
      protectedPoseVisible: this.pose?.visible ?? false,
    };
  }
}
export class GatheringPointScene extends AdventureScene {
  constructor(session: GameSession) {
    super("GatheringPoint", session, {
      world: HOME_WORLD,
      walk: HOME_WALK,
      spawn: { x: 1000, y: 1080 },
      hotspots: [
        {
          id: "gatherHere",
          name: "Belirlenmiş buluşma noktası",
          x: 1000,
          y: 710,
          radius: 85,
          hit: { x: 1000, y: 700, width: 220, height: 160 },
        },
      ],
      pathfinding: true,
      cycleNearby: true,
      hideIdleHalos: true,
    });
  }
  protected preloadWorld() {
    this.asset("home-courtyard", "/assets/home/courtyard.png");
  }
  protected drawWorld() {
    this.picture("home-courtyard", 960, 1280, 1920, 1280)?.setDepth(0);
  }
  protected activate(id: InteractionId) {
    if (id === "gatherHere") {
      this.session.home.gather();
      this.session.notify();
    }
  }
  update(time: number, delta: number) {
    const h = this.session.home;
    if (h.travel) {
      const next = h.travel;
      h.travel = null;
      this.switchTo(next === "home" ? "Home" : "CitySquare");
      return;
    }
    if (h.phase === "completed") {
      this.configure();
      this.session.notify();
      return;
    }
    super.update(time, delta);
  }
}
