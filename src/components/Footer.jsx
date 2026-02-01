import React from "react";
import "../styles/footer.scss";

const Footer = () => {
    return (
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-left">
            <h3>🐾 Veterinarska Ambulanta</h3>
            <p>Briga o vašim ljubimcima sa osmehom i poverenjem.</p>
          </div>
  
          <div className="footer-center">
            <h4>Kontakt</h4>
            <p>📍 Ulica Zdravlja 12, Inđija</p>
            <p>📞 +381 65 123 4567</p>
            <p>✉️ info@vet-ambulanta.rs</p>
          </div>
  
          <div className="footer-right">
            <h4>Pratite nas</h4>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>
  
        <div className="footer-bottom">
          © 2026 Veterinarska Ambulanta | Sva prava zadržana
        </div>
      </footer>
    );
  };
  
  export default Footer;
  