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

const CAFE_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json');

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
    console.error(`  ❌ Lỗi tải ảnh: ${url}`, err.message);
    return null;
  }
}

async function evaluateHadiSpacePhotoWithRetry(imgUrl, retries = 5) {
  const imagePart = await urlToGenerativePart(imgUrl);
  if (!imagePart) return { isValid: false, reason: 'Không tải được định dạng ảnh' };

  const prompt = `Phân tích bức ảnh này cho quán cà phê "HADI - Đi Bán Trà Và Bán Cà Phê" tại 1/83 Lê Thị Hà, Hóc Môn.
Bức ảnh này có phải là ảnh chụp KHÔNG GIAN THỰC TẾ của quán HADI không? (Ví dụ: bàn ghế, quầy pha chế, góc làm việc, không gian trong nhà, mặt tiền quán, không gian máy lạnh hoặc ban công/sân vườn).

TRẢ VỀ "INVALID" NẾU BỨC ẢNH LÀ:
1. Ảnh tự sướng cá nhân che hết không gian
2. Ảnh hóa đơn thanh toán, vé xe, menu hoặc tài liệu mờ
3. Ảnh cận cảnh ly nước/món ăn mà không thấy không gian xung quanh
4. Ảnh mờ, ảnh chụp màn hình điện thoại hoặc ảnh không liên quan

TRẢ VỀ "VALID" NẾU BỨC ẢNH LÀ:
Ảnh thể hiện rõ không gian, kiến trúc, góc ngồi, hoặc không gian tổng thể của quán HADI.

Hãy trả về đúng định dạng JSON:
{"status": "VALID" hoặc "INVALID", "reason": "Lý do ngắn gọn bằng tiếng Việt"}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt, imagePart]
      });

      const text = response.text ? response.text.trim() : '';
      try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          isValid: parsed.status === 'VALID',
          reason: parsed.reason || ''
        };
      } catch (e) {
        const isVal = text.toUpperCase().includes('VALID') && !text.toUpperCase().includes('INVALID');
        return { isValid: isVal, reason: text };
      }
    } catch (err) {
      if (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED')) {
        console.log(`  ⏳ Dính Quota Rate Limit (429), chờ 12s trước khi thử lại lần ${attempt}/${retries}...`);
        await randomDelay(12000, 13000);
      } else {
        console.error(`  ⚠️ Vision AI Error (lần ${attempt}):`, err.message);
        await randomDelay(3000, 4000);
      }
    }
  }

  return { isValid: false, reason: 'Vượt quá số lần thử Vision AI' };
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

async function main() {
  console.log('🚀 BẮT ĐẦU CÀO & ĐÁNH GIÁ 10 ẢNH KHÔNG GIAN CHUẨN VISION AI CHO QUÁN HADI...');

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

  for (let scrollStep = 0; scrollStep < 12; scrollStep++) {
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

  const candidates = Array.from(new Set(rawPhotoUrls)).filter((u) => !isAvatarUrl(u));
  console.log(`\n📸 Thu thập được ${candidates.length} ảnh ứng viên từ Google Maps cho quán HADI.`);

  const folderPath = `địa điểm/cà phê/HADI- Đi Bán Trà Và Bán Cà Phê`;
  const approvedImages = [];
  const evalLog = [];

  for (let idx = 0; idx < candidates.length; idx++) {
    if (approvedImages.length >= 10) break;

    const candUrl = candidates[idx];
    console.log(`\n[Ứng viên ${idx + 1}/${candidates.length}] Đang gửi cho Gemini Vision AI phân tích...`);

    const result = await evaluateHadiSpacePhotoWithRetry(candUrl);

    if (result.isValid) {
      console.log(`  🟢 GEMINI APPROVE (VALID): ${result.reason}`);
      console.log(`  ☁️ Uploading Cloudinary...`);
      const cloudUrl = await uploadImageToCloudinary(candUrl, folderPath);
      if (cloudUrl) {
        approvedImages.push(cloudUrl);
        evalLog.push({ index: approvedImages.length, status: 'APPROVED', cloudUrl, reason: result.reason });
        console.log(`  ✓ [ĐÃ LƯU ${approvedImages.length}/10] ${cloudUrl}`);
      }
    } else {
      console.log(`  🔴 GEMINI REJECT (INVALID): ${result.reason}`);
      evalLog.push({ index: idx + 1, status: 'REJECTED', url: candUrl, reason: result.reason });
    }

    // Delay 3.5 seconds between API requests to respect the 20 requests/minute free quota limit
    await randomDelay(3500, 4500);
  }

  if (approvedImages.length > 0 && fs.existsSync(CAFE_FILE)) {
    const cafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));
    const hadiIndex = cafes.findIndex(s => s.name.includes('HADI'));
    if (hadiIndex !== -1) {
      cafes[hadiIndex].images = approvedImages;
      fs.writeFileSync(CAFE_FILE, JSON.stringify(cafes, null, 2), 'utf8');
      console.log(`\n💾 Đã lưu ĐỦ ${approvedImages.length} ảnh không gian Gemini Vision Phê duyệt cho quán HADI vào cafe.json!`);
    }
  }

  console.log('\n==================================================');
  console.log('📊 TỔNG KẾT ĐÁNH GIÁ CỦA AI VISION CHO QUÁN HADI:');
  evalLog.forEach(item => {
    if (item.status === 'APPROVED') {
      console.log(`  🟢 [Ảnh ${item.index}] Đạt chuẩn không gian -> ${item.reason}`);
    } else {
      console.log(`  🔴 [Bỏ qua] -> ${item.reason}`);
    }
  });
}

main();
