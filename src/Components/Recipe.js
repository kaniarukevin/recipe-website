import React, { useState } from 'react';
import { FaClock } from 'react-icons/fa'; // Clock icon
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // Heart icons (outline and filled)
import { FaStar, FaStarHalf, FaRegStar } from 'react-icons/fa'; // Star icons (filled, half-filled, empty)
import { Link } from 'react-router-dom'; 
import defaultImage from '../Components/pexels-ella-olsson-572949-1640777.jpg'; // Default image URL

const RecipeCard = ({ recipe }) => {
    const [isFavorited, setIsFavorited] = useState(false);

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited); // Toggle the favorited state
    };

    // Calculate the average rating (out of 5)
    const calculateAverageRating = (ratings) => {
        if (ratings && ratings.length > 0) {
            const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            return total / ratings.length;
        }
        return 0; // If no ratings, return 0
    };

    const averageRating = calculateAverageRating(recipe.ratings); // Get average rating

    // Render the stars based on average rating
    const renderStars = (rating) => {
        const filledStars = Math.floor(rating); // Full stars
        const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Half star (if any)
        const emptyStars = 5 - filledStars - halfStar; // Remaining empty stars

        return (
            <>
                {[...Array(filledStars)].map((_, index) => (
                    <FaStar key={`filled-${index}`} className="star-icon" />
                ))}
                {halfStar === 1 && <FaStarHalf key="half" className="star-icon half" />}
                {[...Array(emptyStars)].map((_, index) => (
                    <FaRegStar key={`empty-${index}`} className="star-icon" />
                ))}
            </>
        );
    };

    return (
        <div className="recipe-card">
            {/* Recipe Image */}
            <img 
                src={recipe.image ? `../uploads/${recipe.image}` : defaultImage} 
                alt={recipe.name || "Recipe"} 
                className="recipe-image" 
            />

            {/* Recipe Name */}
            <h2 className="recipe-title">{recipe.name || "Unnamed Recipe"}</h2>

            {/* Display Rating */}
            <div className="recipe-rating">
                {renderStars(averageRating)}
                <span className="rating-value">({averageRating.toFixed(1)})</span>
            </div>

            {/* Prep and Cook Times */}
            <div className="recipe-time">
                <p>
                    <FaClock className="icon" /> Prep Time: {recipe.prepTime || 0} min
                </p>
                <p>
                    <FaClock className="icon" /> Cook Time: {recipe.cookingTime || 0} min
                </p>
            </div>

            {/* Categories */}
            <div className="recipe-categories">
                {recipe.recipeCategory ? (
                    <span className="category">{recipe.recipeCategory}</span>
                ) : (
                    <span>No Categories Available</span>
                )}
            </div>

            {/* Cuisine */}
            <div className="recipe-cuisine">
                {recipe.cuisine ? (
                    <span className="cuisine">{recipe.cuisine}</span>
                ) : (
                    <span>No Cuisine Specified</span>
                )}
            </div>

            {/* Diet Type */}
            <div className="recipe-diet">
                {recipe.dietType ? (
                    <span className="diet">{recipe.dietType}</span>
                ) : (
                    <span>No Diet Information</span>
                )}
            </div>

            {/* Add to Favorites */}
            <button 
                className={`add-to-favorites ${isFavorited ? 'filled' : ''}`} 
                onClick={toggleFavorite}
            >
                {isFavorited ? <AiFillHeart className="icon" /> : <AiOutlineHeart className="icon" />}
            </button>

            {/* View More */}
            <div className="recipe-buttons">
                <Link to={`/recipe/${recipe._id}`} className="view-more">
                    View More
                </Link>
            </div>
        </div>
    );
};

export default RecipeCard;
