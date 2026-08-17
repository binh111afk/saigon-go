import React from 'react';
import VenueCard from './VenueCard';
import { ChevronDown, Check } from 'lucide-react';

export default function VenueGrid({
  venues,
  visibleCount,
  onLoadMore,
  favoriteIds,
  onToggleFavorite,
  onSelectVenue
}) {
  const hasMore = visibleCount < venues.length;

  return (
    <section className="section" id="venues">
      <div className="section-head">
        <div>
          <div className="section-title">Khám phá địa điểm ({venues.length})</div>
          <div className="section-subtitle">Review thật từ Google Maps — Xác minh bởi cộng đồng</div>
        </div>
      </div>

      {venues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '20px', color: '#999' }}>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>Không tìm thấy địa điểm phù hợp với bộ lọc.</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Vui lòng thử chọn quận hoặc mức giá khác.</p>
        </div>
      ) : (
        <div className="venue-grid">
          {venues.slice(0, visibleCount).map((v) => (
            <VenueCard
              key={v.id}
              venue={v}
              isFavorite={favoriteIds.includes(v.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={onSelectVenue}
            />
          ))}
        </div>
      )}

      {venues.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            className="btn-outline"
            onClick={onLoadMore}
            disabled={!hasMore}
            style={{ padding: '12px 32px', cursor: hasMore ? 'pointer' : 'default', opacity: hasMore ? 1 : 0.8 }}
          >
            {hasMore ? (
              <>
                <ChevronDown style={{ width: '16px', height: '16px' }} />
                Xem thêm ({venues.length - visibleCount} địa điểm nữa)
              </>
            ) : (
              <>
                <Check style={{ width: '16px', height: '16px' }} />
                Đã hiển thị tất cả {venues.length} địa điểm
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
