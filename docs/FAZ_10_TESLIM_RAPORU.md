# FAZ 10 — Final değerlendirme teslimi

Temel sürüm: `feat/day3-budget-planning`, `4bd5b8a`.
Geliştirme dalı: `feat/final-assessment`.

## Oyuncunun yolu

Üçüncü gün belediye raporundaki **“Çağrı ve AFİ ile final değerlendirmesi”**
düğmesi final girişini açar. Belediye raporu onaylanmadan final açılamaz.
Mevcut belediye sahnesi arka planda kalır; final açıkken Phaser hareketi ve
sahne etkileşimleri kilitlenir. Rapora dönmek, sınava yeniden girmek veya
ayarları açmak aynı açık oturumdaki ilerlemeyi silmez. Henüz gönderilmeyen
ilk yanıt taslağı da korunur.

15 etkinliğin her biri yanıtlandığında sonuç açılır; yanlış yanıt bitirmeyi
engellemez. Süre sınırı, korkutucu efekt, cezalandırıcı ses veya başarısızlık
eşiği eklenmedi. Çağrı ve AFİ'nin mevcut görselleri, belediye odası ve afet
bölgelerinin mevcut sanat varlıkları kullanıldı.

## Soru seçimi ve puan

- 60 kayıttan 15 afet–tür grubunun her birinden tam bir etkinlik seçilir.
  Her afet her türde bir kez, her tür toplam beş kez temsil edilir.
- Tohumlu karıştırma önce **5 kolay, 6 orta, 4 zor** atamasını 15 gruba dağıtır;
  ardından uygun soruyu seçip etkinlik sırasını karıştırır. Deneme tohumu,
  havuz sürümü ve seçilen kimlikler sonuç kaydında bulunur. Aynı tohum aynı
  seçimi üretir; yeni sınav yeni bir tohum alır.
- D/Y doğru 20, yanlış 0; eşleştirme ve kart yerleştirmede
  `Math.round(20 × doğru / toplam)` yalnız bir kez hesaplanır. Toplam en fazla
  **300 değerlendirme puanı**. Belediye planlama puanı ayrı kalır.
- Her etkinliğin **ilk gönderilen yanıtı** puanlanır ve kilitlenir. Açıklama
  sonrasındaki **“Puansız yeniden dene”** öğretici düzeltmedir; ilk yanıtın
  puanını değiştirmez. Bu kural girişte ve geri bildirimde açıklanır.
- Final kaydı yalnız 15 etkinlik yanıtlandıktan sonra, bitirme anında bir kez
  oluşur. İlk/son/en iyi sınav ayrı tutulur. Aynı yanıtı tekrar gönderme,
  önceki soruya dönme ve tekrar finalleştirme ek puan kazandırmaz.
- Tamamen yeni bir sınav bütün etkinlikleri yeniden açar; önceki sonuçları
  toplamaz. Sonuçta tür performansı (her biri /100), afet performansı (her biri
  /60) ve beş konuya özgü gelişim önerileri gösterilir.

## İçerik incelemesi ve v1.1

Özgün [v1 havuzu](data/final-question-bank-v1.json) değiştirilmedi.
[Çalışan v1.1 havuzu](data/final-question-bank-v1.1.json) aynı 60 kimliği, afet,
tür, zorluk ve puan metadatasını korur. Yerine rastgele örnek soru yazılmadı.
[Madde bazında önce/sonra ve gerekçeler](data/final-question-bank-v1.1-review.json)
60 kaydın tamamını izlenebilir kılar.

**Kritik düzeltme:** `earthquake-match-1`, yetkili dolap sabitlemesini
“kaçınılacak davranış” kategorisine koyuyordu. Yetkili sabitlemesi güvenli bir
hazırlıktır; bu yanlış ilişkilendirme kaldırıldı.

