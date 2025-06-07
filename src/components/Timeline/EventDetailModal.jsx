import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import './EventDetailModal.css'; // Ensure this CSS file exists and is styled correctly

// --- Type Definitions ---
/**
 * TimelineEvent type definition (Example)
 * @typedef {Object} TimelineEvent
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Date} date
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} location
 * @property {string} host
 * @property {string} category
 * @property {string} importance
 * @property {string} imageUrl
 * @property {boolean} isOfficial
 */

/**
 * EventFromDB type definition (Structure from database)
 * @typedef {Object} EventFromDB
 * @property {string} id
 * @property {string} title
 * @property {string|null} description
 * @property {string} date - Expecting ISO date string format (e.g., "2025-05-02")
 * @property {string|null} start_time - Expecting "HH:MM" format (e.g., "09:00")
 * @property {string|null} end_time - Expecting "HH:MM" format (e.g., "17:30")
 * @property {string|null} location
 * @property {string|null} host
 * @property {string|null} category
 * @property {string|null} importance - e.g., 'critical', 'high', 'medium', 'low'
 * @property {string|null} image_url
 * @property {boolean} is_official
 */

// --- Icons as React Components ---
// (Using functional components for icons)
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
);
const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);
const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
// --- End Icons ---

// --- Mock Functions & Hooks ---
// Replace with your actual implementations
const useAuth = () => {
  // Example: Replace with context or state management
  return { user: { id: '123456' } };
};

const addToGoogleCalendar = (userId, title, description, startDate, isAllDay, location, endDate) => {
  console.log('Adding to Google Calendar (mock):', { userId, title, description, startDate, isAllDay, location, endDate });
  alert('Event added to Google Calendar (Simulation)'); // Provide user feedback
};

const _addToMasterCalendar = () => console.log('Added to Master Calendar (mock)');
const _downloadIcsFile = () => console.log('Downloaded ICS file (mock)');
// --- End Mocks ---


/**
 * Event Detail Modal Component
 * Displays detailed information about a specific event in a modal dialog.
 * Uses JavaScript-based window scrolling to attempt centering the modal.
 *
 * @param {Object} props
 * @param {EventFromDB | null} props.event - The event data object.
 * @param {boolean} props.open - Controls modal visibility.
 * @param {Function} props.onClose - Callback function to close the modal.
 */
