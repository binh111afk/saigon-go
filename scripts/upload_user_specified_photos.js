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

const SPOT_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'stroll.json');

const USER_SPOT_IMAGES = {
  'Rin Rin Park': [
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-ca-koi-8-1691678327.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-ca-koi-1-1691678306.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-ca-koi-9-1691678330.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-ca-koi-3-1691678313.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-ca-koi-5-1691678318.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-ca-koi-6-1691678321.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-ca-koi-4-1691678316.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-ca-koi-2-1691678309.jpg'
  ],
  'Công viên du lịch sinh thái Hóc Môn': [
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-du-lich-sinh-thai-hoc-mon-10-1691414505.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-du-lich-sinh-thai-hoc-mon-2-1691414914.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-du-lich-sinh-thai-hoc-mon-8-1691414500.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-du-lich-sinh-thai-hoc-mon-1-1691414482.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-du-lich-sinh-thai-hoc-mon-3-1691414487.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-du-lich-sinh-thai-hoc-mon-7-1691414498.jpg',
    'https://mia.vn/media/uploads/blog-du-lich/cong-vien-du-lich-sinh-thai-hoc-mon-6-1691414495.jpg'
  ],
  'Công viên Chợ Hóc Môn': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkw1N6Q8tycSGLgkZTxqOJETp2NBmlPI-YpHLI-_ogtFTgHTVy0UaCHQg15p30WlrMTDtUqB7TifZF2_s1NKfWPeCOB-iCuAwxJeAUGghSImEiFKEyxIYeE2NO9fzoJgMJQhyBJ8g=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmIY4-KtWT_97Webd7Ykx6PmfQ8xbgNteox0TS8U4XYmfTwR8k-4QVmm_SeoaT6dv7XVt8z2fdikUWl5W1UPGImMlO-P0PZGodOzDyKVg46_msJa1WN2LNEj7T6XQsFITZ-N3V8k6yH4FRp=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmfgLvwmiIRiDlOV-NS19Fp_cOIKE6yuKPzfHP6SynxH2IwpMKEE3ZH3RptL4i1EngHTNusH-q8nxHydbJnaBs41lw1J5wPYz3GbBhDcLTTOpGITqb743QQN09xc7UuN0iw9haWrw=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk8ORDfFkj_h-pxCqUQNW7-pmDpiHJer6ldkVYR4aP-rKMImBTIKDuigyzaBDSA0mxp-Bk-rUG_3W0V4OIAJVVXTSCIziz67RTHHQPNOi30kVtMoBRRzVoqXYvfncKONnQlIYUU6A=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk0ayA71L2wSUm0HTq1Q-9CZ1tzY9GSIjO2asngRFpiCr_eo6jsNfa4V4xfDzBZvZT9-mJRdlOkgkUC1U0lrXhFqiZsz-4TSFEAIiKEeXoPX_JjLdo4LkTf_q4Z-LbNZtjdQ4W1=s1360-w1360-h1020-rw'
  ],
  'Công viên xã Tân Thới Nhì': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlr5GTeoxSY24Wzm5E4_lgbgOPUPJ2-raJCSVX9zklzQnTkFXkmlFFOAHba_pdb-v77md6u6Aluqj3JRrmPTUQidhTlkYwEnKQp6yr9dpjDPjR2VRzd9TWmnSb6sAhsncjHAW22=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlJfQ3vnuVauDXOiMOmaxb-CJVY35bm2ZlrGuINrehQEHcAG2XQvI8YDE466KP59bVY_Iv0oxH9GmbBSJymXgeSZOMI11gDAyJ-TBMsDoHEIoO-rY0t_RxG-bVWidviM0pZFk5n=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlJrReqqrKpZMg1acKF7DA1OyY7XwkxFjfAEfe5S8jAVk6JYRiOOHWC8bYKbOvpa4JGres-zAt-JkCVOQW0zy7SkbTbE0wvtMhVbDvMBtvHnQ3CN7YHJY35O9dQQTjsSOGkd2W9pw=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnkOxL0N4aPiI6Xs4gvOlI19ojucusC5_8Fi3ik5O6KWX1YzfijNEitKln1oXdKuWohb3vvOjnJVTT-4iJ2x5hEhtxlVLBYFIk5LEbqZdxbwnIUFrL5RzYei81d8ZsF02J4_KZG1Q=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn63A2ihzeyLhsNmjraJW6gQbx4dDP2z45PfnUgBtjleyT7PJwXrYtslhJA6viisMPxTFuhMVfwQEpaRlncxNbWorYHuwO6ilI8bTNS6Wklhrb286b1nhVjiGTF1GyaSaWvUyFc=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlvi4v8og9el1QvtRI5lgg_aJBLX0ygnDBSdBVFCirlge1FghorF300YKeXiTaMm6ut5ltVhkrBX7YKWYNDPhtt-g4_oGDqHk8XuYe5bkR3jhX0_eh-nry0VSZWg8a7KavC237T6g=s1360-w1360-h1020-rw'
  ]
};

async function uploadUserSpecifiedPhotos() {
  console.log('🚀 Uploading exact user-provided photo lists to Cloudinary...');

  if (!fs.existsSync(SPOT_FILE)) return;
  let spots = JSON.parse(fs.readFileSync(SPOT_FILE, 'utf8'));

  for (const [spotName, urls] of Object.entries(USER_SPOT_IMAGES)) {
    const idx = spots.findIndex((s) => s.name.trim() === spotName.trim());
    if (idx === -1) {
      console.error(`❌ Spot not found: ${spotName}`);
      continue;
    }

    console.log(`\n--------------------------------------------------`);
    console.log(`📂 Processing spot: ${spotName} (${urls.length} images)...`);

    const cleanName = spotName.replace(/&/g, '').replace(/,/g, '').replace(/:/g, '').replace(/  +/g, ' ').trim();
    const folderPath = `địa điểm/đi dạo/${cleanName}`;

    const uploadedUrls = [];
    for (let i = 0; i < urls.length; i++) {
      const srcUrl = urls[i];
      try {
        const res = await cloudinary.uploader.upload(srcUrl, {
          folder: folderPath,
          resource_type: 'image'
        });
        uploadedUrls.push(res.secure_url);
        console.log(`  ✓ [${i + 1}/${urls.length}] ${res.secure_url}`);
      } catch (err) {
        console.error(`  ❌ Failed to upload [${i + 1}]: ${srcUrl} -> ${err.message}`);
      }
    }

    if (uploadedUrls.length > 0) {
      spots[idx].images = uploadedUrls;
      console.log(`  💾 Replaced all images for [${spotName}] with ${uploadedUrls.length} Cloudinary URLs!`);
    }
  }

  fs.writeFileSync(SPOT_FILE, JSON.stringify(spots, null, 2), 'utf8');
  console.log(`\n🎉 ALL SPECIFIED SPOT PHOTOS UPLOADED AND SAVED TO STROLL.JSON!`);
}

uploadUserSpecifiedPhotos();
