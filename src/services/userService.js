const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

/**
 * Fetches all users from the backend
 * @returns {Promise<Array>} - Array of all user objects
 * @throws {Error} - If the API request fails or authentication is invalid
 */
export const index = async () => {
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Failed to fetch users");
  }
};

/**
 * Fetches a specific user's details by their ID
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise<Object>} - The user's profile data
 * @throws {Error} - If the user ID is invalid or the API request fails
 */
export const show = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Failed to fetch user");
  }
};
