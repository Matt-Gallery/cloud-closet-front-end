// Comprehensive test for outfit recommendation service
// Using ES modules instead of CommonJS
import { generateOutfitRecommendation } from './services/recommendationService.js';

// Complete test data from user
const fullTestData = {
  "success": true,
  "recommendations": {
    "Shirt": [
      {
        "_id": "68091594b59a29987a06bc83",
        "brand": "Mason-Murphy",
        "name": "MediumAquaMarine Button-up",
        "subCategory": "Button-up",
        "color": "DarkKhaki",
        "imageUrl": "https://placekitten.com/539/389"
      },
      {
        "_id": "68091594b59a29987a06bc8e",
        "brand": "Cox, Nguyen and Curtis",
        "name": "PeachPuff Button-up",
        "subCategory": "Button-up",
        "color": "WhiteSmoke",
        "imageUrl": "https://dummyimage.com/841x1004"
      },
      {
        "_id": "68091594b59a29987a06bca2",
        "brand": "Williams, Wheeler and Trujillo",
        "name": "Yellow Button-up",
        "subCategory": "Button-up",
        "color": "DarkGray",
        "imageUrl": "https://www.lorempixel.com/839/780"
      },
      {
        "_id": "68091594b59a29987a06bcad",
        "brand": "Garza, Woods and Schultz",
        "name": "Plum Button-up",
        "subCategory": "Button-up",
        "color": "PaleVioletRed",
        "imageUrl": "https://placeimg.com/398/567/any"
      }
    ],
    "Pants": [
      {
        "_id": "68091594b59a29987a06bd5d",
        "brand": "Robinson Inc",
        "name": "Tomato Jeans",
        "subCategory": "Jeans",
        "color": "DarkCyan",
        "imageUrl": "https://placeimg.com/891/93/any"
      },
      {
        "_id": "68091594b59a29987a06bd60",
        "brand": "Hodges, Johnson and King",
        "name": "LightGreen Jeans",
        "subCategory": "Jeans",
        "color": "Peru",
        "imageUrl": "https://www.lorempixel.com/95/436"
      },
      {
        "_id": "68091594b59a29987a06bd63",
        "brand": "Solomon, Dunn and Wilson",
        "name": "LightSkyBlue Jeans",
        "subCategory": "Jeans",
        "color": "DarkViolet",
        "imageUrl": "https://placeimg.com/175/535/any"
      },
      {
        "_id": "68091594b59a29987a06bd68",
        "brand": "Martinez PLC",
        "name": "MediumTurquoise Jeans",
        "subCategory": "Jeans",
        "color": "MediumTurquoise",
        "imageUrl": "https://dummyimage.com/557x29"
      },
      {
        "_id": "68091594b59a29987a06bd6a",
        "brand": "Fuller, Kirby and Lowe",
        "name": "Silver Jeans",
        "subCategory": "Jeans",
        "color": "Khaki",
        "imageUrl": "https://dummyimage.com/650x375"
      },
      {
        "_id": "68091594b59a29987a06bd6c",
        "brand": "Norman, Waller and Moyer",
        "name": "PaleGoldenRod Jeans",
        "subCategory": "Jeans",
        "color": "MediumVioletRed",
        "imageUrl": "https://placeimg.com/378/391/any"
      },
      {
        "_id": "68091594b59a29987a06bd6e",
        "brand": "Davenport Ltd",
        "name": "DarkSalmon Jeans",
        "subCategory": "Jeans",
        "color": "GoldenRod",
        "imageUrl": "https://dummyimage.com/940x611"
      },
      {
        "_id": "68091594b59a29987a06bd73",
        "brand": "Washington-Collins",
        "name": "PaleGoldenRod Jeans",
        "subCategory": "Jeans",
        "color": "DeepSkyBlue",
        "imageUrl": "https://www.lorempixel.com/24/84"
      },
      {
        "_id": "68091594b59a29987a06bd75",
        "brand": "Gross, Watkins and Moreno",
        "name": "IndianRed Jeans",
        "subCategory": "Jeans",
        "color": "DarkOrange",
        "imageUrl": "https://placeimg.com/109/779/any"
      },
      {
        "_id": "68091594b59a29987a06bd7a",
        "brand": "Daniels, Jenkins and Lamb",
        "name": "YellowGreen Jeans",
        "subCategory": "Jeans",
        "color": "LightGreen",
        "imageUrl": "https://dummyimage.com/283x781"
      },
      {
        "_id": "68091594b59a29987a06bd7f",
        "brand": "Klein-Brown",
        "name": "Orchid Jeans",
        "subCategory": "Jeans",
        "color": "LightBlue",
        "imageUrl": "https://placeimg.com/495/15/any"
      },
      {
        "_id": "68091594b59a29987a06bd84",
        "brand": "Williams Group",
        "name": "MediumOrchid Jeans",
        "subCategory": "Jeans",
        "color": "DeepPink",
        "imageUrl": "https://placeimg.com/539/770/any"
      },
      {
        "_id": "68091594b59a29987a06bd86",
        "brand": "Howard-Hendricks",
        "name": "OldLace Jeans",
        "subCategory": "Jeans",
        "color": "Teal",
        "imageUrl": "https://placeimg.com/162/582/any"
      },
      {
        "_id": "68091594b59a29987a06bd88",
        "brand": "Munoz PLC",
        "name": "SpringGreen Jeans",
        "subCategory": "Jeans",
        "color": "Plum",
        "imageUrl": "https://www.lorempixel.com/428/252"
      },
      {
        "_id": "68091594b59a29987a06bd8d",
        "brand": "Johnson, Thomas and Stewart",
        "name": "FloralWhite Jeans",
        "subCategory": "Jeans",
        "color": "LightGray",
        "imageUrl": "https://placeimg.com/319/814/any"
      },
      {
        "_id": "68091594b59a29987a06bd92",
        "brand": "Chavez, Hudson and Brown",
        "name": "DarkOliveGreen Jeans",
        "subCategory": "Jeans",
        "color": "Gray",
        "imageUrl": "https://dummyimage.com/510x408"
      },
      {
        "_id": "68091594b59a29987a06bd94",
        "brand": "Mendoza-Ellis",
        "name": "MistyRose Jeans",
        "subCategory": "Jeans",
        "color": "Fuchsia",
        "imageUrl": "https://placeimg.com/546/422/any"
      },
      {
        "_id": "68091594b59a29987a06bda5",
        "brand": "Short Group",
        "name": "OliveDrab Khakis",
        "subCategory": "Khakis",
        "color": "MediumAquaMarine",
        "imageUrl": "https://www.lorempixel.com/437/915"
      },
      {
        "_id": "68091594b59a29987a06bdf9",
        "brand": "Walker-Brown",
        "name": "RosyBrown Trousers",
        "subCategory": "Trousers",
        "color": "Moccasin",
        "imageUrl": "https://www.lorempixel.com/629/8"
      },
      {
        "_id": "68091594b59a29987a06bdfc",
        "brand": "Adams, Hoover and Conner",
        "name": "DarkOliveGreen Trousers",
        "subCategory": "Trousers",
        "color": "Tan",
        "imageUrl": "https://placekitten.com/979/547"
      },
      {
        "_id": "68091594b59a29987a06be05",
        "brand": "Nunez, Black and Miller",
        "name": "MediumAquaMarine Trousers",
        "subCategory": "Trousers",
        "color": "DarkSlateBlue",
        "imageUrl": "https://www.lorempixel.com/663/140"
      },
      {
        "_id": "68091594b59a29987a06be0b",
        "brand": "Parker-Peterson",
        "name": "Bisque Trousers",
        "subCategory": "Trousers",
        "color": "LavenderBlush",
        "imageUrl": "https://placeimg.com/563/273/any"
      },
      {
        "_id": "68091594b59a29987a06be11",
        "brand": "Reynolds-Allen",
        "name": "IndianRed Trousers",
        "subCategory": "Trousers",
        "color": "Gold",
        "imageUrl": "https://placekitten.com/468/691"
      },
      {
        "_id": "68091594b59a29987a06be25",
        "brand": "Goodman-Ramos",
        "name": "GreenYellow Trousers",
        "subCategory": "Trousers",
        "color": "Turquoise",
        "imageUrl": "https://placekitten.com/572/317"
      },
      {
        "_id": "68091594b59a29987a06be27",
        "brand": "Jones-Carpenter",
        "name": "DarkSalmon Trousers",
        "subCategory": "Trousers",
        "color": "Cyan",
        "imageUrl": "https://www.lorempixel.com/10/930"
      },
      {
        "_id": "68091594b59a29987a06be2f",
        "brand": "Swanson Ltd",
        "name": "HotPink Trousers",
        "subCategory": "Trousers",
        "color": "Olive",
        "imageUrl": "https://dummyimage.com/686x145"
      },
      {
        "_id": "68091594b59a29987a06be34",
        "brand": "Munoz, Morris and Hernandez",
        "name": "DarkViolet Trousers",
        "subCategory": "Trousers",
        "color": "Peru",
        "imageUrl": "https://dummyimage.com/548x809"
      },
      {
        "_id": "68091594b59a29987a06be3f",
        "brand": "King PLC",
        "name": "Gold Trousers",
        "subCategory": "Trousers",
        "color": "Aquamarine",
        "imageUrl": "https://placekitten.com/363/72"
      },
      {
        "_id": "68091594b59a29987a06be47",
        "brand": "Evans-Cantu",
        "name": "Indigo Trousers",
        "subCategory": "Trousers",
        "color": "SeaShell",
        "imageUrl": "https://www.lorempixel.com/290/168"
      },
      {
        "_id": "68091594b59a29987a06be49",
        "brand": "Juarez, Morton and Johnson",
        "name": "Maroon Trousers",
        "subCategory": "Trousers",
        "color": "AliceBlue",
        "imageUrl": "https://placekitten.com/307/382"
      },
      {
        "_id": "68091594b59a29987a06be4d",
        "brand": "Mcgee, Benton and Moore",
        "name": "PaleTurquoise Leggings",
        "subCategory": "Leggings",
        "color": "DimGray",
        "imageUrl": "https://dummyimage.com/185x434"
      }
    ],
    "Sweater": [
      {
        "_id": "68091594b59a29987a06bee9",
        "brand": "Peterson, Holmes and Watkins",
        "name": "LightSeaGreen Cardigan",
        "subCategory": "Cardigan",
        "color": "Red",
        "imageUrl": "https://dummyimage.com/438x651"
      },
      {
        "_id": "68091594b59a29987a06beee",
        "brand": "Hill-Mendez",
        "name": "Green Cardigan",
        "subCategory": "Cardigan",
        "color": "Red",
        "imageUrl": "https://www.lorempixel.com/5/145"
      },
      {
        "_id": "68091594b59a29987a06befa",
        "brand": "Garner-Douglas",
        "name": "Linen Cardigan",
        "subCategory": "Cardigan",
        "color": "LightGray",
        "imageUrl": "https://www.lorempixel.com/122/392"
      },
      {
        "_id": "68091594b59a29987a06beff",
        "brand": "Jenkins-Fletcher",
        "name": "Moccasin Cardigan",
        "subCategory": "Cardigan",
        "color": "FloralWhite",
        "imageUrl": "https://placekitten.com/57/98"
      },
      {
        "_id": "68091594b59a29987a06bf05",
        "brand": "Garcia, Rodriguez and Scott",
        "name": "WhiteSmoke Cardigan",
        "subCategory": "Cardigan",
        "color": "MediumSeaGreen",
        "imageUrl": "https://placeimg.com/157/605/any"
      },
      {
        "_id": "68091594b59a29987a06bf0a",
        "brand": "Tran-Jones",
        "name": "YellowGreen Cardigan",
        "subCategory": "Cardigan",
        "color": "DimGray",
        "imageUrl": "https://placekitten.com/97/21"
      },
      {
        "_id": "68091594b59a29987a06bf19",
        "brand": "Daniel-Johnson",
        "name": "LightPink Cardigan",
        "subCategory": "Cardigan",
        "color": "LightCoral",
        "imageUrl": "https://placeimg.com/719/523/any"
      },
      {
        "_id": "68091594b59a29987a06bf2d",
        "brand": "Wang-Norris",
        "name": "DarkViolet Cardigan",
        "subCategory": "Cardigan",
        "color": "Tan",
        "imageUrl": "https://dummyimage.com/861x789"
      },
      {
        "_id": "68091594b59a29987a06bf32",
        "brand": "Stephenson, Rogers and Mcmahon",
        "name": "Turquoise Cardigan",
        "subCategory": "Cardigan",
        "color": "Aquamarine",
        "imageUrl": "https://dummyimage.com/370x310"
      }
    ],
    "Skirt": [],
    "Dress": [],
    "Shoes": [
      {
        "_id": "68091594b59a29987a06c226",
        "brand": "Baxter-Garcia",
        "name": "SandyBrown Tennis Shoes",
        "subCategory": "Tennis Shoes",
        "color": "LemonChiffon",
        "imageUrl": "https://placeimg.com/622/398/any"
      },
      {
        "_id": "68091594b59a29987a06c318",
        "brand": "Thomas-Schneider",
        "name": "AliceBlue Boot",
        "subCategory": "Boot",
        "color": "Coral",
        "imageUrl": "https://placekitten.com/568/297"
      },
      {
        "_id": "68091594b59a29987a06c324",
        "brand": "Colon and Sons",
        "name": "Gainsboro Boot",
        "subCategory": "Boot",
        "color": "Moccasin",
        "imageUrl": "https://placeimg.com/878/155/any"
      },
      {
        "_id": "68091594b59a29987a06c333",
        "brand": "Wilson LLC",
        "name": "DarkSlateGray Boot",
        "subCategory": "Boot",
        "color": "DodgerBlue",
        "imageUrl": "https://placeimg.com/807/1011/any"
      },
      {
        "_id": "68091594b59a29987a06c335",
        "brand": "Mccoy-Morgan",
        "name": "Lavender Boot",
        "subCategory": "Boot",
        "color": "PaleTurquoise",
        "imageUrl": "https://placekitten.com/479/635"
      },
      {
        "_id": "68091594b59a29987a06c33d",
        "brand": "Green-Page",
        "name": "MediumSlateBlue Boot",
        "subCategory": "Boot",
        "color": "DarkGray",
        "imageUrl": "https://placeimg.com/748/629/any"
      },
      {
        "_id": "68091594b59a29987a06c35a",
        "brand": "Ramirez, Sanford and Gibson",
        "name": "Maroon Boot",
        "subCategory": "Boot",
        "color": "Gray",
        "imageUrl": "https://placeimg.com/820/736/any"
      },
      {
        "_id": "68091594b59a29987a06c35c",
        "brand": "Powell-Rogers",
        "name": "DarkTurquoise Boot",
        "subCategory": "Boot",
        "color": "RosyBrown",
        "imageUrl": "https://dummyimage.com/289x123"
      },
      {
        "_id": "68091594b59a29987a06c35e",
        "brand": "Fernandez-King",
        "name": "Indigo Boot",
        "subCategory": "Boot",
        "color": "Brown",
        "imageUrl": "https://placeimg.com/336/52/any"
      }
    ],
    "Jacket": [
      {
        "_id": "68091594b59a29987a06c378",
        "brand": "Hughes Inc",
        "name": "DarkRed Winter",
        "subCategory": "Winter",
        "color": "LawnGreen",
        "imageUrl": "https://placekitten.com/263/476"
      },
      {
        "_id": "68091594b59a29987a06c37d",
        "brand": "Graham-Gill",
        "name": "DarkGreen Winter",
        "subCategory": "Winter",
        "color": "GhostWhite",
        "imageUrl": "https://www.lorempixel.com/1023/723"
      },
      {
        "_id": "68091594b59a29987a06c37f",
        "brand": "Miller-Moore",
        "name": "Green Winter",
        "subCategory": "Winter",
        "color": "Sienna",
        "imageUrl": "https://placeimg.com/635/839/any"
      },
      {
        "_id": "68091594b59a29987a06c390",
        "brand": "Robinson LLC",
        "name": "OrangeRed Winter",
        "subCategory": "Winter",
        "color": "Tomato",
        "imageUrl": "https://placeimg.com/362/70/any"
      },
      {
        "_id": "68091594b59a29987a06c395",
        "brand": "Ross, Powell and Fields",
        "name": "White Winter",
        "subCategory": "Winter",
        "color": "Azure",
        "imageUrl": "https://placeimg.com/452/757/any"
      },
      {
        "_id": "68091594b59a29987a06c3ac",
        "brand": "Soto Group",
        "name": "DeepPink Winter",
        "subCategory": "Winter",
        "color": "PaleVioletRed",
        "imageUrl": "https://placeimg.com/167/511/any"
      },
      {
        "_id": "68091594b59a29987a06c3ae",
        "brand": "Frost, Logan and White",
        "name": "LightSeaGreen Winter",
        "subCategory": "Winter",
        "color": "SpringGreen",
        "imageUrl": "https://www.lorempixel.com/684/986"
      },
      {
        "_id": "68091594b59a29987a06c3b3",
        "brand": "Garcia PLC",
        "name": "Peru Winter",
        "subCategory": "Winter",
        "color": "Chartreuse",
        "imageUrl": "https://placeimg.com/821/116/any"
      },
      {
        "_id": "68091594b59a29987a06c3b5",
        "brand": "Garcia, Williams and Rose",
        "name": "SteelBlue Winter",
        "subCategory": "Winter",
        "color": "AntiqueWhite",
        "imageUrl": "https://placeimg.com/291/46/any"
      },
      {
        "_id": "68091594b59a29987a06c3b7",
        "brand": "Jones, Rogers and Hill",
        "name": "Cornsilk Winter",
        "subCategory": "Winter",
        "color": "LightSlateGray",
        "imageUrl": "https://www.lorempixel.com/906/928"
      }
    ]
  }
};

