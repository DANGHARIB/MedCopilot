import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Type, 
  School, 
  Settings,
  ArrowLeft,
  ArrowRight,
  Info,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import "./EssayStep1.css";

/**
 * Enhanced modern interface for essay configuration with vertical sidebar navigation
 * Completely redesigned for improved clarity and user flow
 */
const EssayStep1 = ({ 
  essayData, 
  onChange, 
  schoolName = "Medical School",
  onSubmit
}) => {
  // State for the active section - default to 'prompt'
  const [activeSection, setActiveSection] = useState('prompt');
  
  // Track which sections have valid data (but not necessarily completed in the flow)
  const [sectionValidation, setSectionValidation] = useState({
    prompt: false,
    format: false,
    school: false,
    style: false
  });
  
  // Track the overall completion percentage
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  // Enhanced state for improved UX
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [limitType, setLimitType] = useState(essayData.limitType || 'words');
  const [animatedWordCount, setAnimatedWordCount] = useState(
    limitType === 'words' ? (essayData.wordLimit || 500) : (essayData.characterLimit || 2500)
  );
  
  // Common prompts
  const commonPrompts = [
    "Describe how your background and experiences have shaped your decision to pursue a career in medicine.",
    "Describe a challenge or obstacle you have faced and how it has influenced your journey toward a career in medicine.",
    "How will your unique attributes and experiences contribute to the diversity of our incoming class and enhance the Harvard Medical School community?",
    "Reflect on a meaningful experience and explain how it has influenced your decision to become a physician.",
    "Describe a time when you witnessed or experienced inequity in healthcare and how it affected your perspective."
  ];
  
  // Style examples
  const toneExamples = {
    professional: "As a candidate for medical school, I have pursued research opportunities that have deepened my understanding of human physiology.",
    conversational: "When I first started working in the lab, I was honestly surprised by how much I enjoyed the hands-on aspects of research."
  };
  
  const styleExamples = {
    narrative: "During my sophomore year, I volunteered at the local hospital. Each Thursday, I would arrive before dawn to assist the nursing staff...",
    analytical: "My experience in clinical settings can be analyzed through three key dimensions: patient interaction, interdisciplinary collaboration, and technical skill application."
  };

  // Navigation sections configuration
  const sections = [
    { 
      id: 'prompt', 
      label: 'Essay Prompt', 
      icon: <FileText size={18} />,
      nextSection: 'format',
      prevSection: null,
      isRequired: true,
      stepNumber: 1
    },
    { 
      id: 'format', 
      label: 'Length & Format', 
      icon: <Type size={18} />,
      nextSection: 'school',
      prevSection: 'prompt',
      isRequired: true,
      stepNumber: 2
    },
    { 
      id: 'school', 
      label: 'School Info', 
      icon: <School size={18} />,
      nextSection: 'style',
      prevSection: 'format',
      isRequired: true,
      stepNumber: 3
    },
    { 
      id: 'style', 
      label: 'Style & Tone', 
      icon: <Settings size={18} />,
      nextSection: null,
      prevSection: 'school',
      isRequired: true,
      stepNumber: 4
    }
  ];
  
  // Animated word count effect
  useEffect(() => {
    const targetCount = limitType === 'words' ? (essayData.wordLimit || 500) : (essayData.characterLimit || 2500);
    
    if (animatedWordCount !== targetCount) {
      const step = Math.ceil(Math.abs(targetCount - animatedWordCount) / 20);
      const timer = setTimeout(() => {
        if (animatedWordCount < targetCount) {
          setAnimatedWordCount(prev => Math.min(prev + step, targetCount));
        } else if (animatedWordCount > targetCount) {
          setAnimatedWordCount(prev => Math.max(prev - step, targetCount));
        }
      }, 20);
      
      return () => clearTimeout(timer);
    }
  }, [animatedWordCount, limitType, essayData.wordLimit, essayData.characterLimit]);
  
  // Update section validation when essayData changes
  useEffect(() => {
    const newValidation = {
      prompt: Boolean(essayData.prompt || essayData.selectedPrompt),
      format: Boolean(essayData.wordLimit || essayData.characterLimit),
      school: Boolean(essayData.schoolMission),
      style: Boolean(essayData.tone && essayData.style)
    };
    
    setSectionValidation(newValidation);
    
    // Calculate completion percentage based on validated sections
    const completedSections = Object.values(newValidation).filter(val => val).length;
    const totalSections = Object.keys(newValidation).length;
    setCompletionPercentage(Math.round((completedSections / totalSections) * 100));
  }, [essayData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show tips with Ctrl+H
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        setShowTipsModal(true);
      }
      
      // Close modals with Escape
      if (e.key === 'Escape') {
        if (showTipsModal) setShowTipsModal(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTipsModal]);
  
  // Handle custom prompt text change
  const handlePromptChange = (e) => {
    onChange({ prompt: e.target.value, selectedPrompt: "" });
  };

  // Handle selection of a predefined prompt
  const handleSelectPrompt = (prompt) => {
    onChange({ selectedPrompt: prompt, prompt: "" });
  };

  // Handle custom word limit input
  const handleCustomWordLimit = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (limitType === 'words') {
        onChange({ 
          wordLimit: value === "" ? "" : parseInt(value), 
          limitType: 'words' 
        });
      } else {
        onChange({ 
          characterLimit: value === "" ? "" : parseInt(value), 
          limitType: 'characters' 
        });
      }
    }
  };

  // Handle limit type change
  const handleLimitTypeChange = (type) => {
    setLimitType(type);
    
    if (type === 'characters' && essayData.wordLimit) {
      onChange({ 
        characterLimit: essayData.wordLimit * 5,
        limitType: 'characters'
      });
    } else if (type === 'words' && essayData.characterLimit) {
      onChange({ 
        wordLimit: Math.round(essayData.characterLimit / 5),
        limitType: 'words' 
      });
    } else {
      onChange({ limitType: type });
    }
  };

  // Handle slider change
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    if (limitType === 'words') {
      onChange({ 
        wordLimit: value,
        limitType: 'words'
      });
    } else {
      onChange({ 
        characterLimit: value,
        limitType: 'characters'
      });
    }
  };

  // Handle tone selection
  const handleToneChange = (tone) => {
    onChange({ tone });
  };

  // Handle style selection
  const handleStyleChange = (style) => {
    onChange({ style });
  };
  
  // Handle school mission change
  const handleSchoolMissionChange = (e) => {
    onChange({ schoolMission: e.target.value });
  };

  // Define slider props based on limit type
  const getSliderProps = () => {
    if (limitType === 'words') {
      return {
        min: 250,
        max: 1000,
        step: 50,
        value: essayData.wordLimit || 500,
        labels: [250, 500, 750, 1000]
      };
    } else {
      return {
        min: 1000,
        max: 5000,
        step: 250,
        value: essayData.characterLimit || 2500,
        labels: [1000, 2500, 4000, 5000]
      };
    }
  };

  // Navigation functions
  const goToNextSection = () => {
    const currentSection = sections.find(section => section.id === activeSection);
    if (currentSection && currentSection.nextSection) {
      setActiveSection(currentSection.nextSection);
      // Scroll to top on section change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // We've reached the end, try to submit
      if (isAllSectionsComplete()) {
        onSubmit();
      }
    }
  };
  
  const goToPrevSection = () => {
    const currentSection = sections.find(section => section.id === activeSection);
    if (currentSection && currentSection.prevSection) {
      setActiveSection(currentSection.prevSection);
      // Scroll to top on section change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Get the label for the "Next" button
  const getNextButtonLabel = () => {
    const currentSection = sections.find(section => section.id === activeSection);
    if (currentSection && currentSection.nextSection) {
      const nextSection = sections.find(section => section.id === currentSection.nextSection);
      return `Continue to ${nextSection.label}`;
    }
    return 'Generate Essay';
  };
  
  // Check if current section is complete to enable the "Next" button
  const isCurrentSectionComplete = () => {
    return sectionValidation[activeSection];
  };
  
  // Check if all sections are complete to enable the "Generate Essay" button
  const isAllSectionsComplete = () => {
    return completionPercentage === 100;
  };

  // Get the current section's step number (for the progress info)
  const getCurrentSectionNumber = () => {
    const currentSection = sections.find(section => section.id === activeSection);
    return currentSection ? currentSection.stepNumber : 1;
  };

  // Determine the state of each section (inactive, active, completed)
  const getSectionState = (sectionId) => {
    const sectionIndex = sections.findIndex(section => section.id === sectionId);
    const activeIndex = sections.findIndex(section => section.id === activeSection);
    
    if (sectionIndex === activeIndex) {
      return 'active';
    } else if (sectionIndex < activeIndex && sectionValidation[sectionId]) {
      return 'completed';
    } else {
      return 'inactive';
    }
  };

  // Render section icon - always show original icon, only the number changes to checkmark
  const renderSectionIcon = (section) => {
    return section.icon;
  };

  // Render section number based on state
  const renderSectionNumber = (section, index) => {
    const state = getSectionState(section.id);
    
    if (state === 'completed') {
      return <CheckCircle size={16} />;
    } else {
      return <span>{index + 1}</span>;
    }
  };

  const sliderProps = getSliderProps();
  
  return (
    <div className="essay-creator">
      <div className="essay-creator-main">
        {/* Sidebar Navigation */}
        <nav className="essay-creator-sidebar">
          <div className="essay-creator-sections">
            {sections.map((section, index) => {
              const state = getSectionState(section.id);
              
              return (
              <button
                key={section.id}
                  className={`essay-creator-section-button ${state}`}
                onClick={() => setActiveSection(section.id)}
                  aria-current={state === 'active' ? "step" : undefined}
                  aria-label={`${section.label} ${state === 'completed' ? '(completed)' : ''}`}
              >
                <div className="essay-creator-section-number">
                    {renderSectionNumber(section, index)}
                </div>
                <div className="essay-creator-section-label">
                    {renderSectionIcon(section)}
                  <span>{section.label}</span>
                </div>
              </button>
              );
            })}
          
          <div className="essay-creator-progress-info">
            <div className="essay-creator-step-info">
              <h3>Essay Configuration</h3>
                <p>Step {getCurrentSectionNumber()} of 4</p>
            </div>
            <div className="essay-creator-completion-text">
              <p>Complete all 4 sections before</p>
              <p>generating your essay</p>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <div className="essay-creator-content">
          {/* Prompt Section */}
          {activeSection === 'prompt' && (
            <div className="essay-creator-content-section">
              <div className="essay-creator-section-header">
                <h2><span>1.</span> Essay Prompt</h2>
                <p>Enter the exact prompt from your application for best results.</p>
              </div>
              
              <div className="essay-creator-form-group">
                <textarea
                  className="essay-creator-textarea"
                  placeholder="Paste the exact essay prompt from your application here..."
                  value={essayData.prompt || ''}
                  onChange={handlePromptChange}
                  rows={8}
                />
                
                {essayData.prompt && (
                  <div className="essay-creator-character-count">
                    <span>{essayData.prompt.length} characters</span>
                  </div>
                )}
              </div>
              
              <div className="essay-creator-section-subheader">
                <h3>Common Prompts</h3>
                <p>Or select from these frequently used medical school essay prompts.</p>
              </div>
              
              <div className="essay-creator-prompts-list">
                {commonPrompts.map((prompt, index) => (
                  <div 
                    key={index}
                    className={`essay-creator-prompt-card ${prompt === essayData.selectedPrompt ? 'selected' : ''}`}
                    onClick={() => handleSelectPrompt(prompt)}
                  >
                    <p>{prompt}</p>
                    {prompt === essayData.selectedPrompt && (
                      <div className="essay-creator-prompt-check">
                        <CheckCircle size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Format Section */}
          {activeSection === 'format' && (
            <div className="essay-creator-content-section">
              <div className="essay-creator-section-header">
                <h2><span>2.</span> Length & Format</h2>
                <p>Set the maximum length for your essay as specified in your application.</p>
              </div>
              
              <div className="essay-creator-form-group">
                <div className="essay-creator-toggle-group limit-toggle">
                  <button
                    className={`essay-creator-toggle-option ${limitType === 'words' ? 'active' : ''}`}
                    onClick={() => handleLimitTypeChange('words')}
                    type="button"
                  >
                    <FileText size={16} />
                    <span>Word Count</span>
                  </button>
                  
                  <button
                    className={`essay-creator-toggle-option ${limitType === 'characters' ? 'active' : ''}`}
                    onClick={() => handleLimitTypeChange('characters')}
                    type="button"
                  >
                    <Type size={16} />
                    <span>Character Count</span>
                  </button>
                </div>
                
                <div className="essay-creator-limit-container">
                  <div className="essay-creator-input-group">
                    <label className="essay-creator-label">Enter exact limit:</label>
                    <input
                      type="text"
                      className="essay-creator-input"
                      value={limitType === 'words' ? essayData.wordLimit || '' : essayData.characterLimit || ''}
                      onChange={handleCustomWordLimit}
                      placeholder={limitType === 'words' ? "Word count" : "Character count"}
                    />
                    <span className="essay-creator-input-suffix">{limitType}</span>
                  </div>
                  
                  <div className="essay-creator-slider-container">
                    <label className="essay-creator-label">Or use the slider:</label>
                    <input 
                      type="range" 
                      min={sliderProps.min}
                      max={sliderProps.max}
                      step={sliderProps.step}
                      value={sliderProps.value || 0}
                      onChange={handleSliderChange}
                      className="essay-creator-slider"
                    />
                    
                    <div className="essay-creator-slider-labels">
                      {sliderProps.labels.map((label, index) => (
                        <span key={index}>{label}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="essay-creator-limit-display">
                  <div className="essay-creator-limit-value">
                    <span className="essay-creator-limit-number">
                      {animatedWordCount}
                    </span>
                    <span className="essay-creator-limit-unit">{limitType}</span>
                  </div>
                  
                  <div className="essay-creator-limit-info">
                    {limitType === 'words' ? (
                      <span>Approximately {Math.round(animatedWordCount * 5)} characters</span>
                    ) : (
                      <span>Approximately {Math.round(animatedWordCount / 5)} words</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="essay-creator-tip-box">
                <HelpCircle size={18} />
                <div>
                  <h4>Format Tip</h4>
                  <p>Essays slightly under the maximum limit are generally preferred by admissions committees.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* School Section */}
          {activeSection === 'school' && (
            <div className="essay-creator-content-section">
              <div className="essay-creator-section-header">
                <h2><span>3.</span> School Information</h2>
                <p>Enter details about {schoolName} to tailor your essay.</p>
              </div>
              
              <div className="essay-creator-school-info">
                <div className="essay-creator-form-group">
                  <label className="essay-creator-label">
                    School Mission Statement or Core Values
                    <span className="essay-creator-required-badge">Required</span>
                  </label>
                  <textarea
                    className="essay-creator-textarea"
                    placeholder="Enter the school's mission statement, values, or specific focus areas..."
                    value={essayData.schoolMission || ''}
                    onChange={handleSchoolMissionChange}
                    rows={8}
                  />
                  
                  <div className="essay-creator-field-hint">
                    <Info size={14} />
                    <span>Including the school's mission helps tailor your essay to their values and priorities.</span>
                  </div>
                </div>
              </div>
              
              <div className="essay-creator-alignment-illustration">
                <div className="essay-creator-alignment-school">
                  <School size={20} />
                  <span>School Values</span>
                </div>
                <div className="essay-creator-alignment-connector">
                  <ArrowRight size={16} />
                </div>
                <div className="essay-creator-alignment-essay">
                  <FileText size={20} />
                  <span>Your Essay</span>
                </div>
              </div>
              
              <div className="essay-creator-tip-box">
                <AlertCircle size={18} />
                <div>
                  <h4>Why This Matters</h4>
                  <p>Essays that demonstrate knowledge of the school and alignment with its values stand out to admissions committees.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Style Section */}
          {activeSection === 'style' && (
            <div className="essay-creator-content-section">
              <div className="essay-creator-section-header">
                <h2><span>4.</span> Style & Tone</h2>
                <p>Customize the tone and style of your essay.</p>
              </div>
              
              <div className="essay-creator-style-options">
                <div className="essay-creator-style-group">
                  <h3>Tone</h3>
                  
                  <div className="essay-creator-toggle-group">
                    <button
                      className={`essay-creator-toggle-option ${essayData.tone === 'professional' ? 'active' : ''}`}
                      onClick={() => handleToneChange('professional')}
                      type="button"
                    >
                      <School size={18} />
                      <span>Professional</span>
                    </button>
                    
                    <button
                      className={`essay-creator-toggle-option ${essayData.tone === 'conversational' ? 'active' : ''}`}
                      onClick={() => handleToneChange('conversational')}
                      type="button"
                    >
                      <MessageSquare size={18} />
                      <span>Conversational</span>
                    </button>
                  </div>
                  
                  <div className="essay-creator-style-example">
                    <div className="essay-creator-example-label">Example:</div>
                    <div className="essay-creator-example-text">
                      {toneExamples[essayData.tone || 'professional']}
                    </div>
                  </div>
                </div>
                
                <div className="essay-creator-style-group">
                  <h3>Writing Style</h3>
                  
                  <div className="essay-creator-toggle-group">
                    <button
                      className={`essay-creator-toggle-option ${essayData.style === 'narrative' ? 'active' : ''}`}
                      onClick={() => handleStyleChange('narrative')}
                      type="button"
                    >
                      <FileText size={18} />
                      <span>Narrative</span>
                    </button>
                    
                    <button
                      className={`essay-creator-toggle-option ${essayData.style === 'analytical' ? 'active' : ''}`}
                      onClick={() => handleStyleChange('analytical')}
                      type="button"
                    >
                      <Settings size={18} />
                      <span>Analytical</span>
                    </button>
                  </div>
                  
                  <div className="essay-creator-style-example">
                    <div className="essay-creator-example-label">Example:</div>
                    <div className="essay-creator-example-text">
                      {styleExamples[essayData.style || 'narrative']}
                    </div>
                  </div>
                </div>
                
                <div className="essay-creator-tip-box">
                  <HelpCircle size={18} />
                  <div>
                    <h4>Style Recommendation</h4>
                    <p>For personal statements, a professional tone with narrative style generally works best.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="essay-creator-footer">
        <div className="essay-creator-actions">
          <button 
            className="essay-creator-button secondary"
            onClick={goToPrevSection}
            disabled={!sections.find(section => section.id === activeSection)?.prevSection}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          
          {activeSection === sections[sections.length - 1].id && isAllSectionsComplete() ? (
            <button 
              className="essay-creator-button primary"
              onClick={onSubmit}
              disabled={!isAllSectionsComplete()}
            >
              <span>Generate Essay</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              className="essay-creator-button primary"
              onClick={goToNextSection}
              disabled={!isCurrentSectionComplete()}
            >
              <span>{getNextButtonLabel()}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
      
      {/* Tips Modal (if needed) */}
      {showTipsModal && (
        <div className="essay-creator-modal-overlay" onClick={() => setShowTipsModal(false)}>
          <div 
            className="essay-creator-modal" 
            onClick={e => e.stopPropagation()}
          >
            <div className="essay-creator-modal-header">
              <h2>Essay Writing Tips</h2>
              <button 
                className="essay-creator-modal-close"
                onClick={() => setShowTipsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="essay-creator-modal-content">
              {/* Modal content */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayStep1;