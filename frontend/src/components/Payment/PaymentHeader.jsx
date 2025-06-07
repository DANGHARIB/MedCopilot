import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './payment-header.css';

const PaymentHeader = ({ selectedPlan, handleGoBack }) => {
  return (
    <header className="payment-header">
      <button 
        className="back-button" 
        onClick={handleGoBack}
      >
        <ArrowLeft className="icon" />
        Back to Plans
      </button>

      <div className="payment-header-content">
        <h1>Complete Your Purchase</h1>
        <p>
          You're about to subscribe to the {selectedPlan?.name} plan.
        </p>
      </div>
    </header>
  );
};

export default PaymentHeader;