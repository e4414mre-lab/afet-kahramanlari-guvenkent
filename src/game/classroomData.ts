export type FindingState =
  | "notFound"
  | "identified"
  | "planned"
  | "assigned"
  | "verifiedFixed";
export type RiskId =
  | "bookshelf"
  | "exit_bags"
  | "heavy_boxes"
  | "tall_cabinet"
  | "window_heavy"
  | "wall_board";
export type SafeId = "safe_shelf" | "safe_bags" | "safe_box" | "safe_board";
export type ClassroomObjectId = RiskId | SafeId;
export type Choice = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
};
export type Placement = {
  x: number;
  y: number;
  width: number;
  approach: { x: number; y: number };
  hitY?: number;
};
type Common = {
  id: ClassroomObjectId;
  name: string;
  asset: string;
  placement: Placement;
  detail: string;
};
export type RiskObject = Common & {
  id: RiskId;
  kind: "risk";
  reason: string;
  reasons: readonly Choice[];
  solutions: readonly Choice[];
  adultFix: string;
  hints: readonly [string, string, string];
};
export type SafeObject = Common & {
  id: SafeId;
  kind: "safe";
  explanation: string;
};
const safe = (label: string): Choice => ({
  id: "adult",
  label,
  correct: true,
  feedback: "Güvenli karar! Bu işi öğretmen veya yetkili yetişkin planlamalı.",
});
const wrong = (id: string, label: string, feedback: string): Choice => ({
  id,
  label,
  correct: false,
  feedback: `Tekrar düşünelim. ${feedback}`,
});
const reasons = (
  correct: string,
  incorrect: string,
  hint: string,
): readonly Choice[] => [
  { id: "reason", label: correct, correct: true, feedback: correct },
  wrong("distractor", incorrect, hint),
];
export const RISKS: readonly RiskObject[] = [
  {
    id: "bookshelf",
    kind: "risk",
    name: "Uzun kitaplık",
    asset: "bookshelf",
    placement: { x: 420, y: 500, width: 155, approach: { x: 420, y: 630 } },
    detail: "Kitaplık yüksek; duvar bağlantısı görünmüyor.",
    reason: "Sabitlenmemiş uzun kitaplık sarsıntıda devrilebilir.",
    reasons: reasons(
      "Sarsıntıda devrilebilir.",
      "Kitapları renkli olduğu için risklidir.",
      "Renk değil, yükseklik ve sabitleme önemlidir.",
    ),
    solutions: [
      safe("Teknik personelden sabitlemesini iste."),
      wrong(
        "lift",
        "Kitaplığı tek başıma duvara yaslarım.",
        "Ağır kitaplığı taşıma veya sabitleme; yetişkine bildir.",
      ),
      wrong(
        "ignore",
        "Olduğu yerde bırakırım.",
        "Sabitleme kontrolünü yetkili yetişkin yapmalı.",
      ),
    ],
    adultFix:
      "Canlandırma: teknik personel kitaplığı uygun bağlantılarla duvara sabitledi.",
    hints: [
      "Yüksek eşyaların dengesi önemli.",
      "Kitapların bulunduğu yüksek rafa bak.",
      "Sol arkadaki uzun kitaplığın duvar bağlantısını incele.",
    ],
  },
  {
    id: "exit_bags",
    kind: "risk",
    name: "Kapı önündeki çantalar",
    asset: "exit_bags",
    placement: {
      x: 880,
      y: 1080,
      width: 150,
      approach: { x: 880, y: 1000 },
      hitY: 1045,
    },
    detail: "Çanta ve askılar kapı geçişinin bir bölümünü kapatıyor.",
    reason: "Kapı geçişindeki çantalar tahliye yolunu engeller.",
    reasons: reasons(
      "Çıkış yolunu daraltıp takılmaya neden olur.",
      "Çantalar farklı renklerde olduğu için risklidir.",
      "Geçişin açık olması gerekir.",
    ),
    solutions: [
      wrong(
        "run",
        "Çantaların üstünden atlayarak geçerim.",
        "Takılma riskini artırma; geçişin düzenlenmesini iste.",
      ),
      safe("Öğretmen gözetiminde geçişi düzenlet."),
      wrong(
        "ignore",
        "Kapıyı kullanmam; risk kalmaz.",
        "Herkes için çıkış yolunun açık olması gerekir.",
      ),
    ],
    adultFix:
      "Canlandırma: öğretmen gözetiminde çantalar ayrılmış saklama alanına alındı.",
    hints: [
      "Herkesin rahatça geçebilmesi önemli.",
      "Kapının önündeki zemini incele.",
      "Girişte dağınık duran çantalar çıkış yolunu daraltıyor.",
    ],
  },
  {
    id: "heavy_boxes",
    kind: "risk",
    name: "Yüksekteki ağır kutular",
    asset: "heavy_boxes",
    placement: {
      x: 690,
      y: 415,
      width: 125,
      approach: { x: 690, y: 630 },
      hitY: 360,
    },
    detail: "Ağır arşiv kutuları dolabın üstünde duruyor.",
    reason: "Yüksekteki ağır kutular sarsıntıda düşebilir.",
    reasons: reasons(
      "Sarsıntıda düşüp yaralanmaya neden olabilir.",
      "Kutular kapalı olduğu için tehlikelidir.",
      "Ağırlığın nerede durduğuna dikkat et.",
    ),
    solutions: [
      wrong(
        "climb",
        "Sandalyeye çıkıp kendim indiririm.",
        "Tırmanma ve ağır yük kaldırma; yetişkinden yardım iste.",
      ),
      wrong(
        "hold",
        "Sarsıntıda kutuları tutarım.",
        "Düşebilecek eşyayı tutmaya çalışma.",
      ),
      safe("Yetkili yetişkinden aşağı almasını iste."),
    ],
    adultFix:
      "Canlandırma: yetkili yetişkin ağır kutuları alçak ve güvenli depolama alanına yerleştirdi.",
    hints: [
      "Ağır yükler nerede durmalı?",
      "Dolapların üst taraflarına bak.",
      "Arka soldaki dolabın tepesinde ağır kutular var.",
    ],
  },
  {
    id: "tall_cabinet",
    kind: "risk",
    name: "Yüksek dolap",
    asset: "tall_cabinet",
    placement: { x: 1230, y: 500, width: 155, approach: { x: 1230, y: 630 } },
    detail: "Yüksek dolabın sabitleme bağlantısı görünmüyor.",
    reason: "Sabitlenmemiş yüksek dolap devrilebilir.",
    reasons: reasons(
      "Sarsıntıda devrilebilir.",
      "Kapakları kapalı olduğu için risklidir.",
      "Kapaklar kapalı olsa da duvar bağlantısı gerekir.",
    ),
    solutions: [
      safe("Teknik personele sabitleme için bildir."),
      wrong(
        "fix",
        "Vidayı bulup kendim sabitlerim.",
        "Sabitleme uzmanlık ister; teknik personele bildir.",
      ),
      wrong(
        "lean",
        "Dolabı sıralara dayarım.",
        "Geçici dayama güvenli sabitleme değildir.",
      ),
    ],
    adultFix:
      "Canlandırma: teknik personel yüksek dolabı uygun bağlantılarla sabitledi.",
    hints: [
      "Uzun eşyaların duvar bağlantısını düşün.",
      "Kapaklı yüksek depolama alanına bak.",
      "Arka sağdaki yüksek dolabın sabitlemesini incele.",
    ],
  },
  {
    id: "window_heavy",
    kind: "risk",
    name: "Pencere yanındaki ağır eşya",
    asset: "window_heavy",
    placement: { x: 330, y: 780, width: 130, approach: { x: 455, y: 805 } },
    detail: "Ağır küre pencereye çok yakın, sabitlenmemiş bir kaide üzerinde.",
    reason: "Pencere yanındaki ağır eşya hareket edebilir veya düşebilir.",
    reasons: reasons(
      "Sarsıntıda hareket edip düşebilir.",
      "Dünya küresi mavi olduğu için tehlikelidir.",
      "Renk değil, ağırlık ve yerleşim önemlidir.",
    ),
    solutions: [
      wrong(
        "move",
        "Ağır eşyayı tek başıma taşırım.",
        "Cam yakınında ağır eşya taşıma; öğretmene bildir.",
      ),
      safe("Öğretmene bildir, güvenli yerleşim planlat."),
      wrong(
        "catch",
        "Düşerken yakalamaya çalışırım.",
        "Düşen ağır eşyayı yakalamaya çalışma.",
      ),
    ],
    adultFix:
      "Canlandırma: öğretmen ve yetkili yetişkin eşyayı pencereden uzak, güvenli bir yere aldı.",
    hints: [
      "Cam yakınındaki ağır eşyaları fark et.",
      "Pencere kenarındaki kaideyi incele.",
      "Sol penceredeki ağır kürenin güvenli yerleşimini düşün.",
    ],
  },
  {
    id: "wall_board",
    kind: "risk",
    name: "Ağır pano",
    asset: "wall_board",
    placement: {
      x: 1420,
      y: 270,
      width: 185,
      approach: { x: 1420, y: 630 },
      hitY: 210,
    },
    detail: "Ağır panonun bağlantı kayışı gevşek görünüyor.",
    reason: "Sağlam sabitlenmemiş ağır pano duvardan ayrılabilir.",
    reasons: reasons(
      "Bağlantısı gevşekse duvardan ayrılabilir.",
      "Üzerinde kâğıt olduğu için tehlikelidir.",
      "Kâğıtlar değil, ağır panonun bağlantısı önemlidir.",
    ),
    solutions: [
      wrong(
        "pull",
        "Panoyu çekip sağlamlığını denerim.",
        "Ağır panoyu çekme; bağlantısını yetkili kişi kontrol etsin.",
      ),
      wrong(
        "climb",
        "Sıraya çıkıp bağlantıyı düzeltirim.",
        "Tırmanma ve ağır panoyu düzeltmeye çalışma.",
      ),
      safe("Yetkili kişiden bağlantıları kontrol etmesini iste."),
    ],
    adultFix:
      "Canlandırma: yetkili kişi panonun bağlantılarını kontrol edip güvenli biçimde sabitledi.",
    hints: [
      "Duvara asılı ağır eşyalar da kontrol edilmeli.",
      "Sağ arka duvardaki panoya bak.",
      "Ağır panonun gevşek bağlantısını incele.",
    ],
  },
];
export const SAFE_OBJECTS: readonly SafeObject[] = [
  {
    id: "safe_shelf",
    kind: "safe",
    name: "Sabitlenmiş alçak raf",
    asset: "safe_shelf",
    placement: { x: 1590, y: 765, width: 170, approach: { x: 1460, y: 805 } },
    detail: "Alçak rafın sabitleme bağlantıları yerinde.",
    explanation:
      "Bu raf alçak ve uygun bağlantılarla sabitlenmiş. Devrilme riskini azaltan bu özellikler daha güvenlidir.",
  },
  {
    id: "safe_bags",
    kind: "safe",
    name: "Düzenli çantalar",
    asset: "safe_bags",
    placement: { x: 1360, y: 1010, width: 175, approach: { x: 1350, y: 935 } },
    detail: "Çantalar kapıdan uzakta, ayrılmış alanda düzenli duruyor.",
    explanation:
      "Çantalar geçişi kapatmıyor; askıları toplu. Çıkış yolunun açık kalması daha güvenlidir.",
  },
  {
    id: "safe_box",
    kind: "safe",
    name: "Hafif malzeme kutusu",
    asset: "safe_box",
    placement: { x: 1580, y: 990, width: 105, approach: { x: 1490, y: 945 } },
    detail: "Kapalı, hafif malzeme kutusu yerde ve geçişten uzakta.",
    explanation:
      "Hafif kutu kapalı ve zeminde duruyor; yüksekten düşme riski oluşturmuyor ve yolu kapatmıyor.",
  },
  {
    id: "safe_board",
    kind: "safe",
    name: "Güvenli alçak pano",
    asset: "safe_board",
    placement: {
      x: 600,
      y: 305,
      width: 165,
      approach: { x: 600, y: 630 },
      hitY: 250,
    },
    detail: "Pano uygun yükseklikte; dört bağlantısı sağlam.",
    explanation:
      "Pano uygun yükseklikte ve sağlam bağlantılarla sabitlenmiş. Bağlantı kontrolünü yine yetkili yetişkin yapar.",
  },
];
export const CLASSROOM_OBJECTS: readonly (RiskObject | SafeObject)[] = [
  ...RISKS,
  ...SAFE_OBJECTS,
];
export const FINDING_LABELS: Record<FindingState, string> = {
  notFound: "İncelenmedi",
  identified: "Risk belirlendi",
  planned: "Çözüm planlandı",
  assigned: "Yetişkine bildirildi",
  verifiedFixed: "Yetişkin çözümü görüldü",
};
export function classroomObject(id: string) {
  return CLASSROOM_OBJECTS.find((o) => o.id === id);
}
export const CLASSROOM_SAFETY =
  "Ağır eşya taşıma, sabitleme veya panoyu düzeltme; öğretmene ya da yetkili yetişkine bildir.";
