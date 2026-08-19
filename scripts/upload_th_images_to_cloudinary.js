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

async function uploadThImages() {
  console.log('🚀 Đang upload ảnh của T & H Coffee lên Cloudinary [địa điểm/cà phê/TH Coffee]...');
  const cafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));

  const thVenue = cafes.find(c => c.name.toLowerCase().includes('t & h') || c.name.toLowerCase().includes('t&h'));
  if (!thVenue) {
    console.error('❌ Không tìm thấy T & H Coffee trong cafe.json');
    return;
  }

  const folderPath = 'địa điểm/cà phê/TH Coffee';
  const newCloudinaryUrls = [];

  for (let idx = 0; idx < thVenue.images.length; idx++) {
    const rawUrl = thVenue.images[idx];
    if (rawUrl.includes('cloudinary.com')) {
      newCloudinaryUrls.push(rawUrl);
      continue;
    }
    try {
      const res = await cloudinary.uploader.upload(rawUrl, {
        folder: folderPath,
        resource_type: 'image'
      });
      newCloudinaryUrls.push(res.secure_url);
      console.log(`  ✓ Upload ảnh ${idx + 1}/${thVenue.images.length}: ${res.secure_url}`);
    } catch (err) {
      console.error(`  ❌ Lỗi upload Cloudinary [${rawUrl.slice(0, 40)}...]:`, err.message);
      newCloudinaryUrls.push(rawUrl);
    }
  }

  thVenue.images = newCloudinaryUrls;
  fs.writeFileSync(CAFE_FILE, JSON.stringify(cafes, null, 2), 'utf8');
  console.log('🎉 Đã cập nhật xong toàn bộ ảnh Cloudinary cho T & H Coffee trong cafe.json!');
}

uploadThImages();
