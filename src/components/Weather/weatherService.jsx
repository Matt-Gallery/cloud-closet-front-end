const API_KEY = 'e27d9aef2bb24bda8c8152646251104';
const BASE_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}`;

const display = async (query) => {
    try {
      const res = await fetch(`${BASE_URL}&q=${query}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.log("Error fetching weather:", err);
    }
  };
  
  export { display };