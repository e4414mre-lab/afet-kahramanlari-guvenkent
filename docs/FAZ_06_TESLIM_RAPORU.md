# Faz 06 — Çamlık Ormanı: orman yangını farkındalığı

Kaynak: GitHub `feat/flood-dere-mahallesi`, `e7e97cf` (Faz 06 şartnamesi).
Geliştirme: `feat/forest-fire-camlik`. `main` birleştirmesi ve üretim dağıtımı yok.
Heyelan ve çığ geliştirilmedi. Görsel ve pedagojik onay beklenir.

## Oynanabilir bölüm

İlk günün gerçek deprem tatbikatı tamamlanınca ikinci gün seçimi açılır.
Dere Mahallesi ve Çamlık serbest sırayla oynanır; Dere'yi bitirmek ormana
geçişin ön koşulu değildir. Diğer iki bölge “Henüz geliştiriliyor” olarak kapalıdır.

Çağrı güvenli ziyaret alanında yürür; AFİ takip eder. Elif kendisini orman
görevlisi olarak tanıtır. İlk riskte AFİ otomatik kısa rehberlik yapar;
isteğe bağlı ipuçları üç kademelidir. Üç bağımsız nesne güvenli gözlem
noktasından incelenir:

| Gözlem | Güvenli karar / gerekçe |
| --- | --- |
| Piknik noktasındaki köz belirtisi | Yaklaşmadan uzaklaş, yetişkine bildir; gerekiyorsa 112 üzerinden uzman yardım. Çocuk söndürmez. |
| Kuru dal/ot birikimi | Mevzuata uygun bakımı yetkililere yönlendir; dal yakarak temizleme yok. |
| Eksik güzergâh bilgisi | Açık uyarı, güvenli çıkış ve acil erişim planı iste; ormana kestirme yok. |

Her nesne `unseen → identified → decisionMade → reviewed` durumlarından geçer.
Yanlış cevap gerekçeli geri bildirim verir ve tekrar denenir. Doğru cevabın
gerekçesi ayrıca not edilir; tekrar inceleme bulgu/tamamlama sayısını artırmaz.

Duman mikro görevinde iki tehlikeli karar reddedilir; karakter yerinde kalır.
Dumanın her zaman kesin yangın olmadığı açıklanır. Güvenli uzaklaşma
yönlendirmelerine uyma, yetişkine ve gerekirse 112'ye konumla haber verme
öğretilir. Gerçek arama, telefon bilgisi toplama veya bildirim gönderme yoktur.

Üç hazırlık: erken uyarı/güvenli güzergâh, yetkili bakım/yanıcı yük yönetimi,
gözetleme/erken bildirim/ziyaretçi eğitimi. En az bir hazırlık seçilir.
40 saniyelik iki canlandırma atlanabilir. Rüzgâr (18 km/sa kuzeydoğu), sıcaklık
(32°C), kuruluk, süre ve tohum aynıdır; hava hazırlığa göre değiştirilmez.
Bunlar eğitim varsayımlarıdır, güncel hava ölçümü veya tahmin değildir.

Hazırlık sonrası seçime göre ziyaretçiler daha erken güvenli güzergâha
geçer, uzak uzman ekip temsilleri daha erken haberdar olur, birikim daha
seyrek bir bakım temsiliyle gösterilir. Çocuk bu uygulamaları yapmaz.
Uzak duman devam eder; tehlikeli bölge iki turda da kapalıdır. Karşılaştırma
uyarı, yönlendirme, uzman koordinasyonu ve olası risk etkisini nitel anlatır;
kesin zarar yüzdesi veya sıfır risk garantisi yoktur.

## Uygulama ve korunan sistemler

- `src/data/forestFire.ts`: içerik, kısa diyaloglar, üç risk, ipuçları,
  duman kararları, önlemler, ortak dondurulmuş hava ve kare hesabı.
- `forestFlow.ts`: şartnamedeki dokuz aşama; duman kararı hazırlığı açar.
  Dış durum simülasyon aşamalarını ayıran TypeScript union kullanır.
  Hazırlıklar JSON tipinde yalnızca açık oturumda tutulur; sunucu kaydı yoktur.
- `CamlikForestScene.ts` / `forestLayout.ts`: ortak hareket motorundan ayrı
  orman sahnesi, gerçek nesne hitbox'ları, güvenli yaklaşım noktaları,
  Elif/pano ayak izleri, sınır çarpışması ve tehlikeli tıklamayı engelleyen katmanlar.
