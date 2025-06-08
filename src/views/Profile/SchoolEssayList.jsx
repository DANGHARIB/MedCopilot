import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonalizedDeadlineMessage, getSimpleDeadlineMessage } from '../../utils/deadlineMessages';
import { 
  ChevronLeft, 
  Eye,
  CheckCircle,
  Info,
  X,
  FileText,
  ExternalLink,
  Calendar,
  BarChart3,
  Globe,
  Percent
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import TableEssays from '../../components/UI/TableEssays';
import EssayEditModal from '../../components/user/profile/EssayEditModal';
import SchoolOnboarding from '../../components/user/profile/SchoolOnboarding';
import './SchoolEssayList.css';

/**
 * SchoolEssayList - Displays all essays configured for a specific school
 * and allows the user to generate an essay for each configuration
 */
const SchoolEssayList = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  // States
  const [school, setSchool] = useState(null);
  const [essays, setEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingEssay, setEditingEssay] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show toast notification function (defined early to avoid hoisting issues)
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Fetch school and essay data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get school data
        const savedSchools = JSON.parse(localStorage.getItem("mySavedSchools") || '[]');
        const schoolData = savedSchools.find(s => s.id.toString() === schoolId);
        
        if (!schoolData) {
          // School not found, redirect back to saved schools
          navigate('/schools');
          return;
        }
        
        setSchool(schoolData);
        
        // Get essays for this school
        const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
        const essayList = schoolEssays[schoolId] || [];
        
        // Add generated status to each essay
        const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
        const schoolEssayHistory = essayHistory[schoolId] || {};
        
        const formattedEssays = essayList.map(essay => {
          // Un essai est considéré comme généré UNIQUEMENT s'il existe dans l'historique
          // ET qu'il a un champ 'versions' avec au moins une version
          const essayRecord = schoolEssayHistory[essay.id];
          const isGenerated = !!(essayRecord && 
                               essayRecord.versions && 
                               essayRecord.versions.length > 0);
          
          return {
            ...essay,
            isGenerated: isGenerated,
            generatedDate: isGenerated ? essayRecord?.date : null
          };
        });
        
        setEssays(formattedEssays);
      } catch (error) {
        console.error("Error loading school essays:", error);
        showToast("Failed to load essay data", "error");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [schoolId, navigate]);

  // Navigate back to schools list
  const handleBackToSchools = () => {
    navigate('/schools');
  };

  // Function to generate initials from school name (same as MySchoolTab)
  const generateInitials = (schoolName) => {
    if (!schoolName) return "??";
    
    let cleanName = schoolName;
    cleanName = cleanName.replace(/\s+(School of Medicine|Medical School|College of Medicine).*$/i, "");
    
    if (cleanName.includes("University")) {
      const parts = cleanName.split(" ");
      const universityIndex = parts.findIndex(part => part.toLowerCase() === "university");
      
      if (universityIndex > 0) {
        const relevantParts = parts.slice(0, universityIndex + 1);
        return relevantParts
          .filter(word => word.length > 0)
          .map(word => word.charAt(0).toUpperCase())
          .join("")
          .substring(0, 3);
      }
    }
    
    const words = cleanName.split(" ").filter(word => 
      word.length > 2 && 
      !["of", "the", "and", "at", "in"].includes(word.toLowerCase())
    );
    
    if (words.length >= 2) {
      return words
        .slice(0, 3)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
    } else if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }
    
    return schoolName.substring(0, 2).toUpperCase();
  };

  // Function to get and format deadline for a school (same as MySchoolTab)
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
      
      const formatted = deadlineDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
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

  // Calculate essay progress for display
  const calculateEssayProgress = () => {
    if (essays.length === 0) {
      return { total: 0, completed: 0, percentage: 0 };
    }

    const completedCount = essays.filter(essay => essay.isGenerated).length;
    const percentage = Math.round((completedCount / essays.length) * 100);
    
    return {
      total: essays.length,
      completed: completedCount,
      percentage: percentage
    };
  };


  
  // Navigate to essay generator
  const handleGenerateEssay = (essay) => {
    try {
      // Assurez-vous que l'essai sélectionné contient toutes les informations nécessaires
      const completeEssay = {
        ...essay,
        // Valeurs par défaut si elles ne sont pas définies
        subject: essay.subject || "Untitled Essay",
        // S'assurer que le type de limite est explicitement défini
        limitType: essay.limitType || "words",
        // Définir les limites en fonction du type
        wordLimit: essay.limitType === "words" ? (essay.wordLimit || 500) : 500,
        characterLimit: essay.limitType === "characters" ? (essay.characterLimit || 2500) : 2500,
        tone: essay.tone || "professional",
        style: essay.style || "narrative",
        context: essay.context || "",
        category: essay.category || "other"
      };
      
      console.log("Preparing essay for generation:", completeEssay); // Debug log
      
      // Sauvegarde de l'école et de l'essai configuré dans localStorage
      localStorage.setItem("selectedSchoolForEssay", JSON.stringify(school));
      localStorage.setItem("selectedEssayConfig", JSON.stringify(completeEssay));
      
      // Initialiser l'enregistrement de génération
      // Mais ne PAS marquer l'essai comme généré tant que le processus n'est pas terminé
      const now = new Date();
      const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
      
      if (!essayHistory[schoolId]) {
        essayHistory[schoolId] = {};
      }
      
      // Initialiser l'entrée pour cet essai, mais sans le marquer comme généré
      if (!essayHistory[schoolId][essay.id]) {
        essayHistory[schoolId][essay.id] = {
          date: now.toISOString(),
          lastGeneratedAt: null,
          versions: [] // Le tableau de versions vide indique qu'il n'est pas encore généré
        };
      }
      
      localStorage.setItem('essayGenerationHistory', JSON.stringify(essayHistory));
      
      // Navigation vers le générateur d'essai
      navigate('/essay-generator');
    } catch (error) {
      console.error("Error preparing essay generation:", error);
      showToast("Failed to prepare essay generation", "error");
    }
  };
  
  // Open edit modal
  const handleEditEssay = (essay) => {
    setEditingEssay(essay);
    setShowEditModal(true);
  };
  
  // Save edited essay
  const handleSaveEditedEssay = (editedEssay) => {
    try {
      // Get current essays
      const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
      const currentEssays = schoolEssays[schoolId] || [];
      
      // Find and update the edited essay
      const updatedEssays = currentEssays.map(essay => 
        essay.id === editedEssay.id ? { ...editedEssay } : essay
      );
      
      // Update localStorage
      schoolEssays[schoolId] = updatedEssays;
      localStorage.setItem('schoolEssays', JSON.stringify(schoolEssays));
      
      // Update state
      setEssays(prev => prev.map(essay => 
        essay.id === editedEssay.id ? { 
          ...editedEssay,
          isGenerated: essay.isGenerated,
          generatedDate: essay.generatedDate
        } : essay
      ));
      
      // Show success message
      showToast("Essay configuration updated successfully", "success");
    } catch (error) {
      console.error("Error updating essay:", error);
      showToast("Failed to update essay configuration", "error");
    }
    
    // Close modal
    setShowEditModal(false);
    setEditingEssay(null);
  };
  
  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingEssay(null);
  };
  
  // Show delete confirmation
  const handleDeleteConfirm = (essay) => {
    setShowDeleteConfirm(essay);
  };
  
  // Delete essay
  const handleDeleteEssay = () => {
    if (!showDeleteConfirm) return;
    
    try {
      // Get current essays
      const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
      const currentEssays = schoolEssays[schoolId] || [];
      
      // Filter out the essay to delete
      const updatedEssays = currentEssays.filter(e => e.id !== showDeleteConfirm.id);
      
      // Update localStorage
      schoolEssays[schoolId] = updatedEssays;
      localStorage.setItem('schoolEssays', JSON.stringify(schoolEssays));
      
      // Update state
      setEssays(prev => prev.filter(e => e.id !== showDeleteConfirm.id));
      
      // Show success message
      showToast("Essay configuration deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting essay:", error);
      showToast("Failed to delete essay configuration", "error");
    }
    
    // Hide confirmation
    setShowDeleteConfirm(null);
  };
  
  // Handle viewing single essay
  const handleViewEssay = (essay) => {
    navigate(`/schools/${schoolId}/essays/${essay.id}`);
  };
  
  // Function already defined above

  // Handle opening school onboarding
  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  // Handle closing school onboarding
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  // Handle completion of school onboarding
  const handleOnboardingComplete = (newEssays) => {
    setEssays(newEssays);
    setShowOnboarding(false);
    showToast("Essay configurations created successfully!", "success");
  };

  return (
    <UserLayout>
      <div className="school-essay-list-container">
        {/* Command Center Header */}
        {school && (
          <div className="school-command-center">
            {/* School Hero Section */}
            <div className="school-hero">
              {/* Navigation Arrow */}
              <button 
                className="school-nav-back"
                onClick={handleBackToSchools}
                aria-label="Back to My Schools"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="school-identity">
                <div className="school-logo-command">
                  <span className="school-logo-text-command">{generateInitials(school.name)}</span>
                </div>
                <div className="school-info-command">
                  <div className="school-name-row">
                    <h1 className="school-name-command">{school.name}</h1>
                    {school.priority && (
                      <div className={`school-priority-badge-command priority-${school.priority.toLowerCase()}`}>
                        {school.priority}
                      </div>
                    )}
                  </div>
                  <div className="school-meta-command">
                    {school.location && (
                      <span className="school-location-command">{school.location}</span>
                    )}
                    <a 
                      href={school.officialURL || `https://apply.${school.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 20)}.edu`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="school-portal-link"
                    >
                      <Globe size={14} />
                      {(school.officialURL || `apply.${school.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 20)}.edu`).replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              </div>
              <div className="school-trial-banner-command">
                Free Trial: 1 essay available
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="school-dashboard-cards">
              {/* Deadline Card */}
              <div className="dashboard-card deadline-card">
                <div className="card-header">
                  <Calendar className="card-icon" size={18} />
                  {(() => {
                    const deadline = getSchoolDeadline(schoolId);
                    if (deadline.status === 'defined') {
                      return <span className="deadline-date-header">{deadline.formatted}</span>;
                    }
                    return <span className="deadline-date-header undefined">Not defined</span>;
                  })()}
                  <span className="card-label">Deadline</span>
                </div>
                <div className="card-content">
                  {(() => {
                    const deadline = getSchoolDeadline(schoolId);
                    if (deadline.status === 'defined') {
                      // Use personalized message 90% of the time in this focused view for warmth
                      const usePersonalized = Math.random() < 0.9;
                      
                      if (usePersonalized) {
                        const personalizedMsg = getPersonalizedDeadlineMessage(deadline.daysRemaining);
                        return (
                          <div className={`deadline-status-badge urgency-${deadline.urgency} personalized`}>
                            <div className="deadline-main-text">{personalizedMsg.text}</div>
                            <div className="deadline-support-text">{personalizedMsg.support}</div>
                          </div>
                        );
                      } else {
                        return (
                          <div className={`deadline-status-badge urgency-${deadline.urgency}`}>
                            {getSimpleDeadlineMessage(deadline.daysRemaining)}
                            {deadline.urgency === 'urgent' && ' ⚠️'}
                            {deadline.urgency === 'overdue' && ' 🚨'}
                          </div>
                        );
                      }
                    }
                    return (
                      <div className="deadline-undefined">
                        <span className="deadline-action">Set deadline →</span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Progression Card */}
              <div className="dashboard-card progress-card">
                <div className="card-header">
                  <Percent className="card-icon" size={18} />
                  {(() => {
                    const progress = calculateEssayProgress();
                    return <span className="progress-percentage-header">{progress.percentage}</span>;
                  })()}
                  <span className="card-label">Progression</span>
                </div>
                <div className="card-content">
                  {(() => {
                    const progress = calculateEssayProgress();
                    return (
                      <>
                        <div className="progress-stats">
                          <span className="progress-numbers">{progress.completed}/{progress.total}</span>
                          <span className="progress-label">Complete</span>
                        </div>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar-fill"
                            style={{ width: `${progress.percentage}%` }}
                          ></div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>


            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="school-essay-list-content">
          {essays.length === 0 && !isLoading ? (
            <div className="school-essay-list-empty-state">
              <div className="school-essay-list-empty-icon">
                <FileText size={72} />
              </div>
              <div className="school-essay-list-empty-content">
                <h3>Ready to configure your essays?</h3>
                <p>Set up your essay requirements for {school?.name} and start generating compelling content</p>
                <button 
                  className="school-essay-list-start-button"
                  onClick={handleStartOnboarding}
                >
                  Start Now
                </button>
              </div>
            </div>
          ) : (
            <TableEssays
              essays={essays}
              onGenerateEssay={handleGenerateEssay}
              onEditEssay={handleEditEssay}
              onDeleteEssay={handleDeleteConfirm}
              onViewEssay={handleViewEssay}
              isLoading={isLoading}
              emptyMessage="This school doesn't have any essay configurations yet."
            />
          )}
        </div>
        
        {/* Edit Modal */}
        <EssayEditModal
          essay={editingEssay}
          school={school}
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedEssay}
        />
        
        {/* School Onboarding Modal */}
        <SchoolOnboarding
          school={school}
          isOpen={showOnboarding}
          onClose={handleCloseOnboarding}
          onComplete={handleOnboardingComplete}
        />
        
        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="school-essay-list-modal-overlay">
            <div className="school-essay-list-modal">
              <h3>Delete Essay Configuration</h3>
              <p>Are you sure you want to delete the essay configuration for "{showDeleteConfirm.subject}"? This cannot be undone.</p>
              <div className="school-essay-list-modal-buttons">
                <button 
                  className="school-essay-list-modal-cancel"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="school-essay-list-modal-delete"
                  onClick={handleDeleteEssay}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Toast notification */}
        {toast.show && (
          <div className={`school-essay-list-toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === "success" ? (
                <CheckCircle size={18} style={{ color: "#059669" }} />
              ) : (
                <Info size={18} style={{ color: toast.type === "error" ? "#DC2626" : "#3B82F6" }} />
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
    </UserLayout>
  );
};

export default SchoolEssayList;