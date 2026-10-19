# Çağrı'nın evi — Faz 04 varlıkları

OpenAI görsel üretim aracıyla bu prototip için oluşturulmuş yerel PNG konseptleridir.
Oda, açık buluşma alanı ve altı etkileşimli nesne ayrı dosyalardır; nesneler
oda resmine gömülü tıklanabilir alanlar olarak sunulmaz. Önceki meydan, belediye,
okul ve Çağrı/AFİ kaynak PNG'leri değiştirilmedi.

- `room.png`: parke, pencere, halı, yerleşik alçak dolap ve açık ön kapı;
  mobilya/nesne katmanları ayrı. Sağ duvarda ağır çerçeve için boş duvar alanı.
- `bookshelf.png`, `decor.png`, `heavy.png`, `sofa.png`: dört riskin bağımsız
  görselleri. İkinci kanepe sabit oturma alanı dekorudur; ayrı risk sayılmaz.
- `table.png`, `bag.png`: sağlam masa ve ulaşılabilir aile afet çantası.
- `protect.png`: Çağrı'nın mevcut tasarımı referans alınarak üretilen tek kare
  çökmüş korunma pozu; yönlü yürüyüş atlası veya tam animasyon değildir.
- `courtyard.png`: belirlenmiş açık buluşma alanı.
- `drill-soft.wav`: Python standart `wave` modülüyle oluşturulan 95 Hz yumuşak
  ton; kaynak tepe genliği yaklaşık %5,2, oynatma seviyesi %12. Yalnızca efekt
  ayarı açıkken tatbikatta döngüye girer; sessiz/pause/çıkışta durur. Konuşma,
  panik, siren, gerçek deprem kaydı veya müzik değildir.

PNG en/boy oranları korunur; ayak pivotu, y sırası ve temas gölgeleri kullanılır.
Yetişkin çözümü nesne konumu değişimi/bağlantı kontrolü geri bildirimiyle
**canlandırma** olarak gösterilir; gerçek bir yetişkin bildirimi yapılmaz.

Eksikler: yönlü yürüyüş/korunma animasyon atlası, yetişkin müdahale animasyonu,
AFİ seslendirmesi, müzik/ambiyans kayıtları, optimize doku atlasları ve ayrıntılı
ön/arka kesişim maskeleri. Tek kare korunma pozu masa ayağıyla hizalanan eğitim
illüstrasyonudur; gerçek güvenlik garantisi veya mühendislik simülasyonu değildir.
Nihai sanat ve resmî eğitim içeriği onayı beklenir.
