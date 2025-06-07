import React from 'react';
import { ShieldCheck } from 'lucide-react';
import './security-warnings.css';

const SecurityWarnings = ({ securityChecks }) => {
  if (securityChecks.httpsVerified && securityChecks.browserSupported) {
    return null;
  }
  
  return (
    <div className="security-warnings">
      {!securityChecks.httpsVerified && (
        <div className="security-warning danger">
          <div className="warning-header">
            <ShieldCheck className="icon" />
            <span>Security Warning:</span>
          </div>
          <p>This page is not secured with HTTPS. For your safety, please do not proceed with the payment.</p>
        </div>
      )}

      {!securityChecks.browserSupported && (
        <div className="security-warning caution">
          <div className="warning-header">
            <ShieldCheck className="icon" />
            <span>Browser Warning:</span>
          </div>
          <p>Your browser might not support all the security features needed. Please update your browser or try a different one.</p>
        </div>
      )}
    </div>
  );
};

export default SecurityWarnings;