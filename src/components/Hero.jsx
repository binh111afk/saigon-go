import React, { useEffect, useState } from 'react';

export default function Hero({ totalCount = 150 }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`hero ${loaded ? 'loaded' : ''}`} id="hero">
      <div className="hero-img"></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
          Cập nhật mới — Tháng 8, 2026
        </div>
        <h1 className="hero-title">
          Chỗ Hẹn Hò<br />
          <span>Sài Gòn</span>
        </h1>
        <p className="hero-subtitle">
          Khám phá {totalCount}+ địa điểm hẹn hò lãng mạn nhất Sài Gòn — review thật từ Google Maps, xác minh bằng trải nghiệm thực tế.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
          <div className="stat-pill">
            <div>
              <div className="val">{totalCount}+</div>
              <div className="label">Địa điểm<br />xác minh</div>
            </div>
          </div>
          <div className="stat-pill">
            <div>
              <div className="val">4.8</div>
              <div className="label">Sao trung<br />bình</div>
            </div>
          </div>
          <div className="stat-pill">
            <div>
              <div className="val">35k</div>
              <div className="label">Giá bắt<br />đầu từ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
