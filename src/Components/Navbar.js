import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Assets/Navbar.css';

const handleAddRecipeClick = () => {
  const addRecipe = document.getElementById('recipe-form');
  if (addRecipe) {
    addRecipe.scrollIntoView({ behavior: 'smooth' });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Navbar = () => {
  const navigate = useNavigate();
  
  // Get the user from localStorage (or context/store, depending on your app)
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove the user from localStorage
    navigate('/login'); // Redirect to login page
  };
  const handleRecipeClick = () => {
    navigate('/recipes');
  }

  return (
    <nav className="navbar">
      <p className="logo" onClick={scrollToTop}>Tamu<span className='Tamu'>Tamu</span> Recipes</p>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/recipes">Recipes</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><a onClick={handleAddRecipeClick}>Add Recipe</a></li>
        <li><a onClick={() => document.getElementById('footer').scrollIntoView({ behavior: 'smooth' })}>Contact Us</a></li>

        {/* If user is logged in, show the profile link and logout option */}
        {user ? (
          <>
            <li><Link to={`/profile/${user._id}`}>{user.fname} {user.lname}</Link></li>
            <li><a onClick={handleLogout}>Logout</a></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
