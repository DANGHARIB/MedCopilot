import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Copy, 
  Download, 
  Share2, 
  ChevronLeft,
  Clock,
  FileText,
  BookOpen
} from 'lucide-react';

import UserLayout from '../../../../components/user/layout/UserLayout';
import EssayHeader from './EssayHeader';
import EssayContent from './EssayContent';
import EssaySidebar from './EssaySidebar';
import VersionCompare from './VersionCompare';
import RevisionRequest from './RevisionRequest';
import LoadingState from './LoadingState';

import './SchoolEssaySingle.css';

/**
 * SchoolEssaySingle - Detailed view for a single essay with version history
 * and revision capabilities
 */
const SchoolEssaySingle = () => {
  const { schoolId, essayId } = useParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [school, setSchool] = useState(null);
  const [essay, setEssay] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeView, setActiveView] = useState('view'); // 'view', 'compare', 'revise', 'generating'
  const [compareVersion, setCompareVersion] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [inFocusMode, setInFocusMode] = useState(false);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch school data
        const savedSchools = JSON.parse(localStorage.getItem('mySavedSchools') || '[]');
        const schoolData = savedSchools.find(s => s.id.toString() === schoolId);
        
        if (!schoolData) {
          throw new Error('School not found');
        }
        
        setSchool(schoolData);
        
        // Fetch essay configuration
        const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
        const essays = schoolEssays[schoolId] || [];
        const essayData = essays.find(e => e.id.toString() === essayId);
        
        if (!essayData) {
          throw new Error('Essay not found');
        }
        
        setEssay(essayData);
        
        // Fetch versions (from essayGenerationHistory)
        const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
        const essayVersions = essayHistory[schoolId]?.[essayId]?.versions || [];
        
        // If no versions exist yet, we'll just show essay configuration
        setVersions(essayVersions);
        
        // Set current version to the latest one, or null if none exists
        if (essayVersions.length > 0) {
          const latest = essayVersions[essayVersions.length - 1];
          setCurrentVersion(latest);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading essay data:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [schoolId, essayId]);

  // Handle navigation back to essay list
  const handleBackToList = () => {
    navigate(`/schools/${schoolId}/essays`);
  };

  // Handle copying essay to clipboard
  const handleCopyEssay = () => {
    if (currentVersion?.content) {
      navigator.clipboard.writeText(currentVersion.content);
      showToast('Essay copied to clipboard', 'success');
    }
  };

  // Handle downloading essay as PDF
  const handleDownloadPDF = () => {
    // This would be implemented with a PDF generation library
    showToast('PDF download started', 'info');
  };

  // Handle sharing essay
  const handleShareEssay = () => {
    showToast('Sharing options opened', 'info');
  };

  // Handle switching to a different version
  const handleViewVersion = (version) => {
    setCurrentVersion(version);
    setActiveView('view');
  };

  // Handle comparing versions
  const handleCompareVersions = (version) => {
    setCompareVersion(version);
    setActiveView('compare');
  };

  // Handle initiating a revision
  const handleInitiateRevision = () => {
    if (!currentVersion) {
      showToast('No version to revise', 'error');
      return;
    }
    
    setActiveView('revise');
  };

  // Handle submitting a revision request
  const handleSubmitRevision = (instructions) => {
    // This would call the API to generate a new version
    setActiveView('generating');
    
    // Simulate generation time
    setTimeout(() => {
      // Create a new version
      const newVersion = {
        id: versions.length + 1,
        date: new Date().toISOString(),
        content: "This is a new version of the essay based on your revisions...",
        revisionInstructions: instructions,
        wordCount: currentVersion.wordCount + 15,
        characterCount: currentVersion.characterCount + 80,
      };
      
      // Update versions
      const updatedVersions = [...versions, newVersion];
      setVersions(updatedVersions);
      
      // Update local storage
      const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
      if (!essayHistory[schoolId]) essayHistory[schoolId] = {};
      if (!essayHistory[schoolId][essayId]) essayHistory[schoolId][essayId] = {};
      
      essayHistory[schoolId][essayId].versions = updatedVersions;
      localStorage.setItem('essayGenerationHistory', JSON.stringify(essayHistory));
      
      // Set compare mode to compare the old version with the new one
      setCompareVersion(currentVersion);
      setCurrentVersion(newVersion);
      setActiveView('compare');
      
      showToast('New revision generated successfully', 'success');
    }, 3000);
  };

  // Handle accepting a compared version
  const handleAcceptVersion = (version) => {
    setCurrentVersion(version);
    setActiveView('view');
    showToast('Version set as current', 'success');
  };

  // Handle canceling a comparison or revision
  const handleCancelAction = () => {
    setActiveView('view');
  };

  // Toggle focus mode
  const toggleFocusMode = () => {
    setInFocusMode(!inFocusMode);
  };

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Determine content to render based on active view
  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return (
        <div className="ses-essay-error-state">
          <div className="ses-essay-error-icon">!</div>
          <h2>Error Loading Essay</h2>
          <p>{error}</p>
          <button 
            className="ses-essay-error-button"
            onClick={handleBackToList}
          >
            Return to Essay List
          </button>
        </div>
      );
    }

    switch (activeView) {
      case 'compare':
        return (
          <VersionCompare 
            currentVersion={currentVersion}
            compareVersion={compareVersion}
            onAccept={handleAcceptVersion}
            onCancel={handleCancelAction}
          />
        );
        
      case 'revise':
        return (
          <RevisionRequest 
            version={currentVersion}
            essay={essay}
            onSubmit={handleSubmitRevision}
            onCancel={handleCancelAction}
          />
        );
        
      case 'generating':
        return (
          <div className="ses-essay-generating-state">
            <div className="ses-essay-generating-animation">
              <div className="ses-generating-circle"></div>
              <div className="ses-generating-circle"></div>
              <div className="ses-generating-circle"></div>
            </div>
            <h2>Generating New Essay Version</h2>
            <p>Our AI is crafting a revised version based on your instructions...</p>
            <div className="ses-essay-generating-progress">
              <div className="ses-essay-generating-bar">
                <div className="ses-essay-generating-fill"></div>
              </div>
            </div>
          </div>
        );
        
      case 'view':
      default:
        return (
          <div className={`ses-essay-main-layout ${inFocusMode ? 'ses-focus-mode' : ''}`}>
            <EssayContent 
              essay={essay}
              version={currentVersion}
              school={school}
              inFocusMode={inFocusMode}
              onToggleFocus={toggleFocusMode}
            />
            <EssaySidebar 
              essay={essay}
              versions={versions}
              currentVersion={currentVersion}
              school={school}
              onViewVersion={handleViewVersion}
              onCompareVersion={handleCompareVersions}
              onRequestRevision={handleInitiateRevision}
            />
          </div>
        );
    }
  };

  return (
    <UserLayout>
      <div className={`ses-school-essay-single-container ${inFocusMode ? 'ses-focus-mode' : ''}`}>
        {activeView !== 'generating' && (
          <EssayHeader 
            essay={essay}
            school={school}
            version={currentVersion}
            onBack={handleBackToList}
            onCopy={handleCopyEssay}
            onDownload={handleDownloadPDF}
            onShare={handleShareEssay}
            inFocusMode={inFocusMode}
          />
        )}
        
        <main className="ses-school-essay-single-main">
          {renderContent()}
        </main>
        
        {/* Toast notification */}
        {toast.show && (
          <div className={`ses-essay-toast ses-toast-${toast.type}`}>
            <div className="ses-essay-toast-icon">
              {toast.type === 'success' ? (
                <div className="ses-success-icon"></div>
              ) : toast.type === 'error' ? (
                <div className="ses-error-icon"></div>
              ) : (
                <div className="ses-info-icon"></div>
              )}
            </div>
            <p>{toast.message}</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default SchoolEssaySingle; 