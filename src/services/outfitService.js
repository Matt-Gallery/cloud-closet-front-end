/**
 * Service for interacting with outfit recommendation endpoints
 */

// Use a default URL if the environment variable is undefined
const BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api` 
  : 'http://localhost:3001/api'; // replace with your actual backend URL

/**
 * Get weather-based outfit recommendations
 * @param {Object} weatherData - The current weather data 
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} - The outfit recommendations
 */
export const getWeatherBasedRecommendations = async (weatherData, userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch recommendations");
    }
    
    // Build query parameters from weather data
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(weatherData)) {
      queryParams.append(key, value);
    }
    
    const url = `${BASE_URL}/recommendations/${userId}?${queryParams.toString()}`;
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });

    // Check if response is ok before parsing JSON
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || "Failed to get outfit recommendations");
  }
};

/**
 * Save an outfit rating to the backend
 * @param {string} userId - The user's ID
 * @param {Object} outfitData - Object containing item IDs and rating
 * @returns {Promise<Object>} - The saved outfit rating
 */
export const saveOutfitRating = async (userId, outfitData) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to save outfit rating");
    }
    
    if (!outfitData.rating) {
      throw new Error("Rating is required");
    }
    
    // Prepare the data to match the backend schema
    const payload = {
      userId,
      topId: outfitData.topId || null,
      bottomId: outfitData.bottomId || null,
      shoesId: outfitData.shoesId || null,
      accessoryId: outfitData.accessoryId || null,
      rating: outfitData.rating
    };
    
    const res = await fetch(`${BASE_URL}/outfits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    // Check if response is ok before parsing JSON
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Server responded with ${res.status}: ${errorText}`);
    }

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || "Failed to save outfit rating");
  }
};

/**
 * Get saved weather recommendations for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} - The user's saved recommendations
 */
export const getUserRecommendations = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch recommendations");
    }

    const res = await fetch(`${BASE_URL}/recommendations/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || "Failed to get user recommendations");
  }
};

export default {
  getWeatherBasedRecommendations,
  getUserRecommendations,
  saveOutfitRating
};