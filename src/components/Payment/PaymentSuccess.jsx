import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, User, ArrowRight } from 'lucide-react';
import './payment-success.css';

const PaymentSuccess = ({ selectedPlan }) => {
  const navigate = useNavigate();
  // You could use a context or hook to get user info
  const user = null; // This would come from your auth context
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="pay-success-container">
      <div className="pay-success-content">
        <div className="pay-success-icon">
          <CheckCircle size={48} />
        </div>
        
        <h1 className="pay-success-title">Payment Successful!</h1>
        
        <p className="pay-success-message">
          Thank you for subscribing to the <strong>{selectedPlan?.name}</strong> plan.
        </p>
        
        <div className="pay-success-details">
          {user ? (
            <p>
              Your account has been updated with your new subscription.
              You now have access to all features included in your plan.
            </p>
          ) : (
            <div className="pay-account-creation">
              <h3 className="pay-account-title">One Last Step!</h3>
              <p className="pay-account-text">
                Your payment has been successfully processed. To finalize your subscription setup,
                please create an account or log in now.
              </p>
              <button 
                className="pay-btn-create-account"
                onClick={() => navigate('/auth', { 
                  state: { 
                    returnPath: '/profile',
                    fromPayment: true
                  } 
                })}
              >
                <span>Create Account</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
        
        <div className="pay-success-actions">
          {user && (
            <button 
              className="pay-btn-primary"
              onClick={() => navigate('/profile')}
            >
              <User size={18} />
              <span>Access My Account</span>
            </button>
          )}
          
          <button 
            className="pay-btn-outline"
            onClick={() => navigate('/')}
          >
            <Home size={18} />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;