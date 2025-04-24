/**
 * Generates a recommended outfit based on available items
 * @param {Object} recommendationsData - The data received from the backend
 * @returns {Object} An outfit recommendation with items from different categories
 */
export function generateOutfitRecommendation(recommendationsData) {
  const { recommendations } = recommendationsData;
  const invalidCombinations = [
    ["Pants", "Skirt"],
    ["Pants", "Dress"],
    ["Skirt", "Dress"],
    ["Shirt", "Dress"],
    ["Pants.Shorts", "Sweater.Cardigan"],
    ["Pants.Shorts", "Sweater.Turtleneck"],
    ["Pants.Shorts", "Shirt.Turtleneck"],
    ["Pants.Shorts", "Winter"],
    ["Pants.Shorts", "Rain"],
    ["Pants.Shorts", "Blazer"],
    ["Shirt.T-Shirt", "Sweater.Turtleneck"],
    ["Shirt.T-Shirt", "Winter"],
    ["Shirt.T-Shirt", "Blazer"],
    ["Shirt.Tank Top", "Sweater.Turtleneck"],
    ["Shirt.Tank Top", "Dress.Sleeveless"],
    ["Shirt.Tank Top", "Winter"],
    ["Shirt.Tank Top", "Blazer"],
    ["Shirt.Polo", "Winter"],
    ["Sweater.Turtleneck", "Dress"],
    ["Skirt.Mini", "Winter"],
    ["Skirt.Polo", "Pants.Leggings"]
  ];

  // Initialize outfit
  const outfit = {
    topItems: [],  // For Shirt and/or Sweater
    bottomItem: null,  // For Pants, Skirt or Dress
    shoes: null,
    jacket: null
  };

  // 1. Select shoes (required)
  if (recommendations.Shoes && recommendations.Shoes.length > 0) {
    outfit.shoes = getRandomItem(recommendations.Shoes);
  } else {
    return { success: false, message: "No shoes available for outfit" };
  }

  // 2. Select bottom item (required: Pants, Skirt, or Dress)
  const bottomOptions = [
    { category: "Pants", items: recommendations.Pants || [] },
    { category: "Skirt", items: recommendations.Skirt || [] },
    { category: "Dress", items: recommendations.Dress || [] }
  ].filter(option => option.items.length > 0);

  if (bottomOptions.length === 0) {
    return { success: false, message: "No bottom items (pants, skirt, or dress) available" };
  }

  // Randomly select a bottom category and item
  const selectedBottomOption = getRandomItem(bottomOptions);
  outfit.bottomItem = {
    category: selectedBottomOption.category,
    item: getRandomItem(selectedBottomOption.items)
  };

  // 3. If dress was selected, we don't need a shirt
  if (outfit.bottomItem.category === "Dress") {
    // If dress is selected, don't add shirts or sweaters that conflict with dresses
    // Add jacket if available
    addJacketIfAvailable(recommendations, outfit, invalidCombinations);
    return { success: true, outfit };
  }

  // 4. Select top items (Shirt and/or Sweater)
  const shirtItems = recommendations.Shirt || [];
  const sweaterItems = recommendations.Sweater || [];
  
  // Filter sweaters to separate cardigans from other sweaters
  const cardiganItems = sweaterItems.filter(item => item.subCategory === "Cardigan");
  const nonCardiganSweaters = sweaterItems.filter(item => item.subCategory !== "Cardigan");

  // Decide what combination of tops to use
  const selectTops = () => {
    // Option 1: Just a shirt
    if (shirtItems.length > 0 && (nonCardiganSweaters.length === 0 || Math.random() > 0.5)) {
      const shirt = getRandomItem(shirtItems);
      if (!isInvalidCombination(outfit.bottomItem, { category: "Shirt", item: shirt }, invalidCombinations)) {
        outfit.topItems.push({ category: "Shirt", item: shirt });
        
        // Chance to add a cardigan on top of the shirt
        if (cardiganItems.length > 0 && Math.random() > 0.5) {
          const cardigan = getRandomItem(cardiganItems);
          if (!isInvalidCombination(outfit.bottomItem, { category: "Sweater", item: cardigan }, invalidCombinations) &&
              !isInvalidCombination({ category: "Shirt", item: shirt }, { category: "Sweater", item: cardigan }, invalidCombinations)) {
            outfit.topItems.push({ category: "Sweater", item: cardigan });
          }
        }
        
        return true;
      }
    }

    // Option 2: Just a non-cardigan sweater
    if (nonCardiganSweaters.length > 0 && (shirtItems.length === 0 || Math.random() > 0.5)) {
      const sweater = getRandomItem(nonCardiganSweaters);
      if (!isInvalidCombination(outfit.bottomItem, { category: "Sweater", item: sweater }, invalidCombinations)) {
        outfit.topItems.push({ category: "Sweater", item: sweater });
        return true;
      }
    }

    // Option 3: Shirt and non-cardigan sweater
    if (shirtItems.length > 0 && nonCardiganSweaters.length > 0) {
      const shirt = getRandomItem(shirtItems);
      const sweater = getRandomItem(nonCardiganSweaters);
      
      const shirtValid = !isInvalidCombination(outfit.bottomItem, { category: "Shirt", item: shirt }, invalidCombinations);
      const sweaterValid = !isInvalidCombination(outfit.bottomItem, { category: "Sweater", item: sweater }, invalidCombinations);
      const combinationValid = !isInvalidCombination({ category: "Shirt", item: shirt }, { category: "Sweater", item: sweater }, invalidCombinations);
      
      if (shirtValid && sweaterValid && combinationValid) {
        outfit.topItems.push({ category: "Shirt", item: shirt });
        outfit.topItems.push({ category: "Sweater", item: sweater });
        return true;
      }
    }
    
    // Option 4: Shirt with cardigan - explicitly ensuring cardigan has a shirt underneath
    if (shirtItems.length > 0 && cardiganItems.length > 0) {
      const shirt = getRandomItem(shirtItems);
      const cardigan = getRandomItem(cardiganItems);
      
      const shirtValid = !isInvalidCombination(outfit.bottomItem, { category: "Shirt", item: shirt }, invalidCombinations);
      const cardiganValid = !isInvalidCombination(outfit.bottomItem, { category: "Sweater", item: cardigan }, invalidCombinations);
      const combinationValid = !isInvalidCombination({ category: "Shirt", item: shirt }, { category: "Sweater", item: cardigan }, invalidCombinations);
      
      if (shirtValid && cardiganValid && combinationValid) {
        outfit.topItems.push({ category: "Shirt", item: shirt });
        outfit.topItems.push({ category: "Sweater", item: cardigan });
        return true;
      }
    }

    return false;
  };

  // Try a few times to get valid tops
  let attempts = 0;
  const maxAttempts = 5;
  while (attempts < maxAttempts && outfit.topItems.length === 0) {
    if (selectTops()) break;
    attempts++;
  }

  // If we couldn't find valid tops
  if (outfit.topItems.length === 0) {
    return { success: false, message: "Could not find compatible top items" };
  }

  // 5. Add jacket if available
  addJacketIfAvailable(recommendations, outfit, invalidCombinations);

  // 6. Ensure cardigans are always recommended with a shirt
  if (hasCardiganWithoutShirt(outfit)) {
    if (shirtItems.length === 0) {
      // If there are no shirts available, remove the cardigan
      outfit.topItems = outfit.topItems.filter(item => 
        !(item.category === "Sweater" && item.item.subCategory === "Cardigan"));
      
      // If no tops left, try again with a non-cardigan sweater
      if (outfit.topItems.length === 0 && nonCardiganSweaters.length > 0) {
        const sweater = getRandomItem(nonCardiganSweaters);
        if (!isInvalidCombination(outfit.bottomItem, { category: "Sweater", item: sweater }, invalidCombinations)) {
          outfit.topItems.push({ category: "Sweater", item: sweater });
        }
      }
    } else {
      // Add a compatible shirt
      let foundCompatibleShirt = false;
      
      // Try to find a compatible shirt
      for (let i = 0; i < shirtItems.length && !foundCompatibleShirt; i++) {
        const shirt = shirtItems[i];
        if (!isInvalidCombination(outfit.bottomItem, { category: "Shirt", item: shirt }, invalidCombinations)) {
          // Add the shirt to the outfit
          outfit.topItems.unshift({ category: "Shirt", item: shirt });
          foundCompatibleShirt = true;
        }
      }
      
      // If no compatible shirt found, remove the cardigan
      if (!foundCompatibleShirt) {
        outfit.topItems = outfit.topItems.filter(item => 
          !(item.category === "Sweater" && item.item.subCategory === "Cardigan"));
      }
    }
  }

  return { success: true, outfit };
}

