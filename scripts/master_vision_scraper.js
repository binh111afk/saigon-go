import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { v2 as cloudinary } from 'cloudinary';
import puppeteer from 'puppeteer';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.error('❌ CHƯA CÓ GEMINI_API_KEY TRONG FILE .env!');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const categories = ['stroll', 'entertainment', 'food', 'restaurant', 'snack', 'cafe', 'garden'];

const categoryVN = {
  stroll: 'đi dạo',
  entertainment: 'giải trí',
  food: 'ẩm thực',
  restaurant: 'nhà hàng',
  snack: 'ăn vặt',
  cafe: 'cà phê',
  garden: 'sân vườn'
};

const randomDelay = (min = 1000, max = 2000) =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

async function urlToGenerativePart(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = res.headers.get('content-type') || 'image/jpeg';
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimeType.split(';')[0]
      }
    };
  } catch (err) {
    return null;
  }
}

async function validateImageWithVision(imgUrl, venueName, catName) {
  try {
    const imagePart = await urlToGenerativePart(imgUrl);
    if (!imagePart) return false;

    const prompt = `Phân tích bức ảnh này cho địa điểm: "${venueName}" (Loại hình: ${catName}).
Bức ảnh này có phải là ảnh chụp thực tế của không gian, kiến trúc, món ăn, đồ uống, hoặc cảnh quan môi trường phù hợp với "${venueName}" không?
Trả về "INVALID" nếu bức ảnh thuộc các trường hợp sau:
1. Chứa chữ/banner quảng cáo không liên quan (ví dụ: "THE MOST EXPENSIVE CARS", banner tin tức xe,...)
2. Ảnh xe ô tô, ảnh hạt/hũ đường trắng, ảnh tờ lịch treo tường, ảnh hóa đơn, ảnh vé gửi xe
3. Ảnh bị mờ, ảnh chụp màn hình điện thoại, ảnh đồ vật linh tinh không phản ánh không gian/món ăn của địa điểm

Trả về "VALID" nếu bức ảnh là ảnh chụp phong cảnh, công viên, không gian sân vườn, kiến trúc tòa nhà, quán cafe, món ăn thực tế phù hợp.
Chỉ trả về 1 từ duy nhất: VALID hoặc INVALID.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt, imagePart]
    });

    const text = response.text ? response.text.trim().toUpperCase() : 'VALID';
    return text.includes('VALID') && !text.includes('INVALID');
  } catch (err) {
    console.error(`  ⚠️ Vision AI Error:`, err.message);
    return true; // Giữ lại nếu lỗi kết nối mạng
  }
}

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

async function scrapeCandidatesFromGoogleMaps(page, venueName, address) {
  const searchQuery = encodeURIComponent(`${venueName} ${address || 'TP.HCM'}`);
  await page.goto(`https://www.google.com/maps/search/${searchQuery}`, { waitUntil: 'networkidle2', timeout: 45000 });
  await randomDelay(1500, 2500);

  const firstCard = await page.$('a.hfTff, div.Nv2pk a, a[href*="/maps/place/"]');
  if (firstCard) {
    await firstCard.click();
    await randomDelay(2000, 3000);
  }

  const photoBtn = await page.$('button[aria-label*="Ảnh"], button[aria-label*="Photos"], button.ao3wfc, button[data-photo-index="0"], img[src*="googleusercontent"]');
  if (photoBtn) {
    try {
      await photoBtn.click();
      await randomDelay(2000, 3000);
    } catch (e) {}
  }

  for (let scrollStep = 0; scrollStep < 6; scrollStep++) {
    await page.keyboard.press('PageDown');
    await page.evaluate(() => {
      const scrollPanels = document.querySelectorAll('div.m6QEpc, div[mqa-scroll-area], div.DxyBzc, div.w652be, div.section-layout');
      scrollPanels.forEach((el) => (el.scrollTop += 2500));
    });
    await randomDelay(500, 800);
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

  return Array.from(new Set(rawPhotoUrls)).filter((u) => !isAvatarUrl(u));
}

async function masterVisionScraper() {
  console.log('🚀 BẮT ĐẦU MASTER GEMINI VISION AI VERIFICATION & AUTO-REPLACEMENT...');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  let totalPurged = 0;
  let totalApproved = 0;

  for (const cat of categories) {
    const filePath = path.join(process.cwd(), 'src', 'data', 'spots', `${cat}.json`);
    if (!fs.existsSync(filePath)) continue;

    let spots = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let fileModified = false;

    console.log(`\n==================================================`);
    console.log(`📂 KIỂM TRA VISION AI CHO DANH MỤC: ${cat}.json (${spots.length} địa điểm)`);

    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i];
      console.log(`\n--------------------------------------------------`);
      console.log(`[${i + 1}/${spots.length}] Địa điểm: ${spot.name} (${spot.district || spot.group})`);

      const cleanName = spot.name.replace(/&/g, '').replace(/,/g, '').replace(/:/g, '').replace(/  +/g, ' ').trim();
      const folderCategory = categoryVN[cat] || cat;
      const folderPath = `địa điểm/${folderCategory}/${cleanName}`;

      // Step 1: Validate existing images with Gemini Vision
      const validImages = [];
      if (spot.images && spot.images.length > 0) {
        console.log(`  🔍 Đang cho Gemini Vision xem ${spot.images.length} ảnh hiện có...`);
        for (let imgIdx = 0; imgIdx < spot.images.length; imgIdx++) {
          const imgUrl = spot.images[imgIdx];
          const isValid = await validateImageWithVision(imgUrl, spot.name, categoryVN[cat]);
          if (isValid) {
            console.log(`    ✓ Ảnh ${imgIdx + 1}: 🟢 GEMINI VISION APPROVE (VALID)`);
            validImages.push(imgUrl);
            totalApproved++;
          } else {
            console.log(`    ❌ Ảnh ${imgIdx + 1}: 🔴 GEMINI VISION REJECT (INVALID - XÓA)`);
            totalPurged++;
            fileModified = true;
          }
          await randomDelay(200, 400);
        }
      }

      spot.images = validImages;

      // Step 2: If valid images < 6, scrape candidate images and pass through Gemini Vision before uploading to Cloudinary
      if (spot.images.length < 6) {
        const neededCount = 8 - spot.images.length;
        console.log(`  🔄 Ảnh hợp lệ hiện có (${spot.images.length}/8). Đang cào bổ sung & lọc bằng Gemini Vision...`);

        try {
          const candidates = await scrapeCandidatesFromGoogleMaps(page, spot.name, spot.fullAddress || spot.address);
          console.log(`  📸 Tìm thấy ${candidates.length} ảnh ứng viên từ Google Maps.`);

          for (const candUrl of candidates) {
            if (spot.images.length >= 8) break;

            const isCandValid = await validateImageWithVision(candUrl, spot.name, categoryVN[cat]);
            if (isCandValid) {
              console.log(`    🟢 Ứng viên ĐƯỢC GEMINI APPROVED! Đang upload Cloudinary...`);
              const cloudUrl = await uploadImageToCloudinary(candUrl, folderPath);
              if (cloudUrl) {
                spot.images.push(cloudUrl);
                fileModified = true;
                totalApproved++;
                console.log(`      ✓ Uploaded: ${cloudUrl}`);
              }
            } else {
              console.log(`    🔴 Ứng viên BỊ GEMINI REJECT. Bỏ qua.`);
              totalPurged++;
            }
            await randomDelay(300, 600);
          }
        } catch (err) {
          console.error(`  ⚠️ Lỗi cào bổ sung cho ${spot.name}:`, err.message);
        }
      }

      if (fileModified) {
        fs.writeFileSync(filePath, JSON.stringify(spots, null, 2), 'utf8');
        console.log(`  💾 Đã cập nhật ${spot.images.length} ảnh Gemini Vision Approved cho [${spot.name}] vào ${cat}.json!`);
      }
    }
  }

  await browser.close();
  console.log(`\n🎉 HOÀN THÀNH TOÀN BỘ TIẾN TRÌNH GEMINI VISION AI FILTER & SCRAPING!`);
  console.log(`  - Tổng số ảnh bị loại bỏ (INVALID): ${totalPurged}`);
  console.log(`  - Tổng số ảnh được Gemini Vision phê duyệt (VALID): ${totalApproved}`);
}

masterVisionScraper();
