// src/components/RecipeCard.js
import React from 'react';

const Recipe = ({ recipe }) => {
    return (
        <div className="recipe-card">
            <img src={`../uploads/${recipe.image}`} alt={recipe.name} className="recipe-image" />
            <h2>{recipe.name}</h2>
            <p><strong>Owner:</strong> {recipe.owner}</p>
            <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
        </div>
    );
};

export default Recipe;
