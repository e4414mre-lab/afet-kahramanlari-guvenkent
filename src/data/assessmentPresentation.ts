export const HAZARDS = [
  "earthquake",
  "flood",
  "wildfire",
  "landslide",
  "avalanche",
] as const;
export const TYPES = ["true_false", "matching", "drag_drop"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Hazard = (typeof HAZARDS)[number];
export type ActivityType = (typeof TYPES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export const HAZARD_NAMES: Record<Hazard, string> = {
  earthquake: "Deprem",
  flood: "Sel ve taşkın",
  wildfire: "Orman yangını",
  landslide: "Heyelan",
  avalanche: "Çığ",
};
export const TYPE_NAMES: Record<ActivityType, string> = {
  true_false: "Doğru–Yanlış",
  matching: "Eşleştirme",
  drag_drop: "Kartları yerleştir",
};
export const HAZARD_ART: Record<Hazard, string> = {
  earthquake: "/assets/home/room.png",
  flood: "/assets/flood/area.png",
  wildfire: "/assets/forest/area.png",
  landslide: "/assets/landslide/area.png",
  avalanche: "/assets/avalanche/area.png",
};
import type {
  TrueFalseQuestion,
  MatchingQuestion,
  DragQuestion,
  FinalAnswer as Answer,
} from "./finalAssessment";
export type FinalAnswer = Answer;
export type PublicQuestion =
  | Omit<TrueFalseQuestion, "correct">
  | (Omit<MatchingQuestion, "pairs"> & {
      pairs: { id: string; left: string }[];
      targets: { id: string; right: string }[];
    })
  | (Omit<DragQuestion, "items"> & { items: { id: string; text: string }[] });
