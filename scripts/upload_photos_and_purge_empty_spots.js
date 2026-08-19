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

const newPhotosMap = {
  'Highlands Coffee Lê Thị Hà - Hóc Môn': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWndCD9lhuVGhIi6b82hK5KxnsRXrF6lbJxw6hOjbg1qnpb1W3w4t4G823uflJlAHEpKfSD-C8M54P2GtwlpxtvTHtbwbP7CIcm1yRrPyeaa0nbxNHUoXlJofM-ZFBELTIUAHUHR=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkV3N9ksps7Wdtu5xOGWdjF-oltJ6uZGZEtLhjRCdHP1orfN2oeBOheiRN3T5uYC68RXMVeLMIvYMpkrWWjdZe1M4xKDrOEdlXFn7HEaOf527oUW6Ll-iq4B6r-lwxl28lFRSwPQND_3G2C=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlMNMXyCfBkW2DitlkHj_4rCMV36qO61WYcSWnpW89hJyZ9SFVriFW8iofDa0gwIMh-vleymK8MxpUFySsMxnUovNxuizyOr0zejToV3GgcQLqrCROp1wHegDnbScVxW-dy_oR_=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnpNWFQY8Z1OOB81pulZuIttC_Mz0r96IxqpoQnuBW4FOh3lIwD6v6JprGRxjV4IRCH8n82WrYaqYJV6VnDLsYBcBtdTF3Ab8Np9evqpGqN33dNEDdaz2BS6ZEsy66i9M8EIWSP=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmwNzC6vTYKAZvR8F8lNude-oPP2-jOFA7-JfRGWhLmPFNfd_T1cBTJn-e9FinyfyxGsGNfIvtQtqQMfqIJO66h_jayoHY3qgI0iTBR4cg_RsNGFOB99ZJjsYK7mmwrK_YL04CC=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkEd37QZhXIeUEf62cPKPzbctjuJyCcDSctz3EutkxRkpvdHRgd2xTX4j_S0BUGKVUuzdcDkuzKHqnuCsZj50sOle6q20jbEWrXxapLANW6_CZ6vWHA1xnydWbRzAwGAzILQPTz=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl0pELIRZE2fPX6L4rrOhx5XUJCVvMJEXcqR6t1HQHgeGfHys4cQvIZ6VjT287Mx1sau90VoS8T9fAGLrR08xw22u-Aq1JnSS0LSvI7HeHgvrpmsxrQLoOR8OKugOBiXzeacyDh=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmpJE6IfjVPVGMnKsUIKVPyD3V0iFEFUH2O3dCZq4Hx1oL3steyI32ocd6SlkYWBboLCi_m1PlU49OUKmDhrRbpR7PaUljFAhgzHmJRfTDjrSS9m6s9fGha_yM0nqKTj1sLZylq=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkwZn8Q8n-RdXbUdVDrXIWoyP9s8V-1kzTjm9wTv2cfnwIjAlhjZc651Q12UP8Gt-N5tX9CentjTeQMNmAAzjJeqqeMo_w-QQ_OAcTrymBf_xQnZ1zPft4segpdQttudvhP0XS50A=s1360-w1360-h1020-rw'
  ],
  "Coc's coffee & tea": [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWljmVsbT4fCHwOZXu8jbJ99is7wr_dyt3KgMtEf-BTmjVwWYKqI3HvM8PufT1YR-jJ1OHahnXsZva91WTt-lYD8TOPwhslmovvftqpuurxaWjE78Zpnmjnyxe_cH-nMqaX7OnYzGg=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlrOsGxhxT-C-K-JKaPzRvBqzq0d9OHuV24v5DqgHZfPpxuJH7iGN8J8FJhF0_84YJDPJcJf5eulOtVB8MzagaKkouQ4RTTJGSaCxd5EZd-004CauXVNFm6dqGVkLu0AAZvhndp2bmcCDuQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlhTJxGojBgCrL7iPa5goA_-hOF-bWAkKq8qz_EpHTKVq1JwkvmiKoQV0aSsNPGOShD1rCZQ-FQJI94Trri7sEcDKAuJNZsrE1i4M3p58LsCjembx9w0tEhHxTMGPl6M66QYu4B=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnQzckY_1rCpu-aKqz8IkutEHmRu8IC0fWy6GN4QUg23sRYLh-dGeJc0cLBO476V1KO72Zf0JLsXKI59g1ThFtLXTOZD6RVy-hk11oe3OUgWA_IQ_FqXoljLcuGGNBR9lslPUSxbJAsWB2S=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkiBi3JA7bag4Ed-BWT8uFFp8glYujTfx-YEEddLVkSoSW_eswam7KWZfcbmREzqqGJ0-7qCWl1FYqiOq1-mJRwumpeZeWR2B6vY9GfQaV9GR3itVa9kIre77ApDr5eldkI1h9h=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlJiVjcvKwq7DcsRCrbDJvtfvyw80yjhr2GjlpJgjhlL1BXXLQ-8yoDWhky2ovOVWIyDVJ0nwqTkhb5SZ_mnbBiaSwGFzJKtM8EfwfP30DpE9fWm0k11PXGSaFIHI2VRGooDWO8gxMpRtXM=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnruHqvx5HzzRGSlhqH65tzIRmfJQiw2HVJgh4fSxD6eHEZWg0qU1gHp1Sm4i0ht2Ix1HfSNxgW3wecFyIHLUESnBVR48bZq2RDfONilTol88wJ7Oy93HPivii2k8Pei9bxNN731g=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmaMhVJST_RIVDzEYahUjYH0lkxUek7lY6NtB2rdd_IgNBids2Bi1WvK0OJ7kbxa3lvnW-2TFSf_H-fmaZIEE4R5fy1AWTmNCFulSsu0iko9gpTX4BMVsz_ZMCjaNxsPBjMlhxBlw=s1360-w1360-h1020-rw'
  ],
  'Moss&Muse': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmfFhZg4c7kpJhWQEzkUy86FYTtrdk0tCd6d3fuJCPN5oXpRAgG1lVBJKTubVTLy5nJ4_Jp2ydXDGVqux_gGixYIgEhoWIOTeD6mFcLr8T46NUbHqVhtjOv8c_7WpQPXSug1BqxKFtIKXQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnOtCevFm1o8DdjTMak4R1iZmS56ZCg6b15tfgJl_DmMZoc08SoMuzHc6T3kLVVzaqRGhG3KGDPGF6JRQ7xNfC5L8BwGobItXlIv0sBC913v-rcTtNXBtPzcQ0hAussHOpzoyc_-8IpJo4b=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkgsQnOGrmW6KwAL8922NzoRwwen3R18SdimYTqu8WKWJME14qGiw5lCsMdeytTycJw0r_k0zGHdZme_-P8roHUiKpPX4dP4EpvfFnbZN83h4yrzAbQ5HNGEW_R3ybXVG8A26lMY-oz8iaA=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlIYfidqCh-1CtO3ECTXCIvbgikDkgBcsHpKIoxNEoy0qXRf_ojtkeUnw7r-Cl2KfRp-U7Rpz9b5mDYXmMNIwgdYtz6-3ql0JXjdVHkxJPRXqslQhX7BIox77-BRr08uumC61rGlaf67yBf=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkdPY9YV4Cad2Dkg9c0IsckdvWmyOvKR9i6XkqFR3hffv-W7WoFuRKrqubNJqxPzkiksKln09aOjpkZMjjOcpleUvQKqvNGXFw1XAZZxeA2hQ-CczN_NKkYeXeSlaeV3ckCLEbDlR2YNDmN=s1360-w1360-h1020-rw'
  ],
  '6:AM COFFEE': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmRu3dolGZm-bk3smRPK2Cf8RFJEZiW0ZDf9E8OnjiQ7_MLOXdSRvf5gqzMWdQ8jsgYHggIYzQUP2GPVwB2Epa7yanFHHcAOoUxnu0pNQHlxH0QGlpbPfCgW9Vyiwn1O3knXFtV=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmFVuq4DWJc6v2SsbFO5PKc9od5tvDHOoRwvSV_VKPTZkkdUDLF6NX6eSTuMdRN64yAAna8NFHIMzHf0LN5htB3Dnn3CQCNb2BpwdWxJ48gqn6rxg6E0babASa-JKvOrOooSjY=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl1nlaiybY7537jS1B0EqYVLN2CzTdNHNpk1zqscP3ULUowNeSCsc3zG7PP4tApUfWUOtVD5kK3W5-6hCkLfBya0y4I8zE87UDQbFmyAOScT4cSdf9KyZzb2HJub4nEPzMvR99CP5bAvrKt=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnSsnPD1eMC4rXhYXakRcZvtRU7QoSKLTCRZghsAmuhIU0Ka5mASW6WUMb8J_NGbhU5z2XF0TxP7hx7c-mp0GfYk46BsbeSjM3wDfBUWC5MI8TTIAdrKoiYvY36LO9m-cHkWxU-=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmRlSX7mFDm5JCKmFYcwHK5Knkuns5FynMVMUvGQd5wQDSKQNyhzCEnwxTt-X4ZWeXeMcv0boPelTRkB9-yGNqCTZucW-GJEz-XoaJZ6_sb0hBgWQJR5IuA-ThTQcGjNVakJuzu=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnAOFuBP5q6KyhCzTKK9PBpeBVFbha1hlYm5JY7S9SOhzG7wfb96rCc14DOX6jYmU_6H4RvB1Vi14ApF1icWgN_vYOfYKq1zKsMe8gjJfEDHN0lzG89B65vgWqOgf4WHX2zAGEZ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmlSWzPmZFs3flWiNMVCbjgpXz-mnCb3bjctO3H9QhBXhHyTbwV50GtUzOX9JDw4hF4jLHc4s-Y3dQRliJEgLII-2SYDhpu-5BUPPH5fxTB9LvYFlSokfu0RwFfDpy-a-p2T5vs=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfSLvyblAcaqy83XuSOIGMWkpPllqREo8bUOA6gPEfLtOOrfhWTkSv-XKiXiLen2oKb5dazuXCO8UvDr7gGdAEth2f7wsX3VcK7hfNlEWc4K4kGTItOyZqeJ5s6i8FGF7pHaKw=s1360-w1360-h1020-rw'
  ]
};

