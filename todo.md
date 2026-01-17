# Spotçu Dükkanı - Proje TODO

## Temel Yapı
- [x] Veritabanı şeması (ürünler tablosu)
- [x] Renk paleti ve tema ayarları (Kemik Beyazı, Lamba Sarısı, Koyu Gri)
- [x] Google Fonts entegrasyonu

## Header & Footer
- [x] Sticky Header (Logo, WhatsApp, Konum, Navigasyon)
- [x] Footer (Dükkan özeti, hızlı linkler, iletişim, sosyal medya)

## Ana Sayfa
- [x] Hero Slider (3 slayt)
- [x] Güven kartları (Güvenilir Ticaret, Hızlı Teslimat, Temiz Ürün Garantisi)
- [x] Öne çıkan ürünler vitrini
- [x] CTA Banner (WhatsApp ile iletişim)
- [x] Müşteri yorumları slider

## Ürün Sayfaları
- [x] Kategori seçim sayfası (2.EL MOBİLYA, 2.EL BEYAZ EŞYA kartları)
- [x] Mobilya listeleme sayfası (grid yapısı)
- [x] Beyaz Eşya listeleme sayfası (grid yapısı)
- [x] Ürün kartı tasarımı (fotoğraf, başlık, açıklama, WhatsApp butonu)
- [x] WhatsApp entegrasyonu (otomatik mesaj taslağı)

## Diğer Sayfalar
- [x] Hakkımızda sayfası (hikaye, vizyon, insani değerler)
- [x] İletişim sayfası (bilgiler, Google Maps, form)
- [x] Blog sayfası (boş şablon)

## Admin Paneli (CMS)
- [x] Admin dashboard sayfası
- [x] Ürün ekleme formu (kategori, fotoğraf, başlık, açıklama)
- [x] Ürün listeleme ve yönetim
- [x] Ürün silme/düzenleme

## Teknik Gereksinimler
- [x] Mobil uyumluluk (tüm sayfalar)
- [x] SEO meta etiketleri
- [x] Performans optimizasyonu
- [x] Unit testler

## v2.0 Güncellemeler

### Tasarım ve UI/UX
- [x] Tüm masaüstü görünümünü %25 büyütme (konteyner, font, görseller)
- [x] baharspot.com benzeri layout düzeni
- [x] Premium ve ferah görünüm
- [x] İletişim sayfasından form kaldırma (sadece tıkla-ara/yaz butonları)

### Teknik Mimari
- [x] cross-env kütüphanesi ekleme (Windows uyumluluğu)
- [x] Easypanel/VPS uyumlu Dockerfile oluşturma
- [x] Nixpacks uyumluluğu

### Blog ve Webhook
- [x] Blog veritabanı şeması oluşturma
- [x] POST /api/blog endpoint'i
- [x] Ürün ekleme webhook entegrasyonu
- [x] Blog sayfası dinamik içerik gösterimi

## v2.1 Admin Panel Güncellemesi

### OAuth Kaldırma ve Basit Şifre Sistemi
- [x] OAuth bağımlılığını admin panelinden kaldırma
- [x] ADMIN_PASSWORD environment değişkeni ile basit login
- [x] Admin login sayfası oluşturma

### Session Yönetimi
- [x] Güvenli session/cookie oluşturma (JWT, 7 gün geçerli)
- [x] Session doğrulama middleware'i
- [x] Logout fonksiyonu

### Build Hatası Düzeltme
- [x] package.json build komutunu güncelleme
- [x] Dockerfile düzeltme (dist/public yolu)

## v3.0 Final Production

### Backend ve Depolama
- [x] S3/BUILT_IN_FORGE bağımlılığını kaldırma
- [x] Local file storage sistemi (/public/uploads)
- [x] Otomatik klasör oluşturma (uygulama başlangıcında)
- [x] Admin panelinde ürün silme fonksiyonu

### Blog ve Webhook
- [x] Webhook trigger (ürün eklendiğinde POST)
- [x] Blog API doğrulama ve aktivasyon

### Frontend ve UX
- [x] Adres güncellemesi (no 55 -> no 59)
- [x] Scroll to Top (tüm sayfa geçişlerinde)
- [x] %25 büyütülmüş tasarım korunması

### Optimizasyon
- [x] Build script düzeltme
- [x] SEO meta etiketleri optimizasyonu

## v3.1 Final - Docker Optimize

### Build Path Sorunu
- [x] /app/dist/index.js bulunamıyor hatasını çözme
- [x] Build çıktılarının doğru yolda olmasını sağlama
- [x] package.json start komutunu doğrulama

### Docker Yapılandırması
- [x] Optimize edilmiş Dockerfile oluşturma
- [x] docker-compose.yml ekleme
- [x] Multi-stage build ile küçük image boyutu

### Admin Paneli Doğrulama
- [x] Ürün silme fonksiyonu çalışıyor
- [x] Ürün listeleme çalışıyor
- [x] Local storage (/public/uploads) çalışıyor

## v3.2 Final - Vite Import Hatası Düzeltmesi

### Vite Import Sorunu
- [x] Statik Vite importlarını kaldırma
- [x] Dinamik import kullanma (development only)
- [x] Production modunda sadece static dosya sunumu
- [x] esbuild'de Vite'ı externalize etme

## v3.3 Final - Kritik Deployment Düzeltmeleri

### Programmatic Migration
- [x] drizzle-kit bağımlılığını production'dan kaldırma
- [x] Sunucu başlangıcında otomatik tablo oluşturma
- [x] CREATE TABLE IF NOT EXISTS sorguları

### Vite Temizliği
- [x] Tüm statik vite importlarını kaldırma
- [x] Production build'de vite referansı olmamalı
- [x] dist/index.js temiz olmalı

### Admin Panel CRUD
- [x] Ürün ekleme çalışıyor
- [x] Ürün düzenleme/güncelleme çalışıyor (toggleFeatured, toggleActive)
- [x] Ürün silme çalışıyor
