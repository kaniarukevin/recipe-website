import React from "react";
import '../Assets/Footer.css'; // Import CSS file for styling
import emailIcon from "../Assets/Icons/email.png";
import phoneIcon from "../Assets/Icons/phone-call.png";
import facebookIcon from "../Assets/Icons/facebook.png";
import twitterIcon from "../Assets/Icons/twitter.png";
import instagramIcon from "../Assets/Icons/instagram.png";

const Footer = () => {
  return (
    <footer id="footer" className="footer"> {/* Changed to <footer> element */}
      <div className="footer-content">
        <div className="footer-section location">
          <h4>Location</h4>
          <p>Westland Business Park, 5th Floor</p>
        </div>

        <div className="footer-section contact">
          <h4>Contacts</h4>
          <p><img src={phoneIcon} alt="Phone" className="icon" /> +254-202-020-00</p>
          <p><img src={emailIcon} alt="Email" className="icon" /> info@tamutamurecipes.com</p>
        </div>

        <div className="footer-section socials">
          <h4>Follow Us</h4>
          <a href="https://www.facebook.com"><img src={facebookIcon} alt="Facebook" className="social-icon" /></a>
          <a href="https://www.twitter.com"><img src={twitterIcon} alt="Twitter" className="social-icon" /></a>
          <a href="https://www.instagram.com"><img src={instagramIcon} alt="Instagram" className="social-icon" /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Tamu Tamu Recipe. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
