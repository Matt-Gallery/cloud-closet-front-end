import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getUserOutfits } from '../../services/outfitService';
import './OutfitsList.css';

const OutfitsList = () => {
  const { user } = useContext(UserContext);
  const [outfits, setOutfits] = useState([]);
  const [closetItems, setClosetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all items to be able to look up outfit items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setItemsLoading(true);
        const response = await fetch("http://localhost:3001/api/items");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check the structure of your data
        const items = Array.isArray(data) ? data : data.items || [];
        setClosetItems(items);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const fetchOutfits = async () => {
      if (!user || !user._id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getUserOutfits(user._id);
        setOutfits(data);
      } catch (err) {
        console.error('Error fetching outfits:', err);
        setError('Failed to load outfits. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, [user]);

  // Helper function to find an item by its ID
  const findItemById = (itemId) => {
    if (!itemId) return null;
    
    // Check if itemId is already an object (populated by the API)
    if (typeof itemId === 'object' && itemId !== null && itemId.name) {
      return itemId;
    }
    
    // Look up the item in the closetItems array
    return closetItems.find(item => item._id === itemId) || null;
  };

  if (loading || itemsLoading) {
    return <div className="outfits-loading">Loading your outfits...</div>;
  }

  if (error) {
    return <div className="outfits-error">{error}</div>;
  }

  if (!outfits || outfits.length === 0) {
    return <div className="outfits-empty">You haven't saved any outfits yet.</div>;
  }

  return (
    <div className="outfits-list-container">
      <h2>Your Saved Outfits</h2>
      <div className="outfits-grid">
        {outfits.map((outfit) => {
          // Look up each item in the closetItems array
          const topItem = findItemById(outfit.topId);
          const bottomItem = findItemById(outfit.bottomId);
          const shoesItem = findItemById(outfit.shoesId);
          const accessoryItem = findItemById(outfit.accessoryId);
          const sweaterItem = findItemById(outfit.sweaterId);
          const jacketItem = findItemById(outfit.jacketId);
          
          return (
            <div key={outfit._id} className="outfit-card">
              <div className="outfit-header">
                <h3>Outfit</h3>
                <span className="outfit-rating">Rating: {outfit.rating} / 5</span>
              </div>
              <div className="outfit-items">
                {outfit.topId && (
                  <div className="outfit-item">
                    <h4>Top</h4>
                    <p>{topItem?.name || 'Unknown Top'}</p>
                    <p>{topItem?.color || 'Unknown Color'}</p>
                    {topItem?.category && <p>{topItem.category} - {topItem.subCategory}</p>}
                  </div>
                )}
                {outfit.sweaterId && (
                  <div className="outfit-item">
                    <h4>Sweater</h4>
                    <p>{sweaterItem?.name || 'Unknown Sweater'}</p>
                    <p>{sweaterItem?.color || 'Unknown Color'}</p>
                    {sweaterItem?.category && <p>{sweaterItem.category} - {sweaterItem.subCategory}</p>}
                  </div>
                )}
                {outfit.bottomId && (
                  <div className="outfit-item">
                    <h4>Bottom</h4>
                    <p>{bottomItem?.name || 'Unknown Bottom'}</p>
                    <p>{bottomItem?.color || 'Unknown Color'}</p>
                    {bottomItem?.category && <p>{bottomItem.category} - {bottomItem.subCategory}</p>}
                  </div>
                )}
                {outfit.shoesId && (
                  <div className="outfit-item">
                    <h4>Shoes</h4>
                    <p>{shoesItem?.name || 'Unknown Shoes'}</p>
                    <p>{shoesItem?.color || 'Unknown Color'}</p>
                    {shoesItem?.category && <p>{shoesItem.category} - {shoesItem.subCategory}</p>}
                  </div>
                )}
                {outfit.jacketId && (
                  <div className="outfit-item">
                    <h4>Jacket</h4>
                    <p>{jacketItem?.name || 'Unknown Jacket'}</p>
                    <p>{jacketItem?.color || 'Unknown Color'}</p>
                    {jacketItem?.category && <p>{jacketItem.category} - {jacketItem.subCategory}</p>}
                  </div>
                )}
                {outfit.accessoryId && (
                  <div className="outfit-item">
                    <h4>Accessory</h4>
                    <p>{accessoryItem?.name || 'Unknown Accessory'}</p>
                    <p>{accessoryItem?.color || 'Unknown Color'}</p>
                    {accessoryItem?.category && <p>{accessoryItem.category} - {accessoryItem.subCategory}</p>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OutfitsList; 