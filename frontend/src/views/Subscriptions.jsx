import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserLayout from '../components/user/layout/UserLayout';
import { Check, CreditCard, ChevronRight, Sparkles } from 'lucide-react';
import plansData from '../data/plans.json';
import { SubscriptionBreadcrumbs } from '../components/UI/Breadcrumbs';
import './Subscriptions.css';

const Subscription = () => {
  const navigate = useNavigate();
  const [billingInterval, setBillingInterval] = useState('monthly');
  const [subscriptionTier] = useState('free'); // Simulating auth context
  const [plans] = useState(plansData);

  // Refs for animations
  const tabsRef = useRef(null);
  const gridRef = useRef(null);

  // Animation setup
  useEffect(() => {
    const elementsToAnimate = [
      { ref: tabsRef, delay: 0.2 },
      { ref: gridRef, delay: 0.3 },
    ];

    elementsToAnimate.forEach(item => {
      if (item.ref.current) {
        item.ref.current.style.animationDelay = `${item.delay}s`;
        item.ref.current.classList.add('subscription-element--animate');
      }
    });
  }, []);

  // In a real implementation, we would check for user authentication here
  // and redirect to auth if not authenticated

  const handlePlanSelect = (planId) => {
    if (planId === subscriptionTier) {
      // Toast notification would be implemented here
      console.log(`Already subscribed to ${planId} plan`);
      return;
    }
    
    navigate(`/payment?plan=${planId}&billing=${billingInterval}`);
  };

  return (
    <UserLayout>
      <div className="subscription-container">
        {/* Breadcrumb */}
        <SubscriptionBreadcrumbs currentPage="subscriptions" />

        <div className="subscription-header">
          <h1 className="subscription-title">Choose Your <span className="subscription-title-highlight">Plan</span></h1>
        </div>

        {/* Billing Interval Toggle */}
        <div ref={tabsRef} className="subscription-pricing-tabs">
          <div className="subscription-pricing-tabs-list">
            <button 
              onClick={() => setBillingInterval('monthly')}
              className={`subscription-pricing-tabs-trigger ${billingInterval === 'monthly' ? 'subscription-pricing-tabs-trigger--active' : ''}`}
            >
              Monthly Billing
            </button>
            <button 
              onClick={() => setBillingInterval('yearly')}
              className={`subscription-pricing-tabs-trigger ${billingInterval === 'yearly' ? 'subscription-pricing-tabs-trigger--active' : ''}`}
            >
              Annual Billing <span className="subscription-save-badge">Save 20%</span>
            </button>
          </div>
        </div>
        
        {/* Plans Grid */}
        <div ref={gridRef} className="subscription-plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`subscription-plan-card ${
                plan.isPopular ? 'subscription-plan-card--popular' : ''
              }`}
              style={{ 
                '--plan-accent-color': plan.accentColor 
              }}
            >
              {plan.isPopular && (
                <div className="subscription-popular-badge">
                  <Sparkles size={16} className="subscription-popular-icon" />
                  <span>Most Popular</span>
                </div>
              )}
              <div className="subscription-plan-header">
                <h3 className="subscription-plan-title">{plan.name}</h3>
                {billingInterval === 'monthly' || plan.id === 'free' ? (
                  <div className="subscription-plan-price">
                    <span className="subscription-plan-price-amount">${plan.price}</span>
                    <span className="subscription-plan-price-interval">{plan.interval}</span>
                  </div>
                ) : (
                  <>
                    <div className="subscription-plan-price">
                      <span className="subscription-plan-price-amount">${plan.yearlyPrice}</span>
                      <span className="subscription-plan-price-interval">{plan.yearlyInterval}</span>
                    </div>
                    {plan.savings && (
                      <span className="subscription-plan-savings">
                        {plan.savings}
                      </span>
                    )}
                  </>
                )}
                <p className="subscription-plan-description">{plan.description}</p>
              </div>
              <div className="subscription-plan-content">
                <ul className="subscription-feature-list">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="subscription-feature-item">
                      <Check className="subscription-feature-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="subscription-plan-footer">
                <button 
                  className={`subscription-plan-button ${
                    plan.id === subscriptionTier 
                      ? 'subscription-plan-button--current' 
                      : ''
                  }`}
                  disabled={plan.id === subscriptionTier}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.id === subscriptionTier ? plan.ctaCurrent || 'Current Plan' : billingInterval === 'monthly' ? plan.cta : `Get ${plan.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="subscription-cta-section">
          <div className="subscription-cta-content">
            <div className="subscription-cta-icon-container">
              <CreditCard className="subscription-cta-icon" />
            </div>
            <div className="subscription-cta-text">
              <h3 className="subscription-cta-title">Ready to take your application to the next level?</h3>
              <p className="subscription-cta-description">
                Our subscription plans are designed to support you through every stage of your medical school journey. 
                Questions about which plan is right for you? Contact our team for personalized guidance.
              </p>
            </div>
            <div className="subscription-cta-button-container">
              <button className="subscription-cta-button">Contact Us</button>
            </div>
          </div>
        </div> 

        <div className="subscription-faq-section">
          <h3 className="subscription-faq-title">Frequently Asked Questions</h3>
          <div className="subscription-faq-grid">
            <div className="subscription-faq-item">
              <h4 className="subscription-faq-question">Can I change plans later?</h4>
              <p className="subscription-faq-answer">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="subscription-faq-item">
              <h4 className="subscription-faq-question">Is there a refund policy?</h4>
              <p className="subscription-faq-answer">We offer a 14-day money-back guarantee on all new subscriptions if you're not satisfied.</p>
            </div>
            <div className="subscription-faq-item">
              <h4 className="subscription-faq-question">Do you offer student discounts?</h4>
              <p className="subscription-faq-answer">Yes! Contact our support team with your valid student ID to learn about our student discount program.</p>
            </div>
            <div className="subscription-faq-item">
              <h4 className="subscription-faq-question">What payment methods do you accept?</h4>
              <p className="subscription-faq-answer">We accept all major credit cards, PayPal, and Apple Pay.</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Subscription;