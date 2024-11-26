import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import RegistrationPage from "./Pages/RegistrationPage";
import LoginPage from "./Pages/LoginPage";
import RecipePage from "./Pages/RecipePage";
import { Toaster } from "sonner";



const App = () => {
  return (
    <>
    <Router>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recipes" element={<RecipePage/>} />
        </Routes>

    </Router>
    <Toaster
  richColors
  position="top-right"
  toastOptions={{
    duration: 3000, // Toast closes after 3 seconds
    style: { animationDuration: "0.1s" }, // Makes it appear faster
  }}
/>
    </>
    
  );
};

export default App;
