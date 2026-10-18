# Belediye iç mekânı — konsept varlıkları

Bu fazda OpenAI görsel üretim aracı ile hazırlanmış yerel PNG'lerdir.
Üçüncü taraf stok içerik indirilmedi, harici resim URL'si hotlink edilmedi.
Belediye binasının görsel tasarımı kullanıcı tarafından onaylandı.

| Dosya | Katman / pivot |
| --- | --- |
| `room-concept.png` | Karaktersiz oda kabuğu: parke, pencere, duvar ve sabit dekor; arka plan katmanı |
| `desk-concept.png` | Bağımsız ahşap masa, üzerindeki mühürlü berat; alt orta / zemin temas noktası |
| `mayor-concept.png` | Bağımsız şeffaf belediye başkanı sprite'ı; ayaklar alt orta |
| `plan-concept.png` | Bağımsız kent planı sehpası; okul işareti için ayrı Phaser vurgu katmanı |
| `journal-concept.png` | Bağımsız görev defteri sehpası; alt orta / zemin temas noktası |

Dört nesne/NPC şeffaf RGBA PNG'dir. Oda resmine karakter veya etkileşimli
mobilya gömülmemiştir. Varlıkların kendi en/boy oranı korunur; y sırasına göre
Çağrı ve AFİ'nin önünde/arkasında çizilir. Bunlar yalnızca yazıyla etiketlenmiş
bir arka plan değildir: gerçek bağımsız sprite katmanları ve kamera
koordinatlarında ayrı hitbox/yaklaşım noktaları kullanılır.

Sanat yönü: meydandaki sıcak krem/ahşap/turkuaz renk ailesi, sol üstten sıcak
ışık, resimsel 2.5D üç çeyrek bakış ve kesit oda. Üretim kaynağı / araç: bu
Codex oturumundaki OpenAI image generation; üçüncü taraf paket kullanılmadı.

## Hâlâ eksik / görsel onaya sunulanlar

- Çağrı'nın mevcut tek pozlu konsepti aynen kullanılır. Yönlere göre bekleme
  ve yürüyüş atlası hâlâ eksik; AFİ ve başkan için tepki/konuşma kareleri yok.
- Nihai sprite atlasları, ayrıntılı kesişim maskeleri ve üretim amaçlı gölge
  katmanları henüz hazırlanmadı; bu fazda ayak pivotu/y sıralaması ve sınırlı
  mobilya çarpışma alanları kullanılır.
- Berat masa sprite'ının üzerindedir; ileride bağımsız kâğıt/seal yakın plan
  varlığı eklenebilir. İnceleme ve kabul bu fazda işlevseldir.
- Kapı menteşeli animasyon atlası yok; oda kabuğundaki ön eşik ve kısa kamera
  kararması kullanılır. Azaltılmış harekette kararma kaldırılır.
- Ses, müzik, seslendirme varlıkları yoktur. Ses yüklenmeye çalışılmaz;
  tercihleri korunur ve zorunlu uyarılar yazılı gösterilir.

Bu liste nedeniyle nihai sanat üretiminin tamamlandığı söylenmez. Belediye binasının görsel tasarımı onaylandı; eksik animasyon ve üretim
varlıkları bu son doğrulamada değiştirilmedi.
