import React, { useState, useEffect } from 'react';
import getClothingIcon from '../../utils/clothingIcons.jsx';
import './ItemSelectionPanel.css';

const ItemSelectionPanel = ({ 
  category, 
  items, 
  onSelectItem, 
  onClose 
}) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  
  // Filter items when category, subcategory, or color changes
  useEffect(() => {
    if (!items || !Array.isArray(items)) {
      setFilteredItems([]);
      return;
    }
    
    // First filter by category
    let filtered = items.filter(item => item.category === category);
    
    // Then by subcategory if not "All"
    if (selectedSubcategory !== "All") {
      filtered = filtered.filter(item => item.subCategory === selectedSubcategory);
    }
    
    // Then by color if not "All"
    if (selectedColor !== "All") {
      filtered = filtered.filter(item => item.color === selectedColor);
    }
    
    setFilteredItems(filtered);
  }, [items, category, selectedSubcategory, selectedColor]);
  
  // Get unique subcategories for the current category
  const getUniqueSubcategories = () => {
    if (!items || !Array.isArray(items)) return ["All"];
    
    const subcategories = items
      .filter(item => item.category === category)
      .map(item => item.subCategory)
      .filter(Boolean);
    
    return ["All", ...new Set(subcategories)];
  };
  
  // Get unique colors for the current category and subcategory
  const getUniqueColors = () => {
    if (!items || !Array.isArray(items)) return ["All"];
    
    let filtered = items.filter(item => item.category === category);
    
    if (selectedSubcategory !== "All") {
      filtered = filtered.filter(item => item.subCategory === selectedSubcategory);
    }
    
    const colors = filtered.map(item => item.color).filter(Boolean);
    
    return ["All", ...new Set(colors)];
  };
  
  // Helper function to determine text color based on background color
  const getContrastColor = (color) => {
    // For named colors, use this basic mapping
    const darkColors = ['black', 'navy', 'blue', 'purple', 'brown', 'darkgreen', 'darkgrey'];
    if (darkColors.includes(color?.toLowerCase())) {
      return 'white';
    }
    
    // Default to black for unknown colors
    return 'black';
  };
  
  return (
    <div className="item-selection-panel">
      <div className="panel-header">
        <h3>Select {category}</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="filter-controls">
        {/* Subcategory filter */}
        <div className="filter-section">
          <h4>Subcategory</h4>
          <div className="filter-options">
            {getUniqueSubcategories().map(subcategory => (
              <button
                key={subcategory}
                className={`filter-btn ${selectedSubcategory === subcategory ? 'active' : ''}`}
                onClick={() => setSelectedSubcategory(subcategory)}
              >
                {subcategory}
              </button>
            ))}
          </div>
        </div>
        
        {/* Color filter */}
        <div className="filter-section">
          <h4>Color</h4>
          <div className="filter-options">
            {getUniqueColors().map(color => (
              <button
                key={color}
                className={`filter-btn ${selectedColor === color ? 'active' : ''}`}
                onClick={() => setSelectedColor(color)}
                style={color !== "All" ? { 
                  backgroundColor: color, 
                  color: getContrastColor(color) 
                } : {}}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="items-container">
        {filteredItems.length > 0 ? (
          <ul className="items-list">
            {filteredItems.map(item => (
              <li
                key={item._id}
                className="item-card"
                onClick={() => onSelectItem(item)}
              >
                <div className="item-icon">
                  {getClothingIcon(item.category, item.subCategory)}
                </div>
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-details">
                    {item.subCategory}
                    {item.color && <span className="item-color"> - {item.color}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-items-message">No {category} items found matching the filters.</p>
        )}
      </div>
    </div>
  );
};

export default ItemSelectionPanel; 