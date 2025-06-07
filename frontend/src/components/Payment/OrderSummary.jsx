import React, { useState, useEffect } from 'react';
import { 
  Check, 
  CreditCard, 
  Percent, 
  Shield, 
  Tag, 
  Calendar, 
  Package
} from 'lucide-react';
import './order-summary.css';

const OrderSummary = ({ selectedPlan, billingInterval }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Entry animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!selectedPlan) return null;

  const getPlanPrice = () => {
    return billingInterval === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.price;
  };

  const getPlanInterval = () => {
    return billingInterval === 'yearly' ? 'per year' : 'per month';
  };
  
  const formatPrice = (price) => {
    // If the price already contains a currency symbol, return it as is
    if (typeof price === 'string' && (price.includes('$') || price.includes('€'))) {
      return price;
    }
    // Otherwise format with $
    return `$${price}`;
  };

  return (
    <div className="pay-order-summary" style={{ 
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease'
    }}>
      <div className="pay-order-card">
        <div className="pay-order-header">
          <h2 className="pay-order-title">
            <Package size={20} className="pay-order-icon" />
            Order Summary
          </h2>
        </div>
        
        <div className="pay-order-content">
          <div className="pay-order-line">
            <span className="pay-order-label">
              <Tag size={18} className="pay-order-line-icon" />
              {selectedPlan.name} Plan
              {selectedPlan.id === 'pro' && (
                <span className="pay-order-tag">Recommended</span>
              )}
            </span>
            <span className="pay-order-value">{formatPrice(getPlanPrice())}</span>
          </div>
          
          <div className="pay-order-line pay-order-secondary">
            <span className="pay-order-label">
              <Calendar size={16} className="pay-order-line-icon" />
              Billing
            </span>
            <span>{selectedPlan.id === 'free' ? 'N/A' : getPlanInterval()}</span>
          </div>
          
          {billingInterval === 'yearly' && selectedPlan.savings && (
            <div className="pay-order-line pay-order-savings">
              <span className="pay-order-with-icon">
                <Percent size={16} />
                Annual Savings
              </span>
              <span>{selectedPlan.savings}</span>
            </div>
          )}
          
          <div className="pay-order-total">
            <div className="pay-order-line">
              <span className="pay-order-total-label">Total</span>
              <span className="pay-order-total-price">{formatPrice(getPlanPrice())}</span>
            </div>
            {billingInterval === 'yearly' && selectedPlan.id !== 'free' && (
              <div className="pay-order-line pay-order-secondary" style={{ marginTop: '0.5rem' }}>
                <span>Billed annually</span>
                <span></span>
              </div>
            )}
          </div>
        </div>
        
        <div className="pay-order-footer">
          <div className="pay-secured-by-stripe">
            <Shield size={18} className="pay-security-icon" />
            <p className="pay-security-text">Secure payment processed by Stripe.<br />
              Your information is protected.</p>
          </div>
        </div>
      </div>
      
      <div className="pay-plan-features">
        <h3 className="pay-features-title">
          {selectedPlan.name} Plan Features
        </h3>
        <ul className="pay-features-list">
          {selectedPlan?.features?.map((feature, index) => (
            <li key={index} className="pay-feature-item">
              <Check className="pay-feature-icon" size={18} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderSummary;