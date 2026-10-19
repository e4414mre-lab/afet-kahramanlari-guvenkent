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
      hotspots: [
        ...HOTSPOTS,
        {
          id: "home",
          name: "Çağrı’nın evine giden yol",
          x: 760,
          y: 850,
          radius: 75,
          hit: { x: 760, y: 890, width: 145, height: 85 },
        },
      ],
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
    // A small wayfinding plaque links the existing square to the family home.
    this.add
      .text(760, 897, "EV YOLU ↓", {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#fff7df",
        backgroundColor: "#4e776d",
        padding: { x: 8, y: 5 },
      })
      .setOrigin(0.5)
      .setDepth(1);
    this.schoolMarker = this.add
      .ellipse(1120, 580, 90, 28, 0x8ee5c0, 0.25)
      .setStrokeStyle(3, 0x8ee5c0)
      .setDepth(3)
      .setVisible(this.session.quest === "goToSchool");
  }
  protected activate(id: InteractionId) {
    if (id === "home") {
      if (this.session.homeUnlocked) this.switchTo("Home");
      else
        this.session.say([
          "AFİ: Ev incelemesi için önce okulun altı riskini yetişkin çözümleriyle tamamlayalım.",
        ]);
    } else if (id === "townHall") {
      this.session.enter();
      this.switchTo("TownHall");
    } else if (id === "school" && this.session.quest === "goToSchool") {
      this.session.schoolVisited = true;
      this.switchTo("SchoolClassroom");
    } else this.session.interact(id);
  }
  protected updateWorld() {
    if (this.session.floodEntryRequested && this.session.floodUnlocked) {
      this.session.floodEntryRequested = false;
      this.switchTo("Flood");
      return;
    }
    this.schoolMarker?.setVisible(this.session.quest === "goToSchool");
    if (
      this.session.quest === "goToSchool" &&
      !this.session.schoolVisited &&
      Math.hypot(this.child.x - 1120, this.child.y - 580) < 95
    )
      this.session.interact("school");
  }
}
