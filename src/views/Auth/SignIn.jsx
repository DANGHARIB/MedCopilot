import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import signInImage from '../../assets/images/signIn.jpeg';
import authService from '../../services/auth.service';
import ProfileOnboard from '../../components/user/profile/ProfileOnboard';
import './SignIn.css';
// Import des icônes
import { FiEye, FiEyeOff, FiXCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userIp, setUserIp] = useState(null);
  const navigate = useNavigate();

  // Fetch user IP on component mount
  useEffect(() => {
    const getIp = async () => {
      try {
        const ip = await authService.fetchUserIp();
        if (ip) {
          setUserIp(ip);
          console.log('User IP detected:', ip);
        }
      } catch (error) {
        console.warn('Failed to retrieve IP address:', error);
      }
    };
    
    getIp();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.signin(email, password, userIp);
      console.log('Login successful:', response);
      
      // If rememberMe is enabled, we can store additional information
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('email', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('email');
      }
      
      // Check if the user has already set up their profile
      const hasProfile = authService.hasConfiguredProfile();
      
      // Get the username for display
      const userName = response.data?.user?.firstName || email.split('@')[0] || '';
      
      if (!hasProfile) {
        // If it's the first login or the profile is not configured, show onboarding
        setUserData({ name: userName });
        setShowOnboarding(true);
      } else {
        // Otherwise, redirect to the dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred during login. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSetupProfile = () => {
    // Redirect to the ProfileWizard component for complete onboarding
    navigate('/profile/setup');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authService.forgotPassword(email);
      alert('A password reset email has been sent to your email address.');
    } catch (err) {
      console.error('Error during password reset request:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred while sending the password reset email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showOnboarding && (
        <ProfileOnboard 
          userName={userData?.name} 
          onSetupProfile={handleSetupProfile} 
        />
      )}
      
      <Layout hideHero={true}>
        <div className="signin-container">
          <div className="signin-wrapper">
            {/* Section Image - Pleine hauteur sans container */}
            <div className="image-section">
              <img src={signInImage} alt="Sign in illustration" className="fullscreen-image" />
            </div>

            {/* Section Formulaire - Design unifié */}
            <div className="form-section">
              <div className="signin-header">
                <h2 className="animated-title">
                  <span className="title-word">Welcome</span>
                  <span className="title-word highlight">back</span>
                </h2>
                <p className="animated-subtitle">Please sign in to your account</p>
              </div>

              {error && (
                <div className="error-message">
                  <FiXCircle size={20} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email field */}
                <div className="input-group">
                  <label htmlFor="email">Email address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      className="input-field no-icon"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
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

                {/* Remember me & Forgot password */}
                <div className="helper-row">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <button 
                    type="button" 
                    className="forgot-password"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign in button */}
                <button 
                  type="submit" 
                  className="signin-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <AiOutlineLoading3Quarters className="spinner" size={20} />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </form>

              {/* Terms agreement avec style moderne */}
              <div className="terms-agreement">
                <p>
                  By signing in, you agree to our{' '}
                  <Link to="/terms">Terms of Service</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>.
                </p>
              </div>

              {/* Sign up link avec style harmonisé */}
              <div className="signup-link">
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup">Create an account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SignIn;