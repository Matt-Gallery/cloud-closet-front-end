import React, { useState, useEffect } from "react";

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

const AddItem = ({ onAdd, onUpdate, onDelete, itemToEdit, isEditMode, cancelEdit }) => { 
    const defaultFormData = {
        name: "",
        category: "Shirt",
        subCategory: categoryOptions["Shirt"][0],
        color: "",
    };

    const [formData, setFormData] = useState(defaultFormData);
   
    // Update formData when editing an item
    useEffect(() => {
        if (isEditMode && itemToEdit) {
            setFormData({
                name: itemToEdit.name || "",
                category: itemToEdit.category || "Shirt",
                subCategory: itemToEdit.subCategory || categoryOptions[itemToEdit.category || "Shirt"][0],
                color: itemToEdit.color || "",
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [isEditMode, itemToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target; 
        if (name === "category"){
            setFormData((prev) => ({
                ...prev,
                category: value, 
                subCategory: categoryOptions[value][0],
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
        
        if (isEditMode && itemToEdit) {
            onUpdate(itemToEdit._id, formData);
        } else {
            onAdd(formData);
        }
        
        // Reset form if not editing
        if (!isEditMode) {
            setFormData(defaultFormData);
        }
    };

    const handleCancel = () => {
        if (cancelEdit) {
            cancelEdit();
        }
        setFormData(defaultFormData);
    };

    return (
        <>
            <h1>{isEditMode ? "Edit Closet Item" : "Add New Item to Closet"}</h1>
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

                <div className="form-buttons">
                    <button type="submit">
                        {isEditMode ? "Save Edit" : "Add Item"}
                    </button>
                    {isEditMode && (
                        <>
                            <button 
                                type="button" 
                                onClick={() => onDelete(itemToEdit._id)} 
                                className="delete-button"
                            >
                                Delete Item
                            </button>
                            <button type="button" onClick={handleCancel} className="cancel-button">
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </form>
        </>
    );
};

export default AddItem;