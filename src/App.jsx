import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import FeaturedCard from './components/FeaturedCard';
import VenueGrid from './components/VenueGrid';
import VenueModal from './components/VenueModal';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { venuesData } from './data/venues';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [selectedPrice, setSelectedPrice] = useState('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedFeature, setSelectedFeature] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');

  const [visibleCount, setVisibleCount] = useState(12);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('saigon_date_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('saigon_date_favs', JSON.stringify(favoriteIds));
    } catch (err) {
      console.error(err);
    }
  }, [favoriteIds]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const handleToggleFavorite = (id) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Đã xóa khỏi danh sách yêu thích');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Đã thêm vào danh sách yêu thích ❤️');
        return [...prev, id];
      }
    });
  };

  const handleShare = (venue) => {
    if (navigator.share) {
      navigator.share({
        title: `${venue.name} — Sài Gòn Date`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết chia sẻ!');
    }
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedDistrict !== 'Tất cả') count++;
    if (selectedPrice !== 'Tất cả') count++;
    if (selectedCategory !== 'Tất cả') count++;
    if (selectedFeature !== 'Tất cả') count++;
    if (searchTerm.trim() !== '') count++;
    return count;
  }, [selectedDistrict, selectedPrice, selectedCategory, selectedFeature, searchTerm]);

  const handleResetFilters = () => {
    setSelectedDistrict('Tất cả');
    setSelectedPrice('Tất cả');
    setSelectedCategory('Tất cả');
    setSelectedFeature('Tất cả');
    setSearchTerm('');
    setSortBy('default');
    showToast('Đã đặt lại tất cả bộ lọc');
  };

  // Map of Official 19 Districts & 5 Counties to Dataset search keywords
  const districtKeywordMap = useMemo(() => ({
    'Quận 1': ['q1', 'quận 1'],
    'Quận 2': ['q2', 'quận 2', 'thảo điền'],
    'Quận 3': ['q3', 'quận 3'],
    'Quận 4': ['q4', 'quận 4'],
    'Quận 5': ['q5', 'quận 5'],
    'Quận 6': ['q6', 'quận 6'],
    'Quận 7': ['q7', 'quận 7', 'phú mỹ hưng'],
    'Quận 8': ['q8', 'quận 8'],
    'Quận 9': ['q9', 'quận 9'],
    'Quận 10': ['q10', 'quận 10'],
    'Quận 11': ['q11', 'quận 11'],
    'Quận 12': ['q12', 'quận 12'],
    'Quận Bình Thạnh': ['bình thạnh', 'binh thanh'],
    'Quận Gò Vấp': ['gò vấp', 'go vap'],
    'Quận Phú Nhuận': ['phú nhuận', 'phu nhuan'],
    'Quận Tân Bình': ['tân bình', 'tan binh'],
    'Quận Tân Phú': ['tân phú', 'tan phu'],
    'Quận Bình Tân': ['bình tân', 'binh tan'],
    'Quận Thủ Đức': ['thủ đức', 'thu duc'],
    'Huyện Bình Chánh': ['bình chánh', 'binh chanh'],
    'Huyện Cần Giờ': ['cần giờ', 'can gio'],
    'Huyện Củ Chi': ['củ chi', 'cu chi'],
    'Huyện Hóc Môn': ['hóc môn', 'hoc mon'],
    'Huyện Nhà Bè': ['nhà bè', 'nha be']
  }), []);

  // Multi-Criteria Filter Logic over 150 items
  const filteredVenues = useMemo(() => {
    let list = venuesData.filter((v) => {
      // 1. Text Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const nameMatch = v.name?.toLowerCase().includes(query);
        const distMatch = v.district?.toLowerCase().includes(query);
        const groupMatch = v.group?.toLowerCase().includes(query);
        const addrMatch = (v.fullAddress || v.address)?.toLowerCase().includes(query);
        const tagMatch = v.tag?.toLowerCase().includes(query);
        const goodMatch = v.goodReview?.toLowerCase().includes(query);
        const badMatch = v.badReview?.toLowerCase().includes(query);
        const tagListMatch = (v.tags || []).some((t) => t.toLowerCase().includes(query));

        if (!nameMatch && !distMatch && !groupMatch && !addrMatch && !tagMatch && !goodMatch && !badMatch && !tagListMatch) {
          return false;
        }
      }

      // 2. Official 19 Districts & 5 Counties Filter
      if (selectedDistrict !== 'Tất cả') {
        const keywords = districtKeywordMap[selectedDistrict] || [selectedDistrict.toLowerCase()];
        const vDist = (v.district || '').toLowerCase();
        const vGroup = (v.group || '').toLowerCase();
        const vAddr = (v.fullAddress || v.address || '').toLowerCase();

        const isMatch = keywords.some((kw) => vDist.includes(kw) || vGroup.includes(kw) || vAddr.includes(kw));
        if (!isMatch) return false;
      }

      // 3. Category Filter
      if (selectedCategory !== 'Tất cả') {
        const cat = selectedCategory.toLowerCase();
        const vTag = (v.tag || '').toLowerCase();
        const vCat = (v.category || '').toLowerCase();

        if (cat === 'rooftop') {
          if (!vTag.includes('rooftop') && !vCat.includes('rooftop') && !v.name.toLowerCase().includes('rooftop') && !v.name.toLowerCase().includes('skybar')) return false;
        } else if (cat === 'café') {
          if (!vTag.includes('café') && !vTag.includes('cafe') && !vCat.includes('cafe') && !vCat.includes('garden')) return false;
        } else if (cat === 'sân vườn') {
          if (!vTag.includes('sân vườn') && !vCat.includes('garden') && !v.name.toLowerCase().includes('vườn') && !v.name.toLowerCase().includes('sân vườn')) return false;
        } else if (cat === 'nhà hàng') {
          if (!vTag.includes('nhà hàng') && !vCat.includes('restaurant') && !vCat.includes('bistro')) return false;
        } else if (cat === 'bar') {
          if (!vTag.includes('bar') && !vCat.includes('bar') && !vCat.includes('lounge')) return false;
        }
      }

      // 4. Price Range Filter
      if (selectedPrice !== 'Tất cả') {
        const pFrom = v.priceFrom || 80;
        const pTo = v.priceTo || 250;

        if (selectedPrice === 'Dưới 150k' && pFrom >= 150) return false;
        if (selectedPrice === '150k - 350k' && (pFrom > 350 || pTo < 150)) return false;
        if (selectedPrice === '350k - 600k' && (pFrom > 600 || pTo < 350)) return false;
        if (selectedPrice === 'Trên 600k' && pTo < 600 && pFrom < 600) return false;
      }

      // 5. Feature Filter
      if (selectedFeature !== 'Tất cả') {
        if (selectedFeature === 'View đẹp') {
          const hasView = v.viewDep || (v.tags || []).some((t) => t.includes('View'));
          if (!hasView) return false;
        } else if (selectedFeature === 'Riêng tư') {
          const isPrivate = (v.tags || []).some((t) => t.includes('Riêng tư')) || v.desc?.includes('yên tĩnh') || v.desc?.includes('riêng tư');
          if (!isPrivate) return false;
        } else if (selectedFeature === 'Lưu ý thực tế (Has Bad)') {
          if (!v.hasBad) return false;
        }
      }

      return true;
    });

    // Sort list
    if (sortBy === 'rating_desc') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews_desc') {
      list = [...list].sort((a, b) => b.reviews - a.reviews);
    } else if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => b.priceTo - a.priceTo);
    }

    return list;
  }, [searchTerm, selectedDistrict, selectedPrice, selectedCategory, selectedFeature, sortBy, districtKeywordMap]);

  const featuredVenue = useMemo(() => {
    return venuesData.find((v) => v.rating >= 4.8 && v.reviews > 150) || venuesData[0];
  }, []);

  const handleOpenFavoritesOnly = () => {
    if (favoriteIds.length === 0) {
      showToast('Bạn chưa chọn địa điểm yêu thích nào');
      return;
    }
    const favs = venuesData.filter((v) => favoriteIds.includes(v.id));
    if (favs.length > 0) {
      setSelectedVenue(favs[0]);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        favoriteIds={favoriteIds}
        onOpenFavorites={handleOpenFavoritesOnly}
        scrolled={scrolled}
      />

      <Hero totalCount={venuesData.length} />

      <FilterBar
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      <FeaturedCard
        venue={featuredVenue}
        onSelect={setSelectedVenue}
        onShare={handleShare}
      />

      <VenueGrid
        venues={filteredVenues}
        visibleCount={visibleCount}
        onLoadMore={() => setVisibleCount((prev) => prev + 12)}
        favoriteIds={favoriteIds}
        onToggleFavorite={handleToggleFavorite}
        onSelectVenue={setSelectedVenue}
      />

      <CtaSection onAddVenue={() => showToast('Cảm ơn bạn! Tính năng đóng góp sẽ sớm mở cho cộng đồng.')} />

      <Footer />

      {selectedVenue && (
        <VenueModal
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
          isFavorite={favoriteIds.includes(selectedVenue.id)}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
        />
      )}

      <Toast message={toastMessage} />
    </div>
  );
}
