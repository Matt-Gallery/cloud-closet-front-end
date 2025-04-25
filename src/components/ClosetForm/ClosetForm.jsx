import { useContext, useState, useEffect } from "react";
import AddItem from "../AddItem/AddItem";
import { UserContext } from "../../contexts/UserContext";
import './ClosetForm.css';

const ClosetForm = () => {
    //const { user } = useContext(UserContext);
    const user = {
        _id: "6627fa6bc2a4a1d2f86f2a8f", // ✅ must look like a real Mongo ObjectId
        email: "test@example.com"
      };
    const [closetItems, setClosetItems] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const addItemToCloset = async (newItem) => {
        try {
            const itemWithUser = {
            name: newItem.name,                
            category: newItem.category,
            subCategory: newItem.subCategory,   
            color: newItem.color,
            userId: user._id, 
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
         
    return (
        <div className="closet-container">
            <div className="closet-header">
                <h1>Hello, {user?.username || "Turtle"}!</h1>
                <p>Add a new item to your closet</p>
            </div>

            <div className="closet-form-section">
                <AddItem onAdd={addItemToCloset} />
            </div>

            <div className="items-list">
                <h2>Your Closet: {closetItems.length} items</h2>
                {loading ? (
                    <p className="loading-message">Loading your items...</p>
                ) : (
                    <>
                        {closetItems.length > 0 ? (
                            <ul>
                                {closetItems.map((item, index) => (
                                    <li key={item._id || index}>
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-details">
                                            {item.category} - {item.subCategory} - {item.color}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-message">No items in your closet yet.</p>
                        )}
                    </>
                )}
            </div>
        </div> 
    );
};

export default ClosetForm; 