import fs from 'fs';
import path from 'path';

// Read API Key from .env
function getApiKey() {
  if (!fs.existsSync('.env')) return null;
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    if (line.startsWith('FOURSQUARE_API_KEY=') || line.startsWith('VITE_FOURSQUARE_API_KEY=')) {
      const val = line.split('=')[1]?.trim();
      if (val && val !== 'your_foursquare_api_key_here') return val;
    }
  }
  return null;
}

const apiKey = getApiKey();

if (!apiKey) {
  console.error('❌ Chưa tìm thấy FOURSQUARE_API_KEY hợp lệ trong file .env');
  process.exit(1);
}

const authHeader = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
const cafeFilePath = path.join('src', 'data', 'spots', 'cafe.json');
const cafes = JSON.parse(fs.readFileSync(cafeFilePath, 'utf8'));

console.log(`🚀 Bắt đầu quét & đồng bộ dữ liệu Foursquare Places cho ${cafes.length} quán Café Sài Gòn...`);

async function fetchFoursquareVenue(venue) {
  try {
    const searchUrl = `https://places-api.foursquare.com/places/search?query=${encodeURIComponent(venue.name)}&near=Ho%20Chi%20Minh%20City&limit=1`;
    const res = await fetch(searchUrl, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'X-Places-Api-Version': '2025-06-17'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`⚠️ Lỗi API Foursquare [${venue.name}]: Status ${res.status} - ${errText}`);
      return null;
    }

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      console.log(`ℹ️ Không tìm thấy địa điểm trên Foursquare: "${venue.name}"`);
      return null;
    }

    const item = data.results[0];
    return {
      fsqId: item.fsq_place_id,
      fullAddress: item.location?.formatted_address || venue.fullAddress,
      address: item.location?.address || venue.address,
      tel: item.tel || venue.phone,
      lat: item.latitude,
      lng: item.longitude
    };
  } catch (err) {
    console.error(`❌ Lỗi kết nối cho [${venue.name}]:`, err.message);
    return null;
  }
}

async function runEnrichment() {
  let updatedCount = 0;

  for (let i = 0; i < cafes.length; i++) {
    const venue = cafes[i];
    console.log(`[${i + 1}/${cafes.length}] Đang truy vấn Foursquare: "${venue.name}"...`);

    const enriched = await fetchFoursquareVenue(venue);
    if (enriched) {
      if (enriched.fullAddress) venue.fullAddress = enriched.fullAddress;
      if (enriched.address) venue.address = enriched.address;
      if (enriched.tel) venue.phone = enriched.tel;
      if (enriched.lat && enriched.lng) {
        venue.geo = { lat: enriched.lat, lng: enriched.lng };
      }
      venue.fsqId = enriched.fsqId;
      updatedCount++;
      console.log(`  ✅ Đã đồng bộ địa chỉ & sđt chuẩn cho "${venue.name}": ${enriched.address || enriched.fullAddress}`);
    }

    // Delay 200ms to avoid rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  // Save updated dataset
  fs.writeFileSync(cafeFilePath, JSON.stringify(cafes, null, 2), 'utf8');

  console.log(`\n🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG DỮ LIỆU FOURSQUARE!`);
  console.log(`- Đã cập nhật ${updatedCount}/${cafes.length} quán Café`);
}

runEnrichment();
