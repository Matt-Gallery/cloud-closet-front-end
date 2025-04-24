/**
 * Clothing Icons Utility
 * Maps clothing categories and subcategories to Unicode symbols/emoji
 */

// Map of clothing categories to their corresponding Unicode icons
const clothingCategoryIcons = {
  // Top items
  'Shirt': '👕',
  'T-Shirt': '👕',
  'Tank Top': '👚',
  'Long Sleeve': '👕',
  'Turtleneck': '🧥',
  'Button-up': '👔',
  'Polo': '👕',
  'Blouse': '👚',
  
  // Bottom items
  'Pants': '👖',
  'Jeans': '👖',
  'Khakis': '👖',
  'Trousers': '👖',
  'Leggings': '🩲',
  'Shorts': '🩳',
  
  // Sweaters
  'Sweater': '🧶',
  'Cardigan': '🧣',
  'Lightweight': '🧥',
  
  // Dresses & Skirts
  'Skirt': '👗',
  'Mini': '👗',
  'Midi': '👗',
  'Maxi': '👗',
  'Dress': '👗',
  'Sleeveless': '👗',
  
  // Shoes
  'Shoes': '👟',
  'Tennis Shoes': '👟',
  'Loafer': '👞',
  'Sandal': '👡',
  'Boot': '👢',
  
  // Outerwear
  'Jacket': '🧥',
  'Winter': '🧥',
  'Rain': '🧥',
  'Blazer': '👔'
};

/**
 * Get the clothing icon for a given category or subcategory
 * @param {string} category - The main clothing category
 * @param {string} [subCategory] - Optional subcategory for more specific icon
 * @returns {string} - The Unicode clothing icon
 */
export const getClothingIcon = (category, subCategory) => {
  if (!category) return '👚'; // Default clothing icon
  
  // If we have a subcategory and it has a specific icon, use that
  if (subCategory && clothingCategoryIcons[subCategory]) {
    return clothingCategoryIcons[subCategory];
  }
  
  // Otherwise fall back to the category icon
  if (clothingCategoryIcons[category]) {
    return clothingCategoryIcons[category];
  }
  
  // Default fallback
  return '👚';
};

/**
 * Get a larger version of the clothing icon with styling
 * @param {string} category - The main clothing category
 * @param {string} [subCategory] - Optional subcategory for more specific icon
 * @returns {object} - Object with icon and className for styling
 */
export const getLargeClothingIcon = (category, subCategory) => {
  const icon = getClothingIcon(category, subCategory);
  return {
    icon,
    className: 'large-clothing-icon'
  };
};

export default getClothingIcon; 