import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout.jsx';
import Hero from '../components/Accueil/Hero.jsx';
import FeatureShowcase from '../components/Accueil/FeatureShowcase.jsx';
import HowItWorks from '../components/Accueil/HowItWorks.jsx';
import PricingSection from '../components/Accueil/PricingSection.jsx';
// import SchoolMatchForm from '../components/Accueil/SchoolMatchForm.jsx';
import './Accueil.css';

const Accueil = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      const section = document.getElementById(sectionId);
      if (section) {
        // Utiliser un délai pour s'assurer que la page est bien rendue
        const timer = setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);

        return () => clearTimeout(timer);
      }
    }
    
    // Ajouter une classe au body pour les animations globales
    document.body.classList.add('page-loaded');
    
    return () => {
      document.body.classList.remove('page-loaded');
    };
  }, [location.state]);

  return (
    <Layout hideHero={true}>
      <div className="accueil-wrapper">
        <Hero />
        <FeatureShowcase />
        <HowItWorks />
        <PricingSection />
        {/* <SchoolMatchForm /> */}
      </div>
    </Layout>
  );
};

export default Accueil;