async function runUploadAndPurge() {
  console.log('🚀 Bắt đầu upload ảnh cho 4 quán & kiểm tra xóa các quán không có ảnh...');

  let cafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));

  // 1. Upload ảnh cho 4 quán được cung cấp
  for (const [keyName, photoUrls] of Object.entries(newPhotosMap)) {
    const spot = cafes.find(c => c.name.toLowerCase().includes(keyName.toLowerCase()) || keyName.toLowerCase().includes(c.name.toLowerCase()));
    if (spot) {
      const cleanName = spot.name.replace(/&/g, '').replace(/,/g, '').replace(/:/g, '').replace(/  +/g, ' ').trim();
      const folderPath = `địa điểm/cà phê/${cleanName}`;

      console.log(`\n📸 Uploading ${photoUrls.length} ảnh cho [${spot.name}] -> Cloudinary [${folderPath}]...`);
      const uploadedUrls = [];

      for (let idx = 0; idx < photoUrls.length; idx++) {
        try {
          const res = await cloudinary.uploader.upload(photoUrls[idx], {
            folder: folderPath,
            resource_type: 'image'
          });
          uploadedUrls.push(res.secure_url);
          console.log(`  ✓ Ảnh ${idx + 1}/${photoUrls.length}: ${res.secure_url}`);
        } catch (err) {
          console.error(`  ❌ Lỗi upload Cloudinary [${spot.name}]:`, err.message);
        }
      }

      if (uploadedUrls.length > 0) {
        spot.images = uploadedUrls;
      }
    }
  }

  // 2. Tìm và xóa các quán có images rỗng (images.length === 0)
  const emptySpots = cafes.filter(c => !c.images || c.images.length === 0);
  if (emptySpots.length > 0) {
    console.log(`\n🗑️ Tìm thấy ${emptySpots.length} quán có trường images trống:`);
    for (const emptySpot of emptySpots) {
      console.log(`  ❌ Xóa quán: [${emptySpot.name}]`);

      // Xóa thư mục trên Cloudinary nếu có
      const cleanName = emptySpot.name.replace(/&/g, '').replace(/,/g, '').replace(/:/g, '').replace(/  +/g, ' ').trim();
      const folderPath = `địa điểm/cà phê/${cleanName}`;
      try {
        await cloudinary.api.delete_resources_by_prefix(folderPath);
        await cloudinary.api.delete_folder(folderPath);
        console.log(`  🗑️ Đã xóa thư mục Cloudinary: ${folderPath}`);
      } catch (e) {
        // Thư mục có thể chưa được tạo trên Cloudinary
      }
    }

    cafes = cafes.filter(c => c.images && c.images.length > 0);
  } else {
    console.log('\n✨ Không có quán nào bị trống ảnh.');
  }

  // 3. Đánh lại ID tuần tự cho cafe.json
  cafes.forEach((c, idx) => {
    c.id = idx + 1;
  });

  fs.writeFileSync(CAFE_FILE, JSON.stringify(cafes, null, 2), 'utf8');

  console.log(`\n🎉 HOÀN THÀNH TOÀN BỘ!`);
  console.log(`☕ cafe.json còn lại ${cafes.length} quán đầy đủ hình ảnh Cloudinary.`);
}

runUploadAndPurge();
