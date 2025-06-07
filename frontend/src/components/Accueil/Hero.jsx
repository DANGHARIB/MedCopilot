import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const welcomeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    // Animation séquentielle des éléments
    const elements = [
      { ref: welcomeRef, className: 'hero__welcome--animate', delay: 300 },
      { ref: titleRef, className: 'hero__title--animate', delay: 500 },
      { ref: subtitleRef, className: 'hero__subtitle--animate', delay: 700 },
      { ref: ctaRef, className: 'hero__cta--animate', delay: 900 },
      { ref: scrollIndicatorRef, className: 'hero__scroll-indicator--animate', delay: 1200 }
    ];

    elements.forEach(({ ref, className, delay }) => {
      if (ref.current) {
        setTimeout(() => {
          ref.current.classList.add(className);
        }, delay);
      }
    });
  }, []);

  return (
    <div ref={heroRef} className="hero">
      {/* Background Gradient Elements */}
      <div className="hero__background-gradient hero__background-gradient--blue"></div>
      <div className="hero__background-gradient hero__background-gradient--teal"></div>

      {/* Content Container */}
      <div className="hero__container">
        {/* Text Content */}
        <div className="hero__content">
          <div className="hero__welcome" ref={welcomeRef}>
            Welcome to MedSchool Copilot
          </div>
          <h1 className="hero__title" ref={titleRef}>
            Write exceptional 
            <span className="hero__title--highlight"> secondary essays</span>
            <br />in minutes, not hours
          </h1>
          <p className="hero__subtitle" ref={subtitleRef}>
            AI-powered assistance tailored to your experiences, optimized for each medical school's unique prompts. Submit more applications faster without sacrificing quality.
          </p>
          <div className="hero__cta" ref={ctaRef}>
            <button 
              className="hero__button hero__button--primary"
            >
              Start for free
              <ArrowRight className="hero__button-icon" />
            </button>
            <button className="hero__button hero__button--secondary">
              Watch demo
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero__scroll-indicator" ref={scrollIndicatorRef}>
        <p className="hero__scroll-text">Scroll to explore</p>
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;