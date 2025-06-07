import React, { useState } from 'react';
import mockBackendService from '../../../services/mockBackendService';
import { PlayCircle, RefreshCw, Database, CreditCard, User, Receipt } from 'lucide-react';
import './BackendTester.css';

const BackendTester = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [mockState, setMockState] = useState(null);

  const addTestResult = (testName, result, duration) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      testName,
      result,
      duration,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTest = async (testName, testFunction) => {
    const startTime = Date.now();
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      addTestResult(testName, { success: true, data: result }, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult(testName, { success: false, error: error.message }, duration);
      throw error;
    }
  };

  const testSubscriptionFlow = async () => {
    setIsRunningTest(true);
    try {
      // Test 1: Get current subscription (Free plan)
      await runTest('Get Current Subscription (Free)', () => 
        mockBackendService.getCurrentSubscription()
      );

      // Test 2: Upgrade to Premium plan
      await runTest('Upgrade to Premium Plan', () => 
        mockBackendService.changeSubscriptionPlan('premium', 'monthly')
      );

      // Test 3: Get subscription after upgrade
      await runTest('Get Subscription After Upgrade', () => 
        mockBackendService.getCurrentSubscription()
      );

      // Test 4: Get billing history
      await runTest('Get Billing History', () => 
        mockBackendService.getBillingHistory()
      );

      // Test 5: Downgrade to Basic plan
      await runTest('Downgrade to Basic Plan', () => 
        mockBackendService.changeSubscriptionPlan('basic', 'monthly')
      );

      // Test 6: Cancel subscription
      await runTest('Cancel Subscription', () => 
        mockBackendService.cancelSubscription()
      );

    } catch (error) {
      console.error('Subscription flow test failed:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  const testPaymentMethodsFlow = async () => {
    setIsRunningTest(true);
    try {
      // Test 1: Get existing payment methods
      await runTest('Get Payment Methods', () => 
        mockBackendService.getPaymentMethods()
      );

      // Test 2: Add new payment method
      const newMethod = {
        type: 'card',
        last4: '1234',
        brand: 'Visa',
        expiryMonth: '12',
        expiryYear: '2028',
        cardHolder: 'Test User',
        isDefault: false
      };
      
      const addResult = await runTest('Add New Payment Method', () => 
        mockBackendService.addPaymentMethod(newMethod)
      );

      // Test 3: Update payment method
      if (addResult.success) {
        await runTest('Update Payment Method', () => 
          mockBackendService.updatePaymentMethod(addResult.data.id, { 
            cardHolder: 'Updated Test User',
            isDefault: true 
          })
        );

        // Test 4: Delete payment method
        await runTest('Delete Payment Method', () => 
          mockBackendService.deletePaymentMethod(addResult.data.id)
        );
      }

    } catch (error) {
      console.error('Payment methods flow test failed:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  const testCompletePaymentFlow = async () => {
    setIsRunningTest(true);
    try {
      // Test 1: Get payment methods
      const paymentMethods = await runTest('Get Available Payment Methods', () => 
        mockBackendService.getPaymentMethods()
      );

      if (paymentMethods.success && paymentMethods.data.length > 0) {
        // Test 2: Process payment for Premium plan
        await runTest('Process Payment (Premium Plan)', () => 
          mockBackendService.processPayment({
            planId: 'premium',
            billingInterval: 'monthly',
            paymentMethodId: paymentMethods.data[0].id
          })
        );

        // Test 3: Process payment for Ultimate plan (yearly)
        await runTest('Process Payment (Ultimate Plan - Yearly)', () => 
          mockBackendService.processPayment({
            planId: 'ultimate',
            billingInterval: 'yearly',
            paymentMethodId: paymentMethods.data[0].id
          })
        );
      } else {
        addTestResult('Payment Flow Test', { 
          success: false, 
          error: 'No payment methods available for testing'
        }, 0);
      }

    } catch (error) {
      console.error('Complete payment flow test failed:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  const resetMockData = async () => {
    setIsRunningTest(true);
    try {
      await runTest('Reset Mock Database', () => {
        mockBackendService.resetMockData();
        return { message: 'Mock database reset successfully' };
      });
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  const getMockState = async () => {
    try {
      const state = mockBackendService.getMockState();
      setMockState(state);
    } catch (error) {
      console.error('Failed to get mock state:', error);
    }
  };

  const setTestSubscriptionTier = async (tier, interval = 'monthly') => {
    setIsRunningTest(true);
    try {
      await runTest(`Set User to ${tier} plan`, () => {
        mockBackendService.setUserSubscriptionTier(tier, interval);
        return { message: `User set to ${tier} plan with ${interval} billing` };
      });
    } catch (error) {
      console.error('Failed to set subscription tier:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="backend-tester">
      <div className="backend-tester-header">
        <h2 className="backend-tester-title">
          <Database size={24} />
          Backend Service Tester
        </h2>
        <p className="backend-tester-subtitle">
          Test and simulate the complete payment and subscription flow
        </p>
      </div>

      {/* Test Actions */}
      <div className="backend-tester-actions">
        <div className="backend-tester-section">
          <h3>
            <User size={20} />
            Subscription Flow Tests
          </h3>
          <div className="backend-tester-buttons">
            <button 
              onClick={testSubscriptionFlow}
              disabled={isRunningTest}
              className="backend-test-button primary"
            >
              <PlayCircle size={16} />
              Test Subscription Flow
            </button>
          </div>
        </div>

        <div className="backend-tester-section">
          <h3>
            <CreditCard size={20} />
            Payment Methods Tests
          </h3>
          <div className="backend-tester-buttons">
            <button 
              onClick={testPaymentMethodsFlow}
              disabled={isRunningTest}
              className="backend-test-button primary"
            >
              <PlayCircle size={16} />
              Test Payment Methods
            </button>
          </div>
        </div>

        <div className="backend-tester-section">
          <h3>
            <Receipt size={20} />
            Complete Payment Flow Tests
          </h3>
          <div className="backend-tester-buttons">
            <button 
              onClick={testCompletePaymentFlow}
              disabled={isRunningTest}
              className="backend-test-button primary"
            >
              <PlayCircle size={16} />
              Test Payment Processing
            </button>
          </div>
        </div>

        <div className="backend-tester-section">
          <h3>
            <RefreshCw size={20} />
            Database Controls
          </h3>
          <div className="backend-tester-buttons">
            <button 
              onClick={resetMockData}
              disabled={isRunningTest}
              className="backend-test-button secondary"
            >
              <RefreshCw size={16} />
              Reset Mock Data
            </button>
            <button 
              onClick={getMockState}
              disabled={isRunningTest}
              className="backend-test-button secondary"
            >
              <Database size={16} />
              View Database State
            </button>
            <button 
              onClick={clearResults}
              className="backend-test-button secondary"
            >
              Clear Results
            </button>
          </div>
        </div>

        <div className="backend-tester-section">
          <h3>Quick Subscription Setup</h3>
          <div className="backend-tester-buttons">
            <button onClick={() => setTestSubscriptionTier('free')} disabled={isRunningTest} className="backend-test-button small">Free</button>
            <button onClick={() => setTestSubscriptionTier('basic')} disabled={isRunningTest} className="backend-test-button small">Basic</button>
            <button onClick={() => setTestSubscriptionTier('premium')} disabled={isRunningTest} className="backend-test-button small">Premium</button>
            <button onClick={() => setTestSubscriptionTier('ultimate')} disabled={isRunningTest} className="backend-test-button small">Ultimate</button>
            <button onClick={() => setTestSubscriptionTier('premium', 'yearly')} disabled={isRunningTest} className="backend-test-button small">Premium (Yearly)</button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="backend-tester-results">
          <h3>Test Results</h3>
          <div className="backend-test-results-list">
            {testResults.map((test) => (
              <div 
                key={test.id} 
                className={`backend-test-result ${test.result.success ? 'success' : 'error'}`}
              >
                <div className="backend-test-result-header">
                  <span className="backend-test-name">{test.testName}</span>
                  <span className="backend-test-time">{test.timestamp}</span>
                  <span className="backend-test-duration">{test.duration}ms</span>
                </div>
                <div className="backend-test-result-content">
                  {test.result.success ? (
                    <pre>{JSON.stringify(test.result.data, null, 2)}</pre>
                  ) : (
                    <div className="backend-test-error">
                      Error: {test.result.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mock Database State */}
      {mockState && (
        <div className="backend-tester-state">
          <h3>Current Mock Database State</h3>
          <pre className="backend-state-json">
            {JSON.stringify(mockState, null, 2)}
          </pre>
        </div>
      )}

      {isRunningTest && (
        <div className="backend-tester-loading">
          <RefreshCw className="spinning" size={20} />
          <span>Running tests...</span>
        </div>
      )}
    </div>
  );
};

export default BackendTester; 