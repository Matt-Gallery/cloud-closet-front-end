import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext.jsx";
import "./MyProfile.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    gender: "",
    location: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }
        
        const data = await res.json();
        setFormData({
          username: data.username || "",
          password: "",
          name: data.name || "",
          gender: data.gender || "",
          location: data.location || ""
        });
      } catch (err) {
        setError(err.message || "Failed to load profile data");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update profile: ${res.status}`);
      }
      
      const updatedUser = await res.json();
      setUser(updatedUser);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <h1>Edit Profile</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="profile-form" onSubmit={handleSubmit}>
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
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
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

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default MyProfile;
