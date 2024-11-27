import React from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import RecipeForm from "../Components/RecipeCard";
import '../Assets/AddRecipe.css';

const AddRecipes = () => {
    return (
        <>
        <Navbar/>
        <RecipeForm/>
        <Footer/>
        </>
    );
}
export default AddRecipes;
