# Changelog

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