- `ForestPanel.tsx`: konuşma, gözlem, karar/gerekçe, duman, hazırlık,
  süre/geç, karşılaştırma, rapor ve tekrar. Ses/metin ayarı kapalıyken kritik
  yönergeler kalır. Dokunma olayları Phaser'a sızmaz; klavye odağı korunur.
- `tests/forestFlow.test.ts` ve `tests/forest_smoke.py`: durum/güvenlik testleri,
  gerçek ilk gün geçişi, iki bölge sırası, yanlış/doğru geri bildirimler ve
  masaüstü/dokunmatik kanıtları. `forest-fixture.html/.tsx` yalnızca bağımsız
  geliştirme testi içindir. Mevcut `flood_smoke.py` için isteğe bağlı açık oturum
  dönüşü eklendi; eski akış doğrulamaları ve beş tekrar korunur. Harita testindeki
  Çamlık kilit beklentisi, yeni oynanabilir bölgeye göre güncellendi.
- `src/styles/app.css`: yalnızca `.forest-*` panel/karşılaştırma kuralları eklendi.
- `GameSession`, `GamePreview` ve meydan yönlendirmesine yeni sahne kaydı eklenir.
  Eski sahnelerin çizimleri, karakter görselleri ve hareket motoru değiştirilmez.
- Duman yalnızca uzaktadır; panik, yaralanma, sert alev, sarsıntı veya alarm yok.
  Azaltılmış hareket durağan aşamalar kullanır. Ayarlarda simülasyon saati durur.

## Sanat ve açık eksikler

[Yedi yeni yerel PNG ve kaynak notları](../public/assets/forest/README.md).
Sahne ayrıntılı diorama ve bağımsız alfa sprite'ları kullanır; basit geometrik
bir oda/zemin nihai görsel olarak sunulmaz. Duman bir görsel eğitim katmanıdır.
Yönlü Elif/ekip animasyonu, kayıtlı Türkçe ses, orman ambiyans kayıtları,
ileri örtüşme maskeleri ve optimize atlaslar eksiktir. Varsa tarayıcı Türkçe
TTS isteğe bağlıdır; profesyonel kayıt veya tüm cihazlarda ses garantisi yoktur.

## Doğrulama

```sh
npm run build
node --experimental-strip-types --test tests/*.test.ts
# npm run preview -- --port 4173 --strictPort çalışırken:
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/forest_smoke.py
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/forest_smoke.py --direct
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/browser_smoke.py
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/school_risk_hunt_smoke.py
```

- Son derleme başarılı; mevcut Phaser/Vite büyük paket boyutu uyarısı sürer.
- 34/34 birim testi başarılı: eski 30 test ve dört orman kabul testi. Elif,
  üç yanlış/doğru bulgu, duman karar kapısı, aynı meteorolojik parametreler,
  kalan risk, JSON kopyaları, üç ipucu, bütün güvenli yaklaşım rotaları,
  tehlikeye rota bulunmaması ve gerçek tatbikat kilidi kapsanır.
- Tam zincir kabulü iki görünümde başarılı: belediye/okul/ev/tatbikat,
  Dere'nin üç araştırması ve aynı yağış karşılaştırması, ardından Çamlık'ın
  üç araştırması, duman kararı, hazırlık, aynı hava karşılaştırması ve tekrar.
  Çamlık'ta beş giriş–çıkışta 35 nesne, 50 doku, 4 blur / 1 pointer / 4 klavye
  dinleyicisi sabit; tamamlanma sayısı 1 kaldı.
- Son duman konumu/rüzgâr açıklaması sonrasında doğrudan Çamlık kabulü iki
  görünümde başarılı: Dere tamamlanma sayısı 0 iken orman açıldı. Aynı üç risk,
  iki yanlış duman kararı, güvenli karar, üç hazırlık, önce/sonra ve tekrar geçti.
  Beş giriş–çıkışta 35 nesne ve 43 doku sabit kaldı (Dere sanatı yüklenmediği
  için tam zincirdeki 50 dokudan daha az). Tamamlanma yine 1.
