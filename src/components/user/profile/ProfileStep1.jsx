import React, { useState, useEffect } from 'react';
import { Calendar, User, Flag, MapPin, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import './ProfileStep1.css';

// Data for select options
const usStates = [
  { value: "al", label: "Alabama" }, { value: "ak", label: "Alaska" }, { value: "az", label: "Arizona" },
  { value: "ar", label: "Arkansas" }, { value: "ca", label: "California" }, { value: "co", label: "Colorado" },
  { value: "ct", label: "Connecticut" }, { value: "de", label: "Delaware" }, { value: "fl", label: "Florida" },
  { value: "ga", label: "Georgia" }, { value: "hi", label: "Hawaii" }, { value: "id", label: "Idaho" },
  { value: "il", label: "Illinois" }, { value: "in", label: "Indiana" }, { value: "ia", label: "Iowa" },
  { value: "ks", label: "Kansas" }, { value: "ky", label: "Kentucky" }, { value: "la", label: "Louisiana" },
  { value: "me", label: "Maine" }, { value: "md", label: "Maryland" }, { value: "ma", label: "Massachusetts" },
  { value: "mi", label: "Michigan" }, { value: "mn", label: "Minnesota" }, { value: "ms", label: "Mississippi" },
  { value: "mo", label: "Missouri" }, { value: "mt", label: "Montana" }, { value: "ne", label: "Nebraska" },
  { value: "nv", label: "Nevada" }, { value: "nh", label: "New Hampshire" }, { value: "nj", label: "New Jersey" },
  { value: "nm", label: "New Mexico" }, { value: "ny", label: "New York" }, { value: "nc", label: "North Carolina" },
  { value: "nd", label: "North Dakota" }, { value: "oh", label: "Ohio" }, { value: "ok", label: "Oklahoma" },
  { value: "or", label: "Oregon" }, { value: "pa", label: "Pennsylvania" }, { value: "ri", label: "Rhode Island" },
  { value: "sc", label: "South Carolina" }, { value: "sd", label: "South Dakota" }, { value: "tn", label: "Tennessee" },
  { value: "tx", label: "Texas" }, { value: "ut", label: "Utah" }, { value: "vt", label: "Vermont" },
  { value: "va", label: "Virginia" }, { value: "wa", label: "Washington" }, { value: "wv", label: "West Virginia" },
  { value: "wi", label: "Wisconsin" }, { value: "wy", label: "Wyoming" }, { value: "dc", label: "District of Columbia" },
];

const canadianProvinces = [
  { value: "ab", label: "Alberta" }, { value: "bc", label: "British Columbia" }, { value: "mb", label: "Manitoba" },
  { value: "nb", label: "New Brunswick" }, { value: "nl", label: "Newfoundland and Labrador" }, { value: "nt", label: "Northwest Territories" },
  { value: "ns", label: "Nova Scotia" }, { value: "nu", label: "Nunavut" }, { value: "on", label: "Ontario" },
  { value: "pe", label: "Prince Edward Island" }, { value: "qc", label: "Quebec" }, { value: "sk", label: "Saskatchewan" },
  { value: "yt", label: "Yukon" },
];

const ProfileStep1 = ({ formData, updateFormData, onNext, onBack }) => {
  const [localFormData, setLocalFormData] = useState({
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    dateOfBirth: formData?.dateOfBirth || '',
    gender: formData?.gender || '',
    citizenship: formData?.citizenship || '',
    residency: formData?.residency || ''
  });
  const [residencyOptions, setResidencyOptions] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [fieldTouched, setFieldTouched] = useState({
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    gender: false,
    citizenship: false,
    residency: false
  });

  // Mettre à jour les options de résidence en fonction de la citoyenneté
  useEffect(() => {
    if (localFormData.citizenship === 'us') {
      setResidencyOptions(usStates);
    } else if (localFormData.citizenship === 'ca') {
      setResidencyOptions(canadianProvinces);
    } else {
      setResidencyOptions([]);
    }
    
    // Réinitialiser la résidence lorsque la citoyenneté change
    setLocalFormData(prev => ({ ...prev, residency: '' }));
  }, [localFormData.citizenship]);
  
  // Vérifier si le formulaire est valide
  useEffect(() => {
    const { firstName, lastName, dateOfBirth, gender, citizenship } = localFormData;
    const residencyRequired = citizenship === 'us' || citizenship === 'ca';
    
    setIsValid(
      firstName !== '' &&
      lastName !== '' &&
      dateOfBirth !== '' && 
      gender !== '' && 
      citizenship !== '' && 
      (!residencyRequired || localFormData.residency !== '')
    );
  }, [localFormData]);
  
  // Gérer les changements d'entrée
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
    setFieldTouched(prev => ({ ...prev, [name]: true }));
  };
  
  // Marquer un champ comme touché lors de la perte de focus
  const handleBlur = (e) => {
    const { name } = e.target;
    setFieldTouched(prev => ({ ...prev, [name]: true }));
  };
  
  // Passer à l'étape suivante
  const handleNext = () => {
    updateFormData(localFormData);
    onNext();
  };

  return (
    <div className="profile-step1-container">
      <h2 className="profile-step1-title">Personal Information</h2>
      <p className="profile-step1-description">
        Please provide your basic personal details. This information helps us tailor your experience.
      </p>
      
      <div className="profile-step1-form-grid">
        {/* First Name Field */}
        <div className="profile-step1-form-field">
          <label htmlFor="firstName" className="profile-step1-field-label">
            <User size={26} className="profile-step1-field-icon" />
            <span>First Name</span>
          </label>
          <div className="profile-step1-input-wrapper">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={localFormData.firstName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="profile-step1-field-input"
              required
              aria-required="true"
              placeholder="Enter your first name"
            />
          </div>
          {fieldTouched.firstName && !localFormData.firstName && (
            <p className="profile-step1-error-text">
              Please enter your first name
            </p>
          )}
        </div>
        
        {/* Last Name Field */}
        <div className="profile-step1-form-field">
          <label htmlFor="lastName" className="profile-step1-field-label">
            <User size={26} className="profile-step1-field-icon" />
            <span>Last Name</span>
          </label>
          <div className="profile-step1-input-wrapper">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={localFormData.lastName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="profile-step1-field-input"
              required
              aria-required="true"
              placeholder="Enter your last name"
            />
          </div>
          {fieldTouched.lastName && !localFormData.lastName && (
            <p className="profile-step1-error-text">
              Please enter your last name
            </p>
          )}
        </div>
        
        {/* Date of Birth Field */}
        <div className="profile-step1-form-field">
          <label htmlFor="dateOfBirth" className="profile-step1-field-label">
            <Calendar size={26} className="profile-step1-field-icon" />
            <span>Date of Birth</span>
          </label>
          <div className="profile-step1-input-wrapper">
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={localFormData.dateOfBirth}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="profile-step1-field-input"
              required
              aria-required="true"
            />
          </div>
          {fieldTouched.dateOfBirth && !localFormData.dateOfBirth && (
            <p className="profile-step1-error-text">
              Please enter your date of birth
            </p>
          )}
        </div>
        
        {/* Gender Field */}
        <div className="profile-step1-form-field">
          <label htmlFor="gender" className="profile-step1-field-label">
            <User size={26} className="profile-step1-field-icon" />
            <span>Gender</span>
          </label>
          <div className="profile-step1-select-wrapper">
            <select
              id="gender"
              name="gender"
              value={localFormData.gender}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="profile-step1-field-select"
              required
              aria-required="true"
            >
              <option value="">Select gender...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          {fieldTouched.gender && !localFormData.gender && (
            <p className="profile-step1-error-text">
              Please select your gender
            </p>
          )}
        </div>
        
        {/* Citizenship Field */}
        <div className="profile-step1-form-field">
          <label htmlFor="citizenship" className="profile-step1-field-label">
            <Flag size={26} className="profile-step1-field-icon" />
            <span>Citizenship</span>
          </label>
          <div className="profile-step1-select-wrapper">
            <select
              id="citizenship"
              name="citizenship"
              value={localFormData.citizenship}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="profile-step1-field-select"
              required
              aria-required="true"
            >
              <option value="">Select citizenship...</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="other">Other</option>
            </select>
          </div>
          {fieldTouched.citizenship && !localFormData.citizenship && (
            <p className="profile-step1-error-text">
              Please select your citizenship
            </p>
          )}
        </div>
        
        {/* Residency Field */}
        <div className="profile-step1-form-field">
          <label htmlFor="residency" className="profile-step1-field-label">
            <MapPin size={26} className="profile-step1-field-icon" />
            <span>Residency</span>
          </label>
          <div className="profile-step1-select-wrapper">
            <select
              id="residency"
              name="residency"
              value={localFormData.residency}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="profile-step1-field-select"
              disabled={!localFormData.citizenship || localFormData.citizenship === 'other'}
              required={localFormData.citizenship === 'us' || localFormData.citizenship === 'ca'}
              aria-required={localFormData.citizenship === 'us' || localFormData.citizenship === 'ca'}
            >
              <option value="">Select residency...</option>
              {residencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {localFormData.citizenship === 'other' && (
            <p className="profile-step1-field-hint">Not required for international applicants.</p>
          )}
          {fieldTouched.residency && (localFormData.citizenship === 'us' || localFormData.citizenship === 'ca') && !localFormData.residency && (
            <p className="profile-step1-error-text">
              Please select your state/province of residency
            </p>
          )}
        </div>
      </div>
      
      <div className="profile-step1-actions">
        <button
          type="button"
          className="profile-button-secondary"
          onClick={onBack}
          aria-label="Go back to import method selection"
        >
          <ArrowLeft size={18} className="profile-button-icon-left" />
          Back
        </button>
        
        <button
          type="button"
          className={`profile-button-primary ${!isValid ? 'button-disabled' : ''}`}
          onClick={handleNext}
          disabled={!isValid}
          aria-label="Proceed to next step"
        >
          Next
          <ArrowRight size={26} className="profile-button-icon-right" />
        </button>
      </div>
    </div>
  );
};

export default ProfileStep1;