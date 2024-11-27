import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import RecipeCard from '../Components/Recipe'; 
import '../Assets/RecipePage.css';
import { useNavigate } from 'react-router-dom';

const MyRecipesPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sessionExpired, setSessionExpired] = useState(false);  // New state to handle session expiration
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); 
    console.log(token); // Get token from localStorage

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError('You must be logged in to view your recipes.');
                setLoading(false);
                return;
            }

            try {
                // Make a request to the backend to get recipes created by the logged-in user
                const response = await axios.get('http://localhost:4000/api/recipes/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setData(response.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        setSessionExpired(true); // Set session expired state
                        setError('Your session has expired. Please log in again.');
                    } else {
                        setError(`Error: ${err.response.data.message || 'Failed to fetch recipes.'}`);
                    }
                } else if (err.request) {
                    setError('Error: No response from the server.');
                } else {
                    setError('Error: Failed to send the request.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                {sessionExpired ? (
                    <div>
                        <p>{error}</p>
                        <a href="/login" onClick={() => navigate('/login')}>Go to Login</a> {/* Redirect link */}
                    </div>
                ) : (
                    <div>{error}</div>
                )}
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="recipe-page">
                <h1>My Recipes</h1>
                {/* Check if no recipes are found */}
                {data.length === 0 ? (
                    <div className="no-recipes-message">
                        <h2>No Recipes Found</h2>
                        <p>It looks like there are no recipes available right now. Please check back later.</p>
                    </div>
                ) : (
                    <div className="recipe-grid">
                        {data.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default MyRecipesPage;