/**
 * Helper to check if outfit has a cardigan without a shirt
 */
function hasCardiganWithoutShirt(outfit) {
  const hasShirt = outfit.topItems.some(item => item.category === "Shirt");
  const hasCardigan = outfit.topItems.some(item => 
    item.category === "Sweater" && item.item.subCategory === "Cardigan");
  
  return hasCardigan && !hasShirt;
}

/**
 * Helper to add a jacket to the outfit if available and compatible
 */
function addJacketIfAvailable(recommendations, outfit, invalidCombinations) {
  if (recommendations.Jacket && recommendations.Jacket.length > 0) {
    // Check compatibility with other items before adding
    const jacket = getRandomItem(recommendations.Jacket);
    let canAddJacket = true;
    
    // Check against bottom
    if (isInvalidCombination(outfit.bottomItem, { category: "Jacket", item: jacket }, invalidCombinations)) {
      canAddJacket = false;
    }
    
    // Check against tops
    for (const topItem of outfit.topItems) {
      if (isInvalidCombination(topItem, { category: "Jacket", item: jacket }, invalidCombinations)) {
        canAddJacket = false;
        break;
      }
    }
    
    if (canAddJacket) {
      outfit.jacket = jacket;
    }
  }
}

/**
 * Checks if the combination of two items is invalid
 */
function isInvalidCombination(item1, item2, invalidCombinations) {
  if (!item1 || !item2) return false;
  
  const category1 = item1.category;
  const category2 = item2.category;
  
  // Check main categories
  if (invalidCombinations.some(combo => 
    (combo[0] === category1 && combo[1] === category2) || 
    (combo[0] === category2 && combo[1] === category1))) {
    return true;
  }
  
  // Check subcategories
  const subCategory1 = item1.item.subCategory;
  const subCategory2 = item2.item.subCategory;
  
  return invalidCombinations.some(combo => {
    const [cat1, subCat1] = combo[0].split('.');
    const [cat2, subCat2] = combo[1].split('.');
    
    return (cat1 === category1 && subCat1 === subCategory1 && cat2 === category2 && subCat2 === subCategory2) ||
           (cat1 === category2 && subCat1 === subCategory2 && cat2 === category1 && subCat2 === subCategory1);
  });
}

/**
 * Returns a random item from an array
 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default {
  generateOutfitRecommendation
};
