import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span className="nav-logo" style={{ fontSize: '18px' }}>Sài Gòn Date</span>
        <span style={{ fontSize: '12px', color: '#bbb' }}>© 2026 • Made with ❤️ cho hẹn hò Sài Gòn</span>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="#" style={{ fontSize: '12px', color: '#999', textDecoration: 'none' }}>Giới thiệu</a>
        <a href="#" style={{ fontSize: '12px', color: '#999', textDecoration: 'none' }}>Chính sách</a>
        <a href="#" style={{ fontSize: '12px', color: '#999', textDecoration: 'none' }}>Liên hệ</a>
      </div>
    </footer>
  );
}
