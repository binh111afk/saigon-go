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

const SPOT_FILES = [
  path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'garden.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'entertainment.json')
];

const randomDelay = (min = 1200, max = 2500) =>
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

async function scrapeAllAtmospherePhotos() {
  console.log('🚀 Bắt đầu cào TẤT CẢ ẢNH KHÔNG GIAN QUÁN trên Google Maps...');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN']
  });

  for (const filePath of SPOT_FILES) {
    if (!fs.existsSync(filePath)) continue;
    const fileBasename = path.basename(filePath);
    const categoryFolder = fileBasename === 'entertainment.json' ? 'ăn vặt' : fileBasename === 'cafe.json' ? 'cà phê' : 'sân vườn';

    let spots = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`\n==================================================`);
    console.log(`📂 Đang cào tất cả ảnh không gian cho ${fileBasename} (${spots.length} quán)...`);

    for (let i = 0; i < spots.length; i++) {
      const venue = spots[i];

      console.log(`\n--------------------------------------------------`);
      console.log(`[${i + 1}/${spots.length}] Quán: ${venue.name}`);

      const cleanName = venue.name.replace(/&/g, '').replace(/,/g, '').replace(/:/g, '').replace(/  +/g, ' ').trim();
      const folderPath = `địa điểm/${categoryFolder}/${cleanName}`;

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

      try {
        const searchQuery = encodeURIComponent(`${venue.name} ${venue.address || 'Hóc Môn TP.HCM'}`);
        await page.goto(`https://www.google.com/maps/search/${searchQuery}`, { waitUntil: 'networkidle2', timeout: 50000 });
        await randomDelay(2000, 3000);

        const firstCard = await page.$('a.hfTff, div.Nv2pk a, a[href*="/maps/place/"]');
        if (firstCard) {
          await firstCard.click();
          await randomDelay(2500, 3500);
        }

        if (page.url().includes('/maps/place/')) {
          venue.mapUrl = page.url();
        }

        // Mở album ảnh toàn màn hình
        const photoBtn = await page.$('button[aria-label*="Ảnh"], button[aria-label*="Photos"], button.ao3wfc, button[data-photo-index="0"], img[src*="googleusercontent"]');
        if (photoBtn) {
          try {
            await photoBtn.click();
            await randomDelay(2000, 3000);
          } catch (e) {}
        }

        // Ưu tiên chuyển sang tab KHÔNG GIAN / BÊN TRONG / BÊN NGOÀI
        const spaceTabSelectors = [
          'button[aria-label*="Không gian"]',
          'button[aria-label*="Bên trong"]',
          'button[aria-label*="Bên ngoài"]',
          'button[aria-label*="Atmosphere"]',
          'button[aria-label*="Interior"]',
          'button[aria-label*="Exterior"]'
        ];

        let foundSpaceTab = false;
        for (const sel of spaceTabSelectors) {
          const spaceBtn = await page.$(sel);
          if (spaceBtn) {
            try {
              await spaceBtn.click();
              foundSpaceTab = true;
              console.log(`  🌿 Đã mở tab KHÔNG GIAN: ${sel}`);
              await randomDelay(2000, 3000);
              break;
            } catch (e) {}
          }
        }

        if (!foundSpaceTab) {
          console.log(`  ℹ️ Không có tab Không gian riêng, cào tất cả ảnh của quán...`);
        }

        // Cuộn sâu album (12 lượt cuộn) để load TẤT CẢ ảnh không gian của quán
        for (let scrollStep = 0; scrollStep < 12; scrollStep++) {
          await page.keyboard.press('PageDown');
          await page.evaluate(() => {
            const scrollPanels = document.querySelectorAll('div.m6QEpc, div[mqa-scroll-area], div.DxyBzc, div.w652be, div.section-layout');
            scrollPanels.forEach((el) => (el.scrollTop += 3000));
          });
          await randomDelay(600, 1000);
        }

        // Trích xuất TẤT CẢ đường link ảnh hợp lệ
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

          document.querySelectorAll('*').forEach((el) => {
            const bg = window.getComputedStyle(el).backgroundImage;
            if (bg && bg.includes('googleusercontent.com')) {
              const match = bg.match(/url\(["']?(https:\/\/[^"']+)["']?\)/);
              if (
                match &&
                match[1] &&
                !match[1].includes('avatar') &&
                !match[1].includes('/a-/') &&
                !match[1].includes('/a/AC')
              ) {
                urls.push(match[1]);
              }
            }
          });

          return urls.map((u) =>
            u
              .replace(/=w\d+-h\d+.*$/, '=w1600-h1200-k-no')
              .replace(/=s\d+.*$/, '=s1600')
              .replace(/=w\d+.*$/, '=w1600-h1200-k-no')
          );
        });

        // Lọc avatar & lấy tối đa 15 ảnh không gian nét nhất
        const cleanPhotos = Array.from(new Set(rawPhotoUrls)).filter((u) => !isAvatarUrl(u));
        const finalPhotos = cleanPhotos.slice(0, 15);

        console.log(`  📸 Đã lấy được ${finalPhotos.length} ảnh không gian chuẩn cho [${venue.name}].`);

        if (finalPhotos.length > 0) {
          const uploadedUrls = [];
          console.log(`  ☁️ Đang upload ${finalPhotos.length} ảnh lên Cloudinary [${folderPath}]...`);

          for (let pIdx = 0; pIdx < finalPhotos.length; pIdx++) {
            const secureUrl = await uploadImageToCloudinary(finalPhotos[pIdx], folderPath);
            if (secureUrl) {
              uploadedUrls.push(secureUrl);
            }
          }

          if (uploadedUrls.length > 0) {
            venue.images = uploadedUrls;
          }
        }
      } catch (err) {
        console.error(`  ❌ Lỗi cào ảnh ${venue.name}:`, err.message);
      } finally {
        await page.close();
      }

      fs.writeFileSync(filePath, JSON.stringify(spots, null, 2), 'utf8');
      console.log(`  💾 Đã lưu ${venue.images ? venue.images.length : 0} ảnh Cloudinary cho [${venue.name}]!`);

      await randomDelay(1000, 2000);
    }
  }

  await browser.close();
  console.log(`\n🎉 HOÀN THÀNH TOÀN BỘ! Đã cào & cập nhật tất cả ảnh không gian quán lên Cloudinary.`);
}

scrapeAllAtmospherePhotos();
