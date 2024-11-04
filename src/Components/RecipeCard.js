// src/Components/RecipeForm.js

import React, { useState } from 'react';
import axios from 'axios';

const RecipeCard = () => {
    const [formData, setFormData] = useState({
        recipeName: '',
        ingredients: '',
        instructions: '',
        recipeOwner: '',
        recipeImage: null
    });

    // Handle input change for text fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle file input for recipe image
    const handleFileChange = (e) => {
        setFormData((prevData) => ({ ...prevData, recipeImage: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            await axios.post('http://localhost:3000/api/recipes', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Recipe submitted successfully!');
            setFormData({ recipeName: '', ingredients: '',prepTime: '', instructions: '', recipeOwner: '', recipeImage: null });
        } catch (error) {
            console.error('Error submitting recipe:', error);
        }
    };

    return (
        <div id='recipe-form' className='recipe-form'>
            <h3>Submit Your Recipe</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="recipe-name">Recipe Name</label>
                    <input
                        type="text"
                        id="recipename"
                        name="recipeName"
                        value={formData.recipeName}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="ingredients">Ingredients</label>
                    <textarea
                        id="ingredients"
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="prepTime">Preparation Time</label>
                    <textarea
                        id="time"
                        name="prepTime"
                        value={formData.prepTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="instructions">Instructions</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="recipe-owner">Recipe Owner</label>
                    <input
                        type="text"
                        id="recipe-owner"
                        name="recipeOwner"
                        value={formData.recipeOwner}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="recipe-image">Recipe Image</label>
                    <input
                        type="file"
                        id="recipe-image"
                        name="recipeImage"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Submit Recipe</button>
            </form>
        </div>
    );
};

export default RecipeCard;
