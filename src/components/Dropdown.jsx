import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  icon: Icon,
  placeholder = 'Chọn...',
  enableSearch = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value || opt === value);
  const displayLabel = typeof selectedOption === 'object' ? selectedOption.label : (selectedOption || placeholder);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) => {
    if (!enableSearch || !searchTerm.trim()) return true;
    const optLabel = typeof opt === 'object' ? opt.label : String(opt);
    return optLabel.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  const handleSelect = (optValue) => {
    const val = typeof optValue === 'object' ? optValue.value : optValue;
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      {label && <span className="dropdown-label">{label}</span>}

      <button
        type="button"
        className={`dropdown-trigger ${isOpen ? 'open' : ''} ${value !== 'Tất cả' && value !== 'default' ? 'has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {Icon && <Icon style={{ width: '15px', height: '15px', color: '#E85D5D', flexShrink: 0 }} />}
          <span className="dropdown-trigger-text">{displayLabel}</span>
        </div>
        <ChevronDown style={{ width: '16px', height: '16px', color: '#888', transition: 'transform .2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {enableSearch && (
            <div className="dropdown-search-box">
              <Search style={{ width: '14px', height: '14px', color: '#aaa', flexShrink: 0 }} />
              <input
                type="text"
                className="dropdown-search-input"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div className="dropdown-list">
            {filteredOptions.length === 0 ? (
              <div className="dropdown-empty">Không tìm thấy</div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const optVal = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : String(opt);
                const isSelected = optVal === value;

                return (
                  <div
                    key={idx}
                    className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(optVal)}
                  >
                    <span>{optLabel}</span>
                    {isSelected && <Check style={{ width: '14px', height: '14px', color: '#E85D5D' }} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
