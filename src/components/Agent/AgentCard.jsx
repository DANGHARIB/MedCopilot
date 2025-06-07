import React from 'react';
import { CheckCircle, Star, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
// Importer directement l'image pour school-selection
import schoolSelectionImage from '../../assets/images/agents/school-selection.jpeg';
import readinessImage from '../../assets/images/agents/readiness.png';
import essayImage from '../../assets/images/agents/essay.png';
import interviewImage from '../../assets/images/agents/interview.png';
import financialAidImage from '../../assets/images/agents/financial-aid.png';
import researchImage from '../../assets/images/agents/research.png';
import careerPlanningImage from '../../assets/images/agents/career-planning.png';
import './AgentCard.css';

const AgentCard = ({ agent }) => {
  // Fonction pour déterminer l'image selon la catégorie de l'agent
  const getAgentImage = (category) => {
    const categoryMap = {
      'School Selection': schoolSelectionImage,
      'Readiness': readinessImage,
      'Essays': essayImage,
      'Interviews': interviewImage,
      'Application Strategy': interviewImage,
      'Post-Interview': financialAidImage,
      'Decision Support': researchImage,
      'Reapplication Planning': careerPlanningImage
    };
    
    // Utiliser une image par défaut
    return categoryMap[category] || '/src/assets/images/agents/default-agent.jpg';
  };
  
  const getTierLabel = (tier) => {
    switch (tier) {
      case 'basic':
        return 'Basic';
      case 'premium':
        return 'Premium';
      case 'ultimate':
        return 'Ultimate';
      case 'free':
        return 'Free';
      default:
        return '';
    }
  };
  
  const getTierIcon = (tier) => {
    switch (tier) {
      case 'basic':
      case 'free':
        return <CheckCircle className={`tier-icon ${tier}`} />;
      case 'premium':
      case 'ultimate':
        return <Star className={`tier-icon ${tier}`} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="agent-card-container">
      <div className={`agent-card ${agent.pricingTier || ''}`}>
        <div className="agent-image-container">
          <div className="agent-image-wrapper">
            <img 
              src={getAgentImage(agent.category)} 
              alt={agent.name} 
              className="agent-image"
            />
          </div>
          
          {agent.coming_soon && (
            <div className="coming-soon-overlay">
              <div className="coming-soon-badge">
                <Clock className="coming-soon-icon" />
                <span>Coming Soon</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="agent-content">
          <div className="agent-meta">
            <span className="agent-category">
              {agent.category}
            </span>
            
            {agent.pricingTier && (
              <div className={`tier-badge-inline ${agent.pricingTier}`}>
                {getTierIcon(agent.pricingTier)}
                <span>{getTierLabel(agent.pricingTier)}</span>
              </div>
            )}
            
            {agent.isNew && (
              <span className="agent-tag new-tag">New</span>
            )}
          </div>
          
          <h3 className="agent-title">{agent.name}</h3>
          <p className="agent-description">{agent.description}</p>
          
          <div className="agent-features">
            <h4 className="features-title">Features</h4>
            <ul className="features-list">
              {agent.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="feature-item">
                  <CheckCircle className="feature-icon" />
                  <span className="feature-text">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {!agent.coming_soon && (
            <div className="agent-button-container">
              {agent.pricingTier && agent.pricingTier !== 'free' ? (
                <Link
                  to="/subscription"
                  className="agent-button upgrade-button"
                >
                  <span>Upgrade to Access</span>
                  <ArrowRight size={16} className="button-icon" />
                </Link>
              ) : (
                <Link
                  to={`/agents/${agent.id}`}
                  className="agent-button details-button"
                >
                  <span>View Details</span>
                  <ExternalLink size={16} className="button-icon" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;