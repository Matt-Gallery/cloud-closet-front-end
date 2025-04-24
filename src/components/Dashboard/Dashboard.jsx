import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { index } from "../../services/userService.js";
import { getUserRecommendations } from "../../services/outfitService.js";
import { Link } from "react-router";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
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

  // Fetch saved outfits on component mount
  useEffect(() => {
    if (user && user._id) {
      fetchSavedOutfits();
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const fetchSavedOutfits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's saved recommendations
      if (user && user._id) {
        try {
          const savedRecommendations = await getUserRecommendations(user._id);
          if (savedRecommendations && savedRecommendations.outfits) {
            setSavedOutfits(savedRecommendations.outfits);
          }
        } catch (err) {
          console.log("No saved outfits found");
          setError("No saved outfits found");
        }
      }
    } catch (err) {
      console.error("Error fetching saved outfits:", err);
      setError("Failed to get saved outfits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Welcome, {user?.username}</h1>
      
      {/* Outfit recommendations link */}
      <section className="outfit-recommendations">
        <h2>Outfit Recommendations</h2>
        <p>Get personalized outfit recommendations based on current weather.</p>
        <Link to="/outfit/recommendations" className="outfit-link">
          Get Weather-Based Outfit Recommendations
        </Link>
      </section>
      
      {/* Saved outfits section */}
      <section className="saved-outfits">
        <h2>Your Saved Outfits</h2>
        {loading && <p>Loading your saved outfits...</p>}
        {error && <p className="error">{error}</p>}
        {savedOutfits.length > 0 ? (
          <div className="outfits-grid">
            {savedOutfits.map((outfit, index) => (
              <div key={outfit._id || index} className="saved-outfit-card">
                <h3>Outfit #{index + 1}</h3>
                <p>Rating: {outfit.rating}/5</p>
                {/* Display more outfit details as needed */}
              </div>
            ))}
          </div>
        ) : (
          <p>No saved outfits yet. Rate outfits to save them!</p>
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