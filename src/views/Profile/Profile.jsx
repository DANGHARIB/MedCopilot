import React from 'react';
import { useLocation } from 'react-router-dom';
import UserLayout from '../../components/user/layout/UserLayout';
import AvailableAgents from './AvailableAgents';
import './Profile.css';
import MySchoolTab from './MySchoolTab';
import MySubscription from './MySubscription';
import Timeline from './Timeline';
import ProfileInformation from './ProfileSections/ProfileInformation';

const Profile = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Simuler des données pour MySubscription pour l'instant
  const userSubscriptionTier = 'free'; 
  const isLoadingSubscription = false;
  
  // Fonction pour rendre le contenu spécifique de la section
  const renderSectionContent = () => {
    // Les listes d'essais et détails d'essais sont maintenant gérés directement par leurs propres composants avec UserLayout
    
    // Vérifier si le chemin correspond à une section de profil
    const profileInfoPaths = [
      '/profile/information',
      '/profile/personal-statement',
      '/profile/experiences',
      '/profile/impactful-experiences'
    ];
    
    // Vérifier si le chemin actuel commence par l'un des chemins de ProfileInformation
    if (profileInfoPaths.some(path => currentPath === path || currentPath.startsWith(`${path}/`))) {
      return (
          <ProfileInformation />
      );
    }
    
    switch (currentPath) {
      case '/profile':
        return (
          <div className="profile-section-container">
            <h2>Profil</h2>
            <p>Section du profil utilisateur - contenu à venir</p>
          </div>
        );
      
      case '/assistants':
        return <AvailableAgents />;
      
      case '/schools':
        return <MySchoolTab />;
          
      case '/timeline':
        return <Timeline />;
   
      case '/subscription':
        return <MySubscription 
                 subscriptionTier={userSubscriptionTier} 
                 shouldShowContent={!isLoadingSubscription} 
               />;
        
     
        
      default:
        return (
          <div className="profile-section-container">
            <h2>Welcome to your personal space</h2>
            <p>Use the navigation on the left to access the different sections.</p>
          </div>
        );
    }
  };

  return (
    <UserLayout>
      <div className="profile-content-container">
        {renderSectionContent()}
      </div>
    </UserLayout>
  );
};

export default Profile;