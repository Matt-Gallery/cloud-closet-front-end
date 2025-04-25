
import { Link } from "react-router-dom";
import React from "react";

function Landing() {
  return (
    <main>
    <h1>Hello Beauty!</h1>
    <h1>Welcome to Cloud Closet!</h1>
    <p>Please sign in or sign up to continue</p>
  
    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
      <Link to="/signin">
        <button>Sign In</button>
      </Link>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
    </div>
  </main>
  
  );
}

export default Landing;
