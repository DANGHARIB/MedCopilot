import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./MySchoolTab.css";
import { getSimpleDeadlineMessage } from "../../utils/deadlineMessages";
// import SchoolDetailsModal from "../../components/user/profile/SchoolDetailsModal";
import {
  Trash2,
  School,
  Eye,
  // ExternalLink,
  // Info,
  CheckCircle,
  X,
  FileText,
  ExternalLink,
  Calendar
} from "lucide-react";

const LOCAL_STORAGE_KEY = "mySavedSchools";

/**
 * MySchoolTab component to manage user's saved schools with modern design
 * Features: School logos (initials), portal links, essay progress tracking
 */
const MySchoolTab = () => {
  // États principaux
  const [savedSchools, setSavedSchools] = useState(() => {
    const storedSchools = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      const parsed = storedSchools ? JSON.parse(storedSchools) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse saved schools from localStorage", e);
      return [];
    }
  });

  // Essay progress data for each school
  const [schoolEssayProgress, setSchoolEssayProgress] = useState({});

  // État pour le toast de notification
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const navigate = useNavigate();

  // Function to calculate essay progress for a school
  const calculateEssayProgress = (schoolId) => {
    try {
      const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
      const essayList = schoolEssays[schoolId] || [];
      
      if (essayList.length === 0) {
        return { total: 0, completed: 0, percentage: 0 };
      }

      const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
      const schoolEssayHistory = essayHistory[schoolId] || {};
      
      let completedCount = 0;
      essayList.forEach(essay => {
        const essayRecord = schoolEssayHistory[essay.id];
        const isGenerated = !!(essayRecord && 
                             essayRecord.versions && 
                             essayRecord.versions.length > 0);
        if (isGenerated) {
          completedCount++;
        }
      });

      const percentage = Math.round((completedCount / essayList.length) * 100);
      
      return {
        total: essayList.length,
        completed: completedCount,
        percentage: percentage
      };
    } catch (error) {
      console.error("Error calculating essay progress:", error);
      return { total: 0, completed: 0, percentage: 0 };
    }
  };

  // Function to get and format deadline for a school
  const getSchoolDeadline = (schoolId) => {
    try {
      const deadlines = JSON.parse(localStorage.getItem('schoolDeadlines') || '{}');
      const deadline = deadlines[schoolId];
      
      if (!deadline || deadline === "not defined") {
        return { 
          status: 'not_defined', 
          formatted: 'Not defined', 
          urgency: 'none',
          daysRemaining: null 
        };
      }

      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);
      
      const timeDiff = deadlineDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Compact numeric format for card view: MM/DD/YYYY
      const formatted = deadlineDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });

      let urgency = 'normal';
      if (daysRemaining < 0) {
        urgency = 'overdue';
      } else if (daysRemaining <= 7) {
        urgency = 'urgent';
      } else if (daysRemaining <= 30) {
        urgency = 'soon';
      }

      return {
        status: 'defined',
        formatted,
        urgency,
        daysRemaining
      };
    } catch (error) {
      console.error("Error getting school deadline:", error);
      return { 
        status: 'not_defined', 
        formatted: 'Not defined', 
        urgency: 'none',
        daysRemaining: null 
      };
    }
  };

  // Function to generate initials from school name
  const generateInitials = (schoolName) => {
    if (!schoolName) return "??";
    
    // Handle common patterns in medical school names
    let cleanName = schoolName;
    
    // Remove common suffixes
    cleanName = cleanName.replace(/\s+(School of Medicine|Medical School|College of Medicine).*$/i, "");
    
    // Handle university patterns
    if (cleanName.includes("University")) {
      // For "Harvard University" -> "HU", "Johns Hopkins University" -> "JHU"
      const parts = cleanName.split(" ");
      const universityIndex = parts.findIndex(part => part.toLowerCase() === "university");
      
      if (universityIndex > 0) {
        // Take words before "University"
        const relevantParts = parts.slice(0, universityIndex + 1);
        return relevantParts
          .filter(word => word.length > 0)
          .map(word => word.charAt(0).toUpperCase())
          .join("")
          .substring(0, 3); // Max 3 characters
      }
    }
    
    // Default: take first letter of each significant word
    const words = cleanName.split(" ").filter(word => 
      word.length > 2 && 
      !["of", "the", "and", "at", "in"].includes(word.toLowerCase())
    );
    
    if (words.length >= 2) {
      return words
        .slice(0, 3) // Max 3 words
        .map(word => word.charAt(0).toUpperCase())
        .join("");
    } else if (words.length === 1) {
      // Single word: take first 2-3 characters
      return words[0].substring(0, 3).toUpperCase();
    }
    
    // Fallback
    return schoolName.substring(0, 2).toUpperCase();
  };

  // Function to get school portal URL
  const getSchoolPortalUrl = (school) => {
    // This would typically come from school data
    // For now, we'll use the officialURL if available, or generate a placeholder
    if (school.officialURL) {
      return school.officialURL;
    }
    
    // Generate a reasonable portal URL based on school name
    const schoolNameSlug = school.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return `https://apply.${schoolNameSlug.substring(0, 20)}.edu`;
  };

  // Effet pour s'assurer que les données sont synchronisées avec localStorage
  useEffect(() => {
    const refreshSavedSchools = () => {
      try {
        const storedSchools = localStorage.getItem(LOCAL_STORAGE_KEY);
        const parsed = storedSchools ? JSON.parse(storedSchools) : [];
        if (Array.isArray(parsed)) {
          setSavedSchools(parsed);
          
          // Calculate essay progress for each school
          const progressData = {};
          parsed.forEach(school => {
            progressData[school.id] = calculateEssayProgress(school.id);
          });
          setSchoolEssayProgress(progressData);
        }
      } catch (e) {
        console.error("Failed to refresh saved schools from localStorage", e);
      }
    };

    // Refresh on component mount
    refreshSavedSchools();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === LOCAL_STORAGE_KEY || e.key === 'schoolEssays' || e.key === 'essayGenerationHistory') {
        refreshSavedSchools();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (Array.isArray(savedSchools)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedSchools));
    }
  }, [savedSchools]);

  // Effet pour masquer le toast après 3 secondes
  useEffect(() => {
    let toastTimer;
    if (toast.show) {
      toastTimer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [toast]);

  // Remove a single school
  const handleRemoveSchool = (schoolIdToRemove) => {
    const schoolToRemove = savedSchools.find(
      (school) => school.id === schoolIdToRemove
    );

    setSavedSchools((prevSchools) =>
      prevSchools.filter((school) => school.id !== schoolIdToRemove)
    );

    // Afficher un toast pour la suppression
    if (schoolToRemove) {
      showToast(
        `${schoolToRemove.name} removed from your saved schools`,
        "error"
      );
    }
  };

  // Fonction pour afficher un toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Handler for ViewAll button
  const handleViewAllSchools = () => {
    navigate('/viewAllSchool');
  };

  // Handle navigating to essays list
  const handleViewEssays = (school) => {
    navigate(`/schools/${school.id}/essays`);
  };

  // Handle opening school portal
  const handleOpenPortal = (school) => {
    const portalUrl = getSchoolPortalUrl(school);
    window.open(portalUrl, '_blank', 'noopener,noreferrer');
  };

  // --- Main component rendering ---
  return (
    <div className="my-school-container">
      {/* Header with Free Trial Banner */}
      <div className="my-school-header">
        <div className="my-school-header-left">
          <h2 className="my-school-title">
            My{" "}
            <span className="my-school-title-highlight">Saved Schools</span>
          </h2>
          <div className="my-school-header-bottom">
            <div className="my-school-free-trial-banner">
              Free Trial: 1 essay available
            </div>
            <button
              className="my-school-view-all-button"
              onClick={handleViewAllSchools}
              type="button"
            >
              <Eye size={16} aria-hidden="true" /> View All Schools
            </button>
          </div>
        </div>
      </div>

      {/* Display saved schools */}
      <div className="my-school-cards-container">
        {savedSchools.length === 0 ? (
          <div className="my-school-empty-state">
            <School className="my-school-empty-icon" aria-hidden="true" />
            <h3 className="my-school-empty-title">No saved schools yet</h3>
            <p className="my-school-empty-description">
              Click "View All Schools" to start browsing and selecting medical schools.
            </p>
          </div>
        ) : (
          <div className="my-school-grid">
            {savedSchools
              .sort((a, b) => {
                const deadlineA = getSchoolDeadline(a.id);
                const deadlineB = getSchoolDeadline(b.id);
                const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };

                const aHasDeadline = deadlineA.status === 'defined';
                const bHasDeadline = deadlineB.status === 'defined';

                // 1. One has a deadline, the other doesn't
                if (aHasDeadline && !bHasDeadline) return -1;
                if (!aHasDeadline && bHasDeadline) return 1;

                // 2. Both have deadlines: sort by urgency, then priority
                if (aHasDeadline && bHasDeadline) {
                  if (deadlineA.daysRemaining !== deadlineB.daysRemaining) {
                    return deadlineA.daysRemaining - deadlineB.daysRemaining;
                  }
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                }

                // 3. Both have no deadline: sort by priority
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((school) => {
              const progress = schoolEssayProgress[school.id] || { total: 0, completed: 0, percentage: 0 };
              const deadline = getSchoolDeadline(school.id);
              const initials = generateInitials(school.name);
              
              return (
                <div key={school.id} className="my-school-card">
                  {/* School Logo and Info in a Row */}
                  <div className="my-school-card-header">
                    {/* School Logo/Initials */}
                    <div className="my-school-logo">
                      <span className="my-school-logo-text">{initials}</span>
                    </div>

                    {/* School Info */}
                    <div className="my-school-info">
                      <h3 className="my-school-name">{school.name}</h3>
                      <div className="my-school-location-row">
                        {school.location && (
                          <p className="my-school-location">{school.location}</p>
                        )}
                        {/* Priority Badge */}
                        {school.priority && (
                          <div className={`my-school-priority-badge priority-${school.priority.toLowerCase()}`}>
                            {school.priority}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Deadline Section */}
                  <div className="my-school-deadline">
                    <div className="my-school-deadline-content">
                      {deadline.status === 'defined' ? (
                        <>
                          <div className="my-school-deadline-header">
                            <Calendar className="my-school-deadline-icon" size={16} />
                            <span className="my-school-deadline-label">Deadline: {deadline.formatted}</span>
                          </div>
                          <div className="my-school-deadline-info">
                            {deadline.daysRemaining !== null && (
                              <span className={`my-school-deadline-status urgency-${deadline.urgency}`}>
                                {getSimpleDeadlineMessage(deadline.daysRemaining)}
                                {deadline.urgency === 'urgent' && ' !'}
                                {deadline.urgency === 'overdue' && ' !!'}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="my-school-deadline-undefined">
                          <Calendar className="my-school-deadline-icon undefined" size={16} />
                          <span className="my-school-deadline-text">Deadline not defined</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Essay Progress */}
                  <div className="my-school-progress">
                    <div className="my-school-progress-header">
                      <span className="my-school-progress-label">Essays:</span>
                      <span className="my-school-progress-text">
                        {progress.completed}/{progress.total} Complete
                      </span>
                    </div>
                    <div className="my-school-progress-bar">
                      <div 
                        className="my-school-progress-fill"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="my-school-actions">
                    <button
                      className="my-school-action-btn my-school-action-essays"
                      onClick={() => handleViewEssays(school)}
                      aria-label={`View essays for ${school.name}`}
                      type="button"
                    >
                      Essays
                    </button>
                    
                    <button
                      className="my-school-action-btn my-school-action-portal"
                      onClick={() => handleOpenPortal(school)}
                      aria-label={`Open portal for ${school.name}`}
                      type="button"
                    >
                      View Portal
                    </button>

                    <button
                      className="my-school-delete-btn"
                      onClick={() => handleRemoveSchool(school.id)}
                      aria-label={`Remove ${school.name}`}
                      type="button"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast de notification */}
      {toast.show && (
        <div className={`my-school-toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "success" ? (
              <CheckCircle size={18} style={{ color: "#059669" }} />
            ) : (
              <X size={18} style={{ color: "#DC2626" }} />
            )}
          </span>
          <span>{toast.message}</span>
          <button
            className="toast-close-button"
            onClick={() => setToast({ ...toast, show: false })}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MySchoolTab;