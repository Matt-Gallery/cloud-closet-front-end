import { Link, useNavigate } from "react-router-dom";
//import { UserContext } from "../../contexts/UserContext";
import { useUser } from "../../contexts/UserContext";

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
      <h1>Welcome {user?.userName || "nerd"}</h1>
      <ul> 
        <li><Link to="/">My Profile</Link></li>
        <li><Link to="/closetForm">My Closet</Link></li>
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
)};

export default NavBar;
