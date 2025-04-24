/**
 * Weather Icons Utility
 * Maps common weather conditions to Unicode weather symbols
 */

// Map of weather conditions to their corresponding Unicode weather icons
const weatherIconMap = {
  // Clear conditions
  'Clear': '☀️',
  'Sunny': '☀️',
  'Mostly Clear': '🌤️',
  'Mostly Sunny': '🌤️',
  
  // Cloudy conditions
  'Partly Cloudy': '⛅',
  'Mostly Cloudy': '🌥️',
  'Cloudy': '☁️',
  'Overcast': '☁️',
  
  // Rain conditions
  'Drizzle': '🌦️',
  'Light Rain': '🌦️',
  'Rain': '🌧️',
  'Heavy Rain': '🌧️',
  'Showers': '🌧️',
  'Thunderstorm': '⛈️',
  'Thundershowers': '⛈️',
  'Storm': '⛈️',
  
  // Snow conditions
  'Light Snow': '🌨️',
  'Snow': '❄️',
  'Heavy Snow': '❄️',
  'Sleet': '🌨️',
  'Freezing Rain': '🌨️',
  'Blizzard': '❄️',
  
  // Fog/Mist conditions
  'Fog': '🌫️',
  'Mist': '🌫️',
  'Hazy': '🌫️',
  
  // Special conditions
  'Windy': '💨',
  'Tornado': '🌪️',
  'Hurricane': '🌀',
  'Dust': '💨',
  'Smoke': '🌫️',
  'Hail': '🌨️'
};

/**
 * Get the weather icon for a given condition
 * @param {string} condition - The weather condition
 * @returns {string} - The Unicode weather icon
 */
export const getWeatherIcon = (condition) => {
  if (!condition) return '❓'; // Default for unknown condition
  
  // Try to match the condition exactly
  if (weatherIconMap[condition]) {
    return weatherIconMap[condition];
  }
  
  // If no exact match, try partial match (e.g. 'Heavy Thunderstorms' should match 'Thunderstorm')
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('thunder')) return weatherIconMap['Thunderstorm'];
  if (conditionLower.includes('rain')) return weatherIconMap['Rain'];
  if (conditionLower.includes('shower')) return weatherIconMap['Showers'];
  if (conditionLower.includes('snow')) return weatherIconMap['Snow'];
  if (conditionLower.includes('cloud')) return weatherIconMap['Cloudy'];
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return weatherIconMap['Clear'];
  if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haz')) return weatherIconMap['Fog'];
  
  // Default icon if no matching condition
  return '🌡️';
};

export default getWeatherIcon; 