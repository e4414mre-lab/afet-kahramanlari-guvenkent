# Yamaç Mahallesi sanat varlıkları

Bu görevde OpenAI görsel üretimiyle oluşturulan, görsel/pedagojik onay bekleyen
konsept oyun varlıklarıdır. Yerel PNG'lerdir; haricî CDN gerekmez. Orijinaller
`/workspace/generated_images` altında korundu, oyun buradaki kopyaları kullanır.
Önceki şehir, belediye, okul, ev, sel ve orman varlıklarına yazılmadı.

| Dosya | Kullanım / üretim kimliği |
| --- | --- |
| area.png | Sıcak izometrik yamaç mahallesi, güvenli taş teras, kıvrımlı yol, istinat duvarı, vadi/dere, evler ve bitki örtüsü. `d6e502d0-f4cb-4017-99b0-2b125a48b264` |
| murat.png | Harita taşıyan, sakin jeoloji mühendisi; bağımsız alfa sprite. `7b977115-7ff1-46a3-8bde-f48c28256d8b` |
| crack.png | Uzak yol kenarında yüzey çatlağı/eğrilmiş çit belirtisi, derin uçurum yok. `4f8648ab-f2bc-4b5c-ad36-42f9bc2f7b1e` |
| house.png | Uzak dik yamaca yakın, hasarsız ev. Görünüşten kesin güvenlik hükmü verilmez. `89329657-1de6-4008-a43c-9b7112c4dcc3` |
| drain.png | Taş drenajda yüzey suyu/kenar taşı değişimi. `e7c851df-0fb4-4d90-b45d-e39d796d65ab` |
| earth.png | Uzak küçük toprak/malzeme katmanı; sadece birkaç piksellik sakin simülasyon. `283b2347-56f2-4c30-a809-ecfbf3cba85e` |

Çağrı ve AFİ, onaylı şehir sprite'larıdır. Mahalleli ve küçük ahşap panolar,
önceki bölümün `public/assets/flood/residents.png` ve `notice.png` dosyalarını
aynı ışık ve stil ailesinde kullanır. Murat, nesneler ve mahalleli ayrı katmandır;
arka plandaki evler/duvar/dekorlar diorama katmanıdır. Binalara girilebildiği,
çatlak yolun yürünebilir olduğu veya drenaja müdahale edilebildiği iddia edilmez.
Nesne hitbox'ları çizilen sprite boyutlarından, yaklaşım noktaları ayrı güvenli
gezinme verisinden türetilir. Kamera odağı değişirken oyuncu yer değiştirmez.

Eksikler: Murat/mahalleli için yönlü yürüme/yüz animasyon atlasları, özgün kayıtlı
Türkçe Murat/AFİ sesleri, mahalle ambiyans kayıtları, ayrıntılı ön/arka örtüşme
maskeleri ve optimize atlaslar. Türkçe tarayıcı TTS varsa isteğe bağlıdır;
profesyonel kayıt veya her cihazda ses garantisi değildir. Küçük uzak hareket
bilimsel heyelan hesabı değil, temsili eğitim görselleştirmesidir.
