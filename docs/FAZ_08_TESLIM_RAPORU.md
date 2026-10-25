# Faz 08 — Karlıtepe: çığ farkındalığı

Kaynak: GitHub `feat/landslide-yamac`, `8dc74fc` (Faz 08 şartnamesi dâhil).
Geliştirme dalı: `feat/avalanche-karlitepe`. Görsel ve pedagojik onay beklenir.
`main` birleştirmesi veya üretim yayını yapılmadı; üçüncü gün, bütçe,
1000 planlama puanı, final sınavı ve öğretmen paneli geliştirilmedi.

## Oynanış

İlk günün ev tatbikatı ve güvenli buluşması tamamlandıktan sonra ikinci gün
haritasındaki dört bölge serbest sırayla seçilir. Karlıtepe için sel, orman
veya heyelan bölümünü bitirme zorunluluğu yoktur. Çağrı ve AFİ mevcut onaylı
karakterleri ve hareket motorunu kullanır; Zeynep kendisini **Çığ Uzmanı**
olarak tanıtır. İlk araştırmada AFİ çığın tanımını açıklar ve güvenli gözleme
rehberlik eder; diğer incelemelerde üç kademeli isteğe bağlı ipuçları vardır.

| Gözlem | Güvenli karar ve açıklama |
| --- | --- |
| Kapalı karlı yol / fiziksel bariyer | Kestirme için geçilmez. Resmî duyuruya uyulur, yetkililerin belirttiği alternatif rota kullanılır. |
| Uzak dik ve kar yüklü yamaç | Üzerine basıp kar denemesi yapılmaz. Görünüş kesin çığ teşhisi değildir; uzman değerlendirmesi ve güncel uyarılar izlenir. |
| Eksik veya okunaksız rota bilgisi | Telefon haritası resmî duyurunun yerine geçmez. Bilinmeyen patikaya tek başına girilmez; yetişkin/uzmandan güncel rota bilgisi alınır, eksik levha bildirilir. |

Her nesne `unseen → identified → decided → explained` akışını izler. Yanlış
seçim açıklama ve yeniden deneme verir; ilerlemeyi artırmaz. Doğru kararın
gerekçesi ayrıca not edilir. Üç açıklanmış bulgu hazırlık panosunu açar.
Tekrar inceleme ve tekrar canlandırma ikinci tamamlanma üretmez.

Hazırlık planı: yetkili çığ izleme/değerlendirme ve güncel uyarılar; riskli
girişleri kapatma ve alternatif rota duyurusu; ziyaretçi bilgilendirmesi.
Çocuk teknik müdahale, kar ölçümü veya kurtarma yapmaz. Seçimler tipli,
JSON'a dönüştürülebilir oturum verisidir; kalıcı kayıt/sunucu başarısı yoktur.

Durumlar: `notStarted → meetZeynep → inspectThreeRisks → selectPreparedness
→ beforeSimulation → afterSimulation → compare → completed`.

## Aynı kış koşulları ve güvenli gözlem

İki atlanabilir 40 saniyelik eğitim canlandırmasının ortak senaryosu:
`karlitepe-winter-01`, `scenarioSeed=97`, `snowpack=high`, `slope=steep`,
`weather=cold`; aynı rüzgâr, kar yüzeyi ve ziyaretçi başlangıç konumu.
Karın hareket göstergesi iki koşulda aynıdır: hazırlık karı azaltmaz veya
yamacı güvenli hâle getirmez. Fark, seçilen uyarı/bilgilendirme planı ile
ziyaretçilerin alternatif güvenli güzergâha daha erken yönlendirilmesidir.
İlk karede ziyaretçiler aynı konumdadır; sonuç önceki denemenin kare hızına
veya kalan konumuna bağlı değildir.

Riskli yol **iki denemede de kapalı**, riskli yamaç erişilemez ve artık risk
vardır. Önceki durumda geciken, yolun fiziksel kapatması değil duyuru ve
güvenli güzergâh bilgisidir. Karşılaştırma uyarı, güzergâh, yol kullanımı ve
hazırlık etkisini nitel anlatır; iki sütunda da “risk sürer” görünür.
Gerçek risk yüzdesi, mühendislik hesabı veya kesin çığ zamanı üretilmez.

Güvenli yürüyüş alanı yeni arka plandaki korkuluğun iç tarafına göre ayrı
kısıtlanır. Tehlikeli yamaç, uzak kapalı yol ve patika için yürüyüş rotası yoktur;
klavye sınırı ve güvenli olmayan zemin tıklamaları ayrıca engellenir. Nesne
hitbox'ları ile güvenli gözlem yaklaşım noktaları ayrıdır. Mobilde araştırma noktaları, güvenli gözlem konumundaki **Etkileşim**
düğmesiyle incelenir; kamera
nesneye yönelirken Çağrı riskli yere taşınmaz. Uzak yamaç arka planın gerçek
kar yüzeyidir; üzerine yüzen bir dağ minyatürü çizilmez.