// Test data with shorts for specific validation
const shortsTestData = {
  ...fullTestData,
  recommendations: {
    ...fullTestData.recommendations,
    Pants: [
      {
        "_id": "shorts123",
        "brand": "Test Brand",
        "name": "Test Shorts",
        "subCategory": "Shorts",
        "color": "Blue",
        "imageUrl": "https://example.com/shorts.jpg"
      }
    ]
  }
};

// Function to generate multiple outfits and track uniqueness
function generateMultipleOutfits(data, count) {
  console.log(`\nGenerating ${count} outfits...`);
  
  const outfits = [];
  const uniqueBottoms = new Set();
  const uniqueShoes = new Set();
  const uniqueJackets = new Set();
  const uniqueShirts = new Set();
  const uniqueSweaters = new Set();
  
  for (let i = 0; i < count; i++) {
    const result = generateOutfitRecommendation(data);
    
    if (result.success) {
      outfits.push(result.outfit);
      
      // Track unique items
      if (result.outfit.bottomItem) {
        uniqueBottoms.add(result.outfit.bottomItem.item._id);
      }
      
      if (result.outfit.shoes) {
        uniqueShoes.add(result.outfit.shoes._id);
      }
      
      if (result.outfit.jacket) {
        uniqueJackets.add(result.outfit.jacket._id);
      }
      
      result.outfit.topItems.forEach(top => {
        if (top.category === 'Shirt') {
          uniqueShirts.add(top.item._id);
        } else if (top.category === 'Sweater') {
          uniqueSweaters.add(top.item._id);
        }
      });
    } else {
      console.log(`Failed to generate outfit: ${result.message}`);
      i--; // Try again
    }
  }
  
  return {
    outfits,
    stats: {
      uniqueBottoms: uniqueBottoms.size,
      uniqueShoes: uniqueShoes.size,
      uniqueJackets: uniqueJackets.size,
      uniqueShirts: uniqueShirts.size,
      uniqueSweaters: uniqueSweaters.size
    }
  };
}

