import fs from 'fs';
import path from 'path';

const spotsToDelete = [
  "Cà Phê Kem HP",
  "Cafe Koc Hoc Mon",
  "Mango House & Coffee",
  "Quán Vị Ngọt",
  "Khu vui chơi nông trại Sunshine Farm",
  "Công Viên Bùi Môn",
  "Bánh Kem YOUME",
  "TITIFARM - Nông Trại Giáo Dục & Trải Nghiệm",
  "MonParty",
  "Cháo Bầu Sáu Quẻn",
  "SAPA COFFEE 24H - Bà Triệu",
  "Đường Đồng Khởi",
  "Heritage Indochine"
];

const categories = ['cafe', 'garden', 'snack', 'food', 'restaurant', 'entertainment', 'stroll'];

console.log('🗑️ BẮT ĐẦU XÓA 13 ĐỊA ĐIỂM THEO YÊU CẦU NGUYÊN BẢN...');

const deleteSet = new Set(spotsToDelete.map(s => s.toLowerCase().trim()));

categories.forEach(cat => {
  const filePath = path.join(process.cwd(), 'src', 'data', 'spots', `${cat}.json`);
  if (!fs.existsSync(filePath)) return;

  let spots = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const originalLength = spots.length;

  const filtered = spots.filter(spot => {
    const spotNameLower = spot.name.toLowerCase().trim();
    // Check if match
    return !deleteSet.has(spotNameLower);
  });

  const removedCount = originalLength - filtered.length;

  if (removedCount > 0) {
    // Re-index IDs
    filtered.forEach((s, idx) => {
      s.id = idx + 1;
    });
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf8');
    console.log(`✅ Đã xóa ${removedCount} địa điểm khỏi ${cat}.json (Còn lại: ${filtered.length} địa điểm).`);
  }
});

console.log('🎉 THÀNH CÔNG! Đã xóa sạch 13 địa điểm và đánh lại ID liên tục.');
