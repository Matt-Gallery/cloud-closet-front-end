import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { index } from "../../services/userService.js";
import { getWeatherBasedRecommendations, getUserRecommendations } from "../../services/outfitService.js";
import { generateOutfitRecommendation } from "../../services/recommendationService.js";
import { Link } from "react-router";

function Dashboard({ weather }) {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await index();
      setUsers(fetchedUsers);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch outfit recommendations when weather data changes
  useEffect(() => {
    if (user && weather) {
      fetchOutfitRecommendations();
    }
  }, [weather, user]);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const fetchOutfitRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get user's saved recommendations
      if (user && user._id) {
        try {
          const savedRecommendations = await getUserRecommendations(user._id);
          if (savedRecommendations && savedRecommendations.recommendations) {
            const generatedOutfit = generateOutfitRecommendation(savedRecommendations);
            if (generatedOutfit.success) {
              setOutfit(generatedOutfit.outfit);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.log("No saved recommendations found, generating new ones");
        }
      }
      
      // If no saved recommendations or error, get new recommendations from weather
      if (weather) {
        const recommendationsData = await getWeatherBasedRecommendations(weather);
        const generatedOutfit = generateOutfitRecommendation(recommendationsData);
        if (generatedOutfit.success) {
          setOutfit(generatedOutfit.outfit);
        } else {
          setError(generatedOutfit.message || "Could not generate outfit");
        }
      }
    } catch (err) {
      console.error("Error fetching outfit recommendations:", err);
      setError("Failed to get outfit recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Welcome, {user?.username}</h1>
      
      {/* Weather information */}
      {weather && (
        <section className="weather-info">
          <h2>Current Weather</h2>
          <p>Location: {weather.location}</p>
          <p>Temperature: {weather.temperature}°F</p>
          <p>Condition: {weather.condition}</p>
        </section>
      )}
      
      {/* Outfit recommendations */}
      <section className="outfit-recommendations">
        <h2>Today's Outfit Recommendations</h2>
        {loading && <p>Loading your outfit recommendations...</p>}
        {error && <p className="error">{error}</p>}
        {outfit && !loading && (
          <div className="outfit-container">
            {outfit.topItems && outfit.topItems.length > 0 && (
              <div className="outfit-section">
                <h3>Top Items</h3>
                {outfit.topItems.map((item, index) => (
                  <div key={`top-${index}`} className="outfit-item">
                    <p>{item.category}: {item.item.name}</p>
                    {item.item.imageUrl && <img src={item.item.imageUrl} alt={item.item.name} />}
                  </div>
                ))}
              </div>
            )}
            
            {outfit.bottomItem && (
              <div className="outfit-section">
                <h3>Bottom</h3>
                <p>{outfit.bottomItem.category}: {outfit.bottomItem.item.name}</p>
                {outfit.bottomItem.item.imageUrl && (
                  <img src={outfit.bottomItem.item.imageUrl} alt={outfit.bottomItem.item.name} />
                )}
              </div>
            )}
            
            {outfit.shoes && (
              <div className="outfit-section">
                <h3>Shoes</h3>
                <p>{outfit.shoes.name}</p>
                {outfit.shoes.imageUrl && <img src={outfit.shoes.imageUrl} alt={outfit.shoes.name} />}
              </div>
            )}
            
            {outfit.jacket && (
              <div className="outfit-section">
                <h3>Jacket</h3>
                <p>{outfit.jacket.name}</p>
                {outfit.jacket.imageUrl && <img src={outfit.jacket.imageUrl} alt={outfit.jacket.name} />}
              </div>
            )}
          </div>
        )}
        
        {!outfit && !loading && !error && weather && (
          <button onClick={fetchOutfitRecommendations}>
            Get Outfit Recommendations
          </button>
        )}
      </section>
      
      <div className="users-list">
        <h2>Users</h2>
        {users.map((person) => (
          <Link key={person._id} to={`/users/${person._id}`}>
            <p>{person.username}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;