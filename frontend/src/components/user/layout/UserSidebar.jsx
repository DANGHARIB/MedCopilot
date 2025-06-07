// 1. Modification du fichier UserSidebar.js (paste.txt)

import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  User,
  Sparkles,
  BookOpen,
  CalendarDays,
  CreditCard,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  Award,
  GraduationCap,
  Pen,
  Database,
  Crown,
  BookMarked,
  Library,
  Compass,
  ClipboardList,
  Briefcase,
} from 'lucide-react';
import './UserSidebar.css';

const UserSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({}); // Use object for multiple sections
  const location = useLocation();

  // Détecter la route /essay-generator et plier automatiquement la barre latérale
  useEffect(() => {
    if (location.pathname === '/essay-generator') {
      setCollapsed(true);
    }
  }, [location.pathname]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      // Collapse all sections when collapsing the sidebar
      setExpandedSections({});
    }
  };

  // Revised function for accordion behavior
  const toggleSection = (sectionId) => {
    if (collapsed) {
      setCollapsed(false);
      // Ensure only the clicked section is expanded after sidebar animation
      setTimeout(() => setExpandedSections({ [sectionId]: true }), 50);
    } else {
      setExpandedSections(prevSections => {
        const isCurrentlyExpanded = !!prevSections[sectionId];
        // If clicking an already expanded section, close it.
        // If clicking a closed section, close others and open this one.
        return isCurrentlyExpanded ? {} : { [sectionId]: true };
      });
    }
  };
  
  const isRouteActive = (item) => {
    const currentPath = location.pathname;
    if (item.path && currentPath === item.path) {
      return true;
    }
    if (item.subItems) {
      return item.subItems.some(child => {
        if (child.path && currentPath === child.path) {
          return true;
        }
        // Recursive check removed as we only have one level of nesting for active state check
        return false;
      });
    }
    return false;
  };

  const navigationItems = useMemo(() => [
    {
      id: 'personal',
      label: 'Personal',
      icon: <User size={20} />,
      path: null,
      subItems: [
        {
          id: 'profile-information',
          label: 'AMCAS Information',
          icon: <FileText size={16} />,
          path: '/profile/information',
        },
        {
          id: 'my-subscriptions',
          label: 'My Subscriptions',
          icon: <Crown size={16} />,
          path: '/subscription',
        },
      ]
    },
    {
      id: 'application',
      label: 'Application',
      icon: <ClipboardList size={20} />,
      path: null,
      subItems: [
        {
          id: 'my-schools',
          label: 'My Schools',
          icon: <BookOpen size={16} />,
          path: '/schools',
        },
        {
          id: 'my-secondary-essays',
          label: 'My Secondary Essays',
          icon: <FileText size={16} />,
          path: '/get-all-essays',
        },
        {
          id: 'my-letters',
          label: 'My Letters of Intent/Interest',
          icon: <Pen size={16} />,
          path: '/letters',
        },
        {
          id: 'timeline',
          label: 'Timeline',
          icon: <CalendarDays size={16} />,
          path: '/timeline',
        }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: <Award size={20} />,
      path: null,
      subItems: [
        {
          id: 'school-database',
          label: 'School Database',
          icon: <Database size={16} />,
          path: '/viewAllSchool',
        },
      ]
    },
    // {
    //   id: 'resources',
    //   label: 'Resources',
    //   icon: <Library size={20} />,
    //   path: null,
    //   subItems: [
    //     {
    //       id: 'application-guides',
    //       label: 'Application Guides',
    //       icon: <BookMarked size={16} />,
    //       path: '/guides',
    //     },
    //     {
    //       id: 'school-specific-strategies',
    //       label: 'School-Specific Strategies',
    //       icon: <Compass size={16} />,
    //       path: '/strategies',
    //     },
    //     {
    //       id: 'competency-frameworks',
    //       label: 'Competency Frameworks',
    //       icon: <GraduationCap size={16} />,
    //       path: '/frameworks',
    //     },
    //     {
    //       id: 'timeline-guides',
    //       label: 'Timeline Guides',
    //       icon: <CalendarDays size={16} />,
    //       path: '/timeline-guides',
    //     }
    //   ]
    // },
   
  ], []);

  // Effect to handle automatic expansion/collapse on route change
  useEffect(() => {
    // Find the parent item whose subitem path matches the current location
    const activeParent = navigationItems.find(item =>
      item.subItems && item.subItems.some(subItem => subItem.path === location.pathname)
    );

    // Only automatically adjust expansion if the sidebar is not collapsed
    if (!collapsed) {
      if (activeParent) {
        // If the corresponding parent section is not currently the only one expanded,
        // update the state to only have this parent expanded.
        const isOnlyActiveParentExpanded = 
          expandedSections[activeParent.id] && 
          Object.keys(expandedSections).filter(key => expandedSections[key]).length === 1;
        
        if (!isOnlyActiveParentExpanded) {
           setExpandedSections({ [activeParent.id]: true });
        }
      } else {
         // If navigation goes to a path not covered by subitems, collapse all sections.
         if (Object.keys(expandedSections).some(key => expandedSections[key])) { // Check if any section is open
             setExpandedSections({});
         }
      }
    }
    // Trigger effect on location change, item structure change, or collapse state change.
  }, [location.pathname, navigationItems, collapsed]); // expandedSections removed from dependencies

  return (
    <aside className={`mc-usersb-user-sidebar ${collapsed ? 'mc-usersb-collapsed' : ''}`}>
      <div className="mc-usersb-toggle-container">
        <button 
          className="mc-usersb-user-sidebar-toggle" 
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="mc-usersb-user-sidebar-nav">
        <ul className="mc-usersb-user-nav-list">
          {navigationItems.map((item) => {
            const isActive = isRouteActive(item);
            // Check if the current item's ID exists and is true in the expandedSections object
            const isExpanded = !!expandedSections[item.id]; 

            return (
              <li key={item.id} className="mc-usersb-user-nav-item">
                {item.path ? (
                  <NavLink 
                    to={item.path} 
                    className={({ isActive: navLinkIsActive }) => 
                      `mc-usersb-user-nav-link ${navLinkIsActive ? 'mc-usersb-active' : ''}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="mc-usersb-user-nav-icon">{item.icon}</span>
                    {!collapsed && <span className="mc-usersb-user-nav-label">{item.label}</span>}
                  </NavLink>
                ) : (
                  <>
                    <button
                      className={`mc-usersb-nav-section-toggle ${isExpanded ? 'mc-usersb-expanded' : ''} ${isActive ? 'mc-usersb-active' : ''}`}
                      onClick={() => toggleSection(item.id)}
                      aria-expanded={isExpanded} // Use the derived isExpanded boolean
                      title={collapsed ? item.label : undefined}
                      type="button"
                    >
                      <div className="mc-usersb-nav-link-content">
                        <span className="mc-usersb-user-nav-icon">{item.icon}</span>
                        {!collapsed && <span className="mc-usersb-user-nav-label">{item.label}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronDown 
                          size={16} 
                          className={`mc-usersb-user-nav-expand-icon ${isExpanded ? 'mc-usersb-expanded' : ''}`} 
                        />
                      )}
                    </button>
                    
                    {/* Render UL if subItems exist; control visibility purely with CSS */}
                    {item.subItems && (
                      // Apply expanded class based on the derived isExpanded boolean
                      <ul className={`mc-usersb-user-nav-subitems ${isExpanded ? 'mc-usersb-expanded' : ''}`}> 
                        {item.subItems.map((subItem) => {
                          // Check expansion state for sub-items if they become expandable
                          const isSubItemExpanded = !!expandedSections[subItem.id]; 
                          return (
                            <li key={subItem.id} className="mc-usersb-user-nav-subitem">
                              {subItem.path ? (
                                <NavLink 
                                  to={subItem.path}
                                  className={({ isActive: navLinkIsActive }) => 
                                    `mc-usersb-user-nav-sublink ${navLinkIsActive ? 'mc-usersb-active' : ''}`
                                  }
                                  title={collapsed ? subItem.label : undefined}
                                  end={subItem.end}
                                >
                                  {subItem.icon && <span className="mc-usersb-user-nav-subicon">{subItem.icon}</span>}
                                  <span className="mc-usersb-user-nav-sublabel">{subItem.label}</span>
                                </NavLink>
                              ) : (
                                <>
                                  {/* Update check for sub-item expansion */}
                                  {/* This part might not be needed if subItems don't have their own subItems */}
                                  <button 
                                    className={`mc-usersb-nav-subsection-toggle ${isSubItemExpanded ? 'mc-usersb-expanded' : ''}`}
                                    onClick={() => toggleSection(subItem.id)} // This would only work if subItems could be expanded
                                    aria-expanded={isSubItemExpanded}
                                    type="button"
                                  >
                                    <div className="mc-usersb-nav-sublink-content">
                                      {subItem.icon && <span className="mc-usersb-user-nav-subicon">{subItem.icon}</span>}
                                      <span className="mc-usersb-user-nav-sublabel">{subItem.label}</span>
                                    </div>
                                    <ChevronDown 
                                      size={12} 
                                      className={`mc-usersb-user-nav-expand-icon ${isSubItemExpanded ? 'mc-usersb-expanded' : ''}`} 
                                    />
                                  </button>
                                  
                                  {/* Render nested subitems if they exist */}
                                  {subItem.subItems && (
                                    <ul className={`mc-usersb-user-nav-nested-subitems ${isSubItemExpanded ? 'mc-usersb-expanded' : ''}`}>
                                      {subItem.subItems.map((nestedItem) => (
                                        <li key={nestedItem.id} className="mc-usersb-user-nav-nested-subitem">
                                          <NavLink 
                                            to={nestedItem.path}
                                            className={({ isActive: navLinkIsActive }) => 
                                              `mc-usersb-user-nav-nested-sublink ${navLinkIsActive ? 'mc-usersb-active' : ''}`
                                            }
                                            title={collapsed ? nestedItem.label : undefined}
                                            end={nestedItem.end}
                                          >
                                            {nestedItem.icon && <span className="mc-usersb-user-nav-nested-subicon">{nestedItem.icon}</span>}
                                            <span className="mc-usersb-user-nav-nested-sublabel">{nestedItem.label}</span>
                                          </NavLink>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mc-usersb-user-sidebar-footer">
        <NavLink to="/" className="mc-usersb-user-return-link" title={collapsed ? "Back to site" : undefined}>
          <Home size={20} />
          {!collapsed && <span className="mc-usersb-user-nav-label">Back to site</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default UserSidebar;
