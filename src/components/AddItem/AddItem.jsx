import React from "react";

const AddItem = () => { 
    const NewItem = ["shirt", "pants", "jacket", "shoes"];

    const [formData, setFormData] =useState({
        name: "",
        type: clothingOptions[0],
    });
   
    const handleChange = (e) => {
        const { name, value } = e.target; 
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }));
    };
const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Item Added", formData);
};


return (
    <>
    <h1>Add New Item to Closet</h1>
    <form onSubmit={handleSubmit}>
        <label>
            Item Name: 
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            />
        </label>
        <br />
        <label>
            Clothing Type: 
            <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            >
                {clothingOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
        <br />
        <button type="submit">Add Item</button>
        </form>

        <p>
            Preview: {formData.name ? `${formData.name} (${formData.type})` : "No item yet"}
        </p>
    </>
);
};


export default AddItem;