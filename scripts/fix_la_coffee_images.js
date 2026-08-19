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

const laPhotoUrls = [
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWklZ2xHAYj_tKEigJkcLeO2WnFTkETwFDkyPYjN5xEUw8XhiFcRoAvKZyGhxvi0ClK6SKjWqSAHrMi21KqZnN5t1esUCL-GmS3XWcVFRBYD-7uDeooNiFN65u_MF6RkTw4HixCJ8G-JF9_i=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkUwgrglBYQQ-cWKLqtDekS-dV2WWzA0GBRvBYYlI7X3C5DuXgFAL_84lDrPg25lLMZ2UR89VfZRDnthWw0-Agkr5yKUNhvorMWtzkwUNOGqXSPa4KMDs_LlVveolCii0dS_Zv1iVsa3npM=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkC-aw7c7G64CWZsdbkKDvMPOI7n9HH1zwewhoP_-me-M7kiHJgkaHeSFFflOURW8bomRHIw6OTVLeB0Di2uNl_TcyfSX8Uq8t3Oh9WkdsJ7DYoB-STMCFvf5urqY4TcJ0VYogiLcFjX7uU=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm2xSFWVM62x_7oY1OyYgJSHDHMKu2S2mAsM8dKAs5OVIuAuPs5YgBLLi2OBPVZQSOk8gYPiZgIILZ9WXLy6JYXr8RvDHXwkiW60c-GQrFcSgSfaDD9hv7NgHdz1RJshGaU4qqmTDp9xJw=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmUHTQWiaY2sdBWc9hEAU1eakEZqoHkbuGGyCbsJ3zbXrBk9XsrLiESTe3VmTvtZ7WHyDsIBVEWnJR3_st6A2Ys8bt1p8-rzbnoElw56DdQNCCxtbxGmDKMynH7a9rcIDmGNG3xhkK9ZQo=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlt3xkfwcsk5D4FwZVyLyxsgEahEmBRd8AjaM-h5Wlmix1RJ7YeOeFuUte7QOOOPtStZTgALFJTQci1l12hJjt3lXRelMt_QOVZh8_jEU20Ws2bO6IxzjSb_FlmNpc-cRi7VNVp-CCvC-OD=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnu1CXQzByeqdgcFfC1YuQhvvUIML21w3OesA4ErJMLoGlo2XA3Iij_c9jOe4ovr3LgXTHRs1osuXinH_0gonmZQT6BfpEgX6WpZ73OM1KfRZtBuwiG9wW5IOFDwhmLF0Swia93FIgNcyHn=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmScaLNr_yau50MpwUMSt71-J_VY_b5dMNUlXqAxyh4148n3P6mnB4axNsp5igKLb-IY9Vu0MnWrKhTQKerIJZTA5sRhYzuZE2NNznSi1mNeDX7bPMqUtnxuxGqGo5_jKgUyapdaputs2Zr=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn8xUIBHkGLEiZmLH-7yHmuMBgUX2BLIMCFWaVzS9V7sGSnO1aQDDiyIEpTWOBpyuYOKgtonPeE89yj-grTFyPSUzaGeWB9VcP_Vjn_i-aqF42gAEW_gmEf_GAXmIJILw09I5b43_M-4b4k=s1360-w1360-h1020-rw'
];

async function fixLaCoffeeImages() {
  console.log('🚀 Đang upload 9 ảnh cho Lá Coffee & Tea lên Cloudinary [địa điểm/cà phê/Lá Coffee Tea]...');
  const cafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));

  const laSpot = cafes.find(c => c.name.includes('Lá Coffee'));
  if (!laSpot) {
    console.error('❌ Không tìm thấy Lá Coffee & Tea');
    return;
  }

  const folderPath = 'địa điểm/cà phê/Lá Coffee Tea';
  const uploadedUrls = [];

  for (let idx = 0; idx < laPhotoUrls.length; idx++) {
    try {
      const res = await cloudinary.uploader.upload(laPhotoUrls[idx], {
        folder: folderPath,
        resource_type: 'image'
      });
      uploadedUrls.push(res.secure_url);
      console.log(`  ✓ Upload ảnh ${idx + 1}/${laPhotoUrls.length}: ${res.secure_url}`);
    } catch (err) {
      console.error(`  ❌ Lỗi upload Cloudinary:`, err.message);
    }
  }

  if (uploadedUrls.length > 0) {
    laSpot.images = uploadedUrls;
  }

  fs.writeFileSync(CAFE_FILE, JSON.stringify(cafes, null, 2), 'utf8');
  console.log('🎉 Đã cập nhật ảnh Cloudinary cho Lá Coffee & Tea thành công!');
}

fixLaCoffeeImages();
