import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import puppeteer from 'puppeteer';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const CAFE_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json');

const randomDelay = (min = 1000, max = 2000) =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

async function uploadImageToCloudinary(imgUrl, folderPath) {
  try {
    const res = await cloudinary.uploader.upload(imgUrl, {
      folder: folderPath,
      resource_type: 'image'
    });
    return res.secure_url;
  } catch (err) {
    console.error(`  ❌ Lỗi upload Cloudinary:`, err.message);
    return null;
  }
}

function isAvatarUrl(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  if (lower.includes('/a-/') || lower.includes('/a/ac') || lower.includes('googleusercontent.com/a/')) return true;
  if (lower.includes('avatar') || lower.includes('profile') || lower.includes('maps.gstatic.com')) return true;
  return false;
}

async function main() {
  console.log('🚀 BẮT ĐẦU CÀO 10 ẢNH KHÔNG GIAN THỰC TẾ GOOGLE MAPS CHO QUÁN HADI...');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  const searchQuery = encodeURIComponent('HADI Đi Bán Trà Và Bán Cà Phê 1/83 Lê Thị Hà Hóc Môn');
  await page.goto(`https://www.google.com/maps/search/${searchQuery}`, { waitUntil: 'networkidle2', timeout: 50000 });
  await randomDelay(2000, 3000);

  const firstCard = await page.$('a.hfTff, div.Nv2pk a, a[href*="/maps/place/"]');
  if (firstCard) {
    await firstCard.click();
    await randomDelay(2500, 3500);
  }

  const photoBtn = await page.$('button[aria-label*="Ảnh"], button[aria-label*="Photos"], button.ao3wfc, button[data-photo-index="0"], img[src*="googleusercontent"]');
  if (photoBtn) {
    try {
      await photoBtn.click();
      await randomDelay(2000, 3000);
    } catch (e) {}
  }

  // Click on "Không gian" (Atmosphere) category tab
  const spaceTabSelectors = [
    'button[aria-label*="Không gian"]',
    'button[aria-label*="Bên trong"]',
    'button[aria-label*="Bên ngoài"]',
    'button[aria-label*="Atmosphere"]',
    'button[aria-label*="Interior"]'
  ];

  for (const sel of spaceTabSelectors) {
    const spaceBtn = await page.$(sel);
    if (spaceBtn) {
      try {
        await spaceBtn.click();
        console.log(`  🌿 Đã chọn TAB KHÔNG GIAN: ${sel}`);
        await randomDelay(2000, 3000);
        break;
      } catch (e) {}
    }
  }

  for (let scrollStep = 0; scrollStep < 10; scrollStep++) {
    await page.keyboard.press('PageDown');
    await page.evaluate(() => {
      const scrollPanels = document.querySelectorAll('div.m6QEpc, div[mqa-scroll-area], div.DxyBzc, div.w652be, div.section-layout');
      scrollPanels.forEach((el) => (el.scrollTop += 2500));
    });
    await randomDelay(600, 1000);
  }

  const rawPhotoUrls = await page.evaluate(() => {
    const urls = [];
    document.querySelectorAll('img').forEach((img) => {
      const src = img.src || img.getAttribute('data-src');
      if (
        src &&
        (src.includes('googleusercontent.com') || src.includes('ggpht.com')) &&
        !src.includes('avatar') &&
        !src.includes('/a-/') &&
        !src.includes('/a/AC') &&
        !src.includes('maps.gstatic.com')
      ) {
        urls.push(src);
      }
    });
    return urls.map((u) =>
      u
        .replace(/=w\d+-h\d+.*$/, '=w1600-h1200-k-no')
        .replace(/=s\d+.*$/, '=s1600')
        .replace(/=w\d+.*$/, '=w1600-h1200-k-no')
    );
  });

  await browser.close();

  const candidates = Array.from(new Set(rawPhotoUrls)).filter((u) => !isAvatarUrl(u)).slice(0, 10);
  console.log(`\n📸 Lọc được ${candidates.length} ảnh không gian chất lượng cao từ Google Maps cho HADI.`);

  const folderPath = `địa điểm/cà phê/HADI- Đi Bán Trà Và Bán Cà Phê`;
  const cloudUrls = [];

  for (let idx = 0; idx < candidates.length; idx++) {
    const candUrl = candidates[idx];
    console.log(`  ☁️ Uploading ảnh không gian ${idx + 1}/${candidates.length} lên Cloudinary...`);
    const secureUrl = await uploadImageToCloudinary(candUrl, folderPath);
    if (secureUrl) {
      cloudUrls.push(secureUrl);
      console.log(`    ✓ [${idx + 1}/${candidates.length}] ${secureUrl}`);
    }
  }

  if (cloudUrls.length > 0 && fs.existsSync(CAFE_FILE)) {
    const cafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));
    const hadiIndex = cafes.findIndex(s => s.name.includes('HADI'));
    if (hadiIndex !== -1) {
      cafes[hadiIndex].images = cloudUrls;
      fs.writeFileSync(CAFE_FILE, JSON.stringify(cafes, null, 2), 'utf8');
      console.log(`\n💾 Đã lưu ${cloudUrls.length} ảnh không gian thực tế HADI vào cafe.json!`);
    }
  }

  console.log('\n🎉 HOÀN THÀNH CẬP NHẬT 10 ẢNH KHÔNG GIAN HADI!');
}

main();
