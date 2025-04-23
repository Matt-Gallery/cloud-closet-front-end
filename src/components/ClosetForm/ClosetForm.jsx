import { useState } from "react";
import AddItem from "../AddItem/AddItem";

const ClosetForm = () => {
    const [closetItems, setClosetItems] = useState([]);

    const addItemToCloset = (newItem) => {
        setClosetItems((prevItems) => [...prevItems, newItem]);
    };

    return (
        <>
      <h1>Hello, Beauty!</h1>
      <p>Add a new item to your closet</p>

      {/* AddItem form */}
      <AddItem onAdd={addItemToCloset} />

      {/* Display Closet Items */}
      <h2>Your Closet:</h2>
      <ul>
        {closetItems.map((item, index) => (
            <li key={index}>
                {item.title} -{item.category}
            </li>
        ))}
      </ul>
      </> 
    );
  };
    
export default ClosetForm; 