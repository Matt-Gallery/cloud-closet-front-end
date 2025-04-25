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

/**
 * Update an existing item in the user's closet
 * @param {string} itemId - The ID of the item to update
 * @param {Object} itemData - The updated item data
 * @returns {Promise<Object>} - The updated item
 */
export const updateItem = async (itemId, itemData) => {
  try {
    console.log(`Updating item with ID: ${itemId}`);
    console.log("Update data:", itemData);
    
    // Ensure we're using the right URL structure
    // Some APIs expect this format instead of /:id
    const url = `${BASE_URL}/${itemId}`;
    console.log(`Request URL: ${url}`);
    
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(itemData),
    });

    // Log detailed error information for debugging
    if (!res.ok) {
      console.error(`Error status: ${res.status}`);
      console.error(`Error statusText: ${res.statusText}`);
      
      try {
        const errorText = await res.text();
        console.error(`Error response body: ${errorText}`);
      } catch (e) {
        console.error("Could not parse error response");
      }
      
      throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    console.log("Update successful:", data);
    return data;
  } catch (err) {
    console.error("Error updating item:", err);
    throw new Error(err.message || "Failed to update item");
  }
};

/**
 * Delete an item from the user's closet
 * @param {string} itemId - The ID of the item to delete
 * @returns {Promise<Object>} - The result of the deletion
 */
export const deleteItem = async (itemId) => {
  try {
    if (!itemId) {
      throw new Error("Item ID is required to delete an item");
    }
    
    console.log(`Deleting item with ID: ${itemId}`);
    
    const url = `${BASE_URL}/${itemId}`;
    console.log(`Request URL: ${url}`);
    
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      console.error(`Error status: ${res.status}`);
      console.error(`Error statusText: ${res.statusText}`);
      
      try {
        const errorText = await res.text();
        console.error(`Error response body: ${errorText}`);
      } catch (e) {
        console.error("Could not parse error response");
      }
      
      throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    console.log("Delete successful:", data);
    return data;
  } catch (err) {
    console.error("Error deleting item:", err);
    throw new Error(err.message || "Failed to delete item");
  }
}; 