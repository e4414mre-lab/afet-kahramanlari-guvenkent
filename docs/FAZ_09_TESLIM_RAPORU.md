# Faz 09 — Belediye bütçesi ve Güvenkent hazırlık planı

Kaynak: GitHub `feat/avalanche-karlitepe`, `75952e4`.
Geliştirme dalı: `feat/day3-budget-planning`.
Bütçe paneli, yeniden planlama ve son rapor için görsel/işlevsel onay beklenir.
`main` birleştirmesi ve üretim dağıtımı yapılmadı. Final sınavı, öğretmen paneli
ve yeni afet bölgesi geliştirilmedi.

## Açılış ve mevcut belediye

Dere, Çamlık, Yamaç ve Karlıtepe'nin tamamlanma sayaçlarının **dördü de**
tamamlanmışsa meydanda “Üçüncü gün · Belediye planlamasına git” açılır.
Kilit yalnızca yeni üçüncü gün içindir; ikinci günün serbest bölge sırası değişmedi.
Oyuncu mevcut belediyeye girer ve harita masasına gerçek hareket/etkileşimle
ulaşır. Çağrı, AFİ, belediye başkanı, oda, mobilyalar ve ışıklandırma mevcut
onaylı varlıklardır. Dünya çizimi değiştirilmedi.

Harita masası ayrı strateji görünümünü açar. Kapat / Escape ile odaya dönülür;
planın durumu açık oturumda korunur. Belediye başkanı eğitim planının gerçek
kurum kararı olmadığını açıklar. AFİ sınırlı kaynaklarla ihtiyaçları karşılaştırır.
Uzmanlar odaya yeni fiziksel NPC olarak eklenmedi; dört danışma kartı kullanılır:
Hasan Amca, Orman Görevlisi Elif, Jeoloji Mühendisi Murat, Çığ Uzmanı Zeynep.

## Kesin bütçe ve öğrenci kararı

Başlangıç **1.000 planlama puanı**; 12 benzersiz önlemin toplamı **1.520**.
Maliyetler şartnamedeki F1–F3, W1–W3, L1–L3, A1–A3 değerleriyle aynıdır.
Bakiye saklanan bağımsız bir sayı değil, `1000 - sum(uniqueSelected.cost)` ile
hesaplanır. Bilinmeyen kimlik, negatif/NaN/sonsuz/kesirli maliyet ve bütçe aşımı
reddedilir. Aynı önlem iki kez alınamaz; geri alma tam maliyetini iade eder.

Öğrenci her seçimden önce üç kısa strateji gerekçesinden birini seçer. Gerekçe
onaylanana kadar bütçe harcanmaz; iptal veya bölge değiştirme maliyetsizdir.
Bütün gerekçeler farklı stratejilere açıktır, doğru/yanlış akademik not verilmez.
Maliyet “daha pahalı = daha iyi” anlamına gelmez. Tüm bütçeyi harcamak zorunlu
 değildir; tek bölgeye öncelik vermek veya sıfır önlemle şeffaf rapor almak yasaklanmaz.
Seçilmeyen bölgeler hem planlama uyarısında hem kendi raporlarında açıkça belirtilir.

Sabit katalogda bir bölgenin üç önlemi 330–410 puan tutar. Harcanan kaynağın
tamamını tek bölgeye yönlendirmek mümkündür; kalan kaynak korunur. Sırf
1.000'i doldurmak için tekrar satın alma veya ek sahte seçenek üretilmedi.
Planlama puanları gerçek para, gerçek risk veya öğrencinin başarı puanı değildir.
`plannedMeasures` ve `studentScore` ayrıdır; akademik puan entegrasyonu yoktur,
`studentScore: null` tutulur.

## Durum, yeniden planlama ve rapor

Akış: `briefing → consulting → planning → simulating → comparing → replanning
→ simulating → comparing → finalized`.

