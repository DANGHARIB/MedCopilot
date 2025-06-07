import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import UserLayout from '../../components/user/layout/UserLayout'; // Importer UserLayout si besoin
import agents from '../../data/agentsData';
import AgentCard from '../../components/Agent/AgentCard';
import { Star, Circle, Zap, Crown, Menu, Gift, ChevronRight, Home, User, Filter, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/UI/Breadcrumbs';
import './Agents.css';

const AgentsContent = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [animating, setAnimating] = useState(false);
  const [displayedAgents, setDisplayedAgents] = useState([]);
  const location = useLocation();
  
  // Vérifier la source de navigation pour les breadcrumbs
  const isFromAssistants = location.state?.from === 'assistants';

  // Define subscription tiers for filtering
  const tiers = [
    { id: 'all', label: 'All' },
    { id: 'free', label: 'Free' },
    { id: 'basic', label: 'Basic' },
    { id: 'premium', label: 'Premium' },
    { id: 'ultimate', label: 'Ultimate' }
  ];
  
  // Filter agents based on active tier tab - only show agents of the selected tier
  useEffect(() => {
    const filteredResults = agents.filter(agent => {
      if (activeTab === 'all') return true;
      
      // Show only agents of the exact selected tier
      return agent.pricingTier === activeTab;
    });
    
    // Apply animation and update displayed agents
    setAnimating(true);
    const timer = setTimeout(() => {
      setDisplayedAgents(filteredResults);
      setAnimating(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (tierId) => {
    if (tierId !== activeTab) {
      setActiveTab(tierId);
    }
  };

  // Get icon for tier using Lucide React icons
  const getTierIcon = (tier) => {
    switch(tier) {
      case 'all':
        return <Menu className="tier-icon" size={18} />;
      case 'free':
        return <Gift className="tier-icon" size={18} />;
      case 'basic':
        return <Zap className="tier-icon" size={18} />;
      case 'premium':
        return <Star className="tier-icon" size={18} />;
      case 'ultimate':
        return <Crown className="tier-icon" size={18} />;
      default:
        return <Circle className="tier-icon" size={18} />;
    }
  };

  // Construction dynamique des éléments du breadcrumb selon le contexte
  const breadcrumbItems = isFromAssistants
    ? [
        {
          label: 'Profile', // Texte du lien
          path: '/profile',  // Chemin de redirection
          icon: <User size={14} /> // Icône optionnelle
        },
        {
          label: 'AI Assistants' // Texte final (non cliquable)
        }
      ]
    : [
        {
          label: 'Home',
          path: '/',
          icon: <Home size={14} />
        },
        {
          label: 'AI Assistants'
        }
      ];

  // Enhanced Custom Tabs Component
  const CustomTabs = ({ items, activeItem, onChange }) => {
    return (
      <div className="custom-tabs">
        <div className="tabs-list">
          {items.map(item => (
            <button
              key={item.id}
              className={`tab-item ${activeItem === item.id ? 'active' : ''} ${item.id}`}
              onClick={() => onChange(item.id)}
              aria-selected={activeItem === item.id}
              role="tab"
            >
              <div className="tab-item-icon">
                {getTierIcon(item.id)}
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="tabs-indicator-container">
          <div 
            className="tabs-indicator"
            style={{ 
              width: `${100 / items.length}%`,
              transform: `translateX(${items.findIndex(item => item.id === activeItem) * 100}%)`
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="agents-container">
      {/* Breadcrumb avec le nouveau composant */}
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="agents-header">
        <div className="title-area">
          <h1 className="agents-title">AI Assistants <span className="highlight">for Med School</span></h1>
          <p className="agents-subtitle">
            AI tools to help with every step of your medical school application process.
          </p>
          
          {/* Custom Tabs Component */}
          <div className="filter-tabs">
            <CustomTabs 
              items={tiers}
              activeItem={activeTab}
              onChange={handleTabChange}
            />
          </div>
        </div>
        
        {/* Mobile Tier Badges */}
        <div className="tier-badges">
          {tiers.map(tier => (
            <button 
              key={tier.id} 
              className={`tier-badge ${tier.id} ${activeTab === tier.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tier.id)}
            >
              {getTierIcon(tier.id)}
              <span>{tier.id === 'all' ? 'All' : tier.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Agents grid with animation */}
      <div className={`agents-grid ${animating ? 'fade-out' : 'fade-in'}`}>
        {displayedAgents.length > 0 ? (
          displayedAgents.map(agent => (
            <div className="agent-card-wrapper" key={agent.id}>
              <AgentCard agent={agent} />
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="empty-title">No Assistants Found</h3>
            <p className="empty-text">No AI assistants available in this access tier.</p>
          </div>
        )}
      </div>
      
      <div className="agents-info">
        <div className="info-card">
          <div className="info-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="info-content">
            <h3>About Our AI Assistants</h3>
            <p>Our AI assistants are designed to help you navigate every step of the medical school application process, from school selection to interview preparation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Agents = () => {
  const location = useLocation();
  const isFromAssistants = location.state?.from === 'assistants';

  if (isFromAssistants) {
    // Rendu sans Layout si on vient de /assistants
    return <AgentsContent />;
  } else {
    // Rendu avec Layout (public) si on vient d'ailleurs (ex: footer)
    return (
      <Layout>
        <AgentsContent />
      </Layout>
    );
  }
};

export default Agents;