Yalnızca uzaktaki küçük kar katmanı birkaç piksel hareket eder. Korkutucu çöküş,
gömülme, yaralanma, kamera sarsıntısı, alarm veya panik sesi yoktur. Azaltılmış
harekette iki/üç durağan aşama gösterilir. Kritik güvenlik metinleri ses ve
konuşma yazısı kapalıyken kalır. Önceki beş ses/yazı tercihi ve reducedMotion
korunur; yeni bölümün düşük/normal okuma sesi seçimi yalnızca bu bölüm içindir.
Türkçe sistem sesi varsa isteğe bağlı TTS kullanılır; kayıtlı ses iddiası yoktur.

## Dosyalar ve sanat durumu

- `src/data/avalanche.ts`: metinler, üç risk, seçenekler, ipuçları, hazırlıklar,
  ortak senaryo ve aynı koşulları üreten kare hesabı.
- `src/game/avalancheFlow.ts`: bağımsız akış, gerekçe aşaması, hazırlık verisi,
  tek tamamlanma, yeniden deneme ve bölüm okuma sesi.
- `src/game/avalancheLayout.ts`, `AvalancheScene.ts`: Karlıtepe alanı,
  korkuluk sınırları, NPC ayak izleri, gerçek gözlem alanları, kamera,
  sakin kar göstergesi, temizlenen giriş olayları ve TTS.
- `src/components/AvalanchePanel.tsx`: kısa konuşma, inceleme, karar, hazırlık,
  süre/geç, karşılaştırma ve kısa rapor; klavye odağı ve dokunmatik arayüz.
- `GamePreview.tsx`, `story.ts`, `CitySquareScene.ts`: yeni sahnenin koşullu
  entegrasyonu ve ikinci gün haritasındaki Karlıtepe seçimi.
- `src/styles/app.css`: yalnızca yeni `.avalanche-*` kuralları eklendi.
- Yeni birim ve gerçek girişli tarayıcı testleri; geliştirme fixture'ı üretim
  giriş noktası değildir. Sel/orman/Yamaç testlerinin harita beklentileri
  yeni açılan bölgeye uyarlandı; Yamaç testine aynı açık oturumdan sonraki
  bölüme geçmek için isteğe bağlı `keep_open` dönüşü eklendi.

