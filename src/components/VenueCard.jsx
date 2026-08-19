import React, { useState } from 'react';
import { Heart, MapPin, Clock, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

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

export default function VenueCard({ venue, isFavorite, onToggleFavorite, onClick }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const tagClass = getTagClass(venue);
  const images = venue.images && venue.images.length > 0 ? venue.images : [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80'
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

  return (
    <div className="venue-card" onClick={() => onClick(venue)}>
      <div className="venue-img-wrap">
        <img
          src={images[currentImgIndex]}
          className="venue-img"
          alt={venue.name}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="venue-img-overlay"></div>

        {/* Top Left Badges: Tag & Image Counter */}
        <div className="card-top-left">
          <span className={`venue-tag ${tagClass}`}>{venue.tag || 'Café'}</span>
          {images.length > 1 && (
            <span className="card-img-count-badge">
              <Layers style={{ width: '11px', height: '11px' }} />
              {currentImgIndex + 1} / {images.length}
            </span>
          )}
        </div>

        <div
          className={`venue-fav ${isFavorite ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(venue.id);
          }}
          title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart style={{ width: '16px', height: '16px', fill: isFavorite ? '#fff' : 'none' }} />
        </div>

        {/* Carousel Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="card-carousel-arrow left"
              onClick={handlePrevImage}
              title="Ảnh trước"
            >
              <ChevronLeft style={{ width: '16px', height: '16px' }} />
            </button>

            <button
              className="card-carousel-arrow right"
              onClick={handleNextImage}
              title="Ảnh sau"
            >
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>

            {/* Dots Indicator (capped at max 6 dots visually for high count) */}
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

        <span className="venue-price-badge">{formattedPrice}</span>
      </div>

      <div className="venue-body">
        <h3 className="venue-name">{venue.name}</h3>
        <div className="venue-address">
          <MapPin style={{ width: '13px', height: '13px', flexShrink: 0, color: '#E85D5D' }} />
          {venue.address}
        </div>
        <div className="venue-meta">
          <div className="venue-rating">
            <div className="stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={`star ${i < fullRating ? '' : 'empty'}`}>★</span>
              ))}
            </div>
            <span className="rating-num">{venue.rating}</span>
            <span className="review-count">({venue.reviews})</span>
          </div>
          <div className="venue-hours">
            <Clock style={{ width: '12px', height: '12px' }} />
            {venue.hours}
          </div>
        </div>
      </div>
    </div>
  );
}
