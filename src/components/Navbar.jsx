import React from 'react';
import { Search, Heart } from 'lucide-react';

export default function Navbar({ searchTerm, setSearchTerm, favoriteIds, onOpenFavorites, scrolled }) {
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <a href="#" className="nav-logo">Sài Gòn Date</a>
        <div style={{ display: 'flex', gap: '4px' }} className="hidden-mobile">
          <a href="#venues" className="nav-link">Khám phá</a>
          <a href="#featured" className="nav-link">Đề xuất</a>
          <a href="#cta" className="nav-link">Đóng góp</a>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ width: '16px', height: '16px', position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm địa điểm, quận, tên..."
            style={{
              background: '#f5f0eb',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px 10px 40px',
              fontSize: '13px',
              width: '200px',
              outline: 'none',
              fontFamily: 'inherit',
              color: '#1a1a1a',
              transition: 'all .3s ease'
            }}
            onFocus={(e) => {
              e.target.style.width = '260px';
              e.target.style.background = '#fff';
              e.target.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
            }}
            onBlur={(e) => {
              e.target.style.width = '200px';
              e.target.style.background = '#f5f0eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <button
          onClick={onOpenFavorites}
          title="Địa điểm yêu thích"
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: favoriteIds.length > 0 ? '#fef0ec' : '#f5f0eb',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all .2s ease'
          }}
        >
          <Heart style={{ width: '18px', height: '18px', color: '#E85D5D', fill: favoriteIds.length > 0 ? '#E85D5D' : 'none' }} />
          {favoriteIds.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#E85D5D',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '10px',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {favoriteIds.length}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
