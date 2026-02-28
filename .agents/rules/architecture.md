---
trigger: always_on
---

# Sistem Mimarisi ve Altyapı (architecture.md)

## 1. Teknoloji Yığını (Tech Stack)
* **Frontend:** React (Vite ile derlenmiş). Hızlı derleme ve optimize edilmiş modern frontend mimarisi hedeflenmiştir.
* **Backend:** Node.js.
* **İletişim Katmanı:** İstemci ve sunucu arasındaki veri akışı tRPC üzerinden sağlanmaktadır. Tip güvenliği (type safety) bu yapının temel taşıdır.

## 2. Sunucu ve Barındırma (Hosting)
* Uygulamanın yayınlanması ve sunucu yönetimi **Easypanel** kontrol paneli üzerinden yapılmaktadır.
* Proje **Docker** ortamında, konteynerize edilmiş bir yapıda çalışmaktadır. Geliştirme yaparken uygulamanın Docker üzerinde ayağa kalkacağı göz önünde bulundurulmalıdır.

## 3. Veritabanı (Database)
* **Türü:** MySQL.
* **Sağlayıcı:** Veritabanı, yüksek erişilebilirlik sağlayan **TiDB** üzerinde barındırılmaktadır. Yazılacak tüm sorgular ve şema güncellemeleri bu yapıya uygun ve optimize olmalıdır.

## 4. Depolama ve Dosya Yönetimi (Storage)
* Spotçu dükkanı için ürün fotoğrafları kritik öneme sahiptir. Docker konteyneri yeniden başlatıldığında görsel veri kaybı yaşanmaması için **Kalıcı Depolama (Persistent Storage)** yapılandırılmıştır.
* Easypanel üzerinde "Bind Mount" kullanılmıştır.
* **Sunucu (Host) Yolu:** `/data/spotcudukkani/uploads`
* **Konteyner (App) Yolu:** `/app/public/uploads`
* Yapılacak tüm dosya yükleme, silme ve okuma işlemleri (özellikle görsel optimizasyonları) doğrudan bu dizinler üzerinden planlanmalıdır.