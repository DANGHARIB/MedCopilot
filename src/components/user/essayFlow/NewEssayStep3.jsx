import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Edit3,
  Save,
  MessageSquare,
  Lightbulb,
  X,
  CheckCircle,
  Maximize2,
  Moon,
  Sun,
  Eye,
  MinusCircle,
  ChevronRight,
  ChevronDown,
  BarChart2,
  FileText,
  Clock,
  Type,
  BookOpen,
  Star,
  Settings,
  Bookmark,
  Minimize2
} from "lucide-react";
import "./NewEssayStep3.css";

/**
 * NewEssayStep3 - Revolutionary essay editing interface
 * Combines Step2's hero layout with Step3's annotation power
 * Features: Essay Hero + AI Edit Mode + Non-intrusive Notes Widget
 */
const NewEssayStep3 = ({ 
  essayData,
  onSubmitRevision,
  school
}) => {
  // State management
  const [selectionActive, setSelectionActive] = useState(false);
  const [selectionCoords, setSelectionCoords] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [selectionNote, setSelectionNote] = useState("");
  const [allRevisionNotes, setAllRevisionNotes] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  
  // Enhanced UX states
  const [hasUnseenNotes, setHasUnseenNotes] = useState(false);
  const [justAddedNote, setJustAddedNote] = useState(false);
  const [noteCountAnimation, setNoteCountAnimation] = useState(false);
  
  // Enhanced features
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  
  // AI Edit Mode - inspired by Step2
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Note categories
  const [noteCategories] = useState([
    { id: 'clarity', label: 'Clarity', color: '#4361ee' },
    { id: 'structure', label: 'Structure', color: '#7209b7' },
    { id: 'style', label: 'Style', color: '#3a0ca3' },
    { id: 'grammar', label: 'Grammar', color: '#06d6a0' },
    { id: 'content', label: 'Content', color: '#f72585' }
  ]);
  const [activeCategory, setActiveCategory] = useState(noteCategories[0].id);
  
  // Refs
  const essayContentRef = useRef(null);
  const selectionInputRef = useRef(null);
  const tipsModalRef = useRef(null);
  const notesModalRef = useRef(null);
  
  // Dummy essay text
  const dummyEssay = `During my sophomore year of college, I faced a significant challenge when my mother was diagnosed with an aggressive form of breast cancer. As the eldest child in a single-parent household, I suddenly found myself balancing my pre-medical studies with family responsibilities, including caring for my younger siblings and accompanying my mother to chemotherapy appointments.

The hospital became my second classroom. While sitting with my mother during her treatments, I observed the medical team's approach—not just their technical expertise, but their communication styles and bedside manner. Some physicians took the time to explain complex procedures in accessible language, addressing our concerns with patience. Others, though clinically competent, seemed detached, leaving us with unanswered questions and anxiety.

This contrast was illuminating. I realized that excellent healthcare requires both scientific knowledge and genuine human connection. When a compassionate oncology nurse taught me how to monitor my mother's post-treatment symptoms, I experienced firsthand how empowerment through education can transform a patient's family from helpless bystanders to engaged participants in the healing process.

The challenge of balancing academics with caregiving responsibilities taught me valuable lessons in time management and prioritization—all essential for a physician. I learned to use every available moment efficiently, studying between classes and during hospital waits. More importantly, I developed emotional resilience. When my mother experienced severe treatment side effects, I couldn't allow myself to collapse under stress; instead, I needed to remain calm and focused to support her.

My academic performance initially suffered, with my GPA dropping during that difficult semester. However, rather than use my circumstances as an excuse, I sought help from professors and academic resources, eventually recovering academically while maintaining my caregiving responsibilities. This experience taught me the importance of seeking support when faced with overwhelming challenges—another crucial lesson for my future in medicine.

Today, my mother is in remission, and this journey has fundamentally shaped my approach to medicine. I no longer view healthcare as simply diagnosing and treating illnesses; I see it as a partnership between medical professionals, patients, and their families. I understand that behind every medical case is a human story with emotional, social, and practical dimensions that significantly impact treatment outcomes.

This perspective has influenced my volunteer work at the student-run clinic, where I make a conscious effort to listen deeply to patients' concerns, considering their life circumstances when discussing treatment options. It has also guided my research interests toward studying how social support networks affect cancer treatment adherence and outcomes.

The obstacle I faced didn't deter me from pursuing medicine—it clarified why I want to become a physician: to provide the kind of comprehensive, compassionate care that treats the person, not just the disease. This challenge has equipped me with empathy, resilience, and perspective that textbooks alone could never teach, preparing me to be the kind of physician who recognizes that healing involves both science and humanity.`;
  
  // Initialize essay content
  useEffect(() => {
    const essayText = essayData?.generatedEssay || dummyEssay;
    setEditedContent(essayText);
  }, [essayData]);
  
  // Count words and characters
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };
  
  const countCharacters = (text) => {
    if (!text) return 0;
    return text.length;
  };
  
  const isCountingCharacters = essayData?.limitType === 'characters';
  const maxCount = isCountingCharacters 
    ? (essayData?.characterLimit || 2500) 
    : (essayData?.wordLimit || 500);
  const currentCount = isCountingCharacters 
    ? countCharacters(editedContent) 
    : countWords(editedContent);
  const countLabel = isCountingCharacters ? "characters" : "words";
  
  // Toggle focus mode
  const toggleFocusMode = useCallback(() => {
    setFocusMode(!focusMode);
    if (!focusMode) {
      setShowStats(false);
      setShowNotesModal(false);
    }
  }, [focusMode]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle focus mode with Ctrl+F
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        toggleFocusMode();
      }
      
      // Toggle dark mode with Ctrl+D
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setDarkMode(!darkMode);
      }
      
      // Enter edit mode with Ctrl+E (only if not already editing)
      if (e.ctrlKey && e.key === 'e' && !isEditing) {
        e.preventDefault();
        handleEnterEditMode();
      }
      
      // Save changes in edit mode with Ctrl+S
      if (e.ctrlKey && e.key === 's' && isEditing) {
        e.preventDefault();
        handleSaveChanges();
      }
      
      // Submit with Ctrl+Enter
      if (e.ctrlKey && e.key === 'Enter' && allRevisionNotes.length > 0) {
        e.preventDefault();
        submitRevision();
      }
      
      // Escape to close modals/editing
      if (e.key === 'Escape') {
        if (showTipsModal) setShowTipsModal(false);
        if (showStats) setShowStats(false);
        if (showNotesModal) setShowNotesModal(false);
        if (selectionActive) setSelectionActive(false);
        if (focusMode) toggleFocusMode();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusMode, darkMode, allRevisionNotes, showTipsModal, showStats, showNotesModal, selectionActive, isEditing, toggleFocusMode]);
  
  // AI Edit Mode handlers
  const handleEnterEditMode = () => {
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };
  
  const handleExitEditMode = () => {
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };
  
  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
    setHasUnsavedChanges(true);
  };
  
  const handleSaveChanges = () => {
    // Update the essay data with edited content
    if (essayData) {
      essayData.generatedEssay = editedContent;
    }
    
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };
  
  const handleCancelChanges = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm('Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir annuler ?');
      if (!confirmCancel) return;
    }
    
    const originalText = essayData?.generatedEssay || dummyEssay;
    setEditedContent(originalText);
    handleExitEditMode();
  };
  
  // Handle text selection for notes
  const handleTextSelection = () => {
    if (isEditing) return; // Don't allow selection in edit mode
    
    const selection = window.getSelection();
    
    if (selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const essayRect = essayContentRef.current.getBoundingClientRect();
      
      setSelectionCoords({
        x: rect.left - essayRect.left,
        y: rect.bottom - essayRect.top
      });
      
      setSelectedText(selection.toString());
      setSelectionNote("");
      setSelectionActive(true);
    }
  };
  
  // Handle saving the selection note
  const handleSelectionNoteSave = () => {
    if (selectionNote.trim() !== "") {
      const newNote = {
        selectedText: selectedText,
        instruction: selectionNote,
        id: Date.now(),
        category: activeCategory,
        color: noteCategories.find(cat => cat.id === activeCategory)?.color || noteCategories[0].color
      };
      
      setAllRevisionNotes(prev => [...prev, newNote]);
      setSelectionActive(false);
      setSelectionNote("");
      
      // Enhanced UX: Trigger animations
      setJustAddedNote(true);
      setNoteCountAnimation(true);
      setHasUnseenNotes(true);
      
      // Reset animation states
      setTimeout(() => {
        setJustAddedNote(false);
        setNoteCountAnimation(false);
      }, 1000);
      
      // Add visual highlight to the text
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'new-essay-highlighted-text';
        span.dataset.noteId = newNote.id;
        span.style.backgroundColor = `${newNote.color}20`;
        span.style.borderBottom = `2px solid ${newNote.color}`;
        span.style.setProperty('--note-color', newNote.color);
        
        try {
          range.surroundContents(span);
          selection.removeAllRanges();
        } catch(e) {
          console.warn('Could not highlight text', e);
        }
      }
    }
  };
  
  // Handle key press in the selection input
  const handleSelectionKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSelectionNoteSave();
    }
  };
  
  // Generate final revision instructions
  const generateRevisionInstructions = () => {
    if (allRevisionNotes.length === 0) return "No specific instructions provided.";
    
    return allRevisionNotes.map((note, index) => {
      const categoryLabel = noteCategories.find(cat => cat.id === note.category)?.label || note.category;
      return `${index + 1}. Category: ${categoryLabel}\nSelected Text: "${note.selectedText}"\nInstruction: ${note.instruction}`;
    }).join("\n\n");
  };
  
  // Submit all notes for revision
  const submitRevision = () => {
    const finalInstructions = generateRevisionInstructions();
    setShowNotesModal(false);
    onSubmitRevision(finalInstructions, allRevisionNotes);
  };
  
  // Clear all revision notes
  const clearAllNotes = () => {
    // Remove all highlights from the text
    const highlights = document.querySelectorAll('.new-essay-highlighted-text');
    highlights.forEach(highlight => {
      const parent = highlight.parentNode;
      if (parent) {
        while (highlight.firstChild) {
          parent.insertBefore(highlight.firstChild, highlight);
        }
        parent.removeChild(highlight);
      }
    });
    
    setAllRevisionNotes([]);
    setShowNotesModal(false);
  };
  
  // Remove a specific note
  const removeNote = (noteId) => {
    // Remove highlight from the text
    const highlight = document.querySelector(`.new-essay-highlighted-text[data-note-id="${noteId}"]`);
    if (highlight) {
      const parent = highlight.parentNode;
      if (parent) {
        while (highlight.firstChild) {
          parent.insertBefore(highlight.firstChild, highlight);
        }
        parent.removeChild(highlight);
      }
    }
    
    setAllRevisionNotes(prev => prev.filter(note => note.id !== noteId));
  };
  
  // Calculate essay statistics
  const calculateStats = () => {
    const fullText = editedContent;
    const words = fullText.split(/\s+/).filter(Boolean);
    const sentences = fullText.split(/[.!?]+/).filter(Boolean);
    const paragraphs = fullText.split(/\n+/).filter(p => p.trim() !== "");
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      averageWordsPerSentence: Math.round((words.length / sentences.length) * 10) / 10,
      characterCount: fullText.replace(/\s+/g, '').length,
      estimatedReadingTime: Math.max(1, Math.round(words.length / 225))
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className={`new-essay-container ${darkMode ? 'dark-mode' : ''} ${focusMode ? 'focus-mode' : ''}`}>
      {/* Top Navigation Bar */}
      <header className="new-essay-top-nav">
        <div className="new-essay-nav-left">
          <div className="new-essay-header-title">
            <Edit3 size={18} />
            <h1>AI Essay Editor - {school?.name || 'Medical School'}</h1>
          </div>
        </div>
        
        <div className="new-essay-nav-right">
          <div 
            className="new-essay-word-count"
            onClick={() => setShowStats(!showStats)}
            aria-label="Show statistics"
            role="button"
          >
            <span className="new-essay-count-current">{currentCount}</span>
            <span className="new-essay-count-separator">/</span>
            <span className="new-essay-count-limit">{maxCount}</span>
            <span className="new-essay-count-label">{countLabel}</span>
            <ChevronDown size={14} className="new-essay-count-icon" />
          </div>
          
          <button 
            className="new-essay-icon-button"
            onClick={toggleFocusMode}
            aria-label={`${focusMode ? 'Exit' : 'Enter'} focus mode`}
          >
            <Maximize2 size={18} />
          </button>
          
          <button 
            className="new-essay-icon-button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            className="new-essay-icon-button new-essay-help-button"
            onClick={() => setShowTipsModal(true)}
            aria-label="Show help"
          >
            <Lightbulb size={18} />
          </button>
        </div>
      </header>
      
      {/* Statistics Panel (Conditional) */}
      {showStats && (
        <div className="new-essay-stats-panel">
          <div className="new-essay-stats-header">
            <BarChart2 size={16} />
            <h2>Essay Statistics</h2>
            <button 
              className="new-essay-close-button"
              onClick={() => setShowStats(false)}
              aria-label="Close statistics"
            >
              <X size={16} />
            </button>
          </div>
          <div className="new-essay-stats-content">
            <div className="new-essay-stat-item">
              <FileText size={16} />
              <div className="new-essay-stat-info">
                <span className="new-essay-stat-value">{stats.wordCount}</span>
                <span className="new-essay-stat-label">Words</span>
              </div>
            </div>
            <div className="new-essay-stat-item">
              <Type size={16} />
              <div className="new-essay-stat-info">
                <span className="new-essay-stat-value">{stats.sentenceCount}</span>
                <span className="new-essay-stat-label">Sentences</span>
              </div>
            </div>
            <div className="new-essay-stat-item">
              <BookOpen size={16} />
              <div className="new-essay-stat-info">
                <span className="new-essay-stat-value">{stats.paragraphCount}</span>
                <span className="new-essay-stat-label">Paragraphs</span>
              </div>
            </div>
            <div className="new-essay-stat-item">
              <Star size={16} />
              <div className="new-essay-stat-info">
                <span className="new-essay-stat-value">{stats.averageWordsPerSentence}</span>
                <span className="new-essay-stat-label">Words per Sentence</span>
              </div>
            </div>
            <div className="new-essay-stat-item">
              <Clock size={16} />
              <div className="new-essay-stat-info">
                <span className="new-essay-stat-value">{stats.estimatedReadingTime} min</span>
                <span className="new-essay-stat-label">Reading Time</span>
              </div>
            </div>
            <div className="new-essay-stat-item">
              <MessageSquare size={16} />
              <div className="new-essay-stat-info">
                <span className="new-essay-stat-value">{allRevisionNotes.length}</span>
                <span className="new-essay-stat-label">Notes</span>
              </div>
            </div>
          </div>
        </div>
      )}
      

      <main className="new-essay-main-container">
        {/* Hero Essay Card */}
        <div className="new-essay-hero-card">
          <div className="new-essay-card-header">
            <div className="new-essay-card-icon">
              <FileText size={20} />
            </div>
            
            <div className="new-essay-header-content">
              <h2 className="new-essay-card-title">Your Essay</h2>
              <div className="new-essay-mode-indicator">
                {isEditing ? (
                  <span className="new-essay-edit-badge">
                    <Edit3 size={14} />
                    AI Edit Mode
                  </span>
                ) : (
                  <span className="new-essay-view-badge">
                    <Eye size={14} />
                    Review Mode
                  </span>
                )}
              </div>
            </div>
            
            <div className="new-essay-header-actions">
              {!isEditing ? (
                <div className="new-essay-header-action-group">
                  <button 
                    className={`new-essay-action-button secondary ${
                      allRevisionNotes.length > 0 ? 'has-notes' : ''
                    } ${justAddedNote ? 'just-added' : ''}`}
                    onClick={() => {
                      setShowNotesModal(true);
                      setHasUnseenNotes(false);
                    }}
                    aria-label="View revision notes"
                  >
                    <MessageSquare size={16} />
                    <span className={noteCountAnimation ? 'count-animate' : ''}>
                      Notes ({allRevisionNotes.length})
                    </span>
                    {hasUnseenNotes && allRevisionNotes.length > 0 && (
                      <div className="new-essay-notes-badge" />
                    )}
                  </button>
                  
                  <button 
                    className="new-essay-action-button primary"
                    onClick={handleEnterEditMode}
                    aria-label="Enter AI Edit Mode"
                  >
                    <Edit3 size={16} />
                    <span>Manual Edit</span>
                  </button>
                </div>
              ) : (
                <div className="new-essay-edit-actions-header">
                  <button 
                    className="new-essay-action-button cancel"
                    onClick={handleCancelChanges}
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  
                  <button 
                    className="new-essay-action-button save"
                    onClick={handleSaveChanges}
                    disabled={!hasUnsavedChanges}
                  >
                    <CheckCircle size={16} />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Essay Content */}
          <div className="new-essay-content-container">
            {!isEditing ? (
              // View Mode - with text selection for notes
              <div 
                className="new-essay-content" 
                ref={essayContentRef}
                onMouseUp={handleTextSelection}
                style={{ whiteSpace: 'pre-line' }}
              >
                {editedContent}
              </div>
            ) : (
              // Edit Mode - AI Edit inspired by Step2
              <div className="new-essay-edit-container">
                <div className="new-essay-edit-header">
                  <div className="new-essay-edit-indicator">
                    <Edit3 size={16} />
                    <span>Make your changes below</span>
                  </div>
                  <div className="new-essay-edit-count">
                    <span className={`new-essay-edit-count-text ${currentCount > maxCount ? 'over-limit' : ''}`}>
                      {currentCount} / {maxCount} {countLabel}
                    </span>
                  </div>
                </div>
                
                <textarea
                  className="new-essay-edit-textarea"
                  value={editedContent}
                  onChange={handleContentChange}
                  placeholder="Edit your essay here..."
                  rows={25}
                  autoFocus
                />
              </div>
            )}
            
            {/* Selection Input Box */}
            {selectionActive && !isEditing && (
              <div 
                className="new-essay-selection-input"
                style={{ 
                  left: `${selectionCoords.x}px`, 
                  top: `${selectionCoords.y + 10}px` 
                }}
                ref={selectionInputRef}
              >
                <div className="new-essay-selection-preview">
                  <strong>Selected:</strong> {selectedText.substring(0, 60)}{selectedText.length > 60 ? '...' : ''}
                </div>
                
                <div className="new-essay-category-selector">
                  {noteCategories.map(cat => (
                    <button 
                      key={cat.id}
                      className={`new-essay-category-button ${activeCategory === cat.id ? 'active' : ''}`}
                      style={{ 
                        backgroundColor: activeCategory === cat.id ? `${cat.color}20` : 'transparent',
                        borderColor: activeCategory === cat.id ? cat.color : 'transparent',
                        color: activeCategory === cat.id ? cat.color : 'inherit'
                      }}
                      onClick={() => setActiveCategory(cat.id)}
                      aria-pressed={activeCategory === cat.id}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                
                <textarea
                  className="new-essay-selection-textarea"
                  value={selectionNote}
                  onChange={(e) => setSelectionNote(e.target.value)}
                  onKeyPress={handleSelectionKeyPress}
                  placeholder="What would you like to change about this text?"
                  rows={3}
                  aria-label="Revision note"
                ></textarea>
                
                <div className="new-essay-selection-actions">
                  <button 
                    className="new-essay-selection-button-cancel"
                    onClick={() => setSelectionActive(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="new-essay-selection-button-save"
                    onClick={handleSelectionNoteSave}
                    disabled={!selectionNote.trim()}
                    style={{ 
                      backgroundColor: noteCategories.find(cat => cat.id === activeCategory)?.color || noteCategories[0].color 
                    }}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Integrated Actions Footer */}
          {!isEditing && (
            <div className="new-essay-actions-footer">
              <div className="new-essay-integrated-actions">
                
                
                <button 
                  className="new-essay-action-button primary"
                  onClick={submitRevision}
                  disabled={allRevisionNotes.length === 0 || essayData?.isLoading}
                  aria-label="Submit Revisions"
                >
                  <Save size={18} />
                  <span>
                    {essayData?.isLoading ? 'Processing...' : 
                     allRevisionNotes.length > 0 ? `Submit ${allRevisionNotes.length} Notes` : 'Submit Revisions'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Notes Modal - Expansible Widget */}
      {showNotesModal && (
        <div className="new-essay-modal-overlay" onClick={() => setShowNotesModal(false)}>
          <div 
            className="new-essay-notes-modal"
            onClick={(e) => e.stopPropagation()}
            ref={notesModalRef}
          >
            <div className="new-essay-modal-header">
              <div className="new-essay-modal-title">
                <MessageSquare size={18} />
                <h2>Revision Notes ({allRevisionNotes.length})</h2>
              </div>
              
              <div className="new-essay-modal-actions">
                {allRevisionNotes.length > 0 && (
                  <button 
                    className="new-essay-clear-button"
                    onClick={clearAllNotes}
                    aria-label="Clear all notes"
                  >
                    Clear All
                  </button>
                )}
                
                <button 
                  className="new-essay-modal-close"
                  onClick={() => setShowNotesModal(false)}
                  aria-label="Close notes"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="new-essay-modal-content">
              {allRevisionNotes.length === 0 ? (
                <div className="new-essay-notes-empty">
                  <div className="new-essay-notes-empty-icon">
                    <MessageSquare size={32} />
                  </div>
                  <p>No revision notes yet</p>
                  <p className="new-essay-notes-tip">Select text in the essay to add notes</p>
                </div>
              ) : (
                <div className="new-essay-notes-list">
                  {allRevisionNotes.map((note, index) => (
                    <div 
                      key={note.id} 
                      className="new-essay-note-item"
                      style={{ '--note-color': note.color }}
                    >
                      <div className="new-essay-note-item-header">
                        <div className="new-essay-note-item-info">
                          <span 
                            className="new-essay-note-item-number"
                            style={{ backgroundColor: note.color }}
                          >
                            {index + 1}
                          </span>
                          <span className="new-essay-note-item-category">
                            {noteCategories.find(cat => cat.id === note.category)?.label || 'Note'}
                          </span>
                        </div>
                        
                        <button 
                          className="new-essay-note-item-delete"
                          onClick={() => removeNote(note.id)}
                          aria-label="Remove note"
                        >
                          <MinusCircle size={14} />
                        </button>
                      </div>
                      
                      <div 
                        className="new-essay-note-item-text"
                        style={{ borderLeftColor: note.color }}
                      >
                        "{note.selectedText.substring(0, 120)}{note.selectedText.length > 120 ? '...' : ''}"
                      </div>
                      
                      <div className="new-essay-note-item-instruction">
                        {note.instruction}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="new-essay-modal-footer">
              <button 
                className="new-essay-modal-button primary"
                onClick={submitRevision}
                disabled={allRevisionNotes.length === 0 || essayData?.isLoading}
              >
                <Save size={16} />
                <span>
                  {essayData?.isLoading ? 'Processing...' : 
                   `Submit ${allRevisionNotes.length} Revision${allRevisionNotes.length > 1 ? 's' : ''}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tips Modal */}
      {showTipsModal && (
        <div className="new-essay-modal-overlay" onClick={() => setShowTipsModal(false)}>
          <div 
            className="new-essay-modal"
            onClick={(e) => e.stopPropagation()}
            ref={tipsModalRef}
          >
            <div className="new-essay-modal-header">
              <div className="new-essay-modal-title">
                <Lightbulb size={18} />
                <h2>AI Essay Editor Guide</h2>
              </div>
              
              <button 
                className="new-essay-modal-close"
                onClick={() => setShowTipsModal(false)}
                aria-label="Close help"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="new-essay-modal-content">
              <div className="new-essay-tip-section">
                <h3>Two Editing Modes</h3>
                <div className="new-essay-tip-list">
                  <div className="new-essay-tip-item">
                    <div className="new-essay-tip-number">1</div>
                    <div className="new-essay-tip-text">
                      <strong>Manual Edit:</strong> Direct text editing with real-time word count
                    </div>
                  </div>
                  
                  <div className="new-essay-tip-item">
                    <div className="new-essay-tip-number">2</div>
                    <div className="new-essay-tip-text">
                      <strong>Review Mode:</strong> Select text to add specific revision notes
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="new-essay-tip-section">
                <h3>Adding Revision Notes</h3>
                <div className="new-essay-tip-list">
                  <div className="new-essay-tip-item">
                    <div className="new-essay-tip-number">1</div>
                    <div className="new-essay-tip-text">
                      Select any text in Review Mode
                    </div>
                  </div>
                  
                  <div className="new-essay-tip-item">
                    <div className="new-essay-tip-number">2</div>
                    <div className="new-essay-tip-text">
                      Choose a category (Clarity, Structure, Style, etc.)
                    </div>
                  </div>
                  
                  <div className="new-essay-tip-item">
                    <div className="new-essay-tip-number">3</div>
                    <div className="new-essay-tip-text">
                      Add your revision instruction and save
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="new-essay-tip-section">
                <h3>Managing Your Notes</h3>
                <div className="new-essay-tip-list">
                  <div className="new-essay-tip-item">
                    <div className="new-essay-tip-number">1</div>
                    <div className="new-essay-tip-text">
                      Click the <strong>Notes (X)</strong> button in the header to view all your revision notes
                    </div>
                  </div>
                  
                  <div className="new-essay-tip-item">
                    <div className="new-essay-tip-number">2</div>
                    <div className="new-essay-tip-text">
                      The modal shows each note with its category, selected text, and your instructions
                    </div>
                  </div>
                  
                  <div className="new-essay-tip-item">
                    <div className="new-essay-tip-number">3</div>
                    <div className="new-essay-tip-text">
                      Remove individual notes or clear all notes at once
                    </div>
                  </div>
                  
                  <div className="new-essay-tip-item">
                    <div className="new-essay-tip-number">4</div>
                    <div className="new-essay-tip-text">
                      Submit all your notes for AI revision when ready
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="new-essay-shortcut-section">
                <h3>Keyboard Shortcuts</h3>
                <div className="new-essay-shortcut-grid">
                  <div className="new-essay-shortcut">
                    <div className="new-essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>E</kbd>
                    </div>
                    <div className="new-essay-shortcut-desc">Enter Manual Edit Mode</div>
                  </div>
                  
                  <div className="new-essay-shortcut">
                    <div className="new-essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>S</kbd>
                    </div>
                    <div className="new-essay-shortcut-desc">Save Changes</div>
                  </div>
                  
                  <div className="new-essay-shortcut">
                    <div className="new-essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>F</kbd>
                    </div>
                    <div className="new-essay-shortcut-desc">Toggle Focus Mode</div>
                  </div>
                  
                  <div className="new-essay-shortcut">
                    <div className="new-essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
                    </div>
                    <div className="new-essay-shortcut-desc">Submit Revisions</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="new-essay-modal-footer">
              <button 
                className="new-essay-modal-button"
                onClick={() => setShowTipsModal(false)}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Focus Mode Exit Button */}
      {focusMode && (
        <button 
          className="new-essay-focus-exit-button"
          onClick={toggleFocusMode}
          aria-label="Exit focus mode"
        >
          <Minimize2 size={20} />
        </button>
      )}
    </div>
  );
};

export default NewEssayStep3; 