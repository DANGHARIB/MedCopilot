import React, { useState, useEffect, useRef } from 'react';
import './OTPVerificationModal.css';

const OTPVerificationModal = ({ isOpen, onClose, phoneNumber, onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds countdown
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const modalRef = useRef(null); // Référence pour le contenu du modal
  
  // Set focus on first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus();
      }, 100);
    }
  }, [isOpen]);

  // Timer countdown effect
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isResending]);

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    // Si le clic est sur l'overlay (et pas sur le contenu du modal)
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleChange = (index, value) => {
    // Allow only digits
    if (value !== '' && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    
    // Handle pasting full code
    if (value.length > 1) {
      // Assuming a 6-digit code is pasted
      const pastedCode = value.slice(0, 6).split('');
      for (let i = 0; i < pastedCode.length; i++) {
        if (i + index < 6) {
          newOtp[i + index] = pastedCode[i];
        }
      }
      setOtp(newOtp);
      
      // Focus the appropriate input after paste
      if (index + pastedCode.length < 6 && inputRefs.current[index + pastedCode.length]) {
        inputRefs.current[index + pastedCode.length].focus();
      }
      return;
    }

    // Handle normal single digit input
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input after entry
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onVerify(otpValue);
    }
  };

  // Resend code
  const handleResendCode = () => {
    setOtp(['', '', '', '', '', '']);
    setIsResending(true);
    setTimeLeft(45);
    
    // Focus the first input after resend
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus();
      }, 100);
    }
    
    // Add actual resend code logic here
    setTimeout(() => {
      setIsResending(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="otp-modal-overlay" onClick={handleOverlayClick}>
      <div className="otp-modal" ref={modalRef}>
        <div className="otp-modal-content">
          <button 
            type="button" 
            className="back-button" 
            onClick={onClose}
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            Back
          </button>

          <h2>Verify your phone number</h2>
          <p className="phone-message">We've sent a 6-digit code to {phoneNumber}</p>

          <form onSubmit={handleSubmit}>
            <div className="otp-input-group">
              <label>Enter verification code</label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6} // Allow paste of full code
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasteData = e.clipboardData.getData('text');
                      if (pasteData.match(/^\d+$/)) {
                        handleChange(index, pasteData);
                      }
                    }}
                    className="otp-input"
                  />
                ))}
              </div>

              <div className="otp-timer-row">
                <p className="timer-text">
                  Code expires in {formatTime(timeLeft)}
                </p>
                <button 
                  type="button" 
                  className={`resend-button ${timeLeft > 0 ? 'disabled' : ''}`}
                  disabled={timeLeft > 0 || isResending}
                  onClick={handleResendCode}
                >
                  Resend code
                </button>
              </div>

              <button 
                type="submit"
                className="verify-button"
                disabled={otp.some(digit => digit === '')}
              >
                Verify & Continue
              </button>
            </div>
          </form>

          <div className="help-section">
            <p>
              Didn't get the code? Check your phone for SMS or{' '}
              <button 
                type="button" 
                className="try-different"
                onClick={onClose}
              >
                try a different number
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;