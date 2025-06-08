import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  Search,
  Filter,
  ChevronDown,
  Eye,
  CheckCircle,
  Info,
  X,
  School
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import TableAllEssays from '../../components/UI/TableAllEssays';
import EssayEditModal from '../../components/user/profile/EssayEditModal';
import './GetAllEssays.css';

/**
 * GetAllEssays - Overview of all essays from all schools
 * Modern and clean interface with filtering and sorting features
 */
const GetAllEssays = () => {
  const navigate = useNavigate();

  // États principaux
  const [allEssays, setAllEssays] = useState([]);
  const [filteredEssays, setFilteredEssays] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // États pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // États pour les modales et notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingEssay, setEditingEssay] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fonction pour générer les initiales d'une école
  const generateSchoolInitials = (schoolName) => {
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

  // Charger toutes les données
  useEffect(() => {
    const loadAllEssaysData = async () => {
      setIsLoading(true);
      try {
        // Get saved schools
        const savedSchools = JSON.parse(localStorage.getItem("mySavedSchools") || '[]');
        setSchools(savedSchools);
        
        // Get all essays from all schools
        const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
        const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
        
        const aggregatedEssays = [];
        
        // For each school, get its essays
        savedSchools.forEach(school => {
          const schoolEssayList = schoolEssays[school.id] || [];
          const schoolEssayHistory = essayHistory[school.id] || {};
          
          schoolEssayList.forEach(essay => {
            const essayRecord = schoolEssayHistory[essay.id];
            const isGenerated = !!(essayRecord && 
                                 essayRecord.versions && 
                                 essayRecord.versions.length > 0);
            
            aggregatedEssays.push({
              ...essay,
              schoolId: school.id,
              schoolName: school.name,
              schoolLocation: school.location,
              schoolInitials: generateSchoolInitials(school.name),
              isGenerated: isGenerated,
              generatedDate: isGenerated ? essayRecord?.date : null
            });
          });
        });
        
        setAllEssays(aggregatedEssays);
        setFilteredEssays(aggregatedEssays);
        
      } catch (error) {
        console.error("Error loading all essays data:", error);
        showToast("Failed to load essay data", "error");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAllEssaysData();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...allEssays];
    
    // Filtrage par recherche textuelle
    if (searchTerm) {
      filtered = filtered.filter(essay => 
        essay.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        essay.context?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        essay.schoolName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrage par école
    if (selectedSchool !== 'all') {
      filtered = filtered.filter(essay => essay.schoolId.toString() === selectedSchool);
    }
    
    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(essay => {
        if (statusFilter === 'generated') return essay.isGenerated;
        if (statusFilter === 'pending') return !essay.isGenerated;
        return true;
      });
    }
    
    setFilteredEssays(filtered);
  }, [allEssays, searchTerm, selectedSchool, statusFilter]);

  // Naviguer vers un essay spécifique
  const handleViewEssay = (essay) => {
    navigate(`/schools/${essay.schoolId}/essays/${essay.id}`);
  };

  // Générer un essay
  const handleGenerateEssay = (essay) => {
    try {
      const school = schools.find(s => s.id === essay.schoolId);
      if (!school) {
        showToast("School not found", "error");
        return;
      }

      const completeEssay = {
        ...essay,
        subject: essay.subject || "Untitled Essay",
        limitType: essay.limitType || "words",
        wordLimit: essay.limitType === "words" ? (essay.wordLimit || 500) : 500,
        characterLimit: essay.limitType === "characters" ? (essay.characterLimit || 2500) : 2500,
        tone: essay.tone || "professional",
        style: essay.style || "narrative",
        context: essay.context || "",
        category: essay.category || "other"
      };
      
      localStorage.setItem("selectedSchoolForEssay", JSON.stringify(school));
      localStorage.setItem("selectedEssayConfig", JSON.stringify(completeEssay));
      
      navigate('/essay-generator');
    } catch (error) {
      console.error("Error preparing essay generation:", error);
      showToast("Failed to prepare essay generation", "error");
    }
  };

  // Éditer un essay
  const handleEditEssay = (essay) => {
    setEditingEssay(essay);
    setShowEditModal(true);
  };

  // Sauvegarder l'essay édité
  const handleSaveEditedEssay = (editedEssay) => {
    try {
      const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
      const currentEssays = schoolEssays[editedEssay.schoolId] || [];
      
      const updatedEssays = currentEssays.map(essay => 
        essay.id === editedEssay.id ? { ...editedEssay } : essay
      );
      
      schoolEssays[editedEssay.schoolId] = updatedEssays;
      localStorage.setItem('schoolEssays', JSON.stringify(schoolEssays));
      
      // Mettre à jour l'état local
      setAllEssays(prev => prev.map(essay => 
        essay.id === editedEssay.id && essay.schoolId === editedEssay.schoolId ? { 
          ...editedEssay,
          schoolId: essay.schoolId,
          schoolName: essay.schoolName,
          schoolLocation: essay.schoolLocation,
          schoolInitials: essay.schoolInitials,
          isGenerated: essay.isGenerated,
          generatedDate: essay.generatedDate
        } : essay
      ));
      
      showToast("Essay configuration updated successfully", "success");
    } catch (error) {
      console.error("Error updating essay:", error);
      showToast("Failed to update essay configuration", "error");
    }
    
    setShowEditModal(false);
    setEditingEssay(null);
  };

  // Fermer le modal d'édition
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingEssay(null);
  };

  // Confirmation de suppression
  const handleDeleteConfirm = (essay) => {
    setShowDeleteConfirm(essay);
  };

  // Supprimer un essay
  const handleDeleteEssay = () => {
    if (!showDeleteConfirm) return;
    
    try {
      const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
      const currentEssays = schoolEssays[showDeleteConfirm.schoolId] || [];
      
      const updatedEssays = currentEssays.filter(e => e.id !== showDeleteConfirm.id);
      
      schoolEssays[showDeleteConfirm.schoolId] = updatedEssays;
      localStorage.setItem('schoolEssays', JSON.stringify(schoolEssays));
      
      // Mettre à jour l'état local
      setAllEssays(prev => prev.filter(e => 
        !(e.id === showDeleteConfirm.id && e.schoolId === showDeleteConfirm.schoolId)
      ));
      
      showToast("Essay configuration deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting essay:", error);
      showToast("Failed to delete essay configuration", "error");
    }
    
    setShowDeleteConfirm(null);
  };

  // Afficher une notification toast
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Calculer les statistiques
  const stats = {
    total: allEssays.length,
    generated: allEssays.filter(e => e.isGenerated).length,
    pending: allEssays.filter(e => !e.isGenerated).length,
    schools: schools.length
  };

  return (
    <UserLayout>
      <div className="get-all-essays-container">
        {/* Header avec titre et statistiques */}
        <div className="get-all-essays-header">
          <div className="get-all-essays-header-left">
            <h1 className="get-all-essays-title">
              My <span className="get-all-essays-title-highlight">Secondary Essays</span>
            </h1>
            <div className="get-all-essays-free-trial-banner">
              Free Trial: 1 essay available
            </div>
            <div className="get-all-essays-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total Essays</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.generated}</span>
                <span className="stat-label">Generated</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.schools}</span>
                <span className="stat-label">Schools</span>
              </div>
            </div>
          </div>
          
          <div className="get-all-essays-header-right">
            {/* Espace pour d'éventuels boutons futurs */}
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="get-all-essays-filters">
          <div className="search-section">
            <div className="search-input-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search essays by topic, context, or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filters-section">
            <button
              className={`filters-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
              <ChevronDown size={16} className={`chevron ${showFilters ? 'rotated' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="filters-dropdown">
                <div className="filter-group">
                  <label>School:</label>
                  <select 
                    value={selectedSchool} 
                    onChange={(e) => setSelectedSchool(e.target.value)}
                  >
                    <option value="all">All Schools</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Status:</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="generated">Generated</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="get-all-essays-content">
          <TableAllEssays
            essays={filteredEssays}
            onGenerateEssay={handleGenerateEssay}
            onEditEssay={handleEditEssay}
            onDeleteEssay={handleDeleteConfirm}
            onViewEssay={handleViewEssay}
            isLoading={isLoading}
            emptyMessage={
              allEssays.length === 0 
                ? "No essays configured. Start by adding schools to your list."
                : "No essays match your search criteria."
            }
          />
        </div>

        {/* Modal d'édition */}
        <EssayEditModal
          essay={editingEssay}
          school={editingEssay ? schools.find(s => s.id === editingEssay.schoolId) : null}
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedEssay}
        />

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="get-all-essays-modal-overlay">
            <div className="get-all-essays-modal">
              <h3>Delete Essay Configuration</h3>
              <p>
                Are you sure you want to delete the essay configuration "{showDeleteConfirm.subject}" 
                for {showDeleteConfirm.schoolName}? This action cannot be undone.
              </p>
              <div className="get-all-essays-modal-buttons">
                <button 
                  className="get-all-essays-modal-cancel"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="get-all-essays-modal-delete"
                  onClick={handleDeleteEssay}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification toast */}
        {toast.show && (
          <div className={`get-all-essays-toast toast-${toast.type}`}>
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

export default GetAllEssays; 