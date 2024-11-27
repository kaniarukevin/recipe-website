import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios'; // For API requests

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Make a login request to the backend
      const response = await axios.post('http://localhost:4000/login', { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;

        // Store token and user info in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect user based on role
        if (user.role === 'admin') {
          navigate('/admin-dashboard'); // Redirect admin to admin dashboard
        } else {
          navigate('/home'); // Redirect regular users to home
        }

        setSuccessMessage('Login successful!');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      // Handle login errors
      console.error('Error during login:', error.response ? error.response.data : error);
      setErrorMessage(error.response ? error.response.data.message : 'An error occurred.');
    }
  };

  return (
    <div className="Login-box">
      <div className="Login-header">
        <header>Login</header>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            autoComplete="on"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            autoComplete="off"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Display error or success messages */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="input-submit">
          <button className="submit-btn" id="submit" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginCard;
