import { AdventureScene } from "./AdventureScene";
import type { GameSession, InteractionId } from "./story";
import {
  HALL_WORLD,
  HALL_WALK,
  HALL_HOTSPOTS,
  HALL_OBSTACLES,
  HALL_ASSETS,
} from "./townHallData";
export class TownHallScene extends AdventureScene {
  private wasPlanning = false;
  private schoolPin?: Phaser.GameObjects.Ellipse;
  constructor(session: GameSession) {
    super("TownHall", session, {
      world: HALL_WORLD,
      walk: HALL_WALK,
      spawn: { x: 760, y: 820 },
      hotspots: HALL_HOTSPOTS,
      obstacles: HALL_OBSTACLES,
    });
  }
  protected preloadWorld() {
    HALL_ASSETS.forEach(([key, path]) => this.asset(key, path));
  }
  protected drawWorld() {
    this.picture(
      "hall-room",
      HALL_WORLD.width / 2,
      HALL_WORLD.height,
      HALL_WORLD.width,
      HALL_WORLD.height,
    )?.setDepth(0);
    const props = [
      ["certificate", "hall-desk", 720, 555, 300],
      ["mayor", "hall-mayor", 1000, 500, 94],
      ["plan", "hall-plan", 400, 570, 205],
      ["journal", "hall-journal", 1180, 715, 142],
    ] as const;
    props.forEach(([id, key, x, y, w]) => {
      if (!this.textures.exists(key)) return;
      const frame = this.textures.getFrame(key);
      const image = this.picture(
        key,
        x,
        y,
        w,
        (w * frame.realHeight) / frame.realWidth,
      );
      if (image) this.props.set(id, image);
    });
    this.schoolPin = this.add
      .ellipse(441, 410, 38, 15, 0xf5bc69, 0.24)
      .setStrokeStyle(2, 0xf5bc69)
      .setDepth(571);
  }
  protected activate(id: InteractionId) {
    if (this.session.day3.active) {
      if (this.session.day3.open) return;
      if (id === "plan" || id === "journal" || id === "mayor") {
        this.session.day3.show();
        this.configure();
        this.session.notify();
        return;
      }
      if (id === "exit") {
        this.session.day3.close();
        this.session.day3.active = false;
        this.switchTo("CitySquare");
        return;
      }
    }
    if (id === "exit") this.switchTo("CitySquare");
    else this.session.interact(id);
  }
  configure() {
    super.configure();
    if (
      this.session.day3.active &&
      this.session.day3.open &&
      this.input?.keyboard
    )
      this.input.keyboard.enabled = false;
  }
  update(time: number, delta: number) {
    const locked = this.session.day3.active && this.session.day3.open;
    if (locked !== this.wasPlanning) {
      this.configure();
      this.wasPlanning = locked;
    }
    if (locked) {
      if (!this.session.paused) {
        this.session.day3.tick(Math.min(delta, 50) / 1000);
        this.session.notify();
      }
      return;
    }
    super.update(time, delta);
  }
  protected updateWorld() {
    this.schoolPin?.setVisible(
      this.session.quest === "reviewCityPlan" ||
        this.session.quest === "goToSchool",
    );
  }
}
