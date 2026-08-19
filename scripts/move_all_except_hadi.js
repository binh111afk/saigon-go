import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const CAFE_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json');
const GARDEN_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'garden.json');

async function moveAllExceptHadi() {
  console.log('🚀 Bắt đầu giữ lại duy nhất HADI trong cafe.json và chuyển toàn bộ các quán khác sang garden.json (bao gồm Cloudinary)...');

  const cafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));
  let gardens = fs.existsSync(GARDEN_FILE) ? JSON.parse(fs.readFileSync(GARDEN_FILE, 'utf8')) : [];

  const keptInCafe = [];

  for (let c of cafes) {
    const isHadi = c.name.toLowerCase().includes('hadi');

    if (isHadi) {
      console.log(`☕ Giữ lại trong cafe.json: ${c.name}`);
      c.id = 1;
      keptInCafe.push(c);
    } else {
      // Làm sạch tên thư mục Cloudinary (loại bỏ dấu phẩy để tránh lỗi public_id invalid)
      const cleanFolderName = c.name.replace(/,/g, '').trim();
      const folderPath = `địa điểm/sân vườn/${cleanFolderName}`;
      console.log(`\n🏡 Đang chuyển sang garden.json & Cloudinary [${folderPath}]: ${c.name}`);
      const newImages = [];

      if (c.images && c.images.length > 0) {
        for (let idx = 0; idx < c.images.length; idx++) {
          const imgUrl = c.images[idx];
          try {
            const res = await cloudinary.uploader.upload(imgUrl, {
              folder: folderPath,
              resource_type: 'image'
            });
            newImages.push(res.secure_url);
            console.log(`  ✓ Ảnh ${idx + 1}/${c.images.length} -> Cloudinary [${folderPath}]: ${res.secure_url}`);
          } catch (err) {
            console.error(`  ❌ Lỗi upload ảnh Cloudinary:`, err.message);
            newImages.push(imgUrl);
          }
        }
        c.images = newImages;
      }

      c.category = 'garden';
      c.tag = 'Sân Vườn';
      c.tagClass = 'tag-garden';

      gardens.push(c);
    }
  }

  // Đánh lại ID chuẩn xác từ 1..N cho garden.json
  gardens.forEach((g, idx) => {
    g.id = idx + 1;
  });

  fs.writeFileSync(CAFE_FILE, JSON.stringify(keptInCafe, null, 2), 'utf8');
  fs.writeFileSync(GARDEN_FILE, JSON.stringify(gardens, null, 2), 'utf8');

  console.log(`\n🎉 HOÀN THÀNH TOÀN BỘ!`);
  console.log(`☕ cafe.json còn lại: ${keptInCafe.length} quán (HADI)`);
  console.log(`🏡 garden.json tổng cộng: ${gardens.length} quán sân vườn`);
}

moveAllExceptHadi();
