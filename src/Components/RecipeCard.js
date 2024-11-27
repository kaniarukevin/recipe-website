import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const RecipeForm = () => {
    const [formData, setFormData] = useState({
        recipeName: '',
        prepTime: '',
        cookingTime: '',
        recipeOwner: '',
        ingredients: [''], // Initial ingredient field
        instructions: [''], // Initial instruction field
        recipeCategory: '',
        cuisine: '', // New field for cuisine
        description: '', // New field for short description
        dietType: '' // New field for diet type
    });

    const [categoryInput, setCategoryInput] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const token = localStorage.getItem('token');
    console.log('Token from front end:', token); // Add this line to verify the token

    const isLoggedIn = Boolean(token);

    if (!isLoggedIn) {
        return <p>You need to be logged in to submit a recipe.</p>;
        toast.error('You need to be logged in to submit a recipe.');
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddField = (field) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: [...prevData[field], '']
        }));
    };

    const handleRemoveField = (index, field) => {
        const newValues = [...formData[field]];
        newValues.splice(index, 1);
        setFormData((prevData) => ({ ...prevData, [field]: newValues }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submit behavior

        // Check if there are any ingredients and instructions
        if (formData.ingredients.some(ingredient => ingredient.trim() === '') || formData.instructions.some(instruction => instruction.trim() === '')) {
            setErrorMessage('Please provide at least one ingredient and one instruction.');
            toast.error('Please provide at least one ingredient and one instruction.');
            return;
        }

        const data = new FormData();
        data.append('recipeName', formData.recipeName);
        data.append('prepTime', formData.prepTime);
        data.append('cookingTime', formData.cookingTime);
        data.append('recipeOwner', formData.recipeOwner);
        data.append('recipeCategory', formData.recipeCategory); 
        data.append('cuisine', formData.cuisine);
        data.append('description', formData.description);
        data.append('dietType', formData.dietType);
        
        formData.ingredients.forEach((ingredient, index) =>
            data.append(`ingredients[${index}]`, ingredient)
        );
        
        formData.instructions.forEach((instruction, index) =>
            data.append(`instructions[${index}]`, instruction)
        );

        try {
            const response = await axios.post('http://localhost:4000/api/addRecipes', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccessMessage('Recipe submitted successfully!');
            toast.success('Recipe submitted successfully!');
            setErrorMessage('');
            console.log(response.data);

            // Reset the form after successful submission
            setFormData({
                recipeName: '',
                ingredients: [''],
                prepTime: '',
                cookingTime: '',
                recipeOwner: '',
                recipeCategory: '',
                cuisine: '',
                description: '',
                dietType: ''
            });
        } catch (error) {
            console.error('Error submitting recipe:', error);
            toast.error('Failed to submit the recipe. Please try again.');
            setSuccessMessage('');
            setErrorMessage('Failed to submit the recipe. Please try again.');
        }
    };

    return (
        <div id="recipe-form" className="recipe-form">
            <h3>Submit Your Recipe</h3>
            <form onSubmit={handleSubmit}>
                {/* Recipe Name */}
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

                {/* Ingredients */}
                <div className="form-group">
                    <label>Ingredients</label>
                    {formData.ingredients && formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="dynamic-field">
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) =>
                                    setFormData((prevData) => {
                                        const newIngredients = [...prevData.ingredients];
                                        newIngredients[index] = e.target.value;
                                        return { ...prevData, ingredients: newIngredients };
                                    })
                                }
                                placeholder={`Ingredient ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveField(index, 'ingredients')}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="add-btn"
                        onClick={() => handleAddField('ingredients')}
                    >
                        Add Ingredient
                    </button>
                </div>

                {/* Instructions */}
                <div className="form-group">
                    <label>Instructions</label>
                    {formData.instructions && formData.instructions.map((instruction, index) => (
                        <div key={index} className="dynamic-field">
                            <input
                                type="text"
                                value={instruction}
                                onChange={(e) =>
                                    setFormData((prevData) => {
                                        const newInstructions = [...prevData.instructions];
                                        newInstructions[index] = e.target.value;
                                        return { ...prevData, instructions: newInstructions };
                                    })
                                }
                                placeholder={`Instruction ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveField(index, 'instructions')}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="add-btn"
                        onClick={() => handleAddField('instructions')}
                    >
                        Add Instruction
                    </button>
                </div>
                <div className="form-group">
                    <label htmlFor="recipe-category">Category</label>
                    <input
                        type="text"
                        id="recipe-category"
                        name="recipeCategory"
                        value={formData.recipeCategory}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Cuisine */}
                <div className="form-group">
                    <label htmlFor="cuisine">Cuisine</label>
                    <input
                        type="text"
                        id="cuisine"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description">Description (max 300 characters)</label>
                    <textarea
                        id="description"
                        name="description"
                        maxLength="300"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Preparation and Cooking Times */}
                <div className="prep-cook-time">
                    <div className="form-group">
                        <label htmlFor="prepTime">Preparation Time (min)</label>
                        <input
                            type="number"
                            id="prepTime"
                            name="prepTime"
                            value={formData.prepTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cookingTime">Cooking Time (min)</label>
                        <input
                            type="number"
                            id="cookingTime"
                            name="cookingTime"
                            value={formData.cookingTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                

                {/* Diet Type */}
                <div className="form-group">
                    <label htmlFor="dietType">Diet Type</label>
                    <select
                        id="dietType"
                        name="dietType"
                        value={formData.dietType}
                        onChange={handleChange}
                    >
                        <option value="">Select Diet Type</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Gluten-Free">Gluten-Free</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                    </select>
                </div>

                <div className="form-group">
                    <button type="submit">Submit Recipe</button>
                </div>
            </form>
        </div>
    );
};

export default RecipeForm;
