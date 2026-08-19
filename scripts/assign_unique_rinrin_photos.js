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

// High quality Japanese Koi Park & Bonsai Stone Garden photos for Rin Rin Park
const RINRIN_SOURCE_IMAGES = [
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80'
];

async function updateRinRinPhotos() {
  console.log('🚀 Uploading unique Japanese Koi & Bonsai Garden photos for Rin Rin Park to Cloudinary...');

  const uploadedUrls = [];
  const folderPath = 'địa điểm/đi dạo/Rin Rin Park';

  for (let i = 0; i < RINRIN_SOURCE_IMAGES.length; i++) {
    try {
      const res = await cloudinary.uploader.upload(RINRIN_SOURCE_IMAGES[i], {
        folder: folderPath,
        resource_type: 'image'
      });
      uploadedUrls.push(res.secure_url);
      console.log(`  ✓ [${i + 1}/${RINRIN_SOURCE_IMAGES.length}] Uploaded: ${res.secure_url}`);
    } catch (err) {
      console.error(`  ❌ Upload error:`, err.message);
    }
  }

  if (uploadedUrls.length > 0) {
    let spots = JSON.parse(fs.readFileSync(SPOT_FILE, 'utf8'));
    const idx = spots.findIndex((s) => s.id === 2 || s.name.includes('Rin Rin'));
    if (idx !== -1) {
      spots[idx].images = uploadedUrls;
      fs.writeFileSync(SPOT_FILE, JSON.stringify(spots, null, 2), 'utf8');
      console.log(`🎉 Successfully updated Rin Rin Park in stroll.json with ${uploadedUrls.length} unique photos!`);
    }
  }
}

updateRinRinPhotos();
