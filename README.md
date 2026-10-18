# Afet Kahramanları – Güvenkent

5. sınıf öğrencileri için React + TypeScript + Phaser ile geliştirilen
2.5D afet farkındalığı macera oyununun oynanabilir meydan ve belediye prototipi.

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
yürüyün. Okul içi sonraki fazdadır. AFİ sizi takip eder; H veya AFİ düğmesi
üç kademeli ipucu verir.

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
```

Tarayıcı testi iç mekân ekran görüntülerini `docs/screenshots/town-hall-desktop.png`
ve `town-hall-mobile.png` olarak; ek dönüş görüntülerini
`/tmp/guvenkent-hall-checks/` altında oluşturur.

## Kapsam ve sanat durumu

- Oynanabilir alanlar: şehir meydanı ve belediye iç mekânı.
- Yeni afet bölgeleri, sınıf risk avı, sınav ve öğretmen sistemi bu fazda yok.
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