const EventDetailModal = ({ event, open, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth(); // Get user info if needed
  const userId = user?.id || '';
  const modalRef = useRef(null); // Ref for the main modal container element

  // --- Scroll to Center Logic (Adopted from working example) ---
  const scrollToCenter = (modalRefToScroll) => {
    if (!modalRefToScroll.current) return () => {}; // Return empty cleanup if ref not attached

    // Delay slightly to allow modal rendering and dimension calculation
    const timerId = setTimeout(() => {
      if (modalRefToScroll.current) {
        const modalElement = modalRefToScroll.current;
        const modalRect = modalElement.getBoundingClientRect(); // Get size and position relative to viewport
        const viewportHeight = window.innerHeight;

        // Calculate the desired scroll position to center the modal
        const desiredScrollTop = window.scrollY + modalRect.top - (viewportHeight - modalRect.height) / 2;
        const finalScrollTop = Math.max(0, desiredScrollTop); // Prevent scrolling above the top

        // Scroll the window
        window.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
      }
    }, 50); // 50ms delay

    // Return a cleanup function to clear the timeout if needed
    return () => clearTimeout(timerId);
  };

  // --- useEffect Hooks ---

  // Effect 1: Lock/unlock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = ''; // Restore background scrolling
    }
    // Cleanup function to restore scroll on component unmount or modal close
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]); // Runs only when 'open' state changes

  // Effect 2: Center the modal using scrolling when it opens
  useEffect(() => {
    let cleanupScroll = null;
    if (open && modalRef.current) {
        // If modal is open and the ref is attached, attempt to scroll it to center
        cleanupScroll = scrollToCenter(modalRef);
    }
    // Return the cleanup function from scrollToCenter (clears the timeout)
    return () => {
        if (cleanupScroll) {
            cleanupScroll();
        }
    };
    // Re-run this effect if 'open' changes or if 'event' changes
    // (in case the event data affects the initial modal height)
  }, [open, event]);

  // Effect 3: Add entry animation class
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.classList.add('animate-in');
      // Remove the class after the animation duration (must match CSS)
      const timer = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.classList.remove('animate-in');
        }
      }, 400); // Animation duration 400ms
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [open]); // Runs only when 'open' state changes


  // --- Component Rendering Logic ---

  // Don't render if no event data is provided
  if (!event) {
    return null;
  }

  // --- Data Processing and Formatting ---
  let eventDate;
  try {
    // Ensure date is parsed correctly, assuming date string might just be YYYY-MM-DD
    eventDate = new Date(event.date + 'T00:00:00'); // Add time part to avoid timezone issues
    if (isNaN(eventDate.getTime())) { // Check if date is valid
        throw new Error('Invalid date parsed');
    }
  } catch (error) {
    console.error("Error parsing event date:", event.date, error);
    eventDate = new Date(); // Fallback to current date as placeholder
  }

  // Date formatting helper functions (safe-guarded with try-catch)
  const getFormattedDate = (date) => { try { return format(date, 'EEEE, MMMM d, yyyy'); } catch { return "Invalid Date"; } };
  const formatDay = (date) => { try { return format(date, 'dd'); } catch { return ''; } };

  // Function to render event badges based on data
  const renderBadges = () => {
    const badges = [];
    if (event.is_official) {
        badges.push(<span key="official" className="badge official">Official AMCAS Event</span>);
    }
    if (event.category) {
        badges.push(<span key="category" className="badge category">{event.category}</span>);
    }
    if (event.importance) {
      const importanceClasses = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' };
      const className = importanceClasses[event.importance.toLowerCase()] || 'default';
      // Capitalize first letter for display
      const displayImportance = event.importance.charAt(0).toUpperCase() + event.importance.slice(1);
      badges.push(<span key="importance" className={`badge importance ${className}`}>{displayImportance} Priority</span>);
    }
    return badges;
  };

  // Handler for the "Add to Google Calendar" button
  const handleAddToGoogleCalendar = () => {
    if (!event || !event.date) {
        console.warn("Cannot add to calendar: Missing event data or date.");
        return;
    }

    const baseDateStr = event.date; // e.g., "2025-05-02"
    let startDateStr = baseDateStr;
    let endDateStr = baseDateStr;
    let isAllDay = true;

    // If start time is provided, construct full date-time string
    if (event.start_time) {
        startDateStr += `T${event.start_time}`; // e.g., "2025-05-02T09:00"
        isAllDay = false; // Not an all-day event if time is specified

        // Handle end time: Use provided end time or calculate a default (e.g., start + 1 hour)
        if (event.end_time) {
            endDateStr += `T${event.end_time}`;
        } else {
            try {
                const start = new Date(startDateStr);
                start.setHours(start.getHours() + 1); // Default 1 hour duration
                endDateStr = `${baseDateStr}T${format(start, 'HH:mm')}`; // Format back
            } catch {
                endDateStr = startDateStr; // Fallback if date calculation fails
            }
        }
    }

    // Create Date objects for the calendar API
    let startDate, endDate = null;
    try {
        startDate = new Date(startDateStr);
        if (!isAllDay) { // Only set end date if it's not an all-day event
             endDate = new Date(endDateStr);
             // Basic validation: ensure end date is after start date
             if (endDate <= startDate) {
                 console.warn("End date is not after start date, adjusting default duration.");
                 endDate = new Date(startDate);
                 endDate.setHours(startDate.getHours() + 1); // Reset to 1 hour default
             }
         }
         if (isNaN(startDate.getTime()) || (!isAllDay && isNaN(endDate.getTime()))) {
             throw new Error("Invalid date created for calendar")
         }
    } catch (e) {
        console.error("Error creating date objects for calendar:", e);
        alert("Could not process event time for calendar.");
        return;
    }

    // Call the (mock) function to add to calendar
    addToGoogleCalendar(
      userId,
      event.title || 'Untitled Event',
      event.description || '',
      startDate,
      isAllDay, // Pass the determined allDay flag
      event.location || '',
      endDate // Pass end date (null for all-day events)
    );
  };

  // --- JSX Structure ---
  return (
    // Overlay covers the entire screen
    <div
      className={`edm-overlay ${open ? 'visible' : 'hidden'}`}
      onClick={onClose} // Close modal if overlay is clicked
      role="presentation" // Indicate it's for click handling, not semantic content
    >
      {/* Modal Container: Assign the ref here for positioning */}
      <div
        className="edm-container"
        onClick={e => e.stopPropagation()} // Prevent clicks inside modal from closing it
        ref={modalRef} // <<< Assign ref for dimension calculation and scrolling
        role="dialog" // Semantic role
        aria-modal="true" // Indicates it's a modal
        aria-labelledby="edm-title" // Accessible title
      >
        {/* Close Button */}
        <button className="edm-close" onClick={onClose} aria-label="Close modal">
          <CloseIcon />
        </button>

        {/* Main Content Area */}
        <div className="edm-content">
          {/* Badges Display */}
          <div className="edm-badges">
            {renderBadges()}
          </div>

          {/* Title and Date */}
          <div className="edm-title-section">
            <h1 id="edm-title">{event.title || "Event Details"}</h1>
            <p className="edm-date">{getFormattedDate(eventDate)}</p>
          </div>

          {/* Tab Navigation Structure */}
          <div className="edm-tabs">
            {/* Tab Buttons */}
            <nav className="edm-tabs-nav" aria-label="Event details navigation">
              <button
                className={`edm-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                role="tab"
                aria-selected={activeTab === 'overview'}
                aria-controls="tabpanel-overview" // Links button to panel
              >
                Overview
              </button>
              <button
                className={`edm-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
                role="tab"
                aria-selected={activeTab === 'details'}
                aria-controls="tabpanel-details"
              >
                Details
              </button>
              <button
                className={`edm-tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
                role="tab"
                aria-selected={activeTab === 'resources'}
                aria-controls="tabpanel-resources"
              >
                Resources
              </button>
              <button
                className={`edm-tab-btn ${activeTab === 'ai-assistants' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai-assistants')}
                role="tab"
                aria-selected={activeTab === 'ai-assistants'}
                aria-controls="tabpanel-ai-assistants"
              >
                AI Assistants
              </button>
            </nav>

            {/* Tab Content Panels */}
            <div className="edm-tab-content">
              {/* Overview Panel */}
              {activeTab === 'overview' && (
                <div className="edm-tab-panel" id="tabpanel-overview" role="tabpanel" aria-labelledby="tab-overview">
                  <p className="edm-description">{event.description || "Begin filling out your application components"}</p>

                  {/* Main layout: two columns */}
                  <div className="edm-flex-layout">
                    {/* Left/Main Column */}
                    <div className="edm-main-column">
                      <section aria-label="What to expect">
                        <h2>What to Expect</h2>
                        <p>
                          The AMCAS application is a standardized application form that is accepted by nearly all U.S. medical schools.
                          When the application opens, you will be able to begin filling out your application components, including:
                        </p>
                        <ul className="edm-expect-list">
                          <li>Personal information and demographics</li>
                          <li>Academic history</li>
                          <li>Work and activities</li>
                          <li>Letters of evaluation</li>
                          <li>Medical school selections</li>
                          <li>Personal statement</li>
                        </ul>
                      </section>
                    </div>

                    {/* Right/Side Column */}
                    <aside className="edm-side-column">
                      {/* When & Where Card */}
                      <div className="edm-info-card">
                        <h3 className="edm-info-card-title">When & Where</h3>
                        
                        <div className="edm-info-card-content">
                          {/* Date display */}
                          <div className="edm-date-display">
                            <div className="edm-date-badge">
                              <span className="edm-date-month">MAY</span>
                              <span className="edm-date-day">{formatDay(eventDate)}</span>
                            </div>
                            <div className="edm-date-details">
                              <p className="edm-date-weekday">Thursday</p>
                              <p className="edm-date-full">May 1, 2025</p>
                            </div>
                          </div>
                          
                          {/* Location Row */}
                          <div className="edm-detail-row">
                            <div className="edm-detail-label">Location</div>
                            <div className="edm-detail-value">{event.location || "Online - AMCAS Website"}</div>
                          </div>
                          
                          {/* Host Row */}
                          <div className="edm-detail-row">
                            <div className="edm-detail-label">Hosted by</div>
                            <div className="edm-detail-value">{event.host || "AMCAS Application System"}</div>
                          </div>
                          
                          {/* Add to Calendar Button */}
                          <button className="edm-btn edm-btn-primary" onClick={handleAddToGoogleCalendar}>
                            <CalendarIcon /> Add to Google Calendar
                          </button>
                        </div>
                      </div>
                    </aside>
                  </div>

                  {/* Personal Notes Section */}
                  <section className="edm-notes-section">
                    <h2 className="edm-section-title">My Notes</h2>
                    <div className="edm-notes-container">
                      <p className="edm-notes-content">No personal notes added yet. Click Edit to add.</p>
                      <button className="edm-btn edm-btn-icon">
                        <EditIcon /> Edit
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {/* Details Panel */}
              {activeTab === 'details' && (
                <div className="edm-tab-panel" id="tabpanel-details" role="tabpanel" aria-labelledby="tab-details">
                  <div className="edm-flex-layout">
                    <div className="edm-main-column">
                      <p className="edm-description">
                        {event.description || 'Detailed description not available.'}
                      </p>
                      
                      <h2>What to Expect</h2>
                      <p>
                        The AMCAS application is a standardized application form that is accepted by nearly all U.S. 
                        medical schools. When the application opens, you will be able to begin filling out your application 
                        components, including:
                      </p>
                      <ul className="edm-expect-list">
                        <li>Personal information and demographics</li>
                        <li>Academic history</li>
                        <li>Work and activities</li>
                        <li>Letters of evaluation</li>
                        <li>Medical school selections</li>
                        <li>Personal statement</li>
                      </ul>
                    </div>
                    
                    <aside className="edm-side-column">
                      <div className="edm-info-card">
                        <h3 className="edm-info-card-title">Timeline Position</h3>
                        <div className="edm-info-card-content">
                          <div className="edm-progress-container">
                            <p className="edm-progress-label">Application Cycle Progress</p>
                            <div className="edm-progress-bar-container">
                              <div className="edm-progress-bar">
                                <div className="edm-progress-value" style={{ width: '25%' }}></div>
                              </div>
                              <span className="edm-progress-percentage">25%</span>
                            </div>
                          </div>
                          
                          <div className="edm-upcoming-deadlines">
                            <p className="edm-deadlines-label">Upcoming Deadlines</p>
                            <div className="edm-deadline-item">
                              <span>AMCAS Opens</span>
                              <span>May 1, 2025</span>
                            </div>
                            <div className="edm-deadline-item">
                              <span>Early Decision</span>
                              <span>Aug 1, 2025</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                </div>
              )}

              {/* Resources Panel */}
              {activeTab === 'resources' && (
                <div className="edm-tab-panel" id="tabpanel-resources" role="tabpanel" aria-labelledby="tab-resources">
                  <h2>Helpful Resources</h2>
                  <div className="edm-resource-grid">
                    <div className="edm-resource-card">
                      <div className="edm-resource-card-header">
                        <h3>AMCAS Guide</h3>
                        <p>Official application guide.</p>
                      </div>
                      <div className="edm-resource-card-footer">
                        <button className="edm-btn edm-btn-outline">
                          <ExternalLinkIcon /> View Resource
                        </button>
                      </div>
                    </div>
                    <div className="edm-resource-card">
                      <div className="edm-resource-card-header">
                        <h3>Fee Assistance</h3>
                        <p>AAMC FAP Information.</p>
                      </div>
                      <div className="edm-resource-card-footer">
                        <button className="edm-btn edm-btn-outline">
                          <ExternalLinkIcon /> View Resource
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="edm-info-card">
                    <h3 className="edm-info-card-title">Recommended Links</h3>
                    <div className="edm-info-card-content">
                      <ul className="edm-links-list">
                        <li><a href="#" className="edm-resource-link"><ExternalLinkIcon /> AMCAS Website</a></li>
                        <li><a href="#" className="edm-resource-link"><ExternalLinkIcon /> Fee Assistance Program</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Assistants Panel */}
              {activeTab === 'ai-assistants' && (
                <div className="edm-tab-panel" id="tabpanel-ai-assistants" role="tabpanel" aria-labelledby="tab-ai-assistants">
                  <h2>AI Assistants For Your Application</h2>
                  <p className="edm-ai-description">Explore AI tools to help with your application process.</p>
                  <div className="edm-ai-assistants-grid">
                    <div className="edm-assistant-card">
                      <div className="edm-assistant-card-content">
                        <div className="edm-assistant-icon"><UserIcon/></div>
                        <h3>School Recommender</h3>
                        <p>Get personalized school recommendations.</p>
                        <button className="edm-btn edm-btn-outline">Get Started</button>
                      </div>
                    </div>
                    <div className="edm-assistant-card">
                      <div className="edm-assistant-card-content">
                        <div className="edm-assistant-icon"><CalendarIcon/></div>
                        <h3>Readiness Check</h3>
                        <p>Assess your application readiness.</p>
                        <button className="edm-btn edm-btn-outline">Get Started</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div> {/* End .tab-content */}
          </div> {/* End .event-tabs */}
        </div> {/* End .event-modal-content */}
      </div> {/* End .event-modal-container */}
    </div> /* End .event-modal-overlay */
  );
};

export default EventDetailModal;