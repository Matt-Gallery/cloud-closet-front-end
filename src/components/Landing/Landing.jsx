import { Link } from "react-router-dom";
import React from "react";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-page-wrapper">
      <div className="landing-container">
        <div className="landing-emoji">
          👚
        </div>
        
        <h1 className="landing-title">Cloud Closet</h1>
        <p className="landing-subtitle">Your personal wardrobe assistant</p>
        
        <div className="landing-buttons">
          <Link to="/signin">
            <button className="landing-button">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="landing-button secondary">Sign Up</button>
          </Link>
        </div>
        
        <div className="landing-features">
          <div className="feature-card">
            <div className="feature-icon">👗</div>
            <h3 className="feature-title">Organize</h3>
            <p className="feature-description">
              Track all your clothing items
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌦️</div>
            <h3 className="feature-title">Weather</h3>
            <p className="feature-description">
              Get outfit suggestions
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3 className="feature-title">Favorites</h3>
            <p className="feature-description">
              Save your best looks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
