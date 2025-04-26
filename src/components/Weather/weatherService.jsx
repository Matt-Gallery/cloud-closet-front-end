/**
 * Weather API configuration with API key and base URL
 */
const API_KEY = 'e27d9aef2bb24bda8c8152646251104';
const BASE_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}`;

/**
 * Fetches current weather data for a given location
 * @param {string} query - Location query (city name, zip code, coordinates)
 * @returns {Promise<Object>} - Weather data for the specified location
 * @throws {Error} - If the API request fails or returns an error
 */
const display = async (query) => {
  try {
    const res = await fetch(`${BASE_URL}&q=${query}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(`Failed to fetch weather data: ${err.message}`);
  }
};
  
export { display };