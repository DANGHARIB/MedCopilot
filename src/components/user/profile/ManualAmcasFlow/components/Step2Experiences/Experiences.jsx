import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Plus, Trash2, Check, AlertCircle, Info, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { CountrySelect, StateSelect, CitySelect } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import './Experiences.css';
import '../shared/shared.css';

// Types d'expériences selon AMCAS
const experienceTypes = [
  { value: 'paid-employment', label: 'Paid Employment' },
  { value: 'research', label: 'Research' },
  { value: 'teaching', label: 'Teaching/Tutoring' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'physician-shadowing', label: 'Physician Shadowing' },
  { value: 'community-service', label: 'Community Service' },
  { value: 'extracurricular', label: 'Extracurricular Activities' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'honors', label: 'Honors/Awards' },
  { value: 'publications', label: 'Publications' },
  { value: 'presentations', label: 'Presentations' },
  { value: 'intercollegiate-athletics', label: 'Intercollegiate Athletics' },
  { value: 'other', label: 'Other' }
];

// Composant de sélection avec recherche
const SearchableSelect = ({ value, options, onChange, placeholder, disabled, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  
  // Trouver l'étiquette correspondant à la valeur actuelle
  const selectedLabel = options.find(option => option.value === value)?.label || '';

  // Filtrer les options en fonction du terme de recherche
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Gérer le clic en dehors du composant pour fermer la liste
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Ouvrir/fermer la liste déroulante
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 50);
      } else {
        setSearchTerm('');
      }
    }
  };
  
  // Sélectionner une option
  const selectOption = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
    setSearchTerm('');
  };
  
  return (
    <div className={`searchable-select ${className || ''}`} ref={wrapperRef}>
      <div 
        className={`select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={toggleDropdown}
      >
        {!isOpen ? (
          <span className={`select-value ${!value ? 'placeholder' : ''}`}>
            {value ? selectedLabel : placeholder}
          </span>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="select-search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <span className="select-arrow">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>
      
      {isOpen && (
        <div className="select-options">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div 
                key={option.value} 
                className={`select-option ${option.value === value ? 'selected' : ''}`}
                onClick={() => selectOption(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="select-no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

const Experiences = ({
  formData,
  updateFormData,
  onNext,
  onBack
}) => {
  // Structure expérience par défaut
  const emptyExperience = {
    id: `exp_${Date.now()}`,
    title: '',  // Experience Name
    type: '',   // Experience Type
    organization: '',  // Organization Name
    city: null,   // City (objet de react-country-state-city)
    state: null,  // State (objet de react-country-state-city)
    country: null,  // Country (objet de react-country-state-city)
    description: '',  // Experience Description
    meaningfulRemarks: '', // Most Meaningful Experience Remarks
    completed: false,  // Completed (défaut: false pour permettre la sélection)
    dateStart: '',   // Date début
    dateEnd: '',     // Date fin
    anticipatedEnd: false, // Si la date de fin est anticipée
    order: 1,
    isMeaningful: false
  };

  // Initialiser les expériences depuis formData ou avec une expérience vide
  const initialExperiences = formData?.experiences?.length 
    ? formData.experiences 
    : [{ ...emptyExperience }];
  
  const [experiences, setExperiences] = useState(initialExperiences);
  const [expandedExperience, setExpandedExperience] = useState(initialExperiences[0]?.id || '');
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const lastUpdateRef = useRef({ experiences: initialExperiences });
  
  // Constantes
  const MAX_EXPERIENCES = 15;
  
  // Mettre à jour les données parentes avec debounce
  useEffect(() => {
    if (JSON.stringify(experiences) !== JSON.stringify(lastUpdateRef.current.experiences)) {
      const timer = setTimeout(() => {
        updateFormData({ experiences });
        lastUpdateRef.current.experiences = [...experiences];
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [experiences, updateFormData]);
  
  // Gestion de l'état de saisie
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timer);
  }, [experiences]);
  
  // Ajouter une nouvelle expérience
  const addExperience = () => {
    if (experiences.length >= MAX_EXPERIENCES) return;
    
    const newId = `exp_${Date.now()}`;
    const newOrder = experiences.length + 1;
    
    const newExperience = {
      ...emptyExperience,
      id: newId,
      order: newOrder
    };
    
    setExperiences([...experiences, newExperience]);
    setExpandedExperience(newId);
  };
  
  // Supprimer une expérience
  const removeExperience = (id) => {
    if (experiences.length <= 1) return;
    
    const updatedExperiences = experiences
      .filter(exp => exp.id !== id)
      .map((exp, index) => ({ ...exp, order: index + 1 }));
    
    setExperiences(updatedExperiences);
    
    // Si l'expérience supprimée était celle étendue, étendre la première
    if (expandedExperience === id && updatedExperiences.length > 0) {
      setExpandedExperience(updatedExperiences[0].id);
    }
  };
  
  // Mettre à jour une expérience
  const updateExperience = (id, field, value) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === id) {
        // Si nous changeons de pays, réinitialiser l'état et la ville
        if (field === 'country') {
          return { ...exp, [field]: value, state: null, city: null };
        }
        
        // Si nous changeons d'état, réinitialiser la ville
        if (field === 'state') {
          return { ...exp, [field]: value, city: null };
        }
        
        return { ...exp, [field]: value };
      }
      return exp;
    });
    
    setExperiences(updatedExperiences);
  };
  
  // Mettre à jour le statut d'une expérience (exclusif)
  const updateExperienceStatus = (id, status) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === id) {
        switch (status) {
          case 'completed':
            return { ...exp, completed: true, anticipatedEnd: false };
          case 'anticipated':
            return { ...exp, completed: false, anticipatedEnd: true, dateEnd: '' };
          case 'ongoing':
            return { ...exp, completed: false, anticipatedEnd: false };
          default:
            return exp;
        }
      }
      return exp;
    });
    
    setExperiences(updatedExperiences);
  };
  
  // Déplacer une expérience vers le haut ou le bas
  const moveExperience = (id, direction) => {
    const currentIndex = experiences.findIndex(exp => exp.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === experiences.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedExperiences = [...experiences];
    const expToMove = updatedExperiences[currentIndex];
    
    // Suppression de l'élément à sa position actuelle
    updatedExperiences.splice(currentIndex, 1);
    // Insertion à la nouvelle position
    updatedExperiences.splice(newIndex, 0, expToMove);
    
    // Mise à jour des ordres
    const reorderedExperiences = updatedExperiences.map((exp, index) => ({
      ...exp,
      order: index + 1
    }));
    
    setExperiences(reorderedExperiences);
  };
  
  // Vérifier si les données sont valides pour continuer
  const isValidToSubmit = () => {
    // Au moins une expérience doit avoir un titre et une description
    return experiences.some(exp => 
      exp.title.trim() !== '' && exp.description.trim() !== ''
    );
  };
  
  // Marquer une expérience comme significative
  const toggleMeaningful = (id) => {
    const updatedExperiences = experiences.map(exp => 
      exp.id === id ? { ...exp, isMeaningful: !exp.isMeaningful } : exp
    );
    
    setExperiences(updatedExperiences);
  };
  
  // Formatter la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Si le format est déjà JJ/MM/AAAA
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      return dateString;
    }
    
    // Si le format est MM/AAAA (ancien format)
    if (dateString.match(/^\d{1,2}\/\d{4}$/)) {
      const [month, year] = dateString.split('/');
      return `01/${month}/${year}`;
    }
    
    return dateString;
  };

  // Formatter la date pour l'input date
  const formatDateInputValue = (dateString) => {
    if (!dateString) return '';
    
    // Si c'est déjà au format JJ/MM/AAAA
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Si c'est au format MM/AAAA (ancien format)
    if (dateString.match(/^\d{1,2}\/\d{4}$/)) {
      const [month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-01`;
    }
    
    return '';
  };
  
  return (
    <div className="experiences">
      <div className="experiences-container">
        {/* Header */}
        <div className="experiences-header">
          <div className="header-main-row">
            <div className="header-text-group">
              <div className="header-title">
                Significant{" "}
                <span className="header-title-highlight">Experiences</span>
              </div>
              <p className="header-subtitle">
                Share up to 15 meaningful experiences from your AMCAS application. <br/>
                Focus on activities that demonstrate your qualities, skills, and passion for medicine.
              </p>
            </div>
            
            <button 
              className="help-toggle"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Toggle help information"
            >
              <Info className="help-toggle-icon" />
              <span>Guidelines</span>
            </button>
          </div>
          
          {/* Panel d'aide */}
          {showHelp && (
            <div className="help-panel">
              <div className="help-content">
                <h3 className="help-title">Experience Guidelines</h3>
                <div className="help-tips">
                  <div className="tip">
                    <Check className="tip-icon" />
                    <span>Include 3+ experiences minimum (15 max)</span>
                  </div>
                  <div className="tip">
                    <Check className="tip-icon" />
                    <span>Focus on impact and skills gained</span>
                  </div>
                  <div className="tip">
                    <Check className="tip-icon" />
                    <span>Be specific and concise in descriptions</span>
                  </div>
                  <div className="tip">
                    <Check className="tip-icon" />
                    <span>Mark most meaningful experiences</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Corps principal - liste des expériences */}
        <div className="experiences-body">
          {/* Liste des expériences */}
          <div className="experiences-list">
            {experiences.map((experience, index) => (
              <div 
                key={experience.id}
                className={`experience-card ${expandedExperience === experience.id ? 'expanded' : 'collapsed'} ${experience.isMeaningful ? 'meaningful' : ''}`}
                draggable={false}
              >
                <div 
                  className="experience-header"
                  onClick={() => setExpandedExperience(
                    expandedExperience === experience.id ? null : experience.id
                  )}
                >
                  <div className="experience-header-left">
                    <div className="experience-order">
                      <span>{experience.order}</span>
                    </div>
                    <div className="experience-title-container">
                    
                      <div className="experience-header-details">
                        {experience.type && (
                          <div className="experience-type-badge">
                            {experienceTypes.find(t => t.value === experience.type)?.label || 'Other'}
                          </div>
                        )}
                        {experience.organization && (
                          <div className="experience-org-badge">
                            {experience.organization}
                          </div>
                        )}
                        {(experience.dateStart || experience.dateEnd) && (
                          <div className="experience-date-badge">
                            {formatDate(experience.dateStart)}
                            {experience.dateStart && experience.dateEnd && " - "}
                            {experience.dateEnd && formatDate(experience.dateEnd)}
                            {experience.anticipatedEnd && " (Anticipated)"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="experience-header-right">
                    {experience.isMeaningful && (
                      <div className="meaningful-badge">
                        <Check size={14} />
                        <span>Most Meaningful</span>
                      </div>
                    )}
                    <button 
                      className={`experience-expand-btn ${expandedExperience === experience.id ? 'expanded' : ''}`}
                      aria-label={expandedExperience === experience.id ? "Collapse experience" : "Expand experience"}
                    >
                      {expandedExperience === experience.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>
                
                {expandedExperience === experience.id && (
                  <div className="experience-content">
                    <div className="experience-form">
                      {/* Ligne 1: Type, Nom et Organisation sur la même ligne */}
                      <div className="form-row triple-column">
                        <div className="form-group">
                          <label htmlFor={`type-${experience.id}`}>
                            <span>Type</span>
                          </label>
                          <select
                            id={`type-${experience.id}`}
                            value={experience.type}
                            onChange={(e) => updateExperience(experience.id, 'type', e.target.value)}
                            className="form-select modern-select"
                          >
                            <option value="">Select...</option>
                            {experienceTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor={`title-${experience.id}`}>
                            <span>Name</span>
                          </label>
                          <input
                            type="text"
                            id={`title-${experience.id}`}
                            value={experience.title}
                            onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                            placeholder="Hospital Volunteer, Research Assistant..."
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor={`organization-${experience.id}`}>
                            <span>Organization</span>
                          </label>
                          <input
                            type="text"
                            id={`organization-${experience.id}`}
                            value={experience.organization}
                            onChange={(e) => updateExperience(experience.id, 'organization', e.target.value)}
                            placeholder="Cleveland Clinic, Harvard Medical School..."
                            className="form-input"
                          />
                        </div>
                      </div>
                      
                      {/* Ligne 2: Localisation dans l'ordre demandé: Pays, État, Ville */}
                      <div className="form-row location-row">
                        <div className="form-group">
                          <label>
                            <span>Country</span>
                          </label>
                          <CountrySelect
                            containerClassName="country-select-container"
                            inputClassName="country-select-input"
                            defaultValue={experience.country}
                            onChange={(country) => {
                              console.log("Country selected:", country);
                              updateExperience(experience.id, 'country', country);
                            }}
                            onTextChange={() => {}}
                            placeHolder="Select country..."
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>
                            <span>State/Province</span>
                          </label>
                          <StateSelect
                            countryid={experience.country?.id}
                            containerClassName="state-select-container"
                            inputClassName="state-select-input"
                            onChange={(state) => {
                              console.log("State selected:", state);
                              updateExperience(experience.id, 'state', state);
                            }}
                            onTextChange={() => {}}
                            defaultValue={experience.state}
                            placeHolder="Select state/province..."
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>
                            <span>City</span>
                          </label>
                          <CitySelect
                            countryid={experience.country?.id}
                            stateid={experience.state?.id}
                            containerClassName="city-select-container"
                            inputClassName="city-select-input"
                            onChange={(city) => {
                              console.log("City selected:", city);
                              updateExperience(experience.id, 'city', city);
                            }}
                            defaultValue={experience.city}
                            placeHolder="Select city..."
                          />
                        </div>
                      </div>

                      {/* Ligne 3: Dates et statut sur une seule ligne */}
                      <div className="form-row dates-status-unified-row">
                        <div className="form-group date-group">
                          <label htmlFor={`dateStart-${experience.id}`}>
                            <span>Start Date</span>
                          </label>
                          <div className="date-picker-wrapper">
                            <input
                              type="date"
                              id={`dateStart-${experience.id}`}
                              value={formatDateInputValue(experience.dateStart)}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value) {
                                  const date = new Date(value);
                                  const day = date.getDate();
                                  const month = date.getMonth() + 1;
                                  const year = date.getFullYear();
                                  updateExperience(experience.id, 'dateStart', `${day}/${month}/${year}`);
                                } else {
                                  updateExperience(experience.id, 'dateStart', '');
                                }
                              }}
                              className="form-input modern-date-input"
                            />
                  
                          </div>
                        </div>
                        
                        <div className="form-group date-group">
                        <label htmlFor={`dateEnd-${experience.id}`}>
                            <span>End Date</span>
                          </label>
                          <div className="date-picker-wrapper">
                            <input
                              type="date"
                              id={`dateEnd-${experience.id}`}
                              value={formatDateInputValue(experience.dateEnd)}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value) {
                                  const date = new Date(value);
                                  const day = date.getDate();
                                  const month = date.getMonth() + 1;
                                  const year = date.getFullYear();
                                  updateExperience(experience.id, 'dateEnd', `${day}/${month}/${year}`);
                                } else {
                                  updateExperience(experience.id, 'dateEnd', '');
                                }
                              }}
                              className="form-input modern-date-input"
                              disabled={experience.anticipatedEnd}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor={`status-${experience.id}`}>
                            <span>Status</span>
                          </label>
                          <select
                            id={`status-${experience.id}`}
                            value={
                              experience.completed && !experience.anticipatedEnd ? 'completed' : 
                              experience.anticipatedEnd ? 'anticipated' : 
                              'ongoing'
                            }
                            onChange={(e) => updateExperienceStatus(experience.id, e.target.value)}
                            className="form-select modern-select"
                          >
                            <option value="completed">Completed</option>
                            <option value="anticipated">Anticipated</option>
                            <option value="ongoing">Ongoing</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="form-group">
                        <label htmlFor={`description-${experience.id}`}>
                          <span>Description</span>
                        </label>
                        <textarea
                          id={`description-${experience.id}`}
                          value={experience.description}
                          onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities, what you learned, and how this experience influenced your path to medicine..."
                          className="form-textarea"
                          rows={5}
                        />
                      </div>
                      
                      {/* Section Most Meaningful (conditionnelle) avec style modernisé */}
                      {experience.isMeaningful && (
                        <div className="meaningful-section">
                          <div className="meaningful-header">
                            <h4 className="meaningful-title">Most Meaningful Experience</h4>
                           
                          </div>
                          <div className="form-group">
                            <textarea
                              id={`meaningfulRemarks-${experience.id}`}
                              value={experience.meaningfulRemarks}
                              onChange={(e) => updateExperience(experience.id, 'meaningfulRemarks', e.target.value)}
                              placeholder="Explain why this experience was particularly meaningful to you..."
                              className="form-textarea meaningful-textarea"
                              rows={4}
                            />
                          
                          </div>
                        </div>
                      )}
                      
                      {/* Actions de l'expérience */}
                      <div className="experience-actions">
                        <div className="experience-action-left">
                          <button 
                            type="button" 
                            className={`meaningful-toggle ${experience.isMeaningful ? 'active' : ''}`}
                            onClick={() => toggleMeaningful(experience.id)}
                            aria-label={experience.isMeaningful ? "Unmark as most meaningful" : "Mark as most meaningful"}
                          >
                            <Check size={16} className="meaningful-icon" />
                            <span>Most Meaningful Experience</span>
                          </button>
                        </div>
                        
                        <div className="experience-action-right">
                          <div className="order-controls">
                            <button 
                              type="button"
                              className="order-button"
                              onClick={() => moveExperience(experience.id, 'up')}
                              disabled={index === 0}
                              aria-label="Move experience up"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button 
                              type="button"
                              className="order-button"
                              onClick={() => moveExperience(experience.id, 'down')}
                              disabled={index === experiences.length - 1}
                              aria-label="Move experience down"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>
                          
                          <button 
                            type="button" 
                            className="delete-button"
                            onClick={() => removeExperience(experience.id)}
                            disabled={experiences.length <= 1}
                            aria-label="Delete experience"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Bouton ajouter une expérience */}
          {experiences.length < MAX_EXPERIENCES && (
            <button 
              type="button"
              className="add-experience-button"
              onClick={addExperience}
              aria-label="Add a new experience"
            >
              <Plus size={18} className="add-icon" />
              <span>Add another experience</span>
            </button>
          )}
          
          {/* Note d'information */}
          <div className="experiences-note">
            <div className="note-icon-container">
              <AlertCircle size={20} className="note-icon" />
            </div>
            <div className="note-content">
              <h4 className="note-title">Why are experiences important?</h4>
              <p className="note-text">
                Your experiences demonstrate your qualities, dedication and readiness for medicine. 
                We recommend adding at least 3 experiences. Highlight those that were most impactful 
                by marking them as "Most Meaningful."
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation simplifiée */}
        <div className="step-navigation">
          <button
            type="button"
            className="nav-btn nav-btn-secondary"
            onClick={onBack}
            aria-label="Return to Personal Comments"
          >
            Back to Personal Comments
          </button>

          {/* Indicateur de sauvegarde uniquement */}
          {isTyping && (
            <div className="auto-save-indicator">
              <div className="typing-indicator">
                <span>Auto-saving...</span>
                <div className="typing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            className={`nav-btn nav-btn-primary ${!isValidToSubmit() ? 'disabled' : ''}`}
            onClick={onNext}
            disabled={!isValidToSubmit()}
            aria-label="Continue to Other Impactful Experiences"
          >
            Continue to Other Experiences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Experiences;