[Altı yeni PNG'nin kaynakları ve eksikleri](../public/assets/avalanche/README.md).
Yönlü uzman/ziyaretçi animasyon atlasları, ayrı kışlık karakter varyantları,
kayıtlı Türkçe sesler, kış ambiyansı, ayrıntılı örtüşme maskeleri ve optimize
atlaslar eksiktir. Bu teslim görsel/pedagojik onay bekleyen oynanabilir prototiptir.

## Testler

```sh
npm run build
node --experimental-strip-types --test tests/*.test.ts
# Üretim önizlemesi 4173'te:
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/avalanche_smoke.py --chain
# Alternatif doğrudan ilk gün → Karlıtepe rotası:
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/avalanche_smoke.py
# Sadece geliştirme fixture'ı; gerçek ilk gün kapısını doğrulamaz:
python -u tests/avalanche_smoke.py --component
```

25 Ekim 2026 kabul sonuçları:

- `npm run build`: geçti; mevcut büyük Phaser paketi uyarısı sürer, derleme hatası yoktur.
- Birim testleri: **42/42 geçti**; önceki testler dâhil.
- Masaüstü **1440×1000** ve mobil **390×844** tam zincir: geçti. Belediye →
  sınıfın altı riski → evin dört risk/iki güvenli nesnesi → Çök–Kapan–Tutun,
  güvenli tahliye/buluşma → sel → orman/duman kararı → Yamaç → Karlıtepe
  gerçek klavye/fare/dokunma girdileriyle oynandı.
- Karlıtepe: Zeynep konuşması, AFİ'nin ilk rehberliği/üç ipucu, üç araştırma,
  yanlış/doğru gerekçeler, hazırlık seçimi, aynı kış koşulları ve ilk ziyaretçi
  konumu, ayarlarda süre durması, sessiz/azaltılmış hareket ve tekrar oynama geçti.
- Yürüyüş ve tehlikeli zemin tıklama/dokunma engeli geçti; karar ve canlandırma
  sırasında karakter güvenli yerde kaldı. İki denemede de yol kapalı/risk sürer.
- Sel, orman, Yamaç ve Karlıtepe'de **beş giriş–çıkış**: nesne/dinleyici/texture
  sayıları sabit, modal veya tamamlanma çiftlenmesi yok. Karlıtepe sonrasında
  ev/sel/orman/Yamaç sayaçları birer kez tamamlanmış olarak korundu.
- **16 gerçek oyun PNG'si** dosya bütünlüğü ve boyutları doğrulanarak hazırlandı.
- İlk mobil turda yön tuşunun bırakılması hedefi birkaç piksel aşarak güvenli
  korkuluk sınırında durdu; inceleme hâlâ erişilebilirdi. Testteki hassas waypoint,
  mevcut 80 piksellik etkileşim yarıçapı içinde 35 piksel daha aşağı seçildi.
  Oyun kodu ve çarpışma sınırı değiştirilmedi. Mobil tam zincir yeniden çalıştırılıp
  geçti; tamamlanmış masaüstü sonucu aynı oyun kodu için korundu.

[Makine tarafından okunabilir sonuçlar ve görsel SHA-256 kayıtları](screenshots/karlitepe-test-results.json).
Önceki teslim görüntüleri test sırasında yenilendi, ardından kaynak sürümlerine
getirildi; yalnızca yeni Karlıtepe kanıt dosyaları teslim ediliyor.

Masaüstü 1440×1000, mobil 390×844 Chromium dokunmatik emülasyonudur; fiziksel
telefon/tablet denenmiş olarak sunulmaz. QA yalnızca okunur; görev yazma,
ışınlama veya önceden tamamlanmış sahte kayıt yoktur. Zincir testi belediye,
sınıf, ev/tatbikat, sel, orman, Yamaç ve Karlıtepe'yi aynı açık oturumda gerçek
girdilerle oynar. Fixture görüntüleri `/tmp` altındadır; aşağıdaki teslim
PNG'leri üretim derlemesindeki gerçek oyun akışından alınır.

[Önceki varlık ve modüllerin Git kimliğiyle koruma kanıtı](screenshots/karlitepe-source-regression.json):
62 önceki varlık dosyası ve 29 korunan sahne/model/panel dosyası kaynak dalla
birebir aynıdır. Önceki sahnelerin resimlerine veya hareket motoruna yazılmadı.

## Ekran görüntüleri

| An | Masaüstü | Mobil |
| --- | --- | --- |
| Genel görünüm | [PNG](screenshots/karlitepe-overview-desktop.png) | [PNG](screenshots/karlitepe-overview-mobile.png) |
| Zeynep ile konuşma | [PNG](screenshots/karlitepe-zeynep-dialogue.png) | [PNG](screenshots/karlitepe-zeynep-dialogue-mobile.png) |
| Risk inceleme | [PNG](screenshots/karlitepe-risk-inspection.png) | [PNG](screenshots/karlitepe-risk-inspection-mobile.png) |
| Yanlış karar | [PNG](screenshots/karlitepe-risk-feedback-wrong.png) | [PNG](screenshots/karlitepe-risk-feedback-wrong-mobile.png) |
| Doğru karar gerekçesi | [PNG](screenshots/karlitepe-risk-feedback-correct.png) | [PNG](screenshots/karlitepe-risk-feedback-correct-mobile.png) |
| Hazırlık öncesi | [PNG](screenshots/karlitepe-before.png) | [PNG](screenshots/karlitepe-before-mobile.png) |
| Hazırlık sonrası aynı koşullar | [PNG](screenshots/karlitepe-after.png) | [PNG](screenshots/karlitepe-after-mobile.png) |
| Önce / sonra karşılaştırma | [PNG](screenshots/karlitepe-comparison.png) | [PNG](screenshots/karlitepe-comparison-mobile.png) |

## Yayın öncesi güvenlik / pedagojik inceleme

20 Ekim ve 25 Ekim 2026'da [AFAD çığ](https://www.afad.gov.tr/cig) ve
[Meteoroloji Genel Müdürlüğü](https://www.mgm.gov.tr/) erişimleri denendi;
ikisi de ağ geçidinden `Tunnel connection failed: 403 Forbidden` döndürdü.
Güncel resmî içerik bu ortamda okunamadı; doğrulanmış olduğu iddia edilmiyor.
URL/içerik doğrulaması, güncel resmî çığ/hava uyarıları ve ilgili uzman ile
5. sınıf pedagojik incelemesi **yayın öncesi açık kontrol** olarak kalır.
Mevcut metinler kullanıcı şartnamesinin güvenli uzak gözlem, yetişkin/uzman
bildirimi ve riskin sıfırlanmaması ilkelerine dayanır. Kullanıcı görsel ve
pedagojik onayı olmadan sonraki faza veya üretime geçilmez.
