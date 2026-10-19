# Faz 04 — Çağrı'nın evi ve planlı deprem tatbikatı

Kaynak: `feat/school-risk-hunt`, `e3a4522` (Faz 04 belgesi dâhil).
Geliştirme: **`feat/home-earthquake-drill`**. `main` birleştirmesi/dağıtım yok.
Yeni ev ve buluşma alanı görselleri kullanıcı görsel onayını bekler.

## Oynanabilir akış

1. Okulun altı riski yetişkin çözümüyle tamamlanınca AFİ ev görevini önerir.
   Meydandaki küçük **EV YOLU ↓** levhası ev girişine bağlanır. Okul bitmeden
   giriş açılmaz; gerçek öğretmen doğrulaması veya serbest gezinti modu yoktur.
2. Çağrı evde yürür, AFİ takip eder. Dört risk ve iki güvenli nesne kendi ayrı
   sprite/hitbox katmanlarıyla tıklanır, dokunulur veya yaklaşıp E/Enter ile açılır.
3. Ev riski için güvenli karar yetişkine bildirmektir. Yanlış seçim açıklama ve
   yeniden deneme verir. Bildirim ile yetişkin uygulaması ayrı adımlardır;
   çocuk ağır eşya taşımaz, tırmanmaz veya sabitleme yapmaz.
4. Altı öğe tamamlanınca sağlam masanın yanında **planlı eğitim tatbikatı**
   açık rızayla başlatılır. Ani/korkutucu bir gerçek afet olarak sunulmaz.
5. Pencere, merdiven ve asansör seçeneklerinin neden yanlış olduğu kısa
   açıklamalarla gösterilir; riskli hareket animasyonu oynatılmaz. Doğru kararda
   Çağrı'nın çökmüş, baş-boyun koruyan ve masa ayağına tutunan pozu gösterilir.
6. Korunma seçilmeden zaman ilerleyip tahliye açılmaz. Korunma sonrası altı
   saniyelik eğitim bekleyişinde sarsıntının bitmesi beklenir. Sarsıntı bitmeden
   kapı/tahliye açılamaz; korunma süresince hareket engellenir.
7. Sarsıntı bittikten sonra yetişkin yönlendirmesi, açık çıkış, hasarlı alanlardan
   uzak durma ve asansör kullanmama açıklanır. Eşya almak için geri dönme veya
   tesisata müdahale etme seçimi açıklamalı biçimde reddedilir.
8. Oyuncu kapıya gerçekten yürür, açık buluşma alanına geçer ve işaretli alana
   yürüyerek ulaşır. Başarı özeti ve yeniden oynama mevcuttur. Tamamlanma bir
   kez sayılır; tekrar oynama ikinci puan üretmez. Dış sisteme puan aktarılmaz.

## Ev nesneleri

| Nesne | Öğretilen gözlem ve güvenli karar |
| --- | --- |
| Yüksek kitaplık | Devrilebilir; yetişkine bildir, uygun yöntemle sabitlemeyi yetkili kişi yapsın |
| Oturma alanı üstündeki ağır çerçeve | Düşebilir; güvenli konumu ve bağlantıyı yetişkin sağlasın |
| Dolap üstündeki ağır sandık/kap | Yüksekten düşebilir; yetişkin alçak depolamaya alsın |
| Sol duvar kenarındaki kanepe | Kapı önü açıktır; dar yan geçişi yetişkin duvar boyunca küçük bir yerleşim düzeltmesiyle genişletsin |
| Sağlam masa | Bu örnek sahnede uygun korunma alanı; kesin güvenlik garantisi değildir |
| Ulaşılabilir afet çantası | Aileyle kişiye/koşullara uygun hazırlanır ve kontrol edilir; almak için tehlikeye geri dönülmez |

Taşınan eşyaların sprite konumu, ölçeği, seçim alanı ve yaklaşım noktası birlikte
güncellenir. Kanepe ve çarpışması başlangıçtan itibaren sol duvar kenarındadır. Yetişkin
çözümünde duvar boyunca biraz geriye alınır; yan geçiş genişler. Kapıya uzanan
ana koridor her iki durumda da açıktır. Diğer kanepe sabit oturma dekorudur.

## Mimari ve koruma

- `homeFlow.ts`: veri odaklı altı öğe, tipli kararlar ve durum makinesi:
  `homeIntro → inspectHome → drillReady → shaking → afterShaking → gatheringPoint → completed`.
- `homeLayout.ts`: gerçek sprite/zemin yerleşimi, yaklaşım ve değişen çarpışmalar.
- `HomeScene.ts`: `HomeScene` ve `GatheringPointScene`, gölgeler, y sırası,
  korunma pozu, düşük ses ve kamera etkisi; sahne kapanışında temizlik.