// Function to print a simple representation of an outfit
function printOutfit(outfit, index) {
  console.log(`\n---- Outfit ${index + 1} ----`);
  
  if (outfit.bottomItem) {
    console.log(`Bottom: ${outfit.bottomItem.category} - ${outfit.bottomItem.item.name} (${outfit.bottomItem.item.subCategory})`);
  }
  
  outfit.topItems.forEach(top => {
    console.log(`Top: ${top.category} - ${top.item.name} (${top.item.subCategory})`);
  });
  
  if (outfit.shoes) {
    console.log(`Shoes: ${outfit.shoes.name} (${outfit.shoes.subCategory})`);
  }
  
  if (outfit.jacket) {
    console.log(`Jacket: ${outfit.jacket.name} (${outfit.jacket.subCategory})`);
  }
}

// Function to validate that shorts and winter jackets aren't combined
function validateNoShortsWithWinterJacket(outfit) {
  const hasShorts = outfit.bottomItem && 
                    outfit.bottomItem.item.subCategory === 'Shorts';
  
  const hasWinterJacket = outfit.jacket && 
                          outfit.jacket.subCategory === 'Winter';
  
  if (hasShorts && hasWinterJacket) {
    console.error('INVALID COMBINATION: Shorts with Winter jacket!');
    return false;
  }
  
  return true;
}

