import React, { useState, useMemo, useCallback } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/UI/Tabs';
import Table from '../../components/UI/Table';
import Breadcrumbs from '../../components/UI/Breadcrumbs';
import {
  Home, Search, Award, TrendingUp, Info, ClipboardCheck, Book,
  ExternalLink, CheckCircle, XCircle, School, LineChart
} from 'lucide-react';
import medicalSchoolsData from '../../data/medicalSchools.json';
import './MedicalSchoolView.css';

/**
 * Composant MedicalSchoolView pour afficher une base de données d'écoles médicales.
 * Version simplifiée sans fonctionnalités de sauvegarde, utilisée pour l'accès depuis le footer.
 */
const MedicalSchoolView = () => {
  // États
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [activeTabsMap, setActiveTabsMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const schoolsPerPage = 10;

  // Toutes les écoles depuis les données JSON
  const allSchools = useMemo(() => medicalSchoolsData, []);

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
        return typeof value === 'number' ? `$${value.toLocaleString()}` : 'N/A';
      case 'avgGPA':
        return typeof value === 'number' ? value.toFixed(2) : 'N/A';
      default:
        return value;
    }
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

  // Column definitions for the Table component
  const columns = useMemo(() => [
    {
      header: 'Rank',
      accessor: 'rank',
      render: (row) => {
        const rankClass = row.rank <= 10 ? 'msv-rank-badge-top' : (row.rank <= 20 ? 'msv-rank-badge-excellent' : '');
        return <span className={`msv-school-rank ${rankClass}`}>{row.rank}</span>;
      },
      sortable: true,
      width: '10%'
    },
    {
      header: 'Medical School',
      accessor: 'name',
      render: (row) => <span className="msv-school-name">{row.name}</span>,
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
      render: (row) => formatValue('acceptanceRate', row.acceptanceRate),
      sortable: true,
      width: '15%'
    },
    {
      header: 'Avg GPA',
      accessor: 'avgGPA',
      render: (row) => formatValue('avgGPA', row.avgGPA),
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
      render: (row) => row.annualTuition === 0 ?
        <span className="msv-badge msv-badge-success">Full Scholarship</span> : 
        formatValue('annualTuition', row.annualTuition),
      sortable: true,
      width: '15%'
    }
  ], []);

  // Function to generate detailed content for an expanded row
  const renderSchoolDetails = useCallback((school) => {
    const activeTab = getActiveTabForSchool(school.id);

    return (
      <div className="msv-school-details msv-animate-fade-in">
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
            <div className="msv-details-grid">
              <div className="msv-details-section msv-delay-100">
                <h3 className="msv-section-title">School Information</h3>
                
                <div className="msv-detail-card">
                  <div className="msv-detail-grid">
                    <div className="msv-detail-item">
                      <span className="msv-detail-label">Official Website</span>
                      <a
                        href={school.officialURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="msv-website-link msv-detail-value"
                      >
                        {school.officialURL || 'N/A'} 
                        <ExternalLink size={14} className="msv-external-link-icon" />
                      </a>
                    </div>
                    
                    <div className="msv-detail-item">
                      <span className="msv-detail-label" style={{ marginLeft: '30px' }}>Class Size :</span>
                      <span className="msv-detail-value" style={{ marginLeft: '30px' }}>{school.classSize || 'N/A'} students</span>
                    </div>
                    
                    <div className="msv-detail-item">
                      <span className="msv-detail-label" style={{ marginLeft: '-60px' }}>% Receiving Aid :</span>
                      <span className="msv-detail-value" style={{ marginLeft: '-60px' }}>{formatValue('percentReceivingAid', school.percentReceivingAid)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="msv-detail-card">
                  <div className="msv-detail-full">
                    <span className="msv-detail-label">Financial Aid :</span>
                    <span className="msv-detail-value" style={{ marginLeft: '3px' }}>{school.financialAidHighlights || 'N/A'}</span>
                  </div>
                </div>

                <div className="msv-metrics-grid">
                  <div className="msv-metric-card">
                    <div className="msv-metric-icon">
                      <Award size={18} /> 
                    </div>
                    <div className="msv-metric-label">Rank</div>
                    <div className="msv-metric-value">{school.rank}</div>
                  </div>
                  <div className="msv-metric-card">
                    <div className="msv-metric-icon">
                      <LineChart size={18} />
                    </div>
                    <div className="msv-metric-label">Avg GPA</div>
                    <div className="msv-metric-value">{formatValue('avgGPA', school.avgGPA)}</div>
                  </div>
                  <div className="msv-metric-card">
                    <div className="msv-metric-icon">
                      <TrendingUp size={18} />
                    </div>
                    <div className="msv-metric-label">Avg MCAT</div>
                    <div className="msv-metric-value">{school.avgMCAT}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admissions">
            <div className="msv-details-section msv-delay-100">
              <div className="msv-detail-cards-row">
                <div className="msv-detail-card flex-1">
                  <h3 className="msv-section-title">Acceptance Rates</h3>
                  <div className="msv-detail-grid">
                    <div className="msv-detail-item">
                      <span className="msv-detail-label">Overall</span>
                      <span className="msv-detail-value">{formatValue('acceptanceRate', school.acceptanceRate)}</span>
                    </div>
                    <div className="msv-detail-item">
                      <span className="msv-detail-label">In-State</span>
                      <span className="msv-detail-value">{formatValue('inStateAcceptanceRate', school.inStateAcceptanceRate) || formatValue('acceptanceRate', school.acceptanceRate)}</span>
                    </div>
                    <div className="msv-detail-item">
                      <span className="msv-detail-label">Out-of-State</span>
                      <span className="msv-detail-value">{formatValue('outOfStateAcceptanceRate', school.outOfStateAcceptanceRate) || formatValue('acceptanceRate', school.acceptanceRate)}</span>
                    </div>
                    <div className="msv-detail-item">
                      <span className="msv-detail-label">Primary Deadline</span>
                      <span className="msv-detail-value">{school.primaryDeadline || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="msv-detail-card flex-1">
                  <h3 className="msv-section-title">Tuition Information</h3>
                  <div className="msv-detail-grid">
                    <div className="msv-detail-item">
                      <span className="msv-detail-label">Annual</span>
                      <span className="msv-detail-value">
                        {school.annualTuition === 0 ? 
                          <span className="msv-badge msv-badge-success">Full Scholarship</span> : 
                          formatValue('annualTuition', school.annualTuition)}
                      </span>
                    </div>
                    <div className="msv-detail-item">
                      <span className="msv-detail-label">In-State</span>
                      <span className="msv-detail-value">
                        {school.inStateTuition === 0 ? 
                          <span className="msv-badge msv-badge-success">Full Scholarship</span> : 
                          (formatValue('inStateTuition', school.inStateTuition) || formatValue('annualTuition', school.annualTuition))}
                      </span>
                    </div>
                    <div className="msv-detail-item">
                      <span className="msv-detail-label">Out-of-State</span>
                      <span className="msv-detail-value">
                        {school.outOfStateTuition === 0 ? 
                          <span className="msv-badge msv-badge-success">Full Scholarship</span> : 
                          (formatValue('outOfStateTuition', school.outOfStateTuition) || formatValue('annualTuition', school.annualTuition))}
                      </span>
                    </div>
                    <div className="msv-detail-item">
                      <span className="msv-detail-label">Avg Debt at Graduation</span>
                      <span className="msv-detail-value">{formatValue('avgDebtAtGraduation', school.avgDebtAtGraduation)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="msv-detail-card mt-4">
                <h3 className="msv-section-title">Application Requirements</h3>
                <div className="msv-requirements-grid">
                  <div className="msv-requirement-item">
                    <span className="msv-detail-label">CASPer</span>
                    <span className={`msv-requirement-indicator ${school.casperRequired ? 'msv-required' : 'msv-not-required'}`}>
                      {school.casperRequired ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </span>
                  </div>
                  <div className="msv-requirement-item">
                    <span className="msv-detail-label">AAMC PREview</span>
                    <span className={`msv-requirement-indicator ${school.aamcPreviewRequired ? 'msv-required' : 'msv-not-required'}`}>
                      {school.aamcPreviewRequired ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </span>
                  </div>
                  <div className="msv-requirement-item">
                    <span className="msv-detail-label">Interview Format</span>
                    <span className="msv-detail-value">{school.interviewFormat || 'Traditional'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum">
            <div className="msv-details-section msv-delay-100">
              <div className="msv-detail-cards-row">
                <div className="msv-detail-card flex-1">
                  <h3 className="msv-section-title">Curriculum</h3>
                  <div className="msv-detail-full">
                    <span className="msv-detail-value">{school.curriculumFeatures || 'N/A'}</span>
                  </div>
                  
                  {school.curriculumFeatures && (
                    <div className="msv-feature-badges">
                      {['Clinical', 'Research', 'Problem-based', 'Systems-based', 'Traditional'].map(term => 
                        school.curriculumFeatures.includes(term) && (
                          <span key={term} className="msv-badge msv-badge-primary">
                            {term}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
                
                <div className="msv-detail-card flex-1">
                  <h3 className="msv-section-title">Dual Degrees</h3>
                  <div className="msv-detail-full">
                    <span className="msv-detail-value">{school.dualDegreesOffered || 'N/A'}</span>
                  </div>
                  
                  {school.dualDegreesOffered && (
                    <div className="msv-feature-badges">
                      {school.dualDegreesOffered.split(',').map((degree, index) => (
                        <span key={index} className="msv-badge msv-badge-secondary">{degree.trim()}</span>
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

  // Simulate loading when changing filter
  const handleFilterChange = (newFilter) => {
    setIsLoading(true);
    setFilter(newFilter);
    setCurrentPage(1);

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Contenu principal
  const content = (
    <div className="msv-medschool-container">
      <Breadcrumbs
        items={[
          {
            label: 'Home',
            path: '/',
            icon: <Home size={14} />
          },
          {
            label: 'Medical Schools'
          }
        ]}
      />
      
      <div className="msv-page-header msv-animate-fade-in">
      <h1 className="msv-title">Medical <span className="highlight">School Database</span></h1>

        <p className="msv-page-description">
          Explore detailed information about medical schools, including acceptance rates, tuition, and admissions requirements.
        </p>
      </div>

      {/* General statistics */}
      <div className="msv-stats-grid msv-animate-fade-in msv-delay-100">
        <div className="msv-stat-card">
          <div className="msv-stat-icon">
            <School size={20} />
          </div>
          <div className="msv-stat-value">{stats.totalSchools}</div>
          <div className="msv-stat-label">Medical Schools</div>
        </div>
        <div className="msv-stat-card">
          <div className="msv-stat-icon">
            <ClipboardCheck size={20} />
          </div>
          <div className="msv-stat-value">{stats.avgAcceptance}%</div>
          <div className="msv-stat-label">Avg Acceptance Rate</div>
        </div>
        <div className="msv-stat-card">
          <div className="msv-stat-icon">
            <LineChart size={20} />
          </div>
          <div className="msv-stat-value">{stats.avgMcat}</div>
          <div className="msv-stat-label">Avg MCAT Score</div>
        </div>
      </div>

      {/* Search bar and filters */}
      <div className="msv-filters-section msv-animate-fade-in msv-delay-200">
        <div className="msv-search-container">
          <div className="msv-search-bar">
            <input
              type="text"
              placeholder="Search by school name or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="msv-search-input"
            />
            <span className="msv-search-icon">
              <Search size={18} />
            </span>
          </div>
        </div>

        <div className="msv-filters-buttons">
          <button
            className={`msv-filter-button ${filter === 'all' ? 'msv-active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <span className="msv-filter-button-icon">
              <Info size={16} />
            </span>
            All
          </button>
          <button
            className={`msv-filter-button ${filter === 'top20' ? 'msv-active' : ''}`}
            onClick={() => handleFilterChange('top20')}
          >
            <span className="msv-filter-button-icon">
              <Award size={16} />
            </span>
            Top 20
          </button>
          <button
            className={`msv-filter-button ${filter === 'highAcceptance' ? 'msv-active' : ''}`}
            onClick={() => handleFilterChange('highAcceptance')}
          >
            <span className="msv-filter-button-icon">
              <TrendingUp size={16} />
            </span>
            Higher Acceptance Rate
          </button>
        </div>
      </div>

      {/* Medical schools table */}
      <div className="msv-animate-fade-in msv-delay-300" style={{ position: 'relative' }}>
        {isLoading && (
          <div className="msv-loading-overlay">
            <div className="msv-loading-spinner"></div>
          </div>
        )}
        
        <Table
          columns={columns}
          data={dataForTable}
          expandable={true}
          rowsPerPage={schoolsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          actions={[]} // Pas d'actions dans cette version
          sortable={true}
          emptyMessage="No medical schools match your search"
          expandedRows={expandedRows}
          onRowExpand={customExpandFunction}
          tableClassName="msv-custom-table"
        />
      </div>

      {/* Display number of schools */}
      <p className="msv-results-summary msv-animate-fade-in msv-delay-300">
        {filteredSchools.length > 0 ? (
          <span>Showing {Math.min(currentPage * schoolsPerPage, filteredSchools.length)} of {filteredSchools.length} schools</span>
        ) : (
          searchQuery && <span>No schools found matching "{searchQuery}"</span>
        )}
      </p>
    </div>
  );

  // Toujours retourner le contenu avec le Layout puisque ce composant est utilisé depuis le footer
  return <Layout>{content}</Layout>;
};

export default MedicalSchoolView;