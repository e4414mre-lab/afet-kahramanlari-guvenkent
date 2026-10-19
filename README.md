# Afet Kahramanları – Güvenkent

5. sınıf öğrencileri için React + TypeScript + Phaser ile geliştirilen
2.5D afet farkındalığı macera oyununun meydan, belediye, sınıf, ev/tatbikat,
Dere Mahallesi, Çamlık Ormanı ve Yamaç Mahallesi prototipi.

**Belediye binasının görsel tasarımı onaylandı. Animasyon ve ses varlıkları henüz nihai değildir.**

## Başlangıç

Node 24 ve npm 11 ile doğrulanmıştır. Repoda kilit dosyası henüz yoktur.

```sh
npm install --package-lock=false
npm run dev
```

Öğrenci adı/takma adı girip **Keşfe Başla** seçeneğini kullanın. Ad veya
puan sunucuya kaydedilmez. WASD/yön tuşları veya zemine tıklama/dokunmayla
Çağrı'yı hareket ettirin. Dokunmatik yön kontrolü de kullanılabilir.
Belediye kapısında **E / Enter** veya **Etkileşim** ile içeri girin. Başkanla
konuşup görev beratını kabul edin; kent planından okul rotasını alın. Görev
defteri mevcut hedefi gösterir. Ön kapıdan meydana dönüp okul girişine
yürüyün. Okul girişinde E / Enter ile 5-A sınıfına girin. Altı risk ve dört güvenli
nesneyi inceleyin; güvenli çözümü seçip öğretmene bildirim/yetişkin çözümü
canlandırmasını izleyin. AFİ takip eder; H veya AFİ düğmesi üç kademeli
ipucu verir. İlk iki risk rehberli, diğerleri bağımsız keşiftir.

Sınıfta Q yakındaki nesneleri seçer; E / Enter etkileşimi açar. İnceleme
kartındaki düğmeler Tab / Shift+Tab / Enter ile, kapatma Esc ile kullanılabilir.
Bulgu ve güvenli nesne sayaçları ayrıdır; tekrar inceleme çift sayılmaz.

Oyun içinden Ayarlar'a gidip geri dönmek konum ve görevi korur. Sessiz mod
ve azaltılmış hareket tercihleri bu cihazda saklanır; henüz ses dosyası yoktur.
Görev ilerlemesi yalnızca mevcut oyun oturumundadır.

## Kontroller

```sh
npm run build
node --experimental-strip-types --test tests/*.test.ts
```

Çalışan geliştirme sunucusuna karşı masaüstü ve dokunmatik kabul testi:

```sh
# Python Playwright paketi ve /usr/bin/chromium gerektirir.
python tests/browser_smoke.py
python tests/school_risk_hunt_smoke.py
```

Belediye tarayıcı testi iç mekân ekran görüntülerini `docs/screenshots/town-hall-desktop.png`
ve `town-hall-mobile.png` olarak; ek dönüş görüntülerini
`/tmp/guvenkent-hall-checks/` altında oluşturur. Sınıf testi
`docs/screenshots/school-classroom-desktop.png` ve
`school-classroom-mobile.png` görüntülerini oluşturur.

## Kapsam ve sanat durumu

- Oynanabilir alanlar: şehir meydanı, belediye, 5-A sınıfı, ev/tatbikat, Dere Mahallesi, Çamlık Ormanı ve Yamaç Mahallesi.
- Sınav/öğretmen paneli, üçüncü gün ve çığ bölümü bu prototipte yok.
- Öğretmen bilgilendirme ekranı gerçek kimlik doğrulaması yapmaz.
- Karakterler ayrı transparan PNG konseptlerdir; yürüyüş/yön atlasları eksiktir.
- Meydan çevresi mevcut boyalı konsepttir. Belediye mobilyaları ve NPC,
  oda kabuğundan bağımsız sprite katmanlarıdır; nihai sanat onay bekler.

[Faz 1 teslim ve test raporu](docs/FAZ_01_TESLIM_RAPORU.md) ·
[Varlık kaynağı ve eksik grafik listesi](public/assets/city/README.md) ·
[Faz gereksinimleri](docs/FAZ_01_GORSEL_VE_OYNANIS_PROTOTIPI.md)

Sonraki faza kullanıcı görsel onayıyla geçilir.

[Faz 2 belediye iç mekânı teslim/test raporu](docs/FAZ_02_TESLIM_RAPORU.md) ·
[Belediye sanat varlıkları ve eksikler](public/assets/town-hall/README.md)

[Faz 3 sınıf risk avı teslim ve test raporu](docs/FAZ_03_TESLIM_RAPORU.md) ·
[Sınıf görsel varlıkları ve eksikler](public/assets/school/README.md)

Yeni sınıf görselleri onay bekleyen konseptlerdir. Yetişkin müdahaleleri
eğitim canlandırmasıdır; dış sisteme bildirim veya puan aktarımı yapılmaz.

