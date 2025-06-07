import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminBreadcrumbs.css';

// URL path to readable name mapping
const routeMapping = {
  'admin': 'Dashboard',
  'users': 'Users',
  'agents': 'AI Agents',
  'schools': 'Schools',
  'events': 'Events',
  'blog': 'Blog',
  'plans': 'Plans',
  'new': 'New',
  'edit': 'Edit'
};

const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Function to generate a readable name for each path segment
  const getPathName = (pathname, index, array) => {
    // If it's an ID (usually a number or a long string)
    if (/^\d+$/.test(pathname) || pathname.length > 20) {
      // Try to determine the entity type based on the previous path
      const previousSegment = array[index - 1];
      
      switch(previousSegment) {
        case 'users':
          return 'User';
        case 'agents':
          return 'Agent';
        case 'schools':
          return 'School';
        case 'events':
          return 'Event';
        case 'blog':
          return 'Article';
        case 'plans':
          return 'Plan';
        default:
          return 'Details';
      }
    }
    
    // Otherwise, use our mapping or the segment name itself
    return routeMapping[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
  };

  // Build breadcrumb items
  const breadcrumbItems = pathnames.map((pathname, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    const name = getPathName(pathname, index, pathnames);
    
    return {
      name,
      routeTo,
      isLast
    };
  });

  return (
    <div className="admin-breadcrumbs">
      <Link to="/admin" className="breadcrumb-home" aria-label="Home">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <div className="breadcrumb-separator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          
          {item.isLast ? (
            <span className="breadcrumb-current">{item.name}</span>
          ) : (
            <Link to={item.routeTo} className="breadcrumb-link">
              {item.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AdminBreadcrumbs;