// Run the tests
console.log("OUTFIT RECOMMENDATION TESTS");
console.log("==========================");

try {
  // Test 1: Generate outfits with full data
  const fullResults = generateMultipleOutfits(fullTestData, 10);
  console.log("\nFull Dataset Outfit Results:");
  fullResults.outfits.forEach(printOutfit);
  console.log("\nUnique items stats:", fullResults.stats);
  
  // Test 2: Specifically test shorts and winter jacket restriction
  console.log("\n\nTESTING SHORTS + WINTER JACKET RESTRICTION");
  console.log("=========================================");
  
  const shortsResults = generateMultipleOutfits(shortsTestData, 15);
  console.log("\nShorts Test Results:");
  
  // Validate each outfit for the shorts + winter jacket restriction
  let validCount = 0;
  shortsResults.outfits.forEach((outfit, index) => {
    printOutfit(outfit, index);
    const isValid = validateNoShortsWithWinterJacket(outfit);
    if (isValid) validCount++;
  });
  
  console.log(`\nValidation Results: ${validCount}/${shortsResults.outfits.length} outfits are valid`);
  console.log("All outfits should be valid - no shorts should be paired with winter jackets");
  
  console.log("\n==========================");
  console.log("All tests completed!");
} catch (error) {
  console.error("Error running tests:", error);
} 