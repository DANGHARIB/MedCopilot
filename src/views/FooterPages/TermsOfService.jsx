import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  ArrowUp, 
  Shield, 
  Mail, 
  MapPin,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import './TermsOfService.css';

const TermsOfService = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const topButtonRef = useRef(null);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (topButtonRef.current) {
        if (window.scrollY > 300) {
          topButtonRef.current.classList.add('visible');
        } else {
          topButtonRef.current.classList.remove('visible');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Layout>
      <div className="terms-page">
        <div className="terms-container">
          <div className="terms-header">
            <div className="terms-header-icon">
              <FileText size={24} />
            </div>
            <div className="terms-header-content">
              <h1>Terms of Service</h1>
              <p className="terms-header-description">
                Please read these terms carefully before using our service
              </p>
            </div>
          </div>
          
          <div className="terms-meta">
            <div className="terms-meta-item">
              <span className="terms-meta-label">Last Updated:</span>
              <span className="terms-meta-value">{currentDate}</span>
            </div>
            <div className="terms-meta-item">
              <span className="terms-meta-label">Effective:</span>
              <span className="terms-meta-value">Immediately</span>
            </div>
          </div>
          
          <div className="terms-content" ref={contentRef}>
            <div className="privacy-notice">
              <AlertTriangle size={20} />
              <p>By accessing or using our Service, you agree to be bound by these Terms of Service. 
                <br/>
                If you disagree with any part of these terms, you may not access the Service.</p>
            </div>
            
            <h2>Terms of Service for Med School Copilot</h2>
            
            <section className="terms-section">
              <h3>1. Introduction and Acceptance</h3>
              <p>Welcome to Med School Copilot ("Service", "we", "our", or "us"), an AI-powered platform designed to assist medical school applicants throughout their application journey. By accessing or using our Service, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.</p>
              <p>These Terms constitute a legally binding agreement between you and Med School Copilot regarding your use of the Service and its features, including but not limited to our recommendation system for school selection, application readiness assessment, personal statement assistance, interview preparation, and other tools described on our platform.</p>
            </section>
            
            <section className="terms-section">
              <h3>2. Description of Services</h3>
              <p>Med School Copilot provides a suite of AI-powered tools to support prospective medical students, including:</p>
              <ul>
                <li>Personalized school selection recommendations</li>
                <li>Application readiness assessment</li>
                <li>Personal statement brainstorming and editing</li>
                <li>Secondary application essay assistance</li>
                <li>Interview preparation</li>
                <li>Admission offer evaluation</li>
                <li>Reapplication strategy support</li>
                <li>Letter of intent/interest generation</li>
              </ul>
              <p>Our Service is intended to provide guidance and assistance only. While we strive to provide accurate and helpful information, we do not guarantee admission to any institution or specific outcomes from using our Service.</p>
            </section>
            
            <section className="terms-section">
              <h3>3. User Accounts and Registration</h3>
              <h4>3.1 Account Creation</h4>
              <p>To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
              
              <h4>3.2 Account Security</h4>
              <p>You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
              
              <h4>3.3 Account Tiers</h4>
              <p>Med School Copilot offers different subscription tiers with varying features and pricing. The specific features available to you will depend on which subscription tier you select.</p>
            </section>
            
            <section className="terms-section">
              <h3>4. Payments and Billing</h3>
              <h4>4.1 Payment Processing</h4>
              <p>We use Stripe, Inc. ("Stripe") for payment processing services. By using our Service, you agree to be bound by Stripe's <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</p>
              
              <h4>4.2 Subscription Fees</h4>
              <p>All subscription fees are charged in advance based on the billing cycle selected at the time of purchase. Subscription fees are non-refundable except as expressly stated in these Terms or as required by applicable law.</p>
              
              <h4>4.3 Free Trials</h4>
              <p>We may offer free trials of our Service. At the end of the free trial period, you will be automatically charged the applicable subscription fee unless you cancel your subscription before the end of the trial period.</p>
              
              <h4>4.4 Taxes</h4>
              <p>All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities, and you shall be responsible for payment of all such taxes, levies, or duties associated with your use of the Service, excluding only United States (federal or state) taxes based on our income.</p>
              
              <h4>4.5 Price Changes</h4>
              <p>Med School Copilot reserves the right to modify subscription fees at any time. We will provide reasonable notice of any such changes. Your continued use of the Service after the fee change becomes effective constitutes your agreement to pay the modified subscription fees.</p>
            </section>
            
            <section className="terms-section">
              <h3>5. User Content and License</h3>
              <h4>5.1 User Content</h4>
              <p>"User Content" refers to any information, data, or material that you submit to the Service, including personal statements, academic information, demographic data, and application materials.</p>
              
              <h4>5.2 License to User Content</h4>
              <p>You grant Med School Copilot a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display your User Content solely for the purpose of providing you with the Service. This license exists only as long as you maintain an account with us.</p>
              
              <h4>5.3 Responsibility for User Content</h4>
              <p>You are solely responsible for your User Content and the consequences of submitting and publishing your User Content on the Service. You affirm, represent, and warrant that you own or have the necessary licenses, rights, consents, and permissions to publish the User Content you submit.</p>
            </section>
            
            <section className="terms-section">
              <h3>6. Privacy and Data Protection</h3>
              <h4>6.1 Privacy Policy</h4>
              <p>Our collection and use of personal information in connection with the Service is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection, use, and storage of your information as described in the Privacy Policy.</p>
              
              <h4>6.2 Data Security</h4>
              <p>We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk of processing your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
              
              <h4>6.3 FERPA and Educational Records</h4>
              <p>While Med School Copilot is not an educational institution subject to the Family Educational Rights and Privacy Act (FERPA), we recognize the sensitivity of educational records and are committed to maintaining the confidentiality and security of such information.</p>
            </section>
            
            <section className="terms-section">
              <h3>7. Intellectual Property Rights</h3>
              <h4>7.1 Service Content</h4>
              <p>The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Med School Copilot and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
              
              <h4>7.2 Feedback</h4>
              <p>If you provide Med School Copilot with any feedback or suggestions regarding the Service, you hereby assign to Med School Copilot all rights in such feedback and agree that Med School Copilot shall have the right to use such feedback in any manner it deems appropriate.</p>
              
              <h4>7.3 Restrictions</h4>
              <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service, except as follows:</p>
              <ul>
                <li>Your computer may temporarily store copies of such materials incidental to your accessing and viewing those materials.</li>
                <li>You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
                <li>You may print or download one copy of a reasonable number of pages of the Service for your own personal, non-commercial use and not for further reproduction, publication, or distribution.</li>
              </ul>
            </section>
            
            <section className="terms-section">
              <h3>8. Prohibited Uses</h3>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service in any way that violates any applicable federal, state, local, or international law or regulation.</li>
                <li>Use the Service to interfere with the application process or provide false information to academic institutions.</li>
                <li>Use the Service to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
                <li>Use any robot, spider, or other automatic device, process, or means to access the Service for any purpose, including monitoring or copying any of the material on the Service.</li>
                <li>Introduce any viruses, Trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful.</li>
                <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service.</li>
              </ul>
            </section>
            
            <section className="terms-section">
              <h3>9. Disclaimers</h3>
              <h4>9.1 No Admission Guarantee</h4>
              <p>Med School Copilot does not guarantee admission to any medical school or other educational institution. Our Service is designed to assist you in the application process, but admission decisions are made solely by the institutions to which you apply.</p>
              
              <h4>9.2 AI-Generated Content</h4>
              <p>Our Service uses artificial intelligence to generate content such as personal statements and essays. While we strive to provide high-quality, personalized assistance, you are responsible for reviewing and editing any AI-generated content before submitting it to educational institutions.</p>
              
              <h4>9.3 "As Is" and "As Available" Basis</h4>
              <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis, without any warranties of any kind, either express or implied, including but not limited to, the implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>
            </section>
            
            <section className="terms-section">
              <h3>10. Limitation of Liability</h3>
              <p>In no event shall Med School Copilot, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
              <ul>
                <li>Your access to or use of or inability to access or use the Service;</li>
                <li>Any conduct or content of any third party on the Service;</li>
                <li>Any content obtained from the Service; and</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.</li>
              </ul>
            </section>
            
            <section className="terms-section">
              <h3>11. Indemnification</h3>
              <p>You agree to defend, indemnify, and hold harmless Med School Copilot and its licensees and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from:</p>
              <ul>
                <li>Your use of and access to the Service;</li>
                <li>Your violation of any term of these Terms;</li>
                <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right; or</li>
                <li>Any claim that your User Content caused damage to a third party.</li>
              </ul>
            </section>
            
            <section className="terms-section">
              <h3>12. Term and Termination</h3>
              <h4>12.1 Term</h4>
              <p>These Terms shall remain in full force and effect while you use the Service or maintain an account with us.</p>
              
              <h4>12.2 Termination by You</h4>
              <p>You may terminate your account at any time by contacting us or using the account cancellation feature in the Service, if available.</p>
              
              <h4>12.3 Termination by Med School Copilot</h4>
              <p>Med School Copilot reserves the right to terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.</p>
              
              <h4>12.4 Effect of Termination</h4>
              <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service. All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
            </section>
            
            <section className="terms-section">
              <h3>13. Modifications to Terms</h3>
              <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
              <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.</p>
            </section>
            
            <section className="terms-section">
              <h3>14. Dispute Resolution</h3>
              <h4>14.1 Governing Law</h4>
              <p>These Terms shall be governed and construed in accordance with the laws of Washington, without regard to its conflict of law provisions.</p>
              
              <h4>14.2 Arbitration</h4>
              <p>Any dispute arising out of or relating to these Terms or the Service shall be finally settled by binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules, and judgment on the award rendered by the arbitrator(s) may be entered in any court having jurisdiction thereof.</p>
              
              <h4>14.3 Class Action Waiver</h4>
              <p>Any arbitration shall be conducted on an individual basis and not as a class, consolidated, or representative action. You and Med School Copilot agree that each may bring claims against the other only in your or its individual capacity and not as a plaintiff or class member in any purported class or representative proceeding.</p>
              
              <h4>14.4 Exceptions</h4>
              <p>Notwithstanding the foregoing, Med School Copilot may seek injunctive or other equitable relief to protect its intellectual property rights in any court of competent jurisdiction.</p>
            </section>
            
            <section className="terms-section">
              <h3>15. General Provisions</h3>
              <h4>15.1 Entire Agreement</h4>
              <p>These Terms constitute the entire agreement between you and Med School Copilot regarding the Service and supersede all prior and contemporaneous written or oral agreements.</p>
              
              <h4>15.2 Waiver</h4>
              <p>The failure of Med School Copilot to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
              
              <h4>15.3 Assignment</h4>
              <p>You may not assign or transfer these Terms, or any rights or obligations hereunder, without Med School Copilot's prior written consent. Med School Copilot may assign these Terms without restriction.</p>
              
              <h4>15.4 Contact Information</h4>
              <p>If you have any questions regarding these Terms, please contact us at:</p>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" size={16} />
                  <a href="mailto:support@medschoolcopilot.com">support@medschoolcopilot.com</a>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" size={16} />
                  <span>5413 Orca Dr NE Tacoma WA 98422, USA</span>
                </div>
              </div>
            </section>
            
            <section className="terms-section">
              <h3>16. Service Availability</h3>
              <p>Med School Copilot reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.</p>
            </section>
            
            <section className="terms-section">
              <h3>17. Children's Privacy</h3>
              <p>The Service is not intended for use by anyone under the age of 13. If you are under 13, please do not use or provide any information on the Service. We do not knowingly collect personally identifiable information from children under 13.</p>
            </section>
            
            <div className="terms-effective">
              <Shield size={18} className="terms-effective-icon" />
              <p>These Terms of Service are effective as of {currentDate}</p>
            </div>
          </div>
          
          <div className="terms-footer">
            <button 
              className="terms-button terms-back-button" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="terms-button terms-print-button"
              onClick={() => window.print()}
            >
              <FileText size={16} /> Print Terms
            </button>
          </div>
          
          <button 
            ref={topButtonRef}
            className="scroll-to-top-button" 
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;