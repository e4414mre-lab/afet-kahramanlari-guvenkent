import Phaser from "phaser";
import type { Settings } from "../lib/settings";
import {
  interact,
  nearest,
  WALK,
  WORLD,
  LOCATIONS,
  type QuestState,
  type CityStatus,
} from "./cityModel";
export type CityControls = { x: number; y: number; interact: boolean };
export class CitySquareScene extends Phaser.Scene {
  private child!: Phaser.GameObjects.Container;
  private robot!: Phaser.GameObjects.Container;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private target?: Phaser.Math.Vector2;
  private quest: QuestState = "meet";
  private dialogue = "AFİ: Merhaba! Önce soldaki belediyenin önüne yürüyelim.";
  private lastStatus = "";
  private elapsed = 0;
  private paused = false;
  configure(settings: Settings, paused: boolean) {
    this.settings = settings;
    this.paused = paused;
    this.target = undefined;
    this.controls.x = 0;
    this.controls.y = 0;
    if (this.keys) Object.values(this.keys).forEach((k) => k.reset());
  }
  private halos: Phaser.GameObjects.Ellipse[] = [];
  constructor(
    private settings: Settings,
    private controls: CityControls,
    private report: (s: CityStatus) => void,
  ) {
    super("CitySquare");
  }
  preload() {
    this.load.image("city", "/assets/city/square-concept.png");
    this.load.image("cagri", "/assets/city/cagri-concept.png");
    this.load.image("afi", "/assets/city/afi-concept.png");
  }
  create() {
    this.add
      .image(0, 0, "city")
      .setOrigin(0)
      .setDisplaySize(WORLD.width, WORLD.height);
    // Separate, original illustrated stand-ins; never baked into the background.
    this.child = this.makeChild(670, 790);
    this.robot = this.makeRobot(615, 810);
    LOCATIONS.forEach((p) => {
      const halo = this.add
        .ellipse(p.x, p.y, 90, 28, 0xffe7a8, 0.23)
        .setStrokeStyle(2, 0xfff1bc, 0.8)
        .setDepth(2);
      this.halos.push(halo);
    });
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    this.cameras.main.setZoom(
      Math.max(
        0.8,
        this.scale.width / WORLD.width,
        this.scale.height / WORLD.height,
      ),
    );
    this.cameras.main.startFollow(
      this.child,
      true,
      this.settings.reducedMotion ? 1 : 0.09,
      this.settings.reducedMotion ? 1 : 0.09,
    );
    this.keys = this.input.keyboard?.addKeys(
      "W,A,S,D,UP,DOWN,LEFT,RIGHT,E",
    ) as typeof this.keys;
    this.input.keyboard?.addCapture(["UP", "DOWN", "LEFT", "RIGHT", "SPACE"]);
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const p = pointer.positionToCamera(
        this.cameras.main,
      ) as Phaser.Math.Vector2;
      this.target = new Phaser.Math.Vector2(
        Phaser.Math.Clamp(p.x, WALK.left, WALK.right),
        Phaser.Math.Clamp(p.y, WALK.top, WALK.bottom),
      );
    });
    const clear = () => {
      this.target = undefined;
      this.controls.x = 0;
      this.controls.y = 0;
      Object.values(this.keys ?? {}).forEach((k) => k.reset());
    };
    this.game.events.on("blur", clear);
    this.events.once("shutdown", () => this.game.events.off("blur", clear));
    this.publish();
  }
  private makeChild(x: number, y: number) {
    const shadow = this.add.ellipse(0, 0, 32, 10, 0x203f43, 0.2);
    const sprite = this.add
      .image(0, 1, "cagri")
      .setOrigin(0.5, 1)
      .setDisplaySize(66, 99);
    return this.add.container(x, y, [shadow, sprite]).setDepth(y);
  }
  private makeRobot(x: number, y: number) {
    const shadow = this.add.ellipse(0, 0, 27, 9, 0x214950, 0.2);
    const body = this.add
      .image(0, -30, "afi")
      .setDisplaySize(40, 47)
      .setName("body");
    return this.add.container(x, y, [shadow, body]).setDepth(y);
  }
  private publish() {
    const status = {
      quest: this.quest,
      nearby: nearest(this.child)?.name ?? null,
      dialogue: this.dialogue,
    };
    const key = JSON.stringify(status);
    if (key !== this.lastStatus) {
      this.lastStatus = key;
      this.report(status);
    }
  }
  update(_time: number, delta: number) {
    if (!this.child || this.paused) return;
    this.cameras.main.setZoom(
      Math.max(
        0.8,
        this.scale.width / WORLD.width,
        this.scale.height / WORLD.height,
      ),
    );
    this.cameras.main.setLerp(this.settings.reducedMotion ? 1 : 0.09);
    const dt = Math.min(delta, 50) / 1000;
    this.elapsed += dt;
    const down = (key: string) => (this.keys?.[key]?.isDown ? 1 : 0);
    const dir = new Phaser.Math.Vector2(
      down("D") + down("RIGHT") - down("A") - down("LEFT") + this.controls.x,
      down("S") + down("DOWN") - down("W") - down("UP") + this.controls.y,
    );
    if (dir.lengthSq() > 0) this.target = undefined;
    else if (this.target) {
      dir.set(this.target.x - this.child.x, this.target.y - this.child.y);
      if (dir.length() < 5) {
        dir.set(0, 0);
        this.target = undefined;
      }
    }
    if (dir.lengthSq() > 0) {
      dir
        .normalize()
        .scale(
          Math.min(
            225 * dt,
            this.target
              ? Phaser.Math.Distance.Between(
                  this.child.x,
                  this.child.y,
                  this.target.x,
                  this.target.y,
                )
              : Infinity,
          ),
        );
      this.child.x = Phaser.Math.Clamp(
        this.child.x + dir.x,
        WALK.left,
        WALK.right,
      );
      this.child.y = Phaser.Math.Clamp(
        this.child.y + dir.y,
        WALK.top,
        WALK.bottom,
      );
    }
    this.child.setDepth(this.child.y);
    const follow = new Phaser.Math.Vector2(
      this.child.x - 48 - this.robot.x,
      this.child.y + 18 - this.robot.y,
    );
    if (follow.length() > 4) {
      follow.scale(Math.min(1, dt * 4));
      this.robot.x += follow.x;
      this.robot.y += follow.y;
    }
    this.robot.setDepth(this.robot.y);

    (this.robot.getByName("body") as Phaser.GameObjects.Image).y =
      -30 + (this.settings.reducedMotion ? 0 : Math.sin(this.elapsed * 3) * 4);
    const active = nearest(this.child);
    this.halos.forEach((h, i) => {
      h.setAlpha(active?.id === LOCATIONS[i].id ? 1 : 0.45);
      h.setStrokeStyle(
        2,
        this.quest === "complete" && LOCATIONS[i].id === "school"
          ? 0x8ee5c0
          : 0xfff1bc,
        0.8,
      );
    });
    if (
      this.controls.interact ||
      (this.keys?.E && Phaser.Input.Keyboard.JustDown(this.keys.E))
    ) {
      this.controls.interact = false;
      if (active) {
        const result = interact(this.quest, active.id);
        this.quest = result.quest;
        this.dialogue = result.dialogue;
      }
    }
    // School arrival completes the accepted first task.
    if (active?.id === "school" && this.quest === "school") {
      const result = interact(this.quest, "school");
      this.quest = result.quest;
      this.dialogue = result.dialogue;
    }
    this.publish();
  }
}
