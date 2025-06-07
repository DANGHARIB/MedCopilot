import React, { useState, useEffect, useRef } from 'react';
import { Check, Sparkles, Users, ArrowRight } from 'lucide-react';
import plansData from '../../data/plans.json';
import './PricingSection.css';

const PricingSection = () => {
  const [billingInterval, setBillingInterval] = useState('monthly'); // 'monthly' or 'yearly'
  const [plans, setPlans] = useState([]);
  
  // Refs for animations
  const sectionRef = useRef(null);
  const pillBadgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const tabsRef = useRef(null);
  const gridRef = useRef(null);
  const moreOptionsRef = useRef(null);

  useEffect(() => {
    // Process plans data to add JSX elements for icons
    const processedPlans = plansData.map(plan => ({
      ...plan,
      icon: plan.id === 'premium' ? <Sparkles size={18} /> : null
    }));
    setPlans(processedPlans);

    // Ajouter directement les classes d'animation aux éléments
    if (pillBadgeRef.current) pillBadgeRef.current.classList.add('pricing-section__element--animate');
    if (titleRef.current) titleRef.current.classList.add('pricing-section__element--animate');
    if (subtitleRef.current) subtitleRef.current.classList.add('pricing-section__element--animate');
    
    // Animation sequence avec délai pour les autres éléments
    const elements = [
      { ref: tabsRef, delay: 300 },
      { ref: gridRef, delay: 500 },
      { ref: moreOptionsRef, delay: 700 }
    ];

    elements.forEach(({ ref, delay }) => {
      if (ref.current) {
        setTimeout(() => {
          ref.current.classList.add('pricing-section__element--animate');
        }, delay);
      }
    });
  }, []);

  const handlePlanSelect = (planId) => {
    // Handle plan selection (e.g., redirect to checkout page)
    console.log(`Selected plan: ${planId}, billing: ${billingInterval}`);
    // Redirect to signup page, potentially passing plan info later
    window.location.href = '/signUp'; 
  };

  const handleContactUs = () => {
    console.log('Contact Us clicked');
    // Add navigation or modal opening logic here
  };

  return (
    <section id="pricing" ref={sectionRef} className="pricing-section">
      <div className="pricing-section__container">
        {/* Section Header */}
        <div className="pricing-section__header">
          <div ref={pillBadgeRef} className="pricing-section__pill-badge">
            Flexible Plans
          </div>
          <h2 ref={titleRef} className="pricing-section__title">
            Choose the Plan That <span className="pricing-section__title-highlight">Fits Your Needs</span>
          </h2>
          <p ref={subtitleRef} className="pricing-section__subtitle">
            Whether you're just starting your medical school journey or deep in the application process,
            we have the right tools to help you succeed.
          </p>
        </div>

        {/* Billing Interval Toggle */}
        <div ref={tabsRef} className="pricing-section__tabs">
          <div className="pricing-section__tabs-list">
            <button 
              onClick={() => setBillingInterval('monthly')}
              className={`pricing-section__tabs-trigger ${billingInterval === 'monthly' ? 'pricing-section__tabs-trigger--active' : ''}`}
            >
              Monthly Billing
            </button>
            <button 
              onClick={() => setBillingInterval('yearly')}
              className={`pricing-section__tabs-trigger ${billingInterval === 'yearly' ? 'pricing-section__tabs-trigger--active' : ''}`}
            >
              Annual Billing <span className="pricing-section__save-badge">Save 20%</span>
            </button>
          </div>
        </div>
        
        {/* Pricing Grid */}
        <div ref={gridRef} className="pricing-section__grid">
          {plans.map((plan, index) => {
            // Calculate price to display
            const displayPrice = billingInterval === 'monthly' || plan.id === 'free' 
              ? plan.price 
              : plan.yearlyPrice;
            
            const displayInterval = billingInterval === 'monthly' || plan.id === 'free'
              ? plan.interval
              : plan.yearlyInterval;

            return (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.isPopular ? 'pricing-card--popular' : ''}`}
                style={{
                  '--plan-accent-color': plan.accentColor,
                  '--plan-hover-color': `${plan.accentColor}10`,
                  '--card-index': index
                }}
              >
                {plan.isPopular && (
                  <div className="pricing-card__popular-badge">
                    <Sparkles size={14} className="pricing-card__popular-icon" />
                    <span>Most Popular</span>
                  </div>
                )}
                <div className="pricing-card__header">
                  <h3 className="pricing-card__name">
                    {plan.icon && <span className="pricing-card__name-icon">{plan.icon}</span>}
                    {plan.name}
                  </h3>
                  <div className="pricing-card__price-section">
                    <span className="pricing-card__currency">$</span>
                    <span className="pricing-card__price">{displayPrice}</span>
                    <span className="pricing-card__interval">
                      {displayInterval}
                    </span>
                  </div>
                  <p className="pricing-card__description">{plan.description}</p>
                </div>
                <div className="pricing-card__features">
                  <ul className="pricing-card__feature-list">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="pricing-card__feature-item">
                        <Check size={16} className="pricing-card__feature-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pricing-card__cta-section">
                  <button 
                    onClick={() => handlePlanSelect(plan.id)}
                    className="pricing-card__cta-button"
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* More Options Section */}
        <div ref={moreOptionsRef} className="pricing-section__more-options">
          <h3 className="pricing-section__more-options-title">Need Custom Options?</h3>
          <p className="pricing-section__more-options-description">
            We also offer add-on services and custom enterprise solutions for universities and pre-health programs.
          </p>
          <div className="pricing-section__more-options-grid">
            <div className="pricing-section__more-options-card">
              <div className="pricing-section__more-options-card-icon-wrapper">
                <Sparkles className="pricing-section__more-options-card-icon" />
              </div>
              <h4 className="pricing-section__more-options-card-title">Add-On Services</h4>
              <ul className="pricing-section__more-options-list">
                <li><Check size={16} className="pricing-section__more-options-check" /> Expert review of AI-generated content</li>
                <li><Check size={16} className="pricing-section__more-options-check" /> 1-on-1 coaching sessions</li>
                <li><Check size={16} className="pricing-section__more-options-check" /> Specialized workshops</li>
              </ul>
            </div>
            <div className="pricing-section__more-options-card">
              <div className="pricing-section__more-options-card-icon-wrapper">
                <Users className="pricing-section__more-options-card-icon" />
              </div>
              <h4 className="pricing-section__more-options-card-title">Institutional Licenses</h4>
              <ul className="pricing-section__more-options-list">
                <li><Check size={16} className="pricing-section__more-options-check" /> University-wide access</li>
                <li><Check size={16} className="pricing-section__more-options-check" /> Volume-based pricing</li>
                <li><Check size={16} className="pricing-section__more-options-check" /> Custom white-labeled solutions</li>
              </ul>
            </div>
          </div>
          <button 
            className="pricing-section__more-options-cta"
            onClick={handleContactUs}
          >
            <span>Contact Us for Custom Solutions</span>
            <ArrowRight size={16} className="pricing-section__more-options-cta-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;