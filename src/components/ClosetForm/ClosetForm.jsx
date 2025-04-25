import { useContext, useState, useEffect } from "react";
import AddItem from "../AddItem/AddItem";
import { useUser } from "../../contexts/UserContext";
import { getUserOutfits } from "../../services/outfitService";
import { updateItem, deleteItem } from "../../services/itemService";
import getClothingIcon from "../../utils/clothingIcons.jsx";
import './ClosetForm.css';

const ClosetForm = () => {
    const { user } = useUser();
    const [closetItems, setClosetItems] = useState([]);
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outfitsLoading, setOutfitsLoading] = useState(true);
    const [outfitsError, setOutfitsError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubcategory, setSelectedSubcategory] = useState("All");
    const [selectedColor, setSelectedColor] = useState("All");
    const [itemToEdit, setItemToEdit] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Predefined categories with mapping to actual category values
    const categoryMapping = {
        "All": "All",
        "Shirts": "Shirt",
        "Pants": "Pants",
        "Sweaters": "Sweater",
        "Skirts": "Skirt",
        "Dresses": "Dress",
        "Shoes": "Shoes",
        "Jackets": "Jacket"
    };
    
    // Tab names to display
    const categories = Object.keys(categoryMapping);
    
    const userId = user?._id;

    // Reset subcategory and color when category changes
    useEffect(() => {
        setSelectedSubcategory("All");
        setSelectedColor("All");
    }, [selectedCategory]);

    // Reset color when subcategory changes
    useEffect(() => {
        setSelectedColor("All");
    }, [selectedSubcategory]);

    // Fetch all items when component mounts
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:3001/api/items");
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Items received:", data);
                
                // Check the structure of your data
                // If data is an object with an items array, adjust accordingly
                const items = Array.isArray(data) ? data : data.items || [];
                setClosetItems(items);
            } catch (error) {
                console.error("Failed to fetch items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    // Fetch saved outfits
    useEffect(() => {
        // Skip if no user ID is available
        if (!userId) return;
        
        const fetchOutfits = async () => {
            try {
                setOutfitsLoading(true);
                setOutfitsError(null);
                const data = await getUserOutfits(userId);
                setOutfits(data);
            } catch (err) {
                console.error('Error fetching outfits:', err);
                setOutfitsError('Failed to load outfits. Please try again later.');
            } finally {
                setOutfitsLoading(false);
            }
        };

        fetchOutfits();
    }, [userId]); // Use userId instead of user object

    const addItemToCloset = async (newItem) => {
        if (!userId) {
            console.error("Cannot add item: No user ID available");
            return;
        }
        
        try {
            const itemWithUser = {
                name: newItem.name,                
                category: newItem.category,
                subCategory: newItem.subCategory,   
                color: newItem.color,
                userId: userId, 
            };
            console.log("sending to backend", itemWithUser);

            const res = await fetch("http://localhost:3001/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(itemWithUser),
            });

            const savedItem = await res.json();
            setClosetItems((prev) => [...prev, savedItem]);
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };
    
    const updateClosetItem = async (itemId, updatedItemData) => {
        if (!userId) {
            console.error("Cannot update item: No user ID available");
            return;
        }
        
        try {
            const itemWithUser = {
                ...updatedItemData,
                userId: userId,
            };
            
            const updatedItem = await updateItem(itemId, itemWithUser);
            
            // Update the local state with the updated item
            setClosetItems((prev) => 
                prev.map(item => item._id === itemId ? updatedItem : item)
            );
            
            // Exit edit mode
            setIsEditMode(false);
            setItemToEdit(null);
            
        } catch (err) {
            console.error("Error updating item:", err);
        }
    };
    
    const deleteClosetItem = async (itemId) => {
        if (!userId) {
            console.error("Cannot delete item: No user ID available");
            return;
        }
        
        try {
            await deleteItem(itemId);
            
            // Remove the item from the local state
            setClosetItems((prev) => 
                prev.filter(item => item._id !== itemId)
            );
            
            // Exit edit mode
            setIsEditMode(false);
            setItemToEdit(null);
            
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };
    
    const handleItemClick = (item) => {
        setItemToEdit(item);
        setIsEditMode(true);
        
        // Scroll to the form
        document.querySelector('.closet-form-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    };
    
    const cancelEdit = () => {
        setIsEditMode(false);
        setItemToEdit(null);
    };
    
    // Helper function to find an item by its ID
    const findItemById = (itemId) => {
        if (!itemId) return null;
        
        // Check if itemId is already an object (populated by the API)
        if (typeof itemId === 'object' && itemId !== null && itemId.name) {
            return itemId;
        }
        
        // Look up the item in the closetItems array
        return closetItems.find(item => item._id === itemId) || null;
    };
    
    // Filter items by category only - used for deriving subcategories and colors
    const getItemsFilteredByCategory = () => {
        if (selectedCategory === "All") {
            return closetItems;
        }
        return closetItems.filter(item => item.category === categoryMapping[selectedCategory]);
    };
    
    // Filter items by category and subcategory - used for deriving colors
    const getItemsFilteredByCategoryAndSubcategory = () => {
        let filtered = getItemsFilteredByCategory();
        
        if (selectedSubcategory !== "All") {
            filtered = filtered.filter(item => item.subCategory === selectedSubcategory);
        }
        
        return filtered;
    };
    
    // Filter items by category and color - used for deriving subcategories
    const getItemsFilteredByCategoryAndColor = () => {
        let filtered = getItemsFilteredByCategory();
        
        if (selectedColor !== "All") {
            filtered = filtered.filter(item => item.color === selectedColor);
        }
        
        return filtered;
    };
    
    // Get unique subcategories for the currently selected category and color
    const getUniqueSubcategories = () => {
        if (selectedCategory === "All") return [];
        
        const filteredItems = getItemsFilteredByCategoryAndColor();
        const subcategories = filteredItems.map(item => item.subCategory).filter(Boolean);
        
        return ["All", ...new Set(subcategories)];
    };
    
    // Get unique colors for the currently selected category and subcategory
    const getUniqueColors = () => {
        if (selectedCategory === "All") return [];
        
        const filteredItems = getItemsFilteredByCategoryAndSubcategory();
        const colors = filteredItems.map(item => item.color).filter(Boolean);
        
        return ["All", ...new Set(colors)];
    };
    
    // Filter items based on all three filters
    const filteredItems = (() => {
        // Filter by category
        let items = selectedCategory === "All" 
            ? closetItems 
            : closetItems.filter(item => item.category === categoryMapping[selectedCategory]);
        
        // Filter by subcategory if applicable
        if (selectedCategory !== "All" && selectedSubcategory !== "All") {
            items = items.filter(item => item.subCategory === selectedSubcategory);
        }
        
        // Filter by color if applicable
        if (selectedCategory !== "All" && selectedColor !== "All") {
            items = items.filter(item => item.color === selectedColor);
        }
        
        return items;
    })();
         
    return (
        <div className="closet-container">
            <div className="closet-header">
                <h1>Hello, {user?.username || "Turtle"}!</h1>
                <p>Add a new item to your closet</p>
            </div>

            <div className="closet-content">
                <div className="closet-left-column">
                    <div className="closet-form-section">
                        <AddItem 
                            onAdd={addItemToCloset}
                            onUpdate={updateClosetItem}
                            onDelete={deleteClosetItem}
                            itemToEdit={itemToEdit}
                            isEditMode={isEditMode}
                            cancelEdit={cancelEdit}
                        />
                    </div>

                    <div className="items-list">
                        <h2>Your Closet: {closetItems.length} items</h2>
                        
                        {/* Category filter tabs */}
                        <div className="category-tabs">
                            {categories.map(category => (
                                <button 
                                    key={category} 
                                    className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        
                        {/* Only show refinement filters when a category is selected */}
                        {selectedCategory !== "All" && (
                            <>
                                {/* Subcategory filter tabs */}
                                <div className="subcategory-tabs">
                                    <div className="filter-label">Subcategory:</div>
                                    {getUniqueSubcategories().map(subcategory => (
                                        <button 
                                            key={subcategory} 
                                            className={`subcategory-tab ${selectedSubcategory === subcategory ? 'active' : ''}`}
                                            onClick={() => setSelectedSubcategory(subcategory)}
                                        >
                                            {subcategory}
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Color filter tabs */}
                                <div className="color-tabs">
                                    <div className="filter-label">Color:</div>
                                    {getUniqueColors().map(color => (
                                        <button 
                                            key={color} 
                                            className={`color-tab ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            style={color !== "All" ? { backgroundColor: color, color: getContrastColor(color) } : {}}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                        
                        {loading ? (
                            <p className="loading-message">Loading your items...</p>
                        ) : (
                            <>
                                {filteredItems.length > 0 ? (
                                    <ul>
                                        {filteredItems.map((item, index) => (
                                            <li 
                                                key={item._id || index}
                                                onClick={() => handleItemClick(item)}
                                                className="clickable-item"
                                            >
                                                <div className="item-icon">
                                                    {getClothingIcon(item.category, item.subCategory)}
                                                </div>
                                                <div className="item-details-content">
                                                    <div className="item-name">{item.name}</div>
                                                    <div className="item-details">
                                                        {item.category} - {item.subCategory}
                                                        {item.color && <span className="item-color"> - {item.color}</span>}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="empty-message">
                                        {selectedCategory === "All" 
                                            ? "No items in your closet yet." 
                                            : getFilterMessage(selectedCategory, selectedSubcategory, selectedColor, categoryMapping)}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="closet-right-column">
                    <div className="saved-outfits">
                        <h2>Your Saved Outfits</h2>
                        {outfitsLoading && userId ? (
                            <p className="loading-message">Loading your outfits...</p>
                        ) : outfitsError ? (
                            <p className="error-message">{outfitsError}</p>
                        ) : !userId ? (
                            <p className="empty-message">Please log in to view your saved outfits.</p>
                        ) : (
                            <>
                                {outfits.length > 0 ? (
                                    <div className="outfits-list">
                                        {outfits.map((outfit) => {
                                            // Look up each item in the closetItems array
                                            const topItem = findItemById(outfit.topId);
                                            const bottomItem = findItemById(outfit.bottomId);
                                            const shoesItem = findItemById(outfit.shoesId);
                                            const accessoryItem = findItemById(outfit.accessoryId);
                                            const sweaterItem = findItemById(outfit.sweaterId);
                                            const jacketItem = findItemById(outfit.jacketId);
                                            
                                            return (
                                                <div key={outfit._id} className="outfit-card">
                                                    <div className="outfit-header">
                                                        <h3>Outfit</h3>
                                                        <span className="outfit-rating">Rating: {outfit.rating} / 5</span>
                                                    </div>
                                                    <div className="outfit-items">
                                                        {outfit.topId && (
                                                            <div className="outfit-item">
                                                                <h4>Top</h4>
                                                                <div className="outfit-item-icon">
                                                                    {topItem?.category && (
                                                                        getClothingIcon(topItem.category, topItem.subCategory)
                                                                    )}
                                                                </div>
                                                                <p>{topItem?.name || 'Unknown Top'}</p>
                                                                <p>{topItem?.color || 'Unknown Color'}</p>
                                                                {topItem?.category && <p>{topItem.category} - {topItem.subCategory}</p>}
                                                            </div>
                                                        )}
                                                        {outfit.sweaterId && (
                                                            <div className="outfit-item">
                                                                <h4>Sweater</h4>
                                                                <div className="outfit-item-icon">
                                                                    {sweaterItem?.category && (
                                                                        getClothingIcon(sweaterItem.category, sweaterItem.subCategory)
                                                                    )}
                                                                </div>
                                                                <p>{sweaterItem?.name || 'Unknown Sweater'}</p>
                                                                <p>{sweaterItem?.color || 'Unknown Color'}</p>
                                                                {sweaterItem?.category && <p>{sweaterItem.category} - {sweaterItem.subCategory}</p>}
                                                            </div>
                                                        )}
                                                        {outfit.bottomId && (
                                                            <div className="outfit-item">
                                                                <h4>Bottom</h4>
                                                                <div className="outfit-item-icon">
                                                                    {bottomItem?.category && (
                                                                        getClothingIcon(bottomItem.category, bottomItem.subCategory)
                                                                    )}
                                                                </div>
                                                                <p>{bottomItem?.name || 'Unknown Bottom'}</p>
                                                                <p>{bottomItem?.color || 'Unknown Color'}</p>
                                                                {bottomItem?.category && <p>{bottomItem.category} - {bottomItem.subCategory}</p>}
                                                            </div>
                                                        )}
                                                        {outfit.shoesId && (
                                                            <div className="outfit-item">
                                                                <h4>Shoes</h4>
                                                                <div className="outfit-item-icon">
                                                                    {shoesItem?.category && (
                                                                        getClothingIcon(shoesItem.category, shoesItem.subCategory)
                                                                    )}
                                                                </div>
                                                                <p>{shoesItem?.name || 'Unknown Shoes'}</p>
                                                                <p>{shoesItem?.color || 'Unknown Color'}</p>
                                                                {shoesItem?.category && <p>{shoesItem.category} - {shoesItem.subCategory}</p>}
                                                            </div>
                                                        )}
                                                        {outfit.jacketId && (
                                                            <div className="outfit-item">
                                                                <h4>Jacket</h4>
                                                                <div className="outfit-item-icon">
                                                                    {jacketItem?.category && (
                                                                        getClothingIcon(jacketItem.category, jacketItem.subCategory)
                                                                    )}
                                                                </div>
                                                                <p>{jacketItem?.name || 'Unknown Jacket'}</p>
                                                                <p>{jacketItem?.color || 'Unknown Color'}</p>
                                                                {jacketItem?.category && <p>{jacketItem.category} - {jacketItem.subCategory}</p>}
                                                            </div>
                                                        )}
                                                        {outfit.accessoryId && (
                                                            <div className="outfit-item">
                                                                <h4>Accessory</h4>
                                                                <p>{accessoryItem?.name || 'Unknown Accessory'}</p>
                                                                <p>{accessoryItem?.color || 'Unknown Color'}</p>
                                                                {accessoryItem?.category && <p>{accessoryItem.category} - {accessoryItem.subCategory}</p>}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="empty-message">You haven't saved any outfits yet.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div> 
    );
};

// Helper function to generate appropriate empty state message
function getFilterMessage(category, subcategory, color, categoryMapping) {
    const categoryName = categoryMapping[category];
    
    if (subcategory === "All" && color === "All") {
        return `No ${categoryName} items in your closet.`;
    } else if (subcategory !== "All" && color === "All") {
        return `No ${categoryName} items with subcategory "${subcategory}" in your closet.`;
    } else if (subcategory === "All" && color !== "All") {
        return `No ${categoryName} items with color "${color}" in your closet.`;
    } else {
        return `No ${categoryName} items with subcategory "${subcategory}" and color "${color}" in your closet.`;
    }
}

// Helper function to determine text color based on background color
function getContrastColor(hexColor) {
    // For named colors, use this basic mapping
    const darkColors = ['black', 'navy', 'blue', 'purple', 'brown', 'darkgreen', 'darkgrey'];
    if (darkColors.includes(hexColor.toLowerCase())) {
        return 'white';
    }
    
    // For hex colors, calculate luminance
    if (hexColor.startsWith('#')) {
        // Convert hex to RGB
        let r = 0, g = 0, b = 0;
        if (hexColor.length === 4) {
            r = parseInt(hexColor[1] + hexColor[1], 16);
            g = parseInt(hexColor[2] + hexColor[2], 16);
            b = parseInt(hexColor[3] + hexColor[3], 16);
        } else if (hexColor.length === 7) {
            r = parseInt(hexColor.substr(1, 2), 16);
            g = parseInt(hexColor.substr(3, 2), 16);
            b = parseInt(hexColor.substr(5, 2), 16);
        }
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Use white text for dark backgrounds, black text for light backgrounds
        return luminance > 0.5 ? 'black' : 'white';
    }
    
    // Default to black for unknown colors
    return 'black';
}

export default ClosetForm; 