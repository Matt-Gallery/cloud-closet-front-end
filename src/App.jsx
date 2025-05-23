import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import AddItem from "./components/AddItem/AddItem.jsx";
import OutfitRecommendation from "./components/OutfitRecommendation/OutfitRecommendation.jsx";
import OutfitsList from "./components/OutfitsList/OutfitsList.jsx";

import WeatherSearch from "./components/Weather/weatherSearch.jsx";
import * as weatherService from "./components/Weather/weatherService.jsx";
import ClosetForm from "./components/ClosetForm/ClosetForm.jsx";
import { UserContext } from "./contexts/UserContext.jsx";
import MyProfile from './components/MyProfile/MyProfile.jsx';
import "./App.css";

const App = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [weather, setWeather] = useState(null);

  const hideNavOn = ["/", "/signin", "/signup"];
  const hideNav = hideNavOn.includes(location.pathname);

  //this step auto-fetches the weather based on location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          const data = await weatherService.display(coords);
          handleWeatherUpdate(data);
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  // this step lets the user override geolocation and enter any city they want
  const fetchData = async (city) => {
    const data = await weatherService.display(city);
    handleWeatherUpdate(data);
  };

  const handleWeatherUpdate = (data) => {
    if (!data || !data.current || !data.location) return;
    const newWeather = {
      location: data.location.name,
      temperature: data.current.temp_f,
      condition: data.current.condition.text,
      precipitation: data.current.precip_mm,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_mph,
      uvIndex: data.current.uv
    };
    setWeather(newWeather);
  };

   return (
    <>
      {!hideNav && <NavBar />} 
      
      <div className="routes-container">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Landing />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/closet" element={<ClosetForm />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/OutfitRecommendations" element={<OutfitRecommendation />} />
          <Route path="/OutfitRecommendation" element={<OutfitRecommendation />} />
          <Route path="/closetForm" element={<ClosetForm />} />
        </Routes>
      </div>
    </>
  );
};

export default App;