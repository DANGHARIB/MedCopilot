import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, User, Calendar, CreditCard } from 'lucide-react';
import './Breadcrumbs.css';

/**
 * Composant Breadcrumbs réutilisable
 * 
 * @param {Object} props
 * @param {Array} props.items - Tableau des éléments du breadcrumb
 * @param {React.ReactNode} [props.separator] - Séparateur personnalisé (par défaut: ChevronRight)
 * @param {string} [props.className] - Classes CSS supplémentaires
 * 
 * Chaque élément du tableau doit avoir cette structure:
 * {
 *   label: 'Label à afficher',
 *   path: '/chemin/optionnel', // optionnel, si absent, l'élément sera affiché comme texte
 *   icon: <IconComponent />, // optionnel, composant d'icône à afficher
 *   active: true/false, // optionnel, si true, l'élément sera affiché comme actif
 * }
 */
const Breadcrumbs = ({ items, separator, className = '' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Séparateur par défaut
  const defaultSeparator = <ChevronRight size={14} className="breadcrumb-separator-icon" />;

  return (
    <nav className={`breadcrumb ${className}`} aria-label="breadcrumb">
      <div className="breadcrumb-container">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          // Élément du breadcrumb
          const breadcrumbItem = (
            <React.Fragment key={`${item.label}-${index}`}>
              <div className="breadcrumb-item">
                {item.path && !isLast ? (
                  <Link to={item.path} className="breadcrumb-link">
                    {item.icon && (
                      <span className="breadcrumb-icon">{item.icon}</span>
                    )}
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "breadcrumb-active" : "breadcrumb-text"}>
                    {item.icon && (
                      <span className="breadcrumb-icon">{item.icon}</span>
                    )}
                    {item.label}
                  </span>
                )}
              </div>
              
              {/* Séparateur entre éléments */}
              {!isLast && (
                <span className="breadcrumb-separator">
                  {separator || defaultSeparator}
                </span>
              )}
            </React.Fragment>
          );
          
          return breadcrumbItem;
        })}
      </div>
    </nav>
  );
};

// Configurations prédéfinies pour différents contextes

/**
 * Breadcrumbs pour les pages liées au profil
 */
export const ProfileBreadcrumbs = ({ activePath, activeLabel, showHome = false }) => {
  const items = [];
  
  // Ajouter Home si demandé
  if (showHome) {
    items.push({
      label: 'Home',
      path: '/',
      icon: <Home size={14} />
    });
  }
  
  // Ajouter le lien Profil
  items.push({
    label: 'Profile',
    path: '/profile',
    icon: <User size={14} />
  });
  
  // Ajouter le chemin actif
  if (activePath && activeLabel) {
    items.push({
      label: activeLabel,
      path: activePath,
    });
  }
  
  return <Breadcrumbs items={items} />;
};

/**
 * Breadcrumbs pour les pages de Timeline/Calendrier
 */
export const TimelineBreadcrumbs = ({ isCalendarPage = false }) => {
  const items = [
    {
      label: 'Profile',
      path: '/timeline',
      icon: <User size={14} />
    },
    {
      label: 'Application Timeline',
      path: '/application-timeline',
    }
  ];
  
  // Ajouter la page de calendrier si nécessaire
  if (isCalendarPage) {
    items.push({
      label: 'Calendar',
      icon: <Calendar size={14} />
    });
  }
  
  return <Breadcrumbs items={items} />;
};

/**
 * Breadcrumbs pour les pages de blog
 */
export const BlogBreadcrumbs = ({ postTitle = null }) => {
  const items = [
    {
      label: 'Home',
      path: '/',
      icon: <Home size={14} />
    },
    {
      label: 'Blog',
      path: '/blog',
    }
  ];
  
  // Ajouter le titre du post si fourni
  if (postTitle) {
    items.push({
      label: postTitle
    });
  }
  
  return <Breadcrumbs items={items} />;
};

/**
 * Breadcrumbs for subscription and payment pages
 */
export const SubscriptionBreadcrumbs = ({ 
  currentPage = 'subscriptions', // 'my-subscription', 'subscriptions', 'payment', 'payment-methods'
  planName = null,
  showHome = false 
}) => {
  const items = [];
  
  // Add Home if requested
  if (showHome) {
    items.push({
      label: 'Home',
      path: '/',
      icon: <Home size={14} />
    });
  }
  
  // Add Profile link
  items.push({
    label: 'Profile',
    path: '/subscription',
    icon: <User size={14} />
  });
  
  // Add appropriate path based on current page
  switch (currentPage) {
    case 'my-subscription':
      items.push({
        label: 'My Subscription',
        path: '/subscription'
      });
      break;
      
    case 'subscriptions':
      items.push({
        label: 'Subscription Plans'
      });
      break;
      
    case 'payment':
      items.push({
        label: 'Subscription Plans',
        path: '/subscriptions'
      });
      items.push({
        label: planName ? `Payment - ${planName}` : 'Payment',
        icon: <CreditCard size={14} />
      });
      break;
      
    case 'payment-methods':
      items.push({
        label: 'Payment Methods',
        icon: <CreditCard size={14} />
      });
      break;
      
    default:
      items.push({
        label: 'Subscription',
        path: '/subscriptions'
      });
      break;
  }
  
  return <Breadcrumbs items={items} />;
};

export default Breadcrumbs; 