import { AdventureScene } from "./AdventureScene";
import type { GameSession, InteractionId } from "./story";
import { CLASSROOM_OBJECTS, type ClassroomObjectId } from "./classroomData";
import {
  SCHOOL_WORLD,
  SCHOOL_WALK,
  SCHOOL_ASSETS,
  schoolObstacles,
  DESKS,
  DESK_WIDTH,
  schoolHotspots,
  placementFor,
} from "./schoolLayout";
export class SchoolClassroomScene extends AdventureScene {
  private markers = new Map<ClassroomObjectId, Phaser.GameObjects.Graphics>();
  private shadows = new Map<ClassroomObjectId, Phaser.GameObjects.Ellipse>();
  private bagsFixed?: boolean;
  private guided?: Phaser.GameObjects.Ellipse;
  constructor(session: GameSession) {
    super("SchoolClassroom", session, {
      world: SCHOOL_WORLD,
      walk: SCHOOL_WALK,
      spawn: { x: 1000, y: 1075 },
      hotspots: schoolHotspots(session.riskHunt.snapshot()),
      obstacles: schoolObstacles(session.riskHunt.snapshot()),
      pathfinding: true,
      cycleNearby: true,
      hideIdleHalos: true,
      followOffsetY: 130,
    });
  }
  protected preloadWorld() {
    SCHOOL_ASSETS.forEach(([key, name]) =>
      this.asset(key, `/assets/school/${name}.png`),
    );
  }
  create() {
    super.create();
    // Phaser also listens for touchstart on window, including DOM controls.
    // Keep classroom UI touches out of sprites underneath (notably AFİ).
    // Pointer events and native clicks still reach React's controls normally.
    const stage = this.game.canvas.parentElement?.parentElement;
    const overlayTouch = (event: TouchEvent) => {
      if (event.target instanceof Element && event.target.closest("button"))
        event.stopPropagation();
    };
    stage?.addEventListener("touchstart", overlayTouch);
    this.events.once("shutdown", () =>
      stage?.removeEventListener("touchstart", overlayTouch),
    );
    this.session.classroomIntro();
  }
  private prop(
    key: string,
    x: number,
    y: number,
    width: number,
    shadow = true,
  ) {
    if (!this.textures.exists(key)) return undefined;
    const frame = this.textures.getFrame(key);
    if (shadow)
      this.add
        .ellipse(x + 5, y - 4, width * 0.72, width * 0.15, 0x61462d, 0.14)
        .setDepth(y - 0.1);
    return this.picture(
      key,
      x,
      y,
      width,
      (width * frame.realHeight) / frame.realWidth,
    );
  }
  protected drawWorld() {
    this.markers.clear();
    this.shadows.clear();
    this.picture(
      "school-room",
      SCHOOL_WORLD.width / 2,
      SCHOOL_WORLD.height,
      SCHOOL_WORLD.width,
      SCHOOL_WORLD.height,
    )?.setDepth(0);
    this.add
      .text(1000, 230, "5-A", {
        fontFamily: "Georgia",
        fontSize: "28px",
        color: "#f2edda",
      })
      .setOrigin(0.5)
      .setDepth(1);
    // Quiet classroom details belong to the room, not to the risk overlay.
    this.prop("school-clock", 1360, 175, 64, false)?.setDepth(1);
    this.add.text(855, 115, "Fen Bilimleri\nGözlem • Neden • Güvenli çözüm", {
      fontFamily: "Georgia", fontSize: "20px", fontStyle: "italic",
      color: "#d5dfcd", lineSpacing: 10,
    }).setAlpha(0.78).setDepth(1);
    DESKS.forEach((p) => this.prop("school-desk", p.x, p.y, DESK_WIDTH));
    this.prop("school-teacher", 1050, 540, 205);
    // Use only the open leaf from the generated prop. The room already owns
    // the door jambs; drawing another frame would create a doorway inside it.
    if (this.textures.exists("school-door")) {
      const texture = this.textures.get("school-door");
      if (!texture.has("open-leaf"))
        texture.add("open-leaf", 0, 590, 120, 400, 1380);
      this.add.image(1155, 1205, "school-door", "open-leaf")
        .setOrigin(0.5, 1).setDisplaySize(75, 259).setDepth(1205);
    }
    this.add.text(1130, 930, "ÇIKIŞ ↓", {
      fontFamily: "Arial", fontSize: "15px", color: "#fff8e5",
      backgroundColor: "#326f65", padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setDepth(1206);
    const exitPaint = this.add.graphics().setDepth(1);
    exitPaint.lineStyle(3, 0x62877a, 0.5);
    for (const y of [940, 1010, 1080])
      exitPaint.beginPath().moveTo(991, y - 7).lineTo(1000, y + 3)
        .lineTo(1009, y - 7).strokePath();
    // A low storage unit and a separate box sprite make the adult's relocation visible.
    this.prop("school-safe_shelf", 700, 495, 165);
    CLASSROOM_OBJECTS.forEach((object) => {
      const p = placementFor(object.id, this.session.riskHunt.snapshot());
      const image = this.prop(
        `school-${object.asset}`,
        p.x,
        p.y,
        p.width,
        false,
      );
      if (!["wall_board", "safe_board"].includes(object.id))
        this.shadows.set(
          object.id,
          this.add
            .ellipse(
              p.x + 5,
              p.y - 4,
              p.width * 0.72,
              p.width * 0.15,
              0x61462d,
              0.14,
            )
            .setDepth(p.y - 0.1),
        );
      if (image) this.props.set(object.id, image);
      this.markers.set(object.id, this.add.graphics());
    });
    this.guided = this.add
      .ellipse(420, 630, 70, 22, 0xf6d69c, 0.2)
      .setStrokeStyle(2, 0xf6d69c, 0.7)
      .setDepth(3);
    this.updateWorld();
  }
  protected activate(id: InteractionId) {
    if (id === "classroomExit") this.switchTo("CitySquare");
    else this.session.interact(id);
  }
  protected updateWorld() {
    const hunt = this.session.riskHunt.snapshot();
    const bagsFixed = hunt.findings.exit_bags === "verifiedFixed";
    if (bagsFixed !== this.bagsFixed) {
      this.definition.obstacles = schoolObstacles(hunt);
      this.bagsFixed = bagsFixed;
    }
    CLASSROOM_OBJECTS.forEach((object) => {
      const p = placementFor(object.id, hunt),
        image = this.props.get(object.id);
      image?.setPosition(p.x, p.y).setDepth(p.y);
      this.shadows
        .get(object.id)
        ?.setPosition(p.x + 5, p.y - 4)
        .setDepth(p.y - 0.1)
        .setVisible(
          object.id !== "heavy_boxes" ||
            hunt.findings.heavy_boxes === "verifiedFixed",
        );
      const hotspot = this.definition.hotspots.find((h) => h.id === object.id)!;
      const height = image?.displayHeight ?? 150;
      hotspot.x = p.approach.x;
      hotspot.y = p.approach.y;
      hotspot.hit = {
        x: p.x,
        y: p.hitY ?? p.y - height * 0.5,
        width: p.width,
        height,
      };
      this.zones
        .get(object.id)
        ?.setPosition(hotspot.hit.x, hotspot.hit.y)
        .setSize(p.width, height);
      const marker = this.markers.get(object.id)!;
      marker.clear().setDepth(p.y + 1);
      const fixed =
        object.kind === "risk" && hunt.findings[object.id] === "verifiedFixed";
      if (fixed) {
        if (["bookshelf", "tall_cabinet", "wall_board"].includes(object.id)) {
          marker.lineStyle(4, 0x9daeb1, 1);
          for (const sign of [-1, 1]) {
            const x = p.x + sign * p.width * 0.34,
              y = p.y - height * 0.81;
            marker
              .beginPath()
              .moveTo(x, y + 12)
              .lineTo(x, y)
              .lineTo(x + sign * 12, y)
              .strokePath();
          }
        }
        marker
          .fillStyle(0xe7f7de, 0.95)
          .fillCircle(p.x + p.width * 0.38, p.y - height * 0.8, 9)
          .lineStyle(2, 0x3b7b62, 1)
          .beginPath()
          .moveTo(p.x + p.width * 0.38 - 4, p.y - height * 0.8)
          .lineTo(p.x + p.width * 0.38 - 1, p.y - height * 0.8 + 3)
          .lineTo(p.x + p.width * 0.38 + 5, p.y - height * 0.8 - 4)
          .strokePath();
      }
    });
    if (hunt.guidedTarget) {
      const h = this.definition.hotspots.find(
        (h) => h.id === hunt.guidedTarget,
      )!;
      this.guided?.setPosition(h.x, h.y).setVisible(true);
    } else this.guided?.setVisible(false);
  }
}