Özgün 20 eşleştirmenin tamamı “Durum / Güvenli yanıt / Kaçınılacak davranış”
kategorilerini ayırt ettiriyordu. Bazılarında durum ve yanıt farklı zamanları
anlatıyordu; üç bağımsız eşleştirme yerine bir senaryonun etiketlenmesi söz
konusuydu. Hepsi aynı tema ve kimlik korunarak **üç gerçek durum–güvenli eylem
çiftine** çevrildi. Sağ sütun tohumlu karıştırılır; satır hizası yanıt vermez.
Çiftler güvenli gözlem, resmî yönlendirme ve çocuk/yetişkin/uzman sorumluluğunu
ayırt ettirir.

D/Y maddelerindeki genel “güvenli değildir” açıklamaları yerine maddeye özgü
neden ve güvenli alternatif eklendi. Örneğin `landslide-tf-2` için her yağışın
kesin heyelan olmadığı, yağış–zemin–eğimin birlikte uzman tarafından
değerlendirildiği açıklandı.

Kart yerleştirmede iki kartın da yanıtlanması istendi. “Belirti” gibi başlıklar
için “davranışı seç” denmesi kaldırıldı. `earthquake-drag-3` belirsiz
“sabitleme” sözcüğü yetkili yetişkinin yaptığı iş olarak açıklaştırıldı.
`flood-drag-1` içindeki bağlamdan kopuk içme suyu kartı yerine açık ve güvenli
tahliye yolu kullanıldı. Gider temizliği, orman bakımı ve zemin incelemesinde
uzman/yetkili rolü belirtildi. **Bir başlığa uymayan kart her zaman tehlikeli
değildir** açıklaması korunur; riskin tamamen yok olmadığı vurgulanır.

Bu bir içerik ve tutarlılık revizyonudur; AFAD veya başka bir resmî kurumun
nihai onayı alınmış olarak sunulmaz. Yayın öncesinde güvenlik uzmanı ve
pedagojik uzman incelemesi gereklidir. Havuzdaki zorluk etiketleri şartnameyle
aynı kaldı; gerçek öğrenci pilotu ile kalibrasyon henüz yapılmadı.

## Etkileşim ve erişim

- D/Y, eşleştirme ve kart yerleştirme normal düğmelerle Tab/Enter/Space ve
  fare/dokunma ile yanıtlanır. Eşleştirmede durum → davranış seçilir.
- Kartlarda fare veya pointer sürükleme ve **kartı seç → hedefe dokun**
  alternatifleri aynı yanıt modelini kullanır. Mobilde sürükleme zorunlu değildir.
  Kart yerleşimleri görünen hedef adıyla açıklanır; yalnız renge dayanılmaz.
- Her etkinlikte üç katmanlı, isteğe bağlı AFİ ipucu vardır. İlk iki ipucu
  düşünmeyi yönlendirir; üçüncüsü açıklamayı açar. İpucu istenmesi puan cezası
  oluşturmaz. Yanlış/kısmi/doğru geri bildirimler sembol ve metinle gösterilir.
- Panel içeriği kaydırılır; ilerleme ve gezinme görünür kalır. Telefon düzeni,
  tablet ve büyük ekran yazı boyutları ayrı düzenlendi. Odak panelde tutulur;
  Escape güvenli belediye raporuna döndürür.
- Beş ses/yazı ayarı ve azaltılmış hareket ayarı aynen korunur. Kritik soru,
  güvenlik ve geri bildirim metinleri yazı ayarı kapalıyken de kalır.
- İsteğe bağlı “Soruyu sesli oku” yalnız seslendirme açıkken ve tarayıcı
  destekliyorsa çalışır. Tarayıcının Türkçe sesi kullanılır; soru, ayar veya
  ekran değiştiğinde durdurulur. Yeni insan seslendirmesi olduğu iddia edilmez.

## Teknik değişiklikler

- `src/data/finalAssessment.ts`: ayrık birleşimli TypeScript soru tipleri,
  60 kayıt/grup/ID/hedef doğrulaması, tohumlu seçici ve saf puanlama.
