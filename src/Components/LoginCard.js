import React, { useState } from 'react';


const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // For now, disable actual submit and use a placeholder function
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    console.log('Email:', email);
    

    // Placeholder error message just for demonstration
    setErrorMessage('This feature is under development.');
  };

  return (
    <div className="Login-box">
      <div className="Login-header">
        <header>Login</header>
      </div>
      <form onSubmit={handleSubmit}>
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
