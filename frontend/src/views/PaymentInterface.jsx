import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import UserLayout from "../components/user/layout/UserLayout";
import PaymentHeader from "../components/Payment/PaymentHeader";
import PaymentForm from "../components/Payment/PaymentForm";
import OrderSummary from "../components/Payment/OrderSummary";
import PaymentSuccess from "../components/Payment/PaymentSuccess";
import PaymentFooter from "../components/Payment/PaymentFooter";
import SecurityWarnings from "../components/Payment/SecurityWarnings";
import { ChevronRight, CreditCard, User, CheckCircle, PlusCircle, ArrowRight, Shield, Lock } from "lucide-react";
import "./Payment.css";
import plansData from "../data/plans.json";
import { SubscriptionBreadcrumbs } from '../components/UI/Breadcrumbs';
import mockBackendService from '../services/mockBackendService';

// Initialize Stripe with a test key (for demo only)
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const PaymentInterface = () => {
  const [subscriptionPlans] = useState(plansData);
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingInterval, setBillingInterval] = useState("monthly");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get card logo
  const getCardLogo = (brand) => {
    const brandLower = brand?.toLowerCase();
    switch(brandLower) {
      case 'visa':
        return <img src="/images/visa-icon.svg" alt="Visa" className="pay-card-logo" />;
      case 'mastercard':
        return <img src="/images/mastercard-icon.svg" alt="Mastercard" className="pay-card-logo" />;
      case 'amex':
      case 'american express':
        return <img src="/images/amex-icon.svg" alt="American Express" className="pay-card-logo" />;
      case 'discover':
        return <img src="/images/discover-icon.svg" alt="Discover" className="pay-card-logo" />;
      case 'diners':
        return <img src="/images/diners-icon.svg" alt="Diners Club" className="pay-card-logo" />;
      case 'jcb':
        return <img src="/images/jcb-icon.svg" alt="JCB" className="pay-card-logo" />;
      default:
        return <CreditCard size={20} />;
    }
  };

  useEffect(() => {
    // Get the selected plan from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const planId =
      urlParams.get("plan") || localStorage.getItem("selectedPlanId") || "free"; // Default to free plan

    if (subscriptionPlans) {
      const plan = subscriptionPlans.find((p) => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);

        // Get billing interval
        const interval =
          urlParams.get("billing") ||
          localStorage.getItem("billingInterval") ||
          "monthly";
        setBillingInterval(interval);
      } else {
        // If the plan is not found, use the default free plan
        const freePlan = subscriptionPlans.find((p) => p.id === "free");
        if (freePlan) {
          setSelectedPlan(freePlan);
        } else {
          // Redirect as a last resort if no plan is found
          navigate("/subscriptions");
        }
      }
    } else {
      // Fallback if plans are not yet loaded
      navigate("/subscriptions");
    }
    
    // Load saved payment methods using mock backend service
    loadPaymentMethods();
    
  }, [subscriptionPlans, navigate]);

  const loadPaymentMethods = async () => {
    try {
      const response = await mockBackendService.getPaymentMethods();
      if (response.success) {
        setSavedPaymentMethods(response.data);
        
        // Select default method if available
        const defaultMethod = response.data.find(m => m.isDefault);
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.id);
        }
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus("success");
  };
  
  const handleAddNewPaymentMethod = () => {
    navigate('/profile/settings/payment-methods');
  };
  
  const handleContinuePayment = async () => {
    if (!selectedPaymentMethod) {
      return;
    }
    
    setPaymentStatus("processing");
    setLoadingProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      const paymentData = {
        planId: selectedPlan.id,
        billingInterval,
        paymentMethodId: selectedPaymentMethod
      };
      
      const response = await mockBackendService.processPayment(paymentData);
      
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      if (response.success) {
        setTimeout(() => {
          handlePaymentSuccess();
        }, 500);
      } else {
        setPaymentStatus("error");
        // You could show error message here
        console.error('Payment failed:', response.error);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setPaymentStatus("error");
      console.error('Payment processing error:', error);
    }
  };

  // If payment was successful, show success screen
  if (paymentStatus === "success") {
    return <PaymentSuccess selectedPlan={selectedPlan} />;
  }

  // If no plan is selected or still loading, show loading state
  if (!selectedPlan || isLoading) {
    return <div className="pay-loading">Loading...</div>;
  }

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "var(--primary-color)",
    },
  };

  return (
    <UserLayout>
      <div className="pay-container">
        <div className="pay-content">
          {/* Breadcrumb with the new component */}
          <SubscriptionBreadcrumbs 
            currentPage="payment" 
            planName={selectedPlan?.name}
          />

          <div className="pay-grid">
            <div className="pay-form-container">
              {selectedPlan.id !== "free" ? (
                paymentStatus === "processing" ? (
                  <div className="pay-progress-container pay-card">
                    <div className="pay-card-header">
                      <div className="pay-card-header-content">
                        <Shield className="pay-card-header-icon" />
                        <h2 className="pay-card-title">Processing Payment...</h2>
                      </div>
                    </div>
                    <div className="pay-card-content">
                      <div className="pay-progress-bar">
                        <div
                          className="pay-progress-fill"
                          style={{ width: `${loadingProgress}%` }}
                        ></div>
                      </div>
                      <p className="pay-progress-text">
                        {loadingProgress < 100
                          ? "Processing your payment..."
                          : "Payment successful!"}
                      </p>
                    </div>
                  </div>
                ) : showPaymentForm ? (
                  <Elements stripe={stripePromise} options={{ appearance }}>
                    <PaymentForm
                      selectedPlan={selectedPlan}
                      billingInterval={billingInterval}
                      onSuccess={handlePaymentSuccess}
                      loadingProgress={loadingProgress}
                    />
                  </Elements>
                ) : (
                  <div className="pay-payment-methods-selector pay-card">
                    <div className="pay-card-header">
                      <div className="pay-card-header-content">
                        <CreditCard className="pay-card-header-icon" />
                        <h2 className="pay-card-title">Select a Payment Method</h2>
                      </div>
                    </div>
                    <div className="pay-card-content">
                      {savedPaymentMethods.length === 0 ? (
                        <div className="pay-no-payment-methods">
                          <div className="pay-empty-state">
                            <div className="pay-empty-state-icon">
                              <CreditCard size={32} />
                            </div>
                            <p className="pay-empty-state-title">No saved payment methods</p>
                            <p className="pay-empty-state-description">
                              Add a payment method to continue with your subscription.
                            </p>
                            <button 
                              className="pay-btn-primary" 
                              onClick={() => setShowPaymentForm(true)}
                            >
                              <PlusCircle size={16} />
                              Add Payment Method
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="pay-payment-methods-list">
                            {savedPaymentMethods.map((method) => (
                              <label 
                                key={method.id}
                                className={`pay-payment-method-option ${selectedPaymentMethod === method.id ? 'pay-payment-method-selected' : ''}`}
                                onClick={() => setSelectedPaymentMethod(method.id)}
                              >
                                <div className="pay-payment-method-radio-container">
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={selectedPaymentMethod === method.id}
                                    onChange={() => setSelectedPaymentMethod(method.id)}
                                    className="pay-payment-method-radio"
                                  />
                                  <div className="pay-radio-indicator"></div>
                                </div>
                                <div className="pay-payment-method-content">
                                  <div className="pay-payment-method-icon">
                                    {method.type === 'card' && getCardLogo(method.brand)}
                                    {method.type === 'paypal' && (
                                      <div className="pay-payment-icon-container">
                                        <span className="pay-paypal-text">PayPal</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="pay-payment-method-details">
                                    {method.type === 'card' && (
                                      <>
                                        <div className="pay-payment-method-name">
                                          {method.brand} •••• {method.last4}
                                        </div>
                                        <div className="pay-payment-method-description">
                                          Expires {method.expiryMonth}/{method.expiryYear}
                                        </div>
                                      </>
                                    )}
                                    {method.type === 'paypal' && (
                                      <>
                                        <div className="pay-payment-method-name">PayPal</div>
                                        <div className="pay-payment-method-description">{method.email}</div>
                                      </>
                                    )}
                                  </div>
                                  {method.isDefault && (
                                    <div className="pay-payment-method-default">
                                      <span>Default</span>
                                    </div>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                          
                          <div className="pay-payment-methods-footer">
                            <button 
                              className="pay-btn-secondary" 
                              onClick={handleAddNewPaymentMethod}
                            >
                              <PlusCircle size={16} />
                              <span>Manage Payment Methods</span>
                            </button>
                            
                            <button 
                              className="pay-btn-primary pay-btn-continue" 
                              onClick={handleContinuePayment}
                              disabled={!selectedPaymentMethod}
                            >
                              <span>Continue to Payment</span>
                              <ArrowRight size={16} />
                            </button>
                          </div>

                          <div className="pay-security-notice">
                            <Lock size={14} />
                            <span>Secure payment processed by Stripe. Your information is protected.</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div className="pay-free-plan-activation pay-card">
                  <div className="pay-card-header">
                    <div className="pay-card-header-content">
                      <CheckCircle className="pay-card-header-icon" />
                      <h2 className="pay-card-title">Activate Free Plan</h2>
                    </div>
                  </div>
                  <div className="pay-card-content">
                    <div className="pay-free-plan-info">
                      <p className="pay-free-plan-text">
                        The {selectedPlan.name} is completely free! No payment required.
                      </p>
                    </div>
                    <button
                      className="pay-btn-primary"
                      onClick={handlePaymentSuccess}
                    >
                      <CheckCircle size={16} />
                      Activate Free Plan
                    </button>
                  </div>
                </div>
              )}
            </div>

            <OrderSummary
              selectedPlan={selectedPlan}
              billingInterval={billingInterval}
            />
          </div>
        </div>

        <PaymentFooter />
      </div>
    </UserLayout>
  );
};

export default PaymentInterface;