import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import '../Assets/RegistrationPage.css';
import Footer from "../Components/Footer";

const RegistrationCard = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration form submitted');
    console.log('Name:', name); 
    console.log('Email:', email);
    

    
    setErrorMessage('This feature is under development.');
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
            placeholder="Name"
            autoComplete="on"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="text"
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
        <div className="input-submit">
          <button className="submit-btn" id="submit" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

const RegistrationPage = () => {
  return (
    <>
      <Navbar />
      <div className="registration">
        <div className="register-section">
          <p>Already have an account?</p>
          <Link to="/login">Login Here!</Link>
        </div>
        <div className="registration-box-container">
          <RegistrationCard />
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default RegistrationPage;
