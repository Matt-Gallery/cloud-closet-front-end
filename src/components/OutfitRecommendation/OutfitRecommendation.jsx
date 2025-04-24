import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { getWeatherBasedRecommendations } from "../../services/outfitService.js";
import { generateOutfitRecommendation } from "../../services/recommendationService.js";
import "./OutfitRecommendation.css";

function OutfitRecommendation({ weather }) {
  const { user } = useContext(UserContext);
  const [recommendationsData, setRecommendationsData] = useState(null);
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  
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

  // Updated to use the actual API call instead of mockData
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
        uv: weather.uv || 3.2              // Default if not available
      };
      
      // Make the actual API call
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

  const handleStarHover = (starValue) => {
    setHoveredStar(starValue);
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
    // Here you could add functionality to save the rating to your backend
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

  if (loading) {
    return <div className="loading">Loading outfit recommendations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!outfit) {
    return <div>No outfit recommendations available</div>;
  }

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
                <div>{weather.condition}</div>
              </div>
            </div>
          )}
          
          <button className="regenerate-btn" onClick={fetchRecommendations}>
            Re-generate
          </button>
        </div>
        
        <div className="outfit-section">
          <div className="outfit-item">
            {outfit.topItems && outfit.topItems.length > 0 && (
              <div className="top-item">
                <img 
                  src={outfit.topItems[0].item.imageUrl} 
                  alt={outfit.topItems[0].item.name} 
                />
                <button className="cycle-btn" onClick={cycleTop}>→</button>
              </div>
            )}
          </div>
          
          <div className="outfit-item">
            {outfit.bottomItem && (
              <div className="bottom-item">
                <img 
                  src={outfit.bottomItem.item.imageUrl} 
                  alt={outfit.bottomItem.item.name} 
                />
                <button className="cycle-btn" onClick={cycleBottom}>→</button>
              </div>
            )}
          </div>
          
          <div className="outfit-item">
            {outfit.shoes && (
              <div className="shoes-item">
                <img 
                  src={outfit.shoes.imageUrl} 
                  alt={outfit.shoes.name} 
                />
                <button className="cycle-btn" onClick={cycleShoes}>→</button>
              </div>
            )}
          </div>
          
          {outfit.jacket && (
            <div className="outfit-item">
              <div className="jacket-item">
                <img 
                  src={outfit.jacket.imageUrl} 
                  alt={outfit.jacket.name} 
                />
                <button className="cycle-btn" onClick={cycleJacket}>→</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="rating-section">
          <div className="rating-label">Rate this</div>
          <div className="star-rating">
            {renderStarRating()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutfitRecommendation;
