import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { signIn } from "../../services/authService";
import { UserContext, useUser } from "../../contexts/UserContext";
import { jwtDecode } from 'jwt-decode';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

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
    try {
      const signedInUser = await signIn(formData);
      const token = signedInUser.token;
      localStorage.setItem('token', token);
      
      const decoded = jwtDecode(token);
      setUser(decoded);
      navigate("/closet");
    } catch (err) {
      console.error(err);
      alert("Sign-in failed. Try again.");
    }
  };

  return (
    <main>
      <h1>Sign In</h1>
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