Önce dört danışma kartı okunur. Plan “Planı uygula” ile denemeye alınır. Kısa,
atlanabilir karşılaştırma özeti tüm bölge modellerini değerlendirir; “Özete geç”
her zaman sunulur. Bu süre gerçek afet oluş zamanı değildir. Ayarlarda veya
planlama görünümü kapalıyken zaman ilerlemez. Hareketli/korkutucu afet sahnesi yoktur;
azaltılmış harekette de içerik ve kararlar aynıdır.

Karşılaştırmada dört bölgenin her biri ayrı dört satırlık mini raporla incelenir:
uyarı, yetkili bakım/inceleme, güvenli ulaşım, bilgilendirme. Öğrenci dört raporu
görüp son plan gerekçesini seçer. Bir bölgeye kaynak ayrılmaması onayı yasaklamaz;
sonuçları dürüstçe gösterilir. “Planı düzenle” seçilen önlemleri koruyarak geri
al/ekle döngüsünü açar. Yeniden planlama sınırsızdır; her uygulama `planRevision`
ve değişmez deneme kaydı oluşturur. Son rapor son seçimi, gerekçeyi, kalan bütçeyi,
dört bölgeyi ve önceki denemeleri gösterir. Tekrar onay tamamlanmayı katlamaz.

Kayıt yalnızca açık oyun oturumundadır. Veritabanı, gerçek belediyeye bildirim,
öğretmen kaydı veya kalıcı kayıt başarısı taklit edilmez. Beklenmeyen görünüm
hatası için tekrar dene ve güvenli belediye odasına dönüş sunulur.

## Aynı koşullar ve mevcut modellerin yeniden kullanımı

`buildRegionalOutcomes` aşağıdaki mevcut veri ve saf kare fonksiyonlarını doğrudan
ithal eder; afet simülasyonları yeniden kopyalanmadı:

| Bölge | Ortak senaryo | Mevcut model | Bütçe eşlemesi |
| --- | --- | --- | --- |
| Dere | `RAIN_SCENARIO` | `simulationFrame` | F1 warning, F2 maintenance, F3 planning |
| Orman | `FOREST_WEATHER` | `forestFrame` | W1 watch, W2 maintenance, W3 routes |
| Yamaç | `LANDSLIDE_SCENARIO` | `landslideFrame` | L1 survey, L2 engineering, L3 warning |
| Karlıtepe | `AVALANCHE_SCENARIO` | `avalancheFrame` | A1 monitoring, A2 closure, A3 education |

Önce yeni üçüncü gün önlemi yoktur; sonra yalnızca bütçeyle seçilen önlemler
aktarılır. Yağış, rüzgâr, zemin, eğim, kar, tohum ve başlangıç koşulları aynı
kalır. Önceki ikinci gün görevleri/planları silinmez; üçüncü gün denemesi ayrı
bir eğitim karşılaştırmasıdır. Seçimler uyarı, uzman bakım planı veya güvenli
ulaşım/bilgilendirme farkı üretir. Risk yüzdesi, gerçek zarar hesabı, meteoroloji
değişikliği veya “afet kesin önlendi” sonucu üretilmez. İki koşulda da risk sürer;
kapalı geçişler öğrenciye açılmaz.

## Görsel tasarım, kontroller ve varlıklar

Mevcut belediye odası ve `/assets/town-hall/plan-concept.png` yeniden kullanılır.
Dört bölge kartının küçük görselleri mevcut onaylı `flood/area.png`,
`forest/area.png`, `landslide/area.png`, `avalanche/area.png` dosyalarıdır.
Yeni oda/karakter/afet görseli üretilmedi; onaylı PNG'lere yazılmadı.

Strateji görünümü krem/orman yeşili/bakır tonlarında ayrı bir çalışma panosudur.
Bakiye ve bölge seçimi sabittir; üç önlem kartı, gerekçe ve uzman bilgisi gövde
alanında kaydırılır. Mobilde bölge kartları 2×2, son rapor tek sütundur.
Maliyet, tek satırlık yarar ve Seç/Geri al eylemi ayrı okunur. Yoğun tablo veya
oda üstüne etiket yığını yoktur. Klavye odağı, Escape, modal Tab döngüsü,
dokunmatik düğmeler ve beş bağımsız ses/yazı tercihi korunur. Panel açıkken
Çağrı hareket etmez; kapatınca aynı onaylı hareket sistemi devam eder.

