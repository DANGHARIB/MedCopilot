import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Award, ChevronRight, ArrowRight } from 'lucide-react';
import PersonalStatementSection from './PersonalStatementSection';
import MeaningfulExperiencesSection from './MeaningfulExperiencesSection';
import AdditionalActivitiesSection from './AdditionalActivitiesSection';
import './ProfileSections.css';

const ProfileInformation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // Définir les sections disponibles
  const sections = [
    {
      id: 'personal-statement',
      title: 'Personal Statement',
      description: 'Write and edit your personal motivation letter for medical schools.',
      icon: <FileText size={24} />,
      path: '/profile/personal-statement',
      color: '#3b82f6'
    },
    {
      id: 'experiences',
      title: 'Experiences',
      description: 'Document your most important experiences that have influenced your medical journey.',
      icon: <Award size={24} />,
      path: '/profile/experiences',
      color: '#10b981'
    },
    {
      id: 'impactful-experiences',
      title: 'Impactful Experiences',
      description: "Share other meaningful moments that shaped your path to medicine.",
      icon: <Award size={24} />,
      path: '/profile/impactful-experiences',
      color: '#f59e0b'
    }
  ];
  
  // Fonction pour déterminer quelle section afficher en fonction du chemin
  const renderSection = () => {
    // Extraire le dernier segment du chemin pour identifier la section
    const pathSegments = currentPath.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Si on est sur la page d'information de base, afficher le dashboard
    if (lastSegment === 'information' || pathSegments.length < 3) {
            return (
        <div className="profile-section-wrapper profile-dashboard-wrapper">
          {/* Header moderne */}
          <div className="profile-section-header-modern">
            <div className="header-main-row">
              <div className="header-text-group">
                <div className="header-title">
                  My{" "}
                  <span className="header-title-highlight">Profile</span>
                </div>
             
              </div>
            </div>
          </div>

          {/* Corps principal avec espacement amélioré */}
          <div className="profile-statement-body profile-dashboard-body">
            <div className="profile-info-cards">
              {sections.map((section) => (
                <div 
                  key={section.id} 
                  className="profile-info-card"
                  onClick={() => navigate(section.path)}
                  style={{ borderTopColor: section.color }}
                >
                  <div className="profile-info-card-icon" style={{ backgroundColor: section.color }}>
                    {section.icon}
                  </div>
                  <div className="profile-info-card-content">
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                  <div className="profile-info-card-arrow">
                    <ArrowRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Sinon, afficher la section spécifique directement
    switch (lastSegment) {
      case 'personal-statement':
        return <PersonalStatementSection />;
      case 'experiences':
        return <MeaningfulExperiencesSection />;
      case 'impactful-experiences':
        return <AdditionalActivitiesSection />;
      default:
        // Afficher la vue des cartes par défaut
        return (
          <div className="profile-section-wrapper profile-dashboard-wrapper">
            {/* Header moderne */}
            <div className="profile-section-header-modern">
              <div className="header-main-row">
                <div className="header-text-group">
                  <div className="header-title">
                    My{" "}
                    <span className="header-title-highlight">Profile</span>
                  </div>
                  <p className="header-subtitle">
                    Complete and manage all important information for your medical school application.
                  </p>
                </div>
              </div>
            </div>

            {/* Corps principal avec espacement amélioré */}
            <div className="profile-statement-body profile-dashboard-body">
              <div className="profile-info-cards">
                {sections.map((section) => (
                  <div 
                    key={section.id} 
                    className="profile-info-card"
                    onClick={() => navigate(section.path)}
                    style={{ borderTopColor: section.color }}
                  >
                    <div className="profile-info-card-icon" style={{ backgroundColor: section.color }}>
                      {section.icon}
                    </div>
                    <div className="profile-info-card-content">
                      <h3>{section.title}</h3>
                      <p>{section.description}</p>
                    </div>
                    <div className="profile-info-card-arrow">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  // Retourner directement le contenu sans conteneur supplémentaire
  return renderSection();
};

export default ProfileInformation;