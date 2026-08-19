import fs from 'fs';
import path from 'path';

const SPOT_FILES = [
  path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'garden.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'entertainment.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'snack.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'food.json'),
  path.join(process.cwd(), 'src', 'data', 'spots', 'stroll.json')
];

function extractGeoFromUrl(url) {
  if (!url) return null;

  // Pattern 1: !3d10.8653788!4d106.6139075
  const match3d4d = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (match3d4d) {
    return {
      lat: parseFloat(match3d4d[1]),
      lng: parseFloat(match3d4d[2])
    };
  }

  // Pattern 2: @10.8653788,106.6113326
  const matchAt = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (matchAt) {
    return {
      lat: parseFloat(matchAt[1]),
      lng: parseFloat(matchAt[2])
    };
  }

  return null;
}

function processAllFiles() {
  console.log('🚀 Extracted Geo Coordinates Parser from Google Maps URLs...');

  let totalSpots = 0;
  let updatedGeo = 0;

  for (const filePath of SPOT_FILES) {
    if (!fs.existsSync(filePath)) continue;
    const fileBasename = path.basename(filePath);
    let spots = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    spots.forEach((venue) => {
      totalSpots++;
      const existingValid = venue.geo && typeof venue.geo.lat === 'number' && typeof venue.geo.lng === 'number';

      if (!existingValid && venue.mapUrl) {
        const geo = extractGeoFromUrl(venue.mapUrl);
        if (geo) {
          venue.geo = geo;
          updatedGeo++;
          console.log(`  ✓ [${fileBasename}] ${venue.name} -> Lat: ${geo.lat}, Lng: ${geo.lng}`);
        }
      }
    });

    fs.writeFileSync(filePath, JSON.stringify(spots, null, 2), 'utf8');
  }

  console.log(`\n🎉 Extracted coordinates for ${updatedGeo} venues out of ${totalSpots} total spots!`);
}

processAllFiles();
