// import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
// import { closetForm } from "../ClosetForm/ClosetForm";
import { useUser } from "../../contexts/UserContext";
import './NavBar.css';

function NavBar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav>
      {user ? (
        // if YES user
        <>
        <ul> 
          <li>Welcome, {user.username}</li>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/closet">My Closet</Link></li>
          <li><Link to="/outfits">My Outfits</Link></li>
          <li><Link to="/OutfitRecommendations">Recommendations</Link></li>
          <li><button onClick={handleSignOut}>Sign Out</button></li>
        </ul>
        </>
      ) : (
        // if NO user
        <ul>
          <li><Link to="/OutfitRecommendations">Home/Recommendations</Link></li>
          <li><Link to="/signin">Sign In</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
        </ul>
      )}
    </nav>
  );
}

export default NavBar;