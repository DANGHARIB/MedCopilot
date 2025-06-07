import React, { useState, useEffect, useRef } from 'react';
import { Award, Edit2, Clock, Plus, Trash2, CheckCircle, Home, ChevronRight, Calendar, MapPin, Building2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountrySelect, StateSelect, CitySelect } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import './ProfileSections.css';

const MeaningfulExperiencesSection = () => {
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
  
  // Types d'expériences selon AMCAS (cohérent avec Experiences.jsx)
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

  const [experiences, setExperiences] = useState([
    {
      id: "exp_1",
      title: "Hospital Volunteer Program Lead",
      type: "volunteer",
      organization: "Memorial Hospital",
      city: { name: "Boston" },
      state: { name: "Massachusetts" },
      country: { name: "United States" },
      dateStart: "15/06/2022",
      dateEnd: "20/08/2023",
      completed: true,
      anticipatedEnd: false,

      description: "Coordinated a team of 20 volunteers, established new protocols for patient interaction, and personally provided comfort and assistance to patients in the oncology ward. Implemented a new training program that increased volunteer retention by 35% and improved patient satisfaction scores.",
      isMeaningful: true,
      meaningfulRemarks: "This experience taught me the profound impact of human compassion in healthcare. Working directly with cancer patients showed me that healing involves not just medical expertise, but also emotional support and genuine human connection."
    },
    {
      id: "exp_2", 
      title: "Research Assistant - Immunology Lab",
      type: "research",
      organization: "Stanford University",
      city: { name: "Stanford" },
      state: { name: "California" },
      country: { name: "United States" },
      dateStart: "10/09/2021",
      dateEnd: "30/05/2023",
      completed: true,
      anticipatedEnd: false,

      description: "Conducted research on autoimmune responses in rheumatological conditions, resulting in co-authorship on two published papers. Developed a novel assay technique that reduced processing time by 40% while maintaining accuracy. Presented findings at the American Immunology Conference.",
      isMeaningful: true,
      meaningfulRemarks: "This research experience deepened my understanding of the scientific method and its application to real-world medical problems. The breakthrough moment when our assay worked perfectly taught me the value of perseverance in scientific discovery."
    },
    {
      id: "exp_3",
      title: "Rural Health Outreach Coordinator", 
      type: "community-service",
      organization: "Global Health Initiative",
      city: { name: "Rural Communities" },
      state: { name: "Various" },
      country: { name: "United States" },
      dateStart: "12/01/2023",
      dateEnd: "15/12/2023",
      completed: true,
      anticipatedEnd: false,

      description: "Led mobile clinic initiatives in underserved rural communities, providing preventative care education and basic health screenings. Coordinated with local community leaders to establish sustainable health education programs, reaching over 1,500 residents across 5 communities.",
      isMeaningful: false,
      meaningfulRemarks: ""
    }
  ]);

  const [newExperience, setNewExperience] = useState({
    id: "",
    title: "",
    type: "",
    organization: "",
    city: null,
    state: null,
    country: null,
    dateStart: "",
    dateEnd: "",
    completed: false,
    anticipatedEnd: false,
    description: "",
    isMeaningful: false,
    meaningfulRemarks: ""
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const newFormRef = useRef(null);

  // Effet pour défiler vers le nouveau formulaire quand il est affiché
  useEffect(() => {
    if (isAddingNew && newFormRef.current) {
      // Ajouter un petit délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        newFormRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center' // Centre le formulaire dans la fenêtre visible
        });
      }, 100);
    }
  }, [isAddingNew]);

  const handleEditExperience = (index) => {
    setEditingExperienceIndex(index);
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    
    // Si nous changeons de pays, réinitialiser l'état et la ville
    if (field === 'country') {
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
        state: null,
        city: null
      };
    }
    // Si nous changeons d'état, réinitialiser la ville
    else if (field === 'state') {
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
        city: null
      };
    }
    else {
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value
      };
    }
    
    setExperiences(updatedExperiences);
  };

  const handleSaveExperience = () => {
    // En production, envoyez les données au backend
    setEditingExperienceIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingExperienceIndex(null);
    // En production, récupérez les données originales du backend
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleNewExperienceChange = (field, value) => {
    // Si nous changeons de pays, réinitialiser l'état et la ville
    if (field === 'country') {
      setNewExperience({
        ...newExperience,
        [field]: value,
        state: null,
        city: null
      });
    }
    // Si nous changeons d'état, réinitialiser la ville
    else if (field === 'state') {
      setNewExperience({
        ...newExperience,
        [field]: value,
        city: null
      });
    }
    else {
      setNewExperience({
        ...newExperience,
        [field]: value
      });
    }
  };

  const handleSaveNewExperience = () => {
    if (newExperience.title && newExperience.organization) {
      const newExpWithId = {
        ...newExperience,
        id: `exp_${Date.now()}`
      };
      setExperiences([...experiences, newExpWithId]);
      setNewExperience({
        id: "",
        title: "",
        type: "",
        organization: "",
        city: null,
        state: null,
        country: null,
        dateStart: "",
        dateEnd: "",
        completed: false,
        anticipatedEnd: false,
        description: "",
        isMeaningful: false,
        meaningfulRemarks: ""
      });
      setIsAddingNew(false);
    }
  };

  const handleCancelNewExperience = () => {
    setNewExperience({
      id: "",
      title: "",
      type: "",
      organization: "",
      city: null,
      state: null,
      country: null,
      dateStart: "",
      dateEnd: "",
      completed: false,
      anticipatedEnd: false,
      hours: "",
      description: "",
      isMeaningful: false,
      meaningfulRemarks: ""
    });
    setIsAddingNew(false);
  };

  const handleDeleteExperience = (index) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  return (
    <div className="profile-section-wrapper">
      <div className="profile-breadcrumb">
        <Link to="/profile" className="profile-breadcrumb-link">
          <Home size={16} className="profile-breadcrumb-icon" />
          Profile
        </Link>
        <span className="profile-breadcrumb-separator">
          <ChevronRight size={14} />
        </span>
        <Link to="/profile/information" className="profile-breadcrumb-link">
          Profile Information
        </Link>
        <span className="profile-breadcrumb-separator">
          <ChevronRight size={14} />
        </span>
        <span className="profile-breadcrumb-current">Meaningful Experiences</span>
      </div>

      <div className="profile-section-container">
        <div className="profile-section-header-modern">
          <div className="header-main-row">
            <div className="header-text-group">
              <div className="header-title">
                Meaningful{" "}
                <span className="header-title-highlight">Experiences</span>
              </div>
            </div>

            <button className="profile-section-edit-button" onClick={handleAddNew}>
              <Plus size={16} />
              Add Experience
            </button>
          </div>

         
        </div>

        <div className="profile-statement-body">

      {isAddingNew && (
        <div className="profile-section-experience-item profile-section-new-experience" ref={newFormRef}>
          <div className="profile-section-edit-area">
            <div className="profile-section-form-group">
              <label htmlFor="new-title">Activity/Experience Title</label>
              <input
                type="text"
                id="new-title"
                className="profile-section-input"
                value={newExperience.title}
                onChange={(e) => handleNewExperienceChange('title', e.target.value)}
                placeholder="e.g., Hospital Volunteer, Research Assistant"
              />
            </div>
            <div className="profile-section-form-row">
              <div className="profile-section-form-group">
                <label htmlFor="new-organization">Organization</label>
                <input
                  type="text"
                  id="new-organization"
                  className="profile-section-input"
                  value={newExperience.organization}
                  onChange={(e) => handleNewExperienceChange('organization', e.target.value)}
                  placeholder="e.g., Memorial Hospital"
                />
              </div>
            </div>

            {/* Location Fields */}
            <div className="profile-section-form-row">
              <div className="profile-section-form-group">
                <label>Country</label>
                <CountrySelect
                  containerClassName="country-select-container"
                  inputClassName="country-select-input"
                  defaultValue={newExperience.country}
                  onChange={(country) => handleNewExperienceChange('country', country)}
                  onTextChange={() => {}}
                  placeHolder="Select country..."
                />
              </div>
              
              <div className="profile-section-form-group">
                <label>State/Province</label>
                <StateSelect
                  countryid={newExperience.country?.id}
                  containerClassName="state-select-container"
                  inputClassName="state-select-input"
                  onChange={(state) => handleNewExperienceChange('state', state)}
                  onTextChange={() => {}}
                  defaultValue={newExperience.state}
                  placeHolder="Select state/province..."
                />
              </div>
              
              <div className="profile-section-form-group">
                <label>City</label>
                <CitySelect
                  countryid={newExperience.country?.id}
                  stateid={newExperience.state?.id}
                  containerClassName="city-select-container"
                  inputClassName="city-select-input"
                  onChange={(city) => handleNewExperienceChange('city', city)}
                  defaultValue={newExperience.city}
                  placeHolder="Select city..."
                />
              </div>
            </div>
            <div className="profile-section-form-group">
              <label htmlFor="new-description">Description</label>
              <textarea
                id="new-description"
                className="profile-section-textarea"
                value={newExperience.description}
                onChange={(e) => handleNewExperienceChange('description', e.target.value)}
                rows={5}
                placeholder="Describe your responsibilities, achievements, and what you learned from this experience..."
              />
            </div>
            <div className="profile-section-edit-actions">
              <button 
                className="profile-section-button-secondary"
                onClick={handleCancelNewExperience}
              >
                Cancel
              </button>
              <button 
                className="profile-section-button-primary"
                onClick={handleSaveNewExperience}
                disabled={!newExperience.title || !newExperience.organization}
              >
                Add Experience
              </button>
            </div>
          </div>
        </div>
      )}

          <div className="profile-section-experiences">
            {experiences.map((experience, index) => (
              <div className="profile-experience-card" key={experience.id}>
                {editingExperienceIndex === index ? (
                  <div className="profile-section-edit-area">
                    <div className="profile-section-form-row">
                      <div className="profile-section-form-group">
                        <label htmlFor={`type-${index}`}>Experience Type</label>
                        <select
                          id={`type-${index}`}
                          className="profile-section-input"
                          value={experience.type}
                          onChange={(e) => handleExperienceChange(index, 'type', e.target.value)}
                        >
                          <option value="">Select type...</option>
                          {experienceTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="profile-section-form-group">
                        <label htmlFor={`title-${index}`}>Experience Name</label>
                        <input
                          type="text"
                          id={`title-${index}`}
                          className="profile-section-input"
                          value={experience.title}
                          onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                          placeholder="e.g., Hospital Volunteer, Research Assistant"
                        />
                      </div>
                    </div>

                    <div className="profile-section-form-row">
                      <div className="profile-section-form-group">
                        <label htmlFor={`organization-${index}`}>Organization</label>
                        <input
                          type="text"
                          id={`organization-${index}`}
                          className="profile-section-input"
                          value={experience.organization}
                          onChange={(e) => handleExperienceChange(index, 'organization', e.target.value)}
                          placeholder="e.g., Memorial Hospital"
                        />
                      </div>
                    </div>

                    {/* Location Fields */}
                    <div className="profile-section-form-row">
                      <div className="profile-section-form-group">
                        <label>Country</label>
                        <CountrySelect
                          containerClassName="country-select-container"
                          inputClassName="country-select-input"
                          defaultValue={experience.country}
                          onChange={(country) => handleExperienceChange(index, 'country', country)}
                          onTextChange={() => {}}
                          placeHolder="Select country..."
                        />
                      </div>
                      
                      <div className="profile-section-form-group">
                        <label>State/Province</label>
                        <StateSelect
                          countryid={experience.country?.id}
                          containerClassName="state-select-container"
                          inputClassName="state-select-input"
                          onChange={(state) => handleExperienceChange(index, 'state', state)}
                          onTextChange={() => {}}
                          defaultValue={experience.state}
                          placeHolder="Select state/province..."
                        />
                      </div>
                      
                      <div className="profile-section-form-group">
                        <label>City</label>
                        <CitySelect
                          countryid={experience.country?.id}
                          stateid={experience.state?.id}
                          containerClassName="city-select-container"
                          inputClassName="city-select-input"
                          onChange={(city) => handleExperienceChange(index, 'city', city)}
                          defaultValue={experience.city}
                          placeHolder="Select city..."
                        />
                      </div>
                    </div>

                    <div className="profile-section-form-group">
                      <label htmlFor={`description-${index}`}>Description</label>
                      <textarea
                        id={`description-${index}`}
                        className="profile-section-textarea"
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        rows={5}
                        placeholder="Describe your responsibilities, achievements, and what you learned from this experience..."
                      />
                    </div>

                    {experience.isMeaningful && (
                      <div className="profile-section-form-group">
                        <label htmlFor={`meaningfulRemarks-${index}`}>Why was this experience meaningful?</label>
                        <textarea
                          id={`meaningfulRemarks-${index}`}
                          className="profile-section-textarea"
                          value={experience.meaningfulRemarks}
                          onChange={(e) => handleExperienceChange(index, 'meaningfulRemarks', e.target.value)}
                          rows={4}
                          placeholder="Explain why this experience was particularly meaningful to you..."
                        />
                      </div>
                    )}

                    <div className="profile-section-edit-actions">
                    
                      <div>
                        <button 
                          className="profile-section-button-secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                        <button 
                          className="profile-section-button-primary"
                          onClick={handleSaveExperience}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profile-experience-display">
                    <div className="profile-experience-header">
                      <div className="profile-experience-title-section">
                        <h3 className="profile-experience-title">{experience.title}</h3>
                        {experience.isMeaningful && (
                          <div className="meaningful-badge">
                            <Star size={14} />
                            <span>Most Meaningful</span>
                          </div>
                        )}
                      </div>
                      <div className="profile-section-actions">
                        <button 
                          className="profile-section-edit-button-small"
                          onClick={() => handleEditExperience(index)}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="profile-section-delete-button-small"
                          onClick={() => handleDeleteExperience(index)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="profile-experience-meta">
                      {experience.type && (
                        <div className="experience-meta-item">
                          <Award size={14} />
                          <span>{experienceTypes.find(t => t.value === experience.type)?.label || experience.type}</span>
                        </div>
                      )}
                      <div className="experience-meta-item">
                        <Building2 size={14} />
                        <span>{experience.organization}</span>
                      </div>
                      {(experience.city || experience.state) && (
                        <div className="experience-meta-item">
                          <MapPin size={14} />
                          <span>
                            {experience.city?.name}{experience.city?.name && experience.state?.name && ', '}
                            {experience.state?.name}
                          </span>
                        </div>
                      )}
                      {(experience.dateStart || experience.dateEnd) && (
                        <div className="experience-meta-item">
                          <Calendar size={14} />
                          <span>
                            {experience.dateStart}{experience.dateStart && experience.dateEnd && ' - '}{experience.dateEnd}
                          </span>
                        </div>
                      )}

                    </div>

                    <p className="profile-experience-description">
                      {experience.description}
                    </p>

                    {experience.isMeaningful && experience.meaningfulRemarks && (
                      <div className="meaningful-remarks">
                        <h4 className="meaningful-remarks-title">Why this experience was meaningful:</h4>
                        <p className="meaningful-remarks-text">{experience.meaningfulRemarks}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="profile-section-info">
            <div className="profile-section-info-item">
              <CheckCircle size={16} className="profile-section-info-icon" />
              <span>Focus on meaningful experiences that demonstrate your commitment to medicine.</span>
            </div>
            <div className="profile-section-info-item">
              <CheckCircle size={16} className="profile-section-info-icon" />
              <span>Include details about your role, responsibilities, and the impact of your contribution.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeaningfulExperiencesSection; 