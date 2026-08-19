import React, { useState } from 'react';
import { Clock, Banknote, Star, MapPin, Share2, Heart, ChevronLeft, ChevronRight, Layers, Sparkles, ExternalLink } from 'lucide-react';

function formatPriceDisplay(priceStr) {
  if (!priceStr) return '80k–250k/người';
  let clean = priceStr.replace(/\/người/g, '').trim();

  const parseNum = (valStr) => {
    let numVal = parseInt(valStr.replace(/[^\d]/g, ''), 10);
    if (isNaN(numVal)) return valStr.trim();
    if (numVal >= 1000000) {
      let millions = numVal / 1000000;
      let formatted = Number.isInteger(millions) ? millions : parseFloat(millions.toFixed(1));
      return `${formatted}tr`;
    }
    if (numVal >= 1000) {
      let thousands = numVal / 1000;
      let formatted = Number.isInteger(thousands) ? thousands : parseFloat(thousands.toFixed(1));
      return `${formatted}k`;
    }
    return `${numVal}`;
  };

  if (clean.includes('-') || clean.includes('–')) {
    const parts = clean.split(/[-–]/);
    if (parts.length === 2) {
      const left = parseNum(parts[0]);
      const right = parseNum(parts[1]);
      return `${left} – ${right}/người`;
    }
  }

  if (/\d{4,}/.test(clean)) {
    return `${parseNum(clean)}/người`;
  }

  return `${clean}/người`;
}

function getTagClass(venue) {
  if (venue.tagClass && venue.tagClass !== 'tag-cafe') return venue.tagClass;
  const cat = (venue.category || '').toLowerCase();
  const tag = (venue.tag || '').toLowerCase();
  if (cat === 'garden' || tag.includes('sân vườn')) return 'tag-garden';
  if (cat === 'snack' || tag.includes('ăn vặt')) return 'tag-snack';
  if (cat === 'food' || cat === 'restaurant' || tag.includes('ẩm thực') || tag.includes('nhà hàng')) return 'tag-food';
  if (cat === 'entertainment' || tag.includes('giải trí')) return 'tag-entertainment';
  if (cat === 'stroll' || tag.includes('đi dạo') || tag.includes('công viên')) return 'tag-stroll';
  if (cat === 'bar' || tag.includes('bar')) return 'tag-bar';
  if (cat === 'rooftop' || tag.includes('rooftop')) return 'tag-rooftop';
  return venue.tagClass || 'tag-cafe';
}

export default function FeaturedCard({ venue, isFavorite, onToggleFavorite, onSelect, onShare }) {
  if (!venue) return null;

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const tagClass = getTagClass(venue);

  const images = venue.images && venue.images.length > 0 ? venue.images : [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80'
  ];

  const fullRating = Math.floor(venue.rating || 4);
  const formattedPrice = formatPriceDisplay(venue.price);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const mapLink = venue.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(venue.fullAddress || venue.name)}`;

  return (
    <section className="section" id="featured">
      <div className="section-head">
        <div>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles style={{ width: '20px', height: '20px', color: '#E85D5D' }} />
            Đáng chú ý
          </div>
          <div className="section-subtitle">Địa điểm được đề xuất hàng đầu dành cho bạn</div>
        </div>
      </div>

      <div className="featured-card">
        {/* Left Side: Image Gallery Carousel */}
        <div style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => onSelect(venue)}>
          <img
            src={images[currentImgIndex]}
            className="featured-img"
            alt={venue.name}
            referrerPolicy="no-referrer"
          />
          <div className="venue-img-overlay"></div>

          {/* Top Badges */}
          <div className="card-top-left">
            <span className={`venue-tag ${tagClass}`}>{venue.tag || 'Café'}</span>
            {images.length > 1 && (
              <span className="card-img-count-badge">
                <Layers style={{ width: '11px', height: '11px' }} />
                {currentImgIndex + 1} / {images.length}
              </span>
            )}
          </div>

          {/* Heart Favorite Button */}
          <div
            className={`venue-fav ${isFavorite ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(venue.id);
            }}
            title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart style={{ width: '18px', height: '18px', fill: isFavorite ? '#fff' : 'none' }} />
          </div>

          {/* Carousel Arrows */}
          {images.length > 1 && (
            <>
              <button className="card-carousel-arrow left" onClick={handlePrevImage} title="Ảnh trước">
                <ChevronLeft style={{ width: '18px', height: '18px' }} />
              </button>
              <button className="card-carousel-arrow right" onClick={handleNextImage} title="Ảnh sau">
                <ChevronRight style={{ width: '18px', height: '18px' }} />
              </button>
              <div className="card-carousel-dots">
                {images.slice(0, 8).map((_, idx) => (
                  <span
                    key={idx}
                    className={`card-dot ${currentImgIndex === idx ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImgIndex(idx);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Venue Details */}
        <div className="featured-body">
          <div className="featured-label">★ Đề xuất hàng đầu</div>

          <h2 className="featured-name" style={{ cursor: 'pointer' }} onClick={() => onSelect(venue)}>
            {venue.name}
          </h2>

          <p className="featured-address">
            <MapPin style={{ width: '14px', height: '14px', color: '#E85D5D', flexShrink: 0, display: 'inline-block', marginRight: '4px' }} />
            {venue.fullAddress || venue.address}
          </p>

          <p className="featured-desc">{venue.desc || venue.goodReview}</p>

          {/* Quick Action Chips / Highlights */}
          {((venue.quickActions && venue.quickActions.length > 0) || (venue.tags && venue.tags.length > 0)) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0' }}>
              {(venue.quickActions || venue.tags || []).slice(0, 4).map((action, i) => (
                <span key={i} className="chip active" style={{ fontSize: '11px', padding: '4px 10px', pointerEvents: 'none' }}>
                  ✓ {action}
                </span>
              ))}
            </div>
          )}

          {/* Info Row */}
          <div className="info-row" style={{ marginTop: '14px', marginBottom: '20px' }}>
            {venue.hours && (
              <div className="info-item">
                <Clock style={{ width: '15px', height: '15px', color: '#E85D5D' }} />
                {venue.hours}
              </div>
            )}
            <div className="info-item">
              <Banknote style={{ width: '15px', height: '15px', color: '#E85D5D' }} />
              {formattedPrice}
            </div>
            <div className="info-item">
              <Star style={{ width: '15px', height: '15px', color: '#E85D5D', fill: '#E85D5D' }} />
              {venue.rating} ({venue.reviews} đánh giá)
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: 'auto' }}>
            <button className="btn-primary" onClick={() => onSelect(venue)}>
              <ExternalLink style={{ width: '16px', height: '16px' }} />
              Xem chi tiết
            </button>
            <button className="btn-outline" onClick={() => window.open(mapLink, '_blank')}>
              <MapPin style={{ width: '16px', height: '16px' }} />
              Xem Google Maps
            </button>
            <button className="btn-outline" onClick={() => onShare(venue)} title="Chia sẻ">
              <Share2 style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
