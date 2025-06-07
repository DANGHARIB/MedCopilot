import React from 'react';
import { CalendarDays, Plus, Check, Clock } from 'lucide-react';
import './ApplicationTimelineSteps.css';

/**
 * ApplicationTimelineSteps Component
 * A modern, interactive timeline visualization for application milestones
 * 
 * @param {Array} steps - Array of step objects with id, name, date, color, and status properties
 * @param {Function} onAddDeadline - Handler for adding a personal deadline
 * @param {Function} onViewFullTimeline - Handler for viewing the full timeline
 */
const ApplicationTimelineSteps = ({ steps, onAddDeadline, onViewFullTimeline }) => {
  return (
    <div className="timeline-steps-card">
      <div className="timeline-steps-header">
        <div className="timeline-steps-title">
          <h3>My Application Timeline</h3>
          <span className="timeline-subtitle">Key milestones for your medical school application</span>
        </div>
        <div className="timeline-steps-actions">
          <button 
            className="btn btn-outline btn-sm"
            onClick={onAddDeadline}
          >
            <Plus size={16} />
            <span>Add Personal Deadline</span>
          </button>
        </div>
      </div>

      {/* Journey-style timeline visualization */}
      <div className="timeline-journey">
        <div className="timeline-path-container">
          <div className="timeline-path">
            {steps.map((step, index) => {
              // Calculate position based on index
              const positionClass = index % 2 === 0 
                ? 'timeline-step-position--top' 
                : 'timeline-step-position--bottom';
              
              return (
                <div 
                  key={step.id}
                  className={`timeline-step-position ${positionClass}`}
                  style={{ '--step-index': index }}
                >
                  <div className={`timeline-step-card ${step.status}`}>
                    <div className={`timeline-step-icon-wrapper ${step.color}`}>
                      {step.status === 'completed' ? (
                        <Check size={16} className="timeline-step-icon" />
                      ) : step.status === 'current' ? (
                        <Clock size={16} className="timeline-step-icon" />
                      ) : (
                        <span className="timeline-step-icon">{step.id}</span>
                      )}
                    </div>
                    <h3 className="timeline-step-title">{step.name}</h3>
                    <p className="timeline-step-date">{step.date}</p>
                  </div>
                  <div className="timeline-connector">
                    <div className={`timeline-step-number ${step.color}`}>
                      {step.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="timeline-steps-legend">
        <div className="legend-item">
          <div className="legend-marker completed">
            <Check size={12} />
          </div>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker current">
            <Clock size={12} />
          </div>
          <span>Current</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker upcoming"></div>
          <span>Upcoming</span>
        </div>
      </div>

      <div className="timeline-steps-footer">
        <button 
          className="btn btn-primary"
          onClick={onViewFullTimeline}
        >
          <CalendarDays size={16} />
          <span>View Full Timeline</span>
        </button>
      </div>
    </div>
  );
};

export default ApplicationTimelineSteps;