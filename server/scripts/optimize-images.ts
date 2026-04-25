/**
 * v11.0: Mevcut Görsellerin Toplu Optimizasyonu — Tek Seferlik Migration Script
 * 
 * Kullanım (Docker container içinde):
 *   UPLOAD_DIR=/app/public/uploads node --loader ts-node/esm server/scripts/optimize-images.ts
 * 
 * Veya sunucuda doğrudan:
 *   UPLOAD_DIR=/data/spotcudukkani/uploads node server/scripts/optimize-images.ts
 * 
 * GÜVENLİK:
 * - Orijinal dosyalar _backup/ klasörüne kopyalanır
 * - < 200KB dosyalar atlanır (zaten optimize)
 * - Sharp hatası olan dosyalar loglanır ama işlem devam eder
 * - Rollback: _backup/ klasöründeki dosyalar geri kopyalanabilir
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';
const BACKUP_DIR = path.join(UPLOAD_DIR, '_backup');
const MIN_SIZE_KB = 200; // Bu boyuttan küçük dosyaları atla

// Güvenlik: Backup klasörü oluştur
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function optimizeExistingImages() {
  const files = fs.readdirSync(UPLOAD_DIR);
  let optimized = 0;
  let skipped = 0;
  let errors = 0;
  let totalSavedKB = 0;

  console.log(`\n🔍 Taranıyor: ${UPLOAD_DIR}`);
  console.log(`📁 Backup dizini: ${BACKUP_DIR}`);
  console.log(`📏 Minimum boyut: ${MIN_SIZE_KB} KB\n`);

  for (const file of files) {
    const filePath = path.join(UPLOAD_DIR, file);
    
    // Klasörleri atla (_backup dahil)
    let stat: fs.Stats;
    try {
      stat = fs.statSync(filePath);
    } catch {
      continue;
    }
    if (!stat.isFile()) continue;

    // Sadece görsel dosyalarını işle
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'].includes(ext)) {
      continue;
    }

    // Zaten küçük dosyaları atla
    const sizeKB = Math.round(stat.size / 1024);
    if (sizeKB < MIN_SIZE_KB) {
      console.log(`⏭️  ${file}: ${sizeKB}KB (< ${MIN_SIZE_KB}KB, atlanıyor)`);
      skipped++;
      continue;
    }

    try {
      // 1. Backup al
      const backupPath = path.join(BACKUP_DIR, file);
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
      }

      // 2. Sharp ile optimize et
      const buffer = fs.readFileSync(filePath);
      const optimizedBuffer = await sharp(buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      // 3. .webp uzantılı dosya olarak kaydet
      const webpPath = filePath.replace(/\.(jpg|jpeg|png|bmp|gif)$/i, '.webp');
      fs.writeFileSync(webpPath, optimizedBuffer);

      // 4. Eğer orijinal .webp ise üzerine yazdık, değilse orijinali de optimize edilmiş halde bırak
      if (ext !== '.webp' && filePath !== webpPath) {
        // Orijinal uzantılı dosyayı da optimize et (URL uyumluluğu)
        fs.writeFileSync(filePath, optimizedBuffer);
      }

      const newKB = Math.round(optimizedBuffer.length / 1024);
      const savedKB = sizeKB - newKB;
      totalSavedKB += savedKB;

      console.log(`✅ ${file}: ${sizeKB}KB → ${newKB}KB (${Math.round((1 - newKB / sizeKB) * 100)}% azalma, ${savedKB}KB tasarruf)`);
      optimized++;
    } catch (e: any) {
      console.error(`❌ ${file}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 SONUÇ:`);
  console.log(`   ✅ Optimize edildi: ${optimized}`);
  console.log(`   ⏭️  Atlandı (küçük): ${skipped}`);
  console.log(`   ❌ Hata: ${errors}`);
  console.log(`   💾 Toplam tasarruf: ${Math.round(totalSavedKB / 1024 * 10) / 10} MB`);
  console.log(`   📁 Backup: ${BACKUP_DIR}`);
  console.log(`${'='.repeat(60)}\n`);

  if (errors > 0) {
    console.log('⚠️  Hatalı dosyalar için _backup/ klasöründen orijinaller geri kopyalanabilir.');
  }
}

optimizeExistingImages().catch(console.error);
