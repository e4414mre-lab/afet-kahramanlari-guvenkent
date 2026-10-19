# 5-A risk avı — gerçek oynanış kanıtları

Masaüstü **1440×1000**, dokunmatik Chromium emülasyonu **390×844**.
Görseller gerçek tarayıcı oturumlarında aynı belediye → okul → sınıf akışı
oynanarak alınır. Konum atlatma, hazır görev durumu yazma veya çizilmiş sayaç
kullanılmaz. Salt okunur QA görüntüleri çekim anındaki durumla eşleştirir.

| Oynanış anı | Masaüstü | Mobil | Doğrulanan durum |
| --- | --- | --- | --- |
| Riskli nesneye yaklaşma | [Aç](01-approach-desktop.png) | [Aç](01-approach-mobile.png) | Çağrı kitaplığın yanında; AFİ takip eder; inceleme kapalı; 0/6 |
| Nesne inceleme | [Aç](02-inspection-desktop.png) | [Aç](02-inspection-mobile.png) | Kitaplığın yakın görünümü, gözlem ve “Bu neden riskli?” seçenekleri |
| AFİ ilk risk rehberliği | [Aç](03-afi-guidance-desktop.png) | [Aç](03-afi-guidance-mobile.png) | Gerçek ipucu düğmesi; rehberli hedef kitaplık; 0/6 |
| Yanlış seçim geri bildirimi | [Aç](04-wrong-feedback-desktop.png) | [Aç](04-wrong-feedback-mobile.png) | “Tekrar düşünelim” ve açıklama; risk hâlâ bulunmadı; 0/6 |
| Doğru çözüm geri bildirimi | [Aç](05-correct-feedback-desktop.png) | [Aç](05-correct-feedback-mobile.png) | Yetişkinden sabitleme isteme kararı; **planlandı**, henüz yetişkin uygulaması değil; 1/6 |
| İlerleme 3/6 | [Aç](06-progress-3-of-6-desktop.png) | [Aç](06-progress-3-of-6-mobile.png) | Üç farklı risk bulundu ve yetişkin çözümü görüldü |
| İlerleme 6/6 | [Aç](07-progress-6-of-6-desktop.png) | [Aç](07-progress-6-of-6-mobile.png) | Altı farklı risk, altı yetişkin çözümü; özet sonrası sınıf |
| Kapı önü engeli | [Aç](08-exit-blocked-desktop.png) | [Aç](08-exit-blocked-mobile.png) | Gerçek yön girdisiyle çanta alanına yürümek engellenir; sağ çıkış aralığı açık |
| Geçişin düzenlenmesi sonrası | [Aç](09-exit-cleared-desktop.png) | [Aç](09-exit-cleared-mobile.png) | Yetişkin çözümünden sonra aynı noktadan geçilir; çantalar saklama alanında |

Çekim durumları: [masaüstü JSON](evidence-desktop.json), [mobil JSON](evidence-mobile.json).
Bu dosyalar her görüntünün sayacını, bulgu durumlarını, seçili nesnesini,
geri bildirimini, rehberlik metnini ve karakter konumlarını içerir.

Tüm görseller `tests/school_risk_hunt_smoke.py` tarafından oluşturulur.
Mobil sonuçlar fiziksel telefon testi değildir. Nihai sanat/animasyon/ses
varlığı eksikleri ana teslim raporunda korunur. Sonraki oyun bölümü açılmaz.
