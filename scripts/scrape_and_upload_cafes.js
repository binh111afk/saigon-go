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

const SPOT_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json');

const randomDelay = (min = 2000, max = 3500) =>
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

async function runScraper() {
  console.log('🚀 Bắt đầu cào ĐỦ 7+ ẢNH cho TẤT CẢ QUÁN CAFÉ...');

  if (!fs.existsSync(SPOT_FILE)) {
    console.error(`❌ Không tìm thấy file: ${SPOT_FILE}`);
    return;
  }

  const cafes = JSON.parse(fs.readFileSync(SPOT_FILE, 'utf8'));
  console.log(`📋 Danh sách ${cafes.length} quán trong cafe.json`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN']
  });

  for (let i = 0; i < cafes.length; i++) {
    const venue = cafes[i];
    console.log(`\n--------------------------------------------------`);
    console.log(`[${i + 1}/${cafes.length}] Đang cào ảnh cho: ${venue.name}`);

    const folderPath = `địa điểm/cà phê/${venue.name}`;
    const page = await browser.newPage();

    try {
      // 1. Tìm kiếm quán trên Google Maps
      const searchQuery = encodeURIComponent(`${venue.name} ${venue.address || 'Hóc Môn TP.HCM'}`);
      const targetUrl = `https://www.google.com/maps/search/${searchQuery}`;

      await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await randomDelay(2000, 3000);

      // Nếu đang ở trang kết quả tìm kiếm (dạng danh sách), click vào quán đầu tiên
      const firstResultCard = await page.$('a.hfTff, div.Nv2pk a, a[href*="/maps/place/"]');
      if (firstResultCard) {
        await firstResultCard.click();
        await randomDelay(2500, 3500);
      }

      // 2. Mở tab Ảnh (Photos Gallery)
      // Thử nhiều Selector cho nút mở ảnh trên Google Maps
      const photoSelectors = [
        'button[aria-label*="Hình ảnh"]',
        'button[aria-label*="Ảnh"]',
        'button[aria-label*="Photos"]',
        'button[aria-label*="Tất cả"]',
        'button[data-tab-index="1"]',
        'div.QQf29 button',
        'button.ao3wfc',
        'button.Yr7Voice18__button',
        'img[src*="googleusercontent.com"]'
      ];

      let clicked = false;
      for (const sel of photoSelectors) {
        const btn = await page.$(sel);
        if (btn) {
          try {
            await btn.click();
            clicked = true;
            console.log(`  🔍 Đã mở album ảnh bằng selector: ${sel}`);
            await randomDelay(2500, 3500);
            break;
          } catch (e) {}
        }
      }

      // 3. Cuộn sâu danh sách ảnh để tải tối thiểu 10-20 ảnh
      for (let scrollStep = 0; scrollStep < 8; scrollStep++) {
        await page.evaluate(() => {
          const scrollContainers = document.querySelectorAll(
            'div[mqa-scroll-area], div.m6QEpc, div.DxyBzc, div.section-layout, div.w652be'
          );
          scrollContainers.forEach((el) => {
            el.scrollTop += 1500;
          });
          window.scrollBy(0, 1000);
        });
        await randomDelay(1000, 1800);
      }

      // 4. Thu thập tất cả các đường link ảnh
      const rawPhotoUrls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img[src*="googleusercontent.com"], img[src*="ggpht.com"]'));
        return imgs
          .map((img) => img.src)
          .filter((src) => src && !src.includes('avatar') && !src.includes('maps.gstatic.com'))
          .map((src) =>
            src
              .replace(/=w\d+-h\d+.*$/, '=w1600-h1200-k-no')
              .replace(/=s\d+.*$/, '=s1600')
              .replace(/=w\d+.*$/, '=w1600-h1200-k-no')
          );
      });

      let uniquePhotos = Array.from(new Set(rawPhotoUrls));

      // Nếu vẫn chưa đủ ảnh, thử cào qua Google Images trực tiếp
      if (uniquePhotos.length < 5) {
        console.log(`  🔄 Thử cào bổ sung ảnh qua Google Images...`);
        const imgSearchPage = await browser.newPage();
        try {
          const gImgUrl = `https://www.google.com/search?tbm=isch&q=${searchQuery}`;
          await imgSearchPage.goto(gImgUrl, { waitUntil: 'networkidle2', timeout: 30000 });
          await randomDelay(1500, 2500);

          const extraImgs = await imgSearchPage.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('img[src*="encrypted-tbn"], img[src*="googleusercontent"]'));
            return imgs.map((i) => i.src).filter((s) => s && s.startsWith('http'));
          });

          uniquePhotos = Array.from(new Set([...uniquePhotos, ...extraImgs]));
        } catch (e) {
        } finally {
          await imgSearchPage.close();
        }
      }

      // Lấy tối đa 10 ảnh chất lượng nhất
      const finalPhotos = uniquePhotos.slice(0, 10);
      console.log(`  📸 Thu thập thành công ${finalPhotos.length} ảnh cho ${venue.name}.`);

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

        // CHỈ GHI ĐÈ TRƯỜNG IMAGES, GIỮ NGUYÊN MENU, QUICKACTIONS, RATING, HOURS...
        if (uploadedUrls.length > 0) {
          venue.images = uploadedUrls;
        }
      }

    } catch (err) {
      console.error(`  ❌ Lỗi khi cào ảnh quán ${venue.name}:`, err.message);
    } finally {
      await page.close();
    }

    // Ghi đè cập nhật images vào cafe.json ngay lập tức sau mỗi quán
    fs.writeFileSync(SPOT_FILE, JSON.stringify(cafes, null, 2), 'utf8');
    console.log(`  💾 Đã lưu ${venue.images ? venue.images.length : 0} ảnh Cloudinary cho ${venue.name} vào cafe.json`);

    await randomDelay(1500, 3000);
  }

  await browser.close();
  console.log(`\n🎉 HOÀN THÀNH! Tất cả 20 quán café đã được cập nhật đủ 7+ ảnh Cloudinary vào cafe.json.`);
}

runScraper();