Yeni profesyonel ses kaydı eklenmedi. Önceki yönlü karakter atlasları, özgün
konuşmalar/ambiyans ve ayrıntılı örtüşme maskeleriyle ilgili eksikler önceki
raporlarda geçerlidir. Bu faz için yeni sahne sanatı gerekmiyor; strateji
arayüzü kullanıcı görsel onayı bekliyor.

## Değişen dosyalar

- `src/data/day3.ts`: 12 önlem, maliyet, danışmalar/gerekçeler, saf bütçe
  fonksiyonları ve mevcut modelleri bağlayan bölgesel karşılaştırma adaptörü.
- `src/game/day3Flow.ts`: aşamalar, gerekçe/seçim, geçmiş revizyonlar, son rapor,
  bağımsız tamamlanma ve oturum verisi.
- `src/game/story.ts`, `CitySquareScene.ts`: dört bölge tamamlanma kilidi,
  üçüncü gün giriş isteği ve oturum/React durumu.
- `src/game/TownHallScene.ts`: yalnızca üçüncü gün aktifken planlamayı açma,
  panel açıkken giriş/zaman kontrolü, güvenli kapanma; oda çizimi aynıdır.
- `src/components/Day3Panel.tsx`: ayrı strateji arayüzü ve hata dönüşü.
- `src/components/GamePreview.tsx`, `src/styles/app.css`: yeni bölümün koşullu
  arayüz bağlantıları, yalnızca `.day3-*` stilleri.
- `tests/day3Budget.test.ts`, `day3_smoke.py`, `day3_error_smoke.py`,
  `day3-fixture.html/.tsx`: matematik, gerçek girdili kabul ve kontrollü hata
  testleri. Mevcut Karlıtepe testine isteğe bağlı `keep_open` dönüşü eklendi;
  önceki varsayılan test davranışı korunur.

## Testler

```sh
npm run build
node --experimental-strip-types --test tests/*.test.ts
# Üretim önizlemesi 4173'te:
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/day3_smoke.py --chain
# Geliştirme sunucusu 5173'te; üretim kilidi iddiası yok:
python -u tests/day3_smoke.py --component
python -u tests/day3_error_smoke.py
```

25 Ekim 2026 kabul sonuçları:

- **Derleme geçti**; mevcut büyük Phaser paketi uyarısı sürer.
- **50/50 birim testi geçti**. 4.096 olası seçim kümesi ve uygun ekleme/çıkarma
  geçişleriyle tam bütçe, benzersiz seçim, iade, aşım ve geçersiz maliyetler denetlendi.
- **1440×1000 masaüstü ve 390×844 dokunmatik tam oyun zinciri geçti.** İlk gün ve
  dört afet bölgesi gerçek girdilerle bitirildikten sonra üçüncü gün açıldı.
- Dört danışma, gerekçeli seçim, sıfır bakiye, aşan seçimin reddi, planlama paneli açıkken
  konumun korunması, ayarlarda süre durması ve beş bağımsız ses/yazı tercihi doğrulandı.
- İki yeniden planlama ile **3 deneme** yapıldı. Bütçeler 0 → 0 → 50; son planda
  **8 önlem, dört bölge raporu ve kalan 50 puan** doğrulandı.
- Son raporun gerekçesi/geçmişi, kaynak ayrılmayan bölgenin dürüst gösterimi,
  aynı önce/sonra senaryo parametreleri ve ayrı başarı puanı alanı doğrulandı.
- Belediye planlamasına **5 giriş–çıkışta** nesne/dinleyici/texture sayıları
  sabit kaldı, plan/puan/modal çoğalmadı; önceki beş tamamlanma sayacı korundu.
- Son güvenli kapanış koruması derlendikten sonra iki ekran boyutunda üç planlı
  bileşen turu tekrar geçti. Kasıtlı görünüm hatasıyla tekrar dene, güvenli odaya
  kapanma, bütçe/ilerleme korunması ve hareketin geri gelmesi ayrıca doğrulandı.
  Bu son koruma yalnızca kapalı hata panelini kaldırır; normal açık panelin
  görsellerini veya bütçe/afet modellerini değiştirmez.
- **22 gerçek oyun PNG'si** boyut ve dosya bütünlüğüyle kontrol edildi.

[Makine tarafından okunabilir sonuçlar ve görsel SHA-256 kayıtları](screenshots/day3-test-results.json).
[Önceki 102 varlık/model dosyasının Git kimliği ve değişmeyen iki dünya çizimi](screenshots/day3-source-regression.json).
Önceki teslim görüntüleri test sonrası kaynak sürümlerine geri getirildi; yeni
üçüncü gün dosyaları ayrı adlarla teslim edildi.

Masaüstü 1440×1000, mobil 390×844 Chromium dokunmatik emülasyonudur; fiziksel
telefon/tablet denenmiş olarak sunulmaz. Gerçek kabul turu önceki dört afet
bölgesini ve ilk günü gerçek girdilerle tamamlar. QA salt okunurdur; üretim
kilidini geçmek için ışınlama veya görev yazma kestirmesi kullanılmaz.
Geliştirme fixture'ı ayrı etiketlidir, üretim giriş noktası değildir ve
fotoğrafları `/workspace/day3-validation/component-images` altına kaydedilir.

## Gerçek oyun ekran görüntüleri

| An | Masaüstü | Mobil |
| --- | --- | --- |
| Aynı belediye odasında harita masasına yaklaşma | [PNG](screenshots/day3-town-hall.png) | [PNG](screenshots/day3-town-hall-mobile.png) |
| Başlangıç bütçe paneli | [PNG](screenshots/day3-budget-desktop.png) | [PNG](screenshots/day3-budget-mobile.png) |
| Önlem ve gerekçe seçildi | [PNG](screenshots/day3-measure-selected.png) | [PNG](screenshots/day3-measure-selected-mobile.png) |
| Aynı koşullarda önce/sonra | [PNG](screenshots/day3-before-after.png) | [PNG](screenshots/day3-before-after-mobile.png) |
| Kaynak ayrılmayan bölgenin açık raporu | [PNG](screenshots/day3-unfunded-region.png) | [PNG](screenshots/day3-unfunded-region-mobile.png) |
| Yeniden planlama | [PNG](screenshots/day3-replanning.png) | [PNG](screenshots/day3-replanning-mobile.png) |
| Son belediye raporu | [PNG](screenshots/day3-final-report.png) | [PNG](screenshots/day3-final-report-mobile.png) |

Son raporun kaydırılarak alınan dört bölge kanıtı: Dere
[masaüstü](screenshots/day3-final-report-flood.png) / [mobil](screenshots/day3-final-report-flood-mobile.png),
Çamlık [masaüstü](screenshots/day3-final-report-wildfire.png) / [mobil](screenshots/day3-final-report-wildfire-mobile.png),
Yamaç [masaüstü](screenshots/day3-final-report-landslide.png) / [mobil](screenshots/day3-final-report-landslide-mobile.png),
Karlıtepe [masaüstü](screenshots/day3-final-report-avalanche.png) / [mobil](screenshots/day3-final-report-avalanche-mobile.png).

## Yayın öncesi inceleme

Maliyetler gerçek kamu bütçesi veya mühendislik hesabı değil, temsili oyun
denge değerleridir. Aynı afet modellerinin önceki raporlarındaki resmî
kaynak erişimi/uzman incelemesi sınırları geçerlidir. Üretim öncesinde güncel
resmî güvenlik yönergeleriyle uzman ve 5. sınıf pedagojik incelemesi gerekir.
Bu teslim gerçek belediye hazırlık planı veya güvenlik garantisi değildir.
Görsel ve işlevsel kullanıcı onayı olmadan sonraki aşamaya geçilmez.
