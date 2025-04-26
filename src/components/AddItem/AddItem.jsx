import React, { useState, useEffect } from "react";
import TempRangeSlider from "../TempRangeSlider/TempRangeSlider";
import PrecipRangeSlider from "../PrecipRangeSlider/PrecipRangeSlider";
import "./AddItem.css";

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
        weatherType: [{
            minTemp: 30,
            maxTemp: 80,
            minHumidity: 0,
            maxHumidity: 100,
            minUvIndex: 0,
            maxUvIndex: 10,
            maxWind: 25,
            precipType: "",
            precipIntensity: ""
        }]
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [isAnyTemp, setIsAnyTemp] = useState(false);
    const [isNoPrecip, setIsNoPrecip] = useState(true);

    // Update formData when editing an item
    useEffect(() => {
        if (isEditMode && itemToEdit) {
            // Check if the item has extreme temperature values (meaning "Any temperature" was selected)
            const hasExtremeTemps = itemToEdit.weatherType && 
                                   itemToEdit.weatherType[0] && 
                                   itemToEdit.weatherType[0].minTemp <= -30 && 
                                   itemToEdit.weatherType[0].maxTemp >= 140;
            
            // Set the isAnyTemp state based on the temperature range
            setIsAnyTemp(hasExtremeTemps);
            
            // Check if the item has precipitation settings
            const hasPrecip = itemToEdit.weatherType && 
                             itemToEdit.weatherType[0] && 
                             itemToEdit.weatherType[0].precipType && 
                             itemToEdit.weatherType[0].precipIntensity;
            
            // Set the isNoPrecip state based on precipitation values
            setIsNoPrecip(!hasPrecip);
            
            setFormData({
                name: itemToEdit.name || "",
                category: itemToEdit.category || "Shirt",
                subCategory: itemToEdit.subCategory || categoryOptions[itemToEdit.category || "Shirt"][0],
                color: itemToEdit.color || "",
                weatherType: itemToEdit.weatherType && itemToEdit.weatherType.length > 0
                    ? itemToEdit.weatherType
                    : [{
                        minTemp: 30,
                        maxTemp: 80,
                        minHumidity: 0,
                        maxHumidity: 100,
                        minUvIndex: 0,
                        maxUvIndex: 10,
                        maxWind: 25,
                        precipType: "",
                        precipIntensity: ""
                    }]
            });
        } else {
            setFormData(defaultFormData);
            setIsAnyTemp(false);
            setIsNoPrecip(true);
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

    const handleTempRangeChange = (tempValues) => {
        setFormData(prev => ({
            ...prev,
            weatherType: [{
                ...prev.weatherType[0],
                minTemp: tempValues.min,
                maxTemp: tempValues.max
            }]
        }));
    };

    const handlePrecipChange = (precipValues) => {
        console.log("Precipitation values received:", precipValues);
        
        // Make sure we're receiving valid precipitation values
        if (!precipValues || !precipValues.precipType || !precipValues.precipIntensity) {
            console.error("Invalid precipitation values:", precipValues);
            return;
        }
        
        setFormData(prev => {
            const updatedFormData = {
                ...prev,
                weatherType: [{
                    ...prev.weatherType[0],
                    precipType: precipValues.precipType,
                    precipIntensity: precipValues.precipIntensity
                }]
            };
            
            console.log("Updated form data:", updatedFormData);
            return updatedFormData;
        });
    };

    const handleAnyTempChange = (e) => {
        const isChecked = e.target.checked;
        setIsAnyTemp(isChecked);
        
        if (isChecked) {
            setFormData(prev => ({
                ...prev,
                weatherType: [{
                    ...prev.weatherType[0],
                    minTemp: -30,
                    maxTemp: 140
                }]
            }));
        } else {
            const { category, subCategory } = formData;
            let minTemp = 30, maxTemp = 80;
            
            switch (category) {
                case "Shirt":
                    if (subCategory === "Tank Top") {
                        minTemp = 75;
                        maxTemp = 100;
                    } else if (subCategory === "T-Shirt") {
                        minTemp = 65;
                        maxTemp = 100;
                    } else if (subCategory === "Long Sleeve") {
                        minTemp = 45;
                        maxTemp = 70;
                    } else if (subCategory === "Turtleneck") {
                        minTemp = 30;
                        maxTemp = 55;
                    }
                    break;
                    
                case "Pants":
                    if (subCategory === "Shorts") {
                        minTemp = 70;
                        maxTemp = 100;
                    } else if (subCategory === "Leggings") {
                        minTemp = 30;
                        maxTemp = 70;
                    }
                    break;
                    
                case "Jacket":
                    if (subCategory === "Winter") {
                        minTemp = 0;
                        maxTemp = 40;
                    } else if (subCategory === "Rain") {
                        minTemp = 30;
                        maxTemp = 70;
                    } else if (subCategory === "Blazer") {
                        minTemp = 50;
                        maxTemp = 80;
                    }
                    break;
                    
                case "Shoes":
                    if (subCategory === "Sandal") {
                        minTemp = 65;
                        maxTemp = 100;
                    } else if (subCategory === "Boot") {
                        minTemp = 0;
                        maxTemp = 50;
                    }
                    break;
                
                default:
                    break;
            }
            
            setFormData(prev => ({
                ...prev,
                weatherType: [{
                    ...prev.weatherType[0],
                    minTemp,
                    maxTemp
                }]
            }));
        }
    };

    const handleNoPrecipChange = (e) => {
        const isChecked = e.target.checked;
        console.log(`No Precipitation checkbox changed: ${isChecked}`);
        setIsNoPrecip(isChecked);
        
        if (isChecked) {
            // When "No precipitation" is checked, clear the precipitation values
            console.log("Clearing precipitation values");
            setFormData(prev => {
                const updated = {
                    ...prev,
                    weatherType: [{
                        ...prev.weatherType[0],
                        precipType: "",
                        precipIntensity: ""
                    }]
                };
                console.log("Updated form data (precipitation cleared):", updated);
                return updated;
            });
        } else {
            // Set default precipitation values when checkbox is unchecked
            // Use heavy rain as default when unchecking to ensure it's not just defaulting to light
            console.log("Setting default precipitation to heavy rain");
            setFormData(prev => {
                const updated = {
                    ...prev,
                    weatherType: [{
                        ...prev.weatherType[0],
                        precipType: "rain",
                        precipIntensity: "heavy" // Explicitly set to heavy to test
                    }]
                };
                console.log("Updated form data (precipitation defaults set):", updated);
                return updated;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Log the final form data before submission
        console.log("Submitting form data:", formData);
        
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

    // Get recommended temperature range defaults based on category/subcategory
    useEffect(() => {
        const { category, subCategory } = formData;
        
        // Only set default temperature ranges for new items (not when editing) and when "Any" is not checked
        if (!isEditMode && !isAnyTemp) {
            let minTemp = 30, maxTemp = 80;
            
            switch (category) {
                case "Shirt":
                    if (subCategory === "Tank Top") {
                        minTemp = 75;
                        maxTemp = 100;
                    } else if (subCategory === "T-Shirt") {
                        minTemp = 65;
                        maxTemp = 100;
                    } else if (subCategory === "Long Sleeve") {
                        minTemp = 45;
                        maxTemp = 70;
                    } else if (subCategory === "Turtleneck") {
                        minTemp = 30;
                        maxTemp = 55;
                    }
                    break;
                    
                case "Pants":
                    if (subCategory === "Shorts") {
                        minTemp = 70;
                        maxTemp = 100;
                    } else if (subCategory === "Leggings") {
                        minTemp = 30;
                        maxTemp = 70;
                    }
                    break;
                    
                case "Jacket":
                    if (subCategory === "Winter") {
                        minTemp = 0;
                        maxTemp = 40;
                    } else if (subCategory === "Rain") {
                        minTemp = 30;
                        maxTemp = 70;
                        
                        // For rain jackets, set precipitation to rain by default
                        if (isNoPrecip) {
                            setIsNoPrecip(false);
                            setFormData(prev => ({
                                ...prev,
                                weatherType: [{
                                    ...prev.weatherType[0],
                                    precipType: "rain",
                                    precipIntensity: "moderate"
                                }]
                            }));
                        }
                    } else if (subCategory === "Blazer") {
                        minTemp = 50;
                        maxTemp = 80;
                    }
                    break;
                    
                case "Shoes":
                    if (subCategory === "Sandal") {
                        minTemp = 65;
                        maxTemp = 100;
                    } else if (subCategory === "Boot") {
                        minTemp = 0;
                        maxTemp = 50;
                        
                        // For boots, set precipitation to snow by default
                        if (isNoPrecip) {
                            setIsNoPrecip(false);
                            setFormData(prev => ({
                                ...prev,
                                weatherType: [{
                                    ...prev.weatherType[0],
                                    precipType: "snow",
                                    precipIntensity: "moderate"
                                }]
                            }));
                        }
                    }
                    break;
                
                default:
                    break;
            }
            
            setFormData(prev => ({
                ...prev,
                weatherType: [{
                    ...prev.weatherType[0],
                    minTemp,
                    maxTemp
                }]
            }));
        }
    }, [formData.category, formData.subCategory, isEditMode, isAnyTemp]);

    return (
        <>
            <h1>{isEditMode ? "Edit Closet Item" : "Add New Item to Closet"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    <div className="form-left-column">
                        <div className="form-group">
                            <label htmlFor="name">Custom Title:</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Yellow Button-Up"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="category">Category:</label>
                            <select
                                id="category"
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
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="subCategory">Subcategory:</label>
                            <select
                                id="subCategory"
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
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="color">Color:</label>
                            <select
                                id="color"
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
                        </div>
                    </div>
                    
                    <div className="form-right-column">
                        <div className="temp-range-section">
                            <div className="temp-range-header">
                                <label>Temperature Range:</label>
                                <div className="any-temp-checkbox">
                                    <input
                                        type="checkbox"
                                        id="anyTemp"
                                        checked={isAnyTemp}
                                        onChange={handleAnyTempChange}
                                    />
                                    <label htmlFor="anyTemp">Any temperature</label>
                                </div>
                            </div>
                            <p className="temp-range-help">When do you wear this item?</p>
                            <TempRangeSlider 
                                minTemp={formData.weatherType[0].minTemp}
                                maxTemp={formData.weatherType[0].maxTemp}
                                onChange={handleTempRangeChange}
                                disabled={isAnyTemp}
                            />
                        </div>
                        
                        <div className="precip-range-section">
                            <div className="precip-range-header">
                                <label>Precipitation:</label>
                                <div className="no-precip-checkbox">
                                    <input
                                        type="checkbox"
                                        id="noPrecip"
                                        checked={isNoPrecip}
                                        onChange={handleNoPrecipChange}
                                    />
                                    <label htmlFor="noPrecip">No precipitation</label>
                                </div>
                            </div>
                            <p className="precip-range-help">What precipitation conditions is this item suitable for?</p>
                            {/* Log current precipitation values */}
                            {console.log("Current precipitation values:", {
                                type: formData.weatherType[0].precipType,
                                intensity: formData.weatherType[0].precipIntensity,
                                disabled: isNoPrecip
                            })}
                            <PrecipRangeSlider 
                                precipType={formData.weatherType[0].precipType}
                                precipIntensity={formData.weatherType[0].precipIntensity}
                                onChange={handlePrecipChange}
                                disabled={isNoPrecip}
                            />
                        </div>
                    </div>
                </div>

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