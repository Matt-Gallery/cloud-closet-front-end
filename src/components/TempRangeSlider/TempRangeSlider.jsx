import React, { useState, useEffect, useRef } from 'react';
import './TempRangeSlider.css';

const TempRangeSlider = ({ minTemp, maxTemp, onChange, disabled }) => {
  const [values, setValues] = useState({ min: minTemp || 20, max: maxTemp || 80 });
  const [dragging, setDragging] = useState(null);
  const sliderRef = useRef(null);

  const MIN_TEMP = 0;
  const MAX_TEMP = 100;
  const STEP = 5;
  const TEMP_RANGE = MAX_TEMP - MIN_TEMP;

  // Handle temperature display format
  const formatTemp = (temp) => {
    if (temp <= MIN_TEMP) return "<0°F";
    if (temp >= MAX_TEMP) return ">100°F";
    return `${temp}°F`;
  };

  // Convert temperature to percentage position
  const tempToPercent = (temp) => {
    return ((temp - MIN_TEMP) / TEMP_RANGE) * 100;
  };

  // Convert percentage to temperature
  const percentToTemp = (percent) => {
    const rawTemp = MIN_TEMP + (percent / 100) * TEMP_RANGE;
    // Round to nearest step
    return Math.round(rawTemp / STEP) * STEP;
  };

  // Handle mouse and touch events
  const handleMouseDown = (e, handle) => {
    if (disabled) return;
    e.preventDefault();
    setDragging(handle);
  };

  const handleMouseUp = () => {
    if (disabled) return;
    if (dragging) {
      // Notify parent component of change
      onChange(values);
      setDragging(null);
    }
  };

  const handleMouseMove = (e) => {
    if (disabled) return;
    if (!dragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));
    const newTemp = percentToTemp(percent);
    
    setValues(prev => {
      if (dragging === 'min') {
        return { ...prev, min: Math.min(newTemp, prev.max) };
      } else {
        return { ...prev, max: Math.max(newTemp, prev.min) };
      }
    });
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
    setValues({
      min: minTemp !== undefined ? minTemp : 20,
      max: maxTemp !== undefined ? maxTemp : 80
    });
  }, [minTemp, maxTemp]);

  // Calculate positions of handles
  const minHandlePosition = tempToPercent(values.min);
  const maxHandlePosition = tempToPercent(values.max);
  
  return (
    <div className={`temp-range-slider ${disabled ? 'temp-range-disabled' : ''}`}>
      <div className="temp-labels">
        <span>Cold</span>
        <span>Hot</span>
      </div>
      
      <div 
        className="temp-slider" 
        ref={sliderRef}
      >
        <div className="temp-track"></div>
        {!disabled && (
          <>
            <div
              className="temp-range"
              style={{
                left: `${minHandlePosition}%`,
                width: `${maxHandlePosition - minHandlePosition}%`
              }}
            ></div>
            
            <div
              className="temp-handle min-handle"
              style={{ left: `${minHandlePosition}%` }}
              onMouseDown={(e) => handleMouseDown(e, 'min')}
              onTouchStart={(e) => handleMouseDown(e, 'min')}
            ></div>
            
            <div
              className="temp-handle max-handle"
              style={{ left: `${maxHandlePosition}%` }}
              onMouseDown={(e) => handleMouseDown(e, 'max')}
              onTouchStart={(e) => handleMouseDown(e, 'max')}
            ></div>
          </>
        )}
        
        <div className="temp-markers">
          {Array.from({ length: (MAX_TEMP - MIN_TEMP) / STEP + 1 }).map((_, index) => {
            const temp = MIN_TEMP + index * STEP;
            const isEdge = index === 0 || index === (MAX_TEMP - MIN_TEMP) / STEP;
            const isQuarter = index % 4 === 0; 
            // Only show labels for multiples of 20 or edges
            const showLabel = isQuarter || isEdge;
            
            return (
              <div
                key={temp}
                className="temp-marker"
                style={{ left: `${tempToPercent(temp)}%` }}
              >
                {showLabel && (
                  <span className="temp-marker-label">{formatTemp(temp)}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="temp-display">
        {disabled ? (
          <span>Any temperature</span>
        ) : (
          <span>Range: {formatTemp(values.min)} to {formatTemp(values.max)}</span>
        )}
      </div>
    </div>
  );
};

export default TempRangeSlider; 