- `src/game/finalAssessmentFlow.ts`: oturum, taslaklar, ilk yanıtlar,
  puansız alıştırmalar, ipuçları ve bir kez finalleştirilen sonuçlar.
- `src/components/FinalAssessmentPanel.tsx`: mevcut görsellerle final giriş,
  üç etkileşim türü, geri bildirim, sonuç ve hatadan güvenli dönüş.
- `story.ts`, `TownHallScene.ts`, `GamePreview.tsx`, `Day3Panel.tsx`:
  belediye raporundan güvenli giriş/dönüş ve hareket kilidi; mevcut dünya
  çizimleri ve mekaniklerin geri kalanı korunur.
- `app.css`: yalnız `.final-*` kapsamlı yeni stiller.
- `tests/finalAssessment.test.ts`, `tests/final_assessment_smoke.py`:
  veri/seçim/puan/ilerleme ve gerçek girişli tarayıcı kabul kontrolleri.
  `tests/final-fixture.*` yalnız Vite geliştirme bileşen kontrolüdür;
  üretim derlemesine girmez. `day3_smoke.py` test zincirini sürdürmek için
  isteğe bağlı oturumu açık bırakabilir; eski varsayılan davranışı korunur.

## Test sonuçları

- `npm run build`: başarılı. Mevcut Phaser paket boyutu uyarısı devam eder.
- `node --experimental-strip-types --test tests/*.test.ts`: **61/61** başarılı.
  Eski 53 test ve final için 8 test; 10.000 tohumda tam dağılım, havuzdaki
  60 sorunun seçilebilirliği, hatalı veri reddi, kısmi puanlar, 300 tavanı,
  tekrar/ilk-son-en iyi kayıtlar, taslak ve final giriş koşulu doğrulandı.
- Üretim derlemesinde masaüstü ve mobil **14 başarılı bölüm sonucu**:
  her düzende ev/deprem → sel → orman → heyelan → çığ → belediye planı → final.
  Okul risk avı ve belediye hikâyesi de gerçek etkileşimlerle geçildi.
- Her düzende iki final sınavı (30 etkinlik) tamamlandı. İlk sınavda yanlış
  yanıtın geri bildirimi ve puanı doğrulandı; ikinci sınav **300/300**. Kısmi
  puanlar otomatik ve bileşen testlerinde ayrıca doğrulandı.
  İlk/son/en iyi ayrı, belediye bütçesi **50 kalan puan** olarak değişmeden kaldı.
- Masaüstünde klavye ve gerçek pointer sürüklemesi; mobilde kart → hedef
  dokunması geçti. Telefon 390×844, tablet 768×1024 ve büyük ekran 1920×1080
  gerçek dokunma kaydırması başarılı; yatay taşma yok.
- Büyük ekran için ayrıca **1920×1080 dokunmatik bileşen testinde iki tam sınav**
  ve bütün türlerin yanıtlanması başarılı. İki normal bileşen kontrolü de geçti.
- Beş ayar kapalı ve azaltılmış hareket açıkken kritik metinler ve yanıtlar
  çalıştı; ayarlar sonrası deneme korunuyor. Üç katmanlı ipucu, paneli kapat/aç,
  hatadan kurtarma ve puansız doğru düzeltme başarılı.
- Kasıtlı görünüm hatası testinde aynı tohum/soru sırası, yanıt ve **20 puan**
  korundu; güvenli dönüş ve yeniden açma başarılı, final kaydı çoğalmadı.
- **102** eski kaynak/varlık/veri dosyası, mevcut CSS başlangıcı ve belediye
  dünya çizim yöntemi temel sürümle aynı. Önceki sahnelerin görselleri değişmedi.
- **18 gerçek oyun PNG'si** dosya boyutu, ölçü ve SHA-256 ile doğrulandı.

