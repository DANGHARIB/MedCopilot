import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Info, Map, Building, Beaker, Stethoscope, Clock, Award } from 'lucide-react';
// Placeholder for API service and Results component - replace with actual imports later
// import { getMedSchoolMatches } from '../services/mindStudioService'; 
// import SchoolMatchResults from './SchoolMatchResults';
import './SchoolMatchForm.css';

// --- Dropdown Options --- 
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

const otherOption = [{ value: "other", label: "Other" }];

const geographicOptions = [
  { value: "west", label: "West Coast" }, { value: "northeast", label: "Northeast" }, { value: "midwest", label: "Midwest" },
  { value: "south", label: "South" }, { value: "no_preference", label: "No Preference" }
];

const settingOptions = [
  { value: "urban", label: "Urban" }, { value: "suburban", label: "Suburban" }, { value: "rural", label: "Rural" },
  { value: "no_preference", label: "No Preference" }
];

const programTypeOptions = [
  { value: "md", label: "MD" },
  { value: "md_phd", label: "MD-PhD" }
];

// Tier icons and colors for results
const tiers = {
  "Reach": { icon: <Award size={18} />, color: "#f97316" }, // Orange
  "Target": { icon: <Clock size={18} />, color: "#2563eb" }, // Blue
  "Likely": { icon: <CheckCircle2 size={18} />, color: "#10b981" } // Green
};

