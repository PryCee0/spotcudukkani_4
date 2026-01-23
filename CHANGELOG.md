# Changelog

## [5.0.0] - 2025-01-23

### Yeni Özellikler

#### Ürün Yönetimi
- **Ürün Düzenleme**: Admin panelinde mevcut ürünleri düzenleme özelliği eklendi
- **Dinamik Kategori Yönetimi**: Veritabanında kategoriler tablosu oluşturuldu, admin panelinden yeni kategori ve alt kategori eklenebiliyor
- **Ürünler Sayfası Refaktörü**: Tüm ürünler tek sayfada listeleniyor, sol sidebar ile kategori filtreleme yapılabiliyor

#### Modal ve Deep Linking
- **Modal Kapatma Butonu**: Ürün detay modalında her zaman görünür kapatma (X) butonu eklendi
- **Deep Linking**: Ürün detay modalı açıldığında URL güncelleniyor (`/urunler?id=123`), paylaşılabilir linkler oluşturulabiliyor
- **Paylaş Butonu**: Modal içinde ürün linkini kopyalama/paylaşma özelliği eklendi

#### Blog Yönetimi
- **Manuel Blog Ekleme**: Admin panelinde ürün bağlantısı olmadan bağımsız blog yazısı oluşturma özelliği eklendi
- **Blog Düzenleme**: Mevcut blog yazılarını düzenleme imkanı

#### SEO ve Adres Güncellemeleri
- **Yeni Adres**: Tüm sayfalarda adres "Dumlupınar Mahallesi, Fikirtepe, Kadıköy/İstanbul" olarak güncellendi
- **Footer SEO**: Footer'a SEO anahtar kelimeleri eklendi
- **Google Maps**: İletişim sayfasında harita koordinatları güncellendi

#### Performans İyileştirmeleri
- **Lazy Loading**: Görsel carousel'de lazy loading ve preloading eklendi
- **Loading State**: Görseller yüklenirken loading animasyonu gösteriliyor

### Teknik Değişiklikler

#### Veritabanı
- `categories` tablosu eklendi (id, name, slug, parentId, isActive, createdAt, updatedAt)
- `blog_posts` tablosuna `isManual` ve `source` alanları eklendi

#### API Endpoints (tRPC)
- `products.update` - Ürün güncelleme
- `categories.list` - Kategori listesi
- `categories.create` - Yeni kategori oluşturma
- `categories.update` - Kategori güncelleme
- `categories.delete` - Kategori silme
- `blog.createManual` - Manuel blog oluşturma
- `blog.update` - Blog güncelleme

#### Bileşenler
- `ProductDetailModal`: Deep linking ve kapatma butonu desteği
- `ProductCard`: URL'den modal açma desteği
- `ImageCarousel`: Lazy loading ve preloading
- `Products`: Sidebar filtreleme ile yeniden yazıldı
- `AdminDashboard`: Ürün düzenleme, kategori yönetimi ve manuel blog ekleme

### Kaldırılan Özellikler
- `/urunler/mobilya` ve `/urunler/beyaz-esya` ayrı sayfaları kaldırıldı (tek sayfa + filtreleme ile değiştirildi)

---

## [3.5.0] - 2026-01-15

### Yeni Özellikler
- **Alt Kategori Sistemi**: Ürünlere alt kategori (subCategory) alanı eklendi
  - Beyaz Eşya: Buzdolabı, Çamaşır Makinesi, Bulaşık Makinesi, Fırın/Ocak, Derin Dondurucu, Klima
  - Mobilya: Koltuk Takımı, Köşe Koltuk, Yatak/Baza, Gardırop, Yemek Masası, TV Ünitesi, Sehpa
- **Admin Paneli**: Ürün eklerken alt kategori seçimi eklendi
- **Sidebar Filtreleme**: Ürün sayfalarına alt kategori filtreleme menüsü eklendi
  - Desktop: Sol tarafta sabit sidebar
  - Mobil: Yatay kaydırılabilir badge'ler
- **WhatsApp Butonu**: Sabit konumlu floating WhatsApp butonu eklendi

### İçerik Güncellemeleri
- Hero slider başlıkları güncellendi:
  - "Eviniz İçin Uygun Fiyatlı Çözümler"
  - "2.El eşyalarınızı değerinde alıyoruz."
  - "spotcudukkani.com"
- Hakkımızda sayfası yeniden yazıldı: "Önce İnsan, Sonra Ticaret" temasıyla
- Adres bilgisi güncellendi: "Özbey Caddesi No: 59, Kadıköy/İstanbul"
- Tüm "Fikirtepe" referansları "Kadıköy" olarak güncellendi

### Performans İyileştirmeleri
- LCP optimizasyonu: Hero görsellerine fetchPriority="high" ve preload eklendi
- Lazy loading: Kritik olmayan görsellere loading="lazy" eklendi
- İlk görsel için eager loading ve sync decoding

### SEO Düzeltmeleri
- robots.txt dosyası düzgün formatta oluşturuldu
- sitemap.xml dosyası eklendi
- viewport meta etiketi düzeltildi (maximum-scale kaldırıldı)
- Meta etiketleri güncellendi (Kadıköy odaklı)
- Schema.org LocalBusiness markup güncellendi

### Erişilebilirlik İyileştirmeleri
- viewport'tan user-scalable ve maximum-scale kısıtlamaları kaldırıldı
- Tüm butonlara minimum 48x48px tap target boyutu eklendi
- Kontrast oranı iyileştirildi (muted-foreground daha koyu)
- Tüm interaktif elemanlara aria-label eklendi
- Focus-visible stilleri eklendi

### Veritabanı Değişiklikleri
- products tablosuna subCategory alanı eklendi (VARCHAR(50), nullable)
- Migration dosyası: 0003_add_subcategory.sql

### Teknik İyileştirmeler
- constants.ts dosyası oluşturuldu (merkezi sabit değerler)
- HeroSlider bileşeni memo ile optimize edildi
- ProductCard bileşenine subCategory prop'u eklendi

---

## [3.3.0] - Önceki Sürüm
- İlk stabil sürüm
