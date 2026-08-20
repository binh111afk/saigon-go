import fs from 'fs';
import path from 'path';

const categories = ['cafe', 'garden', 'snack', 'food', 'restaurant', 'entertainment', 'stroll'];

categories.forEach(cat => {
  const filePath = path.join(process.cwd(), 'src', 'data', 'spots', `${cat}.json`);
  if (fs.existsSync(filePath)) {
    const spots = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`${cat}.json: ${spots.length} items (last ID: ${spots[spots.length - 1]?.id})`);
    spots.forEach(s => console.log(`  - [ID ${s.id}] ${s.name} (${s.district || s.group})`));
  }
});
