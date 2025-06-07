import React, { useState, useEffect } from 'react';
import { 
  CardElement, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement,
  useStripe, 
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { 
  AlertCircle, 
  Check, 
  Tag, 
  Lock, 
  CreditCard, 
  MapPin, 
  Mail, 
  User,
  ChevronRight,
  ChevronLeft,
  Shield,
  Home,
  FileText,
  Globe,
  Hash,
  Calendar
} from 'lucide-react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment
} from '@mui/material';
import './payment-form.css';

const PaymentForm = ({ 
  selectedPlan, 
  billingInterval, 
  onSuccess,
  isSaveOnly = false,
  isEditMode = false,
  initialData = null,
  isModal = false,
  selectedPaymentType = 'card',
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  // Stepper state
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;
  
  // Form state
  const [cardHolder, setCardHolder] = useState(initialData?.cardHolder || '');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });
  
  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Card element styling
  const cardElementStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1e293b',
        fontFamily: 'var(--font-family, "Inter", -apple-system, sans-serif)',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#94a3b8',
        },
        padding: '16px',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };
  
  // Steps configuration
  const steps = [
    {
      id: 'card',
      title: 'Card Details',
      description: 'Enter your card information'
    },
    {
      id: 'billing',
      title: 'Billing Address',
      description: 'Where should we send the receipt?'
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Review your information'
    }
  ];
  
  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setCardHolder(initialData.cardHolder || '');
      // Note: For security reasons, we don't pre-fill card number, expiry, or CVC
      // These fields would need to be updated through Stripe
    }
  }, [isEditMode, initialData]);
  
  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 5;
        });
      }, 300);
      
      return () => clearInterval(timer);
    }
  }, [isProcessing]);
  
  // Stepper navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation functions for each step
  const validateStep = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Card details
        return cardHolder.trim() !== '' && email.trim() !== '';
      case 1: // Billing address
        return address.line1.trim() !== '' && 
               address.city.trim() !== '' && 
               address.state.trim() !== '' && 
               address.postalCode.trim() !== '';
      default:
        return true;
    }
  };

  const canProceedToNext = () => {
    return validateStep(currentStep);
  };
  
  const calculatePrice = () => {
    const basePrice = billingInterval === 'yearly' 
      ? parseFloat(selectedPlan?.yearlyPrice?.replace('$', '') || 0) 
      : parseFloat(selectedPlan?.price?.replace('$', '') || 0);
      
    return basePrice;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setPaymentError('Stripe was not properly initialized');
      return;
    }
    
    if (attemptCount >= 3) {
      setPaymentError('Too many payment attempts. Please try again later.');
      return;
    }
    
    setIsProcessing(true);
    setPaymentError(null);
    setProgress(0);
    
    try {
      // Get the appropriate card element
      const cardElement = elements.getElement(CardNumberElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardHolder,
          email: email,
          address: {
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postal_code: address.postalCode,
            country: address.country
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Simulate server response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        
        if (isSaveOnly) {
          // If save-only mode, return card information
          onSuccess({
            paymentMethodId: paymentMethod.id,
            cardHolder: cardHolder,
            cardDetails: {
              brand: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
              expiryMonth: paymentMethod.card.exp_month,
              expiryYear: paymentMethod.card.exp_year
            }
          });
        } else {
          // Normal payment mode
          onSuccess({
            paymentMethodId: paymentMethod.id,
            amount: calculatePrice(),
            planId: selectedPlan?.id,
            interval: billingInterval
          });
        }
      }, 500);
      
    } catch (error) {
      setIsProcessing(false);
      setProgress(0);
      setPaymentError(error.message || 'Payment failed. Please try again.');
      setAttemptCount(prev => prev + 1);
    }
  };

  // Custom styles for Select dropdown
  const selectMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    getContentAnchorEl: null,
    MenuListProps: {
      style: {
        padding: 0,
      },
    },
  };

  // Render stepper indicator
  const renderStepper = () => (
    <div className="pay-stepper">
      {steps.map((step, index) => (
        <div key={step.id} className={`pay-stepper-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}>
          <div className="pay-stepper-number">
            {index < currentStep ? <Check size={16} /> : index + 1}
          </div>
          <div className="pay-stepper-content">
            <div className="pay-stepper-title">{step.title}</div>
            <div className="pay-stepper-description">{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render step 1: Card Details
  const renderCardStep = () => (
    <div className="pay-step-content">
      {isEditMode && (
        <div className="pay-edit-notice">
          <Shield size={16} className="pay-edit-notice-icon" />
          <p className="pay-edit-notice-text">
            For security reasons, you must re-enter your card information.
            Only the cardholder name can be pre-filled.
          </p>
        </div>
      )}
      
      <div className="pay-card-field">
        <div className="pay-card-field-header">
          <CreditCard size={16} className="pay-field-icon" />
          <span className="pay-card-label">Card Details</span>
          <span className="pay-required-indicator">*</span>
        </div>
        <CardElement 
          id="card-element"
          options={cardElementStyle}
          className="pay-card-element"
        />
        <p className="pay-card-helper">
          {isEditMode 
            ? "Please re-enter your complete card information."
            : "Enter your complete card information including number, expiration date and CVC."
          }
        </p>
      </div>
      
      <div className="pay-field">
        <TextField
          id="cardholder"
          label="Cardholder Name"
          variant="outlined"
          fullWidth
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          placeholder="Full name on card"
          required
          margin="normal"
          className="pay-mui-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <User size={18} className="pay-field-icon" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      
      <div className="pay-field">
        <TextField
          id="email"
          label="Email Address"
          variant="outlined"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          margin="normal"
          className="pay-mui-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail size={18} className="pay-field-icon" />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );

  // Render step 2: Billing Address
  const renderBillingStep = () => (
    <div className="pay-step-content">
      <div className="pay-field">
        <TextField
          id="address1"
          label="Address"
          variant="outlined"
          fullWidth
          value={address.line1}
          onChange={(e) => setAddress({...address, line1: e.target.value})}
          placeholder="Street address"
          required
          margin="normal"
          className="pay-mui-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home size={18} className="pay-field-icon" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      
      <div className="pay-field">
        <TextField
          id="address2"
          label="Address Line 2"
          variant="outlined"
          fullWidth
          value={address.line2}
          onChange={(e) => setAddress({...address, line2: e.target.value})}
          placeholder="Apartment, suite, unit, etc. (optional)"
          margin="normal"
          className="pay-mui-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FileText size={18} className="pay-field-icon" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      
      <div className="pay-field-row">
        <div className="pay-field">
          <TextField
            id="city"
            label="City"
            variant="outlined"
            fullWidth
            value={address.city}
            onChange={(e) => setAddress({...address, city: e.target.value})}
            placeholder="City"
            required
            margin="normal"
            className="pay-mui-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MapPin size={18} className="pay-field-icon" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        
        <div className="pay-field">
          <TextField
            id="state"
            label="State / Province"
            variant="outlined"
            fullWidth
            value={address.state}
            onChange={(e) => setAddress({...address, state: e.target.value})}
            placeholder="State or province"
            required
            margin="normal"
            className="pay-mui-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MapPin size={18} className="pay-field-icon" />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      
      <div className="pay-field-row">
        <div className="pay-field">
          <TextField
            id="postal-code"
            label="Postal Code"
            variant="outlined"
            fullWidth
            value={address.postalCode}
            onChange={(e) => setAddress({...address, postalCode: e.target.value})}
            placeholder="Postal code"
            required
            margin="normal"
            className="pay-mui-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Hash size={18} className="pay-field-icon" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        
        <div className="pay-field">
          <FormControl fullWidth margin="normal" className="pay-mui-select">
            <InputLabel>Country</InputLabel>
            <Select
              id="country"
              value={address.country}
              label="Country"
              onChange={(e) => setAddress({...address, country: e.target.value})}
              required
              MenuProps={selectMenuProps}
              className="pay-select-dropdown"
              startAdornment={
                <InputAdornment position="start">
                  <Globe size={18} className="pay-field-icon" />
                </InputAdornment>
              }
            >
              <MenuItem value="US">United States</MenuItem>
              <MenuItem value="CA">Canada</MenuItem>
              <MenuItem value="FR">France</MenuItem>
              <MenuItem value="GB">United Kingdom</MenuItem>
              <MenuItem value="DE">Germany</MenuItem>
              <MenuItem value="ES">Spain</MenuItem>
              <MenuItem value="IT">Italy</MenuItem>
              <MenuItem value="BE">Belgium</MenuItem>
              <MenuItem value="CH">Switzerland</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );

  // Render step 3: Confirmation
  const renderConfirmationStep = () => (
    <div className="pay-step-content">
      <div className="pay-confirmation-section">
        <h4 className="pay-confirmation-title">Card Information</h4>
        <div className="pay-confirmation-item">
          <span className="pay-confirmation-label">Cardholder Name:</span>
          <span className="pay-confirmation-value">{cardHolder}</span>
        </div>
        <div className="pay-confirmation-item">
          <span className="pay-confirmation-label">Email:</span>
          <span className="pay-confirmation-value">{email}</span>
        </div>
      </div>
      
      <div className="pay-confirmation-section">
        <h4 className="pay-confirmation-title">Billing Address</h4>
        <div className="pay-confirmation-item">
          <span className="pay-confirmation-label">Address:</span>
          <span className="pay-confirmation-value">
            {address.line1}{address.line2 ? `, ${address.line2}` : ''}
          </span>
        </div>
        <div className="pay-confirmation-item">
          <span className="pay-confirmation-label">City:</span>
          <span className="pay-confirmation-value">{address.city}, {address.state} {address.postalCode}</span>
        </div>
        <div className="pay-confirmation-item">
          <span className="pay-confirmation-label">Country:</span>
          <span className="pay-confirmation-value">{address.country}</span>
        </div>
      </div>
      
      {!isSaveOnly && (
        <div className="pay-summary">
          <div className="pay-summary-item">
            <span>Subtotal</span>
            <span>${calculatePrice().toFixed(2)}</span>
          </div>
          <div className="pay-summary-item pay-total">
            <span>Total</span>
            <span>${calculatePrice().toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderCardStep();
      case 1:
        return renderBillingStep();
      case 2:
        return renderConfirmationStep();
      default:
        return renderCardStep();
    }
  };

  // Render navigation buttons
  const renderNavigationButtons = () => (
    <div className="pay-stepper-navigation">
      {currentStep > 0 && (
        <button 
          type="button"
          className="pay-btn-secondary"
          onClick={prevStep}
          disabled={isProcessing}
        >
          <ChevronLeft size={18} />
          Back
        </button>
      )}
      
      {currentStep < totalSteps - 1 ? (
        <button 
          type="button"
          className="pay-btn-primary"
          onClick={nextStep}
          disabled={!canProceedToNext() || isProcessing}
        >
          Next
          <ChevronRight size={18} />
        </button>
      ) : (
        <button 
          type="submit" 
          className="pay-submit-btn"
          disabled={!stripe || !elements || isProcessing || attemptCount >= 3}
        >
          {isProcessing ? (
            <span className="pay-processing-content">
              <span className="pay-spinner"></span>
              <span>{isSaveOnly ? (isEditMode ? 'Updating...' : 'Processing...') : 'Processing...'}</span>
            </span>
          ) : (
            <span className="pay-submit-content">
              <Lock size={18} />
              <span>
                {isSaveOnly ? (isEditMode ? 'Update Payment Method' : 'Save Payment Method') : 'Complete Payment'}
              </span>
              <ChevronRight size={18} />
            </span>
          )}
        </button>
      )}
    </div>
  );

  // If it's a specific payment type other than card, render the appropriate component
  if (selectedPaymentType === 'paypal') {
    return <PayPalForm onSuccess={onSuccess} />;
  }
  
  if (selectedPaymentType === 'apple-pay') {
    return <ApplePayForm onSuccess={onSuccess} />;
  }
  
  if (selectedPaymentType === 'google-pay') {
    return <GooglePayForm onSuccess={onSuccess} />;
  }
  
  // For card payments (default), continue with existing stepper logic
  return (
    <div className={isModal ? "pay-form-modal-content" : "pay-form-wrapper"}>
      {!isModal && (
        <div className="pay-form-header">
          <h2 className="pay-form-title">
            {isSaveOnly ? 'Add a Credit Card' : 'Payment Details'}
          </h2>
          {selectedPlan && !isSaveOnly && (
            <div className="pay-selected-plan">
              <span className="pay-plan-badge">{selectedPlan.name}</span>
              <span className="pay-plan-price">
                {billingInterval === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.price}
                <span className="pay-billing-interval">/{billingInterval === 'yearly' ? 'year' : 'month'}</span>
              </span>
            </div>
          )}
        </div>
      )}
      
      {isProcessing && (
        <div className="pay-progress">
          <div className="pay-progress-bar">
            <div 
              className="pay-progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="pay-progress-text">
            {progress < 100 ? 
              (isSaveOnly ? 'Saving payment method...' : 'Processing payment...') : 
              (isSaveOnly ? 'Payment method saved!' : 'Payment completed!')}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={isModal ? "pay-form-modal" : "pay-form"}>
        <div className="pay-section">
          {renderStepper()}
          
          <div className="pay-panel">
            {renderStepContent()}
          </div>
        </div>
        
        {paymentError && (
          <div className="pay-error">
            <AlertCircle className="pay-icon" size={18} />
            <span>{paymentError}</span>
          </div>
        )}
        
        {attemptCount >= 3 && (
          <div className="pay-warning">
            <AlertCircle className="pay-icon" size={18} />
            <span>
              Too many attempts. Please wait 10 minutes before trying again.
            </span>
          </div>
        )}
        
        {renderNavigationButtons()}
      </form>
    </div>
  );
};

// PayPal Form Component
const PayPalForm = ({ onSuccess }) => {
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paymentMethodName, setPaymentMethodName] = useState('PayPal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentMethodName.trim()) {
      setErrors({ name: 'Please enter a name for this payment method' });
      return;
    }
    
    if (!paypalEmail.trim() || !isValidEmail(paypalEmail)) {
      setErrors({ email: 'Please enter a valid PayPal email address' });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate PayPal authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSuccess({
        type: 'paypal',
        name: paymentMethodName,
        email: paypalEmail,
        paymentMethodId: 'paypal_' + Date.now()
      });
    } catch {
      setErrors({ submit: 'Failed to connect PayPal account' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pay-form-modal">
      <div className="pay-section">
        <div className="pay-panel">
          <div className="pay-step-content">
            <div className="wallet-info-container">
              <div className="wallet-icon-container">
                <img src="/images/paypal-icon.svg" alt="PayPal" style={{ width: '32px', height: '32px' }} />
              </div>
              <h3 className="wallet-title">PayPal</h3>
              <p className="wallet-description">
                Connect your existing PayPal account for secure payments
              </p>
            </div>
            
            <div className="pay-field-row">
              <div className="pay-field">
                <TextField
                  label="Payment Method Name"
                  variant="outlined"
                  fullWidth
                  value={paymentMethodName}
                  onChange={(e) => setPaymentMethodName(e.target.value)}
                  placeholder="e.g. My PayPal Account"
                  required
                  margin="normal"
                  className="pay-mui-input"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} className="pay-field-icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              
              <div className="pay-field">
                <TextField
                  label="PayPal Email Address"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  margin="normal"
                  className="pay-mui-input"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} className="pay-field-icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            
            <div className="wallet-features">
              <div className="wallet-feature">
                <Shield size={16} className="wallet-feature-icon" />
                <span>Secure authentication with PayPal</span>
              </div>
              <div className="wallet-feature">
                <CreditCard size={16} className="wallet-feature-icon" />
                <span>Uses your PayPal balance or linked cards</span>
              </div>
              <div className="wallet-feature">
                <Lock size={16} className="wallet-feature-icon" />
                <span>Your financial info stays protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {errors.submit && (
        <div className="pay-error">
          <AlertCircle className="pay-icon" size={18} />
          <span>{errors.submit}</span>
        </div>
      )}
      
      <div className="pay-stepper-navigation">
        <button 
          type="submit" 
          className="pay-submit-btn"
          disabled={isProcessing || !paymentMethodName.trim() || !isValidEmail(paypalEmail)}
        >
          {isProcessing ? (
            <span className="pay-processing-content">
              <span className="pay-spinner"></span>
              <span>Connecting PayPal...</span>
            </span>
          ) : (
            <span className="pay-submit-content">
              <Lock size={18} />
              <span>Connect PayPal Account</span>
              <ChevronRight size={18} />
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

// Apple Pay Form Component
const ApplePayForm = ({ onSuccess }) => {
  const [paymentMethodName, setPaymentMethodName] = useState('Apple Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentMethodName.trim()) {
      setErrors({ name: 'Please enter a name for this payment method' });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate Apple Pay authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSuccess({
        type: 'apple-pay',
        name: paymentMethodName,
        paymentMethodId: 'applepay_' + Date.now()
      });
    } catch {
      setErrors({ submit: 'Failed to set up Apple Pay' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pay-form-modal">
      <div className="pay-section">
        <div className="pay-panel">
          <div className="pay-step-content">
            <div className="wallet-info-container">
              <div className="wallet-icon-container">
                <img src="/images/apple-pay-icon.svg" alt="Apple Pay" style={{ width: '32px', height: '32px' }} />
              </div>
              <h3 className="wallet-title">Apple Pay</h3>
              <p className="wallet-description">
                Use Touch ID, Face ID, or your passcode to pay with cards saved in your Apple Wallet.
              </p>
            </div>
            
            <div className="pay-field">
              <TextField
                label="Payment Method Name"
                variant="outlined"
                fullWidth
                value={paymentMethodName}
                onChange={(e) => setPaymentMethodName(e.target.value)}
                placeholder="e.g. Apple Pay"
                required
                margin="normal"
                className="pay-mui-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={18} className="pay-field-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            
            <div className="wallet-features">
              <div className="wallet-feature">
                <Shield size={16} className="wallet-feature-icon" />
                <span>Secure authentication with biometrics</span>
              </div>
              <div className="wallet-feature">
                <CreditCard size={16} className="wallet-feature-icon" />
                <span>Uses cards from your Apple Wallet</span>
              </div>
              <div className="wallet-feature">
                <Lock size={16} className="wallet-feature-icon" />
                <span>Your card details stay private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {errors.submit && (
        <div className="pay-error">
          <AlertCircle className="pay-icon" size={18} />
          <span>{errors.submit}</span>
        </div>
      )}
      
      <div className="pay-stepper-navigation">
        <button 
          type="submit" 
          className="pay-submit-btn"
          disabled={isProcessing || !paymentMethodName.trim()}
        >
          {isProcessing ? (
            <span className="pay-processing-content">
              <span className="pay-spinner"></span>
              <span>Setting up Apple Pay...</span>
            </span>
          ) : (
            <span className="pay-submit-content">
              <Lock size={18} />
              <span>Set up Apple Pay</span>
              <ChevronRight size={18} />
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

// Google Pay Form Component
const GooglePayForm = ({ onSuccess }) => {
  const [paymentMethodName, setPaymentMethodName] = useState('Google Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentMethodName.trim()) {
      setErrors({ name: 'Please enter a name for this payment method' });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate Google Pay authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSuccess({
        type: 'google-pay',
        name: paymentMethodName,
        paymentMethodId: 'googlepay_' + Date.now()
      });
    } catch {
      setErrors({ submit: 'Failed to set up Google Pay' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pay-form-modal">
      <div className="pay-section">
        <div className="pay-panel">
          <div className="pay-step-content">
            <div className="wallet-info-container">
              <div className="wallet-icon-container">
                <img src="/images/google-pay-icon.svg" alt="Google Pay" style={{ width: '32px', height: '32px' }} />
              </div>
              <h3 className="wallet-title">Google Pay</h3>
              <p className="wallet-description">
                Pay quickly and securely with cards saved in your Google account.
              </p>
            </div>
            
            <div className="pay-field">
              <TextField
                label="Payment Method Name"
                variant="outlined"
                fullWidth
                value={paymentMethodName}
                onChange={(e) => setPaymentMethodName(e.target.value)}
                placeholder="e.g. Google Pay"
                required
                margin="normal"
                className="pay-mui-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={18} className="pay-field-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            
            <div className="wallet-features">
              <div className="wallet-feature">
                <Shield size={16} className="wallet-feature-icon" />
                <span>Secure authentication with Google</span>
              </div>
              <div className="wallet-feature">
                <CreditCard size={16} className="wallet-feature-icon" />
                <span>Uses cards from your Google account</span>
              </div>
              <div className="wallet-feature">
                <Lock size={16} className="wallet-feature-icon" />
                <span>Your payment info stays protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {errors.submit && (
        <div className="pay-error">
          <AlertCircle className="pay-icon" size={18} />
          <span>{errors.submit}</span>
        </div>
      )}
      
      <div className="pay-stepper-navigation">
        <button 
          type="submit" 
          className="pay-submit-btn"
          disabled={isProcessing || !paymentMethodName.trim()}
        >
          {isProcessing ? (
            <span className="pay-processing-content">
              <span className="pay-spinner"></span>
              <span>Setting up Google Pay...</span>
            </span>
          ) : (
            <span className="pay-submit-content">
              <Lock size={18} />
              <span>Set up Google Pay</span>
              <ChevronRight size={18} />
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;