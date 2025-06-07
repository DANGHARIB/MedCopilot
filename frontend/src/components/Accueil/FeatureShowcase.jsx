import React, { useEffect, useRef } from 'react';
import { FileText, Zap, Clock, PenTool, Target, Medal } from 'lucide-react';
import './FeatureShowcase.css';

// Sub-component for individual feature cards with enhanced design
const FeatureCard = ({ icon, title, description, index }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (cardRef.current) {
      setTimeout(() => {
        cardRef.current.classList.add('feature-card--visible');
      }, 100 + index * 100);
    }
  }, [index]);
  
  return (
    <div 
      ref={cardRef}
      className="feature-card"
      style={{
        '--item-index': index,
      }}
    >
      <div className="feature-card__content">
        <div className="feature-card__icon-wrapper">
          {icon}
          <div className="feature-card__icon-bg"></div>
        </div>
        <h3 className="feature-card__title">{title}</h3>
        <p className="feature-card__description">{description}</p>
      </div>
      <div className="feature-card__decoration"></div>
    </div>
  );
};

// Main FeatureShowcase component with modern UI enhancements
const FeatureShowcase = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  
  useEffect(() => {
    const elements = [
      { ref: headingRef, className: 'feature-visible', delay: 300 },
      { ref: subtitleRef, className: 'feature-visible', delay: 500 }
    ];

    elements.forEach(({ ref, className, delay }) => {
      if (ref.current) {
        setTimeout(() => {
          ref.current.classList.add(className);
        }, delay);
      }
    });
  }, []);

  const features = [
    {
      icon: <FileText size={18} strokeWidth={1.5} className="feature-card__icon" />,
      title: "Personalized Essays",
      description: "AI-generated essays based on your primary application data, tailored to each school's mission."
    },
    {
      icon: <Zap size={18} strokeWidth={1.5} className="feature-card__icon" />,
      title: "Fast Generation",
      description: "Generate essays in minutes, saving hours of writing time for each school application."
    },
    {
      icon: <PenTool size={18} strokeWidth={1.5} className="feature-card__icon" />,
      title: "Custom Editing",
      description: "Fine-tune AI-generated content with our intuitive editing tools to match your voice and style."
    },
    {
      icon: <Clock size={18} strokeWidth={1.5} className="feature-card__icon" />,
      title: "Meet Deadlines",
      description: "Track and manage all your secondary deadlines in one place to stay organized."
    },
    {
      icon: <Target size={18} strokeWidth={1.5} className="feature-card__icon" />,
      title: "School-Specific Insights",
      description: "Access data-driven insights about what each school values in secondary essays."
    },
    {
      icon: <Medal size={18} strokeWidth={1.5} className="feature-card__icon" />,
      title: "Quality Assurance",
      description: "Our system ensures essays showcase your unique qualities while meeting admissions criteria."
    }
  ];

  return (
    <section id="features" ref={sectionRef} className="feature-showcase">
      <div className="feature-backdrop"></div>
      <div className="feature-showcase__container">
        <div className="feature-showcase__header">
          <div className="badge-container">
            <div className="feature-showcase__pill-badge">
              FEATURES
            </div>
          </div>
          <h2 ref={headingRef} className="feature-showcase__title">
            Everything you need for <span className="feature-showcase__title-highlight">perfecting</span> your secondaries
          </h2>
          <p ref={subtitleRef} className="feature-showcase__subtitle">
            Our AI understands what admissions committees look for across 200+ medical schools
          </p>
        </div>
        
        <div className="feature-showcase__grid">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;