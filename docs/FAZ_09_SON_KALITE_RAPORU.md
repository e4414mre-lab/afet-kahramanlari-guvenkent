# Üçüncü gün — son kalite kontrolleri

Kullanıcı bütçe ekranlarının tasarımını ve temel seçim sistemini onayladı.
Bu çalışma aynı `feat/day3-budget-planning` dalında, `8411ead` sürümünün
üzerine yapılır. Onaylı belediye odası, karakterler, önceki afet sahneleri,
hareketler, bütçe maliyetleri ve seçim/geri alma kuralları korunur.

## Yapılan küçük düzenlemeler

- Yetersiz bütçede açıklama doğrudan ilgili önlemin altında görünür ve ekran
  okuyucuya bildirilir. Örneğin: “Bu önlem 160 planlama puanı istiyor; 0 puanın
  kaldığı için 160 puan eksik. Seçim eklenmedi; bir önlemi geri alıp yeniden
  deneyebilirsin.” Panel açıklamayı görünür alana kaydırır; bütçeden para düşmez.
- Dört bölge kartında ayrılan **puan tutarı**, seçili önlem sayısı ve küçük bütçe
  çubuğu gösterilir. Çubuklar ortak 1.000 puan ölçeğindedir; afet riski yüzdesi
  değildir. Son raporda ayrıca dört bölgenin kaynak dağılımı gösterilir.
- Kaynak ayrılmayan aktif bölgede AFİ ihtiyacı ve önceliği düşündüren bir soru
  sorar. “Son karar senin” açıklaması korunur; zorunlu dengeli dağılım, otomatik
  satın alma veya başarı puanı cezası eklenmez. Sıfır önlemli bilinçli planlar
  hâlâ raporlanabilir.
- Karşılaştırmada **“Dört bölgenin sonuçlarını birlikte gör”** dört mini raporu
  açar. Her bölgede önce yeni önlem olmadığı, sonra seçilen hazırlıklar ve
  devam eden risk görülür. Önceki ayrıntılı bölge karşılaştırmaları da kalır.
- Son belediye raporu seçilen önlemleri ve maliyetlerini, **harcanan / kalan**
  toplam kaynağı, her bölgeye ayrılan puanı, hazırlık etkilerini ve devam eden
  riskleri gösterir. Önceki denemeler, gerekçe ve yeniden planlama korunur.

Harcanan puan ve bölgesel dağılım aynı benzersiz seçim kümesinden türetilir;
ayrı, birbirinden kopabilecek bakiye kayıtları tutulmaz. Planlama kaynağı
akademik başarı puanı veya gerçek belediye bütçesi değildir.

## Okunabilirlik ve kontroller

Onaylı renkler ve kart düzeni korunur. Tabletlerde kart/gövde yazıları büyütülür;
büyük ekranda ana metin ve düğmeler daha büyük gösterilir. Bölge tutarları yalnızca
renkle anlatılmaz; sayı ve bölge adı da vardır. Dokunmatik kaydırma, normal
klavye/fare kullanımı, ayarlar, sessiz kullanım ve azaltılmış hareket test edilir.

| Düzen | Tarayıcı ölçüsü | Kontrol |
| --- | --- | --- |
| Masaüstü | 1440×1000 | Klavye ve fare |
| Mobil | 390×844 | Dokunma ve metin kaydırma |
| Tablet dikey | 768×1024 | Dokunma ve okunabilirlik |
| Tablet yatay | 1024×768 | Dokunma ve okunabilirlik |
| Akıllı tahta / büyük ekran | 1920×1080 | Dokunma ve büyütülmüş metin |

Bunlar Chromium ekran/dokunma emülasyonlarıdır; fiziksel akıllı tahta veya
tablet üzerinde denenmiş olarak sunulmaz. Gerçek üretim derlemesindeki mobil
oyun oturumu yeniden boyutlandırılarak tablet ve büyük ekran görüntüleri de alınır;
plan, bütçe ve deneme geçmişinin korunduğu kontrol edilir.

## Güncel sonuçlar

- `npm run build`: başarılı; mevcut Phaser paket boyutu uyarısı sürüyor.
- Otomatik testler: **53/53** başarılı; 4.096 seçim kümesi, bütçe toplamları,
  yetersiz bütçede değişmeme, geri alma ve tekrar seçim doğrulandı.
