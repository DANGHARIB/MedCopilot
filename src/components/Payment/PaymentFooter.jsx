import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './payment-footer.css';

const PaymentFooter = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="pay-footer">
      <div className="pay-footer-container">
        <p className="pay-terms-text">
          By proceeding with payment, you accept our{' '}
          <button 
            className="pay-link-button" 
            onClick={() => navigate('/terms')}
            aria-label="View Terms of Service"
          >
            Terms of Service
          </button>{' '}
          and our{' '}
          <button 
            className="pay-link-button" 
            onClick={() => navigate('/privacy')}
            aria-label="View Privacy Policy"
          >
            Privacy Policy
          </button>
        </p>
        
        <div className="pay-security-badge">
          <ShieldCheck className="pay-security-icon" />
          <span>Secure payment by Stripe with 256-bit encryption</span>
        </div>
      </div>
    </footer>
  );
};

export default PaymentFooter;