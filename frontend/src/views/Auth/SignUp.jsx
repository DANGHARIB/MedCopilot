import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import EmailVerificationModal from './EmailVerificationModal';
import signUpImage from '../../assets/images/signUp.jpeg';
import authService from '../../services/auth.service';
import './SignUp.css';
// Import des icônes
import { FiEye, FiEyeOff, FiXCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des données du formulaire
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Enregistrement de l'utilisateur avec le nom complet
      const userData = {
        fullName,
        email,
        password,
        phoneNumber
      };
      
      // Appel au service d'inscription
      const response = await authService.signup(userData);
      
      console.log('Inscription réussie:', response);
      
      // Sauvegarder le nom dans le localStorage pour l'affichage
      localStorage.setItem('userFullName', fullName);
      
      // Afficher le modal de vérification d'email
      setIsEmailModalOpen(true);
      
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred during registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout hideHero={true}>
      <div className="signup-container">
        <div className="signup-wrapper">
          {/* Section Image - Pleine hauteur sans container */}
          <div className="image-section">
            <img src={signUpImage} alt="Sign up illustration" className="fullscreen-image" />
          </div>

          {/* Section Formulaire - Design unifié */}
          <div className="form-section">
            <div className="signup-header">
              <h2 className="animated-title">
                <span className="title-word">Create</span>
                <span className="title-word">an</span>
                <span className="title-word highlight">account</span>
              </h2>
              <p className="animated-subtitle">Fill in your details to get started</p>
            </div>

            {error && (
              <div className="error-message">
                <FiXCircle size={20} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Ligne 1: Full Name et Phone Number */}
              <div className="fields-row">
                <div className="input-group">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="fullName"
                      className="input-field no-icon"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      id="phoneNumber"
                      className="input-field no-icon"
                      placeholder="(123) 456-7890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Ligne 2: Email (pleine largeur) */}
              <div className="input-group">
                <label htmlFor="email">Email address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    className="input-field no-icon"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Ligne 3: Password et Confirm Password */}
              <div className="fields-row">
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="input-field no-icon"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="input-field no-icon"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bouton Submit */}
              <button 
                type="submit" 
                className="signup-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="spinner" size={20} />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Verify your account</span>
                )}
              </button>
            </form>

            {/* Terms agreement avec style moderne */}
            <div className="terms-agreement">
              <p>
                By creating an account, you agree to our{' '}
                <Link to="/terms">Terms of Service</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </div>

            {/* Sign in link avec style harmonisé */}
            <div className="signin-link">
              <p>
                Already have an account?{' '}
                <Link to="/signin">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Email Verification Modal */}
      <EmailVerificationModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        email={email}
        onLogin={() => navigate('/signin')}
      />
    </Layout>
  );
};

export default SignUp;