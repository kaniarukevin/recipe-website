import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import RecipeCard from "../Components/RecipeCard";
import Recipe from "../Components/Recipe";
import '../Assets/HomePage.css';
import heroimage from'../Pages/Food_Image-ai-brush-removebg-igl1rom.png';

const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            // Placeholder data
            const response = [
                { id: 1, name: 'Spaghetti Carbonara', description: 'Creamy and delicious pasta.' },
                { id: 2, name: 'Chicken Alfredo', description: 'Rich and savory chicken pasta.' },
                { id: 3, name: 'Beef Stroganoff', description: 'Tender beef in a creamy sauce.' },
                { id: 4, name: 'Vegetable Stir-Fry', description: 'Healthy and colorful veggie mix.' },
            ];
            setRecipes(response);
        };

        fetchRecipes();
    }, []);

    const handleAddRecipeClick = () => {
       navigate('/add-recipe');
      };
      const handleRecipeClick = () => {
        navigate('/recipes');
       };
    
      const handleViewRecipeClick = () => {
        const viewRecipe = document.getElementById('recipe-list');
        if (viewRecipe) {
            viewRecipe.scrollIntoView({ behavior: 'smooth' });
        }
      };
    return (
        <>
            <Navbar />
           
            <div className="hero-section">
                <div className="text">
                    <h2>Welcome to TamuTamu Recipes!</h2>
                    <p>
                        Discover and share delicious recipes with ease! Whether you’re a culinary 
                        enthusiast or just looking for new meal ideas, TamuTamu Recipes is the perfect 
                        place for you. Browse our collection, submit your favorite recipes, and connect 
                        with a community of food lovers. Start your culinary adventure today and bring 
                        your kitchen creations to life!
                    </p>
                    <div className="cta-buttons">
                    <button className="cta-addRecipe" onClick={handleAddRecipeClick}>
            Add Recipe
        </button>
                        <Link className="cta-button" onClick={handleViewRecipeClick} >View Recipes</Link>
                    </div>
                </div>
                <img className="heroImage" src={heroimage} alt="Delicious Food" />
            </div>

            

            <h3 className="section-title">Featured Recipes</h3>
            <div id='recipe-list' className="recipe-list">
                
                {recipes.map(recipe => (
                    <Recipe key={recipe.id} recipe={recipe} />
                ))}
            </div>
            <button className="view-more" onClick={handleRecipeClick}>View More Recipes</button>
            <Footer/>
        </>
    );
};

export default HomePage;
