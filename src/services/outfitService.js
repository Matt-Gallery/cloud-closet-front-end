/**
 * Service for interacting with outfit recommendation endpoints
 */

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

/**
 * Get weather-based outfit recommendations
 * @param {Object} weatherData - The current weather data 
 * @returns {Promise<Object>} - The outfit recommendations
 */
export const getWeatherBasedRecommendations = async (weatherData) => {
  try {
    const res = await fetch(`${BASE_URL}/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ weather: weatherData }),
    });

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
  getUserRecommendations
};