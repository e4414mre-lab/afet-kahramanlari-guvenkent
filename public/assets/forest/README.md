# Çamlık Ormanı görsel varlıkları

Bu görevde OpenAI görsel üretimiyle oluşturulmuş, görsel/pedagojik onay bekleyen
konsept oyun varlıklarıdır. Mevcut şehir, belediye, sınıf, ev ve Dere Mahallesi
varlıklarının üzerine yazılmadı. Kaynaklar `/workspace/generated_images` altında
korundu; bu klasörün kopyaları oyunun yerel dosyalarıdır. Haricî CDN gerekmez.

| Dosya | Kullanım / kaynak üretim kimliği |
| --- | --- |
| area.png | Sıcak izometrik çam ormanı, kulübe, gözetleme kulesi, güvenli ziyaret alanı ve ahşap sınır. `d2a9e37d-554c-49f2-99b7-08930b2bcae4` |
| elif.png | Bağımsız alfa kanallı orman görevlisi; küçük uzak ekip temsilleri de aynı kıyafeti kullanır. `519f03e3-428a-4b1b-9bc8-285f0ab48f3e` |
| embers.png | Sınırın ötesinden incelenen taş çember/köz belirtisi; alev yok. `a3ffc3de-5a10-4d3a-a652-41186b1dd791` |
| brush.png | Kuru dal, ot ve eski kütük çevresi birikimi. `bd4ac952-40ac-4b5c-8a8c-0855b0961a5d` |
| sign.png | Eksik yön levhası bulunan ziyaretçi panosu. `92f62127-0233-4687-ada6-5fb49188f476` |
| managed.png | Yetkili bakımını temsil eden daha seyrek yanıcı örtü; ağaç kesme eylemi yok. `deb4507c-c7ea-4d26-ba3d-87c64cc537c8` |
| smoke.png | Yumuşak, soluk alfa duman dokusu; yalnızca erişilemez uzak sırtta. `3caa42d6-92ec-4949-805c-48c0ed5c5c2f` |

Çağrı/AFİ mevcut onaylı şehir sprite'larıdır. Ziyaretçiler ve küçük bilgi panoları,
önceki bölümün `public/assets/flood/residents.png` ve `notice.png` varlıklarını
aynı ışık/üslup ailesinde yeniden kullanır. Bağımsız risk nesnelerinin hitbox'ları
çizilen görsellerden, güvenli yaklaşım noktaları ayrı gezinme verisinden alınır.
Arka plandaki ayrıntılar dekoratif diorama katmanıdır; ziyaretçi kulübesine veya
uzak gözetleme kulesine girilebildiği iddia edilmez.

Eksikler: Elif/uzak ekip için yönlü yürüme ve yüz animasyon atlasları, özgün
kayıtlı Türkçe Elif/AFİ sesleri, lisanslı orman ambiyans kayıtları, daha ayrıntılı
bitki örtüsü ön/arka örtüşme maskeleri ve performans için birleştirilmiş atlas.
Tarayıcı Türkçe TTS varsa isteğe bağlıdır; kayıtlı profesyonel ses değildir.
Duman stilize bir eğitim işaretidir, gerçek yangın yayılım hesabı değildir.
