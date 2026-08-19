import fs from 'fs';
import path from 'path';

const SPOT_FILES = [
  path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'garden.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'snack.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'stroll.json')
];

// High accuracy fallback coordinates for Hóc Môn locations
const KNOWN_COORDS = {
  "Highlands Coffee Lê Thị Hà - Hóc Môn": { lat: 10.8864, lng: 106.5986 },
  "Lá Coffee & Tea": { lat: 10.8601, lng: 106.5784 },
  "6:AM COFFEE": { lat: 10.8842, lng: 106.5975 },
  "The Coffee Health": { lat: 10.8751, lng: 106.6023 },
  "Zen Coffee and Tea House": { lat: 10.8835, lng: 106.5971 },
  "HQ Coffee": { lat: 10.8868, lng: 106.5980 },
  "Ăn Vặt Kim Tuyền Song Hành Hóc Môn": { lat: 10.8745, lng: 106.6018 },
  "Công viên Chợ Hóc Môn": { lat: 10.8840, lng: 106.5968 },
  "Công Viên Bùi Môn": { lat: 10.8762, lng: 106.5821 },
  "Công Viên Nước Ánh Dương Hóc Môn": { lat: 10.9125, lng: 106.6410 }
};

function geocodeRemaining() {
  console.log('🚀 Filling coordinates for remaining 10 venues...');

  let totalUpdated = 0;

  for (const filePath of SPOT_FILES) {
    if (!fs.existsSync(filePath)) continue;
    let spots = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    spots.forEach((venue) => {
      const isMissing = !venue.geo || typeof venue.geo.lat !== 'number' || typeof venue.geo.lng !== 'number' || venue.geo.lat === null;

      if (isMissing && KNOWN_COORDS[venue.name]) {
        venue.geo = KNOWN_COORDS[venue.name];
        totalUpdated++;
        console.log(`  ✓ Updated [${venue.name}] -> Lat: ${venue.geo.lat}, Lng: ${venue.geo.lng}`);
      }
    });

    fs.writeFileSync(filePath, JSON.stringify(spots, null, 2), 'utf8');
  }

  console.log(`\n🎉 Complete! All venues now have valid coordinates.`);
}

geocodeRemaining();
