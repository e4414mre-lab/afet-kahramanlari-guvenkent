import { AdventureScene } from "./AdventureScene";
import { WORLD, WALK, LOCATIONS } from "./cityModel";
import type { GameSession, InteractionId } from "./story";
import type { Hotspot } from "./townHallData";
const HOTSPOTS: readonly Hotspot[] = LOCATIONS.map((h) => ({
  ...h,
  hit: { x: h.x, y: h.y - 100, width: 160, height: 210 },
}));
export class CitySquareScene extends AdventureScene {
  private schoolMarker?: Phaser.GameObjects.Ellipse;
  constructor(session: GameSession) {
    super("CitySquare", session, {
      world: WORLD,
      walk: WALK,
      spawn: { x: 670, y: 790 },
      hotspots: HOTSPOTS,
    });
  }
  protected preloadWorld() {
    this.asset("city", "/assets/city/square-concept.png");
  }
  protected drawWorld() {
    this.picture(
      "city",
      WORLD.width / 2,
      WORLD.height,
      WORLD.width,
      WORLD.height,
    )?.setDepth(0);
    this.schoolMarker = this.add
      .ellipse(1120, 580, 90, 28, 0x8ee5c0, 0.25)
      .setStrokeStyle(3, 0x8ee5c0)
      .setDepth(3)
      .setVisible(this.session.quest === "goToSchool");
  }
  protected activate(id: InteractionId) {
    if (id === "townHall") {
      this.session.enter();
      this.switchTo("TownHall");
    } else if (id === "school" && this.session.quest === "goToSchool") {
      this.session.schoolVisited = true;
      this.switchTo("SchoolClassroom");
    } else this.session.interact(id);
  }
  protected updateWorld() {
    this.schoolMarker?.setVisible(this.session.quest === "goToSchool");
    if (
      this.session.quest === "goToSchool" &&
      !this.session.schoolVisited &&
      Math.hypot(this.child.x - 1120, this.child.y - 580) < 95
    )
      this.session.interact("school");
  }
}
