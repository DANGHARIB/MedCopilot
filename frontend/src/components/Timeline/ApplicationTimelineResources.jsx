import React, { useState } from 'react';
import {
  CalendarDays,
  BookOpen,
  CheckSquare,
  Layers,
  FileText
} from 'lucide-react';
import './ApplicationTimelineResources.css';

// Icons as React Components
const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

const CheckSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 11 3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

// Badge Component
const Badge = ({ children, variant }) => {
  return (
    <span className={`badge ${variant}`}>
      {children}
    </span>
  );
};

const ApplicationTimelineResources = ({ timelineData, selectedYear }) => {
  const [activeTab, setActiveTab] = useState('official-dates');

  return (
    <div className="resources-section">
      {/* Header modifié pour utiliser la même structure que dans ApplicationTimeline */}
      <div className="section-header resources">
        <div className="section-header-icon">
          <FileText size={20} />
        </div>
        <div className="section-header-text">
          <h2>Application Resources</h2>
          <p>Essential information and guidance for your medical school application</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="resources-tabs">
        <button 
          className={`tab-button ${activeTab === 'official-dates' ? 'active' : ''}`}
          onClick={() => setActiveTab('official-dates')}
        >
          <CalendarDays size={18} />
          <span>Official Dates</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'strategic-timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('strategic-timeline')}
        >
          <GraduationCapIcon />
          <span>Strategic Timeline</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'submission-strategy' ? 'active' : ''}`}
          onClick={() => setActiveTab('submission-strategy')}
        >
          <CheckSquareIcon />
          <span>Submission Strategy</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'process-phases' ? 'active' : ''}`}
          onClick={() => setActiveTab('process-phases')}
        >
          <Layers size={18} />
          <span>Process Phases</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="resources-tab-content">
        {/* Official AMCAS Dates */}
        {activeTab === 'official-dates' && (
          <div className="tab-pane">
            <div className="resource-card">
              <div className="resource-card-header">
                <h3 className="resource-title">
                  <CalendarDays size={18} />
                  Official AMCAS Application Dates for {selectedYear}-{Number(selectedYear) + 1}
                </h3>
                <p className="resource-description">
                  Key deadlines you need to meet for your medical school application
                </p>
              </div>
              <div className="resource-card-content">
                <ul className="deadline-list">
                  <li className="deadline-item">
                    <Badge variant="blue">May 1</Badge>
                    <div className="deadline-details">
                      <p className="deadline-title">AMCAS application opens for viewing and data entry</p>
                      <p className="deadline-desc">Begin filling out application components</p>
                    </div>
                  </li>
                  <li className="deadline-item">
                    <Badge variant="blue">
                      {timelineData[selectedYear].submission.split(',')[0]}
                    </Badge>
                    <div className="deadline-details">
                      <p className="deadline-title">First day to submit AMCAS applications</p>
                      <p className="deadline-desc">{timelineData[selectedYear].submission.split(',')[1]}</p>
                    </div>
                  </li>
                  <li className="deadline-item">
                    <Badge variant="blue">
                      {timelineData[selectedYear].lastMCAT}
                    </Badge>
                    <div className="deadline-details">
                      <p className="deadline-title">Last recommended date to take the MCAT</p>
                      <p className="deadline-desc">Taking the MCAT after this date may delay your application</p>
                    </div>
                  </li>
                  <li className="deadline-item">
                    <Badge variant="blue">
                      {timelineData[selectedYear].verification.split(',')[0]}
                    </Badge>
                    <div className="deadline-details">
                      <p className="deadline-title">First date verified applications are transmitted to medical schools</p>
                      <p className="deadline-desc">{timelineData[selectedYear].verification.split(',')[1]}</p>
                    </div>
                  </li>
                  <li className="deadline-item">
                    <Badge variant="blue">
                      {timelineData[selectedYear].secondaries}
                    </Badge>
                    <div className="deadline-details">
                      <p className="deadline-title">Secondary applications begin arriving from schools</p>
                      <p className="deadline-desc">Complete these promptly, ideally within 1-2 weeks</p>
                    </div>
                  </li>
                  <li className="deadline-item">
                    <Badge variant="blue">
                      {timelineData[selectedYear].edp}
                    </Badge>
                    <div className="deadline-details">
                      <p className="deadline-title">AMCAS Early Decision Program (EDP) deadline</p>
                      <p className="deadline-desc">For applicants applying through the Early Decision Program</p>
                    </div>
                  </li>
                  <li className="deadline-item">
                    <Badge variant="blue">
                      {timelineData[selectedYear].interviews}
                    </Badge>
                    <div className="deadline-details">
                      <p className="deadline-title">Interviews begin at many schools</p>
                      <p className="deadline-desc">Prepare for interviews as schools begin extending invitations</p>
                    </div>
                  </li>
                  <li className="deadline-item">
                    <Badge variant="blue">
                      {timelineData[selectedYear].deadlines}
                    </Badge>
                    <div className="deadline-details">
                      <p className="deadline-title">Individual medical school application deadlines</p>
                      <p className="deadline-desc">Varies by school, check each school's specific requirements</p>
                    </div>
                  </li>
                  <li className="deadline-item">
                    <Badge variant="blue">
                      {timelineData[selectedYear].acceptances}
                    </Badge>
                    <div className="deadline-details">
                      <p className="deadline-title">Medical schools begin sending acceptance letters</p>
                      <p className="deadline-desc">First wave of acceptances start going out</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Strategic Pre-Application Timeline */}
        {activeTab === 'strategic-timeline' && (
          <div className="tab-pane">
            <div className="resource-card">
              <div className="resource-card-header">
                <h3 className="resource-title">
                  <GraduationCapIcon />
                  Strategic Pre-Application Timeline
                </h3>
                <p className="resource-description">
                  12-18 months before submission: January-April {selectedYear}
                </p>
              </div>
              <div className="resource-card-content">
                <div className="strategic-timeline">
                  <div className="strategic-phase">
                    <h3>Early Preparation Phase (January-April {selectedYear})</h3>
                    <ul className="preparation-list">
                      <li>Register with your school's pre-health advising committee (if available)</li>
                      <li>Request and obtain recommendation letters</li>
                      <li>Take your final MCAT (ideally by April {selectedYear} for optimal application timing)</li>
                      <li>Determine if you need to take the AAMC PREview exam and register for it</li>
                      <li>Consult the Medical School Admission Requirements (MSAR) to confirm each school's specific requirements</li>
                    </ul>
                    <div className="expert-quote amber">
                      <p>
                        "Unless you plan to take additional time to prepare, you should begin preparing your med school applications during the spring before your intended application cycle year (before May of your application cycle year)."
                      </p>
                    </div>
                  </div>

                  <div className="strategic-phase">
                    <h3>Application Preparation Phase (May {selectedYear})</h3>
                    <ul className="preparation-list">
                      <li>Complete AMCAS demographic and academics sections</li>
                      <li>Release MCAT scores to application systems</li>
                      <li>Remind recommendation letter writers to submit their letters if they haven't already</li>
                      <li><strong>Finalize your personal statement and Work and Activities section by May 15</strong></li>
                      <li>Order official transcripts from every college/university attended</li>
                      <li>Register for the Casper Test if required by your target schools</li>
                      <li>Begin pre-writing secondary application essays immediately after finalizing your primary application</li>
                      <li>Finalize your school list</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimal Submission Strategy */}
        {activeTab === 'submission-strategy' && (
          <div className="tab-pane">
            <div className="resource-card">
              <div className="resource-card-header">
                <h3 className="resource-title">
                  <CheckSquareIcon />
                  Optimal Submission Strategy
                </h3>
                <p className="resource-description">
                  Expert recommendations for maximizing your application success
                </p>
              </div>
              <div className="resource-card-content">
                <div className="expert-quote blue">
                  <p>
                    "Applying early is one of the most important medical school admission strategies."
                  </p>
                </div>
                
                <h3 className="strategy-title">A strategic submission approach includes:</h3>
                <ul className="strategy-list">
                  <li>Submit your primary AMCAS application as early as possible in June {selectedYear}</li>
                  <li>Aim to be among the first applicants whose materials are transmitted to schools on {timelineData[selectedYear].verification.split(',')[0]}</li>
                  <li>Ensure all transcripts are requested at least two weeks before your targeted submission date</li>
                </ul>
                
                <div className="expert-quote blue">
                  <p>
                    "The earlier you get your primary application in, the earlier your prospective schools will send the secondary applications for you to fill out, and the earlier you can send those in."
                  </p>
                </div>
                
                <div className="expert-quote amber">
                  <p>
                    "Never submit less than your best work just to get things in 'early'. Quality always trumps speed."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Process Phases */}
        {activeTab === 'process-phases' && (
          <div className="tab-pane">
            <div className="resource-card">
              <div className="resource-card-header">
                <h3 className="resource-title">
                  <Layers size={18} />
                  Application Process Phases
                </h3>
                <p className="resource-description">
                  Timeline breakdown by phase of the application process
                </p>
              </div>
              <div className="resource-card-content">
                <div className="process-phases">
                  {/* Secondary Application and Interview Phase */}
                  <div className="phase-section">
                    <h3>Secondary Application and Interview Phase</h3>
                    <p>After your primary application is verified:</p>
                    <ul className="phase-list">
                      <li>Expect secondary applications to arrive 2-4 weeks after submission of your primary application</li>
                      <li>Complete and return secondary applications within 7-14 days of receipt</li>
                      <li>Prepare for interviews that typically begin in mid-August</li>
                      <li>Continue checking application portals and email regularly for updates</li>
                    </ul>
                  </div>
                  
                  {/* Post-Interview Timeline */}
                  <div className="phase-section">
                    <h3>Post-Interview Timeline</h3>
                    <p>From September {selectedYear} through May {Number(selectedYear) + 1}, be prepared to:</p>
                    <ul className="phase-list">
                      <li>Send letters of interest/intent when appropriate</li>
                      <li>Review admission and financial aid offers</li>
                      <li>Attend second look and admit weekend activities</li>
                      <li>Make your final school selection, typically by April 30, {Number(selectedYear) + 1}</li>
                    </ul>
                  </div>
                  
                  {/* Conclusion */}
                  <div className="expert-advice">
                    <h3>Expert Advice</h3>
                    <p>
                      The medical school application process follows a structured timeline with specific deadlines. Admissions experts strongly recommend early preparation and submission to take advantage of rolling admissions. Beginning preparation at least a year in advance, finalizing application materials before the submission period opens, submitting the primary application as early as possible in June, and promptly completing secondary applications positions applicants optimally for success in the competitive medical school admissions process.
                    </p>
                    <p>
                      Remember that while timing is crucial, the quality of your application should never be sacrificed for speed. A thoughtfully prepared application submitted at a strategic time provides the best chance for acceptance to medical school.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTimelineResources;