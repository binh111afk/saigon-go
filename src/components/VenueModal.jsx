import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Star, Clock, Banknote, Phone, MapPin, Share2, Info, Utensils, Image as ImageIcon, ChevronLeft, ChevronRight, Layers, ZoomIn, ZoomOut, RotateCcw, Car, CalendarCheck, Shirt, Wine, Sparkles, Sun } from 'lucide-react';

function getQuickActionIcon(qaText) {
  if (!qaText) return <Sparkles style={{ width: '14px', height: '14px' }} />;
  const lower = qaText.toLowerCase();
  if (lower.includes('bãi xe') || lower.includes('đỗ xe') || lower.includes('giữ xe') || lower.includes('ô tô') || lower.includes('xe máy')) {
    return <Car style={{ width: '14px', height: '14px' }} />;
  }
  if (lower.includes('đặt bàn') || lower.includes('đặt chỗ') || lower.includes('book') || lower.includes('lưu ý')) {
    return <CalendarCheck style={{ width: '14px', height: '14px' }} />;
  }
  if (lower.includes('trang phục') || lower.includes('dress') || lower.includes('casual') || lower.includes('áo')) {
    return <Shirt style={{ width: '14px', height: '14px' }} />;
  }
  if (lower.includes('rượu') || lower.includes('phòng riêng') || lower.includes('bar') || lower.includes('vip')) {
    return <Wine style={{ width: '14px', height: '14px' }} />;
  }
  if (lower.includes('view') || lower.includes('ban công') || lower.includes('sân vườn') || lower.includes('ngoài trời') || lower.includes('hoàng hôn')) {
    return <Sun style={{ width: '14px', height: '14px' }} />;
  }
  if (lower.includes('món') || lower.includes('ăn') || lower.includes('thực đơn') || lower.includes('menu')) {
    return <Utensils style={{ width: '14px', height: '14px' }} />;
  }
  return <Sparkles style={{ width: '14px', height: '14px' }} />;
}

function formatPriceDisplay(priceStr) {
  if (!priceStr) return '80k–250k';
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
      return `${left} – ${right}`;
    }
  }

  if (/\d{4,}/.test(clean)) {
    return parseNum(clean);
  }

  return clean;
}

function formatModalHours(hoursStr) {
  if (!hoursStr) return { val: '10:00 - 22:00', lbl: 'Giờ mở cửa hàng ngày' };
  if (hoursStr.includes('|')) {
    return {
      val: 'Phục vụ Trưa & Tối',
      lbl: hoursStr.replace(/\s*\|\s*/g, ' • ')
    };
  }
  return {
    val: hoursStr,
    lbl: 'Giờ mở cửa hàng ngày'
  };
}

