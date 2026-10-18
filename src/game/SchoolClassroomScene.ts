import { AdventureScene } from "./AdventureScene";
import type { GameSession, InteractionId } from "./story";
import { CLASSROOM_OBJECTS, type ClassroomObjectId } from "./classroomData";
import {
  SCHOOL_WORLD,
  SCHOOL_WALK,
  SCHOOL_ASSETS,
  SCHOOL_OBSTACLES,
  DESKS,
  schoolHotspots,
  placementFor,
} from "./schoolLayout";
export class SchoolClassroomScene extends AdventureScene {
  private markers = new Map<ClassroomObjectId, Phaser.GameObjects.Graphics>();
  private shadows = new Map<ClassroomObjectId, Phaser.GameObjects.Ellipse>();
  private guided?: Phaser.GameObjects.Ellipse;
  constructor(session: GameSession) {
    super("SchoolClassroom", session, {
      world: SCHOOL_WORLD,
      walk: SCHOOL_WALK,
      spawn: { x: 1000, y: 1075 },
      hotspots: schoolHotspots(session.riskHunt.snapshot()),
      obstacles: SCHOOL_OBSTACLES,
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
    DESKS.forEach((p) => this.prop("school-desk", p.x, p.y, 130));
    this.prop("school-teacher", 960, 545, 225);
    // A low storage unit and a separate box sprite make the adult's relocation visible.
    this.prop("school-safe_shelf", 690, 500, 185);
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
