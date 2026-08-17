import React from 'react';
import Dropdown from './Dropdown';
import { RotateCcw, SlidersHorizontal, MapPin, Tag, Banknote, Sparkles, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  selectedDistrict,
  setSelectedDistrict,
  selectedPrice,
  setSelectedPrice,
  selectedCategory,
  setSelectedCategory,
  selectedFeature,
  setSelectedFeature,
  sortBy,
  setSortBy,
  onResetFilters,
  activeFilterCount
}) {
  const districts = [
    'Tất cả',
    'Quận 1',
    'Quận 2',
    'Quận 3',
    'Quận 4',
    'Quận 5',
    'Quận 6',
    'Quận 7',
    'Quận 8',
    'Quận 9',
    'Quận 10',
    'Quận 11',
    'Quận 12',
    'Quận Bình Thạnh',
    'Quận Gò Vấp',
    'Quận Phú Nhuận',
    'Quận Tân Bình',
    'Quận Tân Phú',
    'Quận Bình Tân',
    'Quận Thủ Đức',
    'Huyện Bình Chánh',
    'Huyện Cần Giờ',
    'Huyện Củ Chi',
    'Huyện Hóc Môn',
    'Huyện Nhà Bè'
  ];

  const prices = ['Tất cả', 'Dưới 150k', '150k - 350k', '350k - 600k', 'Trên 600k'];
  const categories = ['Tất cả', 'Rooftop', 'Café', 'Sân vườn', 'Nhà hàng', 'Bar'];
  const features = ['Tất cả', 'View đẹp', 'Riêng tư', 'Lưu ý thực tế (Has Bad)'];

  const sortOptions = [
    { value: 'default', label: 'Nổi bật nhất' },
    { value: 'rating_desc', label: 'Đánh giá cao nhất (★)' },
    { value: 'reviews_desc', label: 'Nhiều review nhất' },
    { value: 'price_asc', label: 'Giá từ thấp đến cao' },
    { value: 'price_desc', label: 'Giá từ cao đến thấp' }
  ];

  const popularDistricts = ['Tất cả', 'Quận 1', 'Quận 3', 'Quận 7', 'Quận Thủ Đức', 'Quận Bình Thạnh', 'Huyện Bình Chánh', 'Huyện Hóc Môn'];

  return (
    <div className="filter-bar">
      <div className="filter-inner">
        {/* Header Row with Title, Active badge, Sort & Reset */}
        <div className="filter-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SlidersHorizontal style={{ width: '20px', height: '20px', color: '#E85D5D' }} />
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Bộ lọc địa điểm</span>
            {activeFilterCount > 0 && (
              <span className="active-filter-badge">
                {activeFilterCount} bộ lọc đang dùng
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Sort Dropdown */}
            <div style={{ minWidth: '200px' }}>
              <Dropdown
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                icon={ArrowUpDown}
                placeholder="Sắp xếp"
              />
            </div>

            {activeFilterCount > 0 && (
              <button onClick={onResetFilters} className="reset-btn">
                <RotateCcw style={{ width: '14px', height: '14px' }} />
                Đặt lại
              </button>
            )}
          </div>
        </div>

        <div className="filter-divider-line"></div>

        {/* Elongated Single Horizontal Row for Filter Dropdowns */}
        <div className="dropdowns-horizontal-row">
          {/* District Dropdown - Extra Wide */}
          <div className="dropdown-col-wide">
            <Dropdown
              label="Quận / Huyện (19 Quận - 5 Huyện)"
              options={districts}
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              icon={MapPin}
              placeholder="Chọn Quận / Huyện"
              enableSearch={true}
            />
          </div>

          {/* Category Dropdown */}
          <div className="dropdown-col">
            <Dropdown
              label="Loại hình"
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              icon={Tag}
              placeholder="Chọn loại hình"
            />
          </div>

          {/* Price Dropdown */}
          <div className="dropdown-col">
            <Dropdown
              label="Mức giá"
              options={prices}
              value={selectedPrice}
              onChange={setSelectedPrice}
              icon={Banknote}
              placeholder="Chọn mức giá"
            />
          </div>

          {/* Feature Dropdown */}
          <div className="dropdown-col">
            <Dropdown
              label="Đặc trưng"
              options={features}
              value={selectedFeature}
              onChange={setSelectedFeature}
              icon={Sparkles}
              placeholder="Chọn đặc trưng"
            />
          </div>
        </div>

        {/* Popular Quick District Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: '.04em' }}>Chọn nhanh:</span>
          {popularDistricts.map((d) => (
            <button
              key={d}
              className={`chip ${selectedDistrict === d ? 'active' : ''}`}
              onClick={() => setSelectedDistrict(d)}
              style={{ padding: '5px 12px', fontSize: '12px' }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
