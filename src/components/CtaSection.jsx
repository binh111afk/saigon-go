import React from 'react';
import { Plus } from 'lucide-react';

export default function CtaSection({ onAddVenue }) {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-inner">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px' }}>
            Bạn biết địa điểm nào ấn tượng?
          </h2>
          <p style={{ fontSize: '15px', color: '#6b6b6b', maxWidth: '520px', margin: '0 auto 28px' }}>
            Đóng góp địa điểm hoặc chia sẻ review thực tế để giúp cộng đồng tìm được chỗ hẹn hò hoàn hảo hơn.
          </p>
          <button
            className="btn-primary"
            onClick={onAddVenue}
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Đóng góp địa điểm mới
          </button>
        </div>
      </div>
    </section>
  );
}
