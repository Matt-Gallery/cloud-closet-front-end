const BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api/items` 
  : 'http://localhost:3001/api/items';

/**
 * Get all items for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - The user's items
 * @throws {Error} - If user ID is missing or API request fails
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
    throw new Error(err.message || "Failed to get user items");
  }
};

/**
 * Add a new item to the user's closet
 * @param {Object} itemData - The item data to add
 * @returns {Promise<Object>} - The saved item
 * @throws {Error} - If API request fails
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
    throw new Error(err.message || "Failed to add item");
  }
};

/**
 * Update an existing item in the user's closet
 * @param {string} itemId - The ID of the item to update
 * @param {Object} itemData - The updated item data
 * @returns {Promise<Object>} - The updated item
 * @throws {Error} - If the item ID is invalid or API request fails
 */
export const updateItem = async (itemId, itemData) => {
  try {
    // Ensure we're using the right URL structure
    const url = `${BASE_URL}/${itemId}`;
    
    const res = await fetch(url, {
      method: "PUT",
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
    throw new Error(err.message || "Failed to update item");
  }
};

/**
 * Delete an item from the user's closet
 * @param {string} itemId - The ID of the item to delete
 * @returns {Promise<Object>} - The result of the deletion
 * @throws {Error} - If the item ID is missing or API request fails
 */
export const deleteItem = async (itemId) => {
  try {
    if (!itemId) {
      throw new Error("Item ID is required to delete an item");
    }
    
    const url = `${BASE_URL}/${itemId}`;
    
    const res = await fetch(url, {
      method: "DELETE",
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
    throw new Error(err.message || "Failed to delete item");
  }
}; 