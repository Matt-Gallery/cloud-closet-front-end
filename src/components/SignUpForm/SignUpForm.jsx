import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../../services/authService.js";
import { UserContext } from "../../contexts/UserContext.jsx";
import "./SignUpForm.css";

function SignUpForm() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
    name: "",
    age: "",
    gender: "",
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
      if (formData.password !== formData.passwordConf) {
        setError("Passwords do not match");
        return;
      }
      
      // Process the name field into firstName and lastName
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
      
      // Create a new object with the backend schema format
      const userData = {
        username: formData.username,
        password: formData.password, // Will be hashed on the backend
        firstName: firstName,
        lastName: lastName,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        gender: formData.gender,
      };
      
      const newUser = await signUp(userData);
      setUser(newUser);
      navigate("/closet");
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1>Sign Up</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username"
            name="username" 
            value={formData.username}
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            name="password" 
            value={formData.password}
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordConf">Confirm Password</label>
          <input 
            type="password" 
            id="passwordConf"
            name="passwordConf" 
            value={formData.passwordConf}
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            value={formData.name}
            onChange={handleChange} 
            required 
            placeholder="First name (and last name if applicable)"
          />

        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input 
            type="number" 
            id="age"
            name="age" 
            value={formData.age}
            onChange={handleChange} 
            min="1"
            max="120"
            placeholder="Optional"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender / Pronouns</label>
          <select 
            id="gender"
            name="gender" 
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="he/him">He/Him</option>
            <option value="she/her">She/Her</option>
            <option value="they/them">They/Them</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button className="signup-button" type="submit">Sign Up</button>
      </form>
      
      <div className="signin-link">
        Already have an account?
        <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
}

export default SignUpForm;
