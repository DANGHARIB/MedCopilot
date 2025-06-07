import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Eye,
  CheckCircle,
  Info,
  X
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import TableEssays from '../../components/UI/TableEssays';
import EssayEditModal from '../../components/user/profile/EssayEditModal';
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
        context: essay.context || ""
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
  
  // Show toast notification
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <UserLayout>
      <div className="school-essay-list-container">
        {/* Header */}
        <div className="school-essay-list-header">
          <div className="school-essay-list-header-left">
            <button 
              className="school-essay-list-back-button"
              onClick={handleBackToSchools}
              aria-label="Back to schools"
            >
              <ChevronLeft size={20} />
              <span>Back to Schools</span>
            </button>
            
            {school && (
              <div className="school-essay-list-title">
                <h2 className="school-essay-list-title-text">
                  {school.name} <span className="school-essay-list-title-highlight">Essay Configurations</span>
                </h2>
                <div className="school-essay-list-free-trial-banner">
                  Free Trial: 1 essay available
                </div>
              </div>
            )}
          </div>
          
          <div className="school-essay-list-header-buttons">
            <button
              className="school-essay-list-view-button"
              onClick={handleBackToSchools}
              type="button"
            >
              <Eye size={16} aria-hidden="true" /> View All Schools
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="school-essay-list-content">
          <TableEssays
            essays={essays}
            onGenerateEssay={handleGenerateEssay}
            onEditEssay={handleEditEssay}
            onDeleteEssay={handleDeleteConfirm}
            onViewEssay={handleViewEssay}
            isLoading={isLoading}
            emptyMessage="This school doesn't have any essay configurations yet."
          />
        </div>
        
        {/* Edit Modal */}
        <EssayEditModal
          essay={editingEssay}
          school={school}
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedEssay}
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