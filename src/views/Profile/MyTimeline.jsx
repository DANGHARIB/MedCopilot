import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, AlertCircle, Eye } from "lucide-react";
import "./MyTimeline.css";
import ApplicationTimelineResources from "../../components/Timeline/ApplicationTimelineResources"; 
// Composant pour afficher une date importante
const DateCard = ({ title, date, variant, icon }) => {
  const IconComponent = icon;
  return (
    <div className={`my-timeline-date-item ${variant}`}>
      <div className="my-timeline-date-icon">
        <IconComponent size={18} />
      </div>
      <div className="my-timeline-date-content">
        <h4 className="my-timeline-date-title">{title}</h4>
        <p className="my-timeline-date-text">{date}</p>
      </div>
    </div>
  );
};

const MyTimeline = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  // Ajout des données pour ApplicationTimelineResources
  const selectedYear = '2025';
  const timelineData = {
    '2025': {
      viewing: "May 1, 2025",
      submission: "May 27, 2025, 9:30 AM EST",
      lastMCAT: "May 23, 2025",
      verification: "June 27, 2025, 7:00 AM EST",
      secondaries: "July 2025",
      edp: "August 1, 2025",
      interviews: "Mid-August 2025",
      deadlines: "September-December 2025",
      acceptances: "Mid-October 2025"
    }
  };

  return (
    <div className="my-school-container">
      {/* Header */}
      <div className="my-school-header">
        <h2 className="my-school-title">
          My <span className="my-school-title-highlight">Timeline</span>
        </h2>
        <button
          className="my-school-add-button"
          onClick={() => navigate("/application-timeline")}
        >
          <Eye size={16} />
          <span>View Full Timeline</span>
        </button>
      </div>

      <div className="my-school-card">
        {/* Info Banner */}
        <div className="my-school-item">
          <div className="my-school-item-header">
            <div className="my-school-info">
              <h3 className="my-school-title-text">Important Dates</h3>
            </div>
          </div>
          <div className="my-school-item-content">
            <div className="my-timeline-info-banner">
              <p>
                Track important AMCAS application deadlines and sync them with
                your calendar.
              </p>
            </div>

            <div className="my-timeline-dates-container">
              <DateCard
                title="AMCAS Opens"
                date={`May 1, ${currentYear}`}
                variant="primary"
                icon={Calendar}
              />

              <DateCard
                title="Submission Begins"
                date={`June 1, ${currentYear}`}
                variant="warning"
                icon={Clock}
              />

              <DateCard
                title="Final Deadline"
                date={`October 1, ${currentYear}`}
                variant="danger"
                icon={AlertCircle}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Ajout du composant ApplicationTimelineResources */}
      <div className="my-timeline-resources">
        <ApplicationTimelineResources 
          timelineData={timelineData} 
          selectedYear={selectedYear} 
        />
      </div>
    </div>
  );
};

export default MyTimeline;