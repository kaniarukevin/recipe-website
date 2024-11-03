// src/Components/RecipeCard.js

import React from 'react';


const Recipe = ({ recipe }) => {
    return (
        <div className="recipe-card">
            <h4>{recipe.name}</h4>
            <p>{recipe.description}</p>
        </div>
    );
};

export default Recipe;
