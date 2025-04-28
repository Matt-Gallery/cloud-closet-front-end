import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, useUser } from "../../contexts/UserContext.jsx";
import "./MyProfile.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    gender: "",
    location: ""
  });

  // Use user data from context for initial values
  useEffect(() => {
    console.log("Current user in context:", user);
    if (user) {
      // Combine firstName and lastName into name
      const fullName = user.firstName 
        ? (user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName)
        : user.name || "";
        
      setFormData({
        username: user.username || "",
        password: "",
        name: fullName,
        gender: user.gender || "",
        location: user.location || ""
      });
      setLoading(false);
    }
  }, [user]);

  // Fallback to fetching from API if context data is insufficient
  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user.username) {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:3001/auth/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!res.ok) {
            throw new Error(`Failed to fetch profile: ${res.status}`);
          }
          
          const data = await res.json();
          console.log("Fetched user data:", data);
          
          // Combine firstName and lastName into name
          const fullName = data.firstName 
            ? (data.lastName ? `${data.firstName} ${data.lastName}` : data.firstName)
            : data.name || "";
            
          setFormData({
            username: data.username || "",
            password: "",
            name: fullName,
            gender: data.gender || "",
            location: data.location || ""
          });
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError(err.message || "Failed to load profile data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      // Split name into firstName and lastName
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
      
      // Create data object for backend
      const profileData = {
        ...formData,
        firstName,
        lastName
      };
      
      // Don't send empty password
      if (!profileData.password) {
        delete profileData.password;
      }
      
      // Don't send the combined name field (backend expects firstName/lastName)
      delete profileData.name;
      
      console.log("Sending profile data:", profileData);
      
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update profile: ${res.status}`);
      }
      
      const updatedUser = await res.json();
      console.log("Updated user:", updatedUser);
      setUser(updatedUser);
      navigate("/OutfitRecommendation");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="loading-profile">Loading profile data...</div>;
  }

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
