/**
 * Mock Backend Service - Simulates complete payment and subscription flow
 * This service provides realistic backend simulation for testing purposes
 */

import plansData from '../data/plans.json';

// Simulated database state
let mockDatabase = {
  currentUser: {
    id: 'user_123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    subscriptionTier: 'free',
    subscriptionId: null,
    subscriptionDate: null,
    billingInterval: 'monthly',
    nextBillingDate: null,
    isActive: true,
  },
  paymentMethods: [
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: '12',
      expiryYear: '2025',
      cardHolder: 'John Doe',
      isDefault: true,
      createdAt: '2023-10-15T10:00:00Z'
    },
    {
      id: 'pm_2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: '08',
      expiryYear: '2026',
      cardHolder: 'John Doe',
      isDefault: false,
      createdAt: '2023-09-20T14:30:00Z'
    }
  ],
  billingHistory: [],
  subscriptions: {}
};

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const formatDate = (date) => new Date(date).toISOString();

// Mock Backend Service
export const mockBackendService = {
  
  // ===== SUBSCRIPTION MANAGEMENT =====
  
  /**
   * Get current user subscription details
   */
  async getCurrentSubscription() {
    await delay(500); // Simulate network delay
    
    const user = mockDatabase.currentUser;
    const currentPlan = plansData.find(plan => plan.id === user.subscriptionTier) || plansData[0];
    
    return {
      success: true,
      data: {
        user,
        currentPlan,
        isActive: user.isActive,
        nextBillingDate: user.nextBillingDate,
        billingInterval: user.billingInterval
      }
    };
  },

  /**
   * Upgrade/Change subscription plan
   */
  async changeSubscriptionPlan(planId, billingInterval = 'monthly') {
    await delay(1500); // Simulate processing time
    
    try {
      const targetPlan = plansData.find(plan => plan.id === planId);
      if (!targetPlan) {
        throw new Error('Plan not found');
      }

      const user = mockDatabase.currentUser;
      const oldPlan = user.subscriptionTier;
      
      // Update user subscription
      user.subscriptionTier = planId;
      user.billingInterval = billingInterval;
      user.subscriptionDate = formatDate(new Date());
      user.isActive = true;
      
      // Calculate next billing date
      const nextBilling = new Date();
      if (billingInterval === 'yearly') {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      } else {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      }
      user.nextBillingDate = formatDate(nextBilling);

      // Create subscription record
      const subscriptionId = generateId('sub');
      user.subscriptionId = subscriptionId;
      
      mockDatabase.subscriptions[subscriptionId] = {
        id: subscriptionId,
        planId,
        billingInterval,
        status: 'active',
        createdAt: user.subscriptionDate,
        nextBillingDate: user.nextBillingDate,
        amount: billingInterval === 'yearly' ? targetPlan.yearlyPrice : targetPlan.price
      };

      // Add billing record if not free plan
      if (planId !== 'free') {
        await this.addBillingRecord({
          amount: billingInterval === 'yearly' ? targetPlan.yearlyPrice : targetPlan.price,
          description: `Subscription to ${targetPlan.name} - ${billingInterval}`,
          status: 'paid',
          planName: targetPlan.name
        });
      }

      return {
        success: true,
        data: {
          subscriptionId,
          oldPlan,
          newPlan: planId,
          billingInterval,
          nextBillingDate: user.nextBillingDate,
          message: planId === 'free' ? 'Subscription cancelled successfully' : `Upgraded to ${targetPlan.name} plan`
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription() {
    await delay(1000);
    
    const user = mockDatabase.currentUser;
    const oldPlan = user.subscriptionTier;
    
    // Downgrade to free
    user.subscriptionTier = 'free';
    user.subscriptionId = null;
    user.nextBillingDate = null;
    user.isActive = false;
    
    return {
      success: true,
      data: {
        oldPlan,
        message: 'Subscription cancelled successfully. You now have access to the Free plan.'
      }
    };
  },

  // ===== PAYMENT METHODS MANAGEMENT =====
  
  /**
   * Get all payment methods
   */
  async getPaymentMethods() {
    await delay(300);
    
    return {
      success: true,
      data: mockDatabase.paymentMethods
    };
  },

  /**
   * Add new payment method
   */
  async addPaymentMethod(methodData) {
    await delay(800);
    
    try {
      const newMethod = {
        id: generateId('pm'),
        ...methodData,
        createdAt: formatDate(new Date()),
        isDefault: mockDatabase.paymentMethods.length === 0
      };

      // If this is set as default, update others
      if (methodData.isDefault) {
        mockDatabase.paymentMethods.forEach(method => {
          method.isDefault = false;
        });
      }

      mockDatabase.paymentMethods.push(newMethod);

      return {
        success: true,
        data: newMethod
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Update payment method
   */
  async updatePaymentMethod(methodId, updateData) {
    await delay(600);
    
    try {
      const methodIndex = mockDatabase.paymentMethods.findIndex(m => m.id === methodId);
      if (methodIndex === -1) {
        throw new Error('Payment method not found');
      }

      // Update the method
      mockDatabase.paymentMethods[methodIndex] = {
        ...mockDatabase.paymentMethods[methodIndex],
        ...updateData,
        updatedAt: formatDate(new Date())
      };

      // Handle default setting
      if (updateData.isDefault) {
        mockDatabase.paymentMethods.forEach((method, index) => {
          if (index !== methodIndex) {
            method.isDefault = false;
          }
        });
      }

      return {
        success: true,
        data: mockDatabase.paymentMethods[methodIndex]
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Delete payment method
   */
  async deletePaymentMethod(methodId) {
    await delay(400);
    
    try {
      const methodIndex = mockDatabase.paymentMethods.findIndex(m => m.id === methodId);
      if (methodIndex === -1) {
        throw new Error('Payment method not found');
      }

      const deletedMethod = mockDatabase.paymentMethods[methodIndex];
      mockDatabase.paymentMethods.splice(methodIndex, 1);

      // If deleted method was default, set first remaining as default
      if (deletedMethod.isDefault && mockDatabase.paymentMethods.length > 0) {
        mockDatabase.paymentMethods[0].isDefault = true;
      }

      return {
        success: true,
        data: { deletedMethodId: methodId }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ===== BILLING & PAYMENT PROCESSING =====
  
  /**
   * Get billing history
   */
  async getBillingHistory() {
    await delay(400);
    
    return {
      success: true,
      data: mockDatabase.billingHistory.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
  },

  /**
   * Add billing record
   */
  async addBillingRecord(recordData) {
    const record = {
      id: generateId('inv'),
      date: formatDate(new Date()),
      ...recordData,
      invoiceUrl: `https://example.com/invoices/${generateId('inv')}.pdf`
    };

    mockDatabase.billingHistory.push(record);
    return record;
  },

  /**
   * Process payment
   */
  async processPayment(paymentData) {
    await delay(2000); // Simulate payment processing
    
    try {
      const { planId, billingInterval, paymentMethodId } = paymentData;
      
      // Validate payment method
      const paymentMethod = mockDatabase.paymentMethods.find(m => m.id === paymentMethodId);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      // Simulate payment success (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (!isSuccess) {
        throw new Error('Payment failed. Please try again or use a different payment method.');
      }

      // Process the subscription change
      const subscriptionResult = await this.changeSubscriptionPlan(planId, billingInterval);
      
      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.error);
      }

      return {
        success: true,
        data: {
          paymentId: generateId('pay'),
          ...subscriptionResult.data,
          paymentMethod: {
            type: paymentMethod.type,
            last4: paymentMethod.last4,
            brand: paymentMethod.brand
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ===== UTILITY METHODS =====
  
  /**
   * Reset mock database (for testing)
   */
  resetMockData() {
    mockDatabase.currentUser.subscriptionTier = 'free';
    mockDatabase.currentUser.subscriptionId = null;
    mockDatabase.currentUser.subscriptionDate = null;
    mockDatabase.currentUser.nextBillingDate = null;
    mockDatabase.currentUser.isActive = true;
    mockDatabase.billingHistory = [];
    mockDatabase.subscriptions = {};
  },

  /**
   * Get current mock database state (for debugging)
   */
  getMockState() {
    return JSON.parse(JSON.stringify(mockDatabase));
  },

  /**
   * Update user subscription tier (for testing different states)
   */
  setUserSubscriptionTier(tier, billingInterval = 'monthly') {
    mockDatabase.currentUser.subscriptionTier = tier;
    mockDatabase.currentUser.billingInterval = billingInterval;
    
    if (tier !== 'free') {
      mockDatabase.currentUser.subscriptionDate = formatDate(new Date());
      const nextBilling = new Date();
      if (billingInterval === 'yearly') {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      } else {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      }
      mockDatabase.currentUser.nextBillingDate = formatDate(nextBilling);
      mockDatabase.currentUser.isActive = true;
    } else {
      mockDatabase.currentUser.subscriptionDate = null;
      mockDatabase.currentUser.nextBillingDate = null;
      mockDatabase.currentUser.isActive = false;
    }
  }
};

export default mockBackendService; 