import React, { useState, useEffect, useRef } from 'react';
import './PrecipRangeSlider.css';

const PrecipRangeSlider = ({ precipType, precipIntensity, onChange, disabled }) => {
  // Define precipitation types and their corresponding values
  const PRECIP_TYPES = [
    { value: 'light_rain', label: 'Light Rain', type: 'rain', intensity: 'light' },
    { value: 'moderate_rain', label: 'Moderate Rain', type: 'rain', intensity: 'moderate' },
    { value: 'heavy_rain', label: 'Heavy Rain', type: 'rain', intensity: 'heavy' },
    { value: 'light_snow', label: 'Light Snow', type: 'snow', intensity: 'light' },
    { value: 'moderate_snow', label: 'Moderate Snow', type: 'snow', intensity: 'moderate' },
    { value: 'heavy_snow', label: 'Heavy Snow', type: 'snow', intensity: 'heavy' }
  ];

  // Get index from type and intensity
  const getIndexFromTypeAndIntensity = (type, intensity) => {
    if (!type || !intensity) return 0;
    const index = PRECIP_TYPES.findIndex(p => p.type === type && p.intensity === intensity);
    return index >= 0 ? index : 0;
  };

  // Initialize selection based on passed props
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const index = getIndexFromTypeAndIntensity(precipType, precipIntensity);
    return index;
  });
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef(null);
  // Store current index in a ref to avoid closure issues with event handlers
  const selectedIndexRef = useRef(selectedIndex);

  // Update the ref when selectedIndex changes
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // Handle percentage to index conversion
  const percentToIndex = (percent) => {
    const index = Math.round((percent / 100) * (PRECIP_TYPES.length - 1));
    return Math.min(Math.max(0, index), PRECIP_TYPES.length - 1);
  };

  // Handle index to percentage conversion
  const indexToPercent = (index) => {
    return (index / (PRECIP_TYPES.length - 1)) * 100;
  };

  // Mouse and touch event handlers
  const handleMouseDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    setDragging(true);
    updateIndexFromEvent(e);
  };

  const handleMouseUp = () => {
    if (disabled) return;
    if (dragging) {
      // Use the current value from the ref to ensure we have the latest index
      const currentIndex = selectedIndexRef.current;
      const precip = PRECIP_TYPES[currentIndex];
      onChange({
        precipType: precip.type,
        precipIntensity: precip.intensity
      });
      setDragging(false);
    }
  };

  const handleMouseMove = (e) => {
    if (disabled || !dragging || !sliderRef.current) return;
    updateIndexFromEvent(e);
  };

  const updateIndexFromEvent = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newIndex = percentToIndex(percent);
    setSelectedIndex(newIndex);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (dragging && !disabled) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, disabled]);

  // Update internal state when props change
  useEffect(() => {
    const newIndex = getIndexFromTypeAndIntensity(precipType, precipIntensity);
    setSelectedIndex(newIndex);
  }, [precipType, precipIntensity]);

  // Handle individual marker clicks
  const handleMarkerClick = (index) => {
    if (disabled) return;
    setSelectedIndex(index);
    const precip = PRECIP_TYPES[index];
    onChange({
      precipType: precip.type,
      precipIntensity: precip.intensity
    });
  };

  // Calculate handle position
  const handlePosition = indexToPercent(selectedIndex);

  // Split label into intensity and type
  const renderStackedLabel = (label) => {
    // Split the label text (e.g., "Light Rain" into ["Light", "Rain"])
    const parts = label.split(' ');
    if (parts.length === 2) {
      return (
        <div className="stacked-label">
          <div className="intensity-label">{parts[0]}</div>
          <div className="type-label">{parts[1]}</div>
        </div>
      );
    }
    return label;
  };

  return (
    <div className={`precip-range-slider ${disabled ? 'precip-range-disabled' : ''}`}>
      <div className="precip-labels">
        <span>Rain</span>
        <span>Snow</span>
      </div>
      
      <div 
        className="precip-slider" 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
      >
        <div className="precip-track"></div>
        
        {!disabled && (
          <div
            className="precip-handle"
            style={{ left: `${handlePosition}%` }}
          ></div>
        )}
        
        <div className="precip-markers">
          {PRECIP_TYPES.map((precip, index) => {
            const isSelected = index === selectedIndex && !disabled;
            return (
              <div
                key={precip.value}
                className={`precip-marker ${isSelected ? 'selected' : ''}`}
                style={{ left: `${indexToPercent(index)}%` }}
                onClick={() => handleMarkerClick(index)}
              >
                <span className="precip-marker-label">
                  {renderStackedLabel(precip.label)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="precip-display">
        {disabled ? (
          <span>No precipitation</span>
        ) : (
          <span>Selected: {PRECIP_TYPES[selectedIndex].label}</span>
        )}
      </div>
    </div>
  );
};

export default PrecipRangeSlider; 