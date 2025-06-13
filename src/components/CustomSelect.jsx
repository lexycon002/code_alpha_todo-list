import React, { useState, useRef, useEffect } from 'react';
import './customSelect.css';

const CustomSelect = ({ options, value, onChange, placeholder = "Enter a task..." }) => {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef(null);
  const optionsRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && highlightedIndex >= 0 && optionsRefs.current[highlightedIndex]) {
      optionsRefs.current[highlightedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, open]);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      setHighlightedIndex(0);
      return;
    }
    if (open) {
      if (e.key === 'ArrowDown') {
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
      } else if (e.key === 'ArrowUp') {
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        handleSelect(options[highlightedIndex]);
      } else if (e.key === 'Escape') {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (open && value) {
      const idx = options.indexOf(value);
      setHighlightedIndex(idx);
    }
  }, [open]);

  return (
    <div className="custom-select-container" ref={ref} tabIndex={0} onKeyDown={handleKeyDown}>
      <div
        className="custom-select-selected"
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value || <span className="custom-select-placeholder">{placeholder}</span>}
      </div>
      {open && (
        <div className="custom-select-dropdown" role="listbox">
          {options.map((option, idx) => (
            <div
              key={idx}
              ref={el => optionsRefs.current[idx] = el}
              className={`custom-select-option${option === value ? ' selected' : ''}${highlightedIndex === idx ? ' highlighted' : ''}`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option === value}
              style={highlightedIndex === idx ? { background: '#d0e0ff' } : {}}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