export default function VenueModal({ venue, onClose, isFavorite, onToggleFavorite, onShare }) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const thumbsRef = useRef(null);

  // Drag to scroll state for Quick Action badges
  const qaRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!qaRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - qaRef.current.offsetLeft);
    setScrollLeft(qaRef.current.scrollLeft);
  };
  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };
  const handleMouseMove = (e) => {
    if (!isMouseDown || !qaRef.current) return;
    e.preventDefault();
    const x = e.pageX - qaRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    qaRef.current.scrollLeft = scrollLeft - walk;
  };

  const images = venue?.images && venue.images.length > 0 ? venue.images : [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1000&q=80'
  ];

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Reset zoom scale whenever image index changes or lightbox toggles
  useEffect(() => {
    setZoomScale(1);
  }, [activeImgIndex, isZoomed]);

  const handleZoomIn = (e) => {
    e?.stopPropagation();
    setZoomScale((prev) => Math.min(3, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation();
    setZoomScale((prev) => Math.max(0.5, +(prev - 0.25).toFixed(2)));
  };

  const handleResetZoom = (e) => {
    e?.stopPropagation();
    setZoomScale(1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
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
  }, [onClose, isZoomed, images.length]);

  // Sliding window state for showing max 3 thumbnails
  const [thumbStartIndex, setThumbStartIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 3) {
      setThumbStartIndex(0);
      return;
    }
    setThumbStartIndex((prevStart) => {
      let newStart = prevStart;
      if (activeImgIndex > prevStart + 2) {
        newStart = activeImgIndex - 2;
      } else if (activeImgIndex < prevStart) {
        newStart = activeImgIndex;
      }
      return Math.max(0, Math.min(newStart, images.length - 3));
    });
  }, [activeImgIndex, images.length]);

  const visibleThumbs = images.slice(thumbStartIndex, thumbStartIndex + 3);

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
          <img
            src={images[activeImgIndex]}
            className="modal-hero-img"
            alt={venue.name}
            onClick={() => setIsZoomed(true)}
            title="Bấm để phóng to hình ảnh"
            referrerPolicy="no-referrer"
          />
          <div className="modal-hero-overlay" onClick={() => setIsZoomed(true)}></div>

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
          {venue.quickActions && venue.quickActions.length > 0 && (
            <div
              className="modal-quick-actions"
              ref={qaRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeaveOrUp}
              onMouseUp={handleMouseLeaveOrUp}
              onMouseMove={handleMouseMove}
            >
              {venue.quickActions.map((qa, i) => (
                <button key={i} className="modal-qa-btn">
                  {getQuickActionIcon(qa)}
                  {qa}
                </button>
              ))}
            </div>
          )}

          {/* 3-Item Sliding Thumbnails Bar */}
          <div className={`modal-thumbs ${(!venue.quickActions || venue.quickActions.length === 0) ? 'no-qa' : ''}`} ref={thumbsRef}>
            {visibleThumbs.map((img, relativeIdx) => {
              const actualIdx = thumbStartIndex + relativeIdx;
              return (
                <div
                  key={actualIdx}
                  className={`modal-thumb ${activeImgIndex === actualIdx ? 'active' : ''}`}
                  onClick={() => setActiveImgIndex(actualIdx)}
                >
                  <img src={img} alt={`Thumb ${actualIdx + 1}`} referrerPolicy="no-referrer" />
                </div>
              );
            })}
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
          {(() => {
            const hoursInfo = formatModalHours(venue.hours);
            const priceInfo = formatPriceDisplay(venue.price);
            return (
              <div className="modal-info-grid">
                <div className="modal-info-card">
                  <Star className="ic" style={{ fill: '#E85D5D' }} />
                  <div className="val">{venue.rating}</div>
                  <div className="lbl">{venue.reviews} đánh giá</div>
                </div>
                <div className="modal-info-card">
                  <Clock className="ic" />
                  <div className="val" style={{ fontSize: hoursInfo.val.length > 14 ? '13px' : '14px' }}>{hoursInfo.val}</div>
                  <div className="lbl" style={{ fontSize: '11px' }}>{hoursInfo.lbl}</div>
                </div>
                <div className="modal-info-card">
                  <Banknote className="ic" />
                  <div className="val" style={{ fontSize: '14px' }}>{priceInfo}</div>
                  <div className="lbl">Chi phí / người</div>
                </div>
                <div className="modal-info-card">
                  <Phone className="ic" />
                  <div className="val" style={{ fontSize: '13px' }}>{venue.phone || 'Chưa cập nhật'}</div>
                  <div className="lbl">Liên hệ trực tiếp</div>
                </div>
              </div>
            );
          })()}

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
            onClick={() => {
              const targetUrl = venue.mapUrl || venue.googleMapUrl || venue.mapLink ||
                (venue.geo?.lat && venue.geo?.lng
                  ? `https://www.google.com/maps?q=${venue.geo.lat},${venue.geo.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.fullAddress || venue.address || venue.name)}`);
              window.open(targetUrl, '_blank');
            }}
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

      {/* Fullscreen Lightbox Zoom Overlay */}
      {isZoomed && (
        <div
          className="lightbox-overlay"
          onClick={() => setIsZoomed(false)}
          onWheel={(e) => {
            if (e.deltaY < 0) handleZoomIn(e);
            else if (e.deltaY > 0) handleZoomOut(e);
          }}
        >
          {/* Floating Toolbar with Zoom In/Out & Close */}
          <div className="lightbox-toolbar" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-tool-btn"
              onClick={handleZoomOut}
              disabled={zoomScale <= 0.5}
              title="Thu nhỏ (-)"
            >
              <ZoomOut style={{ width: '18px', height: '18px' }} />
            </button>

            <span className="lightbox-zoom-badge">{Math.round(zoomScale * 100)}%</span>

            <button
              className="lightbox-tool-btn"
              onClick={handleZoomIn}
              disabled={zoomScale >= 3}
              title="Phóng to (+)"
            >
              <ZoomIn style={{ width: '18px', height: '18px' }} />
            </button>

            {zoomScale !== 1 && (
              <button
                className="lightbox-tool-btn"
                onClick={handleResetZoom}
                title="Đặt lại kích thước gốc (100%)"
              >
                <RotateCcw style={{ width: '15px', height: '15px' }} />
              </button>
            )}

            <div className="lightbox-divider"></div>

            <button
              className="lightbox-tool-btn close-btn"
              onClick={() => setIsZoomed(false)}
              title="Đóng phóng to (ESC)"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* Lightbox Carousel Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="lightbox-arrow left"
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                title="Ảnh trước (←)"
              >
                <ChevronLeft style={{ width: '28px', height: '28px' }} />
              </button>
              <button
                className="lightbox-arrow right"
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                title="Ảnh sau (→)"
              >
                <ChevronRight style={{ width: '28px', height: '28px' }} />
              </button>
            </>
          )}

          {/* Lightbox Image Container */}
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: `scale(${zoomScale})`,
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transformOrigin: 'center center'
            }}
          >
            <img
              src={images[activeImgIndex]}
              alt={venue.name}
              className="lightbox-img"
              referrerPolicy="no-referrer"
            />
            <div className="lightbox-caption">
              <span>{venue.name} • Ảnh {activeImgIndex + 1} / {images.length} • {Math.round(zoomScale * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
