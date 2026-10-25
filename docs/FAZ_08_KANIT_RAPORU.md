# Karlıtepe — oynanış kanıtları

Genel görünüm kullanıcı tarafından onaylandı. Bu turda sahne, karakterler,
ışıklandırma, nesneler, güvenli alan ve çarpışmalar değiştirilmedi.
Çalışma dalı: `feat/avalanche-karlitepe`; kaynak sürüm `e48019c`.

## Küçük arayüz düzenlemesi

Sağ alttaki düğme yalnızca Karlıtepe'de iki kısa satır gösterir:
“Güvenli yerden incele” ve gözlemlenen nesnenin adı. Zeynep yanında
“Uzmandan bilgi al”, hazırlık panosunda “Güvenli rota planını incele”,
çıkışta “Meydana güvenle dön” kullanılır. Gözlem noktası yakında değilken
“Gözlem noktasına yürü / Kapalı yola ve karlı yamaca girme” yazar.
Diğer sahnelerin etkileşim metinleri değişmedi. Karlıtepe'ye özel satır
kaydırma, hedef adını mobilde taşırmadan gösterir; yön kontrolü korunur.

## Beş kanıt anı

| Kanıt | Masaüstü | Mobil |
| --- | --- | --- |
| Çığ Uzmanı Zeynep ile ilk konuşma | [PNG](screenshots/karlitepe-zeynep-dialogue.png) | [PNG](screenshots/karlitepe-zeynep-dialogue-mobile.png) |
| Kapalı karlı yolun güvenli yerden incelenmesi | [PNG](screenshots/karlitepe-risk-inspection.png) | [PNG](screenshots/karlitepe-risk-inspection-mobile.png) |
| Hazırlık öncesi simülasyon | [PNG](screenshots/karlitepe-before.png) | [PNG](screenshots/karlitepe-before-mobile.png) |
| Hazırlık sonrası aynı kış koşulları | [PNG](screenshots/karlitepe-after.png) | [PNG](screenshots/karlitepe-after-mobile.png) |
| Önce / sonra karşılaştırma | [PNG](screenshots/karlitepe-comparison.png) | [PNG](screenshots/karlitepe-comparison-mobile.png) |

Yeni etkileşim metni: [masaüstü genel görünüm](screenshots/karlitepe-overview-desktop.png)
ve [mobil genel görünüm](screenshots/karlitepe-overview-mobile.png).
Zeynep konuşma başlığında ve kendi tanıtımında **Çığ Uzmanı** olarak belirtilir.
Fiziksel bariyer, uzak karlı yamaç ve eksik rota bilgisi üç ayrı gerçek gözlem
noktasıdır. Karşılaştırma kapalı yol, alternatif rota ve uyarı bilgisini ayrı
satırlarda gösterir; iki koşulda da **risk sürer** açıklaması kalır.

## Doğrulama

- Derleme: **geçti**; mevcut büyük Phaser paketi uyarısı sürer.
- Birim testleri: **42/42 geçti**.
- Masaüstü **1440×1000** ve mobil **390×844** gerçek oyun turu: **geçti**.
- Zeynep konuşması, üç riskin yanlış/doğru kararları, üç kademeli ipuçları,
  öğretici etkileşim metni, klavye/fare/dokunmatik kullanım doğrulandı.
- Tehlikeli yamaca yürüyüş ve tehlikeli zemine tıklama/dokunma engellendi;
  inceleme ve canlandırma sırasında karakterin güvenli konumu korundu.
- Aynı kar/hava/eğim/başlangıç senaryosu, ilk ziyaretçi konumu, sessiz kullanım,
  azaltılmış hareket, ayarlarda süre durması ve yeniden oynama doğrulandı.
- Beş giriş–çıkışta nesne, dinleyici ve texture sayıları sabit; modal veya
  tamamlanma çiftlenmedi. Bu turda sel/orman/heyelan tamamlanmadan Karlıtepe açıldı.
- **16 PNG** yeniden alındı; istenen beş anın **10 masaüstü/mobil kanıtı** rapordaki tablodadır.
- Önceki sahneler ile Karlıtepe sanat/sahne/model/panel dosyaları Git nesne
  kimlikleriyle karşılaştırıldı: **aynı**.

[Makine tarafından okunabilir güncel sonuçlar ve PNG SHA-256 kayıtları](screenshots/karlitepe-proof-test-results.json).

Bu turdaki tarayıcı komutu:

```sh
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/avalanche_smoke.py
```

Bu komut ilk günü gerçek girdilerle tamamlayıp doğrudan Karlıtepe'ye geçer.
Önceki sürümün belediye → okul → ev → sel → orman → heyelan → Karlıtepe tam
zincir sonuçları [ana teslim raporunda](FAZ_08_TESLIM_RAPORU.md) korunur;
bu arayüz turunda tam zincir yeniden çalıştırılmış olarak sunulmaz.
Mobil sonuçlar 390×844 Chromium dokunmatik emülasyonudur; fiziksel telefon
testi değildir. Ekran görüntüleri üretim derlemesinin gerçek oyun akışındandır,
fixture veya durum yazma/ışınlama yoluyla üretilmez.

## Sınırlar

Önceki sanat/ses eksikleri ve yayın öncesi resmî kaynak/uzman incelemesi
[ana teslim raporunda](FAZ_08_TESLIM_RAPORU.md) açık kalır. Bu turda başka
bölge, üçüncü gün veya sınav geliştirilmedi; `main` birleştirmesi yoktur.
Karlıtepe oynanış kanıtları için görsel ve pedagojik onay beklenir.
