import React from 'react';
import { Clock, Banknote, Star, MapPin, Share2 } from 'lucide-react';

export default function FeaturedCard({ venue, onSelect, onShare }) {
  if (!venue) return null;

  const rawPrice = (venue.price || '221k–336k').replace(/\/người/g, '').trim();
  const formattedPrice = `${rawPrice}/người`;

  return (
    <section className="section" id="featured">
      <div className="section-head">
        <div>
          <div className="section-title">Đáng chú ý</div>
          <div className="section-subtitle">Địa điểm được đề xuất hàng đầu tuần này</div>
        </div>
      </div>
      <div className="featured-card">
        <div style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => onSelect(venue)}>
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
            className="featured-img"
            alt={venue.name}
          />
        </div>
        <div className="featured-body">
          <div className="featured-label">★ Đề xuất hôm nay</div>
          <h2 className="featured-name" style={{ cursor: 'pointer' }} onClick={() => onSelect(venue)}>
            {venue.name}
          </h2>
          <p className="featured-address">📍 {venue.fullAddress || venue.address}</p>
          <p className="featured-desc">{venue.desc}</p>
          <div className="info-row">
            <div className="info-item">
              <Clock style={{ width: '15px', height: '15px', color: '#E85D5D' }} />
              {venue.hours}
            </div>
            <div className="info-item">
              <Banknote style={{ width: '15px', height: '15px', color: '#E85D5D' }} />
              {formattedPrice}
            </div>
            <div className="info-item">
              <Star style={{ width: '15px', height: '15px', color: '#E85D5D', fill: '#E85D5D' }} />
              {venue.rating} ({venue.reviews} đánh giá)
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(venue.fullAddress || venue.name)}`, '_blank')}
            >
              <MapPin style={{ width: '16px', height: '16px' }} />
              Xem trên Maps
            </button>
            <button className="btn-outline" onClick={() => onShare(venue)}>
              <Share2 style={{ width: '16px', height: '16px' }} />
              Chia sẻ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
