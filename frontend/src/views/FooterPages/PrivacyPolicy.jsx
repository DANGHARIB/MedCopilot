import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  ArrowUp, 
  Shield, 
  Mail, 
  MapPin, 
  Lock, 
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
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
      <div className="privacy-page">
        <div className="privacy-container">
          <div className="privacy-header">
            <div className="privacy-header-icon">
              <Shield size={24} />
            </div>
            <div className="privacy-header-content">
              <h1>Privacy Policy</h1>
              <p className="privacy-header-description">
                How we collect, use, and protect your information
              </p>
            </div>
          </div>
          
          <div className="privacy-meta">
            <div className="privacy-meta-item">
              <span className="privacy-meta-label">Last Updated:</span>
              <span className="privacy-meta-value">{currentDate}</span>
            </div>
            <div className="privacy-meta-item">
              <span className="privacy-meta-label">Effective:</span>
              <span className="privacy-meta-value">Immediately</span>
            </div>
          </div>
          
          <div className="privacy-content" ref={contentRef}>
            <div className="privacy-notice">
              <AlertCircle size={20} />
              <p>Please read this Privacy Policy carefully. By using our Service, you acknowledge that you have read and understood these practices.</p>
            </div>
            
            <h2>Privacy Policy for Med School Copilot</h2>
            
            <section className="privacy-section">
              <h3>1. Introduction</h3>
              <p>Med School Copilot ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered medical school application assistance platform ("Service").</p>
              <p>Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that you have read, understood, and agree to the practices described in this policy. If you do not agree with our policies and practices, please do not use our Service.</p>
            </section>
            
            <section className="privacy-section">
              <h3>2. Information We Collect</h3>
              <p>We collect several types of information from users of our Service:</p>
              
              <h4>2.1 Personal Information</h4>
              <p>Personal information is data that can be used to identify you individually. We may collect the following personal information:</p>
              <ul>
                <li><strong>Account Information</strong>: Name, email address, phone number, password, and other information provided during account creation</li>
                <li><strong>Academic Information</strong>: GPA, MCAT scores, undergraduate institution, major, and courses taken</li>
                <li><strong>Demographic Information</strong>: Age, gender, state of residence, country of citizenship, and other demographic details you choose to provide</li>
                <li><strong>Application Materials</strong>: Personal statements, secondary essays, work experience, extracurricular activities, and other application-related content you create or upload</li>
                <li><strong>Financial Information</strong>: Payment method details processed by our third-party payment processor (Stripe)</li>
              </ul>
              
              <h4>2.2 Non-Personal Information</h4>
              <p>We may also collect non-personal information about you, including:</p>
              <ul>
                <li><strong>Usage Data</strong>: Information about how you use our Service, including features viewed, time spent on pages, navigation paths, and tool interaction</li>
                <li><strong>Device Information</strong>: Information about your device, operating system, browser type, IP address, and other technical details</li>
                <li><strong>Cookies and Similar Technologies</strong>: Information collected through cookies, web beacons, and similar technologies as described in our Cookies Policy section</li>
              </ul>
            </section>
            
            <section className="privacy-section">
              <h3>3. How We Collect Your Information</h3>
              <p>We collect information from you in the following ways:</p>
              
              <div className="info-cards">
                <div className="info-card">
                  <h4>3.1 Direct Collection</h4>
                  <ul>
                    <li>When you create an account or profile</li>
                    <li>When you input academic, demographic, or application-related information</li>
                    <li>When you directly communicate with us via email, chat, or other channels</li>
                    <li>When you respond to surveys or feedback requests</li>
                    <li>When you submit payment information for subscription services</li>
                  </ul>
                </div>
                
                <div className="info-card">
                  <h4>3.2 Automated Collection</h4>
                  <ul>
                    <li>Through cookies and similar tracking technologies</li>
                    <li>Through our servers when you access and use our Service</li>
                    <li>From your device or browser</li>
                  </ul>
                </div>
                
                <div className="info-card">
                  <h4>3.3 Third-Party Sources</h4>
                  <ul>
                    <li>Information from educational databases (with your permission)</li>
                    <li>Information from payment processors regarding transaction status</li>
                    <li>Information from analytics providers and advertising partners</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <section className="privacy-section">
              <h3>4. How We Use Your Information</h3>
              <p>We use your information for the following purposes:</p>
              
              <h4>4.1 Providing and Improving our Service</h4>
              <ul>
                <li>To create and maintain your account</li>
                <li>To provide personalized application assistance and recommendations</li>
                <li>To generate AI-powered content based on your inputs</li>
                <li>To analyze and improve our Service's features and functionality</li>
                <li>To develop new products, services, and features</li>
              </ul>
              
              <h4>4.2 Communication and Support</h4>
              <ul>
                <li>To respond to your requests and support inquiries</li>
                <li>To send administrative notices and service updates</li>
                <li>To provide information about features, products, or services that may interest you</li>
                <li>To facilitate communication between you and our team</li>
              </ul>
              
              <h4>4.3 Research and Analysis</h4>
              <ul>
                <li>To analyze usage patterns and trends</li>
                <li>To evaluate the effectiveness of our Service</li>
                <li>To develop and improve our AI algorithms</li>
                <li>To create aggregated and anonymized data for research purposes</li>
              </ul>
              
              <h4>4.4 Legal and Security Purposes</h4>
              <ul>
                <li>To verify your identity and prevent fraud</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>To comply with applicable laws, regulations, and legal processes</li>
                <li>To enforce our Terms of Service and other agreements</li>
              </ul>
            </section>
            
            <section className="privacy-section">
              <h3>5. How We Share Your Information</h3>
              <p>We may share your information with the following parties:</p>
              
              <h4>5.1 Service Providers</h4>
              <p>We may share your information with third-party vendors, service providers, and contractors who perform services on our behalf, such as:</p>
              <ul>
                <li>Payment processors (e.g., Stripe)</li>
                <li>Cloud hosting providers</li>
                <li>Analytics services</li>
                <li>Customer support services</li>
                <li>Email and communication services</li>
              </ul>
              
              <h4>5.2 With Your Consent</h4>
              <p>We may share your information when you direct us to do so or when you provide explicit consent for specific information sharing.</p>
              
              <h4>5.3 Legal Requirements</h4>
              <p>We may disclose your information if required by law or in response to valid requests by public authorities (e.g., a court or government agency).</p>
              
              <h4>5.4 Business Transfers</h4>
              <p>If we are involved in a merger, acquisition, financing, or sale of all or a portion of our business or assets, your information may be transferred as part of that transaction.</p>
              
              <h4>5.5 Aggregated or Anonymized Information</h4>
              <p>We may share aggregated or anonymized information (data that cannot reasonably be used to identify you) with third parties for research, marketing, analytics, and other purposes.</p>
            </section>
            
            <section className="privacy-section">
              <h3>6. Data Retention</h3>
              <p>We will retain your personal information only for as long as reasonably necessary to fulfill the purposes for which it was collected, including to satisfy any legal, regulatory, tax, accounting, or reporting requirements.</p>
              
              <div className="info-cards">
                <div className="info-card">
                  <h4>6.1 Account Information</h4>
                  <p>We will retain your account information for as long as your account remains active. If you request deletion of your account, we will delete or anonymize your personal information, except where we need to retain certain information for legitimate business or legal purposes.</p>
                </div>
                
                <div className="info-card">
                  <h4>6.2 Application Materials</h4>
                  <p>Application materials (e.g., personal statements, essays) will be retained for the duration of your subscription plus a reasonable period thereafter to allow for reactivation. You may request deletion of specific application materials at any time.</p>
                </div>
                
                <div className="info-card">
                  <h4>6.3 Anonymized Data</h4>
                  <p>We may retain anonymized and aggregated data indefinitely for analytics and service improvement purposes.</p>
                </div>
              </div>
            </section>
            
            <section className="privacy-section">
              <h3>7. Your Rights and Choices</h3>
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              
              <div className="your-rights">
                <div className="rights-item">
                  <h4>7.1 Access and Update</h4>
                  <p>You can access and update certain personal information directly through your account settings. For information you cannot access or update through your account, please contact us.</p>
                </div>
                
                <div className="rights-item">
                  <h4>7.2 Data Portability</h4>
                  <p>You may request a copy of your personal information in a structured, commonly used, and machine-readable format.</p>
                </div>
                
                <div className="rights-item">
                  <h4>7.3 Deletion</h4>
                  <p>You may request deletion of your personal information, subject to certain exceptions provided by law.</p>
                </div>
                
                <div className="rights-item">
                  <h4>7.4 Restriction of Processing</h4>
                  <p>You may request that we restrict the processing of your personal information in certain circumstances.</p>
                </div>
                
                <div className="rights-item">
                  <h4>7.5 Objection to Processing</h4>
                  <p>You may object to our processing of your personal information based on our legitimate interests.</p>
                </div>
                
                <div className="rights-item">
                  <h4>7.6 Withdrawal of Consent</h4>
                  <p>Where we rely on your consent to process your personal information, you have the right to withdraw your consent at any time.</p>
                </div>
              </div>
              
              <h4>7.7 California Privacy Rights</h4>
              <p>If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), including rights to know, delete, correct, and opt out of the sale or sharing of your personal information.</p>
              
              <h4>7.8 Exercising Your Rights</h4>
              <p>To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below. We may request specific information to help us verify your identity and process your request.</p>
            </section>
            
            <section className="privacy-section">
              <h3>8. Data Security</h3>
              <div className="security-highlight">
                <Lock size={24} className="security-icon" />
                <div>
                  <p>We have implemented appropriate technical and organizational measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.</p>
                </div>
              </div>
              
              <h4>8.1 Security Measures</h4>
              <p>Our security measures include:</p>
              <ul>
                <li>Encryption of sensitive information</li>
                <li>Secure storage of personal data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Security training for our staff</li>
              </ul>
              
              <h4>8.2 Third-Party Service Providers</h4>
              <p>We require all third parties that process personal information on our behalf to implement appropriate security measures to protect your information.</p>
              
              <h4>8.3 Data Breach Notification</h4>
              <p>In the event of a data breach compromising your personal information, we will notify you and relevant authorities as required by applicable law.</p>
            </section>
            
            <section className="privacy-section">
              <h3>9. Cookies and Similar Technologies</h3>
              <p>Our Service uses cookies and similar tracking technologies to enhance your experience, analyze usage, and assist in our marketing efforts.</p>
              
              <h4>9.1 Types of Cookies We Use</h4>
              <div className="cookie-types">
                <div className="cookie-type">
                  <span className="cookie-label">Essential Cookies</span>
                  <span className="cookie-description">Necessary for the Service to function properly</span>
                </div>
                <div className="cookie-type">
                  <span className="cookie-label">Functional Cookies</span>
                  <span className="cookie-description">Help us recognize and remember your preferences</span>
                </div>
                <div className="cookie-type">
                  <span className="cookie-label">Analytics Cookies</span>
                  <span className="cookie-description">Allow us to analyze how users interact with our Service</span>
                </div>
                <div className="cookie-type">
                  <span className="cookie-label">Marketing Cookies</span>
                  <span className="cookie-description">Track your activity across websites to deliver targeted advertisements</span>
                </div>
              </div>
              
              <h4>9.2 Your Cookie Choices</h4>
              <p>Most web browsers allow you to control cookies through their settings. However, if you decline cookies, some features of our Service may not function properly.</p>
            </section>
            
            <section className="privacy-section">
              <h3>10. International Data Transfers</h3>
              <p>We may transfer, store, and process your information in countries other than your own. By using our Service, you consent to the transfer of your information to countries that may have different data protection rules than those of your country.</p>
              
              <h4>10.1 Data Transfer Mechanisms</h4>
              <p>When we transfer personal information outside your jurisdiction, we use appropriate safeguards such as:</p>
              <ul>
                <li>Standard contractual clauses approved by relevant data protection authorities</li>
                <li>Binding corporate rules</li>
                <li>Adequacy decisions where applicable</li>
              </ul>
            </section>
            
            <section className="privacy-section">
              <h3>11. Children's Privacy</h3>
              <p>Our Service is not intended for individuals under the age of 13 (or applicable age of consent in your jurisdiction). We do not knowingly collect personal information from children.</p>
              <p>If we learn that we have collected personal information from a child without parental consent, we will promptly delete that information. If you believe we might have information from or about a child, please contact us.</p>
            </section>
            
            <section className="privacy-section">
              <h3>12. Changes to This Privacy Policy</h3>
              <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.</p>
              <p>If we make material changes to this Privacy Policy, we will notify you by email or through a notice on our Service before the changes take effect.</p>
            </section>
            
            <section className="privacy-section">
              <h3>13. Third-Party Links and Services</h3>
              <p>Our Service may contain links to third-party websites, services, or applications that are not owned or controlled by Med School Copilot. We are not responsible for the privacy practices of these third parties. We encourage you to be aware when you leave our Service and to read the privacy policies of each website you visit.</p>
            </section>
            
            <section className="privacy-section">
              <h3>14. Do Not Track Signals</h3>
              <p>Some browsers have a "Do Not Track" feature that signals to websites you visit that you do not want your online activity tracked. Due to the lack of a common understanding of DNT signals, our Service does not currently respond to DNT signals.</p>
            </section>
            
            <section className="privacy-section">
              <h3>15. Contact Us</h3>
              <p>If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:</p>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" size={16} />
                  <a href="mailto:privacy@medschoolcopilot.com">privacy@medschoolcopilot.com</a>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" size={16} />
                  <span>5413 Orca Dr NE Tacoma WA 98422, USA</span>
                </div>
              </div>
            </section>
            
            <section className="privacy-section">
              <h3>16. Additional Information for Specific Jurisdictions</h3>
              
              <h4>16.1 European Economic Area (EEA), United Kingdom, and Switzerland</h4>
              <p>If you are located in the EEA, UK, or Switzerland, the following additional provisions apply:</p>
              <ul>
                <li>The legal basis for processing your personal information</li>
                <li>Information about your data protection rights under GDPR</li>
                <li>Details about our data protection officer</li>
                <li>Information about your right to lodge a complaint with a supervisory authority</li>
              </ul>
              
              <h4>16.2 California Residents</h4>
              <p>If you are a California resident, please refer to our California Privacy Notice for additional information about your rights under California law.</p>
            </section>
            
            <div className="privacy-effective">
              <Shield size={18} className="privacy-effective-icon" />
              <p>This Privacy Policy is effective as of {currentDate}</p>
            </div>
          </div>
          
          <div className="privacy-footer">
            <button 
              className="privacy-button privacy-back-button" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="privacy-button privacy-print-button"
              onClick={() => window.print()}
            >
              <FileText size={16} /> Print Policy
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

export default PrivacyPolicy;