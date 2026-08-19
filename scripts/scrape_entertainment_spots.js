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

const SPOT_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'entertainment.json');

const randomDelay = (min = 1500, max = 3000) =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

async function uploadImageToCloudinary(imgUrl, folderPath) {
  try {
    const res = await cloudinary.uploader.upload(imgUrl, {
      folder: folderPath,
      resource_type: 'image'
    });
    return res.secure_url;
  } catch (err) {
    console.error(`  ❌ Lỗi upload Cloudinary [${imgUrl.slice(0, 40)}...]:`, err.message);
    return null;
  }
}

async function runEntertainmentScraper() {
  console.log('🚀 Bắt đầu cào ĐỦ BỘ ẢNH CHẤT LƯỢNG CAO cho 10 quán Ăn Vặt...');

  if (!fs.existsSync(SPOT_FILE)) {
    console.error(`❌ Không tìm thấy file: ${SPOT_FILE}`);
    return;
  }

  const spots = JSON.parse(fs.readFileSync(SPOT_FILE, 'utf8'));
  console.log(`📋 Danh sách ${spots.length} quán ăn vặt trong entertainment.json.`);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN']
  });

  for (let i = 0; i < spots.length; i++) {
    const venue = spots[i];
    console.log(`\n--------------------------------------------------`);
    console.log(`[${i + 1}/${spots.length}] Đang cào ảnh Google Maps cho: ${venue.name}`);

    const cleanName = venue.name.replace(/&/g, '').replace(/,/g, '').replace(/:/g, '').replace(/  +/g, ' ').trim();
    const folderPath = `địa điểm/ăn vặt/${cleanName}`;

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    try {
      const searchQuery = encodeURIComponent(`${venue.name} ${venue.address || 'Hóc Môn TP.HCM'}`);
      const targetUrl = `https://www.google.com/maps/search/${searchQuery}`;

      await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 50000 });
      await randomDelay(2500, 3500);

      // Nếu đang ở trang kết quả tìm kiếm (dạng danh sách), click vào quán đầu tiên
      const firstResultCard = await page.$('a.hfTff, div.Nv2pk a, a[href*="/maps/place/"]');
      if (firstResultCard) {
        await firstResultCard.click();
        await randomDelay(3000, 4000);
      }

      if (page.url().includes('/maps/place/')) {
        venue.mapUrl = page.url();
      }

      // Click vào nút Ảnh / Cover Image để mở album ảnh đầy đủ
      const photoBtn = await page.$('button[aria-label*="Ảnh"], button[aria-label*="Photos"], button.ao3wfc, button[data-photo-index="0"], img[src*="googleusercontent"]');
      if (photoBtn) {
        try {
          await photoBtn.click();
          console.log(`  👉 Đã mở album ảnh!`);
          await randomDelay(2500, 3500);
        } catch (e) {}
      }

      // Cuộn để tải thêm ảnh trong album
      for (let scrollStep = 0; scrollStep < 8; scrollStep++) {
        await page.keyboard.press('PageDown');
        await page.evaluate(() => {
          const scrollPanels = document.querySelectorAll('div.m6QEpc, div[mqa-scroll-area], div.DxyBzc, div.w652be, div.section-layout');
          scrollPanels.forEach((el) => (el.scrollTop += 2000));
        });
        await randomDelay(800, 1200);
      }

      // Thu thập tất cả URLs ảnh (bao gồm img src và background-image)
      const rawPhotoUrls = await page.evaluate(() => {
        const urls = [];

        // 1. img tags
        document.querySelectorAll('img').forEach((img) => {
          const src = img.src || img.getAttribute('data-src');
          if (
            src &&
            (src.includes('googleusercontent.com') || src.includes('ggpht.com')) &&
            !src.includes('avatar') &&
            !src.includes('/a-/') &&
            !src.includes('maps.gstatic.com')
          ) {
            urls.push(src);
          }
        });

        // 2. background-image styles
        document.querySelectorAll('*').forEach((el) => {
          const bg = window.getComputedStyle(el).backgroundImage;
          if (bg && bg.includes('googleusercontent.com')) {
            const match = bg.match(/url\(["']?(https:\/\/[^"']+)["']?\)/);
            if (match && match[1] && !match[1].includes('avatar') && !match[1].includes('/a-/')) {
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

      // Loại bỏ các URL trùng lặp
      const uniquePhotos = Array.from(new Set(rawPhotoUrls));
      const finalPhotos = uniquePhotos.slice(0, 8);

      console.log(`  📸 Thu thập thành công ${finalPhotos.length} ảnh chất lượng cao cho [${venue.name}].`);

      if (finalPhotos.length > 0) {
        const uploadedUrls = [];
        console.log(`  ☁️ Đang upload ảnh lên Cloudinary [${folderPath}]...`);

        for (let pIdx = 0; pIdx < finalPhotos.length; pIdx++) {
          const secureUrl = await uploadImageToCloudinary(finalPhotos[pIdx], folderPath);
          if (secureUrl) {
            uploadedUrls.push(secureUrl);
            console.log(`    ✓ Ảnh ${pIdx + 1}/${finalPhotos.length}: ${secureUrl}`);
          }
        }

        if (uploadedUrls.length > 0) {
          venue.images = uploadedUrls;
        }
      }
    } catch (err) {
      console.error(`  ❌ Lỗi khi cào dữ liệu quán ${venue.name}:`, err.message);
    } finally {
      await page.close();
    }

    // Lưu ngay vào entertainment.json sau từng quán
    fs.writeFileSync(SPOT_FILE, JSON.stringify(spots, null, 2), 'utf8');
    console.log(`  💾 Đã lưu ${venue.images ? venue.images.length : 0} ảnh Cloudinary cho [${venue.name}] vào entertainment.json!`);

    await randomDelay(1500, 2500);
  }

  await browser.close();
  console.log(`\n🎉 HOÀN THÀNH TOÀN BỘ! Tất cả quán ăn vặt đã có bộ ảnh Cloudinary đầy đủ.`);
}

runEntertainmentScraper();
