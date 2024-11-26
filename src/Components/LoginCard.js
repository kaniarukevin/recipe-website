import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook
import axios from 'axios'; // Import axios for making API requests

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous messages
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });

      if (response.status === 200) {
        // Store user info in local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect based on user role
        if (response.data.user.role === 'admin') {
          navigate('/home'); // Redirect to /home if the user is an admin
        } else {
          navigate('/home'); // Otherwise, redirect to a different page
        }

        console.log('Login successful:', response.data);
        setSuccessMessage('Login successful!');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      // Handle error (e.g., show error message)
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
            type="email" // Use "email" type for email validation
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
