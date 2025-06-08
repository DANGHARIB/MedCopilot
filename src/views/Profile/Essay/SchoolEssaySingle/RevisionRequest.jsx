import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Edit3,
  Save,
  Eraser,
  MessageSquare,
  Lightbulb,
  X,
  CheckCircle,
  Maximize2,
  Moon,
  Sun,
  Eye,
  ArrowLeft,
  ChevronDown,
  BarChart2,
  FileText,
  Clock,
  Type,
  BookOpen,
  Star,
  MinusCircle,
  Minimize2
} from 'lucide-react';
import './RevisionRequest.css';

/**
 * RevisionRequest - Modern essay revision interface with Hero Card design
 * Refactored to match EssayStep3's elegant approach
 */
const RevisionRequest = ({ 
  version, 
  essay, 
  onSubmit, 
  onCancel 
}) => {
  // State management
  const [selectionActive, setSelectionActive] = useState(false);
  const [selectionCoords, setSelectionCoords] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [selectionNote, setSelectionNote] = useState("");
  const [allRevisionNotes, setAllRevisionNotes] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  
  // Enhanced features
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Enhanced UX states
  const [hasUnseenNotes, setHasUnseenNotes] = useState(false);
  const [justAddedNote, setJustAddedNote] = useState(false);
  const [noteCountAnimation, setNoteCountAnimation] = useState(false);
  
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
  
  // Split essay into paragraphs whenever version changes
  useEffect(() => {
    if (version?.content) {
      const split = version.content.split(/\n+/).filter(p => p.trim() !== "");
      setParagraphs(split);
    } else {
      setParagraphs([]);
    }
  }, [version]);
  
  // Function to center modal position
  const centerModal = useCallback((modalRef) => {
    if (!modalRef.current) return;
    
    const modal = modalRef.current;
    const rect = modal.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate center position
    const centerX = (viewportWidth - rect.width) / 2;
    const centerY = (viewportHeight - rect.height) / 2;
    
    // Ensure modal doesn't go outside viewport bounds
    const minX = 16;
    const minY = 16;
    const maxX = viewportWidth - rect.width - 16;
    const maxY = viewportHeight - rect.height - 16;
    
    const finalX = Math.max(minX, Math.min(centerX, maxX));
    const finalY = Math.max(minY, Math.min(centerY, maxY));
    
    // Apply positioning
    modal.style.position = 'fixed';
    modal.style.left = `${finalX}px`;
    modal.style.top = `${finalY}px`;
    modal.style.transform = 'none';
    modal.style.margin = '0';
  }, []);
  
  // Auto-center modals when they open
  useEffect(() => {
    if (showNotesModal && notesModalRef.current) {
      setTimeout(() => centerModal(notesModalRef), 10);
    }
  }, [showNotesModal, centerModal]);
  
  useEffect(() => {
    if (showTipsModal && tipsModalRef.current) {
      setTimeout(() => centerModal(tipsModalRef), 10);
    }
  }, [showTipsModal, centerModal]);
  
  // Handle window resize to re-center modals
  useEffect(() => {
    const handleResize = () => {
      if (showNotesModal && notesModalRef.current) {
        centerModal(notesModalRef);
      }
      if (showTipsModal && tipsModalRef.current) {
        centerModal(tipsModalRef);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showNotesModal, showTipsModal, centerModal]);
  
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
      
      // Submit with Ctrl+S
      if (e.ctrlKey && e.key === 's' && allRevisionNotes.length > 0) {
        e.preventDefault();
        submitRevision();
      }
      
      // Escape to close modals
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
  }, [focusMode, darkMode, allRevisionNotes, showTipsModal, showStats, showNotesModal, selectionActive, toggleFocusMode]);
  
  // Handle selection change
  const handleTextSelection = () => {
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
      
      // Add a small visual feedback on save
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'revision-highlighted-text';
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
  
  // Generate final revision instructions string
  const generateRevisionInstructions = () => {
    if (allRevisionNotes.length === 0) return "No specific instructions provided.";
    
    return allRevisionNotes.map((note, index) => {
      const categoryLabel = noteCategories.find(cat => cat.id === note.category)?.label || note.category;
      return `${index + 1}. Category: ${categoryLabel}\nSelected Text: "${note.selectedText}"\nInstruction: ${note.instruction}`;
    }).join("\n\n");
  };
  
  // Submit all notes for revision
  const submitRevision = () => {
    if (allRevisionNotes.length === 0) return;
    
    setIsSubmitting(true);
    const finalInstructions = generateRevisionInstructions();
    
    // Simulate a bit of delay to match the UX
    setTimeout(() => {
      onSubmit(finalInstructions);
      setIsSubmitting(false);
    }, 500);
  };
  
  // Clear all revision notes
  const clearAllNotes = () => {
    // Remove all highlights from the text
    const highlights = document.querySelectorAll('.revision-highlighted-text');
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
    const highlight = document.querySelector(`.revision-highlighted-text[data-note-id="${noteId}"]`);
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
    const fullText = paragraphs.join(' ');
    const words = fullText.split(/\s+/).filter(Boolean);
    const sentences = fullText.split(/[.!?]+/).filter(Boolean);
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      averageWordsPerSentence: Math.round((words.length / sentences.length) * 10) / 10 || 0,
      characterCount: fullText.replace(/\s+/g, '').length,
      estimatedReadingTime: Math.max(1, Math.round(words.length / 225))
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className={`revision-container ${darkMode ? 'dark-mode' : ''} ${focusMode ? 'focus-mode' : ''}`}>
      {/* Top Navigation Bar */}
      <header className="revision-top-nav">
        <div className="revision-nav-left">
          <button 
            className="revision-back-button"
            onClick={onCancel}
            aria-label="Cancel revision request"
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </button>
          <div className="revision-header-title">
            <Edit3 size={18} />
            <h1>Revise Your Essay for {essay?.school?.name || 'Medical School'}</h1>
          </div>
        </div>
        
        <div className="revision-nav-right">
          <div 
            className="revision-word-count"
            onClick={() => setShowStats(!showStats)}
            aria-label="Show statistics"
            role="button"
          >
            <span className="revision-count-current">{stats.wordCount}</span>
            <span className="revision-count-separator">/</span>
            <span className="revision-count-limit">{essay?.wordLimit || 500}</span>
            <span className="revision-count-label">words</span>
            <ChevronDown size={14} className="revision-count-icon" />
          </div>
          
          <button 
            className="revision-icon-button"
            onClick={toggleFocusMode}
            aria-label={`${focusMode ? 'Exit' : 'Enter'} focus mode`}
          >
            <Maximize2 size={18} />
          </button>
          
          <button 
            className="revision-icon-button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            className="revision-icon-button revision-help-button"
            onClick={() => setShowTipsModal(true)}
            aria-label="Show help"
          >
            <Lightbulb size={18} />
          </button>
        </div>
      </header>
      
      {/* Statistics Panel (Conditional) */}
      {showStats && (
        <div className="revision-stats-panel">
          <div className="revision-stats-header">
            <BarChart2 size={16} />
            <h2>Essay Statistics</h2>
            <button 
              className="revision-close-button"
              onClick={() => setShowStats(false)}
              aria-label="Close statistics"
            >
              <X size={16} />
            </button>
          </div>
          <div className="revision-stats-content">
            <div className="revision-stat-item">
              <FileText size={16} />
              <div className="revision-stat-info">
                <span className="revision-stat-value">{stats.wordCount}</span>
                <span className="revision-stat-label">Words</span>
              </div>
            </div>
            <div className="revision-stat-item">
              <Type size={16} />
              <div className="revision-stat-info">
                <span className="revision-stat-value">{stats.sentenceCount}</span>
                <span className="revision-stat-label">Sentences</span>
              </div>
            </div>
            <div className="revision-stat-item">
              <BookOpen size={16} />
              <div className="revision-stat-info">
                <span className="revision-stat-value">{stats.paragraphCount}</span>
                <span className="revision-stat-label">Paragraphs</span>
              </div>
            </div>
            <div className="revision-stat-item">
              <Star size={16} />
              <div className="revision-stat-info">
                <span className="revision-stat-value">{stats.averageWordsPerSentence}</span>
                <span className="revision-stat-label">Words per Sentence</span>
              </div>
            </div>
            <div className="revision-stat-item">
              <Clock size={16} />
              <div className="revision-stat-info">
                <span className="revision-stat-value">{stats.estimatedReadingTime} min</span>
                <span className="revision-stat-label">Reading Time</span>
              </div>
            </div>
            <div className="revision-stat-item">
              <MessageSquare size={16} />
              <div className="revision-stat-info">
                <span className="revision-stat-value">{allRevisionNotes.length}</span>
                <span className="revision-stat-label">Revision Notes</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="revision-main-container">
        {/* Hero Essay Card */}
        <div className="revision-hero-card">
          <div className="revision-card-header">
            <div className="revision-card-icon">
              <FileText size={20} />
            </div>
            
            <div className="revision-header-content">
              <h2 className="revision-card-title">Essay Revision</h2>
              <div className="revision-mode-indicator">
                <span className="revision-edit-badge">
                  <Edit3 size={14} />
                  Revision Mode
                </span>
              </div>
            </div>
            
            <div className="revision-header-actions">
              <div className="revision-header-action-group">
                <button 
                  className={`revision-action-button secondary ${
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
                    <div className="revision-notes-badge" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Essay Content */}
          <div className="revision-content-container">
            <div 
              className="revision-content" 
              ref={essayContentRef}
              onMouseUp={handleTextSelection}
            >
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <div 
                    key={index}
                    className="revision-paragraph"
                    id={`paragraph-${index}`}
                  >
                    {paragraph}
                  </div>
                ))
              ) : (
                <div className="revision-no-content">
                  <div className="revision-no-content-icon">
                    <FileText size={32} />
                  </div>
                  <p>No essay content available to revise</p>
                </div>
              )}
              
              {/* Selection Input Box */}
              {selectionActive && (
                <div 
                  className="revision-selection-input"
                  style={{ 
                    left: `${selectionCoords.x}px`, 
                    top: `${selectionCoords.y + 10}px` 
                  }}
                  ref={selectionInputRef}
                >
                  <div className="revision-selection-preview">
                    <strong>Selected:</strong> {selectedText.substring(0, 60)}{selectedText.length > 60 ? '...' : ''}
                  </div>
                  
                  <div className="revision-category-selector">
                    {noteCategories.map(cat => (
                      <button 
                        key={cat.id}
                        className={`revision-category-button ${activeCategory === cat.id ? 'active' : ''}`}
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
                    className="revision-selection-textarea"
                    value={selectionNote}
                    onChange={(e) => setSelectionNote(e.target.value)}
                    onKeyPress={handleSelectionKeyPress}
                    placeholder="What would you like to change about this text?"
                    rows={3}
                    aria-label="Revision note"
                  ></textarea>
                  
                  <div className="revision-selection-actions">
                    <button 
                      className="revision-selection-button-cancel"
                      onClick={() => setSelectionActive(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="revision-selection-button-save"
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
          </div>
          
          {/* Integrated Actions Footer */}
          <div className="revision-actions-footer">
            <div className="revision-integrated-actions">
              <button 
                className="revision-action-button primary"
                onClick={submitRevision}
                disabled={allRevisionNotes.length === 0 || isSubmitting}
                aria-label="Submit Revisions"
              >
                <Save size={18} />
                <span>
                  {isSubmitting ? 'Processing...' : 
                   allRevisionNotes.length > 0 ? `Submit ${allRevisionNotes.length} Notes` : 'Submit Revisions'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Notes Modal */}
      {showNotesModal && (
        <div className="revision-modal-overlay" onClick={() => setShowNotesModal(false)}>
          <div 
            className="revision-notes-modal"
            onClick={(e) => e.stopPropagation()}
            ref={notesModalRef}
          >
            <div className="revision-modal-header">
              <div className="revision-modal-title">
                <MessageSquare size={18} />
                <h2>Revision Notes ({allRevisionNotes.length})</h2>
              </div>
              
              <div className="revision-modal-actions">
                {allRevisionNotes.length > 0 && (
                  <button 
                    className="revision-clear-button"
                    onClick={clearAllNotes}
                    aria-label="Clear all notes"
                  >
                    Clear All
                  </button>
                )}
                
                <button 
                  className="revision-modal-close"
                  onClick={() => setShowNotesModal(false)}
                  aria-label="Close notes"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="revision-modal-content">
              {allRevisionNotes.length === 0 ? (
                <div className="revision-notes-empty">
                  <div className="revision-notes-empty-icon">
                    <MessageSquare size={32} />
                  </div>
                  <p>No revision notes yet</p>
                  <p className="revision-notes-tip">Select text in the essay to add notes</p>
                </div>
              ) : (
                <div className="revision-notes-list">
                  {allRevisionNotes.map((note, index) => (
                    <div 
                      key={note.id} 
                      className="revision-note-item"
                      style={{ '--note-color': note.color }}
                    >
                      <div className="revision-note-item-header">
                        <div className="revision-note-item-info">
                          <span 
                            className="revision-note-item-number"
                            style={{ backgroundColor: note.color }}
                          >
                            {index + 1}
                          </span>
                          <span className="revision-note-item-category">
                            {noteCategories.find(cat => cat.id === note.category)?.label || 'Note'}
                          </span>
                        </div>
                        
                        <button 
                          className="revision-note-item-delete"
                          onClick={() => removeNote(note.id)}
                          aria-label="Remove note"
                        >
                          <MinusCircle size={14} />
                        </button>
                      </div>
                      
                      <div 
                        className="revision-note-item-text"
                        style={{ borderLeftColor: note.color }}
                      >
                        "{note.selectedText.substring(0, 120)}{note.selectedText.length > 120 ? '...' : ''}"
                      </div>
                      
                      <div className="revision-note-item-instruction">
                        {note.instruction}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="revision-modal-footer">
              <button 
                className="revision-modal-button primary"
                onClick={submitRevision}
                disabled={allRevisionNotes.length === 0 || isSubmitting}
              >
                <Save size={16} />
                <span>
                  {isSubmitting ? 'Processing...' : 
                   `Submit ${allRevisionNotes.length} Revision${allRevisionNotes.length > 1 ? 's' : ''}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tips Modal */}
      {showTipsModal && (
        <div className="revision-modal-overlay" onClick={() => setShowTipsModal(false)}>
          <div 
            className="revision-modal"
            onClick={(e) => e.stopPropagation()}
            ref={tipsModalRef}
          >
            <div className="revision-modal-header">
              <div className="revision-modal-title">
                <Lightbulb size={18} />
                <h2>Essay Revision Guide</h2>
              </div>
              
              <button 
                className="revision-modal-close"
                onClick={() => setShowTipsModal(false)}
                aria-label="Close help"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="revision-modal-content">
              <div className="revision-tip-section">
                <h3>How to Add Revision Notes</h3>
                <div className="revision-tip-list">
                  <div className="revision-tip-item">
                    <div className="revision-tip-number">1</div>
                    <div className="revision-tip-text">
                      <strong>Select text</strong> in your essay by clicking and dragging
                    </div>
                  </div>
                  
                  <div className="revision-tip-item">
                    <div className="revision-tip-number">2</div>
                    <div className="revision-tip-text">
                      <strong>Choose a category</strong> for your revision note
                    </div>
                  </div>
                  
                  <div className="revision-tip-item">
                    <div className="revision-tip-number">3</div>
                    <div className="revision-tip-text">
                      <strong>Add your revision instructions</strong> in the popup box
                    </div>
                  </div>
                  
                  <div className="revision-tip-item">
                    <div className="revision-tip-number">4</div>
                    <div className="revision-tip-text">
                      Press <kbd>Enter</kbd> or click <strong>Save Note</strong> to add your note
                    </div>
                  </div>
                  
                  <div className="revision-tip-item">
                    <div className="revision-tip-number">5</div>
                    <div className="revision-tip-text">
                      <strong>Review your notes</strong> and submit when ready
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="revision-tip-section">
                <h3>Managing Your Notes</h3>
                <div className="revision-tip-list">
                  <div className="revision-tip-item">
                    <div className="revision-tip-number">1</div>
                    <div className="revision-tip-text">
                      Click the <strong>Notes (X)</strong> button to view all revision notes
                    </div>
                  </div>
                  
                  <div className="revision-tip-item">
                    <div className="revision-tip-number">2</div>
                    <div className="revision-tip-text">
                      Remove individual notes or clear all notes at once
                    </div>
                  </div>
                  
                  <div className="revision-tip-item">
                    <div className="revision-tip-number">3</div>
                    <div className="revision-tip-text">
                      Submit all your notes for AI revision when ready
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="revision-shortcut-section">
                <h3>Keyboard Shortcuts</h3>
                <div className="revision-shortcut-grid">
                  <div className="revision-shortcut">
                    <div className="revision-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>F</kbd>
                    </div>
                    <div className="revision-shortcut-desc">Toggle Focus Mode</div>
                  </div>
                  
                  <div className="revision-shortcut">
                    <div className="revision-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>D</kbd>
                    </div>
                    <div className="revision-shortcut-desc">Toggle Dark Mode</div>
                  </div>
                  
                  <div className="revision-shortcut">
                    <div className="revision-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>S</kbd>
                    </div>
                    <div className="revision-shortcut-desc">Submit Revisions</div>
                  </div>
                  
                  <div className="revision-shortcut">
                    <div className="revision-shortcut-keys">
                      <kbd>Esc</kbd>
                    </div>
                    <div className="revision-shortcut-desc">Close Popups</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="revision-modal-footer">
              <button 
                className="revision-modal-button"
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
          className="revision-focus-exit-button"
          onClick={toggleFocusMode}
          aria-label="Exit focus mode"
        >
          <Minimize2 size={20} />
        </button>
      )}
    </div>
  );
};

export default RevisionRequest; 