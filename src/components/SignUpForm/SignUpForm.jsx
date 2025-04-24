import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../../services/authService.js";
import { UserContext } from "../../contexts/UserContext.jsx";

function SignUpForm() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
    name: "",
    gender: "",
    location: ""
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
    const newUser = await signUp(formData);
    setUser(newUser);
    navigate("/");
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" onChange={handleChange} required />

        <label>Confirm Password:</label>
        <input type="password" name="passwordConf" onChange={handleChange} required />

        <label>Name:</label>
        <input type="text" name="name" onChange={handleChange} required />

        <label>Gender / Pronouns:</label>
        <select name="gender" onChange={handleChange}>
          <option value="">Select</option>
          <option value="he/him">He/Him</option>
          <option value="she/her">She/Her</option>
          
        </select>

       

        <button type="submit">Sign Up</button>
      </form>
    </main>
  );
}

export default SignUpForm;