const SchoolMatchForm = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState({
    citizenship: '',
    residency: '',
    gpa: '',
    scienceGpa: '',
    mcat: '',
    applicantType: '',
    undergradMajor: 'Not specified',
    clinicalHours: '0',
    researchHours: '0',
    volunteerHours: '0',
    email: '',
    geographicPreference: 'no_preference',
    programType: 'md',
    settingPreference: 'no_preference'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiMatches, setAiMatches] = useState([]);
  const [error, setError] = useState(undefined);
  const [residencyOptions, setResidencyOptions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
      // Reset residency if citizenship changes
      ...(name === 'citizenship' && { residency: '' })
    }));
  };

  useEffect(() => {
    if (formState.citizenship === 'us') {
      setResidencyOptions([...usStates, ...otherOption]);
    } else if (formState.citizenship === 'ca') {
      setResidencyOptions([...canadianProvinces, ...otherOption]);
    } else if (formState.citizenship === 'other') {
      setResidencyOptions([...usStates, ...canadianProvinces, ...otherOption]);
    } else {
      setResidencyOptions([]);
    }
  }, [formState.citizenship]);

  const validateStep = (step) => {
    if (step === 1 && (!formState.citizenship || !formState.residency || !formState.applicantType)) {
      alert("Please fill out all Basic Information fields.");
      return false;
    } 
    if (step === 2 && (!formState.gpa || !formState.scienceGpa || !formState.mcat)) {
      alert("Please fill out all Academic Profile fields.");
      return false;
    }
    if (step === 3 && (!formState.clinicalHours || !formState.researchHours || !formState.volunteerHours)) {
      alert("Please fill out all Experience fields.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        if (currentStep === 3) {
          // Trigger results fetching only when moving to step 4
          fetchSchoolMatches();
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // --- Placeholder API Call --- 
  const fetchSchoolMatches = async () => {
    setIsSubmitting(true);
    setError(undefined);
    console.log('Simulating API call with form data:', formState);
    // Replace with actual API call: 
    // const response = await getMedSchoolMatches(formState);
    
    // Simulate API response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Example success response (replace with actual API structure)
    const exampleMatches = [
      { school_name: "Harvard Medical School", acceptance_tier: "Reach", match_score: 85, location: "Boston, MA" },
      { school_name: "Johns Hopkins School of Medicine", acceptance_tier: "Reach", match_score: 82, location: "Baltimore, MD" },
      { school_name: "Mayo Clinic Alix School of Medicine", acceptance_tier: "Target", match_score: 75, location: "Rochester, MN" },
      { school_name: "University of Michigan Medical School", acceptance_tier: "Target", match_score: 70, location: "Ann Arbor, MI" },
      { school_name: "University of Washington School of Medicine", acceptance_tier: "Likely", match_score: 65, location: "Seattle, WA" }
    ];
    
    setAiMatches(exampleMatches);
    console.log('Simulated matches received:', exampleMatches);

    // Simulate completion if needed
    if (onComplete) {
      onComplete();
    }

    // Example error simulation
    // setError("Could not fetch matches. Please try again.");
    // setAiMatches([]);

    setIsSubmitting(false);
  };

  const handleSubmitFullResults = () => {
    alert("Sign up to save and view full results!");
  };

  // Get section icon based on step number
  const getSectionIcon = (step) => {
    switch(step) {
      case 1: return <Info size={20} />;
      case 2: return <Beaker size={20} />;
      case 3: return <Stethoscope size={20} />;
      case 4: return <Award size={20} />;
      default: return null;
    }
  };

  return (
    <section id="school-match" className="school-match-form">
      <div className="school-match-form__container">
        {/* Section Header */}
        <div className="school-match-form__header">
          <div className="school-match-form__pill-badge">
            Try Now
          </div>
          <h2 className="school-match-form__title">
            Find Your Ideal Medical Schools
          </h2>
          <p className="school-match-form__subtitle">
            Our intelligent system analyzes your profile and preferences to identify schools where you have the best chance of admission.
          </p>
        </div>
        
        {/* Form Card */}
        <div className="school-match-form__card">
          {/* Stepper */}
          <div className="stepper">
            <div className="stepper__track">
              <div 
                className="stepper__progress" 
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>
            <div className="stepper__steps">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="stepper__step">
                  <div className={`stepper__step-icon ${step < currentStep ? 'stepper__step-icon--complete' : step === currentStep ? 'stepper__step-icon--active' : ''}`}>
                    {step < currentStep ? <CheckCircle2 size={16} /> : getSectionIcon(step)}
                  </div>
                  <p className={`stepper__step-label ${step === currentStep ? 'stepper__step-label--active' : ''}`}>
                    {step === 1 ? 'Profile' : 
                     step === 2 ? 'Academic' : 
                     step === 3 ? 'Experience' : 
                     'Results'}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Form Steps Container */}
          <div className="form-steps-container">
            <div className="form-steps" style={{ display: 'block' }}>
              {/* --- Step 1: Basic Info --- */}
              <div className="form-step" style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                <div className="form-step__header">
                  <div className="form-step__icon-wrapper">
                    <Info size={20} className="form-step__icon" />
                  </div>
                  <h3 className="form-step__title">Basic Information</h3>
                </div>
                
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="citizenship">Citizenship</label>
                    <select 
                      id="citizenship" 
                      name="citizenship" 
                      value={formState.citizenship} 
                      onChange={handleInputChange} 
                      className="input-field"
                    >
                      <option value="">Select...</option>
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="residency">Residency</label>
                    <select 
                      id="residency" 
                      name="residency" 
                      value={formState.residency} 
                      onChange={handleInputChange} 
                      className="input-field" 
                      disabled={!formState.citizenship}
                    >
                      <option value="">Select...</option>
                      {residencyOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {!formState.citizenship && 
                      <p className="input-helper">Please select your citizenship first</p>
                    }
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="applicantType">Applicant Type</label>
                    <select 
                      id="applicantType" 
                      name="applicantType" 
                      value={formState.applicantType} 
                      onChange={handleInputChange} 
                      className="input-field"
                    >
                      <option value="">Select...</option>
                      <option value="traditional">Traditional</option>
                      <option value="nontraditional">Non-traditional</option>
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="email">Email (Optional)</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="your@email.com" 
                      value={formState.email} 
                      onChange={handleInputChange} 
                      className="input-field"
                    />
                    <p className="input-helper">Receive your results by email</p>
                  </div>
                </div>
              </div>

              {/* --- Step 2: Academic Profile --- */}
              <div className="form-step" style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                <div className="form-step__header">
                  <div className="form-step__icon-wrapper">
                    <Beaker size={20} className="form-step__icon" />
                  </div>
                  <h3 className="form-step__title">Academic Profile</h3>
                </div>
                
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="gpa">Overall GPA</label>
                    <input 
                      type="text" 
                      id="gpa" 
                      name="gpa" 
                      placeholder="e.g., 3.8" 
                      value={formState.gpa} 
                      onChange={handleInputChange} 
                      className="input-field"
                    />
                    <p className="input-helper">On a 4.0 scale</p>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="scienceGpa">Science GPA</label>
                    <input 
                      type="text" 
                      id="scienceGpa" 
                      name="scienceGpa" 
                      placeholder="e.g., 3.7" 
                      value={formState.scienceGpa} 
                      onChange={handleInputChange} 
                      className="input-field"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="mcat">MCAT Score</label>
                    <input 
                      type="text" 
                      id="mcat" 
                      name="mcat" 
                      placeholder="e.g., 515" 
                      value={formState.mcat} 
                      onChange={handleInputChange} 
                      className="input-field"
                    />
                    <p className="input-helper">Total score (472-528)</p>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="undergradMajor">Undergraduate Major</label>
                    <input 
                      type="text" 
                      id="undergradMajor" 
                      name="undergradMajor" 
                      placeholder="e.g., Biology" 
                      value={formState.undergradMajor} 
                      onChange={handleInputChange} 
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* --- Step 3: Experience & Preferences --- */}
              <div className="form-step" style={{ display: currentStep === 3 ? 'block' : 'none' }}>
                <div className="form-step__header">
                  <div className="form-step__icon-wrapper">
                    <Stethoscope size={20} className="form-step__icon" />
                  </div>
                  <h3 className="form-step__title">Experience & Preferences</h3>
                </div>
                
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="clinicalHours">Clinical Hours</label>
                    <input 
                      type="text" 
                      id="clinicalHours" 
                      name="clinicalHours" 
                      placeholder="e.g., 500" 
                      value={formState.clinicalHours} 
                      onChange={handleInputChange} 
                      className="input-field"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="researchHours">Research Hours</label>
                    <input 
                      type="text" 
                      id="researchHours" 
                      name="researchHours" 
                      placeholder="e.g., 300" 
                      value={formState.researchHours} 
                      onChange={handleInputChange} 
                      className="input-field"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="volunteerHours">Volunteer Hours</label>
                    <input 
                      type="text" 
                      id="volunteerHours" 
                      name="volunteerHours" 
                      placeholder="e.g., 200" 
                      value={formState.volunteerHours} 
                      onChange={handleInputChange} 
                      className="input-field"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="programType">Program Type</label>
                    <select 
                      id="programType" 
                      name="programType" 
                      value={formState.programType} 
                      onChange={handleInputChange} 
                      className="input-field"
                    >
                      {programTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="geographicPreference">
                      <Map size={16} className="input-icon" />
                      Geographic Preference
                    </label>
                    <select 
                      id="geographicPreference" 
                      name="geographicPreference" 
                      value={formState.geographicPreference} 
                      onChange={handleInputChange} 
                      className="input-field"
                    >
                      {geographicOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="settingPreference">
                      <Building size={16} className="input-icon" />
                      Setting Preference
                    </label>
                    <select 
                      id="settingPreference" 
                      name="settingPreference" 
                      value={formState.settingPreference} 
                      onChange={handleInputChange} 
                      className="input-field"
                    >
                      {settingOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* --- Step 4: Results --- */}
              <div className="form-step" style={{ display: currentStep === 4 ? 'block' : 'none' }}>
                <div className="form-step__header">
                  <div className="form-step__icon-wrapper">
                    <Award size={20} className="form-step__icon" />
                  </div>
                  <h3 className="form-step__title">Your Matches</h3>
                </div>

                {isSubmitting ? (
                  <div className="results-loading">
                    <div className="results-loading__spinner"></div>
                    <p>Analyzing your profile...</p>
                  </div>
                ) : error ? (
                  <div className="results-error">
                    <p className="error-message">Error: {error}</p>
                    <button className="form-button form-button--secondary" onClick={() => fetchSchoolMatches()}>
                      Retry
                    </button>
                  </div>
                ) : aiMatches.length > 0 ? (
                  <div className="results-content">
                    <div className="results-legend">
                      <div className="results-legend__item">
                        <span className="results-legend__color" style={{backgroundColor: tiers["Reach"].color}}></span>
                        <span>Reach</span>
                      </div>
                      <div className="results-legend__item">
                        <span className="results-legend__color" style={{backgroundColor: tiers["Target"].color}}></span>
                        <span>Target</span>
                      </div>
                      <div className="results-legend__item">
                        <span className="results-legend__color" style={{backgroundColor: tiers["Likely"].color}}></span>
                        <span>Likely</span>
                      </div>
                    </div>
                    
                    <ul className="results-list">
                      {aiMatches.map((match, i) => (
                        <li key={i} className="results-item">
                          <div className="results-item__tier" style={{borderColor: tiers[match.acceptance_tier].color}}>
                            {tiers[match.acceptance_tier].icon}
                          </div>
                          <div className="results-item__content">
                            <h4 className="results-item__name">{match.school_name}</h4>
                            <p className="results-item__location">{match.location}</p>
                          </div>
                          <div className="results-item__score">
                            <div className="score-circle" style={{borderColor: tiers[match.acceptance_tier].color}}>
                              <span>{match.match_score}%</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="results-notice">
                      <p>Showing the top 5 matches out of 25 analyzed schools</p>
                    </div>
                  </div>
                ) : (
                  <div className="results-empty">
                    <p>No matches found. Try adjusting your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button 
              onClick={prevStep}
              className={`form-button form-button--secondary ${currentStep === 1 ? 'form-button--hidden' : ''}`}
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button 
                onClick={nextStep} 
                className="form-button form-button--primary" 
                disabled={isSubmitting && currentStep === 3}
              >
                {isSubmitting && currentStep === 3 ? (
                  <>
                    <span className="button-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={16} className="button-icon" />
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={handleSubmitFullResults} 
                className="form-button form-button--primary"
              >
                Get Full Analysis
                <ArrowRight size={16} className="button-icon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolMatchForm;