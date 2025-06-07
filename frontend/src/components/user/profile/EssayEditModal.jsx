import React, { useState, useRef, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import './EssayEditModal.css';

/**
 * EssayEditModal - Modal component for editing a specific essay configuration
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.essay - The essay configuration to edit
 * @param {Object} props.school - The school the essay belongs to
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onSave - Function to call when the essay is saved
 */
const EssayEditModal = ({ essay, school, isOpen, onClose, onSave }) => {
  const modalRef = useRef(null);
  const [editedEssay, setEditedEssay] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize edited essay when modal opens or essay changes
  useEffect(() => {
    if (essay) {
      setEditedEssay({ ...essay });
    }
  }, [essay, isOpen]);

  // Effect to center modal and block scroll
  useEffect(() => {
    if (isOpen && modalRef.current) {
      document.body.style.overflow = 'hidden';
      
      // Center the modal
      const modalElement = modalRef.current;
      const modalRect = modalElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const desiredScrollTop = window.scrollY + modalRect.top - (viewportHeight - modalRect.height) / 2;
      const finalScrollTop = Math.max(0, desiredScrollTop);
      
      window.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Update edited essay
  const updateEssay = (changes) => {
    if (!editedEssay) return;
    
    setEditedEssay({
      ...editedEssay,
      ...changes
    });
  };

  // Save changes
  const handleSave = () => {
    if (!editedEssay) return;
    
    setIsSaving(true);
    
    // Simulate a delay for saving
    setTimeout(() => {
      if (onSave) {
        onSave(editedEssay);
      }
      
      setIsSaving(false);
      if (onClose) onClose();
    }, 500);
  };

  // Check if save button should be disabled
  const isSaveButtonDisabled = () => {
    if (!editedEssay) return true;
    return !editedEssay.subject.trim();
  };

  if (!isOpen || !essay || !school) return null;

  return (
    <div className="essay-edit-modal-overlay" onClick={onClose}>
      <div 
        ref={modalRef} 
        className="essay-edit-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="essay-edit-modal-close-button" 
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="essay-edit-modal-content">
          <div className="essay-edit-modal-header">
            <h2>Edit Essay Configuration</h2>
            <p className="essay-edit-modal-school-name">{school.name}</p>
          </div>

          <div className="essay-edit-modal-form">
            <div className="essay-edit-modal-form-group">
              <label htmlFor="essay-subject">Essay Topic</label>
              <textarea
                id="essay-subject"
                className="essay-edit-modal-textarea"
                placeholder="Enter the exact essay topic or question..."
                value={editedEssay?.subject || ''}
                onChange={(e) => updateEssay({ subject: e.target.value })}
                rows={4}
              />
              <p className="essay-edit-modal-field-hint">
                Paste the exact topic from the school's application for best results.
              </p>
            </div>

            <div className="essay-edit-modal-form-row">
              <div className="essay-edit-modal-form-group">
                <label>Limit Type</label>
                <div className="essay-edit-modal-toggle">
                  <button
                    className={`essay-edit-modal-toggle-option ${editedEssay?.limitType === 'words' ? 'active' : ''}`}
                    onClick={() => updateEssay({ limitType: 'words' })}
                  >
                    Words
                  </button>
                  <button
                    className={`essay-edit-modal-toggle-option ${editedEssay?.limitType === 'characters' ? 'active' : ''}`}
                    onClick={() => updateEssay({ limitType: 'characters' })}
                  >
                    Characters
                  </button>
                </div>
              </div>

              <div className="essay-edit-modal-form-group">
                <label htmlFor="essay-limit">{editedEssay?.limitType === 'words' ? 'Word' : 'Character'} Limit</label>
                <input
                  id="essay-limit"
                  type="number"
                  className="essay-edit-modal-input"
                  value={editedEssay?.limitType === 'words' ? (editedEssay?.wordLimit || 500) : (editedEssay?.characterLimit || (editedEssay?.wordLimit || 500) * 5)}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (editedEssay?.limitType === 'words') {
                      updateEssay({ wordLimit: value });
                    } else {
                      updateEssay({ characterLimit: value });
                    }
                  }}
                  min={editedEssay?.limitType === 'words' ? 100 : 500}
                  max={editedEssay?.limitType === 'words' ? 2000 : 10000}
                />
              </div>
            </div>

            <div className="essay-edit-modal-form-group">
              <label htmlFor="essay-context">Additional Context (optional)</label>
              <textarea
                id="essay-context"
                className="essay-edit-modal-textarea"
                placeholder="Add extra details to personalize your essay..."
                value={editedEssay?.context || ''}
                onChange={(e) => updateEssay({ context: e.target.value })}
                rows={4}
              />
              <p className="essay-edit-modal-field-hint">
                E.g.: specific experiences, school values, preferred focus...
              </p>
            </div>

            <div className="essay-edit-modal-form-row">
              <div className="essay-edit-modal-form-group">
                <label>Essay Tone</label>
                <div className="essay-edit-modal-toggle">
                  <button
                    className={`essay-edit-modal-toggle-option ${editedEssay?.tone === 'professional' ? 'active' : ''}`}
                    onClick={() => updateEssay({ tone: 'professional' })}
                  >
                    Professional
                  </button>
                  <button
                    className={`essay-edit-modal-toggle-option ${editedEssay?.tone === 'conversational' ? 'active' : ''}`}
                    onClick={() => updateEssay({ tone: 'conversational' })}
                  >
                    Conversational
                  </button>
                </div>
              </div>

              <div className="essay-edit-modal-form-group">
                <label>Writing Style</label>
                <div className="essay-edit-modal-toggle">
                  <button
                    className={`essay-edit-modal-toggle-option ${editedEssay?.style === 'narrative' ? 'active' : ''}`}
                    onClick={() => updateEssay({ style: 'narrative' })}
                  >
                    Narrative
                  </button>
                  <button
                    className={`essay-edit-modal-toggle-option ${editedEssay?.style === 'analytical' ? 'active' : ''}`}
                    onClick={() => updateEssay({ style: 'analytical' })}
                  >
                    Analytical
                  </button>
                </div>
              </div>
            </div>

            <div className="essay-edit-modal-info-box">
              <AlertCircle size={18} />
              <div>
                <p>Any changes made here will be used when generating or regenerating your essay.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="essay-edit-modal-footer">
          <button
            className="essay-edit-modal-button secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="essay-edit-modal-button primary"
            onClick={handleSave}
            disabled={isSaveButtonDisabled() || isSaving}
          >
            {isSaving ? (
              <>
                <span className="essay-edit-modal-spinner"></span>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EssayEditModal; 