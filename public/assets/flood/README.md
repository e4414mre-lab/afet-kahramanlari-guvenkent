# Dere Mahallesi varlıkları — Faz 05

Bu faz için OpenAI görsel üretim aracıyla oluşturulan yedi yerel konsept PNG:

- `area.png`: sıcak taş meydan, üst güvenli alan, evler, ağaçlar, alt kıyı yolu ve dere.
- `bridge.png`: bağımsız alçak taş köprü ve kapalı güvenlik bariyeri.
- `store.png`: dere yakınındaki alçak depo; oyuncu yapıyı taşımaz.
- `drain.png`: yaprak/çöp birikimli ızgara; çocuk temizleme yapmaz.
- `hasan.png`: sakin mahalle sakini Hasan Amca.
- `notice.png`: hazırlık inceleme panosu; sözcük yerine yön/toplanma/uyarı sembolleri.
- `residents.png`: güvenli meydanda kalan iki yetişkin mahalleli.

Varlıklar ayrı sprite katmanlarıdır. Dereye ait ayrı saydam su/akış ve yağmur
katmanı kodla çizilir; gerçek su tahmini değildir. Düşük yoğunluklu yaprak ve
mahalleli hareketleri azaltılmış hareket tercihinde statikleşir. Önceki sahne,
Çağrı ve AFİ kaynak görselleri değiştirilmez.

Eksikler: yönlü NPC yürüyüş atlası (şimdiki figürler sabit pozlu sprite),
kayıtlı Hasan/AFİ Türkçe seslendirme ve dere/yağmur ambiyansı, hassas kesişim
maskeleri ve optimize doku atlasları. Türkçe sistem sesi mevcutsa isteğe bağlı
kısa tarayıcı TTS kullanılabilir; bu profesyonel ses kaydı değildir. Kritik metin
her zaman yazılıdır. Siren, korku, yıkım veya yaralanma varlığı kullanılmaz.
