import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Assets/RegistrationPage.css';
import { toast } from 'sonner';

const RegistrationCard = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState(''); // New state for gender
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate that passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }

    // Validate that gender is selected
    if (!gender) {
      setErrorMessage('Please select your gender.');
      toast.error('Please select your gender.');
      return;
    }

    try {
      // Send POST request to the server
      const response = await axios.post('http://localhost:4000/register', {
        email,
        password,
        fname,
        lname,
        gender, // Include gender in the request
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
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
        {/* Gender Dropdown */}
        <div className="input-box">
          <select
            className="input-field"
            required
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
            <option value="prefer not to say">Prefer not to say</option>
          </select>
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