## Faz 04: ev ve planlı deprem tatbikatı

Okuldaki altı yetişkin çözümünü tamamlayınca meydandaki **EV YOLU ↓** girişini
kullanın. Evde dört risk ve iki güvenli öğeyi inceleyin; sağlam masanın yanında
planlı tatbikatı başlatın. Sarsıntıda korunma, bittikten sonra yetişkin
yönlendirmesiyle çıkış ve buluşma alanına yürüme ayrı aşamalardır.

Kritik yönergeler sessiz modda ve konuşma metni kapalıyken de yazılıdır.
Azaltılmış harekette kamera sarsıntısı yoktur. Tekrar oynama ikinci tamamlanma
sayımı üretmez. İlk gün tamamlanınca ikinci gün bölge seçimi açılır.

[Teslim, testler ve masaüstü/mobil görseller](docs/FAZ_04_TESLIM_RAPORU.md).

### Faz 05 — Dere Mahallesi

Deprem tatbikatını ve buluşma alanını tamamladıktan sonra meydandaki
**İkinci gün bölgelerini aç** düğmesinden Dere Mahallesi seçilir. Çamlık ve Yamaç da seçilebilir; Karlıtepe
henüz geliştiriliyor. Hasan Amca, üç güvenli risk araştırması, hazırlık panosu ve
aynı 45 saniyelik yağışın önce/sonra karşılaştırması oynanabilir. Simülasyon gerçek
sel tahmini değildir. Hazırlık ve rapor yalnızca açık oturumda tutulur.

Yeni kabul testi (önceki belediye/okul/ev akışını da gerçek girdilerle oynar):
`GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/flood_smoke.py`.
[Testler, ekran görüntüleri ve varlık eksikleri](docs/FAZ_05_TESLIM_RAPORU.md).

### Faz 06 — Çamlık Ormanı

Aynı ikinci gün seçiminden **Çamlık · Orman yangını farkındalığı** açılır;
Dere Mahallesi'ni önce bitirmek gerekmez. Orman Görevlisi Elif ile tanışın,
üç riski güvenli seyir yolundan inceleyin ve duman belirtisinde yaklaşmadan
güvenli uzaklaşma/haber verme kararı verin. Uzman hazırlıklarını seçip aynı
rüzgâr, sıcaklık ve kuruluk varsayımlarıyla iki 40 saniyelik, atlanabilir
canlandırmayı karşılaştırın. Çocuk yangın söndürmez; gerçek 112 araması yapılmaz.

Tam kabul (önceki ilk gün ve Dere Mahallesi akışlarını da oynar):
`GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/forest_smoke.py`.
`--direct` seçeneği ilk günü gerçek girdilerle tamamlayıp Dere oynanmadan
Çamlık'ın açıldığını da kontrol eder; görev/konum yazma kestirmesi kullanmaz.
Yerel üretim önizlemesi için önce `npm run build`, sonra
`npm run preview -- --port 4173 --strictPort` çalıştırılır.

[Testler ve masaüstü/mobil kanıtlar](docs/FAZ_06_TESLIM_RAPORU.md) ·
[Yeni sanat varlıkları ve eksikler](public/assets/forest/README.md).
Orman bölümü korunur; yeni Yamaç bölümü için görsel ve pedagojik onay beklenir.

### Faz 07 — Yamaç Mahallesi

İlk günü tamamladıktan sonra ikinci gün seçiminden **Yamaç · Heyelan farkındalığı**
açılır. Dere/Çamlık'ı önce bitirmek gerekmez. Jeoloji Mühendisi Murat ile konuşun,
üç riski güvenli platformdan inceleyin; çatlağa, riskli yola veya şev altına
girmeyin. Uzman hazırlıklarını seçip aynı yağış, zemin, eğim ve başlangıç
koşullarıyla iki atlanabilir 40 saniyelik canlandırmayı karşılaştırın. Her yağmur
heyelan oluşturmaz; belirtiler kesin teşhis değildir.

Tam zincir kabulü:
`GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/landslide_smoke.py --chain`.
Bu tur ilk gün, Dere ve Çamlık'ı gerçek girdilerle oynayıp Yamaç'a geçer.
Bayraksız komut ilk günden doğrudan Yamaç'ı seçer; bağımsız sahne denemesi
`npm run dev -- --port 5173 --strictPort` ile `--component` seçeneğini kullanır
ve üretim kapısını doğruladığı iddiasında değildir.

[Testler, masaüstü/mobil kanıtlar ve resmî içerik kontrolünün açık sınırı](docs/FAZ_07_TESLIM_RAPORU.md) ·
[Yeni görseller ve eksikler](public/assets/landslide/README.md).
Karlıtepe, üçüncü gün ve final sınavı yapılmadı; görsel/pedagojik onay beklenir.
