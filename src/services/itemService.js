const BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api/items` 
  : 'http://localhost:3001/api/items';

/**
 * Get all items for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - The user's items
 */
export const getUserItems = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch items");
    }

    const res = await fetch(`${BASE_URL}?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.error("Error fetching user items:", err);
    throw new Error(err.message || "Failed to get user items");
  }
};

/**
 * Add a new item to the user's closet
 * @param {Object} itemData - The item data to add
 * @returns {Promise<Object>} - The saved item
 */
export const addItem = async (itemData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(itemData),
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.error("Error adding item:", err);
    throw new Error(err.message || "Failed to add item");
  }
}; 