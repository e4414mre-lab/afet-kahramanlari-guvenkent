# Güvenkent İlkokulu / 5-A — görsel varlıklar

Bu fazda OpenAI görsel üretim aracıyla hazırlanmış yerel PNG konseptleridir.
Harici resim URL'si hotlink edilmez; üçüncü taraf stok paket indirilmedi.
Yeni sınıf görselleri kullanıcı görsel onayını bekler.

| Dosya | Kullanım |
| --- | --- |
| `room.png` | Karaktersiz ve etkileşimli mobilyasız oda kabuğu: parke, pencereler, kara tahta, kapı eşiği ve sabit mimari dekor |
| `desk.png` | Bağımsız öğrenci sırası + sandalye; dört örnek |
| `teacher_desk.png` | Bağımsız öğretmen masası |
| `bookshelf.png` | Sabitlenmemiş uzun kitaplık |
| `exit_bags.png` | Kapı geçişindeki dağınık çantalar |
| `heavy_boxes.png` | Dolap üstündeki ağır kutular; altındaki alçak depolama ünitesinden bağımsız |
| `tall_cabinet.png` | Yüksek dolap |
| `window_heavy.png` | Pencere yakınındaki ağır küre ve kaidesi |
| `wall_board.png` | Gevşek bağlantılı ağır pano |
| `safe_shelf.png` | Sabitlenmiş alçak raf; ağır kutuların altındaki depolama ünitesinde de kullanılır |
| `safe_bags.png` | Geçişten uzaktaki düzenli çantalar |
| `safe_box.png` | Kapalı, zemindeki hafif malzeme kutusu |
| `safe_board.png` | Sabitlenmiş, uygun yükseklikteki pano |

Oda dışında tüm dosyalar şeffaf RGBA'dır. On etkileşimli nesne ayrı sprite
ve hitbox katmanlarına sahiptir; oda resmine gömülü tıklama illüzyonu yoktur.
PNG en/boy oranları korunur. Ayak pivotu, temas gölgesi ve y sıralaması
kullanılır. İki pano duvar üzerinde yerleşir; mobilyalar zeminde durur.

Yetişkin çözümü bir **eğitim canlandırmasıdır**. Çantalar ayrılmış alana,
ağır kutular aşağıya, küre pencere kenarından içeri taşınır; kitaplık/dolap
ve panoda bağlantı işaretleri görünür. Çocuğun kaldırma/sabitleme animasyonu
yoktur. Oyun gerçek bir öğretmen bildirimi veya fiziksel kontrol yapmaz.

## Eksikler ve görsel onay kapsamı

- Çağrı ve AFİ'nin mevcut PNG'leri aynen kullanıldı. Yönlü yürüyüş atlası,
  karakter konuşma/tepki animasyonları ve ayrı yetişkin müdahale animasyonları
  mevcut değil. Hareket/takip işlevseldir; nihai karakter animasyonu değildir.
- Gerçek seslendirme, efekt ve müzik dosyaları yoktur. Ses tercihleri korunur;
  görev, neden/karar ve zorunlu güvenlik metinleri yazılı gösterilir.
- Nihai optimize edilmiş atlaslar, bütün nesneler için ayrı ön/arka kesişim
  maskeleri ve üretim amaçlı ayrıntılı sabitleme varyantları henüz yoktur.
- Sabitleme canlandırması kodla çizilen küçük bağlantı/onay işaretlerini
  kullanır; yeni tam kare animasyon sanatı olarak sunulmaz.
- Mevcut onaylı okul dış cephesi şehir meydanından yeniden kullanılır.
  Ara koridor oluşturulmadı; okul kapısı doğrudan sınıfa açılır.

Yeni sınıf, nihai sanat teslimi olarak değil, görsel onay bekleyen
oynanabilir keşif prototipi olarak sunulur.
