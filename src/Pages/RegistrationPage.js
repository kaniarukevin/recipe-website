import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import RegistrationCard from "../Components/RegistrationCard";
import '../Assets/RegistrationPage.css'
import Footer from "../Components/Footer";

const RegistrationPage = () => {
    return (
        <>
        <div className="Image">
            <Navbar />
            <div className="Login">
                <div className="Login-section">
                    <RegistrationCard />
                </div>
                <div className="Register-section">
                    <p>Already have an account?</p>
                    <Link to="/login">Login Here!</Link>
                </div>
            </div>
            </div>
            <Footer/>
        </>
    );
}
export default RegistrationPage;