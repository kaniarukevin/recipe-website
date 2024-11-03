import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import LoginCard from "../Components/LoginCard";
import '../Assets/LoginPage.css'
import Footer from "../Components/Footer";
const LoginPage = () => {
    return (
        <>
        <div className="Image">
            <Navbar />
            <div className="Login">
                <div className="Login-section">
                    <LoginCard />
                </div>
                <div className="Register-section">
                    <p>Don't have an account?</p>
                    <Link to="/registration">Register Here!</Link>
                </div>
            </div>
            </div>
            <Footer/>
        </>
    );
};

export default LoginPage;
