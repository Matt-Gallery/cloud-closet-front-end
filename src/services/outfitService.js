/**
 * Service for interacting with outfit recommendation endpoints
 */

// Use a default URL if the environment variable is undefined
const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

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
    
    // Prepare the data to match the updated backend schema
    const payload = {
      userId,
      topId: outfitData.topId || null,
      bottomId: outfitData.bottomId || null,
      shoesId: outfitData.shoesId || null,
      sweaterId: null,
      jacketId: null,
      accessoryId: null,
      rating: outfitData.rating
    };
    
    // If accessoryId exists and it's a jacket or sweater, handle it appropriately
    if (outfitData.accessoryId) {
      // We need to determine if this is a jacket, sweater, or actual accessory
      if (outfitData.accessoryCategory === "Jacket") {
        payload.jacketId = outfitData.accessoryId;
      } else if (outfitData.accessoryCategory === "Sweater") {
        payload.sweaterId = outfitData.accessoryId;
      } else {
        payload.accessoryId = outfitData.accessoryId;
      }
    }
    
    // If we have specific jacket or sweater IDs, use those
    if (outfitData.jacketId) {
      payload.jacketId = outfitData.jacketId;
    }
    
    if (outfitData.sweaterId) {
      payload.sweaterId = outfitData.sweaterId;
    }
    
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
    throw new Error(err.message || "Failed to get user recommendations");
  }
};

/**
 * Get all outfits for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - The user's outfits
 */
export const getUserOutfits = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch outfits");
    }
    
    const url = `${BASE_URL}/outfits/${userId}`;
    const token = localStorage.getItem("token");
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if response is ok before parsing JSON
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();
    
    // Check if response is empty
    if (!text) {
      return [];
    }
    
    const data = JSON.parse(text);

    if (data.err) {
      throw new Error(data.err);
    }

    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw new Error(err.message || "Failed to get user outfits");
  }
};

export default {
  getWeatherBasedRecommendations,
  getUserRecommendations,
  saveOutfitRating,
  getUserOutfits
};