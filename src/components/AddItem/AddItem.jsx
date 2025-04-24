import React, { useState } from "react";

const categoryOptions = {
    Shirt: ["T-Shirt", "Tank Top", "Long Sleeve", "Turtleneck", "Button-up", "Polo", "Blouse"],
    Pants: ["Jeans", "Khakis", "Trousers", "Leggings", "Shorts"],
    Sweater: ["Cardigan", "Lightweight", "Turtleneck"],
    Skirt: ["Mini", "Midi", "Maxi"],
    Dress: ["Mini", "Midi", "Maxi", "Sleeveless"],
    Shoes: ["Tennis Shoes", "Loafer", "Sandal", "Boot"],
    Jacket: ["Winter", "Rain", "Blazer"]
};

const colorOptions = ["Black", "White", "Blue", "Red", "Green", "Yellow", "Gray", "Pink", "Purple", "Brown", "Pattern"];

const AddItem = ({ onAdd }) => { 
    const newItem = ["Shirt", "Pants", "Sweater", "Skirt", "Dress", "Shoes", "Blazer"];

    const [formData, setFormData] = useState({
        name: "",
        category: "Shirt",
        subCategory: categoryOptions["Shirt"][0],
        color: "",
    });
   
    const handleChange = (e) => {
        const { name, value } = e.target; 
            if (name === "category"){
              setFormData((prev) => ({
            ...prev,
            category: value, 
            subcategory: categoryOptions[value][0],
        }));
    } else {
        setFormData((prev) => ({
            ...prev, 
            [name]: value, 
        }));
    }
    };
const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Item Added", formData);
    onAdd(formData);
    setFormData({
        name: "",
        category: "Shirt",
        subCategory: categoryOptions["Shirt"][0],
        color: "",  
    });
};


return (
    <>
    <h1>Add New Item to Closet</h1>
    <form onSubmit={handleSubmit}>
        <label>
            Custom Title: 
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Yellow Button-Up from Gap"
            required
            />
        </label>
        <br />

        <label>
            Category: 
            <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            >
                 {Object.keys(categoryOptions).map((category, idx) => (
        <option key={idx} value={category}>
          {category}
        </option>
                ))}
            </select>
        </label>
        <br />

        <label>
            Subcategory: 
            <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            >
             {categoryOptions[formData.category].map((sub, idx) => (
        <option key={idx} value={sub}>
          {sub}
        </option>
      ))} 
            </select>
        </label>
        <br />

        <label>
            Color (optional):
            <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            >
            <option value="">--Select a Color--</option>
            {colorOptions.map((color, idx) => (
                <option key={idx} value={color}>
                    {color}
                </option>
            ))}
            </select>
        </label>
        <br />

        <button type="submit">Add Item</button>
        </form>
    </>
);
};


export default AddItem;