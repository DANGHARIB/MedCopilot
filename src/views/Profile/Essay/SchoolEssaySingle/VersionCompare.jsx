import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckSquare, 
  GitCompare,
  FileText,
  Eye,
  Diff,
  Clock,
  Type
} from 'lucide-react';
import './VersionCompare.css';

/**
 * Modern interface for comparing essay versions
 * with a clean, elegant design inspired by EditedEssayInterface
 */
const VersionCompare = ({ 
  currentVersion, 
  compareVersion, 
  onAccept, 
  onCancel 
}) => {
  // State
  const [activeTab, setActiveTab] = useState("differences");
  const [differences, setDifferences] = useState({
    additions: [],
    deletions: [],
    currentParagraphs: [],
    compareParagraphs: []
  });
  
  // Refs for synchronized scrolling
  const currentSideRef = useRef(null);
  const compareSideRef = useRef(null);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Calculate word count for a version
  const getWordCount = (content) => {
    if (!content) return 0;
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };
  
  // Analyze differences between the two versions
  useEffect(() => {
    if (!currentVersion?.content || !compareVersion?.content) {
      return;
    }
    
    const currentParagraphs = currentVersion.content.split(/\n\n+/).filter(p => p.trim() !== '');
    const compareParagraphs = compareVersion.content.split(/\n\n+/).filter(p => p.trim() !== '');
    
    // Simple difference detection (for a real app, you'd use a diff algorithm)
    // This is a simplified approach that just flags paragraphs as added or deleted
    const additions = [];
    const deletions = [];
    
    // Check for differences in content
    const maxLength = Math.max(currentParagraphs.length, compareParagraphs.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i >= currentParagraphs.length) {
        // New paragraph added in compare version
        additions.push(i);
      } else if (i >= compareParagraphs.length) {
        // Paragraph deleted in compare version
        deletions.push(i);
      } else if (currentParagraphs[i] !== compareParagraphs[i]) {
        // Different content
        deletions.push(i);
        additions.push(i);
      }
    }
    
    setDifferences({
      additions,
      deletions,
      currentParagraphs,
      compareParagraphs
    });
  }, [currentVersion, compareVersion]);
  
  // Synchronized scrolling for side-by-side view
  useEffect(() => {
    if (activeTab === 'differences' && currentSideRef.current && compareSideRef.current) {
      const currentSide = currentSideRef.current;
      const compareSide = compareSideRef.current;
      
      const handleScroll = (source, target) => () => {
        if (target && source) {
          const scrollPercentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
          target.scrollTop = scrollPercentage * (target.scrollHeight - target.clientHeight);
        }
      };
      
      const handleCurrentScroll = handleScroll(currentSide, compareSide);
      const handleCompareScroll = handleScroll(compareSide, currentSide);
      
      currentSide.addEventListener('scroll', handleCurrentScroll);
      compareSide.addEventListener('scroll', handleCompareScroll);
      
      return () => {
        currentSide.removeEventListener('scroll', handleCurrentScroll);
        compareSide.removeEventListener('scroll', handleCompareScroll);
      };
    }
  }, [activeTab]);
  
  // Tab configuration
  const tabs = [
    {
      id: 'current',
      label: 'Current Version',
      description: 'Your current essay version'
    },
    {
      id: 'compare',
      label: 'Revised Version',
      description: 'The version being compared'
    },
    {
      id: 'differences',
      label: 'Compare',
      description: 'Side-by-side comparison'
    }
  ];
  
  // Render current version view
  const renderCurrentView = () => (
    <div className="essay-content">
      <div className="essay-content-header">
        <h2 className="essay-content-title">Current Version</h2>
        <div className="essay-content-meta">
          <div className="essay-meta-item">
            <Clock size={14} />
            <span>{formatDate(currentVersion?.date)}</span>
          </div>
          <div className="essay-meta-item">
            <Type size={14} />
            <span>{getWordCount(currentVersion?.content)} words</span>
          </div>
        </div>
      </div>
      <div className="essay-content-body">
        {differences.currentParagraphs.map((paragraph, index) => (
          <p key={`current-${index}`} className={`essay-paragraph ${differences.deletions.includes(index) ? 'essay-paragraph-changed' : ''}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
  
  // Render compare version view
  const renderCompareView = () => (
    <div className="essay-content">
      <div className="essay-content-header">
        <h2 className="essay-content-title">Revised Version</h2>
        <div className="essay-content-meta">
          <div className="essay-meta-item">
            <Clock size={14} />
            <span>{formatDate(compareVersion?.date)}</span>
          </div>
          <div className="essay-meta-item">
            <Type size={14} />
            <span>{getWordCount(compareVersion?.content)} words</span>
          </div>
        </div>
      </div>
      <div className="essay-content-body">
        {differences.compareParagraphs.map((paragraph, index) => (
          <p key={`compare-${index}`} className={`essay-paragraph ${differences.additions.includes(index) ? 'essay-paragraph-changed' : ''}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
  
  // Render differences view with highlighted changes
  const renderDifferencesView = () => (
    <div className="essay-side-by-side">
      <div className="essay-side">
        <div className="essay-side-header">
          <h3>Current Version</h3>
          <div className="essay-side-meta">
            <div className="essay-meta-item">
              <Clock size={14} />
              <span>{formatDate(currentVersion?.date)}</span>
            </div>
            <div className="essay-meta-item">
              <Type size={14} />
              <span>{getWordCount(currentVersion?.content)} words</span>
            </div>
          </div>
        </div>
        <div className="essay-side-content" ref={currentSideRef}>
          {differences.currentParagraphs.map((paragraph, index) => (
            <p 
              key={`current-side-${index}`} 
              className={`essay-paragraph ${differences.deletions.includes(index) ? 'essay-paragraph-deleted' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      
      <div className="essay-side">
        <div className="essay-side-header">
          <h3>Revised Version</h3>
          <div className="essay-side-meta">
            <div className="essay-meta-item">
              <Clock size={14} />
              <span>{formatDate(compareVersion?.date)}</span>
            </div>
            <div className="essay-meta-item">
              <Type size={14} />
              <span>{getWordCount(compareVersion?.content)} words</span>
            </div>
          </div>
        </div>
        <div className="essay-side-content" ref={compareSideRef}>
          {differences.compareParagraphs.map((paragraph, index) => (
            <p 
              key={`compare-side-${index}`} 
              className={`essay-paragraph ${differences.additions.includes(index) ? 'essay-paragraph-added' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Show change summary at the top
  const renderChangeSummary = () => {
    const addedParagraphs = differences.additions.length;
    const deletedParagraphs = differences.deletions.length;
    
    return (
      <div className="essay-compare-summary">
        <div className="essay-compare-stats">
          <div className="essay-compare-stat">
            <span className="essay-compare-stat-label">Current:</span>
            <span className="essay-compare-stat-value">{getWordCount(currentVersion?.content)} words</span>
          </div>
          <div className="essay-compare-stat">
            <span className="essay-compare-stat-label">Revised:</span>
            <span className="essay-compare-stat-value">{getWordCount(compareVersion?.content)} words</span>
          </div>
        </div>
        
        {(addedParagraphs > 0 || deletedParagraphs > 0) ? (
          <div className="essay-compare-changes">
            <div className="essay-compare-changes-list">
              {addedParagraphs > 0 && (
                <div className="essay-compare-change-item essay-change-added">
                  <span className="essay-change-indicator">+</span>
                  <span>
                    {addedParagraphs} paragraph{addedParagraphs !== 1 ? 's' : ''} changed or added
                  </span>
                </div>
              )}
              {deletedParagraphs > 0 && (
                <div className="essay-compare-change-item essay-change-deleted">
                  <span className="essay-change-indicator">-</span>
                  <span>
                    {deletedParagraphs} paragraph{deletedParagraphs !== 1 ? 's' : ''} removed or changed
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="essay-compare-no-changes">
            <p>No significant changes detected between versions.</p>
          </div>
        )}
      </div>
    );
  };
  
  // Render the appropriate content based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case "current":
        return renderCurrentView();
      case "compare":
        return renderCompareView();
      case "differences":
        return renderDifferencesView();
      default:
        return renderDifferencesView();
    }
  };
  
  // If no versions to compare, show error
  if (!currentVersion || !compareVersion) {
    return (
      <div className="essay-container">
        <div className="essay-error">
          <h3>Unable to Compare Versions</h3>
          <p>One or both versions are missing required content.</p>
          <button 
            className="essay-back-button"
            onClick={onCancel}
          >
            <ArrowLeft size={16} />
            <span>Return to Essay</span>
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="essay-container">
      {/* Header */}
      <header className="essay-header">
        <div className="essay-header-content">
          <div className="essay-header-left">
            <button 
              className="essay-back-button"
              onClick={onCancel}
              aria-label="Return to essay view"
            >
              <ArrowLeft size={16} />
              <span>Return</span>
            </button>
            <div className="essay-header-title">
              <GitCompare size={24} className="essay-icon" />
              <div>
                <h1>Version Comparison</h1>
                <p className="essay-header-subtitle">
                  Compare and review different essay versions
                </p>
              </div>
            </div>
          </div>
          
          <div className="essay-actions">
            <button 
              className="essay-action-button primary"
              onClick={() => onAccept(compareVersion)}
              aria-label="Set this version as current"
            >
              <CheckSquare size={18} />
              <span>Set as Current</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Change Summary */}
      <div className="essay-summary-section">
        {renderChangeSummary()}
      </div>
      
      {/* Navigation Tabs */}
      <div className="essay-tabs">
        <div className="essay-tabs-container">
          <div className="essay-tabs-list">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                className={`essay-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-label={tab.description}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="essay-main">
        {activeTab === 'differences' ? (
          renderMainContent()
        ) : (
          <div className="essay-content-wrapper">
            {renderMainContent()}
          </div>
        )}
      </main>
      
      {/* Footer with legend */}
      <footer className="essay-footer">
        <div className="essay-footer-content">
          <div className="essay-legend">
            <div className="essay-legend-item essay-legend-deleted">
              <div className="essay-legend-color"></div>
              <span>Removed or changed content</span>
            </div>
            <div className="essay-legend-item essay-legend-added">
              <div className="essay-legend-color"></div>
              <span>Added or new content</span>
            </div>
          </div>
          
          <button 
            className="essay-action-button primary"
            onClick={() => onAccept(compareVersion)}
            aria-label="Set this version as current"
          >
            <CheckSquare size={18} />
            <span>Set as Current</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default VersionCompare; 