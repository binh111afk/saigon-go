import cafe from './spots/cafe.json';
import garden from './spots/garden.json';
import snack from './spots/snack.json';
import food from './spots/food.json';
import entertainment from './spots/entertainment.json';
import stroll from './spots/stroll.json';

// Combine all JSON category files into a single unified dataset
export const venuesData = [
  ...cafe,
  ...garden,
  ...snack,
  ...food,
  ...entertainment,
  ...stroll
].sort((a, b) => a.id - b.id);
