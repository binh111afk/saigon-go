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

const randomDelay = (min = 1200, max = 2200) =>
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

function extractGeoFromUrl(url) {
  if (!url) return null;
  const match3d4d = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (match3d4d) {
    return { lat: parseFloat(match3d4d[1]), lng: parseFloat(match3d4d[2]) };
  }
  const matchAt = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (matchAt) {
    return { lat: parseFloat(matchAt[1]), lng: parseFloat(matchAt[2]) };
  }
  return null;
}

async function runCafeScraper() {
  console.log('🚀 Bắt đầu cào ĐỦ ẢNH GOOGLE MAPS CHO CAFE.JSON (43 QUÁN CAFÉ)...');

  if (!fs.existsSync(SPOT_FILE)) return;
  let spots = JSON.parse(fs.readFileSync(SPOT_FILE, 'utf8'));

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN']
  });

  for (let i = 0; i < spots.length; i++) {
    const venue = spots[i];

    if (venue.images && venue.images.length > 0) {
      console.log(`\n--------------------------------------------------`);
      console.log(`[${i + 1}/${spots.length}] Quán café: ${venue.name} (Đã có ${venue.images.length} ảnh, bỏ qua cào lại)`);
      continue;
    }

    console.log(`\n--------------------------------------------------`);
    console.log(`[${i + 1}/${spots.length}] Quán café: ${venue.name}`);

    const cleanName = venue.name.replace(/&/g, '').replace(/,/g, '').replace(/:/g, '').replace(/  +/g, ' ').trim();
    const folderPath = `địa điểm/cà phê/${cleanName}`;

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    try {
      const searchQuery = encodeURIComponent(`${venue.name} ${venue.address || 'Quận 1 TP.HCM'}`);
      await page.goto(`https://www.google.com/maps/search/${searchQuery}`, { waitUntil: 'networkidle2', timeout: 50000 });
      await randomDelay(2000, 3000);

      const firstCard = await page.$('a.hfTff, div.Nv2pk a, a[href*="/maps/place/"]');
      if (firstCard) {
        await firstCard.click();
        await randomDelay(2500, 3500);
      }

      if (page.url().includes('/maps/place/')) {
        venue.mapUrl = page.url();
        const extractedGeo = extractGeoFromUrl(page.url());
        if (extractedGeo) {
          venue.geo = extractedGeo;
          console.log(`  📍 Coordinates: Lat ${extractedGeo.lat}, Lng ${extractedGeo.lng}`);
        }
      }

      const photoBtn = await page.$('button[aria-label*="Ảnh"], button[aria-label*="Photos"], button.ao3wfc, button[data-photo-index="0"], img[src*="googleusercontent"]');
      if (photoBtn) {
        try {
          await photoBtn.click();
          await randomDelay(2000, 3000);
        } catch (e) {}
      }

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

      for (let scrollStep = 0; scrollStep < 8; scrollStep++) {
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

      const cleanPhotos = Array.from(new Set(rawPhotoUrls)).filter((u) => !isAvatarUrl(u));
      const finalPhotos = cleanPhotos.slice(0, 8);

      console.log(`  📸 Thu thập được ${finalPhotos.length} ảnh cho [${venue.name}].`);

      if (finalPhotos.length > 0) {
        const uploadedUrls = [];
        for (let pIdx = 0; pIdx < finalPhotos.length; pIdx++) {
          const secureUrl = await uploadImageToCloudinary(finalPhotos[pIdx], folderPath);
          if (secureUrl) {
            uploadedUrls.push(secureUrl);
            console.log(`    ✓ [${pIdx + 1}/${finalPhotos.length}] ${secureUrl}`);
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

    fs.writeFileSync(SPOT_FILE, JSON.stringify(spots, null, 2), 'utf8');
    console.log(`  💾 Đã lưu ${venue.images ? venue.images.length : 0} ảnh Cloudinary cho [${venue.name}]!`);

    await randomDelay(1000, 2000);
  }

  await browser.close();
  console.log(`\n🎉 HOÀN THÀNH TOÀN BỘ CÀO ẢNH CHO CAFE.JSON!`);
}

runCafeScraper();
