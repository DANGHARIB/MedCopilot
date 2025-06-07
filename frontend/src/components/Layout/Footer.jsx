import React, { useEffect } from "react";
import "./Footer.css";
import AnimatedLogo from "./AnimatedLogo.jsx";
import {
  Mail,
  X,
  Linkedin,
  Instagram,
  ArrowUp
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Function to open email client
  const handleEmailSupport = () => {
    window.location.href = "mailto:support@medschoolcopilot.com";
  };

  // Dark mode detection
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const setTheme = (e) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    
    setTheme(darkModeQuery);
    darkModeQuery.addEventListener("change", setTheme);
    
    return () => darkModeQuery.removeEventListener("change", setTheme);
  }, []);

  return (
    <footer className="footer-footer">
     
      <div className="footer-footer__container">
        <div className="footer-footer__grid">
          {/* Logo and About section */}
          <div className="footer-footer__section footer-footer__section--about">
            <Link to="/" className="footer-footer__logo" onClick={scrollToTop}>
              <AnimatedLogo />
            </Link>
            <p className="footer-footer__text">
              Your trusted guide to success in medical school, 
              offering personalized support at every step of your journey.
            </p>
            <div className="footer-footer__social">
              <a
                href="https://x.com"
                className="footer-footer__social-link"
                aria-label="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <X size={16} />
              </a>
              <a
                href="https://linkedin.com"
                className="footer-footer__social-link"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://instagram.com"
                className="footer-footer__social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links section */}
          <div className="footer-footer__section">
            <h3 className="footer-footer__title">Quick Links</h3>
            <ul className="footer-footer__list">
              <li>
                <Link to="/" className="footer-footer__link" onClick={scrollToTop}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-footer__link" onClick={scrollToTop}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/medical-schools" className="footer-footer__link">
                  Medical School Database
                </Link>
              </li>
              <li>
                <Link to="/agents" className="footer-footer__link">
                  AI Assistants
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources section */}
          <div className="footer-footer__section">
            <h3 className="footer-footer__title">Resources</h3>
            <ul className="footer-footer__list">
              <li>
                <Link to="/blog" className="footer-footer__link" onClick={scrollToTop}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact section */}
          <div className="footer-footer__section">
            <h3 className="footer-footer__title">Contact</h3>
            <ul className="footer-footer__list">
              <li>
                <button
                  onClick={handleEmailSupport}
                  className="footer-footer__link footer-footer__link--icon"
                >
                  {/* <Mail className="footer-footer__icon" size={26} /> */}
                  support@medschoolcopilot.com
                </button>
              </li>
              <li>
                <Link to="/profile" className="footer-footer__link" onClick={scrollToTop}>
                  Profil
                </Link>
              </li>
              <li>
                <Link to="/admin" className="footer-footer__link" onClick={scrollToTop}>
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="footer-footer__copyright">
          <p>&copy; {currentYear} MedSchool Copilot. All rights reserved.</p>
          <div className="footer-footer__copyright-links">
            <Link 
              to="/terms" 
              className="footer-footer__copyright-link" 
              onClick={scrollToTop}
            >
              Terms of Service
            </Link>
            <Link 
              to="/privacy" 
              className="footer-footer__copyright-link" 
              onClick={scrollToTop}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;