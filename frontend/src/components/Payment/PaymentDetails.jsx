import React from 'react';
import { 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  User, 
  MapPin, 
  Mail, 
  Trash2,
  Edit, 
  X 
} from 'lucide-react';
import './payment-details.css';

const PaymentDetails = ({ paymentMethod, onClose, onEdit, onDelete, isDefault, onSetDefault }) => {
  if (!paymentMethod) return null;

  const formatCardType = (brand) => {
    const brands = {
      'visa': 'Visa',
      'mastercard': 'Mastercard',
      'amex': 'American Express',
      'discover': 'Discover',
      'diners': 'Diners Club',
      'jcb': 'JCB'
    };
    return brands[brand.toLowerCase()] || brand;
  };

  // Helper function to get card logo
  const getCardLogo = (brand) => {
    const brandLower = brand?.toLowerCase();
    switch(brandLower) {
      case 'visa':
        return <img src="/images/visa-icon.svg" alt="Visa" className="payment-details-logo" />;
      case 'mastercard':
        return <img src="/images/mastercard-icon.svg" alt="Mastercard" className="payment-details-logo" />;
      case 'amex':
      case 'american express':
        return <img src="/images/amex-icon.svg" alt="American Express" className="payment-details-logo" />;
      case 'discover':
        return <img src="/images/discover-icon.svg" alt="Discover" className="payment-details-logo" />;
      case 'diners':
        return <img src="/images/diners-icon.svg" alt="Diners Club" className="payment-details-logo" />;
      case 'jcb':
        return <img src="/images/jcb-icon.svg" alt="JCB" className="payment-details-logo" />;
      default:
        return <CreditCard size={28} />;
    }
  };

  return (
    <div className="payment-details-container">
      <div className="payment-details-header">
        <h3 className="payment-details-title">
          {paymentMethod.type === 'card' && 'Card Details'}
          {paymentMethod.type === 'paypal' && 'PayPal Account Details'}
          {paymentMethod.type === 'google-pay' && 'Google Pay Details'}
          {paymentMethod.type === 'apple-pay' && 'Apple Pay Details'}
        </h3>
        <button className="payment-details-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="payment-details-content">
        <div className="payment-details-icon-container">
          {paymentMethod.type === 'card' && (
            <div className="payment-details-icon payment-details-card-icon">
              {getCardLogo(paymentMethod.brand)}
            </div>
          )}
          {paymentMethod.type === 'paypal' && (
            <div className="payment-details-icon payment-details-paypal-icon">
              <img src="/images/paypal-icon.svg" alt="PayPal" className="payment-details-logo" />
            </div>
          )}
          {paymentMethod.type === 'google-pay' && (
            <div className="payment-details-icon payment-details-google-pay-icon">
              <img src="/images/google-pay-icon.svg" alt="Google Pay" className="payment-details-logo" />
            </div>
          )}
          {paymentMethod.type === 'apple-pay' && (
            <div className="payment-details-icon payment-details-apple-pay-icon">
              <img src="/images/apple-pay-icon.svg" alt="Apple Pay" className="payment-details-logo" />
            </div>
          )}
          
          {isDefault && (
            <div className="payment-details-default-badge">Default</div>
          )}
        </div>

        <div className="payment-details-info-section">
          {paymentMethod.type === 'card' && (
            <>
              <div className="payment-details-info-row">
                <div className="payment-details-info-label">
                  <CreditCard size={16} />
                  <span>Card Type</span>
                </div>
                <div className="payment-details-info-value">
                  {formatCardType(paymentMethod.brand)}
                </div>
              </div>

              <div className="payment-details-info-row">
                <div className="payment-details-info-label">
                  <CreditCard size={16} />
                  <span>Number</span>
                </div>
                <div className="payment-details-info-value">
                  **** **** **** {paymentMethod.last4}
                </div>
              </div>

              <div className="payment-details-info-row">
                <div className="payment-details-info-label">
                  <Calendar size={16} />
                  <span>Expiry Date</span>
                </div>
                <div className="payment-details-info-value">
                  {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                </div>
              </div>

              <div className="payment-details-info-row">
                <div className="payment-details-info-label">
                  <User size={16} />
                  <span>Cardholder</span>
                </div>
                <div className="payment-details-info-value">
                  {paymentMethod.cardHolder || '(Not specified)'}
                </div>
              </div>
            </>
          )}

          {paymentMethod.type === 'paypal' && (
            <div className="payment-details-info-row">
              <div className="payment-details-info-label">
                <Mail size={16} />
                <span>Email Address</span>
              </div>
              <div className="payment-details-info-value">
                {paymentMethod.email}
              </div>
            </div>
          )}

          {(paymentMethod.type === 'google-pay' || paymentMethod.type === 'apple-pay') && (
            <div className="payment-details-wallet-info">
              <ShieldCheck size={24} className="payment-details-wallet-icon" />
              <p className="payment-details-wallet-text">
                {paymentMethod.type === 'google-pay' 
                  ? 'Secure payments via your Google Pay account. No additional information is stored on our servers.' 
                  : 'Secure payments via your Apple Pay account. No additional information is stored on our servers.'}
              </p>
            </div>
          )}
        </div>

        <div className="payment-details-actions">
          {!isDefault && (
            <button 
              className="payment-details-action-btn payment-details-default-btn"
              onClick={onSetDefault}
            >
              Set as Default
            </button>
          )}
          
          <button 
            className="payment-details-action-btn payment-details-edit-btn"
            onClick={() => onEdit(paymentMethod)}
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          
          <button 
            className="payment-details-action-btn payment-details-delete-btn"
            onClick={() => onDelete(paymentMethod.id)}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="payment-details-security">
        <ShieldCheck size={16} />
        <span>Payment information secured according to PCI DSS standards</span>
      </div>
    </div>
  );
};

export default PaymentDetails; 