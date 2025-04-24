import { useContext, useState } from "react";
import AddItem from "../AddItem/AddItem";
import { UserContext } from "../../contexts/UserContext";

const ClosetForm = () => {
    const { user } = useContext(UserContext);
    const [closetItems, setClosetItems] = useState([]);


    const addItemToCloset = async (newItem) => {
        //const fakeUserId = "6627fa6bc2a4a1d2f86f2a8f"; // 👈 Use a valid ObjectId from your DB

        //const itemWithUser = {
        //  ...newItem,
        //  userId: fakeUserId, // ✅ temporary override
       //};

        try {
            const itemWithUser = {
                ...newItem,
            userId: user._id, 
            };

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
        <>
      <h1>Hello, Beauty!</h1>
      <p>Add a new item to your closet</p>

      <AddItem onAdd={addItemToCloset} />

      <h2>Your Closet:</h2>
      <ul>
        {closetItems.map((item, index) => (
            <li key={index}>
                {item.name} - {item.category}
            </li>
        ))}
      </ul>
      </> 
    );
};

export default ClosetForm; 