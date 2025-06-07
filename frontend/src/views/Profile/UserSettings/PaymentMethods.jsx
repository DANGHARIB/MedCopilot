import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import UserLayout from "../../../components/user/layout/UserLayout";
import PaymentForm from "../../../components/Payment/PaymentForm";
import PaymentDetails from "../../../components/Payment/PaymentDetails";
import { SubscriptionBreadcrumbs } from "../../../components/UI/Breadcrumbs";
import { CreditCard, Plus, X, Smartphone, Wallet } from "lucide-react";
import mockBackendService from "../../../services/mockBackendService";
import "./PaymentMethods.css";

// Initialize Stripe with the same test key as PaymentInterface
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [showTypeSelector, setShowTypeSelector] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentTypes = [
    {
      id: 'card',
      name: 'Credit Card',
      description: 'Visa, Mastercard, Amex',
      icon: <img src="/images/credit-card-icon.svg" alt="Credit Card" style={{ width: '32px', height: '32px' }} />,
      available: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: <img src="/images/paypal-icon.svg" alt="PayPal" style={{ width: '32px', height: '32px' }} />,
      available: true
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      description: 'Quick and secure payments',
      icon: <img src="/images/apple-pay-icon.svg" alt="Apple Pay" style={{ width: '32px', height: '32px' }} />,
      available: true
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      description: 'Pay with Google',
      icon: <img src="/images/google-pay-icon.svg" alt="Google Pay" style={{ width: '32px', height: '32px' }} />,
      available: true
    }
  ];

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await mockBackendService.getPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.data);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    setSelectedMethodId(null);
    setSelectedPaymentType(null);
    setShowTypeSelector(true);
    setShowPaymentModal(true);
  };

  const handlePaymentTypeSelect = (type) => {
    setSelectedPaymentType(type);
    setShowTypeSelector(false);
  };

  const handleBackToTypeSelector = () => {
    setSelectedPaymentType(null);
    setShowTypeSelector(true);
  };

  const handleEditPaymentMethod = (methodId) => {
    setSelectedMethodId(methodId);
    setSelectedPaymentType('card'); // Assume edit is always for card
    setShowTypeSelector(false);
    setShowPaymentModal(true);
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await mockBackendService.deletePaymentMethod(methodId);
      if (response.success) {
        await loadPaymentMethods();
      }
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId) => {
    setIsProcessing(true);
    try {
      const response = await mockBackendService.updatePaymentMethod(methodId, { isDefault: true });
      if (response.success) {
        await loadPaymentMethods();
      }
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentFormSubmit = async (formData) => {
    setIsProcessing(true);
    try {
      let response;
      
      // Adapter les données selon le format retourné par PaymentForm
      let paymentData;
      if (formData.cardDetails) {
        // Format retourné par PaymentForm avec isSaveOnly=true
        paymentData = {
          type: selectedPaymentType,
          last4: formData.cardDetails.last4,
          brand: formData.cardDetails.brand,
          expiryMonth: formData.cardDetails.expiryMonth,
          expiryYear: formData.cardDetails.expiryYear,
          cardHolder: formData.cardHolder || '', // Peut être fourni séparément
          paymentMethodId: formData.paymentMethodId
        };
      } else {
        // Format direct (si d'autres types de paiement)
        paymentData = {
          ...formData,
          type: selectedPaymentType
        };
      }
      
      if (selectedMethodId) {
        response = await mockBackendService.updatePaymentMethod(selectedMethodId, paymentData);
      } else {
        response = await mockBackendService.addPaymentMethod(paymentData);
      }

      if (response.success) {
        await loadPaymentMethods();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Failed to save payment method:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    if (!isProcessing) {
      setShowPaymentModal(false);
      setSelectedMethodId(null);
      setSelectedPaymentType(null);
      setShowTypeSelector(true);
    }
  };

  const selectedMethod = selectedMethodId 
    ? paymentMethods.find(method => method.id === selectedMethodId)
    : null;

  const renderPaymentTypeSelector = () => (
    <div className="payment-type-selector">
      <div className="payment-type-header">
        <h3 className="payment-type-title">Choose Payment Method</h3>
        <p className="payment-type-subtitle">Select how you'd like to pay</p>
      </div>
      
      <div className="payment-type-grid">
        {paymentTypes.map((type) => (
          <button
            key={type.id}
            className={`payment-type-card ${!type.available ? 'payment-type-disabled' : ''}`}
            onClick={() => type.available && handlePaymentTypeSelect(type.id)}
            disabled={!type.available}
          >
            <div className="payment-type-icon">
              {type.icon}
            </div>
            <div className="payment-type-content">
              <h4 className="payment-type-name">{type.name}</h4>
              <p className="payment-type-description">{type.description}</p>
            </div>
            {!type.available && (
              <div className="payment-type-badge">Coming Soon</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderPaymentForm = () => {
    if (selectedPaymentType === 'card') {
      return (
        <Elements stripe={stripePromise}>
          <PaymentForm 
            isModal={true}
            isEditMode={!!selectedMethodId}
            isSaveOnly={true}
            initialData={selectedMethod}
            onSuccess={handlePaymentFormSubmit}
          />
        </Elements>
      );
    }
    
    // For PayPal
    if (selectedPaymentType === 'paypal') {
      return (
        <Elements stripe={stripePromise}>
          <PaymentForm 
            isModal={true}
            isSaveOnly={true}
            selectedPaymentType="paypal"
            onSuccess={handlePaymentFormSubmit}
          />
        </Elements>
      );
    }
    
    // For Apple Pay
    if (selectedPaymentType === 'apple-pay') {
      return (
        <Elements stripe={stripePromise}>
          <PaymentForm 
            isModal={true}
            isSaveOnly={true}
            selectedPaymentType="apple-pay"
            onSuccess={handlePaymentFormSubmit}
          />
        </Elements>
      );
    }
    
    // For Google Pay
    if (selectedPaymentType === 'google-pay') {
      return (
        <Elements stripe={stripePromise}>
          <PaymentForm 
            isModal={true}
            isSaveOnly={true}
            selectedPaymentType="google-pay"
            onSuccess={handlePaymentFormSubmit}
          />
        </Elements>
      );
    }
    
    // Fallback for other payment types
    return (
      <div className="payment-type-form">
        <div className="payment-type-form-header">
          <button 
            className="payment-back-btn"
            onClick={handleBackToTypeSelector}
          >
            ← Back
          </button>
          <h3>Set up {paymentTypes.find(t => t.id === selectedPaymentType)?.name}</h3>
        </div>
        
        <div className="payment-type-coming-soon">
          <div className="payment-type-coming-soon-icon">
            {paymentTypes.find(t => t.id === selectedPaymentType)?.icon}
          </div>
          <h4>Coming Soon</h4>
          <p>{paymentTypes.find(t => t.id === selectedPaymentType)?.name} integration is coming soon. Please use a credit card for now.</p>
          <button 
            className="payment-btn-secondary"
            onClick={() => handlePaymentTypeSelect('card')}
          >
            Use Credit Card Instead
          </button>
        </div>
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="payment-methods-container">
        {/* Breadcrumb */}
        <SubscriptionBreadcrumbs currentPage="payment-methods" />

        {/* Header */}
        <div className="payment-methods-header">
          <div className="payment-methods-header-content">
            <h1 className="payment-methods-title">
              Payment <span className="payment-methods-title-highlight">Methods</span>
            </h1>
            <p className="payment-methods-subtitle">
              Manage your saved payment methods for subscriptions and purchases
            </p>
          </div>
          <button
            className="payment-methods-add-btn"
            onClick={handleAddPaymentMethod}
            disabled={isProcessing}
          >
            <Plus size={18} />
            Add Payment Method
          </button>
        </div>

        {/* Content */}
        <div className="payment-methods-content">
          {isLoading ? (
            /* Loading State */
            <div className="payment-methods-loading">
              <div className="payment-method-skeleton">
                <div className="skeleton-header"></div>
                <div className="skeleton-content"></div>
              </div>
              <div className="payment-method-skeleton">
                <div className="skeleton-header"></div>
                <div className="skeleton-content"></div>
              </div>
            </div>
          ) : paymentMethods.length === 0 ? (
            /* Empty State */
            <div className="payment-methods-empty-state">
              <div className="payment-methods-empty-icon">
                <CreditCard size={48} />
              </div>
              <h3 className="payment-methods-empty-title">No payment methods</h3>
              <p className="payment-methods-empty-description">
                Add a payment method to manage your subscriptions and make purchases.
              </p>
              <button
                className="payment-methods-empty-btn"
                onClick={handleAddPaymentMethod}
              >
                <Plus size={18} />
                Add Your First Payment Method
              </button>
            </div>
          ) : (
            /* Payment Methods Grid */
            <div className="payment-methods-grid">
              {paymentMethods.map((method) => (
                <PaymentDetails
                  key={method.id}
                  paymentMethod={method}
                  onEdit={() => handleEditPaymentMethod(method.id)}
                  onDelete={() => handleDeletePaymentMethod(method.id)}
                  onSetDefault={() => handleSetDefaultPaymentMethod(method.id)}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="payment-modal-overlay" onClick={handleCloseModal}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
              <div className="payment-modal-header">
                <h3 className="payment-modal-title">
                  {showTypeSelector 
                    ? "Add Payment Method" 
                    : selectedMethodId 
                      ? "Update Card Information" 
                      : `Add ${paymentTypes.find(t => t.id === selectedPaymentType)?.name}`
                  }
                </h3>
                <button 
                  className="payment-modal-close"
                  onClick={handleCloseModal}
                  disabled={isProcessing}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="payment-modal-content">
                {showTypeSelector ? renderPaymentTypeSelector() : renderPaymentForm()}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default PaymentMethods;
