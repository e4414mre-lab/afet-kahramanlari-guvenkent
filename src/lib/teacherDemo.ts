import type { Hazard, ActivityType } from "../data/assessmentPresentation";
import {
  rankTop5,
  type StudentInfo,
  type Dashboard,
  type ClassInfo,
} from "./classroom.ts";
export const DEMO_CLASSES: ClassInfo[] = [
  {
    id: "example-a",
    label: "5-A · Örnek sınıf",
    joinEnabled: false,
    expiresAt: "",
    archivedAt: null,
    studentCount: 8,
  },
  {
    id: "example-b",
    label: "5-B · Boş örnek",
    joinEnabled: false,
    expiresAt: "",
    archivedAt: null,
    studentCount: 0,
  },
];
const hazards: Hazard[] = [
  "earthquake",
  "flood",
  "wildfire",
  "landslide",
  "avalanche",
];
export const DEMO_STUDENTS: StudentInfo[] = Array.from(
  { length: 8 },
  (_, i) => ({
    id: "example-student-" + i,
    nickname: [
      "Gezgin",
      "Mavi Kuş",
      "Çınar",
      "Gezgin",
      "Meraklı",
      "Pusula",
      "Yıldız",
      "Bulut",
    ][i],
    code: ["A7D2", "B4C9", "C3E1", "D8F4", "E1A6", "F6B3", "G2D7", "H9C5"][i],
    createdAt: "2026-10-20T07:00:00Z",
    progress: [
      "story",
      "school",
      "home",
      "flood",
      "wildfire",
      "landslide",
      "avalanche",
      "day3",
    ]
      .slice(0, i < 6 ? 8 : 3)
      .map((chapter) => ({
        chapter,
        state: "completed",
        updatedAt: "2026-10-20T08:00:00Z",
      })),
    activeAttempt:
      i === 6 ? { answered: 7, startedAt: "2026-10-20T09:00:00Z" } : null,
    attempts:
      i < 6
        ? [0, 1].map((n) => ({
            id: `example-attempt-${i}-${n}`,
            total: [280, 300, 260, 280, 240, 220][i] - (n === 0 ? 20 : 0),
            finishedAt: `2026-10-20T09:${String(10 + i + n).padStart(2, "0")}:00Z`,
            bankVersion: "1.1.0",
            seed: "ÖRNEK · Gerçek deneme değil",
            byType: (
              ["true_false", "matching", "drag_drop"] as ActivityType[]
            ).map((type, j) => ({
              type,
              points:
                [280, 300, 260, 280, 240, 220][i] / 3 - (n === 0 ? 20 / 3 : 0),
              maximum: 100,
            })),
            byHazard: hazards.map((hazard) => ({
              hazard,
              points:
                ([280, 300, 260, 280, 240, 220][i] - (n === 0 ? 20 : 0)) / 5,
              maximum: 60,
            })),
            answers: [
              {
                questionId: "example-question",
                points: 20,
                correct: 1,
                total: 1,
              },
            ],
          }))
        : [],
  }),
);
// Integer, internally consistent sample subtotals.
for (const s of DEMO_STUDENTS)
  for (const a of s.attempts) {
    a.answers = Array.from({ length: 15 }, (_, i) => ({
      questionId: "example-question-" + i,
      points: i < a.total / 20 ? 20 : 0,
      correct: i < a.total / 20 ? 1 : 0,
      total: 1,
    }));
    a.byType = a.byType.map((t, i) => ({
      ...t,
      points: a
        .answers!.slice(i * 5, i * 5 + 5)
        .reduce((sum, r) => sum + r.points, 0),
    }));
    a.byHazard = a.byHazard.map((h, i) => ({
      ...h,
      points: a
        .answers!.filter((_, j) => j % 5 === i)
        .reduce((sum, r) => sum + r.points, 0),
    }));
  }
export function demoDashboard(id: string): Dashboard {
  const students = id === "example-a" ? structuredClone(DEMO_STUDENTS) : [];
  return { students, top5: rankTop5(students) };
}