- `HomePanel.tsx`: kısa, klavye odaklı erişilebilir karar kartları; kritik yönergeler
  konuşma metni kapalı olsa da yazılı kalır. ESC nesne/başlatma kartını kapatır.
- `GameSession.homeUnlocked`: okul tamamlanma kapısı tek noktada tutulur; gelecekte
  öğretmen serbest gezinti politikası eklenebilir, şu anda böyle bir yetki verilmez.
- Meydanın resmi değiştirilmedi; küçük ev yolu levhası/hotspot eklendi.
  Belediye/sınıf sahne kodu, görselleri ve ortak `AdventureScene` motoru korunur.
- Dokunmatik regresyonda görülen HTML yön düğmesinden Phaser pencere dinleyicisine
  olay geçişi, oyun kabuğundaki düğme sınırında engellenir. Gerçek tuval dokunması,
  klavye hareketi ve mevcut sahne etkileşimleri engellenmez.

Ses tercihleri (voice/text/ambience/music/effects) ve azaltılmış hareket saklanır.
Efekt kapalıysa düşük tatbikat tonu çalmaz. Reduced motion açıksa kamera sarsıntısı
yoktur; pause ve sahne çıkışında ses durur. Yanlış cevapta panik, düşme veya
pencereye koşma görüntüsü yoktur. 112 yalnızca gerekli ve güvenli koşullarda
kullanılacak gerçek acil çağrı hizmeti olarak açıklanır; arama düğmesi/araması yoktur.

## Testler

```sh
npm run build
node --experimental-strip-types --test tests/*.test.ts
npm run preview -- --port 4173 --strictPort
# Ayrı terminal:
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/browser_smoke.py
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/school_risk_hunt_smoke.py
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/home_smoke.py
```

- `npm run build`: başarılı. Phaser paketinin 500 kB üzerindeki mevcut Vite
  boyut uyarısı sürer; derleme hatası yoktur.
- Birim testleri: **26/26 başarılı**. Ev durum makinesi, erken tahliye engeli,
  yanlış kararlar, tekrarda tek tamamlanma ve mobilya taşındıktan sonra gerçek
  yaklaşım noktalarına yol bulunması kapsanır.
- Ev: masaüstü klavye/fare ve mobil dokunmatik akış başarılı. Okul tamamlanmadan
  giriş kapalı; belediye ve altı okul riski oynandıktan sonra açılır. Dört risk,
  iki güvenli nesne, yanlış seçim, yetişkin çözümü ve taşınan nesneye yeniden
  tıklama doğrulandı. Üç yanlış sarsıntı kararı, korunma/bekleme, yanlış tahliye
  kararı, yürüyerek çıkış ve buluşma alanına ulaşma doğrulandı.
- Her iki ev görünümünde beş giriş–çıkış döngüsünde nesne/dinleyici/doku sayıları
  sabit kaldı. Sessiz, konuşma metni kapalı ve azaltılmış hareket açık tekrar
  oynandı: kritik yönergeler görünür, ses/sarsıntı kapalı, tamamlanma sayısı **1**.
- Önceki belediye/şehir akışı ve sınıfın masaüstü regresyonu başarılı; sınıfın
  dokunmatik regresyonunda **6 risk + 4 güvenli nesne**, beş giriş–çıkış döngüsü
  ve sabit nesne/dinleyici/doku sayıları doğrulandı.
- Paralel tarayıcı yükünde test sürücüsünün koridor dönüş noktasını aşması
  nedeniyle okul turu zaman aşımına uğradı. Arka dolaba giden sürücü rotası açık
  koridordan geçirildi; doğrulamalar kaldırılmadan turlar tek tarayıcıda sıralı
  tekrarlandı. Oyun hareket kodu değiştirilmedi.
- On yeni PNG açılarak doğrulandı. Mobil korunma kartı, masa altındaki Çağrı'yı
  kapatmaması için yalnızca tekrarlanan metin bölümü daraltılarak düzenlendi.

İlk teslim derlemesinde sıralı mobil regresyon **başarılı**: ev tam akışı, sınıf tam
akışı, eksik sınıf görselinde oynanabilirlik ve belediye giriş/başkan/berat/plan/
defter/çıkış akışı. Belediyede beş giriş–çıkış döngüsü de geçti; tarayıcı hata ve
yatay taşma kontrollerinde hata yoktur.

Tarayıcı testleri salt okunur QA durumunu izler; teleport/görev atlatma/puan yazma
kullanmaz. Başlangıçta ev kapısının kilitli olduğu da gerçek girdilerle denenir.
Ev kabulü belediye ve okulun altı riskini gerçekten oynayarak eve ulaşır.
Masaüstü 1440×1000 ve mobil 390×844 Chromium dokunmatik emülasyonudur;
fiziksel telefon/tablet denenmedi.

## Ekran görüntüleri

| An | Masaüstü | Mobil |
| --- | --- | --- |
| Ev salonu | [Aç](screenshots/home-desktop.png) | [Aç](screenshots/home-mobile.png) |
| Tatbikat kararı | [Aç](screenshots/earthquake-drill-decision.png) | [Aç](screenshots/earthquake-drill-decision-mobile.png) |
| Yanlış seçim açıklaması | [Aç](screenshots/earthquake-drill-feedback.png) | [Aç](screenshots/earthquake-drill-feedback-mobile.png) |
| Çök–Kapan–Tutun / doğru geri bildirim | [Aç](screenshots/earthquake-drill-protection-desktop.png) | [Aç](screenshots/earthquake-drill-protection-mobile.png) |
| Tahliye sonrası buluşma | [Aç](screenshots/home-gathering-desktop.png) | [Aç](screenshots/home-gathering-mobile.png) |

## Sanat varlıkları, eksikler ve yayın öncesi doğrulama

On yerel PNG ve bir yumuşak tatbikat sesi eklendi. PNG'ler OpenAI görsel üretim
aracıyla hazırlandı; önceki karakter tasarımı korunarak ayrı bir korunma pozu
üretildi. Ayrıntılı kaynak listesi: [ev varlıkları](../public/assets/home/README.md).
Sahne düz geometrik kutularla nihai oyun olarak sunulmaz; ayrı mobilya ve obje
katmanları, sıcak ışık, parke/halı, gölge ve perspektifli sanat kullanılır.

Yönlü yürüyüş/korunma animasyon atlası, yetişkin müdahale animasyonları, AFİ
seslendirmesi, müzik/ambiyans kayıtları, optimize doku atlasları ve ayrıntılı
ön/arka kesişim maskeleri henüz yoktur. Korunma tek kare eğitim illüstrasyonudur;
fiziksel yapı/masa dayanıklılığı simülasyonu veya kesin güvenlik garantisi değildir.

Bu, korkutmayan ve yeniden denenebilir planlı eğitim senaryosudur. İçeriğin
**yayın öncesinde yerel resmî afet yönergeleri ve yetkili eğitimcilerle doğrulanması
beklenir**; bu prototip resmî afet eğitimi onayı aldığı iddiasında değildir.
İkinci gün bölgeleri, sınav ve öğretmen paneli geliştirilmedi. Görsel onay beklenir.

## Görsel onay sonrası ev düzenlemesi

- Kapı önündeki kanepe sol duvar kenarına taşındı. İnceleme metni, sprite,
  yaklaşım noktası ve çarpışması birlikte güncellendi; kapı engeli varmış gibi
  geri bildirim verilmez. Dört risk/iki güvenli öğe akışı değişmedi.
- Dolap üstüne alçak saksı ve iki çocuk kitabından oluşan küçük dekor eklendi;
  yürüyüş/etkileşim alanı kaplamaz. Oda, ışık, diğer sahneler ve karakter
  kaynak görselleri korunur.
- Mevcut baş-boyun koruyan, çökmüş ve masa ayağına uzanan tek kare Çağrı pozu
  korunur; sarsıntı bitene kadar gösterilir. Tam animasyon atlası hâlâ eksiktir.
- Korkutucu ses, siren, panik veya tehlikeli davranış animasyonu eklenmedi.
  Mevcut kısa hafif kamera etkisi azaltılmış harekette, yumuşak ton sessiz
  modda kapalıdır.
- Yeni koridor testi başlangıçta ve yetişkin çözümü sonrasında kapı yolunun
  tamamının çarpışmasız olduğunu doğrular.

Son düzenlemenin doğrulaması: `npm run build` başarılı (mevcut Vite paket boyutu
uyarısı devam ediyor); birim testleri **26/26** geçti. Son derleme üzerinde
`GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/home_smoke.py`
masaüstü ve dokunmatik emülasyonunda bütünüyle başarılıdır. Altı nesne gerçek
sprite üzerinden açıldı, taşınan nesneler yeniden incelendi; yanlış/doğru kararlar,
masa altındaki korunma pozu, sarsıntı sonrası yürüyerek tahliye ve buluşma alanı
geçildi. Her iki görünümde beş giriş–çıkış döngüsü ve sessiz/azaltılmış hareketli
tekrar başarılı; tamamlanma sayısı 1 kaldı. Tarayıcı hatası veya yatay taşma yok.
On ekran görüntüsü son yerleşimle yeniden oluşturulup PNG olarak doğrulandı.
Masaüstü klavye/fare, mobil Chromium dokunmatik emülasyonudur; fiziksel cihazda
denenmedi. Önceki sahne/motor/karakter kaynakları bu
revizyonda değiştirilmedi. `main` birleştirilmedi; test ve görsel onay beklenir.
