import { useState, useEffect, useContext } from "react";
import { useUser } from "../../contexts/UserContext";
import { getWeatherBasedRecommendations, saveOutfitRating } from "../../services/outfitService.js";
import { generateOutfitRecommendation } from "../../services/recommendationService.js";
import { getUserItems } from "../../services/itemService.js";
import getWeatherIcon from "../../utils/weatherIcons.js";
import getClothingIcon from "../../utils/clothingIcons.jsx";
import * as weatherService from "../Weather/weatherService.jsx";
import ItemSelectionPanel from "./ItemSelectionPanel.jsx";
import "./OutfitRecommendation.css";
import { jwtDecode } from 'jwt-decode';

function OutfitRecommendation() {
  const { user } = useUser();
  const [recommendationsData, setRecommendationsData] = useState(null);
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [ratingError, setRatingError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  // User closet items
  const [closetItems, setClosetItems] = useState([]);
  const [closetLoading, setClosetLoading] = useState(false);
  
  // Item selection panel state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showItemPanel, setShowItemPanel] = useState(false);
  
  // For cycling through different options for each item type
  const [availableOptions, setAvailableOptions] = useState({
    tops: [],
    bottoms: [],
    shoes: [],
    jackets: []
  });
  
  const [currentIndices, setCurrentIndices] = useState({
    topIndex: 0,
    bottomIndex: 0,
    shoesIndex: 0,
    jacketIndex: 0
  });

  // Fetch weather based on geolocation when component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      setWeatherLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          try {
            const data = await weatherService.display(coords);
            updateWeather(data);
          } catch (err) {
            console.error("Error fetching weather:", err);
          } finally {
            setWeatherLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setWeatherLoading(false);
        }
      );
    }
  }, []);

  // Update weather data
  const updateWeather = (data) => {
    if (!data || !data.current || !data.location) return;
    
    const newWeather = {
      location: data.location.name,
      temperature: data.current.temp_f,
      condition: data.current.condition.text,
      precipitation: data.current.precip_mm,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_mph,
      uvIndex: data.current.uv
    };
    
    setWeather(newWeather);
  };

  // Handle city search
  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    setWeatherLoading(true);
    try {
      const data = await weatherService.display(city);
      updateWeather(data);
    } catch (err) {
      console.error("Error fetching weather for city:", err);
    } finally {
      setWeatherLoading(false);
      setCity("");
    }
  };

  // Fetch initial recommendations data
  useEffect(() => {
    if (weather) {
      fetchRecommendations();
    }
  }, [weather]);

  // Generate a new outfit when recommendations data changes
  useEffect(() => {
    if (recommendationsData) {
      generateNewOutfit();
      prepareAvailableOptions();
    }
  }, [recommendationsData]);

  // Reset rating when outfit changes
  useEffect(() => {
    if (outfit) {
      setRating(0);
      setRatingSuccess(false);
      setRatingError(null);
    }
  }, [outfit]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Format weather data for the API call
      const weatherData = {
        temperature: weather.temperature,
        main: weather.condition,
        humidity: weather.humidity || 65,
        wind: weather.windSpeed || 4.5,
        precip_mm: weather.precipitation || 0.5,
        uv: weather.uvIndex || 3.2
      };
      
      // Make the API call with user ID
      const data = await getWeatherBasedRecommendations(weatherData, user._id);
      
      setRecommendationsData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.message || "Failed to get outfit recommendations");
      setLoading(false);
    }
  };

  const generateNewOutfit = () => {
    try {
      const generatedOutfit = generateOutfitRecommendation(recommendationsData);
      if (generatedOutfit.success) {
        setOutfit(generatedOutfit.outfit);
      } else {
        setError(generatedOutfit.message || "Could not generate outfit");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error generating outfit:", err);
      setError("Failed to generate outfit");
      setLoading(false);
    }
  };

  const prepareAvailableOptions = () => {
    if (!recommendationsData || !recommendationsData.recommendations) return;
    
    const { recommendations } = recommendationsData;
    
    // Get all available options from the recommendations data
    const tops = [];
    if (recommendations.Shirt) {
      recommendations.Shirt.forEach(item => {
        tops.push({ category: "Shirt", item });
      });
    }
    if (recommendations.Sweater) {
      recommendations.Sweater.forEach(item => {
        tops.push({ category: "Sweater", item });
      });
    }
    
    // Group bottoms by type to make cycling more logical
    const dresses = [];
    const pants = [];
    const skirts = [];
    
    if (recommendations.Dress) {
      recommendations.Dress.forEach(item => {
        dresses.push({ category: "Dress", item });
      });
    }
    
    if (recommendations.Pants) {
      recommendations.Pants.forEach(item => {
        pants.push({ category: "Pants", item });
      });
    }
    
    if (recommendations.Skirt) {
      recommendations.Skirt.forEach(item => {
        skirts.push({ category: "Skirt", item });
      });
    }
    
    // Combine bottoms in a logical order: all dresses first, then pants and skirts
    const bottoms = [...dresses, ...pants, ...skirts];
    
    const shoes = recommendations.Shoes || [];
    const jackets = recommendations.Jacket || [];
    
    setAvailableOptions({
      tops,
      bottoms,
      shoes,
      jackets
    });
  };

  const cycleTop = () => {
    if (availableOptions.tops.length <= 1) return;
    
    // Get current top information
    const currentTopItem = outfit.topItems && outfit.topItems.length > 0 ? outfit.topItems[0] : null;
    const currentIsCardigan = currentTopItem && currentTopItem.category === "Sweater" && 
                             currentTopItem.item.subCategory === "Cardigan";
    
    // Separate shirts and sweaters for proper layering
    const shirts = availableOptions.tops.filter(item => item.category === "Shirt");
    const cardigans = availableOptions.tops.filter(item => 
      item.category === "Sweater" && item.item.subCategory === "Cardigan");
    const otherSweaters = availableOptions.tops.filter(item => 
      item.category === "Sweater" && item.item.subCategory !== "Cardigan");
    
    // Update outfit with new top
    if (outfit) {
      const newOutfit = { ...outfit };
      let newTopItems = [];
      
      // Randomly decide what combination to show
      const randomOption = Math.floor(Math.random() * 3);
      
      if (randomOption === 0 && shirts.length > 0) {
        // Option 1: Just a shirt
        const randomShirt = shirts[Math.floor(Math.random() * shirts.length)];
        newTopItems = [randomShirt];
        
        // 50% chance to add a cardigan if available
        if (cardigans.length > 0 && Math.random() > 0.5) {
          const randomCardigan = cardigans[Math.floor(Math.random() * cardigans.length)];
          newTopItems.push(randomCardigan);
        }
      } 
      else if (randomOption === 1 && otherSweaters.length > 0) {
        // Option 2: Just a non-cardigan sweater
        const randomSweater = otherSweaters[Math.floor(Math.random() * otherSweaters.length)];
        newTopItems = [randomSweater];
      }
      else if (randomOption === 2 && shirts.length > 0 && otherSweaters.length > 0) {
        // Option 3: Shirt and sweater (not cardigan)
        const randomShirt = shirts[Math.floor(Math.random() * shirts.length)];
        const randomSweater = otherSweaters[Math.floor(Math.random() * otherSweaters.length)];
        newTopItems = [randomShirt, randomSweater];
      }
      else if (shirts.length > 0) {
        // Fallback to just a shirt if other options not available
        const randomShirt = shirts[Math.floor(Math.random() * shirts.length)];
        newTopItems = [randomShirt];
      }
      else if (otherSweaters.length > 0) {
        // Fallback to just a non-cardigan sweater if shirts not available
        const randomSweater = otherSweaters[Math.floor(Math.random() * otherSweaters.length)];
        newTopItems = [randomSweater];
      }
      
      // Only update if we found a valid combination
      if (newTopItems.length > 0) {
        newOutfit.topItems = newTopItems;
        setOutfit(newOutfit);
        
        // Update top index - not really needed since we're randomizing anyway
        // but kept for state consistency
        const newTopIndex = availableOptions.tops.findIndex(
          item => item.category === newTopItems[0].category && 
                 item.item._id === newTopItems[0].item._id
        );
        
        if (newTopIndex !== -1) {
          setCurrentIndices(prev => ({
            ...prev,
            topIndex: newTopIndex
          }));
        }
      }
    }
  };

  const cycleBottom = () => {
    if (availableOptions.bottoms.length <= 1) return;
    
    // Find all indices of the same category as current bottom
    const currentCategory = outfit.bottomItem?.category;
    const sameCategory = availableOptions.bottoms
      .map((item, index) => item.category === currentCategory ? index : -1)
      .filter(index => index !== -1 && index !== currentIndices.bottomIndex);
    
    // If we have items of the same category, prioritize those
    let newIndex;
    if (sameCategory.length > 0) {
      // Choose random item from same category
      newIndex = sameCategory[Math.floor(Math.random() * sameCategory.length)];
    } else {
      // Otherwise get a random index different from the current one
      do {
        newIndex = Math.floor(Math.random() * availableOptions.bottoms.length);
      } while (newIndex === currentIndices.bottomIndex);
    }
    
    setCurrentIndices({
      ...currentIndices,
      bottomIndex: newIndex
    });
    
    // Update outfit with new bottom
    if (outfit) {
      const newOutfit = { ...outfit };
      const bottomItem = availableOptions.bottoms[newIndex];
      const currentBottomCategory = outfit.bottomItem?.category;
      const newBottomCategory = bottomItem.category;
      
      // Check if transitioning from a dress to pants/skirt
      if (currentBottomCategory === "Dress" && newBottomCategory !== "Dress") {
        // If moving from a dress to pants/skirt, we need to add a top
        if (availableOptions.tops.length > 0 && (!newOutfit.topItems || newOutfit.topItems.length === 0)) {
          // Add random available top
          const randomTopIndex = Math.floor(Math.random() * availableOptions.tops.length);
          newOutfit.topItems = [availableOptions.tops[randomTopIndex]];
          // Update top index
          setCurrentIndices(prev => ({
            ...prev,
            topIndex: randomTopIndex
          }));
        }
      }
      
      // If transitioning to a dress, clear tops
      if (newBottomCategory === "Dress") {
        newOutfit.topItems = [];
      }
      
      newOutfit.bottomItem = bottomItem;
      setOutfit(newOutfit);
    }
  };

  const cycleShoes = () => {
    if (availableOptions.shoes.length <= 1) return;
    
    // Get a random index different from the current one
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * availableOptions.shoes.length);
    } while (newIndex === currentIndices.shoesIndex);
    
    setCurrentIndices({
      ...currentIndices,
      shoesIndex: newIndex
    });
    
    // Update outfit with new shoes
    if (outfit) {
      const newOutfit = { ...outfit };
      newOutfit.shoes = availableOptions.shoes[newIndex];
      setOutfit(newOutfit);
    }
  };

  const cycleJacket = () => {
    if (availableOptions.jackets.length <= 1) return;
    
    // Get a random index different from the current one
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * availableOptions.jackets.length);
    } while (newIndex === currentIndices.jacketIndex);
    
    setCurrentIndices({
      ...currentIndices,
      jacketIndex: newIndex
    });
    
    // Update outfit with new jacket
    if (outfit) {
      const newOutfit = { ...outfit };
      newOutfit.jacket = availableOptions.jackets[newIndex];
      setOutfit(newOutfit);
    }
  };

  // Helper functions to find specific top types from outfit.topItems
  const findShirtItem = () => {
    if (!outfit || !outfit.topItems || outfit.topItems.length === 0) return null;
    return outfit.topItems.find(item => item.category === "Shirt");
  };
  
  const findSweaterItem = () => {
    if (!outfit || !outfit.topItems || outfit.topItems.length === 0) return null;
    return outfit.topItems.find(item => item.category === "Sweater");
  };
  
  const hasBothShirtAndSweater = () => {
    return findShirtItem() && findSweaterItem();
  };

  const handleStarHover = (starValue) => {
    setHoveredStar(starValue);
  };

  const handleStarClick = async (starValue) => {
    try {
      setRating(starValue);
      setRatingSuccess(false);
      setRatingError(null);
      
      if (!user) {
        setRatingError("Please sign in to save ratings");
        return;
      }
      
      if (!outfit) {
        setRatingError("No outfit to rate");
        return;
      }
      
      // Create an object that matches the outfitSchema structure
      const outfitData = {
        rating: starValue,
        userId: user._id
      };
      
      // Get top ID (use shirt if available, otherwise first top)
      const shirtItem = findShirtItem();
      const topItem = shirtItem || (outfit.topItems && outfit.topItems.length > 0 ? outfit.topItems[0] : null);
      if (topItem && topItem.item && topItem.item._id) {
        outfitData.topId = topItem.item._id;
      }
      
      // Get sweater ID if available
      const sweaterItem = findSweaterItem();
      if (sweaterItem && sweaterItem.item && sweaterItem.item._id) {
        outfitData.sweaterId = sweaterItem.item._id;
      }
      
      // Get bottom ID
      if (outfit.bottomItem && outfit.bottomItem.item && outfit.bottomItem.item._id) {
        outfitData.bottomId = outfit.bottomItem.item._id;
      }
      
      // Get shoes ID
      if (outfit.shoes && outfit.shoes._id) {
        outfitData.shoesId = outfit.shoes._id;
      }
      
      // Get jacket ID
      if (outfit.jacket && outfit.jacket._id) {
        outfitData.jacketId = outfit.jacket._id;
      }
      
      // Save the rating
      const response = await saveOutfitRating(user._id, outfitData);
      setRatingSuccess(true);
      
    } catch (err) {
      console.error("Error saving rating:", err);
      setRatingError(err.message || "Failed to save rating");
    }
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= (hoveredStar || rating) ? 'filled' : 'empty'}`}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={() => handleStarHover(0)}
          onClick={() => handleStarClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Fetch user's closet items
  useEffect(() => {
    if (user && user._id) {
      fetchClosetItems();
    }
  }, [user]);
  
  const fetchClosetItems = async () => {
    try {
      setClosetLoading(true);
      const items = await getUserItems(user._id);
      console.log("Fetched closet items:", items);
      
      // Ensure we're handling both array and object responses
      const itemsArray = Array.isArray(items) ? items : 
                        (items && items.items ? items.items : []);
                        
      setClosetItems(itemsArray);
    } catch (error) {
      console.error("Failed to fetch closet items:", error);
    } finally {
      setClosetLoading(false);
    }
  };
  
  // Handle clicking on an item to open the selection panel
  const handleItemClick = (category, type) => {
    setSelectedCategory(category);
    setShowItemPanel(true);
  };
  
  // Handle selecting a replacement item from the panel
  const handleSelectItem = (item) => {
    if (!outfit) return;
    
    const newOutfit = { ...outfit };
    
    // Replace the appropriate item based on category
    switch (selectedCategory) {
      case "Shirt":
      case "Sweater":
        // If the outfit has a Sweater and you're replacing a Shirt (or vice versa),
        // we need to keep the other item
        const otherTopItems = newOutfit.topItems ? 
          newOutfit.topItems.filter(topItem => 
            topItem.category !== selectedCategory
          ) : [];
        
        // Add the new item
        newOutfit.topItems = [...otherTopItems, { category: selectedCategory, item }];
        break;
        
      case "Pants":
      case "Skirt":
      case "Dress":
        newOutfit.bottomItem = { category: selectedCategory, item };
        
        // Clear tops if switching to a dress
        if (selectedCategory === "Dress") {
          newOutfit.topItems = [];
        }
        // Add a top if switching from a dress to pants/skirt and no tops exist
        else if (!newOutfit.topItems || newOutfit.topItems.length === 0) {
          // Find a shirt in closet items
          const shirts = closetItems.filter(item => item.category === "Shirt");
          if (shirts.length > 0) {
            const randomShirt = shirts[Math.floor(Math.random() * shirts.length)];
            newOutfit.topItems = [{ category: "Shirt", item: randomShirt }];
          }
        }
        break;
        
      case "Shoes":
        newOutfit.shoes = item;
        break;
        
      case "Jacket":
        newOutfit.jacket = item;
        break;
        
      default:
        break;
    }
    
    setOutfit(newOutfit);
    setShowItemPanel(false);
  };
  
  // Close the selection panel
  const handleClosePanel = () => {
    setShowItemPanel(false);
  };

  // Handle removing an optional item (jacket or sweater)
  const handleRemoveItem = (itemType) => {
    if (!outfit) return;
    
    const newOutfit = { ...outfit };
    
    if (itemType === "Jacket") {
      newOutfit.jacket = null;
    } else if (itemType === "Sweater") {
      // Find and remove only the sweater from topItems
      newOutfit.topItems = newOutfit.topItems.filter(item => item.category !== "Sweater");
    }
    
    setOutfit(newOutfit);
  };
  
  // Handle adding an optional item that isn't in the current outfit
  const handleAddOptionalItem = (itemType) => {
    setSelectedCategory(itemType);
    setShowItemPanel(true);
  };

  if (loading && !weather) {
    return <div className="loading">Loading weather data...</div>;
  }

  const shirtItem = findShirtItem();
  const sweaterItem = findSweaterItem();
  const bothTopLayers = hasBothShirtAndSweater();

  return (
    <div className="outfit-recommendation-container">
      <div className="outfit-header">
        <h1>Outfit Generated</h1>
      </div>
      
      <div className="outfit-content">
        <div className="weather-section">
          {weather && (
            <div className="weather-info">
              <div className="location">{weather.location}</div>
              <div className="weather-details">
                <div>{weather.temperature}°F</div>
                <div className="weather-condition">
                  <span className="weather-icon">{getWeatherIcon(weather.condition)}</span>
                  <span className="weather-text">{weather.condition}</span>
                </div>
                <div className="weather-extended">
                  <div>Precipitation: {weather.precipitation} mm</div>
                  <div>Humidity: {weather.humidity}%</div>
                  <div>Wind: {weather.windSpeed} mph</div>
                  <div>UV Index: {weather.uvIndex}</div>
                </div>
              </div>
              
              <form className="location-form" onSubmit={handleCitySearch}>
                <input
                  type="text"
                  placeholder="Change location..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={weatherLoading}
                />
                <button 
                  type="submit" 
                  className="location-btn"
                  disabled={weatherLoading || !city.trim()}
                >
                  {weatherLoading ? "Loading..." : "Update"}
                </button>
              </form>
            </div>
          )}
          
          <button 
            className="regenerate-btn" 
            onClick={fetchRecommendations}
            disabled={loading || !weather}
          >
            {loading ? "Generating..." : "Re-generate"}
          </button>
        </div>
        
        {!weather ? (
          <div className="weather-loading">Loading weather data...</div>
        ) : loading ? (
          <div className="loading">Generating outfit recommendations...</div>
        ) : error ? (
          <div className="error-container">
            <div className="error">Error: {error}</div>
            <button 
              className="regenerate-btn" 
              onClick={fetchRecommendations}
            >
              Try Again
            </button>
          </div>
        ) : !outfit ? (
          <div>No outfit recommendations available</div>
        ) : (
          <>
            <div className="outfit-layout">
              {/* Outerwear (left of top) */}
              {outfit.jacket ? (
                <div className="jacket-container">
                  <div 
                    className="shape-container clickable"
                    onClick={() => handleItemClick("Jacket")}
                  >
                    <div className="clothing-icon">
                      {getClothingIcon('Jacket', outfit.jacket.subCategory)}
                    </div>
                    <div className="item-label">
                      <p className="item-name">{outfit.jacket.name}</p>
                      <p className="item-category">{outfit.jacket.subCategory}</p>
                    </div>
                  </div>
                  <div className="item-controls">
                    <button className="cycle-btn small" onClick={cycleJacket}>→</button>
                    <button className="remove-btn" onClick={() => handleRemoveItem("Jacket")}>✕</button>
                  </div>
                </div>
              ) : (
                <div className="add-item-container">
                  <button 
                    className="add-item-btn"
                    onClick={() => handleAddOptionalItem("Jacket")}
                  >
                    <span className="plus-icon">+</span>
                    <span>Add Jacket</span>
                  </button>
                </div>
              )}

              {/* Vertical stack (top, bottom, shoes) */}
              <div className="vertical-items">
                {/* Top (show either the shirt or the first top if no layers) */}
                {(bothTopLayers ? shirtItem : outfit.topItems?.[0]) && (
                  <div className="item-row">
                    <div 
                      className="shape-container clickable" 
                      onClick={() => handleItemClick(bothTopLayers ? shirtItem.category : outfit.topItems[0].category)}
                    >
                      <div className="clothing-icon">
                        {getClothingIcon(
                          bothTopLayers ? shirtItem.category : outfit.topItems[0].category,
                          bothTopLayers ? shirtItem.item.subCategory : outfit.topItems[0].item.subCategory
                        )}
                      </div>
                      <div className="item-label">
                        <p className="item-name">
                          {bothTopLayers 
                            ? shirtItem.item.name 
                            : outfit.topItems[0].item.name}
                        </p>
                        <p className="item-category">
                          {bothTopLayers 
                            ? shirtItem.item.subCategory 
                            : outfit.topItems[0].item.subCategory}
                        </p>
                      </div>
                    </div>
                    <button className="cycle-btn small" onClick={cycleTop}>→</button>
                  </div>
                )}
                
                {/* Bottom */}
                {outfit.bottomItem && (
                  <div className="item-row">
                    <div 
                      className="shape-container clickable"
                      onClick={() => handleItemClick(outfit.bottomItem.category)}
                    >
                      <div className="clothing-icon">
                        {getClothingIcon(
                          outfit.bottomItem.category,
                          outfit.bottomItem.item.subCategory
                        )}
                      </div>
                      <div className="item-label">
                        <p className="item-name">{outfit.bottomItem.item.name}</p>
                        <p className="item-category">{outfit.bottomItem.item.category}</p>
                      </div>
                    </div>
                    <button className="cycle-btn small" onClick={cycleBottom}>→</button>
                  </div>
                )}
                
                {/* Shoes */}
                {outfit.shoes && (
                  <div className="item-row">
                    <div 
                      className="shape-container clickable"
                      onClick={() => handleItemClick("Shoes")}
                    >
                      <div className="clothing-icon">
                        {getClothingIcon('Shoes', outfit.shoes.subCategory)}
                      </div>
                      <div className="item-label">
                        <p className="item-name">{outfit.shoes.name}</p>
                        <p className="item-category">{outfit.shoes.subCategory}</p>
                      </div>
                    </div>
                    <button className="cycle-btn small" onClick={cycleShoes}>→</button>
                  </div>
                )}
              </div>
              
              {/* Sweater to the right, only if both shirt and sweater are present */}
              {bothTopLayers && sweaterItem ? (
                <div className="sweater-container">
                  <div 
                    className="shape-container clickable"
                    onClick={() => handleItemClick("Sweater")}
                  >
                    <div className="clothing-icon">
                      {getClothingIcon('Sweater', sweaterItem.item.subCategory)}
                    </div>
                    <div className="item-label">
                      <p className="item-name">{sweaterItem.item.name}</p>
                      <p className="item-category">{sweaterItem.item.subCategory}</p>
                    </div>
                  </div>
                  <div className="item-controls">
                    <button className="cycle-btn small" onClick={cycleTop}>→</button>
                    <button className="remove-btn" onClick={() => handleRemoveItem("Sweater")}>✕</button>
                  </div>
                </div>
              ) : (
                outfit.bottomItem && outfit.bottomItem.category !== "Dress" && (
                  <div className="add-item-container">
                    <button 
                      className="add-item-btn"
                      onClick={() => handleAddOptionalItem("Sweater")}
                    >
                      <span className="plus-icon">+</span>
                      <span>Add Outer Layer</span>
                    </button>
                  </div>
                )
              )}
            </div>
            
            <div className="rating-section">
              <div className="rating-label">Rate this</div>
              <div className="star-rating">
                {renderStarRating()}
              </div>
              {ratingSuccess && <div className="rating-success">Rating saved!</div>}
              {ratingError && <div className="rating-error">{ratingError}</div>}
            </div>
            
            {/* Item Selection Panel */}
            {showItemPanel && (
              <>
                <div className="panel-overlay" onClick={handleClosePanel}></div>
                <ItemSelectionPanel
                  category={selectedCategory}
                  items={closetItems}
                  onSelectItem={handleSelectItem}
                  onClose={handleClosePanel}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OutfitRecommendation;
