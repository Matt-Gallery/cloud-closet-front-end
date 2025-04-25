import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { signIn } from "../../services/authService";
import { UserContext, useUser } from "../../contexts/UserContext";
import { jwtDecode } from 'jwt-decode';

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
    <main>
      <h1>Sign In</h1>
      {error && <div className="error-message">{error}</div>}
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
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
        <div>
          <label htmlFor="password">Password:</label>
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
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    </main>
  );
};

export default SignInForm;
