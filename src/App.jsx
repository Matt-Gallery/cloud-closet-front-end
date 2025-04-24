import { useContext, useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import AddItem from "./components/AddItem/AddItem.jsx";
import OutfitRecommendation from "./components/OutfitRecommendation/OutfitRecommendation.jsx";
import { UserContext } from "./contexts/UserContext.jsx";
import "./App.css";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Landing />}
        />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/add-item" element={<AddItem />} />
        {/* Route for outfit recommendations */}
        <Route 
          path="/outfit/recommendations" 
          element={<OutfitRecommendation />} 
        />
      </Routes>
    </>
  );
};

export default App;