// import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
// import { closetForm } from "../ClosetForm/ClosetForm";
import { useUser } from "../../contexts/UserContext";
import './NavBar.css';

function NavBar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const isProfilePage = location.pathname === "/profile";

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
        {/* Hide My Profile link when already on the profile page */}
        {!isProfilePage && <li><Link to="/profile">My Profile</Link></li>}
        <li><Link to="/closet">My Closet</Link></li>
        <li><Link to="/OutfitRecommendation">Home/Recommendations</Link></li>
        <li><button onClick={handleSignOut}>Sign Out</button></li>
      </ul>
      </>
    ) : (
      // if NO user
      <ul>
        <li><Link to="/Signin">Sign In</Link></li>
        <li><Link to="/Signup">Sign Up</Link></li>
      </ul>
    )}
    </nav>
  );
}

export default NavBar;