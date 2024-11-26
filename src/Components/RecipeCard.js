import React, { useState } from 'react';
import axios from 'axios';

const RecipeForm = () => {
    const [formData, setFormData] = useState({
        recipeName: '',
        ingredients: '',
        prepTime: '',
        instructions: '',
        recipeOwner: '',
        recipeImage: null
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle input change for text fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle file input for recipe image
    const handleFileChange = (e) => {
        setFormData((prevData) => ({ ...prevData, recipeImage: e.target.files[0] }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // Append form data to FormData object
        data.append('recipeName', formData.recipeName);
        data.append('ingredients', formData.ingredients);
        data.append('prepTime', formData.prepTime);
        data.append('instructions', formData.instructions);
        data.append('recipeOwner', formData.recipeOwner);
        if (formData.recipeImage) {
            data.append('recipeImage', formData.recipeImage);
        }

        try {
            const response = await axios.post('http://localhost:4000/api/addRecipes', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccessMessage('Recipe submitted successfully!');
            setErrorMessage('');
            console.log(response.data);

            // Reset form
            setFormData({
                recipeName: '',
                ingredients: '',
                prepTime: '',
                instructions: '',
                recipeOwner: '',
                recipeImage: null
            });
        } catch (error) {
            console.error('Error submitting recipe:', error);
            setSuccessMessage('');
            setErrorMessage('Failed to submit the recipe. Please try again.');
        }
    };

    return (
        <div id="recipe-form" className="recipe-form">
            <h3>Submit Your Recipe</h3>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="recipe-name">Recipe Name</label>
                    <input
                        type="text"
                        id="recipe-name"
                        name="recipeName"
                        value={formData.recipeName}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="ingredients">Ingredients (comma-separated)</label>
                    <textarea
                        id="ingredients"
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        placeholder="e.g., Flour, Sugar, Eggs"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="prepTime">Preparation Time</label>
                    <input
                        type="text"
                        id="prepTime"
                        name="prepTime"
                        value={formData.prepTime}
                        onChange={handleChange}
                        placeholder="e.g., 30 minutes"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="instructions">Instructions (comma-separated)</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        placeholder="e.g., Mix ingredients, Bake at 350°F"
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
                        accept="image/*"
                    />
                </div>

                <button type="submit" className="submit-btn">Submit Recipe</button>
            </form>
        </div>
    );
};

export default RecipeForm;
