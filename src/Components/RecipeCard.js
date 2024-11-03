// src/Components/RecipeForm.js

import React, { useState } from 'react';


const RecipeCard = () => {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Recipe submitted');
        console.log('Recipe Name:', recipeName);
        console.log('Ingredients:', ingredients);
        console.log('Instructions:', instructions);

        setRecipeName('');
        setIngredients('');
        setInstructions('');
    };

    return (
        <div id='recipe-form' className='recipe-form'>
            <h3>Submit Your Recipe</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="recipe-name">Recipe Name</label>
                    <input
                        type="text"
                        id="recipe-name"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ingredients">Ingredients</label>
                    <textarea
                        id="ingredients"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="instructions">Instructions</label>
                    <textarea
                        id="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Submit Recipe</button>
            </form>
        </div>
    );
};

export default RecipeCard;
