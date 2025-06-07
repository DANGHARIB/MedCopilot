import React, { createContext, useContext, useState, useEffect } from 'react';
import './Tabs.css';

// Contexte pour gérer l'état des onglets
const TabsContext = createContext(null);

// Composant principal Tabs
const Tabs = ({ defaultValue, value, onValueChange, className = '', animated = false, ...props }) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue || '');
  const [prevTab, setPrevTab] = useState(null);

  useEffect(() => {
    if (value !== undefined && value !== activeTab) {
      setPrevTab(activeTab);
      setActiveTab(value);
    }
  }, [value, activeTab]);

  const handleTabChange = (tabValue) => {
    if (tabValue === activeTab) return;
    
    setPrevTab(activeTab);
    
    if (onValueChange) {
      onValueChange(tabValue);
    } else {
      setActiveTab(tabValue);
    }
  };

  const contextValue = {
    activeTab: value !== undefined ? value : activeTab,
    prevTab,
    onTabChange: handleTabChange,
    animated
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`tabs-root ${className}`} {...props} />
    </TabsContext.Provider>
  );
};

// Liste des déclencheurs d'onglets
const TabsList = ({ className = '', variant = 'default', ...props }) => {
  const variantClass = variant === 'bordered' ? 'bordered' : 
                      variant === 'pills' ? 'pills' : 
                      variant === 'compact' ? 'compact' : '';
  
  return (
    <div className={`tabs-list ${variantClass} ${className}`} role="tablist" {...props} />
  );
};

// Déclencheur d'onglet individuel
const TabsTrigger = ({ value, disabled = false, className = '', ...props }) => {
  const { activeTab, onTabChange } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      disabled={disabled}
      className={`tabs-trigger ${isActive ? 'active' : ''} ${className}`}
      onClick={() => onTabChange(value)}
      {...props}
    />
  );
};

// Contenu de l'onglet
const TabsContent = ({ value, className = '', forceMount = false, ...props }) => {
  const { activeTab, prevTab, animated } = useContext(TabsContext);
  const isActive = activeTab === value;
  const wasPreviouslyActive = prevTab === value;
  const [shouldRender, setShouldRender] = useState(isActive || forceMount);
  const [state, setState] = useState(isActive ? 'entered' : 'exited');

  // Gérer les transitions d'affichage et de masquage
  useEffect(() => {
    let timeoutId;

    if (isActive) {
      setShouldRender(true);
      setState('entered'); // Suppression du délai de 10ms
    } else if (wasPreviouslyActive && animated) {
      // Animation de sortie
      setState('exiting');
      
      // Supprimer le contenu après l'animation
      timeoutId = setTimeout(() => {
        if (!forceMount) {
          setShouldRender(false);
        }
        setState('exited');
      }, 150);
    } else if (!forceMount) {
      // Pas d'animation si on n'était pas l'onglet actif précédemment
      setShouldRender(false);
      setState('exited');
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isActive, wasPreviouslyActive, forceMount, animated]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      data-state={isActive ? 'active' : 'inactive'}
      hidden={!isActive && !animated}
      className={`tabs-content ${isActive ? 'active' : ''} ${animated ? state : ''} ${className}`}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };