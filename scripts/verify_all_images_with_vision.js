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
  console.error('👉 Vui lòng dán GEMINI_API_KEY từ https://aistudio.google.com/app/apikey vào file .env rồi chạy lại script.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const categories = ['cafe', 'garden', 'snack', 'food', 'restaurant', 'entertainment', 'stroll'];

const categoryVN = {
  cafe: 'cà phê',
  garden: 'sân vườn',
  snack: 'ăn vặt',
  food: 'ẩm thực',
  restaurant: 'nhà hàng',
  entertainment: 'giải trí',
  stroll: 'đi dạo'
};

const randomDelay = (min = 1200, max = 2200) =>
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

async function validateImageWithVision(imgUrl, venueName, catName) {
  try {
    const imagePart = await urlToGenerativePart(imgUrl);
    if (!imagePart) return false;

    const prompt = `Phân tích bức ảnh này cho địa điểm: "${venueName}" (Loại hình: ${catName}).
Bức ảnh này có phải là ảnh chụp thực tế của không gian, kiến trúc, món ăn, cảnh quan, hoặc nội/ngoại thất phù hợp với "${venueName}" không?
Trả về "INVALID" nếu ảnh chứa:
1. Văn bản quảng cáo/banner không liên quan (ví dụ: "THE MOST EXPENSIVE CARS", chữ quảng cáo xe,...)
2. Ảnh xe ô tô, đường ăn (đường trắng), tờ lịch tường, hóa đơn thanh toán, bảng giá vé xe
3. Ảnh rác/vector minh họa không liên quan đến địa điểm

Nếu là ảnh phong cảnh, công viên, tòa nhà, quán cafe, món ăn thực tế phù hợp thì trả về "VALID".
Chỉ trả về 1 từ duy nhất: VALID hoặc INVALID.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt, imagePart]
    });

    const text = response.text ? response.text.trim().toUpperCase() : 'VALID';
    return text.includes('VALID') && !text.includes('INVALID');
  } catch (err) {
    console.error(`  ⚠️ Gemini Vision API Warning:`, err.message);
    return true; // Giữ lại nếu API bị nghẽn
  }
}

async function main() {
  console.log('👁️ BẮT ĐẦU KIỂM TRA & LỌC TOÀN BỘ ẢNH BẰNG GEMINI VISION AI...');

  let totalChecked = 0;
  let totalRemoved = 0;

  for (const cat of categories) {
    const filePath = path.join(process.cwd(), 'src', 'data', 'spots', `${cat}.json`);
    if (!fs.existsSync(filePath)) continue;

    let spots = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let fileModified = false;

    console.log(`\n==================================================`);
    console.log(`📂 Đang quét danh mục: ${cat}.json (${spots.length} địa điểm)`);

    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i];
      if (!spot.images || spot.images.length === 0) continue;

      const validImages = [];
      console.log(`\n[${i + 1}/${spots.length}] 🔍 Kiểm tra Gemini Vision cho: [${spot.name}] (${spot.images.length} ảnh)`);

      for (let imgIdx = 0; imgIdx < spot.images.length; imgIdx++) {
        const imgUrl = spot.images[imgIdx];
        totalChecked++;

        process.stdout.write(`  - Ảnh ${imgIdx + 1}/${spot.images.length}: `);
        const isValid = await validateImageWithVision(imgUrl, spot.name, categoryVN[cat]);

        if (isValid) {
          console.log('🟢 CHUẨN (VALID)');
          validImages.push(imgUrl);
        } else {
          console.log('🔴 XÓA ẢNH LỘN/ẢNH RÁC (INVALID)');
          totalRemoved++;
          fileModified = true;
        }

        await randomDelay(300, 600);
      }

      if (validImages.length !== spot.images.length) {
        spot.images = validImages;
        fileModified = true;
      }
    }

    if (fileModified) {
      fs.writeFileSync(filePath, JSON.stringify(spots, null, 2), 'utf8');
      console.log(`💾 Đã lưu thay đổi vào ${cat}.json`);
    }
  }

  console.log(`\n🎉 BÁO CÁO HOÀN THÀNH LỌC GEMINI VISION AI:`);
  console.log(`  - Tổng số ảnh đã kiểm tra: ${totalChecked}`);
  console.log(`  - Số ảnh rác/lộn bị phát hiện & loại bỏ: ${totalRemoved}`);
}

main();
