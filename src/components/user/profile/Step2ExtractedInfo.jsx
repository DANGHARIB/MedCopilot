import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Edit2, Clock, Book, Award, GraduationCap, CheckCircle, ArrowLeft, ArrowRight, Save, AlertCircle } from 'lucide-react';
// X is removed as it was for the modal close button
// useNavigate is kept as it might be used by the parent or if this component needs navigation later, but not directly for the removed modal.
// useRef is removed as modalRef is no longer needed.
import './Step2ExtractedInfo.css';

const Step2ExtractedInfo = ({ formData, updateFormData, onBack, onSetupComplete }) => {
  // useNavigate is removed from here as it's not used directly by this component after modal removal.
  // If navigation is needed, it should be handled by the parent or the new ProfileSetupComplete component.
  
  // États pour gérer les sections pliables
  const [personalStatementOpen, setPersonalStatementOpen] = useState(true);
  const [experiencesOpen, setExperiencesOpen] = useState(true);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [academicOpen, setAcademicOpen] = useState(true);
  
  // États pour gérer l'édition
  const [editingPersonalStatement, setEditingPersonalStatement] = useState(false);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
  const [editingAcademic, setEditingAcademic] = useState(false);
  
  // États pour gérer les changements sauvegardés
  const [personalStatementSaved, setPersonalStatementSaved] = useState(false);
  const [experienceSaved, setExperienceSaved] = useState(false);
  const [academicSaved, setAcademicSaved] = useState(false);
  
  // État local pour stocker les modifications
  const [localFormData, setLocalFormData] = useState({
    personalStatement: formData.personalStatement || "From an early age, I've been fascinated by the intersection of science and human compassion. Growing up with a chronically ill parent, I witnessed first-hand the impact that dedicated healthcare professionals can have on patients and their families. These experiences ignited my curiosity about the human body and inspired me to pursue a career in medicine where I could combine scientific knowledge with empathetic care to make a meaningful difference in people's lives......",
    experiences: formData.experiences || [
      {
        title: "Hospital Volunteer Program Lead",
        organization: "Memorial Hospital",
        hours: "650",
        description: "Coordinated a team of 20 volunteers, established new protocols for patient interaction, and personally dedicated over 650 hours to improving the patient experience in the oncology ward. Developed a patient comfort initiative that was adopted hospital-wide, resulting in significantly improved patient satisfaction scores."
      },
      {
        title: "Research Assistant - Immunology Lab",
        organization: "Stanford University",
        hours: "1200",
        description: "Conducted research on autoimmune responses in rheumatalogical conditions, resulting in co-authorship on two peer-reviewed publications. Designed and executed experiments examining T-cell regulation, maintained cell cultures, and analyzed data using flow cytometry and statistical software packages."
      },
      {
        title: "Rural Health Outreach Coordinator",
        organization: "Global Health Initiative",
        hours: "300",
        description: "Led mobile clinic initiatives in underserved rural communities, providing preventative care education and basic health screenings to over 500 residents. Collaborated with local health workers to establish sustainable health promotion programs and secured grant funding to expand services."
      }
    ],
    academicInfo: formData.academicInfo || {
      institution: "University of California, Berkeley",
      major: "Molecular Cell Biology",
      minor: "Global Public Health",
      gpa: "3.87",
      mcatScore: "518"
    }
  });

  // Modal-related state and ref are removed
  // const [showModal, setShowModal] = useState(false);
  // const modalRef = useRef(null); 
  
  // Effets pour réinitialiser les états de sauvegarde après un délai
  useEffect(() => {
    if (personalStatementSaved) {
      const timer = setTimeout(() => setPersonalStatementSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [personalStatementSaved]);
  
  useEffect(() => {
    if (experienceSaved) {
      const timer = setTimeout(() => setExperienceSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [experienceSaved]);
  
  useEffect(() => {
    if (academicSaved) {
      const timer = setTimeout(() => setAcademicSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [academicSaved]);

  // Modal-related useEffect hooks (scrollToCenter, body scroll lock, animation) are removed.

  // Gérer les changements du personal statement
  const handlePersonalStatementChange = (e) => {
    setLocalFormData({
      ...localFormData,
      personalStatement: e.target.value
    });
  };

  // Gérer les changements d'expérience
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...localFormData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    
    setLocalFormData({
      ...localFormData,
      experiences: updatedExperiences
    });
  };

  // Gérer les changements d'informations académiques
  const handleAcademicChange = (field, value) => {
    setLocalFormData({
      ...localFormData,
      academicInfo: {
        ...localFormData.academicInfo,
        [field]: value
      }
    });
  };
  
  // Sauvegarder le personal statement et quitter le mode édition
  const savePersonalStatement = () => {
    setEditingPersonalStatement(false);
    setPersonalStatementSaved(true);
    // Note: updateFormData n'est pas appelé ici, mais au moment de handleConfirm
  };
  
  // Sauvegarder l'expérience et quitter le mode édition
  const saveExperience = () => { // L'index n'est pas nécessaire si on sauvegarde l'état local global
    setEditingExperienceIndex(null);
    setExperienceSaved(true);
  };
  
  // Sauvegarder les informations académiques et quitter le mode édition
  const saveAcademic = () => {
    setEditingAcademic(false);
    setAcademicSaved(true);
  };

  // Sauvegarder les modifications et passer à l'étape suivante (ou afficher le modal)
  const handleConfirm = () => {
    updateFormData({ // Met à jour le state du parent/global
      personalStatement: localFormData.personalStatement,
      experiences: localFormData.experiences,
      academicInfo: localFormData.academicInfo
    });
    
    // Appel direct au callback pour passer au ProfileSetupComplete
    if (onSetupComplete) {
      onSetupComplete(); // Cette fonction doit afficher ProfileSetupComplete.jsx dans le composant parent
    }
  };

  // handleGoToSchools and closeModal are removed as they were modal-specific.

  return (
    <>
      {/* Completion Modal JSX is removed */}
      
      <div className="step-extracted-info-content-wrapper">
        <div className="extracted-info-header">
        <h1 className="extracted-info-title">Review Your Information</h1>
        <p className="extracted-info-description">
          We've extracted the following information from your AMCAS application. Please review each section and make any
          necessary edits before continuing.
        </p>
      </div>

      {/* Personal Statement Section */}
      <div className="extracted-info-section">
        <div 
          className="extracted-info-section-header"
          onClick={() => setPersonalStatementOpen(!personalStatementOpen)}
          role="button"
          aria-expanded={personalStatementOpen}
          aria-controls="personal-statement-content"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setPersonalStatementOpen(!personalStatementOpen)}
        >
          <div className="extracted-info-section-title">
            <Book size={40} className="extracted-info-section-icon" />
            <h2>Personal Statement</h2>
          </div>
          <button 
            className="extracted-info-section-toggle"
            aria-label={personalStatementOpen ? "Collapse personal statement section" : "Expand personal statement section"}
          >
            {personalStatementOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {personalStatementOpen && (
          <div className="extracted-info-section-content" id="personal-statement-content">
            {editingPersonalStatement ? (
              <div className="extracted-info-edit-area">
                <textarea
                  className="extracted-info-textarea"
                  value={localFormData.personalStatement}
                  onChange={handlePersonalStatementChange}
                  rows={8}
                  aria-label="Edit personal statement"
                />
                <div className="extracted-info-edit-actions">
                  <button 
                    className="extracted-info-button-secondary"
                    onClick={() => setEditingPersonalStatement(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="extracted-info-button-primary"
                    onClick={savePersonalStatement}
                  >
                    <Save size={16} style={{ marginRight: '6px' }} />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="extracted-info-text-display">
                <p>{localFormData.personalStatement}</p>
                <button 
                  className="extracted-info-edit-button"
                  onClick={() => setEditingPersonalStatement(true)}
                  aria-label="Edit personal statement"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
            <div className={`extracted-info-success-message ${personalStatementSaved ? 'visible' : ''}`}>
              {personalStatementSaved ? (
                <>
                  <CheckCircle size={16} className="extracted-info-success-icon" />
                  <span>Changes saved successfully</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="extracted-info-success-icon" />
                  <span>Successfully extracted personal statement (5,300 characters)</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Most Meaningful Experiences Section */}
      <div className="extracted-info-section">
        <div 
          className="extracted-info-section-header"
          onClick={() => setExperiencesOpen(!experiencesOpen)}
          role="button"
          aria-expanded={experiencesOpen}
          aria-controls="experiences-content"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setExperiencesOpen(!experiencesOpen)}
        >
          <div className="extracted-info-section-title">
            <Award size={40} className="extracted-info-section-icon" />
            <h2>Most Meaningful Experiences</h2>
          </div>
          <button 
            className="extracted-info-section-toggle"
            aria-label={experiencesOpen ? "Collapse experiences section" : "Expand experiences section"}
          >
            {experiencesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {experiencesOpen && (
          <div className="extracted-info-section-content" id="experiences-content">
            {localFormData.experiences.map((experience, index) => (
              <div className="extracted-info-experience-item" key={index}>
                {editingExperienceIndex === index ? (
                  <div className="extracted-info-edit-area">
                    <div className="extracted-info-form-row">
                      <label htmlFor={`experience-title-${index}`} className="extracted-info-form-label">Title / Position</label>
                      <input
                        id={`experience-title-${index}`}
                        type="text"
                        className="extracted-info-input"
                        value={experience.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        placeholder="Title / Position"
                      />
                    </div>
                    <div className="extracted-info-form-row extracted-info-form-grid">
                      <div>
                        <label htmlFor={`experience-org-${index}`} className="extracted-info-form-label">Organization</label>
                        <input
                          id={`experience-org-${index}`}
                          type="text"
                          className="extracted-info-input"
                          value={experience.organization}
                          onChange={(e) => handleExperienceChange(index, 'organization', e.target.value)}
                          placeholder="Organization"
                        />
                      </div>
                      <div>
                        <label htmlFor={`experience-hours-${index}`} className="extracted-info-form-label">Hours</label>
                        <input
                          id={`experience-hours-${index}`}
                          type="text"
                          className="extracted-info-input-small"
                          value={experience.hours}
                          onChange={(e) => handleExperienceChange(index, 'hours', e.target.value)}
                          placeholder="Hours"
                        />
                      </div>
                    </div>
                    <div className="extracted-info-form-row">
                      <label htmlFor={`experience-desc-${index}`} className="extracted-info-form-label">Description</label>
                      <textarea
                        id={`experience-desc-${index}`}
                        className="extracted-info-textarea"
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        rows={4}
                        placeholder="Description"
                      />
                    </div>
                    <div className="extracted-info-edit-actions">
                      <button 
                        className="extracted-info-button-secondary"
                        onClick={() => setEditingExperienceIndex(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="extracted-info-button-primary"
                        onClick={saveExperience} // L'index n'est plus explicitement passé ici, car on sauvegarde l'état global localFormData
                      >
                        <Save size={16} style={{ marginRight: '6px' }} />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="extracted-info-experience-display">
                    <div className="extracted-info-experience-header">
                      <h3 className="extracted-info-experience-title">{experience.title}</h3>
                      <button 
                        className="extracted-info-edit-button"
                        onClick={() => setEditingExperienceIndex(index)}
                        aria-label={`Edit experience: ${experience.title}`}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                    <div className="extracted-info-experience-meta">
                      <span>{experience.organization}</span>
                      <span className="extracted-info-hours">
                        <Clock size={14} />
                        {experience.hours} hours
                      </span>
                    </div>
                    <p className="extracted-info-experience-description">
                      {experience.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div className={`extracted-info-success-message ${experienceSaved ? 'visible' : ''}`}>
              {experienceSaved ? (
                <>
                  <CheckCircle size={16} className="extracted-info-success-icon" />
                  <span>Experience updated successfully</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="extracted-info-success-icon" />
                  <span>3 most meaningful experiences extracted</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Other Activities & Experiences Section */}
      <div className="extracted-info-section">
        <div 
          className="extracted-info-section-header"
          onClick={() => setActivitiesOpen(!activitiesOpen)}
          role="button"
          aria-expanded={activitiesOpen}
          aria-controls="activities-content"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActivitiesOpen(!activitiesOpen)}
        >
          <div className="extracted-info-section-title">
            <Award size={40} className="extracted-info-section-icon" />
            <h2>Other Activities & Experiences</h2>
          </div>
          <button 
            className="extracted-info-section-toggle"
            aria-label={activitiesOpen ? "Collapse activities section" : "Expand activities section"}
          >
            {activitiesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {activitiesOpen && (
          <div className="extracted-info-section-content" id="activities-content">
            <div className="extracted-info-placeholder-text">
              <AlertCircle size={40} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              We've detected 12 additional activities in your AMCAS application. 
              These will be available for reference when writing your secondary essays.
            </div>
          </div>
        )}
      </div>

      {/* Academic Information Section */}
      <div className="extracted-info-section">
        <div 
          className="extracted-info-section-header"
          onClick={() => setAcademicOpen(!academicOpen)}
          role="button"
          aria-expanded={academicOpen}
          aria-controls="academic-content"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setAcademicOpen(!academicOpen)}
        >
          <div className="extracted-info-section-title">
            <GraduationCap size={40} className="extracted-info-section-icon" />
            <h2>Academic Information</h2>
          </div>
          <button 
            className="extracted-info-section-toggle"
            aria-label={academicOpen ? "Collapse academic section" : "Expand academic section"}
          >
            {academicOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {academicOpen && (
          <div className="extracted-info-section-content" id="academic-content">
            {editingAcademic ? (
              <div className="extracted-info-edit-area">
                <div className="extracted-info-form-grid">
                  <div className="extracted-info-form-group">
                    <label htmlFor="academic-institution" className="extracted-info-form-label">Undergraduate Institution</label>
                    <input
                      id="academic-institution"
                      type="text"
                      className="extracted-info-input"
                      value={localFormData.academicInfo.institution}
                      onChange={(e) => handleAcademicChange('institution', e.target.value)}
                    />
                  </div>
                  <div className="extracted-info-form-group">
                    <label htmlFor="academic-major" className="extracted-info-form-label">Major</label>
                    <input
                      id="academic-major"
                      type="text"
                      className="extracted-info-input"
                      value={localFormData.academicInfo.major}
                      onChange={(e) => handleAcademicChange('major', e.target.value)}
                    />
                  </div>
                  <div className="extracted-info-form-group">
                    <label htmlFor="academic-minor" className="extracted-info-form-label">Minor</label>
                    <input
                      id="academic-minor"
                      type="text"
                      className="extracted-info-input"
                      value={localFormData.academicInfo.minor}
                      onChange={(e) => handleAcademicChange('minor', e.target.value)}
                    />
                  </div>
                  <div className="extracted-info-form-group">
                    <label htmlFor="academic-gpa" className="extracted-info-form-label">Cumulative GPA</label>
                    <input
                      id="academic-gpa"
                      type="text"
                      className="extracted-info-input"
                      value={localFormData.academicInfo.gpa}
                      onChange={(e) => handleAcademicChange('gpa', e.target.value)}
                    />
                  </div>
                  <div className="extracted-info-form-group">
                    <label htmlFor="academic-mcat" className="extracted-info-form-label">MCAT Score</label>
                    <input
                      id="academic-mcat"
                      type="text"
                      className="extracted-info-input"
                      value={localFormData.academicInfo.mcatScore}
                      onChange={(e) => handleAcademicChange('mcatScore', e.target.value)}
                    />
                  </div>
                </div>
                <div className="extracted-info-edit-actions">
                  <button 
                    className="extracted-info-button-secondary"
                    onClick={() => setEditingAcademic(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="extracted-info-button-primary"
                    onClick={saveAcademic}
                  >
                    <Save size={16} style={{ marginRight: '6px' }} />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="extracted-info-academic-display">
                <div className="extracted-info-academic-row">
                  <div className="extracted-info-academic-group">
                    <div className="extracted-info-academic-label">Undergraduate Institution</div>
                    <div className="extracted-info-academic-value">{localFormData.academicInfo.institution}</div>
                  </div>
                  <div className="extracted-info-academic-group">
                    <div className="extracted-info-academic-label">Major</div>
                    <div className="extracted-info-academic-value">{localFormData.academicInfo.major}</div>
                  </div>
                  <button 
                    className="extracted-info-edit-button"
                    onClick={() => setEditingAcademic(true)}
                    aria-label="Edit academic information"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <div className="extracted-info-academic-row">
                  <div className="extracted-info-academic-group">
                    <div className="extracted-info-academic-label">Minor</div>
                    <div className="extracted-info-academic-value">{localFormData.academicInfo.minor}</div>
                  </div>
                  <div className="extracted-info-academic-group">
                    <div className="extracted-info-academic-label">Cumulative GPA</div>
                    <div className="extracted-info-academic-value">{localFormData.academicInfo.gpa}</div>
                  </div>
                </div>
                <div className="extracted-info-academic-row">
                  <div className="extracted-info-academic-group">
                    <div className="extracted-info-academic-label">MCAT Score</div>
                    <div className="extracted-info-academic-value">{localFormData.academicInfo.mcatScore}</div>
                  </div>
                </div>
              </div>
            )}
            <div className={`extracted-info-success-message ${academicSaved ? 'visible' : ''}`}>
              {academicSaved ? (
                <>
                  <CheckCircle size={16} className="extracted-info-success-icon" />
                  <span>Academic information updated successfully</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="extracted-info-success-icon" />
                  <span>Academic information successfully extracted</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Information */}
      <div className="extracted-info-summary">
        <div className="extracted-info-summary-content">
          <CheckCircle size={40} className="extracted-info-summary-icon" />
          <div className="extracted-info-summary-text">
            <h3>Data extraction complete</h3>
            <p>
              We've successfully extracted your personal statement, 15 experiences (including 3 most meaningful), and
              academic information. You can edit any section by clicking the pencil icon.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="extracted-info-actions">
        <button 
          className="extracted-info-button-back"
          onClick={onBack}
          aria-label="Return to previous step"
        >
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Back
        </button>
        <button 
          className="extracted-info-button-continue"
          onClick={handleConfirm} // Affiche le modal au lieu de naviguer directement
          aria-label="Confirm information and continue"
        >
          Confirm and Continue
          <ArrowRight size={18} style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </div> {/* Closing step-extracted-info-content-wrapper */}
    </>
  );
};

export default Step2ExtractedInfo;
