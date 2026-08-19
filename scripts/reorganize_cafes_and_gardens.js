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

const chainCafeNames = [
  'hadi',
  't & h coffee',
  'highlands coffee lê thị hà',
  'the coffee house - nguyễn ảnh thủ',
  'phúc long - lê thị hà',
  'highlands coffee phan văn hớn',
  'highlands coffee 1800 nguyễn ảnh thủ'
];

async function reorganize() {
  console.log('🚀 Đang phân loại chuẩn xác: Giữ các chuỗi café tại cafe.json & chuyển các quán còn lại sang garden.json...');

  const currentCafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));
  let currentGardens = JSON.parse(fs.readFileSync(GARDEN_FILE, 'utf8'));

  const finalCafes = [];
  const toMoveToGarden = [];

  for (let c of currentCafes) {
    const isChain = chainCafeNames.some(name => c.name.toLowerCase().includes(name));
    if (isChain) {
      c.category = 'cafe';
      c.tag = 'Café';
      c.tagClass = 'tag-cafe';
      finalCafes.push(c);
      console.log(`☕ Giữ lại cafe.json: ${c.name}`);
    } else {
      toMoveToGarden.push(c);
      console.log(`🏡 Chuyển sang garden.json: ${c.name}`);
    }
  }

  for (let gVenue of toMoveToGarden) {
    // Loại bỏ ký tự đặc biệt & như & , : để tránh lỗi Cloudinary invalid public_id
    const cleanName = gVenue.name.replace(/&/g, '').replace(/,/g, '').replace(/:/g, '').replace(/  +/g, ' ').trim();
    const folderPath = `địa điểm/sân vườn/${cleanName}`;

    if (gVenue.images && gVenue.images.length > 0) {
      const newImages = [];
      for (let idx = 0; idx < gVenue.images.length; idx++) {
        const imgUrl = gVenue.images[idx];
        if (imgUrl.includes('/s%C3%A2n%20v%C6%B0%E1%BB%9Dn/')) {
          newImages.push(imgUrl);
          continue;
        }
        try {
          const res = await cloudinary.uploader.upload(imgUrl, {
            folder: folderPath,
            resource_type: 'image'
          });
          newImages.push(res.secure_url);
          console.log(`  ✓ Upload ảnh ${idx + 1}/${gVenue.images.length} -> Cloudinary [${folderPath}]: ${res.secure_url}`);
        } catch (err) {
          console.error(`  ❌ Lỗi upload Cloudinary:`, err.message);
          newImages.push(imgUrl);
        }
      }
      gVenue.images = newImages;
    }

    gVenue.category = 'garden';
    gVenue.tag = 'Sân Vườn';
    gVenue.tagClass = 'tag-garden';

    // Chỉ push nếu chưa có trong garden.json
    const alreadyInGarden = currentGardens.some(g => g.name.toLowerCase() === gVenue.name.toLowerCase());
    if (!alreadyInGarden) {
      currentGardens.push(gVenue);
    }
  }

  // Đánh lại ID tuần tự
  finalCafes.forEach((c, idx) => {
    c.id = idx + 1;
  });
  currentGardens.forEach((g, idx) => {
    g.id = idx + 1;
  });

  fs.writeFileSync(CAFE_FILE, JSON.stringify(finalCafes, null, 2), 'utf8');
  fs.writeFileSync(GARDEN_FILE, JSON.stringify(currentGardens, null, 2), 'utf8');

  console.log(`\n🎉 HOÀN THÀNH TOÀN BỘ!`);
  console.log(`☕ cafe.json có ${finalCafes.length} quán chuỗi café.`);
  console.log(`🏡 garden.json có ${currentGardens.length} quán sân vườn.`);
}

reorganize();
