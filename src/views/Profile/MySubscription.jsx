import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Check, 
  CreditCard, 
  Calendar, 
  Receipt, 
  Download,
  Clock
} from "lucide-react";
import plansData from "../../data/plans.json";
import { SubscriptionBreadcrumbs } from "../../components/UI/Breadcrumbs";
import mockBackendService from "../../services/mockBackendService";
import "./MySubscription.css";

// Types
const SubscriptionTier = {
  FREE: "free",
  BASIC: "basic", 
  PREMIUM: "premium",
  ULTIMATE: "ultimate",
};

const MySubscription = ({ shouldShowContent = true }) => {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      // Load subscription details
      const subResponse = await mockBackendService.getCurrentSubscription();
      if (subResponse.success) {
        setSubscriptionData(subResponse.data);
      }

      // Load billing history
      const billingResponse = await mockBackendService.getBillingHistory();
      if (billingResponse.success) {
        setBillingHistory(billingResponse.data);
      }

      // Load payment methods
      const paymentResponse = await mockBackendService.getPaymentMethods();
      if (paymentResponse.success) {
        setPaymentMethods(paymentResponse.data);
      }
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current plan or fallback to free plan
  const currentPlan = subscriptionData?.currentPlan || plansData.find(plan => plan.id === 'free');
  const user = subscriptionData?.user;
  const subscriptionTier = user?.subscriptionTier || SubscriptionTier.FREE;
  
  // Get default payment method
  const defaultPaymentMethod = paymentMethods.find(pm => pm.isDefault);

  // Skeleton Component
  const Skeleton = ({ className }) => {
    return <div className={`skeleton-loader ${className}`}></div>;
  };

  if (!shouldShowContent || isLoading) {
    return (
      <div className="subscription-container">
        {/* Breadcrumb */}
        <SubscriptionBreadcrumbs currentPage="my-subscription" />
        
        <div className="subscription-header">
          <h2 className="subscription-title">
            My <span className="subscription-title-highlight">Subscription</span>
          </h2>
          <button
            className="subscription-header-button"
            onClick={() => navigate("/subscriptions")}
          >
            Upgrade Plan
          </button>
        </div>

        <div className="subscription-skeleton">
          <Skeleton className="skeleton-plan-card" />
          <Skeleton className="skeleton-details-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-container">
      {/* Breadcrumb */}
      <SubscriptionBreadcrumbs currentPage="my-subscription" />
      
      {/* Header */}
      <div className="subscription-header">
        <h2 className="subscription-title">
          My <span className="subscription-title-highlight">Subscription</span>
        </h2>
        <div className="subscription-header-buttons">
          <button
            className="subscription-header-button secondary"
            onClick={() => navigate("/profile/settings/payment-methods")}
          >
            Payment Methods
          </button>
          <button
            className="subscription-header-button primary"
            onClick={() => navigate("/subscriptions")}
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      <div className="subscription-content">
        {/* Current Plan */}
        <div className="current-plan-section">
          <div className="plan-header">
            <div className="plan-title-section">
              <h3 className="plan-name">{currentPlan.name}</h3>
              <p className="plan-description">{currentPlan.description}</p>
            </div>
            <div className="plan-price-section">
              <span className="plan-price">
                ${user?.billingInterval === 'yearly' ? currentPlan.yearlyPrice : currentPlan.price}
              </span>
              <span className="plan-interval">
                {user?.billingInterval === 'yearly' ? currentPlan.yearlyInterval : currentPlan.interval}
              </span>
            </div>
          </div>

          <div className="plan-features">
            <ul className="features-list">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <Check size={16} className="feature-check" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="subscription-details">
          {subscriptionTier === SubscriptionTier.FREE ? (
            /* Free Plan State */
            <div className="free-plan-details">
              <div className="upgrade-prompt">
                <h4 className="upgrade-title">Ready to upgrade?</h4>
                <p className="upgrade-description">
                  Unlock advanced features and accelerate your medical school journey.
                </p>
              </div>
            </div>
          ) : (
            /* Paid Plan Details */
            <>
              {/* Subscription Overview */}
              <div className="subscription-overview">
                <h4 className="section-title">Subscription Details</h4>
                <div className="overview-grid">
                  <div className="overview-item">
                    <div className="overview-icon">
                      <Calendar size={18} />
                    </div>
                    <div className="overview-content">
                      <span className="overview-label">Subscribed since</span>
                      <span className="overview-value">
                        {user?.subscriptionDate ? format(new Date(user.subscriptionDate), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="overview-item">
                    <div className="overview-icon">
                      <Clock size={18} />
                    </div>
                    <div className="overview-content">
                      <span className="overview-label">Next billing</span>
                      <span className="overview-value">
                        {user?.nextBillingDate ? format(new Date(user.nextBillingDate), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="overview-item">
                    <div className="overview-icon">
                      <Receipt size={18} />
                    </div>
                    <div className="overview-content">
                      <span className="overview-label">
                        {user?.billingInterval === 'yearly' ? 'Annual cost' : 'Monthly cost'}
                      </span>
                      <span className="overview-value">
                        ${user?.billingInterval === 'yearly' ? currentPlan.yearlyPrice : currentPlan.price}/{user?.billingInterval === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="payment-section">
                <h4 className="section-title">Payment Method</h4>
                {defaultPaymentMethod ? (
                  <div className="payment-card">
                    <CreditCard size={18} className="card-icon" />
                    <div className="card-details">
                      <span className="card-number">•••• •••• •••• {defaultPaymentMethod.last4}</span>
                      <span className="card-expiry">
                        {defaultPaymentMethod.brand} • Expires {defaultPaymentMethod.expiryMonth}/{defaultPaymentMethod.expiryYear}
                      </span>
                    </div>
                    <button 
                      className="update-button"
                      onClick={() => navigate("/profile/settings/payment-methods")}
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <div className="payment-card">
                    <CreditCard size={18} className="card-icon" />
                    <div className="card-details">
                      <span className="card-number">No payment method</span>
                      <span className="card-expiry">Add a payment method to continue</span>
                    </div>
                    <button 
                      className="update-button"
                      onClick={() => navigate("/profile/settings/payment-methods")}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Billing History */}
              <div className="billing-section">
                <div className="billing-header">
                  <h4 className="section-title">Billing History</h4>
                  <button 
                    className="view-all-link"
                    onClick={() => navigate("/billing-history")}
                  >
                    View all
                  </button>
                </div>
                
                <div className="billing-list">
                  {billingHistory.length > 0 ? (
                    billingHistory.slice(0, 3).map((payment) => (
                      <div key={payment.id} className="billing-item">
                        <div className="billing-info">
                          <div className="billing-date-status">
                            <span className="billing-date">
                              {format(new Date(payment.date), 'MMM dd, yyyy')}
                            </span>
                            <span className="billing-status">{payment.status}</span>
                          </div>
                          <span className="billing-description">
                            {payment.description || 'Monthly subscription'}
                          </span>
                        </div>
                        <div className="billing-actions">
                          <span className="billing-amount">${payment.amount}</span>
                          <button className="download-button" title="Download invoice">
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="billing-item">
                      <div className="billing-info">
                        <span className="billing-description">No billing history available</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription Actions */}
              <div className="subscription-actions">
                <button 
                  className="action-button primary"
                  onClick={() => navigate("/subscriptions")}
                >
                  Change Plan
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => navigate("/cancel-subscription")}
                >
                  Cancel Subscription
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySubscription;