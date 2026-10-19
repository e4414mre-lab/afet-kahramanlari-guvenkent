# Faz 07 — Yamaç Mahallesi: heyelan farkındalığı

Kaynak: GitHub `feat/forest-fire-camlik`, `b2f4330` (Faz 07 belgesi dâhil).
Geliştirme: `feat/landslide-yamac`. `main` birleştirmesi veya üretim dağıtımı yok.
Karlıtepe, üçüncü gün, bütçe, final sınavı ve öğretmen paneli geliştirilmedi.
Görsel ve pedagojik onay beklenir.

## Oynanış ve öğrenme

İlk günün gerçek deprem tatbikatı tamamlandığında ikinci gün haritasından
Dere, Çamlık ve Yamaç serbest sırayla seçilir; Karlıtepe kapalıdır.
Çağrı ve AFİ güvenli taş seyir platformundadır. Jeoloji Mühendisi Murat,
belediye teknik ekibiyle çalıştığını anlatır. AFİ ilk gözlemde heyelanın tanımını
verir ve güvenli platformdan gözleme rehberlik eder; üç kademeli ipuçları vardır.

| Gerçek sahne nesnesi | Güvenli karar / gerekçe |
| --- | --- |
| Uzak yol kenarında ince çatlak ve eğrilmiş çit | Yaklaşmadan yetişkine/yetkililere bildir, uzman değerlendirmesini bekle. Ölçmek için üstüne gitme veya taşla doldurma. Belirti kesin teşhis değildir. |
| Dik yamaca yakın yapı | Zemin etüdü ve yetkili arazi kullanım değerlendirmesi iste; yalnızca görüntüden güvenli/güvensiz kararı verme. Yağış, zemin, eğim, bitki örtüsü ve arazi kullanımı birlikte değerlendirilir. |
| Kontrolsüz yüzey suyu / drenaj | Drenaj, istinat ve şev güvenliği planını yetkili mühendislik ekiplerine bırak; çocuk kanala girmez veya kazı yapmaz. Her yağmur heyelan oluşturmaz. |

Risk durumları: `unseen → identified → decided → explained`.
Yanlış seçim gerekçeli açıklama ve yeniden deneme verir, bulgu sayısını artırmaz.
Doğru kararın gerekçesi ayrıca not edilir. Üç açıklanmış bulgu hazırlığı açar.
Hazırlıklar: uzman zemin/alan incelemesi; yetkili drenaj/istinat/şev planı;
mahalleliye erken uyarı, yol kısıtlaması ve güvenli uzaklaşma/buluşma güzergâhı.
Gerçek kurum bildirimi veya sunucu ilerleme kaydı taklit edilmez.

## Önce / sonra ve güvenlik sınırı

İki 40 saniyelik, atlanabilir canlandırma ortak `yamac-rain-soil-01` senaryosunu
kullanır: aynı şiddetli/uzun süreli yağış, duyarlı zemin, dik eğim, başlangıç
nemliliği, başlangıç yüzeyi ve bitki örtüsü; aynı tohum. Mahalleli iki koşulda aynı başlangıç konumundadır; yalnızca
uyarı planına bağlı yönlendirme zamanı değişir. Bunlar temsili eğitim
varsayımlarıdır, güncel ölçüm veya gerçek heyelan tahmini değildir.

Önce duyuru daha geçtir. Sonra seçime göre uzman inceleme planı görünür,
mahalleli güvenli güzergâha daha erken yönlendirilir ve yerel su akışı
katmanı daha sınırlı gösterilir. İç çizgi kalınlığı gerçek mühendislik hesabı,
ölçüm veya zarar yüzdesi değildir. Riskli yol iki durumda da kapalıdır;
“risk sürer” karşılaştırmanın her iki sütununda anlatılır.
Zayıf yamaç sağlamlaşmış veya tehlike sıfırlanmış gösterilmez.

Sadece uzaktaki küçük toprak sprite'ı birkaç piksel yer değiştirir; çatlak,
evler, platform ve arka plan oyuncuya doğru kaydırılmaz. Azaltılmış harekette
üç durağan konum kullanılır. Sarsıntı, sert çöküş, yaralanma veya alarm sesi yok.
Çatlak yol, riskli şev ve şev altına rota yoktur; giriş hem yürüyüş çarpışması
hem tıklama koruma katmanlarıyla engellenir. Gözlem hedefleri ayrı güvenli
noktalardır. Mobilde uzak çatlak, güvenli noktadaki Etkileşim düğmesiyle açılır;
inceleme kamerası uzaktaki nesneyi gösterir, karakterin konumu değişmez.

## Değişiklikler ve koruma

- `src/data/landslide.ts`: metinler, üç nesne/kararlar/ipucu, uzman hazırlıkları,
  dondurulmuş ortak senaryo ve kare hesabı.
- `src/game/landslideFlow.ts`: şartnamedeki sekiz aşama; ayrımlı TypeScript
  simülasyon durumu, tek tamamlanma, yeniden deneme, JSON hazırlık kaydı.
  Kayıt yalnızca açık oturumdadır; üçüncü gün bütçesi uygulanmaz.
- `src/game/landslideLayout.ts` / `LandslideScene.ts`: ayrı sahne, bağımsız
  sprite'lar/hitbox'lar, güvenli yaklaşım noktaları, NPC/pano ayak izleri,
  platform sınırı, durağan/hafif animasyon, temizlenen giriş olayları ve TTS.
- `src/components/LandslidePanel.tsx`: kısa konuşma, gözlem, karar/gerekçe,
  hazırlık, süre/geç, karşılaştırma ve rapor. Masaüstü kartı uzaktaki riskin
  önünü kapatmaz. Kritik güvenlik metni ses ve konuşma yazısı kapalıyken de kalır.
- `GameSession`, `GamePreview`, `CitySquareScene`: yeni sahne/harita yönlendirmesi.
  Önceki modeller, sahne sınıfları, karakterler ve hareket motoru korunur.
- Mevcut beş bağımsız ses/yazı tercihi, sessiz mod ve azaltılmış hareket korunur.
  Yeni bölümün okuma sesi için düşük/normal seçimi eklenir; genel ayarları
  değiştirmez. Türkçe sistem sesi varsa isteğe bağlıdır, profesyonel kayıt değildir.
- `src/styles/app.css`: yalnızca `.landslide-*` kuralları.
- `tests/landslideFlow.test.ts`, `landslide_smoke.py`, `landslide-fixture.html/.tsx`:
  birim, gerçek oyun ve bağımsız geliştirme sahnesi testleri. Mevcut sel/orman
  testlerinin harita beklentisi yeni Yamaç seçimine uyarlandı; orman testine
  isteğe bağlı açık oturum dönüşü eklendi, eski kontroller korunur.

## Sanat durumu

[Altı yeni yerel PNG, üretim kaynakları ve eksikler](../public/assets/landslide/README.md).
Ayrıntılı diorama, ayrı Murat/ev/çatlak/drenaj/toprak sprite'ları kullanılır;
boş geometrik bir sahne tamamlanmış oyun olarak sunulmaz. Çağrı/AFİ ve küçük
mahalleli/pano görselleri önceki onaylı varlıklardır, üzerlerine yazılmadı.
Yönlü Murat/mahalleli animasyon atlasları, özgün kayıtlı Türkçe sesler,
ambiyans kayıtları, ayrıntılı örtüşme maskeleri ve optimize atlaslar eksiktir.

## Testler

```sh
npm run build
node --experimental-strip-types --test tests/*.test.ts
# Üretim önizlemesi 4173'te çalışırken:
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/landslide_smoke.py --chain
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/browser_smoke.py
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/school_risk_hunt_smoke.py
# Son görsel düzeltmeden sonra gerçek ilk gün → doğrudan Yamaç kabulü:
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/landslide_smoke.py
```

- `npm run build`: geçti. Phaser paketinin mevcut büyük parça boyutu uyarısı sürer;
  derleme hatası yoktur.
- Birim testleri: **38/38 geçti**, önceki testler dâhil.
- Gerçek ilk gün → Dere → Çamlık → Yamaç zinciri: masaüstü ve mobil geçti.
  Önceki üç tamamlanma sayacı Yamaç sonrasında da birer kez tamamlanmış kaldı.
- Belediye: masaüstü ve dokunmatik geçti; beş giriş–çıkış, berat, kent planı,
  görev defteri ve eksik görsel uyarısı doğrulandı.
- Sınıf: masaüstü ve dokunmatik geçti; altı risk/dört güvenli nesne, yanlış/doğru
  geri bildirim, 3/6–6/6, kapı önü engeli/açılan çıkış, beş giriş–çıkış ve eksik
  görsel uyarısı doğrulandı.
- Son derlemede doğrudan ilk gün → Yamaç kabulü: masaüstü ve mobil geçti.
  Sel/orman sayaçları sıfırken Yamaç açıldı; iki simülasyonun aynı ilk mahalleli
  konumu, güvenli sınırlar, gerçek nesne tıklaması/klavye/dokunma, üç kademeli
  ipucu, yanlış/doğru geri bildirim, ayarlarda süre durması, sessiz/azaltılmış
  hareket, yeniden deneme ve beş giriş–çıkış doğrulandı.

Son Yamaç düzeltmesi mahallelinin konumunu zamana bağlı deterministik hesaplar;
önceki tam zincir ve bağımsız belediye/sınıf regresyonlarından sonra yeniden
build/birim testleri ve doğrudan Yamaç turu çalıştırıldı. İki koşulun ilk karede
aynı mahalleli konumundan başlaması ayrıca tarayıcıda kontrol edildi.
Masaüstü 1440×1000, mobil 390×844 Chromium dokunmatik emülasyonudur;
fiziksel telefon/tablet denenmiş olarak sunulmaz. QA yalnızca okunurdur;
görev yazma veya ışınlanma kestirmesi yoktur. `--chain` ilk gün, Dere ve
Çamlık'ı gerçek girdilerle tamamlayıp aynı açık oturumdan Yamaç'a geçer.
Bayraksız tur ilk günden doğrudan Yamaç'a geçer; önceki iki bölgeyi bitirmez.
Bağımsız fixture üretim giriş noktası değildir; görüntülerini `/tmp` altına yazar.

[Önceki varlık/modül koruma kanıtı](screenshots/yamac-source-regression.json):
55 eski varlık dosyası ve 24 korunan sahne/model/panel dosyası, kaynak dalın
Git nesne kimlikleriyle aynıdır. Şehir sahnesine yalnızca yeni bölgeye yönlendirme,
ortak oturuma ve arayüze koşullu Yamaç entegrasyonu eklendi.

[Makine tarafından okunabilir test sonuçları ve 16 PNG doğrulaması](screenshots/yamac-test-results.json).

Önceki sahnelerin bu sürümde gerçek girdilerle alınan regresyon görüntüleri:
[meydan](screenshots/yamac-regression/city-square-desktop.png),
[belediye](screenshots/yamac-regression/town-hall-desktop.png),
[sınıf](screenshots/yamac-regression/school-classroom-desktop.png),
[ev](screenshots/yamac-regression/home-desktop.png),
[Dere](screenshots/yamac-regression/flood-area-desktop.png),
[Çamlık](screenshots/yamac-regression/camlik-overview-desktop.png).
Eski teslim görüntüleri değiştirilmedi; bu altı yeni kanıt ayrı klasördedir.

## Gerçek ekran görüntüleri

| An | Masaüstü | Mobil |
| --- | --- | --- |
| Genel görünüm | [PNG](screenshots/yamac-overview-desktop.png) | [PNG](screenshots/yamac-overview-mobile.png) |
| Murat ile ilk konuşma | [PNG](screenshots/yamac-murat-dialogue.png) | [PNG](screenshots/yamac-murat-dialogue-mobile.png) |
| Risk inceleme | [PNG](screenshots/yamac-risk-investigation.png) | [PNG](screenshots/yamac-risk-investigation-mobile.png) |
| Yanlış karar geri bildirimi | [PNG](screenshots/yamac-risk-feedback-wrong.png) | [PNG](screenshots/yamac-risk-feedback-wrong-mobile.png) |
| Doğru karar gerekçesi | [PNG](screenshots/yamac-risk-feedback-correct.png) | [PNG](screenshots/yamac-risk-feedback-correct-mobile.png) |
| Hazırlık öncesi | [PNG](screenshots/yamac-before.png) | [PNG](screenshots/yamac-before-mobile.png) |
| Hazırlık sonrası aynı koşullar | [PNG](screenshots/yamac-after.png) | [PNG](screenshots/yamac-after-mobile.png) |
| Önce / sonra karşılaştırma | [PNG](screenshots/yamac-comparison.png) | [PNG](screenshots/yamac-comparison-mobile.png) |

## Yayın öncesi içerik kontrolü — açık sınır

20 Ekim 2026'da AFAD'ın [heyelan](https://www.afad.gov.tr/heyelan),
[önlemler](https://www.afad.gov.tr/heyelan-oncesi-alinacak-onlemler) ve
[olay anı](https://www.afad.gov.tr/heyelan-aninda-yapilmasi-gerekenler)
sayfalarına erişim denendi; ağ geçidi `Tunnel connection failed: 403 Forbidden`
döndürdü. Sayfa içerikleri bu ortamda okunamadı ve güncel resmî içerikle
kontrol edilmiş olduğu iddia edilmiyor. Bu bağlantıların güncel içeriği ve
URL'leri yayın öncesinde doğrulanmalıdır. Kullanıcı belgesindeki güvenli
uzak gözlem/uzman bildirimi ilkeleri uygulandı; bilimsel risk yüzdesi veya
kesin zaman/yer tahmini üretilmedi. Resmî içerik ve eğitimci kontrolü,
görsel/pedagojik onay ve üretim yayını öncesinde açık kalır.
