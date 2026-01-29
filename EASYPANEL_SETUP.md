# Easypanel Kurulum Talimatları - Spotçu Dükkanı v5.1

Bu belge, Easypanel üzerinde görsel kalıcılığı sorununu çözmek için gerekli yapılandırma adımlarını içermektedir.

## Sorun

Her `git push` sonrası Docker container yeniden oluşturulduğunda `/uploads` klasöründeki dosyalar siliniyor.

## Çözüm: Persistent Volume Mount

### Adım 1: Sunucuda Kalıcı Klasör Oluşturma

SSH ile sunucunuza bağlanın ve aşağıdaki komutu çalıştırın:

```bash
sudo mkdir -p /data/spotcudukkani/uploads
sudo chmod 777 /data/spotcudukkani/uploads
```

### Adım 2: Easypanel Mount Points Ayarları

Easypanel Dashboard'da uygulamanızın ayarlarına gidin:

1. **App Settings** > **Mounts** bölümüne gidin
2. **Add Mount** butonuna tıklayın
3. Aşağıdaki değerleri girin:

| Alan | Değer |
|------|-------|
| **Host Path** | `/data/spotcudukkani/uploads` |
| **Mount Path** | `/app/public/uploads` |
| **Type** | `Bind` |

### Adım 3: Environment Variable Ekleme

Easypanel Dashboard'da:

1. **App Settings** > **Environment** bölümüne gidin
2. Aşağıdaki değişkeni ekleyin:

```
UPLOAD_DIR=/app/public/uploads
```

### Adım 4: Uygulamayı Yeniden Başlatma

Değişiklikleri uyguladıktan sonra:

1. **Redeploy** butonuna tıklayın
2. Container'ın yeniden başlamasını bekleyin

## Doğrulama

Kurulum sonrası aşağıdaki adımlarla test edin:

1. Admin panelinden yeni bir ürün/blog ekleyin ve görsel yükleyin
2. Easypanel'den uygulamayı yeniden deploy edin
3. Yüklediğiniz görselin hala görünür olduğunu kontrol edin

## Teknik Detaylar

### Dosya Yapısı

```
/data/spotcudukkani/uploads/     <- Sunucuda kalıcı klasör (Host Path)
    ├── products-xxx.jpg
    ├── blog-xxx.png
    └── ...

/app/public/uploads/             <- Container içinde mount edilen yol (Mount Path)
```

### Nasıl Çalışır?

1. `UPLOAD_DIR` ortam değişkeni ayarlandığında, uygulama dosyaları bu dizine kaydeder
2. Mount point sayesinde container içindeki `/app/public/uploads` aslında sunucudaki `/data/spotcudukkani/uploads` klasörünü işaret eder
3. Container yeniden oluşturulsa bile sunucudaki dosyalar korunur

### Önemli Notlar

- Host Path mutlaka container oluşturulmadan önce var olmalıdır
- Klasör izinleri doğru ayarlanmalıdır (777 veya uygun kullanıcı izinleri)
- Mevcut görselleri yeni klasöre manuel olarak taşımanız gerekebilir

## Mevcut Görselleri Taşıma

Eğer mevcut görseller varsa, SSH ile sunucuya bağlanıp taşıyın:

```bash
# Container ID'yi bulun
docker ps | grep spotcudukkani

# Container'dan görselleri kopyalayın
docker cp <container_id>:/app/public/uploads/. /data/spotcudukkani/uploads/
```

## Destek

Sorun yaşarsanız:
- Container loglarını kontrol edin: `docker logs <container_id>`
- Mount point'in doğru bağlandığını kontrol edin: `docker exec <container_id> ls -la /app/public/uploads`
