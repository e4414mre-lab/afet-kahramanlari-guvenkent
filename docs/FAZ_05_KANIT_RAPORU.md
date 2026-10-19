# Dere Mahallesi — kanıt ve pedagojik kontrol

Dal: `feat/flood-dere-mahallesi`. Bu güncelleme sahne düzenini, çizimleri,
karakterleri veya hareket sistemini değiştirmez. Hasan Amca ilk konuşmada
“Ben bu mahallede yaşayan Hasan” diyerek kendisini tanıtır; bir kurtarma
uzmanı veya yetkili ekip olarak sunulmaz.

## İstenen beş an

Görüntüler gerçek ilk gün görevlerini tamamlayan oyuncunun ikinci gün
akışından alınır; görev durumu yazılmaz ve karakter ışınlanmaz.

| Kanıt | Masaüstü | Mobil |
| --- | --- | --- |
| Hasan Amca ile ilk konuşma | [PNG](screenshots/flood-hasan-desktop.png) | [PNG](screenshots/flood-hasan-mobile.png) |
| Riskli noktayı inceleme | [PNG](screenshots/flood-inspection-desktop.png) | [PNG](screenshots/flood-inspection-mobile.png) |
| Hazırlık öncesi yağış | [PNG](screenshots/flood-before.png) | [PNG](screenshots/flood-before-mobile.png) |
| Hazırlık sonrası aynı yağış | [PNG](screenshots/flood-after.png) | [PNG](screenshots/flood-after-mobile.png) |
| Önce / sonra karşılaştırma | [PNG](screenshots/flood-comparison.png) | [PNG](screenshots/flood-comparison-mobile.png) |

Dosya yolları: `docs/screenshots/` altındaki tabloda adı geçen PNG dosyaları.

## Pedagojik kontrol kapsamı

Üç nesne gerçek sahne etkileşimleriyle açılır. Her birinde yanlış seçim
araştırma ilerlemesini artırmaz; açıklama ve yeniden deneme verir. Doğru
seçim açıklama verir, ardından gerekçe ayrıca not edilir. Her iki geri
bildirim sırasında karakterin konumu değişmez; tehlikeli eylem oynatılmaz.

| Risk | Öğrencinin güvenli kararı |
| --- | --- |
| Dereye yakın kullanım / depo | Güvenli yerden gözlemle, yetişkine bildir; yapıyı kendin taşıma. |
| Tıkalı gider | Yetkili ekip bakımına yönlendir; suya girip kendin temizleme. |
| Alçak köprü | Geçme; uyarıları izle ve güvenli yüksek güzergâhı kullan. |

Klavye ve mobil yön düğmeleriyle kıyıya ilerleme denemesi çarpışma sınırında
kalır. Risk inceleme noktaları kuru meydandadır. Birim testleri suya rota
bulunmadığını ve köprünün iki senaryoda da kapalı kaldığını ayrıca doğrular.
Önce/sonra senaryosunun yağış parametreleri aynıdır: 45 saniye, yoğun yağış,
aynı dere yükselmesi ve aynı tohum. Hazırlık suyu ortadan kaldırmaz; karşılaştırma
“Kapalı, yine geçilmez” uyarısını korur. Bu bir eğitim simülasyonudur,
gerçek taşkın tahmini veya güvenlik garantisi değildir.

## Doğrulama

- `npm run build`: başarılı; mevcut büyük paket boyutu uyarısı sürer.
- `node --experimental-strip-types --test tests/*.test.ts`: 30/30 başarılı.
- `python tests/flood_smoke.py`: masaüstü ve dokunmatik tam kabul başarılı.
  Her iki turda ilk günün okul/ev/tatbikat akışı gerçek girdilerle tamamlandı.
  Üç riskin yanlış/doğru geri bildirimleri ve sabit güvenli oyuncu konumu,
  kıyıya yürüyüşün engellenmesi, üç AFİ ipucu, hazırlık kararları, aynı yağış,
  ayarlarda saatin durması ve karşılaştırma doğrulandı.
- Her iki turda beş mahalle giriş–çıkışında 29 sahne nesnesi, 43 doku,
  4 blur / 1 pointer / 4 klavye dinleyicisi sabit; tamamlanma sayısı 1 kaldı.
  Tarayıcı hata ve yatay taşma kontrolleri geçti.
- İstenen 10 PNG yeniden üretildi; PNG bütünlüğü/boyutları kontrol edildi.
  Konuşma ve inceleme ekranları iki boyutta açılıp görsel olarak incelendi.
  Önceki ev/tatbikat görüntülerinin testte üretilen kopyaları teslimden çıkarıldı.

Kontrol tarihi: 19 Ekim 2026. Tarayıcı tam kabul çıktıları:
[flood-evidence-results.json](screenshots/flood-evidence-results.json).

Masaüstü 1440×1000; mobil 390×844 Chromium dokunmatik emülasyonudur.
Fiziksel telefon testi yapılmış olarak sunulmaz.
Önceki kapsamlı teslim: [Faz 05 teslim raporu](FAZ_05_TESLIM_RAPORU.md).
Diğer afet bölgelerine geçilmedi; görsel ve pedagojik onay beklenir.
