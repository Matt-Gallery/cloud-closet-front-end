import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext.jsx";
import "./MyProfile.css";


const MyProfile = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name:     "",
    gender:   "",
    location: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFormData({
        username: data.username || "",
        password: "",
        name:     data.name     || "",
        gender:   data.gender   || "",
        location: data.location || ""
      });
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type":  "application/json",
        Authorization:    `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const updatedUser = await res.json();
      setUser(updatedUser);
      navigate("/dashboard");
    }
  };

  return (
    <main className="profile-container">
      <h1>Edit Profile</h1>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label>New Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Gender / Pronouns:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="he/him">He/Him</option>
          <option value="she/her">She/Her</option>
        </select>

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <button type="submit">Update Profile</button>
      </form>
    </main>
  );
};

export default MyProfile;
