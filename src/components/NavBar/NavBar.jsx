// src/components/NavBar.jsx
import React             from "react";
import { useUser }       from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const { user, setUser } = useUser();
  const navigate          = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav>
      {user ? (
        <ul>
          <li>Welcome, {user.username}</li>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <button onClick={handleSignOut}>Sign Out</button>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/signin">Sign In</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default NavBar;
