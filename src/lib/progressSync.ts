import { currentStudent, studentApi } from "./classroom";
import type { GameStatus } from "../game/story";
const sent = new Map<string, string>();
/** Progress is explicitly device-reported, never used to award final points. */
export async function syncObservedProgress(s: GameStatus) {
  const student = currentStudent();
  if (!student) return;
  const chapters: Record<string, boolean> = {
    story: s.schoolVisited,
    school: s.hunt.complete,
    home: s.home.completedOnce,
    flood: s.flood.completionCount > 0,
    wildfire: s.forest.completionCount > 0,
    landslide: s.landslide.completionCount > 0,
    avalanche: s.avalanche.completionCount > 0,
    day3: s.day3.completionCount > 0,
  };
  for (const [chapter, done] of Object.entries(chapters)) {
    if (!done) continue;
    const key = student.studentId + ":" + chapter;
    if (sent.get(key) === "completed") continue;
    sent.set(key, "completed");
    try {
      await studentApi("save_progress", { chapter, state: "completed" });
    } catch (e) {
      sent.delete(key);
      throw e;
    }
  }
}
