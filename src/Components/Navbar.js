import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Import the React Icon
import '../Assets/Navbar.css';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();  // Get the current path
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);  // Reference to the profile dropdown element

  // Get the user from localStorage (or context/store, depending on your app)
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleRecipeClick = () => {
    navigate('/add-recipe');
  };

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <p className="logo" onClick={scrollToTop}>Tamu<span className='Tamu'>Tamu</span> Recipes</p>
      <ul className='navbar-links'>
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/recipes" className={location.pathname === '/recipes' ? 'active' : ''}>Recipes</Link></li>
        
        <li><Link to="/my-recipes" className={location.pathname === '/categories' ? 'active' : ''}>My Recipes</Link></li>
        {/* Add Recipe link only visible if user is logged in */}
        {user && (
          <li><a onClick={handleRecipeClick}>Add Recipe</a></li>
        )}

        <li><a onClick={() => document.getElementById('footer').scrollIntoView({ behavior: 'smooth' })}>Contact Us</a></li>

        {/* If user is logged in, show the profile dropdown with an icon and name */}
        {user ? (
          <li className="profile-dropdown" ref={profileDropdownRef}>
            <a onClick={toggleProfileDropdown}>
              <FaUserCircle className="profile-icon" /> 
              <span className="profile-name">{user.fname} {user.lname}</span> {/* Display user name */}
            </a>
            {isProfileDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to={`/profile/${user._id}`}>User Profile</Link></li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            )}
          </li>
        ) : (
          <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
