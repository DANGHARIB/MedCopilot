import React, { useState, useRef, useEffect } from "react";
import { 
  Edit3,
  Save,
  Eraser,
  MessageSquare,
  Lightbulb,
  X,
  CheckCircle,
  Menu,
  Maximize2,
  Moon,
  Sun,
  Layout,
  Eye,
  PlusCircle,
  MinusCircle,
  ChevronRight,
  ChevronDown,
  BarChart2,
  Bookmark,
  FileText,
  Clock,
  Type,
  BookOpen,
  Star,
  Settings,
  HelpCircle
} from "lucide-react";
import "./EssayStep3.css";

/**
 * Enhanced component for essay revision with improved UI/UX inspired by modern design principles
 */
const EssayStep3 = ({ 
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
  const [paragraphs, setParagraphs] = useState([]);
  const [showTipsModal, setShowTipsModal] = useState(false);
  
  // New state for enhanced features
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [noteCategories] = useState([
    { id: 'clarity', label: 'Clarity', color: '#4361ee' },
    { id: 'structure', label: 'Structure', color: '#7209b7' },
    { id: 'style', label: 'Style', color: '#3a0ca3' },
    { id: 'grammar', label: 'Grammar', color: '#06d6a0' },
    { id: 'content', label: 'Content', color: '#f72585' }
  ]);
  const [activeCategory, setActiveCategory] = useState(noteCategories[0].id);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // Refs
  const essayContentRef = useRef(null);
  const selectionInputRef = useRef(null);
  const tipsModalRef = useRef(null);
  
  // Dummy essay text for demo purposes
  const dummyEssay = `During my sophomore year of college, I faced a significant challenge when my mother was diagnosed with an aggressive form of breast cancer. As the eldest child in a single-parent household, I suddenly found myself balancing my pre-medical studies with family responsibilities, including caring for my younger siblings and accompanying my mother to chemotherapy appointments.

The hospital became my second classroom. While sitting with my mother during her treatments, I observed the medical team's approach—not just their technical expertise, but their communication styles and bedside manner. Some physicians took the time to explain complex procedures in accessible language, addressing our concerns with patience. Others, though clinically competent, seemed detached, leaving us with unanswered questions and anxiety.

This contrast was illuminating. I realized that excellent healthcare requires both scientific knowledge and genuine human connection. When a compassionate oncology nurse taught me how to monitor my mother's post-treatment symptoms, I experienced firsthand how empowerment through education can transform a patient's family from helpless bystanders to engaged participants in the healing process.

The challenge of balancing academics with caregiving responsibilities taught me valuable lessons in time management and prioritization—all essential for a physician. I learned to use every available moment efficiently, studying between classes and during hospital waits. More importantly, I developed emotional resilience. When my mother experienced severe treatment side effects, I couldn't allow myself to collapse under stress; instead, I needed to remain calm and focused to support her.

My academic performance initially suffered, with my GPA dropping during that difficult semester. However, rather than use my circumstances as an excuse, I sought help from professors and academic resources, eventually recovering academically while maintaining my caregiving responsibilities. This experience taught me the importance of seeking support when faced with overwhelming challenges—another crucial lesson for my future in medicine.

Today, my mother is in remission, and this journey has fundamentally shaped my approach to medicine. I no longer view healthcare as simply diagnosing and treating illnesses; I see it as a partnership between medical professionals, patients, and their families. I understand that behind every medical case is a human story with emotional, social, and practical dimensions that significantly impact treatment outcomes.

This perspective has influenced my volunteer work at the student-run clinic, where I make a conscious effort to listen deeply to patients' concerns, considering their life circumstances when discussing treatment options. It has also guided my research interests toward studying how social support networks affect cancer treatment adherence and outcomes.

The obstacle I faced didn't deter me from pursuing medicine—it clarified why I want to become a physician: to provide the kind of comprehensive, compassionate care that treats the person, not just the disease. This challenge has equipped me with empathy, resilience, and perspective that textbooks alone could never teach, preparing me to be the kind of physician who recognizes that healing involves both science and humanity.`;
  
  // Split essay into paragraphs whenever essayData changes
  useEffect(() => {
    // Use the provided essay or fall back to the dummy essay for demo purposes
    const essayText = essayData?.generatedEssay || dummyEssay;
    const split = essayText.split(/\n+/).filter(p => p.trim() !== "");
    setParagraphs(split);
  }, [essayData]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle focus mode with Ctrl+F
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setFocusMode(!focusMode);
      }
      
      // Toggle dark mode with Ctrl+D
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setDarkMode(!darkMode);
      }
      
      // Submit edits with Ctrl+S
      if (e.ctrlKey && e.key === 's' && allRevisionNotes.length > 0) {
        e.preventDefault();
        submitRevision();
      }
      
      // Show keyboard shortcuts with Ctrl+K
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        if (showTipsModal) setShowTipsModal(false);
        if (showKeyboardShortcuts) setShowKeyboardShortcuts(false);
        if (showStats) setShowStats(false);
        if (selectionActive) setSelectionActive(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusMode, darkMode, allRevisionNotes, showTipsModal, showKeyboardShortcuts, showStats, selectionActive]);
  
  // Handle click outside selection input to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectionInputRef.current && 
        !selectionInputRef.current.contains(event.target)
      ) {
        // Only close if there's a valid note and save it
        if (selectionNote.trim() !== "") {
          handleSelectionNoteSave();
        } else {
          setSelectionActive(false);
        }
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectionNote]);
  
  // Focus the input when selection becomes active
  useEffect(() => {
    if (selectionActive && selectionInputRef.current) {
      selectionInputRef.current.focus();
    }
  }, [selectionActive]);
  
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
      
      // Add a small visual feedback on save
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'essay-highlighted-text';
        span.dataset.noteId = newNote.id;
        span.style.backgroundColor = `${newNote.color}20`;
        span.style.borderBottom = `2px solid ${newNote.color}`;
        
        try {
          range.surroundContents(span);
          selection.removeAllRanges();
        } catch(e) {
          console.warn('Could not highlight text', e);
        }
      }
      
      // Show toast notification in focus mode
      if (focusMode) {
        const toast = document.createElement('div');
        toast.className = 'essay-toast';
        toast.innerHTML = `
          <div class="essay-toast-icon" style="background-color: ${newNote.color}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="essay-toast-content">
            <div class="essay-toast-title">Note added</div>
            <div class="essay-toast-message">${noteCategories.find(cat => cat.id === activeCategory)?.label || 'Note'} (#${allRevisionNotes.length + 1})</div>
          </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
          toast.classList.add('essay-toast-visible');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
          toast.classList.remove('essay-toast-visible');
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, 3000);
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
    
    // Corrected to use note.selectedText and note.instruction as intended
    return allRevisionNotes.map((note, index) => {
      const categoryLabel = noteCategories.find(cat => cat.id === note.category)?.label || note.category;
      return `${index + 1}. Category: ${categoryLabel}\nSelected Text: "${note.selectedText}"\nInstruction: ${note.instruction}`;
    }).join("\n\n");
  };
  
  // Submit all notes for revision
  const submitRevision = () => {
    const finalInstructions = generateRevisionInstructions();
    // Pass both finalInstructions string (for potential direct use or logging)
    // and the structured allRevisionNotes array (for the new interface)
    onSubmitRevision(finalInstructions, allRevisionNotes); 
  };
  
  // Clear all revision notes
  const clearAllNotes = () => {
    // Remove all highlights from the text
    const highlights = document.querySelectorAll('.essay-highlighted-text');
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
  };
  
  // Remove a specific note
  const removeNote = (noteId) => {
    // Remove highlight from the text
    const highlight = document.querySelector(`.essay-highlighted-text[data-note-id="${noteId}"]`);
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
      averageWordsPerSentence: Math.round((words.length / sentences.length) * 10) / 10,
      characterCount: fullText.replace(/\s+/g, '').length,
      estimatedReadingTime: Math.max(1, Math.round(words.length / 225)) // Average reading speed
    };
  };
  
  const stats = calculateStats();
  
  // Progress animation for word count
  const [displayWordCount, setDisplayWordCount] = useState(0);
  const actualWordCount = stats.wordCount;
  
  useEffect(() => {
    if (displayWordCount !== actualWordCount) {
      const step = Math.ceil(Math.abs(actualWordCount - displayWordCount) / 10);
      const timer = setTimeout(() => {
        if (displayWordCount < actualWordCount) {
          setDisplayWordCount(prev => Math.min(prev + step, actualWordCount));
        } else if (displayWordCount > actualWordCount) {
          setDisplayWordCount(prev => Math.max(prev - step, actualWordCount));
        }
      }, 30);
      
      return () => clearTimeout(timer);
    }
  }, [displayWordCount, actualWordCount]);
  
  // Center Modal Logic
  const centerModal = (modalRef) => {
    if (!modalRef.current) return () => {};

    const timerId = setTimeout(() => {
      if (modalRef.current) {
        const modalElement = modalRef.current;
        const modalRect = modalElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate the desired scroll position to center the modal
        const desiredScrollTop = window.scrollY + modalRect.top - (viewportHeight - modalRect.height) / 2;
        const finalScrollTop = Math.max(0, desiredScrollTop); // Prevent scrolling above the top

        // Scroll the window
        window.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
      }
    }, 50); // 50ms delay

    return () => clearTimeout(timerId);
  };

  // Center the tips modal when it opens
  useEffect(() => {
    let cleanupScroll = null;
    if (showTipsModal && tipsModalRef.current) {
      cleanupScroll = centerModal(tipsModalRef);
    }
    
    return () => {
      if (cleanupScroll) {
        cleanupScroll();
      }
    };
  }, [showTipsModal]);

  // Body scroll lock for modals
  useEffect(() => {
    const hasActiveModal = showTipsModal || showKeyboardShortcuts;
    
    if (hasActiveModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTipsModal, showKeyboardShortcuts]);
  
  return (
    <div className={`essay-container ${darkMode ? 'dark-mode' : ''} ${focusMode ? 'focus-mode' : ''}`}>
      {/* Top Navigation Bar */}
      <header className="essay-top-nav">
        <div className="essay-nav-left">
          <div className="essay-header-title">
            <Edit3 size={18} />
            <h1>Revise Your Essay for {school?.name || 'Medical School'}</h1>
          </div>
        </div>
        
        <div className="essay-nav-right">
          <div 
            className="essay-word-count"
            onClick={() => setShowStats(!showStats)}
            aria-label="Show statistics"
            role="button"
          >
            <span className="essay-count-current">{displayWordCount}</span>
            <span className="essay-count-separator">/</span>
            <span className="essay-count-limit">{essayData?.wordLimit || 500}</span>
            <span className="essay-count-label">words</span>
            <ChevronDown size={14} className="essay-count-icon" />
          </div>
          
          <button 
            className="essay-icon-button"
            onClick={() => setFocusMode(!focusMode)}
            aria-label={`${focusMode ? 'Exit' : 'Enter'} focus mode`}
          >
            <Maximize2 size={18} />
          </button>
          
          <button 
            className="essay-icon-button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            className="essay-icon-button essay-help-button"
            onClick={() => setShowTipsModal(true)}
            aria-label="Show help"
          >
            <Lightbulb size={18} />
          </button>
        </div>
      </header>
      
      {/* Statistics Panel (Conditional) */}
      {showStats && (
        <div className="essay-stats-panel">
          <div className="essay-stats-header">
            <BarChart2 size={16} />
            <h2>Essay Statistics</h2>
            <button 
              className="essay-close-button"
              onClick={() => setShowStats(false)}
              aria-label="Close statistics"
            >
              <X size={16} />
            </button>
          </div>
          <div className="essay-stats-content">
            <div className="essay-stat-item">
              <FileText size={16} />
              <div className="essay-stat-info">
                <span className="essay-stat-value">{stats.wordCount}</span>
                <span className="essay-stat-label">Words</span>
              </div>
            </div>
            <div className="essay-stat-item">
              <Type size={16} />
              <div className="essay-stat-info">
                <span className="essay-stat-value">{stats.sentenceCount}</span>
                <span className="essay-stat-label">Sentences</span>
              </div>
            </div>
            <div className="essay-stat-item">
              <BookOpen size={16} />
              <div className="essay-stat-info">
                <span className="essay-stat-value">{stats.paragraphCount}</span>
                <span className="essay-stat-label">Paragraphs</span>
              </div>
            </div>
            <div className="essay-stat-item">
              <Star size={16} />
              <div className="essay-stat-info">
                <span className="essay-stat-value">{stats.averageWordsPerSentence}</span>
                <span className="essay-stat-label">Words per Sentence</span>
              </div>
            </div>
            <div className="essay-stat-item">
              <Clock size={16} />
              <div className="essay-stat-info">
                <span className="essay-stat-value">{stats.estimatedReadingTime} min</span>
                <span className="essay-stat-label">Reading Time</span>
              </div>
            </div>
            <div className="essay-stat-item">
              <MessageSquare size={16} />
              <div className="essay-stat-info">
                <span className="essay-stat-value">{allRevisionNotes.length}</span>
                <span className="essay-stat-label">Revision Notes</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="essay-main-container">
        <div className="essay-editor-container">
          {/* Essay Content Area */}
          <div 
            className="essay-content" 
            ref={essayContentRef}
            onMouseUp={handleTextSelection}
          >
            {paragraphs.map((paragraph, index) => (
              <div 
                key={index}
                className="essay-paragraph"
                id={`paragraph-${index}`}
              >
                {paragraph}
              </div>
            ))}
            
            {/* Selection Input Box */}
            {selectionActive && (
              <div 
                className="essay-selection-input"
                style={{ 
                  left: `${selectionCoords.x}px`, 
                  top: `${selectionCoords.y + 10}px` 
                }}
                ref={selectionInputRef}
              >
                <div className="essay-selection-preview">
                  <strong>Selected:</strong> {selectedText.substring(0, 60)}{selectedText.length > 60 ? '...' : ''}
                </div>
                
                <div className="essay-category-selector">
                  {noteCategories.map(cat => (
                    <button 
                      key={cat.id}
                      className={`essay-category-button ${activeCategory === cat.id ? 'active' : ''}`}
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
                  className="essay-selection-textarea"
                  value={selectionNote}
                  onChange={(e) => setSelectionNote(e.target.value)}
                  onKeyPress={handleSelectionKeyPress}
                  placeholder="What would you like to change about this text?"
                  rows={3}
                  aria-label="Revision note"
                ></textarea>
                
                <div className="essay-selection-actions">
                  <button 
                    className="essay-selection-button-cancel"
                    onClick={() => setSelectionActive(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="essay-selection-button-save"
                    onClick={handleSelectionNoteSave}
                    disabled={!selectionNote.trim()}
                    style={{ 
                      backgroundColor: noteCategories.find(cat => cat.id === activeCategory)?.color || noteCategories[0].color 
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Notes Panel */}
          <aside className="essay-notes-panel">
            <div className="essay-notes-header">
              <div className="essay-notes-title">
                <MessageSquare size={16} />
                <h2>Revision Notes</h2>
                <span className="essay-notes-count">{allRevisionNotes.length}</span>
              </div>
              
              {allRevisionNotes.length > 0 && (
                <button 
                  className="essay-clear-button"
                  onClick={clearAllNotes}
                  aria-label="Clear all notes"
                >
                  <Eraser size={14} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
            
            <div className="essay-notes-content">
              {allRevisionNotes.length === 0 ? (
                <div className="essay-notes-empty">
                  <div className="essay-notes-empty-icon">
                    <MessageSquare size={32} />
                  </div>
                  <p>Your revision notes will appear here</p>
                  <p className="essay-notes-tip">Select text in the essay to begin</p>
                </div>
              ) : (
                <div className="essay-notes-list">
                  {allRevisionNotes.map((note, index) => (
                    <div 
                      key={note.id} 
                      className="essay-note-item"
                      style={{ '--note-color': note.color }}
                    >
                      <div className="essay-note-item-header">
                        <div className="essay-note-item-info">
                          <span 
                            className="essay-note-item-number"
                            style={{ backgroundColor: note.color }}
                          >
                            {index + 1}
                          </span>
                          <span className="essay-note-item-category">
                            {noteCategories.find(cat => cat.id === note.category)?.label || 'Note'}
                          </span>
                        </div>
                        
                        <button 
                          className="essay-note-item-delete"
                          onClick={() => removeNote(note.id)}
                          aria-label="Remove note"
                        >
                          <MinusCircle size={14} />
                        </button>
                      </div>
                      
                      <div 
                        className="essay-note-item-text"
                        style={{ borderLeftColor: note.color }}
                      >
                        "{note.selectedText.substring(0, 80)}{note.selectedText.length > 80 ? '...' : ''}"
                      </div>
                      
                      <div className="essay-note-item-instruction">
                        {note.instruction}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="essay-notes-footer">
              <div className="essay-revision-tips">
                <h3>Tips for effective revisions:</h3>
                <ul>
                  <li>Be specific about what should change</li>
                  <li>Consider tone, structure, and clarity</li>
                  <li>Highlight phrases to improve or develop</li>
                </ul>
              </div>
              
              <button 
                className={`essay-button-submit ${ essayData.isLoading ? 'essay-button-submitting' : ''}`}
                onClick={submitRevision}
                disabled={allRevisionNotes.length === 0 || essayData.isLoading}
                aria-label="Submit edits"
              >
                <div className="essay-button-content">
                  {essayData.isLoading ? <CheckCircle size={16} /> : <Save size={16} />}
                  <span>{essayData.isLoading ? 'Processing Edits...' : 'Submit Edits'}</span>
                </div>
                <div className="essay-button-progress"></div>
              </button>
            </div>
          </aside>
        </div>
        
        {/* Focus Mode Notes Counter - Only visible in focus mode with notes */}
        {focusMode && allRevisionNotes.length > 0 && (
          <div 
            className="focus-mode-notes-counter"
            onClick={() => setFocusMode(false)}
            title="Click to view all notes"
          >
            <span className="counter-icon">
              <MessageSquare size={16} />
            </span>
            <span>{allRevisionNotes.length} {allRevisionNotes.length === 1 ? 'note' : 'notes'}</span>
          </div>
        )}
      </main>
      
      {/* Tips Modal */}
      {showTipsModal && (
        <div className="essay-modal-overlay" onClick={() => setShowTipsModal(false)}>
          <div 
            className="essay-modal"
            onClick={(e) => e.stopPropagation()}
            ref={tipsModalRef}
          >
            <div className="essay-modal-header">
              <div className="essay-modal-title">
                <Lightbulb size={18} />
                <h2>How to Use the Essay Editor</h2>
              </div>
              
              <button 
                className="essay-modal-close"
                onClick={() => setShowTipsModal(false)}
                aria-label="Close help"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="essay-modal-content">
              <div className="essay-tip-list">
                <div className="essay-tip-item">
                  <div className="essay-tip-number">1</div>
                  <div className="essay-tip-text">
                    <strong>Select text</strong> in your essay by clicking and dragging
                  </div>
                </div>
                
                <div className="essay-tip-item">
                  <div className="essay-tip-number">2</div>
                  <div className="essay-tip-text">
                    <strong>Choose a category</strong> for your revision note
                  </div>
                </div>
                
                <div className="essay-tip-item">
                  <div className="essay-tip-number">3</div>
                  <div className="essay-tip-text">
                    <strong>Add your revision instructions</strong> in the popup box
                  </div>
                </div>
                
                <div className="essay-tip-item">
                  <div className="essay-tip-number">4</div>
                  <div className="essay-tip-text">
                    Press <kbd>Enter</kbd> or click <strong>Save</strong> to add your note
                  </div>
                </div>
                
                <div className="essay-tip-item">
                  <div className="essay-tip-number">5</div>
                  <div className="essay-tip-text">
                    <strong>Review your notes</strong> in the panel and submit when ready
                  </div>
                </div>
              </div>
              
              <div className="essay-shortcut-section">
                <h3>Keyboard Shortcuts</h3>
                <div className="essay-shortcut-grid">
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>F</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Toggle Focus Mode</div>
                  </div>
                  
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>D</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Toggle Dark Mode</div>
                  </div>
                  
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>S</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Submit Edits</div>
                  </div>
                  
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>K</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Show Shortcuts</div>
                  </div>
                  
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Esc</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Close Popups</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="essay-modal-footer">
              <button 
                className="essay-modal-button"
                onClick={() => setShowTipsModal(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="essay-modal-overlay" onClick={() => setShowKeyboardShortcuts(false)}>
          <div 
            className="essay-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="essay-modal-header">
              <div className="essay-modal-title">
                <Settings size={18} />
                <h2>Keyboard Shortcuts</h2>
              </div>
              
              <button 
                className="essay-modal-close"
                onClick={() => setShowKeyboardShortcuts(false)}
                aria-label="Close shortcuts"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="essay-modal-content">
              <div className="essay-shortcut-section">
                <h3>Navigation</h3>
                <div className="essay-shortcut-grid">
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>F</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Toggle Focus Mode</div>
                  </div>
                </div>
              </div>
              
              <div className="essay-shortcut-section">
                <h3>Appearance</h3>
                <div className="essay-shortcut-grid">
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>D</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Toggle Dark Mode</div>
                  </div>
                </div>
              </div>
              
              <div className="essay-shortcut-section">
                <h3>Actions</h3>
                <div className="essay-shortcut-grid">
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>S</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Submit Edits</div>
                  </div>
                  
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Esc</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Close Popups</div>
                  </div>
                </div>
              </div>
              
              <div className="essay-shortcut-section">
                <h3>Help</h3>
                <div className="essay-shortcut-grid">
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>K</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Show Shortcuts</div>
                  </div>
                  
                  <div className="essay-shortcut">
                    <div className="essay-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>H</kbd>
                    </div>
                    <div className="essay-shortcut-desc">Show Help</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayStep3;