İlk tam test komutunda önceki testlerin beklediği `--chain` bayrağı eksikti;
Karlıtepe'nin doğrudan giriş yolundaki konum/metin kontrolünde durdu. Yeni final
koşucusu bu bayrağı varsayılan olarak açacak şekilde düzeltildi. Oyun kodu veya
eski güvenlik doğrulaması bu nedenle değiştirilmedi; yukarıdaki sonuçlar tam
zincirin yeniden çalıştırılan başarılı koşusudur.

[Makinece okunabilir sonuçlar](screenshots/final-test-results.json) ve
[kaynak koruma kanıtı](screenshots/final-source-regression.json).

Fiziksel telefon/tablet/akıllı tahta denemesi yapılmış olarak sunulmaz;
tarayıcı ölçü/dokunma emülasyonu kullanılır. Geliştirme bileşen görüntüleri
GitHub kanıtı olarak kullanılmaz; kanıt PNG'leri gerçek üretim oyun akışındandır.

## Kontrolleri yeniden çalıştırma

Mevcut Node/npm bağımlılıkları ve Python Playwright + Chromium ile:

```bash
npm run build
node --experimental-strip-types --test tests/*.test.ts
# Bir terminalde üretim önizlemesi:
npm run preview -- --port 4173
# Başka bir terminalde, gerçek üretim zinciri (masaüstü + mobil):
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/final_assessment_smoke.py
```

Bileşen ve hata kurtarma kontrolleri Vite geliştirme sunucusunu 5173 portunda
ister: `python tests/final_assessment_smoke.py --component`,
`python tests/final_assessment_smoke.py --component --board`,
`python tests/final_error_smoke.py`. Bileşen görüntüleri depo dışındaki
`/workspace/final-validation/component-images` klasörüne yazılır.

## Görüntüler

| Ekran | Masaüstü | Mobil |
| --- | --- | --- |
| Final girişi | [PNG](screenshots/final-intro.png) | [PNG](screenshots/final-intro-mobile.png) |
| Doğru–Yanlış | [PNG](screenshots/final-true-false.png) | [PNG](screenshots/final-true-false-mobile.png) |
| Eşleştirme | [PNG](screenshots/final-matching.png) | [PNG](screenshots/final-matching-mobile.png) |
| Kart yerleştirme | [PNG](screenshots/final-drag-drop.png) | [PNG](screenshots/final-drag-drop-mobile.png) |
| Final sonuç | [PNG](screenshots/final-result-desktop.png) | [PNG](screenshots/final-result-mobile.png) |
| Konuya göre öneriler | [PNG](screenshots/final-result-details.png) | [PNG](screenshots/final-result-details-mobile.png) |

Geri bildirim görüntüleri ve tohum/yanıt/puan kayıtları `docs/screenshots/final-*`
altındadır. Yerel test sonuçları resmî başarı belgesi değildir; Supabase,
kalıcı kayıt, sunucu doğrulaması ve gerçek sınıf liderliği bu kapsamda yoktur.
Sayfa yenilenirse ilerleme sıfırlanır; açık oturumda panel/ayar/gezinme ilerlemeyi korur.

## Görsel ve ses varlıkları

Eksik bir sahne basit şekillerle tamamlanmış gibi sunulmadı. Yeni oda veya
karakter çizimi gerektiren bir sahne eklenmedi; belediye odası, Çağrı, AFİ ve
beş afetin mevcut görselleri kullanıldı. Yeni özel ses kayıtları yoktur;
tarayıcı Türkçe sesi ve mevcut ses ayarlarıyla sınırlıdır. Yeni animasyon veya
resmî sertifika görseli varmış gibi gösterilmez.

Yalnız `feat/final-assessment` dalına gönderilir. `main` birleştirmesi, Vercel
üretim yayını ve öğretmen paneli geliştirilmedi. Görsel ve işlevsel kullanıcı
onayı beklenir.
