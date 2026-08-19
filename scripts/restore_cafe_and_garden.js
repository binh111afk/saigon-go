import fs from 'fs';
import path from 'path';

const CAFE_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json');
const GARDEN_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'garden.json');

const cafeList = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));
const gardenList = JSON.parse(fs.readFileSync(GARDEN_FILE, 'utf8'));

// 16 cafes belonging in cafe.json
const cafeNames = [
  'hadi',
  't & h coffee',
  'highlands coffee lê thị hà',
  'the coffee house - nguyễn ảnh thủ',
  'phúc long - lê thị hà',
  'highlands coffee phan văn hớn',
  'highlands coffee 1800 nguyễn ảnh thủ',
  'weone coffee',
  'see:mê coffee',
  'lá coffee & tea',
  "coc's coffee & tea",
  'moss&muse',
  'huno coffee house & bizstation',
  'hoàng coffee',
  'cocobean cà phê + trà',
  '6:am coffee'
];

// 18 garden venues belonging in garden.json
const gardenNames = [
  'the coffee health',
  'cà phê kem hp',
  'cafe koc hoc mon',
  'cafe không gian việt',
  'vườncủagió',
  'the bis coffee',
  'coffee 2k5',
  'guta cafe hóc môn',
  'key coffee - hóc môn',
  'xcoffee hoocmon',
  'zen coffee and tea house',
  'cafe xưa và nay',
  'cafe tri kỷ',
  'quán cà phê quốc việt',
  'cafe 24h',
  'hq coffee',
  'sapa coffee 24h - bà triệu',
  'cà phê tình bằng hữu'
];

const allSpots = [...cafeList, ...gardenList];
const uniqueMap = new Map();
for (const spot of allSpots) {
  if (!uniqueMap.has(spot.name.toLowerCase())) {
    uniqueMap.set(spot.name.toLowerCase(), spot);
  }
}

const restoredCafes = [];
const restoredGardens = [];

for (const spot of uniqueMap.values()) {
  const norm = spot.name.toLowerCase();
  const isCafe = cafeNames.some(cn => norm.includes(cn) || cn.includes(norm));
  const isGarden = gardenNames.some(gn => norm.includes(gn) || gn.includes(norm));

  if (isCafe) {
    spot.category = 'cafe';
    spot.tag = 'Café';
    spot.tagClass = 'tag-cafe';
    restoredCafes.push(spot);
  } else if (isGarden) {
    spot.category = 'garden';
    spot.tag = 'Sân Vườn';
    spot.tagClass = 'tag-garden';
    restoredGardens.push(spot);
  }
}

// Order according to list & re-index IDs
restoredCafes.forEach((c, idx) => c.id = idx + 1);
restoredGardens.forEach((g, idx) => g.id = idx + 1);

fs.writeFileSync(CAFE_FILE, JSON.stringify(restoredCafes, null, 2), 'utf8');
fs.writeFileSync(GARDEN_FILE, JSON.stringify(restoredGardens, null, 2), 'utf8');

console.log(`🎉 RESTORED!`);
console.log(`☕ cafe.json: ${restoredCafes.length} quán`);
console.log(`🏡 garden.json: ${restoredGardens.length} quán`);
