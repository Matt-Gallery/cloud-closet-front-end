// import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
// import { closetForm } from "../ClosetForm/ClosetForm";
import { useUser } from "../../contexts/UserContext";
import './NavBar.css';

function NavBar() {
  const { user, setUser } =  useUser();

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav>
      {user ? (
        <ul>
          <li>Welcome, {user.username || Nerd}</li>
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
          <Link to="/OutfitRecommendation">Home/Recommendations</Link>
        </li>
        <li>
          <Link to="/closetForm">My Closet</Link>
        </li>
        <li>
          <Link to="/">My Profile</Link>
        </li>
      </ul>
    )}
  </nav>
);
}

export default NavBar;
