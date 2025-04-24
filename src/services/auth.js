// src/services/auth.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Signup a new user
export const signup = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  return res.json();
};

// Log in an existing user
export const login = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  return res.json();
};
