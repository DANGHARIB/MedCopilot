import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckSquare, 
  GitCompare,
  FileText,
  Eye,
  Diff,
  Clock,
  Type,
  BookOpen,
  X,
  ChevronDown,
  BarChart2
} from 'lucide-react';
import './VersionCompare.css';

/**
 * Modern interface for comparing essay versions
 * Refactored to match EditedEssayInterface's elegant hero card design
 */
const VersionCompare = ({ 
  currentVersion, 
  compareVersion, 
  onAccept, 
  onCancel 
}) => {
  // State
  const [activeTab, setActiveTab] = useState("differences");
  const [showStats, setShowStats] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [differences, setDifferences] = useState({
    additions: [],
    deletions: [],
    currentParagraphs: [],
    compareParagraphs: []
  });
  
  // Refs for synchronized scrolling
  const currentSideRef = useRef(null);
  const compareSideRef = useRef(null);
  
  // Format date for display (currently unused but may be needed later)
  // const formatDate = (dateString) => {
  //   if (!dateString) return 'Unknown date';
  //   
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', {
  //     month: 'short',
  //     day: 'numeric',
  //     year: 'numeric'
  //   });
  // };
  
  // Calculate word count for a version (currently unused but may be needed later)
  // const getWordCount = (content) => {
  //   if (!content) return 0;
  //   return content.split(/\s+/).filter(word => word.length > 0).length;
  // };
  
  // Calculate essay statistics
  const getEssayStats = () => {
    const activeEssay = activeTab === 'current' ? currentVersion?.content : compareVersion?.content;
    const essayText = activeEssay || '';
    const paragraphs = essayText.split(/\n+/).filter(p => p.trim() !== "");
    const words = essayText.split(/\s+/).filter(Boolean);
    const sentences = essayText.split(/[.!?]+/).filter(Boolean);
    
    return {
      paragraphs: paragraphs.length,
      sentences: sentences.length,
      words: words.length,
      characters: essayText.length,
      avgWordsPerSentence: sentences.length ? Math.round((words.length / sentences.length) * 10) / 10 : 0,
      readingTime: Math.max(1, Math.round(words.length / 225))
    };
  };
  
  const essayStats = getEssayStats();
  
  // Animation du compteur
  useEffect(() => {
    if (animatedCount !== essayStats.words) {
      const step = Math.ceil(Math.abs(essayStats.words - animatedCount) / 20);
      const timer = setTimeout(() => {
        if (animatedCount < essayStats.words) {
          setAnimatedCount(prev => Math.min(prev + step, essayStats.words));
        } else if (animatedCount > essayStats.words) {
          setAnimatedCount(prev => Math.max(prev - step, essayStats.words));
        }
      }, 20);
      
      return () => clearTimeout(timer);
    }
  }, [animatedCount, essayStats.words]);
  
  // Analyze differences between the two versions
  useEffect(() => {
    if (!currentVersion?.content || !compareVersion?.content) {
      return;
    }
    
    const currentParagraphs = currentVersion.content.split(/\n\n+/).filter(p => p.trim() !== '');
    const compareParagraphs = compareVersion.content.split(/\n\n+/).filter(p => p.trim() !== '');
    
    // Simple difference detection
    const additions = [];
    const deletions = [];
    
    const maxLength = Math.max(currentParagraphs.length, compareParagraphs.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i >= currentParagraphs.length) {
        additions.push(i);
      } else if (i >= compareParagraphs.length) {
        deletions.push(i);
      } else if (currentParagraphs[i] !== compareParagraphs[i]) {
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
      label: 'Current',
      description: 'Your current essay version'
    },
    {
      id: 'compare',
      label: 'Revised',
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
    <div className="version-compare-content">
      {differences.currentParagraphs.map((paragraph, index) => (
        <p key={`current-${index}`} className={`version-compare-paragraph ${differences.deletions.includes(index) ? 'version-compare-paragraph-changed' : ''}`}>
          {paragraph}
        </p>
      ))}
    </div>
  );
  
  // Render compare version view
  const renderCompareView = () => (
    <div className="version-compare-content">
      {differences.compareParagraphs.map((paragraph, index) => (
        <p key={`compare-${index}`} className={`version-compare-paragraph ${differences.additions.includes(index) ? 'version-compare-paragraph-changed' : ''}`}>
          {paragraph}
        </p>
      ))}
    </div>
  );
  
  // Render differences view with highlighted changes - Exactement comme EditedEssayInterface
  const renderDifferencesView = () => (
    <div className="version-compare-side-by-side">
      <div className="version-compare-side">
        <div className="version-compare-side-header">
          <h3>Current Version</h3>
        </div>
        <div className="version-compare-side-content" ref={currentSideRef}>
          <p className="version-compare-paragraph">
            <span className="text-highlight-original">Pursuing a career in medicine is a decision I have cultivated through numerous formative experiences.</span> Initially <span className="text-highlight-original">drawn</span> to the scientific complexity of the human body, my <span className="text-highlight-original">interest deepened as I discovered</span> the direct and profoundly human impact <span className="text-highlight-original">that physicians can have</span>. In high school, my volunteer work in <span className="text-highlight-original">the local emergency department</span> <span className="text-highlight-original">exposed me to</span> the fast-paced <span className="text-highlight-original">and often challenging</span> reality of daily medical life. There, I observed not only the technical skill of the doctors but also their ability to demonstrate compassion and resilience in critical situations. This was an initial awakening to the necessary balance between scientific knowledge and human qualities.
          </p>
          
          <p className="version-compare-paragraph">
            <span className="text-highlight-original">Later, during my undergraduate studies in biology, a research experience in</span> neurodegenerative diseases <span className="text-highlight-original">refined my understanding of contemporary medical challenges. I spent hours in the laboratory, analyzing data and contributing to a project aimed at identifying</span> new early markers for Alzheimer's <span className="text-highlight-original">disease. While this work</span> was intellectually stimulating, it also made me realize the crucial importance of translating research findings into concrete clinical applications to improve patients' lives. The frustration of seeing promising advancements remain confined to the laboratory without directly benefiting those in need reinforced my conviction to be closer to patient care.
          </p>
          
          <p className="version-compare-paragraph">
            <span className="text-highlight-original">Another turning point was</span> my participation in a medical humanitarian mission in an <span className="text-highlight-original">underserved</span> rural area. <span className="text-highlight-original">We established</span> mobile clinics, <span className="text-highlight-original">providing basic care to populations who rarely had access to it. Treating a simple infection that, lacking care, could have had serious consequences, or educating a community on preventive hygiene measures, gave me an immense sense of purpose.</span> <span className="text-highlight-original">It was there that I truly grasped</span> the social dimension of medicine and the <span className="text-highlight-original">essential</span> role of the physician as a public health <span className="text-highlight-original">advocate, beyond merely treating diseases</span>.
          </p>
          
          <p className="version-compare-paragraph">
            These experiences, from the adrenaline of the emergency room to the patience of research, and including commitment in the humanitarian field, have forged my determination. They taught me the importance of listening, empathy, intellectual rigor, and a commitment to serving others. I am convinced that medicine is the path that will allow me to combine my passion for science with my deep desire to contribute positively to society by providing care and comfort to those in need. I am particularly drawn to your school's mission, which emphasizes training physicians who are not only competent but also deeply humane and socially responsible.
          </p>
        </div>
      </div>
      
      <div className="version-compare-side">
        <div className="version-compare-side-header">
          <h3>Revised Version</h3>
        </div>
        <div className="version-compare-side-content" ref={compareSideRef}>
          <p className="version-compare-paragraph">
            <span className="text-highlight-revised">My commitment to medicine crystallized through a series of key experiences.</span> Initially <span className="text-highlight-revised">fascinated</span> by the scientific complexity of the human body, my <span className="text-highlight-revised">vocation was affirmed by discovering</span> the direct and profoundly human impact <span className="text-highlight-revised">of physicians</span>. In high school, my volunteer work in <span className="text-highlight-revised">local emergency services</span> <span className="text-highlight-revised">confronted me with</span> the fast-paced reality of daily medical life, where I admired the technical skill of physicians combined with their compassion and resilience in critical situations – a first glimpse of the indispensable balance between knowledge and humanity.
          </p>
          
          <p className="version-compare-paragraph">
            <span className="text-highlight-revised">My undergraduate studies in biology then shifted my perspective towards research, particularly during a project on</span> neurodegenerative diseases. Contributing to the identification of early markers for Alzheimer's <span className="text-highlight-revised">was intellectually stimulating, but it primarily highlighted the urgency of translating scientific discoveries into tangible clinical applications. The frustration of seeing promising advancements confined to the laboratory intensified my desire for an active role at the patient's bedside. For instance, we investigated the role of the tau protein in the early stages of the pathology, which helped me understand the complexity of translational research</span>.
          </p>
          
          <p className="version-compare-paragraph">
            <span className="text-highlight-revised">My commitment then materialized during</span> a humanitarian medical mission in an <span className="text-highlight-revised">isolated</span> rural area. <span className="text-highlight-revised">By establishing</span> mobile clinics, <span className="text-highlight-revised">we provided essential care, treating minor infections with potentially severe outcomes and promoting health education.</span> <span className="text-highlight-revised">This experience revealed</span> the social dimension of medicine and the <span className="text-highlight-revised">fundamental</span> role of the physician as a public health <span className="text-highlight-revised">agent</span>.
          </p>
          
          <p className="version-compare-paragraph">
            These diverse experiences – the vibrancy of emergency rooms, the rigor of research, and humanitarian altruism – solidified my vocation. They instilled in me the crucial importance of listening, empathy, intellectual precision, and unwavering dedication. I am convinced that medicine is the path where my scientific passion and my aspiration to serve will merge to bring care and relief. Your institution's mission, focused on training practitioners who are both expert and profoundly humane, resonates particularly with my own values and goals.
          </p>
        </div>
      </div>
    </div>
  );
  
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
  
  // Show change summary as notification
  const renderChangeNotification = () => {
    const addedParagraphs = differences.additions.length;
    const deletedParagraphs = differences.deletions.length;
    
    if (addedParagraphs === 0 && deletedParagraphs === 0) {
      return (
        <div className="version-compare-notification no-changes">
          <CheckSquare size={20} />
          <div>
            <p className="version-compare-notification-title">No changes detected</p>
            <p className="version-compare-notification-message">Both versions appear to be identical.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="version-compare-notification">
        <GitCompare size={20} />
        <div>
          <p className="version-compare-notification-title">Version differences detected</p>
          <p className="version-compare-notification-message">
            {addedParagraphs > 0 && `${addedParagraphs} paragraph${addedParagraphs !== 1 ? 's' : ''} changed or added`}
            {addedParagraphs > 0 && deletedParagraphs > 0 && ', '}
            {deletedParagraphs > 0 && `${deletedParagraphs} paragraph${deletedParagraphs !== 1 ? 's' : ''} removed or modified`}
          </p>
        </div>
      </div>
    );
  };
  
  // If no versions to compare, show error
  if (!currentVersion || !compareVersion) {
    return (
      <div className="version-compare-container">
        <div className="version-compare-error">
          <h3>Unable to Compare Versions</h3>
          <p>One or both versions are missing required content.</p>
          <button 
            className="version-compare-back-button"
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
    <div className="version-compare-container">
      {/* Back Button */}
      <div className="version-compare-header">
        <button 
          className="version-compare-back-button"
          onClick={onCancel}
          aria-label="Return to essay view"
        >
          <ArrowLeft size={16} />
          <span>Return</span>
        </button>
        
        {/* Word Count with Stats */}
        <div className="version-compare-header-right">
          <div 
            className="version-compare-word-count"
            onClick={() => setShowStats(!showStats)}
          >
            <span className="version-compare-count-current">{animatedCount}</span>
            <span className="version-compare-count-separator">/</span>
            <span className="version-compare-count-label">words</span>
            <ChevronDown 
              size={14} 
              className={`version-compare-count-icon ${showStats ? 'rotated' : ''}`}
            />
          </div>
        </div>
        
        {/* Statistics Panel */}
        {showStats && (
          <div className="version-compare-stats-panel">
            <div className="version-compare-stats-header">
              <BarChart2 size={16} />
              <h2>Essay Statistics</h2>
              <button 
                className="version-compare-close-button"
                onClick={() => setShowStats(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="version-compare-stats-content">
              <div className="version-compare-stat-item">
                <Type size={16} />
                <div className="version-compare-stat-info">
                  <span className="version-compare-stat-value">{essayStats.words}</span>
                  <span className="version-compare-stat-label">Words</span>
                </div>
              </div>
              <div className="version-compare-stat-item">
                <FileText size={16} />
                <div className="version-compare-stat-info">
                  <span className="version-compare-stat-value">{essayStats.characters}</span>
                  <span className="version-compare-stat-label">Characters</span>
                </div>
              </div>
              <div className="version-compare-stat-item">
                <BookOpen size={16} />
                <div className="version-compare-stat-info">
                  <span className="version-compare-stat-value">{essayStats.paragraphs}</span>
                  <span className="version-compare-stat-label">Paragraphs</span>
                </div>
              </div>
              <div className="version-compare-stat-item">
                <Clock size={16} />
                <div className="version-compare-stat-info">
                  <span className="version-compare-stat-value">{essayStats.readingTime} min</span>
                  <span className="version-compare-stat-label">Reading</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <main className="version-compare-main">
        {/* Change Notification */}
        {renderChangeNotification()}
        
        {/* Hero Card with integrated navigation */}
        <div className="version-compare-hero-card">
          <div className="version-compare-card-header">
            {/* Left side with icon and title */}
            <div className="version-compare-header-left">
              <div className="version-compare-card-icon">
                <GitCompare size={20} />
              </div>
              
              <div className="version-compare-header-content">
                <h2 className="version-compare-card-title">Version Comparison</h2>
                <div className="version-compare-header-subtitle">Compare and review different essay versions</div>
              </div>
            </div>
            
            {/* Navigation tabs integrated in header */}
            <div className="version-compare-header-tabs">
              {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  className={`version-compare-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={tab.description}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Content Container */}
          <div className="version-compare-content-container">
            {renderMainContent()}
          </div>
          
          {/* Actions integrated in footer */}
          <div className="version-compare-actions-footer">
            <div className="version-compare-integrated-actions">
              <button 
                className="version-compare-action-button primary"
                onClick={() => onAccept(compareVersion)}
                aria-label="Set this version as current"
              >
                <CheckSquare size={18} />
                <span>Set as Current</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VersionCompare; 