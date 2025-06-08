import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, School, CheckCircle, X, BookmarkPlus, BookmarkMinus, Info, Award, TrendingUp, Filter, Eye, ExternalLink, ClipboardCheck, Book, LineChart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../../UI/Tabs';
import Table from '../../../../../UI/Table';
import medicalSchoolsData from '../../../../../../data/medicalSchools.json';
import './SchoolPicker.css';
import '../shared/shared.css';

const LOCAL_STORAGE_KEY = "mySavedSchools";

const SchoolPicker = ({
  updateFormData,
  onNext,
  onBack
}) => {
  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [activeTabsMap, setActiveTabsMap] = useState({});
  const [filter, setFilter] = useState('all');
  const [showHelp, setShowHelp] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // États pour les écoles sauvegardées
  const [savedSchools, setSavedSchools] = useState(() => {
    try {
      if (typeof localStorage === 'undefined') return [];
      const storedSchools = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedSchools ? JSON.parse(storedSchools) : [];
    } catch (e) {
      console.error("Failed to parse saved schools from localStorage", e);
      return [];
    }
  });

  // État pour les notifications toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // État pour le modal de priorité
  const [priorityModal, setPriorityModal] = useState({
    show: false,
    school: null,
  });

  const lastUpdateRef = useRef({ savedSchools: [] });
  const priorityModalRef = useRef(null);
  const schoolsPerPage = 10;

  // Toutes les écoles depuis le JSON
  const allSchools = useMemo(() => medicalSchoolsData || [], []);

  // Créer un Set des IDs d'écoles sauvegardées pour une recherche efficace
  const savedSchoolIds = useMemo(() => 
    new Set((savedSchools || []).map(school => school.id))
  , [savedSchools]);

  // Fonction pour formatter les valeurs
  const formatValue = (key, value) => {
    if (value == null || value === undefined) return 'N/A';

    switch (key) {
      case 'acceptanceRate':
      case 'inStateAcceptanceRate':
      case 'outOfStateAcceptanceRate':
      case 'percentReceivingAid':
        return typeof value === 'number' ? `${value.toFixed(1)}%` : 'N/A';
      case 'annualTuition':
      case 'inStateTuition':
      case 'outOfStateTuition':
      case 'avgDebtAtGraduation':
        return typeof value === 'number' ? `$${value.toLocaleString()}` : 'N/A';
      case 'avgGPA':
        return typeof value === 'number' ? value.toFixed(2) : 'N/A';
      default:
        return value;
    }
  };

  // Mettre à jour les données parentes avec debounce
  useEffect(() => {
    if (JSON.stringify(savedSchools) !== JSON.stringify(lastUpdateRef.current.savedSchools)) {
      const timer = setTimeout(() => {
        updateFormData({ 
          schoolList: savedSchools,
          savedSchoolIds: Array.from(savedSchoolIds)
        });
        lastUpdateRef.current.savedSchools = [...savedSchools];
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [savedSchools, savedSchoolIds, updateFormData]);

  // Gestion de l'état de saisie
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filter]);

  // Effet pour les toasts
  useEffect(() => {
    let toastTimer;
    if (toast.show) {
      toastTimer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [toast]);

  // Centrer le modal et verrouiller le scroll au montage
  useEffect(() => {
    if (priorityModal.show) {
      // Verrouiller le scroll du body
      document.body.style.overflow = 'hidden';
      
      // Centrer le modal avec un délai
      const timer = setTimeout(() => {
        centerModal();
      }, 50);

      return () => {
        // Restaurer le scroll du body
        document.body.style.overflow = '';
        clearTimeout(timer);
      };
    }
  }, [priorityModal.show]);

  // Afficher un toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Filtrage des écoles
  const filteredSchools = useMemo(() => {
    let schools = allSchools;

    // Appliquer le filtre de catégorie
    if (filter === 'top20') {
      schools = schools.filter(school => school.rank <= 20);
    } else if (filter === 'affordable') {
      schools = schools.filter(school => (
        school.annualTuition < 50000 || 
        (school.inStateTuition && school.inStateTuition < 40000)
      ));
    } else if (filter === 'highAcceptance') {
      schools = schools.filter(school => school.acceptanceRate > 5);
    } else if (filter === 'saved') {
      schools = schools.filter(school => savedSchoolIds.has(school.id));
    }

    // Appliquer le filtre de recherche
    if (searchQuery) {
      return schools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (school.location && school.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return schools;
  }, [allSchools, searchQuery, filter, savedSchoolIds]);

  // Fonction pour centrer le modal
  const centerModal = () => {
    if (!priorityModalRef.current) return;

    const modalElement = priorityModalRef.current;
    const modalRect = modalElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculer la position de scroll désirée pour centrer le modal
    const desiredScrollTop = window.scrollY + modalRect.top - (viewportHeight - modalRect.height) / 2;
    const finalScrollTop = Math.max(0, desiredScrollTop);

    // Effectuer le scroll de la fenêtre avec animation fluide
    window.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
  };

  // Créer un objet école propre (sans références circulaires)
  const createCleanSchoolObject = (school) => {
    const {
      id,
      name,
      location,
      rank,
      acceptanceRate,
      avgGPA,
      avgMCAT,
      annualTuition,
      inStateTuition,
      outOfStateTuition,
      classSize,
      officialURL,
      percentReceivingAid,
      financialAidHighlights,
      inStateAcceptanceRate,
      outOfStateAcceptanceRate,
      primaryDeadline,
      avgDebtAtGraduation,
      prerequisites,
      mcatRequired,
      secondaryFee,
      interviewFormat,
      curriculumType,
      programLength,
      researchOpportunities,
      clinicalSites
    } = school;

    return {
      id,
      name,
      location,
      rank,
      acceptanceRate,
      avgGPA,
      avgMCAT,
      annualTuition,
      inStateTuition,
      outOfStateTuition,
      classSize,
      officialURL,
      percentReceivingAid,
      financialAidHighlights,
      inStateAcceptanceRate,
      outOfStateAcceptanceRate,
      primaryDeadline,
      avgDebtAtGraduation,
      prerequisites,
      mcatRequired,
      secondaryFee,
      interviewFormat,
      curriculumType,
      programLength,
      researchOpportunities,
      clinicalSites,
      notes: "",
      priority: "MEDIUM", // Priorité par défaut
      dateAdded: new Date().toISOString()
    };
  };

  // Ouvrir le modal de priorité
  const handleSaveSchool = (school) => {
    if (!school || !school.id || savedSchoolIds.has(school.id)) return;
    
    const cleanSchool = createCleanSchoolObject(school);
    setPriorityModal({
      show: true,
      school: cleanSchool,
    });
  };

  // Sauvegarder l'école avec la priorité sélectionnée
  const handleSaveSchoolWithPriority = (priority) => {
    if (!priorityModal.school) return;

    const schoolWithPriority = {
      ...priorityModal.school,
      priority: priority
    };

    const updatedSchools = [...savedSchools, schoolWithPriority];
    setSavedSchools(updatedSchools);
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSchools));
      }
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
    
    // Fermer le modal
    setPriorityModal({ show: false, school: null });
    
    showToast(`${schoolWithPriority.name} ajoutée à votre liste (${priority})`, "success");
  };

  // Fermer le modal de priorité
  const handleClosePriorityModal = () => {
    setPriorityModal({ show: false, school: null });
  };
  
  // Gérer la suppression d'une école
  const handleUnsaveSchool = (schoolId) => {
    if (!schoolId || !savedSchoolIds.has(schoolId)) return;
    
    const schoolToRemove = savedSchools.find(school => school.id === schoolId);
    const schoolName = schoolToRemove ? schoolToRemove.name : "École";
    
    const updatedSchools = savedSchools.filter(school => school.id !== schoolId);
    
    setSavedSchools(updatedSchools);
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSchools));
      }
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
    
    showToast(`${schoolName} retirée de votre liste`, "error");
  };

  // Vérifier si les données sont valides pour continuer
  const isValidToSubmit = () => {
    return savedSchools.length > 0;
  };

  // Store active tabs for each school separately
  const getActiveTabForSchool = (schoolId) => {
    return activeTabsMap[schoolId] || 'general';
  };

  const handleTabChange = (schoolId, tabValue) => {
    setActiveTabsMap(prev => ({
      ...prev,
      [schoolId]: tabValue
    }));
  };

  // Définitions des colonnes pour la table
  const columns = useMemo(() => [
    {
      header: 'Rank',
      accessor: 'rank',
      render: (row) => {
        if (!row) return null;
        const rankClass = row.rank <= 10 ? 'rank-badge-top' : (row.rank <= 20 ? 'rank-badge-excellent' : '');
        return <span className={`school-rank ${rankClass}`}>{row.rank}</span>;
      },
      sortable: true,
      width: '10%'
    },
    {
      header: 'Medical School',
      accessor: 'name',
      render: (row) => {
        if (!row) return null;
        return <span className="school-name">{row.name}</span>;
      },
      sortable: true,
      width: '25%'
    },
    {
      header: 'Location',
      accessor: 'location',
      sortable: true,
      width: '15%'
    },
    {
      header: 'Acceptance Rate',
      accessor: 'acceptanceRate',
      render: (row) => {
        if (!row) return null;
        return formatValue('acceptanceRate', row.acceptanceRate);
      },
      sortable: true,
      width: '15%'
    },
    {
      header: 'Avg GPA',
      accessor: 'avgGPA',
      render: (row) => {
        if (!row) return null;
        return formatValue('avgGPA', row.avgGPA);
      },
      sortable: true,
      width: '15%'
    },
    {
      header: 'Avg MCAT',
      accessor: 'avgMCAT',
      sortable: true,
      width: '10%'
    },
    {
      header: 'Tuition (USD)',
      accessor: 'annualTuition',
      render: (row) => {
        if (!row) return null;
        return row.annualTuition === 0 ?
          <span className="badge badge-success">Full Scholarship</span> : 
          formatValue('annualTuition', row.annualTuition);
      },
      sortable: true,
      width: '15%'
    },
    {
      header: 'Actions',
      accessor: 'actions',
      sortable: false,
      width: '100px',
      render: (row) => {
        if (!row || !row.id) return null;
        
        return (
          <div className="actions-cell" onClick={(e) => e.stopPropagation()}>
            <button 
              className={savedSchoolIds.has(row.id) ? 'action-button unsave-button' : 'action-button save-button'}
              onClick={(e) => {
                e.stopPropagation();
                savedSchoolIds.has(row.id) ? handleUnsaveSchool(row.id) : handleSaveSchool(row);
              }}
            >
              {savedSchoolIds.has(row.id) ? (
                <>
                  <span className="action-icon"><BookmarkMinus size={16} /></span>
                  Unsave
                </>
              ) : (
                <>
                  <span className="action-icon"><BookmarkPlus size={16} /></span>
                  Save
                </>
              )}
            </button>
          </div>
        );
      }
    }
  ], [savedSchoolIds, handleSaveSchool, handleUnsaveSchool]);

  // Fonction pour générer le contenu détaillé d'une ligne étendue
  const renderSchoolDetails = useCallback((school) => {
    if (!school || !school.id) return null;
    
    const activeTab = getActiveTabForSchool(school.id);

    return (
      <div className="school-details animate-fade-in">
        <Tabs
          value={activeTab}
          onValueChange={(value) => handleTabChange(school.id, value)}
          animated={true}
        >
          <TabsList>
            <TabsTrigger value="general">
              <span className="tabs-trigger-icon">
                <Info size={16} />
              </span>
              General Information
            </TabsTrigger>
            <TabsTrigger value="admissions">
              <span className="tabs-trigger-icon">
                <ClipboardCheck size={16} />
              </span>
              Admissions
            </TabsTrigger>
            <TabsTrigger value="curriculum">
              <span className="tabs-trigger-icon">
                <Book size={16} />
              </span>
              Curriculum
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="details-grid">
              <div className="details-section delay-100">
                <h3 className="section-title">School Information</h3>
                
                <div className="detail-card">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Official Website</span>
                      {school.officialURL ? (
                        <a
                          href={school.officialURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="website-link detail-value"
                        >
                          {school.officialURL} 
                          <ExternalLink size={14} className="external-link-icon" />
                        </a>
                      ) : (
                        <span className="detail-value">N/A</span>
                      )}
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Class Size:</span>
                      <span className="detail-value">{school.classSize || 'N/A'} students</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">% Receiving Aid:</span>
                      <span className="detail-value">{formatValue('percentReceivingAid', school.percentReceivingAid)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-full">
                    <span className="detail-label">Financial Aid:</span>
                    <span className="detail-value">{school.financialAidHighlights || 'N/A'}</span>
                  </div>
                </div>

                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon">
                      <Award size={18} /> 
                    </div>
                    <div className="metric-label">Rank</div>
                    <div className="metric-value">{school.rank || 'N/A'}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">
                      <LineChart size={18} />
                    </div>
                    <div className="metric-label">Avg GPA</div>
                    <div className="metric-value">{formatValue('avgGPA', school.avgGPA)}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">
                      <TrendingUp size={18} />
                    </div>
                    <div className="metric-label">Avg MCAT</div>
                    <div className="metric-value">{school.avgMCAT || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admissions">
            <div className="details-section delay-100">
              <div className="detail-cards-row">
                <div className="detail-card flex-1">
                  <h3 className="section-title">Acceptance Rates</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Overall</span>
                      <span className="detail-value">{formatValue('acceptanceRate', school.acceptanceRate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">In-State</span>
                      <span className="detail-value">{formatValue('inStateAcceptanceRate', school.inStateAcceptanceRate) || formatValue('acceptanceRate', school.acceptanceRate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Out-of-State</span>
                      <span className="detail-value">{formatValue('outOfStateAcceptanceRate', school.outOfStateAcceptanceRate) || formatValue('acceptanceRate', school.acceptanceRate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Primary Deadline</span>
                      <span className="detail-value">{school.primaryDeadline || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-card flex-1">
                  <h3 className="section-title">Tuition Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Annual</span>
                      <span className="detail-value">
                        {school.annualTuition === 0 ? 
                          <span className="badge badge-success">Full Scholarship</span> : 
                          formatValue('annualTuition', school.annualTuition)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">In-State</span>
                      <span className="detail-value">
                        {school.inStateTuition === 0 ? 
                          <span className="badge badge-success">Full Scholarship</span> : 
                          (formatValue('inStateTuition', school.inStateTuition) || formatValue('annualTuition', school.annualTuition))}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Out-of-State</span>
                      <span className="detail-value">
                        {school.outOfStateTuition === 0 ? 
                          <span className="badge badge-success">Full Scholarship</span> : 
                          (formatValue('outOfStateTuition', school.outOfStateTuition) || formatValue('annualTuition', school.annualTuition))}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Avg Debt at Graduation</span>
                      <span className="detail-value">{formatValue('avgDebtAtGraduation', school.avgDebtAtGraduation)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-card mt-4">
                <h3 className="section-title">Application Requirements</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Prerequisites:</span>
                    <span className="detail-value">{school.prerequisites || 'Standard pre-med requirements'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">MCAT Required:</span>
                    <span className="detail-value">{school.mcatRequired ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Secondary Application Fee:</span>
                    <span className="detail-value">{school.secondaryFee ? `$${school.secondaryFee}` : 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Interview Format:</span>
                    <span className="detail-value">{school.interviewFormat || 'Traditional'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum">
            <div className="details-section delay-100">
              <div className="detail-card">
                <h3 className="section-title">Curriculum Overview</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Curriculum Type:</span>
                    <span className="detail-value">{school.curriculumType || 'Traditional'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Program Length:</span>
                    <span className="detail-value">{school.programLength || '4 years'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Research Opportunities:</span>
                    <span className="detail-value">{school.researchOpportunities || 'Available'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Clinical Sites:</span>
                    <span className="detail-value">{school.clinicalSites || 'Multiple affiliated hospitals'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }, [getActiveTabForSchool, handleTabChange, formatValue]);

  // Fonction personnalisée d'expansion
  const customExpandFunction = (rowId) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  // Données préparées pour la table
  const dataForTable = useMemo(() => {
    return filteredSchools.map(school => ({
      ...school,
      expandedContent: renderSchoolDetails(school)
    }));
  }, [filteredSchools, renderSchoolDetails]);

  return (
    <div className="school-picker">
      <div className="school-picker-container">
        {/* Header */}
        <div className="school-picker-header">
          <div className="header-main-row">
            <div className="header-text-group">
              <div className="header-title">
                Medical{" "}
                <span className="header-title-highlight">School List</span>
              </div>
              <p className="header-subtitle">
                Select the medical schools you're applying to. <br/>
                These schools will be saved to your profile for essay generation.
              </p>
            </div>
            
            <button 
              className="help-toggle"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Toggle help information"
            >
              <Info className="help-toggle-icon" />
              <span>Selection Tips</span>
            </button>
          </div>
          
          {/* Panel d'aide */}
          {showHelp && (
            <div className="help-panel">
              <div className="help-content">
                <h3 className="help-title">School Selection Guidelines</h3>
                <div className="help-tips">
                  <div className="tip">
                    <CheckCircle className="tip-icon" />
                    <span>Select at least 1 school to continue</span>
                  </div>
                  <div className="tip">
                    <CheckCircle className="tip-icon" />
                    <span>Consider a mix of reach, target, and safety schools</span>
                  </div>
                  <div className="tip">
                    <CheckCircle className="tip-icon" />
                    <span>You can add or remove schools later</span>
                  </div>
                  <div className="tip">
                    <CheckCircle className="tip-icon" />
                    <span>Each school will have unique essay requirements</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Corps principal */}
        <div className="school-picker-body">
          {/* Zone de recherche et filtres */}
          <div className="school-picker-filters">
            <div className="search-container">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by school name or location..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input"
                />
                <span className="search-icon">
                  <Search size={18} />
                </span>
              </div>
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <Eye size={16} />
                <span>All Schools</span>
              </button>
              <button
                className={`filter-button ${filter === 'saved' ? 'active' : ''}`}
                onClick={() => setFilter('saved')}
              >
                <School size={16} />
                <span>Selected ({savedSchools.length})</span>
              </button>
              <button
                className={`filter-button ${filter === 'top20' ? 'active' : ''}`}
                onClick={() => setFilter('top20')}
              >
                <Award size={16} />
                <span>Top 20</span>
              </button>
              <button
                className={`filter-button ${filter === 'highAcceptance' ? 'active' : ''}`}
                onClick={() => setFilter('highAcceptance')}
              >
                <TrendingUp size={16} />
                <span>Higher Acceptance</span>
              </button>
            </div>
          </div>

          {/* Table des écoles */}
          <div className="schools-table-section">
            <Table
              columns={columns}
              data={dataForTable || []}
              expandable={true}
              rowsPerPage={schoolsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              sortable={true}
              emptyMessage="No medical schools match your search"
              expandedRows={expandedRows}
              onRowExpand={customExpandFunction}
              tableClassName="custom-table"
              rowClickable={true}
            />

            <p className="results-summary">
              {filteredSchools.length > 0 ? (
                <span>Showing {Math.min(currentPage * schoolsPerPage, filteredSchools.length)} of {filteredSchools.length} schools</span>
              ) : (
                searchQuery && <span>No schools found matching "{searchQuery}"</span>
              )}
            </p>
          </div>
        </div>

        {/* Navigation simplifiée */}
        <div className="step-navigation">
          <button
            type="button"
            className="nav-btn nav-btn-secondary"
            onClick={onBack}
            aria-label="Return to Other Impactful Experiences"
          >
            Back to Other Experiences
          </button>

          {/* Indicateur de sauvegarde uniquement */}
          {isTyping && (
            <div className="auto-save-indicator">
              <div className="typing-indicator">
                <span>Auto-saving...</span>
                <div className="typing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            className={`nav-btn nav-btn-primary ${!isValidToSubmit() ? 'disabled' : ''}`}
            onClick={() => {
              // Appeler onNext qui va rediriger vers MySchoolTab
              onNext();
            }}
            disabled={!isValidToSubmit()}
            aria-label="Complete AMCAS Flow"
          >
            Finish & View My Schools
          </button>
        </div>
      </div>

      {/* Modal de sélection de priorité */}
      {priorityModal.show && (
        <div className="priority-modal-overlay" onClick={handleClosePriorityModal}>
          <div className="priority-modal" ref={priorityModalRef} onClick={(e) => e.stopPropagation()}>
            <div className="priority-modal-header">
              <h3 className="priority-modal-title">Select Priority</h3>
              <p className="priority-modal-subtitle">
                Choose the priority level for <strong>{priorityModal.school?.name}</strong>
              </p>
            </div>
            
            <div className="priority-options">
              <button
                className="priority-option priority-high"
                onClick={() => handleSaveSchoolWithPriority('HIGH')}
              >
                <span className="priority-dot"></span>
                <div className="priority-text">
                  <span className="priority-label">HIGH</span>
                  <span className="priority-description">Top choice, dream school</span>
                </div>
              </button>
              
              <button
                className="priority-option priority-medium"
                onClick={() => handleSaveSchoolWithPriority('MEDIUM')}
              >
                <span className="priority-dot"></span>
                <div className="priority-text">
                  <span className="priority-label">MEDIUM</span>
                  <span className="priority-description">Target school, good match</span>
                </div>
              </button>
              
              <button
                className="priority-option priority-low"
                onClick={() => handleSaveSchoolWithPriority('LOW')}
              >
                <span className="priority-dot"></span>
                <div className="priority-text">
                  <span className="priority-label">LOW</span>
                  <span className="priority-description">Safety school, backup option</span>
                </div>
              </button>
            </div>
            
            <div className="priority-modal-footer">
              <button
                className="priority-cancel-btn"
                onClick={handleClosePriorityModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast.show && (
        <div className={`school-picker-toast toast-${toast.type}`}>
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

export default SchoolPicker; 