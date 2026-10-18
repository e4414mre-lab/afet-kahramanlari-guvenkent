# Afet Kahramanları – Güvenkent

5. sınıf öğrencileri için React + TypeScript + Phaser ile geliştirilen
2.5D afet farkındalığı macera oyununun ilk oynanabilir meydan prototipi.

**Görsel onay bekliyor. Konsept görseller nihai oyun sanatı değildir.**

## Başlangıç

Node 24 ve npm 11 ile doğrulanmıştır. Repoda kilit dosyası henüz yoktur.

```sh
npm install --package-lock=false
npm run dev
```

Öğrenci adı/takma adı girip **Keşfe Başla** seçeneğini kullanın. Ad veya
puan sunucuya kaydedilmez. WASD/yön tuşları veya zemine tıklama/dokunmayla
Çağrı'yı hareket ettirin. Dokunmatik yön kontrolü de kullanılabilir.
Belediyenin önünde **E** veya **Etkileşim** ile ilk görevi alın; okulun
önüne vardığınızda görev tamamlanır. AFİ sizi takip eder.

Oyun içinden Ayarlar'a gidip geri dönmek konum ve görevi korur. Sessiz mod
ve azaltılmış hareket tercihleri bu cihazda saklanır; henüz ses dosyası yoktur.
Görev ilerlemesi yalnızca mevcut oyun oturumundadır.

## Kontroller

```sh
npm run build
node --experimental-strip-types --test tests/cityModel.test.ts
```

Çalışan geliştirme sunucusuna karşı masaüstü ve dokunmatik kabul testi:

```sh
# Python Playwright paketi ve /usr/bin/chromium gerektirir.
python tests/browser_smoke.py
```

Tarayıcı testi ekran görüntülerini `/tmp/guvenkent-checks/` altında oluşturur.

## Kapsam ve sanat durumu

- Tek oynanabilir alan: şehir meydanı, belediye ve okul giriş noktaları.
- Yeni afet bölgeleri, sınıf risk avı, sınav ve öğretmen sistemi bu fazda yok.
- Öğretmen bilgilendirme ekranı gerçek kimlik doğrulaması yapmaz.
- Karakterler ayrı transparan PNG konseptlerdir; yürüyüş/yön atlasları eksiktir.
- Çevre tek boyalı konsepttir; katmanlı nihai izometrik harita henüz yoktur.

[Faz 1 teslim ve test raporu](docs/FAZ_01_TESLIM_RAPORU.md) ·
[Varlık kaynağı ve eksik grafik listesi](public/assets/city/README.md) ·
[Faz gereksinimleri](docs/FAZ_01_GORSEL_VE_OYNANIS_PROTOTIPI.md)

Sonraki faza kullanıcı görsel onayıyla geçilir.
