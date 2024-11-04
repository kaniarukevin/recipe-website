import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import RegistrationPage from "./Pages/RegistrationPage";
import LoginPage from "./Pages/LoginPage";
import RecipePage from "./Pages/RecipePage";


const App = () => {
  return (
    <LoginPage/>,
    <Router>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recipes" element={<RecipePage/>} />
        </Routes>

    </Router>
    
  );
};

export default App;
