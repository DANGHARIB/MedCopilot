import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  School, 
  Calendar, 
  FileText, 
  CreditCard, 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown
} from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const location = useLocation();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setExpandedSection(null);
    }
  };

  const toggleSection = (section) => {
    if (collapsed) {
      setCollapsed(false);
    }
    
    // Si on clique sur la section déjà ouverte, on la ferme
    // Sinon, on ferme l'ancienne section et on ouvre la nouvelle
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Vérifier si une route est active ou si l'un de ses enfants est actif
  const isRouteActive = (item) => {
    const currentPath = location.pathname;
    
    // Vérifier si la route elle-même est active (exactement)
    if (item.path && currentPath === item.path) {
      return true;
    }
    
    // Vérifier si l'un des enfants est actif
    if (item.children) {
      return item.children.some(child => child.path === currentPath);
    }
    
    return false;
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/admin',
      children: null
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users size={20} />,
      path: '/admin/users',
      children: null
    },
    {
      id: 'agents',
      label: 'AI Agents',
      icon: <Bot size={20} />,
      path: null,
      children: [
        { id: 'agents-list', label: 'Agent List', path: '/admin/agents' },
        { id: 'agents-new', label: 'Add Agent', path: '/admin/agents/new' }
      ]
    },
    {
      id: 'schools',
      label: 'Schools',
      icon: <School size={20} />,
      path: null,
      children: [
        { id: 'schools-list', label: 'School List', path: '/admin/schools' },
        { id: 'schools-new', label: 'Add School', path: '/admin/schools/new' }
      ]
    },
    {
      id: 'events',
      label: 'Events',
      icon: <Calendar size={20} />,
      path: null,
      children: [
        { id: 'events-list', label: 'Event List', path: '/admin/events' },
        { id: 'events-new', label: 'Add Event', path: '/admin/events/new' }
      ]
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: <FileText size={20} />,
      path: null,
      children: [
        { id: 'blog-posts', label: 'Posts', path: '/admin/blog' },
        { id: 'blog-new', label: 'New Post', path: '/admin/blog/new' }
      ]
    },
    {
      id: 'plans',
      label: 'Plans',
      icon: <CreditCard size={20} />,
      path: '/admin/plans',
      children: null
    }
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="admin-sidebar-toggle" 
        onClick={toggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      
      <nav className="admin-sidebar-nav">
        <ul className="admin-nav-list">
          {navigationItems.map((item) => {
            const active = isRouteActive(item);
            
            return (
              <li key={item.id} className="admin-nav-item">
                {item.path ? (
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => 
                      `admin-nav-link ${isActive ? 'active' : ''}`
                    }
                    title={collapsed ? item.label : undefined}
                    end={item.path === '/admin'} // Utiliser "end" pour le Dashboard
                  >
                    <span className="admin-nav-icon">{item.icon}</span>
                    {!collapsed && <span className="admin-nav-label">{item.label}</span>}
                  </NavLink>
                ) : (
                  <>
                    <button 
                      className={`admin-nav-section-toggle ${expandedSection === item.id ? 'expanded' : ''} ${active ? 'active' : ''}`}
                      onClick={() => toggleSection(item.id)}
                      aria-expanded={expandedSection === item.id}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="admin-nav-section-content">
                        <span className="admin-nav-icon">{item.icon}</span>
                        {!collapsed && <span className="admin-nav-label">{item.label}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronDown 
                          size={16} 
                          className={`admin-nav-arrow ${expandedSection === item.id ? 'expanded' : ''}`} 
                        />
                      )}
                    </button>
                    
                    {(!collapsed || expandedSection === item.id) && (
                      <ul className={`admin-nav-subnav ${expandedSection === item.id ? 'expanded' : ''}`}>
                        {item.children.map((child) => (
                          <li key={child.id} className="admin-nav-subitem">
                            <NavLink 
                              to={child.path}
                              className={({ isActive }) => 
                                `admin-nav-sublink ${isActive ? 'active' : ''}`
                              }
                              title={collapsed ? child.label : undefined}
                            >
                              <span className="admin-nav-sublabel">{child.label}</span>
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
      </nav>
      
      <div className="admin-sidebar-footer">
        <NavLink to="/" className="admin-return-link" title={collapsed ? "Back to site" : undefined}>
          <Home size={20} />
          {!collapsed && <span>Back to site</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;