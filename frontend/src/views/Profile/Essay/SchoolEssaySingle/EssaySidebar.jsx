import React, { useState } from 'react';
import {
  History,
  BarChart2,
  FileText,
  Book,
  Clock,
  Type,
  Eye,
  Edit,
  Layers,
  Download,
  PenTool,
  ChevronRight
} from 'lucide-react';
import './EssaySidebar.css';

/**
 * Sidebar component for SchoolEssaySingle
 * Displays version history, statistics, and actions
 */
const EssaySidebar = ({
  essay,
  versions,
  currentVersion,
  onViewVersion,
  onCompareVersion,
  onRequestRevision
}) => {
  const [activeTab, setActiveTab] = useState('history');
  
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
  
  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate statistics for the current version
  const calculateStats = () => {
    if (!currentVersion?.content) {
      return {
        words: 0,
        characters: 0,
        paragraphs: 0,
        readingTime: 0,
        wordsPerSentence: 0
      };
    }
    
    const text = currentVersion.content;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim() !== '');
    const sentences = text.split(/[.!?]+/).filter(s => s.trim() !== '');
    
    return {
      words: words.length,
      characters: text.length,
      paragraphs: paragraphs.length,
      readingTime: Math.max(1, Math.round(words.length / 225)),
      wordsPerSentence: sentences.length ? Math.round((words.length / sentences.length) * 10) / 10 : 0
    };
  };
  
  const stats = calculateStats();
  
  // Determine if the essay is over, under, or within the limit
  const getLimitStatus = () => {
    if (!essay) return 'under';
    
    const type = essay.limitType || 'words';
    const limit = type === 'words' 
      ? essay.wordLimit || 500 
      : essay.characterLimit || 2500;
      
    const current = type === 'words' ? stats.words : stats.characters;
    
    if (current > limit) return 'over';
    if (current >= limit * 0.9) return 'near';
    return 'under';
  };
  
  const limitStatus = getLimitStatus();
  
  // Calculate percentage of the limit used
  const getLimitPercentage = () => {
    if (!essay || !currentVersion) return 0;
    
    const type = essay.limitType || 'words';
    const limit = type === 'words' 
      ? essay.wordLimit || 500 
      : essay.characterLimit || 2500;
      
    const current = type === 'words' ? stats.words : stats.characters;
    
    return Math.min(100, Math.round((current / limit) * 100));
  };
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats':
        return renderStatsTab();
      case 'history':
      default:
        return renderHistoryTab();
    }
  };
  
  // Render history tab content
  const renderHistoryTab = () => (
    <div className="ses-essay-sidebar-tab-content">
      <div className="ses-essay-versions-header">
        <h3 className="ses-essay-sidebar-title">
          <History size={16} />
          <span>Version History</span>
        </h3>
        <span className="ses-essay-version-count">{versions.length} version{versions.length !== 1 ? 's' : ''}</span>
      </div>
      
      {versions.length === 0 ? (
        <div className="ses-essay-versions-empty">
          <FileText size={24} />
          <p>No versions yet</p>
          <span>Generate your first version to get started</span>
        </div>
      ) : (
        <div className="ses-essay-versions-timeline">
          {versions.map((version, index) => (
            <div 
              key={`version-${version.id || index}`}
              className={`ses-essay-version-item ${currentVersion?.id === version.id ? 'ses-current' : ''}`}
            >
              <div className="ses-essay-version-connector">
                <div className="ses-version-dot"></div>
                <div className="ses-version-line"></div>
              </div>
              
              <div className="ses-essay-version-content">
                <div className="ses-essay-version-header">
                  <div className="ses-essay-version-info">
                    <h4 className="ses-essay-version-title">
                      Version {version.id || index + 1}
                      {currentVersion?.id === version.id && (
                        <span className="ses-current-version-badge">Current</span>
                      )}
                    </h4>
                    <div className="ses-essay-version-date">
                      <span>{formatDate(version.date)}</span>
                      <span className="ses-essay-version-time">{formatTime(version.date)}</span>
                    </div>
                  </div>
                </div>
                
                {version.revisionInstructions && (
                  <div className="ses-essay-version-notes">
                    <h5 className="ses-essay-version-notes-title">Revision notes:</h5>
                    <p className="ses-essay-version-notes-text">
                      {version.revisionInstructions.length > 100 
                        ? `${version.revisionInstructions.slice(0, 100)}...` 
                        : version.revisionInstructions}
                    </p>
                  </div>
                )}
                
                <div className="ses-essay-version-actions">
                  <button 
                    className="ses-essay-version-button"
                    onClick={() => onViewVersion(version)}
                    disabled={currentVersion?.id === version.id}
                    aria-label="View this version"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                  
                  {currentVersion?.id !== version.id && (
                    <button 
                      className="ses-essay-version-button"
                      onClick={() => onCompareVersion(version)}
                      aria-label="Compare with current version"
                    >
                      <Layers size={14} />
                      <span>Compare</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="ses-essay-sidebar-actions">
        <button 
          className="ses-essay-sidebar-button ses-primary"
          onClick={onRequestRevision}
          disabled={!currentVersion}
        >
          <PenTool size={16} />
          <span>Request Revision</span>
        </button>
        
        <button className="ses-essay-sidebar-button ses-secondary">
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
      
      <div className="ses-essay-next-steps">
        <h3 className="ses-essay-next-steps-title">Next Steps</h3>
        <div className="ses-essay-next-steps-list">
          <div className="ses-essay-next-step-item">
            <div className="ses-essay-next-step-number">1</div>
            <div className="ses-essay-next-step-content">
              <h4>Review & Edit</h4>
              <p>Review your essay and request revisions as needed</p>
            </div>
            <ChevronRight size={16} className="ses-essay-next-step-icon" />
          </div>
          
          <div className="ses-essay-next-step-item">
            <div className="ses-essay-next-step-number">2</div>
            <div className="ses-essay-next-step-content">
              <h4>Get Feedback</h4>
              <p>Share your essay with peers or mentors</p>
            </div>
            <ChevronRight size={16} className="ses-essay-next-step-icon" />
          </div>
          
          <div className="ses-essay-next-step-item">
            <div className="ses-essay-next-step-number">3</div>
            <div className="ses-essay-next-step-content">
              <h4>Finalize</h4>
              <p>Make final adjustments and prepare for submission</p>
            </div>
            <ChevronRight size={16} className="ses-essay-next-step-icon" />
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render stats tab content
  const renderStatsTab = () => (
    <div className="ses-essay-sidebar-tab-content">
      <h3 className="ses-essay-sidebar-title">
        <BarChart2 size={16} />
        <span>Essay Statistics</span>
      </h3>
      
      <div className="ses-essay-stats-limit-card">
        <div className="ses-essay-stats-limit-header">
          <h4>
            {essay?.limitType === 'characters' ? 'Character Count' : 'Word Count'}
          </h4>
          <div className="ses-essay-stats-limit-counter">
            <span className={`ses-limit-counter-value ${limitStatus === 'over' ? 'ses-over' : limitStatus === 'near' ? 'ses-near' : ''}`}>
              {essay?.limitType === 'characters' ? stats.characters : stats.words}
            </span>
            <span className="ses-limit-counter-separator">/</span>
            <span className="ses-limit-counter-max">
              {essay?.limitType === 'characters' 
                ? (essay?.characterLimit || 2500) 
                : (essay?.wordLimit || 500)}
            </span>
          </div>
        </div>
        
        <div className="ses-essay-stats-limit-bar">
          <div 
            className={`ses-essay-stats-limit-fill ${limitStatus === 'over' ? 'ses-over' : limitStatus === 'near' ? 'ses-near' : ''}`} 
            style={{ width: `${getLimitPercentage()}%` }}
          ></div>
        </div>
        
        <div className="ses-essay-stats-limit-labels">
          <span>0</span>
          <span>
            {essay?.limitType === 'characters' 
              ? (essay?.characterLimit || 2500) 
              : (essay?.wordLimit || 500)}
          </span>
        </div>
      </div>
      
      <div className="ses-essay-stats-grid">
        <div className="ses-essay-stats-item">
          <div className="ses-essay-stats-icon">
            <Type size={16} />
          </div>
          <div className="ses-essay-stats-info">
            <span className="ses-essay-stats-value">{stats.words}</span>
            <span className="ses-essay-stats-label">Words</span>
          </div>
        </div>
        
        <div className="ses-essay-stats-item">
          <div className="ses-essay-stats-icon">
            <FileText size={16} />
          </div>
          <div className="ses-essay-stats-info">
            <span className="ses-essay-stats-value">{stats.characters}</span>
            <span className="ses-essay-stats-label">Characters</span>
          </div>
        </div>
        
        <div className="ses-essay-stats-item">
          <div className="ses-essay-stats-icon">
            <Book size={16} />
          </div>
          <div className="ses-essay-stats-info">
            <span className="ses-essay-stats-value">{stats.paragraphs}</span>
            <span className="ses-essay-stats-label">Paragraphs</span>
          </div>
        </div>
        
        <div className="ses-essay-stats-item">
          <div className="ses-essay-stats-icon">
            <Clock size={16} />
          </div>
          <div className="ses-essay-stats-info">
            <span className="ses-essay-stats-value">{stats.readingTime} min</span>
            <span className="ses-essay-stats-label">Reading Time</span>
          </div>
        </div>
        
        <div className="ses-essay-stats-item ses-full-width">
          <div className="ses-essay-stats-icon">
            <Edit size={16} />
          </div>
          <div className="ses-essay-stats-info">
            <span className="ses-essay-stats-value">{stats.wordsPerSentence}</span>
            <span className="ses-essay-stats-label">Words per Sentence</span>
          </div>
        </div>
      </div>
      
      <div className="ses-essay-stats-note">
        <p>
          Essays should generally be concise while completely addressing the prompt.
          The word count is a guideline, but focus on quality over quantity.
        </p>
      </div>
      
      <div className="ses-essay-sidebar-actions">
        <button 
          className="ses-essay-sidebar-button ses-primary"
          onClick={onRequestRevision}
          disabled={!currentVersion}
        >
          <PenTool size={16} />
          <span>Request Revision</span>
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="ses-essay-sidebar">
      <div className="ses-essay-sidebar-tabs">
        <button
          className={`ses-essay-sidebar-tab ${activeTab === 'history' ? 'ses-active' : ''}`}
          onClick={() => setActiveTab('history')}
          aria-label="Show version history"
        >
          <History size={16} />
          <span>History</span>
        </button>
        <button
          className={`ses-essay-sidebar-tab ${activeTab === 'stats' ? 'ses-active' : ''}`}
          onClick={() => setActiveTab('stats')}
          aria-label="Show statistics"
        >
          <BarChart2 size={16} />
          <span>Statistics</span>
        </button>
      </div>
      
      {renderTabContent()}
    </div>
  );
};

export default EssaySidebar; 