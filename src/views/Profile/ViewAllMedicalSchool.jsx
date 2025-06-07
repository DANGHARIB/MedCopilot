import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/UI/Tabs';
import Table from '../../components/UI/Table';
import Breadcrumbs from '../../components/UI/Breadcrumbs';
import {
  Search, Award, TrendingUp, Info, ClipboardCheck, Book,
  ExternalLink, CheckCircle, XCircle, School, LineChart, BookmarkPlus, BookmarkMinus, X
} from 'lucide-react';
import medicalSchoolsData from '../../data/medicalSchools.json';
import './ViewAllMedicalSchool.css';
import SchoolOnboarding from '../../components/user/profile/SchoolOnboarding';

const LOCAL_STORAGE_KEY = "mySavedSchools";

/**
 * ViewAllMedicalSchool - A specialized component for displaying all medical schools
 * with the ability to save them to the user's personal list of saved schools.
 */
const ViewAllMedicalSchool = () => {
  // Formatting function
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
        return typeof value === 'number' ? `${value.toLocaleString()}` : 'N/A';
      case 'avgGPA':
        return typeof value === 'number' ? value.toFixed(2) : 'N/A';
      default:
        return value;
    }
  };
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [activeTabsMap, setActiveTabsMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
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
  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  // State for SchoolOnboarding modal
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);
  
  const schoolsPerPage = 10;
  const navigate = useNavigate();
  
  // Create a Set of saved school IDs for efficient lookup
  const savedSchoolIds = useMemo(() => 
    new Set((savedSchools || []).map(school => school.id))
  , [savedSchools]);
  
  // All schools from JSON data
  const allSchools = useMemo(() => medicalSchoolsData || [], []);

  // Toast effect
  useEffect(() => {
    let toastTimer;
    if (toast.show) {
      toastTimer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [toast]);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Functions to handle saving and removing schools
  const handleSaveSchool = (school) => {
    if (!school || !school.id || savedSchoolIds.has(school.id)) return;
    
    const schoolWithNotes = { ...school, notes: "" };
    const updatedSchools = [...savedSchools, schoolWithNotes];
    
    setSavedSchools(updatedSchools);
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSchools));
      }
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
    
    showToast(`${school.name} ajoutée à vos écoles sauvegardées`, "success");
    
    // Déclencher le flux d'onboarding pour cette école
    setCurrentSchool(school);
    setShowOnboarding(true);
  };
  
  const handleUnsaveSchool = (schoolId) => {
    if (!schoolId || !savedSchoolIds.has(schoolId)) return;
    
    // Find school name before removing
    const schoolToRemove = savedSchools.find(school => school.id === schoolId);
    const schoolName = schoolToRemove ? schoolToRemove.name : "School";
    
    const updatedSchools = savedSchools.filter(school => school.id !== schoolId);
    
    setSavedSchools(updatedSchools);
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSchools));
      }
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
    
    showToast(`${schoolName} retirée de vos écoles sauvegardées`, "error");
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

  // Filtering based on search and additional filter
  const filteredSchools = useMemo(() => {
    let schools = allSchools;

    // Apply category filter
    if (filter === 'top20') {
      schools = schools.filter(school => school.rank <= 20);
    } else if (filter === 'affordable') {
      schools = schools.filter(school => (
        school.annualTuition < 50000 || 
        (school.inStateTuition && school.inStateTuition < 40000)
      ));
    } else if (filter === 'highAcceptance') {
      schools = schools.filter(school => school.acceptanceRate > 5);
    }

    // Apply search filter
    if (searchQuery) {
      return schools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (school.location && school.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return schools;
  }, [allSchools, searchQuery, filter]);

  // Column definitions with the Actions column
  const columns = useMemo(() => [
    {
      header: 'Rank',
      accessor: 'rank',
      render: (row) => {
        if (!row) return null;
        const rankClass = row.rank <= 10 ? 'viewall-rank-badge-top' : (row.rank <= 20 ? 'viewall-rank-badge-excellent' : '');
        return <span className={`viewall-school-rank ${rankClass}`}>{row.rank}</span>;
      },
      sortable: true,
      width: '10%'
    },
    {
      header: 'Medical School',
      accessor: 'name',
      render: (row) => {
        if (!row) return null;
        return <span className="viewall-school-name">{row.name}</span>;
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
          <span className="viewall-badge viewall-badge-success">Full Scholarship</span> : 
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
          <div className="viewall-actions-cell" onClick={(e) => e.stopPropagation()}>
            <button 
              className={savedSchoolIds.has(row.id) ? 'viewall-action-button viewall-unsave-button' : 'viewall-action-button viewall-save-button'}
              onClick={(e) => {
                e.stopPropagation(); // Prevent row expansion
                savedSchoolIds.has(row.id) ? handleUnsaveSchool(row.id) : handleSaveSchool(row);
              }}
            >
              {savedSchoolIds.has(row.id) ? (
                <>
                  <span className="viewall-action-icon"><BookmarkMinus size={16} /></span>
                  Unsave
                </>
              ) : (
                <>
                  <span className="viewall-action-icon"><BookmarkPlus size={16} /></span>
                  Save
                </>
              )}
            </button>
          </div>
        );
      }
    }
  ], [savedSchoolIds]);

  // Function to generate detailed content for an expanded row
  const renderSchoolDetails = useCallback((school) => {
    if (!school || !school.id) return null;
    
    const activeTab = getActiveTabForSchool(school.id);

    return (
      <div className="viewall-school-details viewall-animate-fade-in">
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
            <div className="viewall-details-grid">
              <div className="viewall-details-section viewall-delay-100">
                <h3 className="viewall-section-title">School Information</h3>
                
                <div className="viewall-detail-card">
                  <div className="viewall-detail-grid">
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">Official Website</span>
                      {school.officialURL ? (
                        <a
                          href={school.officialURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="viewall-website-link viewall-detail-value"
                        >
                          {school.officialURL} 
                          <ExternalLink size={14} className="viewall-external-link-icon" />
                        </a>
                      ) : (
                        <span className="viewall-detail-value">N/A</span>
                      )}
                    </div>
                    
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">Class Size:</span>
                      <span className="viewall-detail-value">{school.classSize || 'N/A'} students</span>
                    </div>
                    
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">% Receiving Aid:</span>
                      <span className="viewall-detail-value">{formatValue('percentReceivingAid', school.percentReceivingAid)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="viewall-detail-card">
                  <div className="viewall-detail-full">
                    <span className="viewall-detail-label">Financial Aid:</span>
                    <span className="viewall-detail-value">{school.financialAidHighlights || 'N/A'}</span>
                  </div>
                </div>

                <div className="viewall-metrics-grid">
                  <div className="viewall-metric-card">
                    <div className="viewall-metric-icon">
                      <Award size={18} /> 
                    </div>
                    <div className="viewall-metric-label">Rank</div>
                    <div className="viewall-metric-value">{school.rank || 'N/A'}</div>
                  </div>
                  <div className="viewall-metric-card">
                    <div className="viewall-metric-icon">
                      <LineChart size={18} />
                    </div>
                    <div className="viewall-metric-label">Avg GPA</div>
                    <div className="viewall-metric-value">{formatValue('avgGPA', school.avgGPA)}</div>
                  </div>
                  <div className="viewall-metric-card">
                    <div className="viewall-metric-icon">
                      <TrendingUp size={18} />
                    </div>
                    <div className="viewall-metric-label">Avg MCAT</div>
                    <div className="viewall-metric-value">{school.avgMCAT || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admissions">
            <div className="viewall-details-section viewall-delay-100">
              <div className="viewall-detail-cards-row">
                <div className="viewall-detail-card flex-1">
                  <h3 className="viewall-section-title">Acceptance Rates</h3>
                  <div className="viewall-detail-grid">
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">Overall</span>
                      <span className="viewall-detail-value">{formatValue('acceptanceRate', school.acceptanceRate)}</span>
                    </div>
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">In-State</span>
                      <span className="viewall-detail-value">{formatValue('inStateAcceptanceRate', school.inStateAcceptanceRate) || formatValue('acceptanceRate', school.acceptanceRate)}</span>
                    </div>
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">Out-of-State</span>
                      <span className="viewall-detail-value">{formatValue('outOfStateAcceptanceRate', school.outOfStateAcceptanceRate) || formatValue('acceptanceRate', school.acceptanceRate)}</span>
                    </div>
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">Primary Deadline</span>
                      <span className="viewall-detail-value">{school.primaryDeadline || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="viewall-detail-card flex-1">
                  <h3 className="viewall-section-title">Tuition Information</h3>
                  <div className="viewall-detail-grid">
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">Annual</span>
                      <span className="viewall-detail-value">
                        {school.annualTuition === 0 ? 
                          <span className="viewall-badge viewall-badge-success">Full Scholarship</span> : 
                          formatValue('annualTuition', school.annualTuition)}
                      </span>
                    </div>
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">In-State</span>
                      <span className="viewall-detail-value">
                        {school.inStateTuition === 0 ? 
                          <span className="viewall-badge viewall-badge-success">Full Scholarship</span> : 
                          (formatValue('inStateTuition', school.inStateTuition) || formatValue('annualTuition', school.annualTuition))}
                      </span>
                    </div>
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">Out-of-State</span>
                      <span className="viewall-detail-value">
                        {school.outOfStateTuition === 0 ? 
                          <span className="viewall-badge viewall-badge-success">Full Scholarship</span> : 
                          (formatValue('outOfStateTuition', school.outOfStateTuition) || formatValue('annualTuition', school.annualTuition))}
                      </span>
                    </div>
                    <div className="viewall-detail-item">
                      <span className="viewall-detail-label">Avg Debt at Graduation</span>
                      <span className="viewall-detail-value">{formatValue('avgDebtAtGraduation', school.avgDebtAtGraduation)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="viewall-detail-card mt-4">
                <h3 className="viewall-section-title">Application Requirements</h3>
                <div className="viewall-requirements-grid">
                  <div className="viewall-requirement-item">
                    <span className="viewall-detail-label">CASPer</span>
                    <span className={`viewall-requirement-indicator ${school.casperRequired ? 'viewall-required' : 'viewall-not-required'}`}>
                      {school.casperRequired ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </span>
                  </div>
                  <div className="viewall-requirement-item">
                    <span className="viewall-detail-label">AAMC PREview</span>
                    <span className={`viewall-requirement-indicator ${school.aamcPreviewRequired ? 'viewall-required' : 'viewall-not-required'}`}>
                      {school.aamcPreviewRequired ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </span>
                  </div>
                  <div className="viewall-requirement-item">
                    <span className="viewall-detail-label">Interview Format</span>
                    <span className="viewall-detail-value">{school.interviewFormat || 'Traditional'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum">
            <div className="viewall-details-section viewall-delay-100">
              <div className="viewall-detail-cards-row">
                <div className="viewall-detail-card flex-1">
                  <h3 className="viewall-section-title">Curriculum</h3>
                  <div className="viewall-detail-full">
                    <span className="viewall-detail-value">{school.curriculumFeatures || 'N/A'}</span>
                  </div>
                  
                  {school.curriculumFeatures && (
                    <div className="viewall-feature-badges">
                      {['Clinical', 'Research', 'Problem-based', 'Systems-based', 'Traditional'].map(term => 
                        school.curriculumFeatures.includes(term) && (
                          <span key={term} className="viewall-badge viewall-badge-primary">
                            {term}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
                
                <div className="viewall-detail-card flex-1">
                  <h3 className="viewall-section-title">Dual Degrees</h3>
                  <div className="viewall-detail-full">
                    <span className="viewall-detail-value">{school.dualDegreesOffered || 'N/A'}</span>
                  </div>
                  
                  {school.dualDegreesOffered && (
                    <div className="viewall-feature-badges">
                      {school.dualDegreesOffered.split(',').map((degree, index) => (
                        <span key={index} className="viewall-badge viewall-badge-secondary">{degree.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }, [activeTabsMap]); // Only depends on the active tabs map

  // Global statistics
  const stats = useMemo(() => {
    const totalSchools = allSchools.length;
    const avgAcceptance = allSchools.reduce((sum, school) => sum + (school.acceptanceRate || 0), 0) / totalSchools;
    const avgTuition = allSchools.reduce((sum, school) => sum + (school.annualTuition || 0), 0) / totalSchools;
    const avgMcat = allSchools.reduce((sum, school) => sum + (school.avgMCAT || 0), 0) / totalSchools;

    return {
      totalSchools,
      avgAcceptance: avgAcceptance.toFixed(1),
      avgTuition: formatValue('annualTuition', avgTuition),
      avgMcat: avgMcat.toFixed(1)
    };
  }, [allSchools]);

  // Prepare data for the Table component
  const dataForTable = useMemo(() => {
    if (!filteredSchools || !Array.isArray(filteredSchools)) return [];
    
    return filteredSchools.map(school => ({
      ...school,
      expandedContent: () => renderSchoolDetails(school)
    }));
  }, [filteredSchools, renderSchoolDetails]);

  // Override the toggleRowExpand function in the Table component
  const customExpandFunction = (rowId) => {
    setExpandedRows(prev => {
      const newState = {...prev};
      newState[rowId] = !prev[rowId];
      return newState;
    });
  };

  // Simulate loading when filter changes
  const handleFilterChange = (newFilter) => {
    setIsLoading(true);
    setFilter(newFilter);
    setCurrentPage(1);

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Handler to go back to saved schools
  const handleGoToSavedSchools = () => {
    navigate('/schools');
  };
  
  // Handler pour la complétion du flux d'onboarding
  const handleOnboardingComplete = (essays) => {
    console.log('Onboarding completed for school:', currentSchool?.name);
    console.log('Essay configurations:', essays);
    
    // Fermer le modal d'onboarding
    setShowOnboarding(false);
    
    // Rediriger vers la page "My Saved Schools"
    navigate('/schools');
  };
  
  // Handler pour fermer le modal d'onboarding
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="viewall-container">
      {/* Breadcrumbs */}
      <div className="viewall-header">
        <Breadcrumbs
          items={[
            {
              label: 'My Saved Schools',
              path: '/schools', // Path to the Profile component that handles saved schools
              onClick: handleGoToSavedSchools
            },
            {
              label: 'Medical Schools Database',
            }
          ]}
        />
      </div>
      
      {/* Page Title */}
      <div className="viewall-page-header viewall-animate-fade-in">
        <h1 className="viewall-page-title">Medical School Database</h1>
        <p className="viewall-page-description">
          Explore detailed information about medical schools, including acceptance rates, tuition, and admissions requirements.
        </p>
      </div>

      {/* General statistics */}
      <div className="viewall-stats-grid viewall-animate-fade-in viewall-delay-100">
        <div className="viewall-stat-card">
          <div className="viewall-stat-icon">
            <School size={20} />
          </div>
          <div className="viewall-stat-value">{stats.totalSchools}</div>
          <div className="viewall-stat-label">Medical Schools</div>
        </div>
        <div className="viewall-stat-card">
          <div className="viewall-stat-icon">
            <ClipboardCheck size={20} />
          </div>
          <div className="viewall-stat-value">{stats.avgAcceptance}%</div>
          <div className="viewall-stat-label">Avg Acceptance Rate</div>
        </div>
        <div className="viewall-stat-card">
          <div className="viewall-stat-icon">
            <LineChart size={20} />
          </div>
          <div className="viewall-stat-value">{stats.avgMcat}</div>
          <div className="viewall-stat-label">Avg MCAT Score</div>
        </div>
      </div>

      {/* Search bar and filters */}
      <div className="viewall-filters-section viewall-animate-fade-in viewall-delay-200">
        <div className="viewall-search-container">
          <div className="viewall-search-bar">
            <input
              type="text"
              placeholder="Search by school name or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="viewall-search-input"
            />
            <span className="viewall-search-icon">
              <Search size={18} />
            </span>
          </div>
        </div>

        <div className="viewall-filters-buttons">
          <button
            className={`viewall-filter-button ${filter === 'all' ? 'viewall-active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <span className="viewall-filter-button-icon">
              <Info size={16} />
            </span>
            All
          </button>
          <button
            className={`viewall-filter-button ${filter === 'top20' ? 'viewall-active' : ''}`}
            onClick={() => handleFilterChange('top20')}
          >
            <span className="viewall-filter-button-icon">
              <Award size={16} />
            </span>
            Top 20
          </button>
          <button
            className={`viewall-filter-button ${filter === 'highAcceptance' ? 'viewall-active' : ''}`}
            onClick={() => handleFilterChange('highAcceptance')}
          >
            <span className="viewall-filter-button-icon">
              <TrendingUp size={16} />
            </span>
            Higher Acceptance Rate
          </button>
        </div>
      </div>

      {/* Medical schools table */}
      <div className="viewall-animate-fade-in viewall-delay-300" style={{ position: 'relative' }}>
        {isLoading && (
          <div className="viewall-loading-overlay">
            <div className="viewall-loading-spinner"></div>
          </div>
        )}
        
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
          tableClassName="viewall-custom-table"
          rowClickable={true} // Make rows clickable for expansion
        />
      </div>

      {/* Display number of schools */}
      <p className="viewall-results-summary viewall-animate-fade-in viewall-delay-300">
        {filteredSchools.length > 0 ? (
          <span>Showing {Math.min(currentPage * schoolsPerPage, filteredSchools.length)} of {filteredSchools.length} schools</span>
        ) : (
          searchQuery && <span>No schools found matching "{searchQuery}"</span>
        )}
      </p>

      {/* Toast notification */}
      {toast.show && (
        <div className={`viewall-toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "success" ? (
              <CheckCircle size={18} style={{ color: "#059669" }} />
            ) : (
              <Info size={18} style={{ color: "#DC2626" }} />
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
      
      {/* School Onboarding Modal */}
      {showOnboarding && currentSchool && (
        <SchoolOnboarding
          school={currentSchool}
          isOpen={showOnboarding}
          onClose={handleCloseOnboarding}
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
};

export default ViewAllMedicalSchool;