import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/auth'; // make sure you have this function!
import { useUser } from '../contexts/UserContext';
import {jwtDecode} from 'jwt-decode';



export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup({ email, password });

      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(jwtDecode(data.token));
        navigate('/closet');
      } else {
        setError(data.error || 'Sign-up failed.');
      }
    } catch (err) {
      setError('Something went wrong.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

