import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Assets/SpecificRecipe.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { FaStar } from 'react-icons/fa';
import { toast } from 'sonner';
import defaultImage from '../Components/pexels-ella-olsson-572949-1640777.jpg'; // Default image URL

const SpecificRecipe = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [showAllComments, setShowAllComments] = useState(false); // Toggle for showing all comments
    const [isOwner, setIsOwner] = useState(false); // Check if user is owner
    const [showModal, setShowModal] = useState(false); // Show the modal for editing recipe
    const [editedRecipe, setEditedRecipe] = useState(null); // Store the edited recipe data

    const token = localStorage.getItem('token');
    const isLoggedIn = Boolean(token);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const recipeResponse = await fetch(`http://localhost:4000/api/recipes/${id}`);
                if (!recipeResponse.ok) {
                    throw new Error('Failed to fetch recipe details.');
                }
                const recipeData = await recipeResponse.json();
                setRecipe(recipeData);

                // Check if the logged-in user is the owner of the recipe
                const userId = JSON.parse(atob(token.split('.')[1])).id; // Decode JWT token to get user ID
                if (recipeData.owner === userId) {
                    setIsOwner(true); // User is the owner
                }

                const commentsResponse = await fetch(`http://localhost:4000/api/recipes/${id}/comments-ratings`);
                if (!commentsResponse.ok) {
                    throw new Error('Failed to fetch comments and ratings.');
                }
                const commentsData = await commentsResponse.json();
                setComments(commentsData.comments);
                setAverageRating(commentsData.averageRating);
            } catch (err) {
                setError(err.message);
            }
        };

        if (isLoggedIn) {
            fetchRecipeDetails();
        }
    }, [id, isLoggedIn, token]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            alert('Comment cannot be empty!');
            return;
        }
        try {
            const response = await fetch(`http://localhost:4000/api/recipes/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ comment: newComment }),
            });
            if (!response.ok) {
                throw new Error('Failed to add comment.');
            }
            setNewComment('');
            const updatedCommentsResponse = await fetch(`http://localhost:4000/api/recipes/${id}/comments-ratings`);
            const updatedData = await updatedCommentsResponse.json();
            setComments(updatedData.comments);
        } catch (err) {
            alert(err.message || 'Error adding comment.');
        }
    };

    const handleRatingSubmit = async () => {
        if (rating < 1 || rating > 5) {
            alert('Rating must be between 1 and 5!');
            return;
        }
        try {
            const response = await fetch(`http://localhost:4000/api/recipes/${id}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating }),
            });
            if (!response.ok) {
                throw new Error('Failed to submit rating.');
            }
            const updatedRatingsResponse = await fetch(`http://localhost:4000/api/recipes/${id}/comments-ratings`);
            const updatedData = await updatedRatingsResponse.json();
            setAverageRating(updatedData.averageRating);
        } catch (err) {
            alert(err.message || 'Error submitting rating.');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/recipes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete recipe.');
            }
            toast.success('Recipe deleted successfully!');
        } catch (err) {
            alert(err.message || 'Error deleting recipe.');
        }
    };

    const handleEditClick = () => {
        // Open the edit modal and set the initial values for the modal
        setEditedRecipe({ ...recipe });
        setShowModal(true);
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/recipes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editedRecipe),
            });

            if (!response.ok) {
                throw new Error('Failed to update recipe.');
            }

            toast.success('Recipe updated successfully!');
            setShowModal(false); // Close the modal after successful update
            // Update recipe in state
            setRecipe(editedRecipe);
        } catch (err) {
            alert(err.message || 'Error updating recipe.');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    if (!isLoggedIn) {
        toast.error('You need to be logged in to view or edit a recipe.');
        return <p>You need to be logged in to view this recipe.</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!recipe) {
        return <p>Loading recipe...</p>;
    }

    return (
        <>
            <Navbar />
            <div className="recipe-details">
                <h1>{recipe.name}</h1>
                <img
                    src={recipe.image ? `../uploads/${recipe.image}` : defaultImage}
                    alt={recipe.name || 'Recipe'}
                    className="recipe-image-large"
                />
                <p>
                    <strong>Description:</strong> {recipe.description}
                </p>
                <p>
                    <strong>Cuisine:</strong> {recipe.cuisine}
                </p>
                <p>
                    <strong>Diet Type:</strong> {recipe.dietType}
                </p>
                <p>
                    <strong>Category:</strong> {recipe.recipeCategory}
                </p>
                <p>
                    <strong>Prep Time:</strong> {recipe.prepTime} minutes
                </p>
                <p>
                    <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
                </p>

                <h2>Ingredients</h2>
                <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>

                <h2>Instructions</h2>
                <ol>
                    {recipe.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>

                {/* Comments Section */}
                <div className="comments-section">
                    <h2>
                        Comments{' '}
                        <button
                            onClick={() => setShowAllComments((prev) => !prev)}
                            className="toggle-comments-button"
                        >
                            {showAllComments ? 'Show Less' : 'Show All'}
                        </button>
                    </h2>

                    {comments.length ? (
                        (showAllComments ? comments : comments.slice(0, 3)).map((comment, index) => (
                            <div key={index} className="comment">
                                <p>{comment.comment}</p>
                                <small>Posted on: {new Date(comment.createdAt).toLocaleString()}</small>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet</p>
                    )}

                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows="4"
                        className="comment-input"
                    ></textarea>
                    <button onClick={handleCommentSubmit} className="submit-comment-button">
                        Submit Comment
                    </button>
                </div>

                {/* Ratings Section */}
                <div className="ratings-section">
                    <h2>Rate this Recipe</h2>
                    <p>Average Rating: {averageRating ? `${averageRating} / 5` : 'No ratings yet'}</p>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                size={30}
                                color={star <= rating ? 'gold' : 'gray'}
                                onClick={() => setRating(star)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                    <button onClick={handleRatingSubmit} className="submit-rating-button">
                        Submit Rating
                    </button>
                </div>

                {/* Edit and Delete Buttons */}
                {isOwner && (
                    <div className="edit-delete-buttons">
                        <button onClick={handleEditClick} className="edit-button">Edit Recipe</button>
                        <button onClick={handleDelete} className="delete-button">Delete Recipe</button>
                    </div>
                )}
            </div>

            {/* Edit Recipe Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Recipe</h2>
                        <label>Name</label>
                        <input
                            type="text"
                            value={editedRecipe?.name}
                            onChange={(e) => setEditedRecipe({ ...editedRecipe, name: e.target.value })}
                        />
                        <label>Description</label>
                        <textarea
                            value={editedRecipe?.description}
                            onChange={(e) => setEditedRecipe({ ...editedRecipe, description: e.target.value })}
                        />
                        {/* Add more fields as needed */}
                        <button onClick={handleEditSubmit} className="submit-edit-button">Update Recipe</button>
                        <button onClick={handleModalClose} className="cancel-button">Cancel</button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default SpecificRecipe;
