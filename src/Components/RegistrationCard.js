import React, { useState } from 'react';
import axios from 'axios'; // Make sure axios is imported
import { useNavigate } from 'react-router-dom';
import '../Assets/RegistrationPage.css';
import { toast } from 'sonner';

const RegistrationCard = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigating after successful registration

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate that passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // Send POST request to the server
      const response = await axios.post('http://localhost:4000/register', {
        email,
        password,
        fname,
        lname,
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage(error.response ? error.response.data.message : 'An error occurred during signup.');
      toast.error('An error occurred during signup.');
    }
  };

  return (
    <div className="registration-box">
      <div className="registration-header">
        <header>Register</header>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            className="input-field"
            placeholder="First Name"
            autoComplete="on"
            required
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            className="input-field"
            placeholder="Last Name"
            autoComplete="on"
            required
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
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
        <div className="input-box">
          <input
            type="password"
            className="input-field"
            placeholder="Confirm Password"
            autoComplete="off"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="input-submit">
          <button className="submit-btn" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationCard;
