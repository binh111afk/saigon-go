import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Star, Clock, Banknote, Phone, MapPin, Share2, Info, Utensils, Image as ImageIcon, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function VenueModal({ venue, onClose, isFavorite, onToggleFavorite, onShare }) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const thumbsRef = useRef(null);

  const images = venue?.images && venue.images.length > 0 ? venue.images : [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1000&q=80'
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, images.length]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbsRef.current) {
      const activeEl = thumbsRef.current.children[activeImgIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeImgIndex]);

  if (!venue) return null;

  const fullRating = Math.floor(venue.rating || 4);

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Hero Image */}
        <div className="modal-hero">
          <img src={images[activeImgIndex]} className="modal-hero-img" alt={venue.name} />
          <div className="modal-hero-overlay"></div>

          {/* Image Counter Badge */}
          {images.length > 1 && (
            <div className="modal-img-count-badge">
              <Layers style={{ width: '13px', height: '13px' }} />
              {activeImgIndex + 1} / {images.length} ảnh
            </div>
          )}

          {/* Close & Favorite */}
          <button className="modal-close" onClick={onClose} title="Đóng (ESC)">
            <X style={{ width: '20px', height: '20px' }} />
          </button>

          <button
            className={`modal-fav-btn ${isFavorite ? 'liked' : ''}`}
            onClick={() => onToggleFavorite(venue.id)}
            title="Yêu thích"
          >
            <Heart style={{ width: '18px', height: '18px', fill: isFavorite ? '#fff' : 'none' }} />
          </button>

          {/* Modal Carousel Arrow Navigation */}
          {images.length > 1 && (
            <>
              <button className="modal-carousel-arrow left" onClick={handlePrevImage} title="Ảnh trước (←)">
                <ChevronLeft style={{ width: '20px', height: '20px' }} />
              </button>

              <button className="modal-carousel-arrow right" onClick={handleNextImage} title="Ảnh sau (→)">
                <ChevronRight style={{ width: '20px', height: '20px' }} />
              </button>
            </>
          )}

          {/* Quick Action Badges */}
          <div className="modal-quick-actions">
            {(venue.quickActions || ['Ảnh món nổi bật', 'Góc riêng tư']).map((qa, i) => (
              <button key={i} className="modal-qa-btn">
                <ImageIcon style={{ width: '14px', height: '14px' }} />
                {qa}
              </button>
            ))}
          </div>

          {/* Scrollable Thumbnails Bar */}
          <div className="modal-thumbs" ref={thumbsRef}>
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`modal-thumb ${activeImgIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImgIndex(idx)}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <h2 className="modal-venue-name">{venue.name}</h2>
          <div className="modal-venue-address">
            <MapPin style={{ width: '14px', height: '14px', color: '#E85D5D', flexShrink: 0 }} />
            {venue.fullAddress || venue.address}
          </div>

          {/* Info Grid Cards */}
          <div className="modal-info-grid">
            <div className="modal-info-card">
              <Star className="ic" style={{ fill: '#E85D5D' }} />
              <div className="val">{venue.rating}</div>
              <div className="lbl">{venue.reviews} đánh giá</div>
            </div>
            <div className="modal-info-card">
              <Clock className="ic" />
              <div className="val">{venue.hours.split('–')[0].trim()}</div>
              <div className="lbl">Mở cửa • {venue.hours}</div>
            </div>
            <div className="modal-info-card">
              <Banknote className="ic" />
              <div className="val">{venue.priceFrom || 80}k</div>
              <div className="lbl">Từ {venue.priceFrom || 80}k – {venue.priceTo || 250}k/người</div>
            </div>
            <div className="modal-info-card">
              <Phone className="ic" />
              <div className="val" style={{ fontSize: '13px' }}>{venue.phone || 'Chưa cập nhật'}</div>
              <div className="lbl">Liên hệ trực tiếp</div>
            </div>
          </div>

          {/* Modal Tabs */}
          <div className="modal-tabs">
            <button className={`modal-tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>
              Tổng quan
            </button>
            <button className={`modal-tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
              Đánh giá ({venue.reviewList?.length || 2})
            </button>
            <button className={`modal-tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
              Menu nổi bật
            </button>
          </div>

          {/* Tab Content 0: Overview */}
          {activeTab === 0 && (
            <div>
              <p style={{ fontSize: '14px', color: '#6b6b6b', lineHeight: '1.7', marginBottom: '20px' }}>
                {venue.desc}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ padding: '6px 14px', borderRadius: '8px', background: '#FDF8F3', fontSize: '12px', fontWeight: '500', color: '#E85D5D' }}>
                  {venue.tag}
                </span>
                <span style={{ padding: '6px 14px', borderRadius: '8px', background: '#FDF8F3', fontSize: '12px', fontWeight: '500', color: '#6b6b6b' }}>
                  Hẹn hò lãng mạn
                </span>
                <span style={{ padding: '6px 14px', borderRadius: '8px', background: '#FDF8F3', fontSize: '12px', fontWeight: '500', color: '#6b6b6b' }}>
                  Khu vực {venue.district}
                </span>
              </div>

              {venue.goodReview && (
                <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(80, 140, 100, 0.08)', borderLeft: '4px solid #508C64', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#508C64', marginBottom: '4px' }}>👍 Ưu điểm nổi bật:</div>
                  <div style={{ fontSize: '13px', color: '#2d5a3c' }}>{venue.goodReview}</div>
                </div>
              )}

              {venue.badReview && (
                <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(232, 93, 93, 0.08)', borderLeft: '4px solid #E85D5D', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#E85D5D', marginBottom: '4px' }}>⚠️ Lưu ý từ khách cũ:</div>
                  <div style={{ fontSize: '13px', color: '#8a2b2b' }}>{venue.badReview}</div>
                </div>
              )}

              <div style={{ padding: '16px', borderRadius: '14px', background: '#f9f5f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                  <Info style={{ width: '18px', height: '18px', color: '#E85D5D' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.5' }}>
                  Thông tin được tổng hợp & xác minh từ Google Maps. Giá và giờ mở cửa có thể thay đổi — vui lòng liên hệ trực tiếp quán trước khi đến.
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 1: Reviews */}
          {activeTab === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', borderRadius: '14px', background: '#FDF8F3' }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a1a', fontFamily: 'Playfair Display, serif' }}>
                  {venue.rating}
                </div>
                <div>
                  <div className="stars" style={{ marginBottom: '4px' }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className={`star ${i < fullRating ? '' : 'empty'}`}>★</span>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{venue.reviews} đánh giá từ thực khách</div>
                </div>
              </div>

              {(venue.reviewList || []).map((r, i) => (
                <div className="review-item" key={i}>
                  <div className="reviewer">
                    <div className="reviewer-avatar">
                      {r.name ? r.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className="reviewer-name">{r.name}</div>
                      <div className="reviewer-date">{r.date || 'Gần đây'}</div>
                    </div>
                  </div>
                  <div className="review-stars">
                    {[0, 1, 2, 3, 4].map((starIdx) => (
                      <span key={starIdx} className={`star ${starIdx < (r.r || 5) ? '' : 'empty'}`} style={{ fontSize: '12px' }}>★</span>
                    ))}
                  </div>
                  <div className="review-text">{r.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 2: Menu */}
          {activeTab === 2 && (
            <div>
              {(venue.menu || []).map((m, i) => (
                <div className="menu-category" key={i}>
                  <div className="menu-category-title">
                    <Utensils style={{ width: '16px', height: '16px', color: '#E85D5D' }} />
                    {m.cat}
                  </div>
                  {(m.items || []).map((item, j) => (
                    <div className="menu-item" key={j}>
                      <span className="menu-item-name">{item.n}</span>
                      <span className="menu-item-price">{item.p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="modal-actions">
          <button
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(venue.fullAddress || venue.name)}`, '_blank')}
          >
            <MapPin style={{ width: '16px', height: '16px' }} />
            Mở Google Maps
          </button>
          <button className="btn-outline" style={{ flexShrink: 0 }} onClick={() => onShare(venue)} title="Chia sẻ">
            <Share2 style={{ width: '16px', height: '16px' }} />
          </button>
          <button
            className="btn-outline"
            style={{ flexShrink: 0 }}
            onClick={() => {
              if (venue.phone) window.open('tel:' + venue.phone);
            }}
            title="Gọi điện"
          >
            <Phone style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
