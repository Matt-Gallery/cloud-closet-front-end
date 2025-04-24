import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { getWeatherBasedRecommendations, saveOutfitRating } from "../../services/outfitService.js";
import { generateOutfitRecommendation } from "../../services/recommendationService.js";
import getWeatherIcon from "../../utils/weatherIcons.js";
import getClothingIcon from "../../utils/clothingIcons.js";
import * as weatherService from "../Weather/weatherService.jsx";
import "./OutfitRecommendation.css";

function OutfitRecommendation() {
  const { user } = useContext(UserContext);
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
      
      // Use test userId for now
      const testUserId = "65fb942d45c5b0b3e21cb6a0";
      
      // Format weather data for the API call
      const weatherData = {
        temperature: weather.temperature,
        main: weather.condition,
        humidity: weather.humidity || 65, // Default if not available
        wind: weather.windSpeed || 4.5,    // Default if not available
        precip_mm: weather.precipitation || 0.5, // Default if not available
        uv: weather.uvIndex || 3.2              // Default if not available
      };
      
      // Make the API call
      const data = await getWeatherBasedRecommendations(weatherData, testUserId);
      console.log("API response:", data);
      
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
    
    const bottoms = [];
    if (recommendations.Pants) {
      recommendations.Pants.forEach(item => {
        bottoms.push({ category: "Pants", item });
      });
    }
    if (recommendations.Skirt) {
      recommendations.Skirt.forEach(item => {
        bottoms.push({ category: "Skirt", item });
      });
    }
    if (recommendations.Dress) {
      recommendations.Dress.forEach(item => {
        bottoms.push({ category: "Dress", item });
      });
    }
    
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
    if (availableOptions.tops.length === 0) return;
    
    const newIndex = (currentIndices.topIndex + 1) % availableOptions.tops.length;
    setCurrentIndices({
      ...currentIndices,
      topIndex: newIndex
    });
    
    // Update outfit with new top
    if (outfit) {
      const newOutfit = { ...outfit };
      const topItem = availableOptions.tops[newIndex];
      newOutfit.topItems = [topItem];
      setOutfit(newOutfit);
    }
  };

  const cycleBottom = () => {
    if (availableOptions.bottoms.length === 0) return;
    
    const newIndex = (currentIndices.bottomIndex + 1) % availableOptions.bottoms.length;
    setCurrentIndices({
      ...currentIndices,
      bottomIndex: newIndex
    });
    
    // Update outfit with new bottom
    if (outfit) {
      const newOutfit = { ...outfit };
      const bottomItem = availableOptions.bottoms[newIndex];
      newOutfit.bottomItem = bottomItem;
      setOutfit(newOutfit);
    }
  };

  const cycleShoes = () => {
    if (availableOptions.shoes.length === 0) return;
    
    const newIndex = (currentIndices.shoesIndex + 1) % availableOptions.shoes.length;
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
    if (availableOptions.jackets.length === 0) return;
    
    const newIndex = (currentIndices.jacketIndex + 1) % availableOptions.jackets.length;
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
        setRatingError("You must be logged in to rate outfits");
        return;
      }
      
      if (!outfit) {
        setRatingError("No outfit to rate");
        return;
      }
      
      // Get the item IDs from the current outfit
      const outfitData = {
        rating: starValue
      };
      
      // Get top ID (use shirt if available, otherwise first top)
      const shirtItem = findShirtItem();
      const topItem = shirtItem || (outfit.topItems && outfit.topItems.length > 0 ? outfit.topItems[0] : null);
      if (topItem) {
        outfitData.topId = topItem.item._id;
      }
      
      // Get bottom ID
      if (outfit.bottomItem) {
        outfitData.bottomId = outfit.bottomItem.item._id;
      }
      
      // Get shoes ID
      if (outfit.shoes) {
        outfitData.shoesId = outfit.shoes._id;
      }
      
      // Get accessory ID (not implemented yet)
      
      // Use test userId for now (should be replaced with actual user ID)
      const userId = user._id || "65fb942d45c5b0b3e21cb6a0";
      
      console.log("Sending outfit rating:", outfitData);
      
      // Save the rating
      const response = await saveOutfitRating(userId, outfitData);
      
      console.log("Rating saved:", response);
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
              {outfit.jacket && (
                <div className="jacket-container">
                  <div className="shape-container">
                    <div className="clothing-icon">
                      {getClothingIcon('Jacket', outfit.jacket.subCategory)}
                    </div>
                    <div className="item-label">
                      <p className="item-name">{outfit.jacket.name}</p>
                      <p className="item-category">{outfit.jacket.subCategory}</p>
                    </div>
                  </div>
                  <button className="cycle-btn small" onClick={cycleJacket}>→</button>
                </div>
              )}

              {/* Vertical stack (top, bottom, shoes) */}
              <div className="vertical-items">
                {/* Top (show either the shirt or the first top if no layers) */}
                {(bothTopLayers ? shirtItem : outfit.topItems[0]) && (
                  <div className="item-row">
                    <div className="shape-container">
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
                    <div className="shape-container">
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
                    <div className="shape-container">
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
              {bothTopLayers && sweaterItem && (
                <div className="sweater-container">
                  <div className="shape-container">
                    <div className="clothing-icon">
                      {getClothingIcon('Sweater', sweaterItem.item.subCategory)}
                    </div>
                    <div className="item-label">
                      <p className="item-name">{sweaterItem.item.name}</p>
                      <p className="item-category">{sweaterItem.item.subCategory}</p>
                    </div>
                  </div>
                  <button className="cycle-btn small" onClick={cycleTop}>→</button>
                </div>
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
          </>
        )}
      </div>
    </div>
  );
}

export default OutfitRecommendation;
