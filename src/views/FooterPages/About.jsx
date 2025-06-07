// src/pages/About/About.js ou chemin équivalent

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Book,
  Compass,
  MessageSquare,
  Flag,
  Scale,
  Users,
  Lightbulb,
  GraduationCap,
  Heart,
  ChevronRight
} from 'lucide-react';
import Layout from '../../components/Layout/Layout'; // Assurez-vous que le chemin est correct
import './About.css';

const About = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signUp', { state: { activeTab: 'signup' } });
    window.scrollTo(0, 0);
  };

  return (
    <Layout>
      <div className="about-page">
        {/* Header Section */}
        <div className="about-header">
          <div className="title-area">
            <h1 className="about-title">About Med <span className="highlight">School Copilot</span></h1>
            <p className="about-subtitle">Your trusted guide to medical school success.</p>
          </div>
        </div>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="section-container">
            <h2>Our Mission</h2>
            <p>
              At Med School Copilot, we empower every medical school applicant with the tools, guidance, and support they need to achieve their dream of becoming a doctor. We're your trusted guide to medical school success, providing personalized, AI-powered assistance for every step of your application journey.
            </p>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="who-we-are-section">
          <div className="section-container">
            <h2>Who We Are</h2>
            <p>
              Med School Copilot was founded by a team of medical education experts, admissions consultants, and technology innovators who recognized a common challenge: the medical school application process is complex, overwhelming, and often lacks accessible, personalized guidance for all applicants.
            </p>
            <p>
              We believe that potential shouldn't be limited by access to resources. Our comprehensive suite of AI tools democratizes access to high-quality application support, making expert-level guidance available to applicants from all backgrounds.
            </p>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="what-we-offer-section">
          <div className="section-container">
            <h2>What We Offer</h2>
            <p>
              Our platform provides end-to-end support for your medical school application journey:
            </p>

            <ul className="icon-list">
              <li>
                <div className="icon-wrapper">
                  <Book size={20} />
                </div>
                <div className="icon-content">
                  <span className="icon-title">Strategic Planning: </span>
                  Evaluate your readiness to apply and create personalized timelines
                </div>
              </li>
              <li>
                <div className="icon-wrapper">
                  <Compass size={20} />
                </div>
                <div className="icon-content">
                  <span className="icon-title">School Selection: </span>
                  Receive customized school recommendations based on your academic profile and preferences
                </div>
              </li>
              <li>
                <div className="icon-wrapper">
                  <MessageSquare size={20} />
                </div>
                <div className="icon-content">
                  <span className="icon-title">Application Development: </span>
                  Get assistance with personal statements, secondary essays, and interview preparation
                </div>
              </li>
              <li>
                <div className="icon-wrapper">
                  <Flag size={20} />
                </div>
                <div className="icon-content">
                  <span className="icon-title">Decision Support: </span>
                  Navigate admissions offers, negotiate financial aid, and plan your next steps
                </div>
              </li>
            </ul>

            <p>
              Each of our tools is designed to provide specific, actionable guidance tailored to your unique situation and goals.
            </p>
          </div>
        </section>

        {/* Access Section */}
        <section className="access-section">
          <div className="section-container">
            <h2>Democratizing Access to Admissions Support</h2>

            <div className="feature-item">
              <div className="flex items-start gap-4">
                <div className="icon-wrapper">
                  <Scale size={20} />
                </div>
                <div>
                  <h3>AMCAS and Ethical AI Use</h3>
                  <p>
                    The American Medical College Application Service (AMCAS) permits the ethical use of AI tools in the application process. Med School Copilot adheres to all ethical guidelines while helping you craft authentic, personalized application materials that genuinely reflect your experiences and aspirations.
                  </p>
                </div>
              </div>
            </div>

            <div className="feature-item">
              <div className="flex items-start gap-4">
                <div className="icon-wrapper">
                  <Users size={20} />
                </div>
                <div>
                  <h3>Leveling the Playing Field</h3>
                  <p>
                    Paying $10,000+ for private tutoring and admissions advising is insane, unfair, and simply not necessary in 2025. We believe in making high-quality admissions guidance accessible to all applicants, regardless of socioeconomic status. Our AI-powered platform provides premium-quality guidance at a fraction of the cost of traditional consulting services, helping to level the playing field and ensure that all qualified applicants have a fair shot at pursuing their medical career dreams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="our-approach-section">
          <div className="section-container">
            <h2>Our Approach</h2>
            <p>
              We combine the precision of artificial intelligence with the nuanced understanding of medical school admissions to deliver guidance that is:
            </p>

            <div className="card-grid">
              <div className="approach-card">
                <h3>Personalized</h3>
                <p>Our AI adapts to your specific background, strengths, and goals</p>
              </div>

              <div className="approach-card">
                <h3>Comprehensive</h3>
                <p>We support you through every stage of the application process</p>
              </div>

              <div className="approach-card">
                <h3>Data-Driven</h3>
                <p>Our recommendations are informed by up-to-date admissions statistics and trends</p>
              </div>

              <div className="approach-card">
                <h3>Accessible</h3>
                <p>We provide expert-level guidance at a fraction of the cost of traditional consulting</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="our-values-section">
          <div className="section-container">
            <h2>Our Values</h2>

            <ul className="icon-list">
              <li>
                <div className="icon-wrapper">
                  <Lightbulb size={20} />
                </div>
                <div className="icon-content">
                  <span className="icon-title">Empowerment: </span>
                  We give applicants the knowledge and tools to take control of their application journey
                </div>
              </li>
              <li>
                <div className="icon-wrapper">
                  <Users size={20} />
                </div>
                <div className="icon-content">
                  <span className="icon-title">Inclusivity: </span>
                  We welcome and support applicants from all backgrounds, with special attention to the needs of underrepresented and non-traditional applicants
                </div>
              </li>
              <li>
                <div className="icon-wrapper">
                  <GraduationCap size={20} />
                </div>
                <div className="icon-content">
                  <span className="icon-title">Innovation: </span>
                  We leverage cutting-edge AI technology to continually improve and expand our guidance
                </div>
              </li>
              <li>
                <div className="icon-wrapper">
                  <Heart size={20} />
                </div>
                <div className="icon-content">
                  <span className="icon-title">Integrity: </span>
                  We provide honest, ethical advice that prioritizes long-term success over quick fixes
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Difference Section */}
        <section className="difference-section">
          <div className="section-container">
            <h2>The Med School Copilot Difference</h2>
            <p>
              Traditional admissions consulting is expensive and often one-size-fits-all. Generic online resources can be overwhelming and lack personalization. Med School Copilot bridges this gap, offering the personalized attention of a dedicated advisor with the accessibility and comprehensive coverage of a digital platform.
            </p>
            <p>
              Our AI doesn't replace human expertise—it amplifies it, allowing us to deliver customized guidance at scale while maintaining the personal touch that makes great advising so valuable.
            </p>
          </div>
        </section>

        {/* Journey Section */}
        <section className="journey-section">
          <div className="section-container">
            <h2>Join Us on Your Journey to Medical School</h2>
            <p>
              Whether you're just beginning to explore medicine as a career or finalizing your application materials, Med School Copilot is here to guide you every step of the way. Let us help you navigate the path to medical school with confidence, clarity, and support.
            </p>
            <div className="quote">
              Your journey, guided.
            </div>
          </div>
        </section>

        {/* Call To Action Section */}
        <section className="cta-section">
          <div className="section-container">
            <div>
              <h2>Ready to Start Your Journey to Medical School?</h2>
              <p>
                Join Medschool Copilot today and gain the guidance, support, and tools you need to succeed.
              </p>
              <button
                className="cta-button"
                onClick={handleSignUp}
              >
                Sign Up Now <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;