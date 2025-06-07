import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import WelcomeHeader from './WelcomeHeader';
import UserSidebar from './UserSidebar';
import './UserLayout.css';

const UserLayout = ({ sidebarTitle = "Navigation", children }) => {
  const userMainRef = useRef(null);
  const userContentRef = useRef(null);

  useEffect(() => {
    const userMain = userMainRef.current;
    const userContent = userContentRef.current;
    
    if (userMain && userContent) {
      const checkContentHeight = () => {
        const mainHeight = userMain.offsetHeight;
        const contentHeight = userContent.offsetHeight;
        const sidebarHeight = mainHeight;
        
        // Si le contenu est beaucoup plus petit que l'espace disponible,
        // centrer verticalement
        if (contentHeight < sidebarHeight * 0.6) {
          userMain.classList.add('user-main-center');
        } else {
          userMain.classList.remove('user-main-center');
        }
      };

      // Vérifier à l'initialisation
      setTimeout(checkContentHeight, 100);

      // Vérifier lors du redimensionnement
      const resizeObserver = new ResizeObserver(checkContentHeight);
      resizeObserver.observe(userContent);

      // Nettoyer l'observer
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [children]);

  return (
    <div className="user-layout">
      <WelcomeHeader />
      <div className="user-main" ref={userMainRef}>
        <UserSidebar title={sidebarTitle} />
        <main className="user-content" ref={userContentRef}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;