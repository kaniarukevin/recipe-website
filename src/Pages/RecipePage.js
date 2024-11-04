import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import RecipeCard from '../Components/Recipe'; 
import '../Assets/RecipePage.css'

const RecipePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/recipes');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Navbar/>
        <div className="recipe-page">
            <h1>All Recipes</h1>
            <div className="recipe-grid">
                {data.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default RecipePage;