- Gerçek oyun zinciri: masaüstü ve mobilde toplam **12 başarılı bölüm sonucu**.
  Önceki beş afet tamamlanması korunarak üçüncü güne normal yoldan ulaşıldı.
- Her düzende üç plan denemesi, iki yeniden planlama ve beş belediye giriş–çıkışı
  başarılı. Son plan: **8 önlem, 950 harcanan, 50 kalan**, dört bölge raporu.
- Telefon, iki tablet ölçüsü ve büyük ekranda gerçek dokunmatik kaydırma,
  geçmişi açma/kapatma ve bütçenin korunması doğrulandı. Tablet ana metni
  en az 15 px, büyük ekran ana metni en az 18 px; yatay taşma yok.
- Beş geliştirme bileşen denemesi ve hata sınırı/kurtarma denemesi başarılı.
  Bunlar gerçek oyun zincirinden ayrı tutulur.
- Önceki sahne/varlık/sistemlerden **106 dosya** temel sürümle birebir aynı.
- **33 PNG** doğrulandı; gerçek oyun oturumundan alındı.

Makinece okunabilir sonuçlar: [son kalite testleri](screenshots/day3-quality-test-results.json)
ve [kaynak koruma kontrolü](screenshots/day3-quality-source-regression.json).

Bu turda eski oyun zinciri üzerinden normal üçüncü gün açılışı, bütçe,
karşılaştırma, iki yeniden planlama ve beş belediye giriş–çıkışı kontrol edilir.
Geliştirme bileşen denemeleri gerçek açılış koşulu veya gerçek oyun görüntüsü
olarak sunulmaz. [Önceki teslim raporu](FAZ_09_TESLIM_RAPORU.md) tarihsel
sonuçları ve sanat/ses/saklama sınırlarını ayrıca açıklar.

## GitHub kanıt görüntüleri

| Kanıt | Masaüstü | Mobil |
| --- | --- | --- |
| Bütçe paneli ve bölgesel tutarlar | [PNG](screenshots/day3-budget-desktop.png) | [PNG](screenshots/day3-budget-mobile.png) |
| Yetersiz bütçe açıklaması | [PNG](screenshots/day3-insufficient-budget.png) | [PNG](screenshots/day3-insufficient-budget-mobile.png) |
| Dört bölgenin sonuç özeti | [PNG](screenshots/day3-regional-comparison.png) | [PNG](screenshots/day3-regional-comparison-mobile.png) |
| Bölgenin ayrıntılı önce/sonrası | [PNG](screenshots/day3-before-after.png) | [PNG](screenshots/day3-before-after-mobile.png) |
| Kaynak ayrılmayan bölge / AFİ | [PNG](screenshots/day3-unfunded-region.png) | [PNG](screenshots/day3-unfunded-region-mobile.png) |
| Yeniden planlama | [PNG](screenshots/day3-replanning.png) | [PNG](screenshots/day3-replanning-mobile.png) |
| Son belediye raporu ve dağılım | [PNG](screenshots/day3-final-report.png) | [PNG](screenshots/day3-final-report-mobile.png) |

Mobil sonuç özetindeki dört bölge ayrı ayrı kaydırılarak da kaydedilir:
[Dere](screenshots/day3-regional-comparison-flood-mobile.png),
[Çamlık](screenshots/day3-regional-comparison-wildfire-mobile.png),
[Yamaç](screenshots/day3-regional-comparison-landslide-mobile.png),
[Karlıtepe](screenshots/day3-regional-comparison-avalanche-mobile.png).

Gerçek oyun oturumundaki son raporun ek ölçüleri:
[tablet dikey](screenshots/day3-tablet-portrait-final-report.png),
[tablet yatay](screenshots/day3-tablet-landscape-final-report.png),
[büyük ekran](screenshots/day3-board-touch-final-report.png).

## Sınırlar

Yeni afet veya sınav geliştirilmedi; öğretmen paneline girilmedi. Yalnızca
bu geliştirme dalına gönderilir, `main` birleştirmesi ve üretim yayını yoktur.
Puan/etki modeli temsili eğitim planlamasıdır; gerçek afet tahmini veya güvenlik
garantisi değildir. Yayın öncesi uzman ve güncel resmî güvenlik/pedagojik
incelemesi ile önceki rapordaki kalıcı kayıt/ses varlığı sınırları sürer.
