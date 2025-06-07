import React from 'react';
// import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, AlertCircle } from 'lucide-react';
import agents from '../../data/agentsData.json';
import AgentCard from '../../components/Agent/AgentCard';
import './AvailableAgents.css';

const AvailableAgents = () => {
  // const { subscriptionTier } = useAuth();
  const navigate = useNavigate();
  
  // Set tier statically as 'free' for now
  const tier = 'free';
  
  // Filter agents based on subscription tier, including all lower tier agents
  const availableAgents = agents.filter(agent => {
    switch(tier) {
      case 'ultimate':
        return true; // Show all agents
      case 'premium':
        return agent.pricingTier !== 'ultimate'; // Show free, basic, premium
      case 'basic':
        return ['free', 'basic'].includes(agent.pricingTier); // Show free and basic
      case 'free':
      default:
        return agent.pricingTier === 'free'; // Show only free
    }
  });

  return (
    <div className="profile-agents__available-agents-container">
      {/* Header */}
      <div className="profile-agents__agents-header">
        <h2 className="profile-agents__agents-title">
          My <span className="profile-agents__highlight">AI Assistants</span>
        </h2>
        <button 
          className="profile-agents__view-all-button"
          onClick={() => navigate('/agents', { state: { from: 'assistants' } })}
          aria-label="View all assistants"
        >
           <Eye size={18} className="profile-agents__arrow-icon" />
          <span>View All</span>
         
        </button>
      </div>
      
      {/* Display agents or empty state */}
      <div className="profile-agents__card">
        {availableAgents.length === 0 ? (
          <div className="profile-agents__empty-agents-state">
            <div className="profile-agents__empty-icon">
              <AlertCircle size={48} />
            </div>
            <h3 className="profile-agents__empty-title">No Assistants Available</h3>
            <p className="profile-agents__empty-description">No AI assistants are available for your current subscription level.</p>
            <button 
              className="profile-agents__upgrade-button"
              onClick={() => navigate('/pricing')}
            >
              Upgrade Now
            </button>
          </div>
        ) : (
          <div className="profile-agents__agents-grid">
            {availableAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableAgents;