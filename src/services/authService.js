/**
 * Base URL for authentication endpoints
 */
const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

/**
 * User registration service
 * @param {Object} formData - User registration data (email, password, name)
 * @returns {Promise<Object>} - User payload from the JWT token
 * @throws {Error} - If registration fails or token is invalid
 */
export const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    if (!data.token) {
      throw new Error("Invalid response from server");
    }

    localStorage.setItem("token", data.token);
    return JSON.parse(atob(data.token.split(".")[1])).payload;
  } catch (err) {
    throw new Error(err.message || "Registration failed");
  }
};

/**
 * User authentication service
 * @param {Object} formData - Login credentials (email, password)
 * @returns {Promise<Object>} - User data with authentication token
 * @throws {Error} - If login fails or token is missing
 */
export const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error(`Signin failed: ${res.status}`);
    }
    
    const text = await res.text();
    if (!text) throw new Error("Empty response from server");

    const data = JSON.parse(text);

    if (!data.token) {
      throw new Error("Missing token in response");
    }

    localStorage.setItem("token", data.token);
    return data; // Return the entire data object, not just the parsed token payload
  } catch (err) {
    throw new Error(err.message || "Authentication failed");
  }
};
