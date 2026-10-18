import Phaser from "phaser";
import type { GameSession, SceneId, InteractionId } from "./story";
import { closest, blocked, type Hotspot, type Obstacle } from "./townHallData";

type Definition = {
  world: { width: number; height: number };
  walk: { left: number; right: number; top: number; bottom: number };
  spawn: { x: number; y: number };
  hotspots: readonly Hotspot[];
  obstacles?: readonly Obstacle[];
};
/** Shared original movement/camera rules; each scene owns only its art and interactions. */
export abstract class AdventureScene extends Phaser.Scene {
  protected child!: Phaser.GameObjects.Container;
  protected robot!: Phaser.GameObjects.Container;
  protected props = new Map<InteractionId, Phaser.GameObjects.Image>();
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private target?: Phaser.Math.Vector2;
  private selected?: Hotspot;
  private elapsed = 0;
  private actionQueued = false;
  private hintQueued = false;
  private halos: Phaser.GameObjects.Ellipse[] = [];
  constructor(
    readonly sceneId: SceneId,
    protected session: GameSession,
    protected definition: Definition,
  ) {
    super(sceneId);
  }
  protected abstract drawWorld(): void;
  protected abstract activate(id: InteractionId): void;
  protected updateWorld(): void {}
  protected preloadWorld(): void {}
  preload() {
    const fail = (file: Phaser.Loader.File) => {
      if (!this.session.assetErrors.includes(file.key))
        this.session.assetErrors.push(file.key);
      this.session.notify();
    };
    const restored = (key: string) => {
      this.session.assetErrors = this.session.assetErrors.filter(
        (k) => k !== key,
      );
      this.session.notify();
    };
    this.load.on("loaderror", fail);
    this.load.on("filecomplete", restored);
    this.events.once("shutdown", () => {
      this.load.off("loaderror", fail);
      this.load.off("filecomplete", restored);
    });
    this.asset("cagri", "/assets/city/cagri-concept.png");
    this.asset("afi", "/assets/city/afi-concept.png");
    this.preloadWorld();
  }
  protected asset(key: string, path: string) {
    if (!this.textures.exists(key)) this.load.image(key, path);
  }
  protected picture(
    key: string,
    x: number,
    y: number,
    width: number,
    height: number,
    originY = 1,
  ) {
    if (!this.textures.exists(key)) return undefined;
    return this.add
      .image(x, y, key)
      .setOrigin(0.5, originY)
      .setDisplaySize(width, height)
      .setDepth(y);
  }
  create() {
    this.props.clear();
    this.halos = [];
    this.target = undefined;
    this.selected = undefined;
    this.elapsed = 0;
    this.session.scene = this.sceneId;
    this.session.transitioning = false;
    this.drawWorld();
    const pos = this.session.positions[this.sceneId] ?? this.definition.spawn;
    const shadow = this.add.ellipse(0, 0, 32, 10, 0x203f43, 0.2);
    const sprite = this.picture("cagri", 0, 1, 66, 99);
    this.child = this.add
      .container(pos.x, pos.y, sprite ? [shadow, sprite] : [shadow])
      .setDepth(pos.y);
    const robotShadow = this.add.ellipse(0, 0, 27, 9, 0x214950, 0.2);
    const robotBody = this.picture("afi", 0, -30, 40, 47, 0.5)?.setName("body");
    this.robot = this.add
      .container(
        pos.x - 48,
        pos.y + 18,
        robotBody ? [robotShadow, robotBody] : [robotShadow],
      )
      .setDepth(pos.y + 18);
    robotBody
      ?.setInteractive()
      .on(
        "pointerdown",
        (
          _p: unknown,
          _x: unknown,
          _y: unknown,
          event: Phaser.Types.Input.EventData,
        ) => {
          event.stopPropagation();
          if (!this.session.paused) this.session.hint();
        },
      );
    this.definition.hotspots.forEach((h) => {
      const halo = this.add
        .ellipse(h.x, h.y, 76, 22, 0xffe7a8, 0.16)
        .setStrokeStyle(2, 0xfff1bc, 0.65)
        .setDepth(2);
      this.halos.push(halo);
      this.add
        .zone(h.hit.x, h.hit.y, h.hit.width, h.hit.height)
        .setDepth(3000)
        .setInteractive()
        .on(
          "pointerdown",
          (
            _p: unknown,
            _x: unknown,
            _y: unknown,
            event: Phaser.Types.Input.EventData,
          ) => {
            event.stopPropagation();
            this.select(h);
          },
        );
    });
    const { world } = this.definition;
    this.cameras.main.setBounds(0, 0, world.width, world.height);
    this.resizeCamera();
    this.cameras.main.startFollow(
      this.child,
      true,
      this.session.settings.reducedMotion ? 1 : 0.09,
      this.session.settings.reducedMotion ? 1 : 0.09,
    );
    this.keys = this.input.keyboard?.addKeys(
      "W,A,S,D,UP,DOWN,LEFT,RIGHT,E,ENTER,H",
    ) as typeof this.keys;
    this.input.keyboard?.addCapture(["UP", "DOWN", "LEFT", "RIGHT", "SPACE"]);
    const ground = (pointer: Phaser.Input.Pointer) => {
      if (
        this.session.paused ||
        this.session.dialogue ||
        this.session.transitioning
      )
        return;
      const p = pointer.positionToCamera(
        this.cameras.main,
      ) as Phaser.Math.Vector2;
      const { walk } = this.definition;
      this.selected = undefined;
      this.target = new Phaser.Math.Vector2(
        Phaser.Math.Clamp(p.x, walk.left, walk.right),
        Phaser.Math.Clamp(p.y, walk.top, walk.bottom),
      );
    };
    // Keep short taps until update: Key.JustDown can be erased by keyup
    // when a press and release are processed in the same slow frame.
    const action = (event: KeyboardEvent) => {
      if (event.repeat || this.session.paused || this.session.transitioning)
        return;
      const button = document.activeElement;
      if (
        event.key === "Enter" &&
        button instanceof HTMLButtonElement &&
        !button.disabled
      )
        return;
      this.actionQueued = true;
    };
    const hint = (event: KeyboardEvent) => {
      if (!event.repeat && !this.session.paused && !this.session.transitioning)
        this.hintQueued = true;
    };
    this.input.keyboard?.on("keydown-E", action);
    this.input.keyboard?.on("keydown-ENTER", action);
    this.input.keyboard?.on("keydown-H", hint);
    const clear = () => this.clearInput();
    this.input.on("pointerdown", ground);
    this.game.events.on("blur", clear);
    this.events.once("shutdown", () => {
      this.clearInput();
      this.input.off("pointerdown", ground);
      this.game.events.off("blur", clear);
      this.input.keyboard?.off("keydown-E", action);
      this.input.keyboard?.off("keydown-ENTER", action);
      this.input.keyboard?.off("keydown-H", hint);
      this.input.keyboard?.removeCapture([
        "UP",
        "DOWN",
        "LEFT",
        "RIGHT",
        "SPACE",
      ]);
    });
    if (!this.session.settings.reducedMotion) this.cameras.main.fadeIn(160);
    this.configure();
    this.publish();
  }
  configure() {
    this.clearInput();
    if (this.input?.keyboard)
      this.input.keyboard.enabled = !this.session.paused;
  }
  private clearInput() {
    this.target = undefined;
    this.selected = undefined;
    this.actionQueued = false;
    this.hintQueued = false;
    const c = this.session.controls;
    c.x = 0;
    c.y = 0;
    c.interact = false;
    c.next = false;
    c.hint = false;
    Object.values(this.keys ?? {}).forEach((k) => k.reset());
  }
  private resizeCamera() {
    const { world } = this.definition;
    this.cameras.main.setZoom(
      Math.max(
        0.8,
        this.scale.width / world.width,
        this.scale.height / world.height,
      ),
    );
  }
  private select(h: Hotspot) {
    if (
      this.session.paused ||
      this.session.dialogue ||
      this.session.transitioning
    )
      return;
    if (Math.hypot(this.child.x - h.x, this.child.y - h.y) < h.radius) {
      this.clearInput();
      this.activate(h.id);
    } else {
      this.selected = h;
      this.target = new Phaser.Math.Vector2(h.x, h.y);
    }
  }
  protected switchTo(next: SceneId) {
    if (this.session.transitioning) return;
    this.session.positions[this.sceneId] = { x: this.child.x, y: this.child.y };
    this.clearInput();
    this.session.dialogue = null;
    this.session.nearby = null;
    this.session.transitioning = true;
    this.session.notify();
    const start = () => this.scene.start(next);
    if (this.session.settings.reducedMotion) start();
    else {
      this.cameras.main.fadeOut(160);
      this.time.delayedCall(160, start);
    }
  }
  protected publish() {
    this.session.nearby =
      closest(this.child, this.definition.hotspots)?.name ?? null;
    this.session.notify();
  }
  update(_time: number, delta: number) {
    if (!this.child || this.session.paused || this.session.transitioning)
      return;
    this.resizeCamera();
    this.cameras.main.setLerp(this.session.settings.reducedMotion ? 1 : 0.09);
    const trigger = this.actionQueued || this.session.controls.interact;
    this.actionQueued = false;
    if (this.hintQueued || this.session.controls.hint) {
      this.hintQueued = false;
      this.session.controls.hint = false;
      this.session.hint();
    }
    if (this.session.controls.next) {
      this.session.controls.next = false;
      this.session.next();
    } else if (trigger) {
      this.session.controls.interact = false;
      if (this.session.dialogue) this.session.next();
      else {
        const active = closest(this.child, this.definition.hotspots);
        if (active) {
          this.clearInput();
          this.activate(active.id);
        }
      }
    }
    if (this.session.transitioning) return;
    const dt = Math.min(delta, 50) / 1000;
    this.elapsed += dt;
    const down = (k: string) => (this.keys?.[k]?.isDown ? 1 : 0);
    const c = this.session.controls;
    const dir = new Phaser.Math.Vector2(
      down("D") + down("RIGHT") - down("A") - down("LEFT") + c.x,
      down("S") + down("DOWN") - down("W") - down("UP") + c.y,
    );
    if (this.session.dialogue) {
      dir.set(0, 0);
      this.target = undefined;
      this.selected = undefined;
    } else if (dir.lengthSq() > 0) {
      this.target = undefined;
      this.selected = undefined;
    } else if (this.target) {
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
      const { walk, obstacles = [] } = this.definition;
      const x = Phaser.Math.Clamp(this.child.x + dir.x, walk.left, walk.right),
        y = Phaser.Math.Clamp(this.child.y + dir.y, walk.top, walk.bottom);
      if (!blocked(x, this.child.y, obstacles)) this.child.x = x;
      if (!blocked(this.child.x, y, obstacles)) this.child.y = y;
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
    const body = this.robot.getByName("body") as
      | Phaser.GameObjects.Image
      | undefined;
    if (body)
      body.y =
        -30 +
        (this.session.settings.reducedMotion
          ? 0
          : Math.sin(this.elapsed * 3) * 4);
    if (
      this.selected &&
      Math.hypot(
        this.child.x - this.selected.x,
        this.child.y - this.selected.y,
      ) <
        this.selected.radius * 0.55
    ) {
      const h = this.selected;
      this.clearInput();
      this.activate(h.id);
    }
    const active = closest(this.child, this.definition.hotspots);
    this.halos.forEach((halo, i) =>
      halo.setAlpha(
        active?.id === this.definition.hotspots[i].id ||
          this.selected?.id === this.definition.hotspots[i].id
          ? 1
          : 0.35,
      ),
    );
    this.props.forEach((sprite, id) => {
      if (active?.id === id || this.selected?.id === id)
        sprite.setTint(0xfff3df);
      else sprite.clearTint();
    });
    this.session.positions[this.sceneId] = { x: this.child.x, y: this.child.y };
    this.updateWorld();
    this.publish();
  }
  /** Read-only, opt-in QA snapshot. No teleportation or quest mutation. */
  diagnostics() {
    const camera = this.cameras.main;
    const screen = (x: number, y: number) => {
      const origin = camera.getWorldPoint(0, 0);
      return {
        x: (x - origin.x) * camera.zoom,
        y: (y - origin.y) * camera.zoom,
      };
    };
    return {
      scene: this.sceneId,
      player: { x: this.child.x, y: this.child.y },
      robot: { x: this.robot.x, y: this.robot.y },
      robotFloat: (
        this.robot.getByName("body") as Phaser.GameObjects.Image | undefined
      )?.y,
      world: this.definition.world,
      zoom: camera.zoom,
      scroll: { x: camera.scrollX, y: camera.scrollY },
      hotspots: this.definition.hotspots.map((h) => ({
        ...h,
        screen: screen(h.hit.x, h.hit.y),
      })),
      objects: this.children.length,
      blurListeners: this.game.events.listenerCount("blur"),
      pointerListeners: this.input.listenerCount("pointerdown"),
      keyboardListeners: ["keydown-E", "keydown-ENTER", "keydown-H"].reduce(
        (sum, event) => sum + (this.input.keyboard?.listenerCount(event) ?? 0),
        0,
      ),
    };
  }
}
