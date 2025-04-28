import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../../services/authService";
import { UserContext, useUser } from "../../contexts/UserContext";
import { jwtDecode } from 'jwt-decode';
import "./SignInForm.css";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await signIn(formData);
      
      if (!response || !response.token) {
        throw new Error("Login failed - invalid response");
      }
      
      localStorage.setItem('token', response.token);
      
      try {
        const decoded = jwtDecode(response.token);
        setUser(decoded);
        navigate("/closet");
      } catch (jwtError) {
        console.error("JWT decode error:", jwtError);
        throw new Error("Invalid token format");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err.message || "Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-header">
        <h1>Sign In</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="signin-form" autoComplete="off" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            autoComplete="off"
            id="username"
            value={formData.username}
            name="username"
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            autoComplete="off"
            id="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        
        <button className="signin-button" type="submit">Sign In</button>
      </form>
      
      <div className="signup-link">
        Don't have an account?
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default SignInForm;
