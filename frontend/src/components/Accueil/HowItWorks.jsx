import React, { useEffect, useRef } from 'react';
import { 
  UserCheck, 
  FileText, 
  MessageSquare, 
  Zap
} from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
  // Refs pour les éléments animés
  const sectionRef = useRef(null);
  const pillBadgeRef = useRef(null);
  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const stepsContainerRef = useRef(null);

  // Animation setup
  useEffect(() => {
    const elements = [
      { ref: pillBadgeRef, className: 'how-it-works__header-element--animate', delay: 300 },
      { ref: headingRef, className: 'how-it-works__header-element--animate', delay: 500 },
      { ref: subHeadingRef, className: 'how-it-works__header-element--animate', delay: 700 },
      { ref: stepsContainerRef, className: 'how-it-works__journey--animate', delay: 900 }
    ];

    elements.forEach(({ ref, className, delay }) => {
      if (ref.current) {
        setTimeout(() => {
          ref.current.classList.add(className);
        }, delay);
      }
    });
  }, []);

  // Données des étapes
  const steps = [
    {
      icon: <UserCheck size={20} />, 
      title: 'Create Your Profile',
      description: 'Start by creating your personal profile with your academic history, test scores, and extracurricular activities.',
    },
    {
      icon: <FileText size={20} />, 
      title: 'Connect your primary app',
      description: 'Upload your AMCAS application or enter your experiences manually to personalize your essays.',
    },
    {
      icon: <MessageSquare size={20} />, 
      title: 'Select school & prompt',
      description: 'Choose your target school and paste the essay prompt from your secondary application.',
    },
    {
      icon: <Zap size={20} />, 
      title: 'Generate & customize',
      description: 'Get your personalized essay in seconds, then refine and export it for submission.',
    }
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="how-it-works">
      <div className="how-it-works__container">
        {/* Section Header */}
        <div className="how-it-works__header">
          <div 
            ref={pillBadgeRef} 
            className="how-it-works__pill-badge"
          >
            HOW IT WORKS
          </div>
          <h2 
            ref={headingRef} 
            className="how-it-works__title"
          >
            From signup to finished essays in <span className="how-it-works__title-highlight">minutes</span>
          </h2>
          <p 
            ref={subHeadingRef} 
            className="how-it-works__subtitle"
          >
            A simple four-step process that transforms your application experience
          </p>
        </div>

        {/* Process Journey */}
        <div 
          ref={stepsContainerRef} 
          className="how-it-works__journey"
        >
          {/* Path and Steps */}
          <div className="how-it-works__path-container">
            <div className="how-it-works__path">
              {steps.map((step, index) => {
                // Calculate position based on index
                const positionClass = (index) % 2 !== 0 
                  ? 'how-it-works__step-position--top' 
                  : 'how-it-works__step-position--bottom';
                
                return (
                  <div 
                    key={index}
                    className={`how-it-works__step-position ${positionClass}`}
                    style={{ '--step-index': index }}
                  >
                    <div className="how-it-works__step-card">
                      <div className="how-it-works__step-icon-wrapper">
                        {React.cloneElement(step.icon, { className: 'how-it-works__step-icon' })}
                      </div>
                      <h3 className="how-it-works__step-title">{step.title}</h3>
                      <p className="how-it-works__step-description">{step.description}</p>
                    </div>
                    <div className="how-it-works__connector">
                      <div className="how-it-works__step-number">{index + 1}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;