- Tıkla-git, WASD/yön ve dokunmatik yön kontrolü, E/Enter nesne etkileşimi,
  AFİ konuşmasını Enter/dokunmayla kapatma, sınırın ötesine tıklamanın
  engellenmesi ve geri bildirim sırasında sabit güvenli konum doğrulandı.
  Mobil sessiz/metin kapalı/azaltılmış harekette kritik yönergeler erişilir;
  gerçek duman sprite konumu/boyutu alfa değeri durağan aşama içinde sabit kaldı.
  Ayarlarda kesirli simülasyon saati de durdu. Tek canvas/aktif sahne,
  tarayıcı hataları ve yatay taşma kontrolleri geçti.
- 20 yeni PNG doğrulandı; seçilmiş konuşma/risk/duman/önce-sonra/karşılaştırma
  görüntüleri açılıp incelendi. Kanonik görüntüler son doğrudan Çamlık turundandır.
  Görev ve gerçek oyuncu konumu kanıtı: [masaüstü JSON](screenshots/camlik-evidence-desktop.json),
  [mobil JSON](screenshots/camlik-evidence-mobile.json).
- Eski belediye kabul paketi masaüstü/dokunmatik geçti: başkan, berat, kent
  planı, görev defteri, beş giriş–çıkış ve eksik başkan görselinde açık uyarı.
- Eski sınıf paketi masaüstü/dokunmatik geçti: 6 risk + 4 güvenli nesne,
  gerçek uzaktan nesne tıklamasında masaların etrafından dolaşma, kapı yolu,
  beş giriş–çıkış, sabit 96 nesne / 26 doku; dokunmatik DOM düğmelerinin
  alttaki sprite'ları tetiklememesi ve eksik kitaplıkta oynanabilir uyarı.
- Testlerin ürettiği eski bölüm PNG/JSON dosyaları kaynak sürüme döndürüldü;
  teslim yalnızca yeni orman kanıtlarını ekler. Eski sanat varlıkları, hareket
  motoru ve belediye/sınıf/ev/Dere sahne sınıfları kaynakla aynıdır.
- Üretim çıktısında fixture HTML/TSX girişleri yoktur. Son CSS temizliği
  yalnızca yinelenen, aynı değerli bölge seçim kurallarını kaldırır; orman
  dışındaki hesaplanan stilleri değiştirmez.

Kontrol tarihi: 19 Ekim 2026.
[Toplu test sonuçları](screenshots/camlik-test-results.json).
Masaüstü 1440×1000; mobil 390×844 Chromium dokunmatik emülasyonudur.
Fiziksel telefon/tablet denenmiş olarak sunulmaz. QA yalnızca okunur;
kanonik görüntüler gerçek ilk gün ve ikinci gün akışından alınır.
Bağımsız `tests/forest-fixture.html` geliştirme bileşen testi kapıyı doğrulamaz;
üretim giriş noktası değildir, görüntüleri `/tmp/guvenkent-forest-component` altındadır.

## Kanıt görüntüleri

| An | Masaüstü | Mobil |
| --- | --- | --- |
| Orman genel görünümü | [PNG](screenshots/camlik-overview-desktop.png) | [PNG](screenshots/camlik-overview-mobile.png) |
| Elif ile ilk konuşma | [PNG](screenshots/camlik-elif-dialogue.png) | [PNG](screenshots/camlik-elif-dialogue-mobile.png) |
| Risk inceleme | [PNG](screenshots/camlik-risk-review.png) | [PNG](screenshots/camlik-risk-review-mobile.png) |
| Yanlış risk kararı | [PNG](screenshots/camlik-risk-feedback-wrong.png) | [PNG](screenshots/camlik-risk-feedback-wrong-mobile.png) |
| Doğru risk kararı | [PNG](screenshots/camlik-risk-feedback-correct.png) | [PNG](screenshots/camlik-risk-feedback-correct-mobile.png) |
| Duman kararı | [PNG](screenshots/camlik-smoke-decision.png) | [PNG](screenshots/camlik-smoke-decision-mobile.png) |
| Yanlış duman kararı açıklaması | [PNG](screenshots/camlik-smoke-feedback.png) | [PNG](screenshots/camlik-smoke-feedback-mobile.png) |
| Hazırlık öncesi | [PNG](screenshots/camlik-before.png) | [PNG](screenshots/camlik-before-mobile.png) |
| Hazırlık sonrası, aynı hava | [PNG](screenshots/camlik-after.png) | [PNG](screenshots/camlik-after-mobile.png) |
| Önce / sonra karşılaştırması | [PNG](screenshots/camlik-comparison.png) | [PNG](screenshots/camlik-comparison-mobile.png) |
