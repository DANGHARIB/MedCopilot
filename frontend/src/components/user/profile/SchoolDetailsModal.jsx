import React, { useState, useRef, useEffect } from "react";
import {
  Trash2,
  ExternalLink,
  X
} from "lucide-react";
import "./SchoolDetailsModal.css";

/**
 * SchoolDetailsModal component for displaying detailed school information
 * This component was moved from MySchoolTab to be reusable across the application
 */
const SchoolDetailsModal = ({
  isOpen,
  school,
  onClose,
  onRemoveSchool
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const detailModalRef = useRef(null);

  // Fonction pour centrer le modal
  const centerModal = () => {
    if (!detailModalRef.current) return;

    const modalElement = detailModalRef.current;
    const modalRect = modalElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculer la position de scroll désirée pour centrer le modal
    const desiredScrollTop = window.scrollY + modalRect.top - (viewportHeight - modalRect.height) / 2;
    const finalScrollTop = Math.max(0, desiredScrollTop);

    // Effectuer le scroll de la fenêtre avec animation fluide
    window.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
  };

  // Gestionnaire pour fermer en cliquant sur l'overlay
  const overlayClickHandler = (e) => {
    if (detailModalRef.current && !detailModalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Gérer le centrage et le verrouillage du scroll quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      // Verrouiller le scroll du body
      document.body.style.overflow = 'hidden';
      
      // Centrer le modal avec un délai
      const timer = setTimeout(() => {
        centerModal();
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    } else {
      // Restaurer le scroll du body
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Gérer la fermeture avec la touche Échap
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Reset active tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
    }
  }, [isOpen]);

  // --- Helper InfoItem component ---
  const InfoItem = ({
    label,
    value,
    prefix = "",
    suffix = "",
    formatNumber = false,
    isLink = false,
    isBoolean = false,
  }) => {
    let displayValue = <span className="school-details-info-na">N/A</span>;
    if (isBoolean) {
      displayValue =
        value === true ? (
          "Yes"
        ) : value === false ? (
          "No"
        ) : (
          <span className="school-details-info-na">N/A</span>
        );
    } else if (value !== null && value !== undefined && value !== "") {
      if (isLink) {
        const url = String(value).startsWith("http")
          ? value
          : `https://${value}`;
        displayValue = (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="school-details-external-link"
          >
            {value}{" "}
            <ExternalLink
              size={12}
              style={{ marginLeft: "4px", verticalAlign: "middle" }}
              aria-hidden="true"
            />
          </a>
        );
      } else {
        displayValue = `${prefix}${
          formatNumber ? Number(value).toLocaleString() : value
        }${suffix}`;
      }
    }
    return (
      <div className="school-details-info-item">
        <span className="school-details-info-label">{label}</span>
        <span className="school-details-info-value">{displayValue}</span>
      </div>
    );
  };

  if (!isOpen || !school) return null;

  return (
    <div
      className="school-details-modal-overlay"
      onClick={overlayClickHandler}
    >
      <div
        ref={detailModalRef}
        className="school-details-modal-content school-details-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="school-details-modal-header">
          <div>
            <h3>{school.name}</h3>
            <p className="school-details-subtitle">
              {school.location || "N/A"}
            </p>
          </div>
          <div className="school-details-modal-header-actions">
            <button
              className="school-details-delete-button-modal"
              onClick={() => onRemoveSchool(school.id)}
              aria-label={`Remove ${school.name}`}
              type="button"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
            <button
              className="school-details-close-button"
              onClick={onClose}
              aria-label="Close school details"
              type="button"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="school-details-tabs">
          <div
            className="school-details-tabs-list"
            role="tablist"
            aria-label="School details sections"
          >
            <button
              className={`school-details-tab-button ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveTab("overview")}
              role="tab"
              aria-selected={activeTab === "overview"}
              aria-controls="tabpanel-overview"
              id="tab-overview"
              type="button"
            >
              Overview
            </button>
            <button
              className={`school-details-tab-button ${
                activeTab === "admissions" ? "active" : ""
              }`}
              onClick={() => setActiveTab("admissions")}
              role="tab"
              aria-selected={activeTab === "admissions"}
              aria-controls="tabpanel-admissions"
              id="tab-admissions"
              type="button"
            >
              Admissions
            </button>
            <button
              className={`school-details-tab-button ${
                activeTab === "curriculum" ? "active" : ""
              }`}
              onClick={() => setActiveTab("curriculum")}
              role="tab"
              aria-selected={activeTab === "curriculum"}
              aria-controls="tabpanel-curriculum"
              id="tab-curriculum"
              type="button"
            >
              Curriculum
            </button>
          </div>
          {/* Tab Content */}
          <div className="school-details-tab-content">
            {activeTab === "overview" && (
              <div
                className="school-details-tab-panel"
                id="tabpanel-overview"
                role="tabpanel"
                aria-labelledby="tab-overview"
                tabIndex={0}
              >
                <div className="school-details-stats-grid">
                  <div className="school-details-stat-card">
                    <span className="school-details-stat-card-label">
                      Rank
                    </span>
                    <span className="school-details-stat-card-value">
                      {school.rank || (
                        <span className="school-details-info-na">N/A</span>
                      )}
                    </span>
                  </div>
                  <div className="school-details-stat-card">
                    <span className="school-details-stat-card-label">
                      Acceptance
                    </span>
                    <span className="school-details-stat-card-value">
                      {school.acceptanceRate ? (
                        `${school.acceptanceRate}%`
                      ) : (
                        <span className="school-details-info-na">N/A</span>
                      )}
                    </span>
                  </div>
                  <div className="school-details-stat-card">
                    <span className="school-details-stat-card-label">
                      Avg. GPA
                    </span>
                    <span className="school-details-stat-card-value">
                      {school.avgGPA || (
                        <span className="school-details-info-na">N/A</span>
                      )}
                    </span>
                  </div>
                  <div className="school-details-stat-card">
                    <span className="school-details-stat-card-label">
                      Avg. MCAT
                    </span>
                    <span className="school-details-stat-card-value">
                      {school.avgMCAT || (
                        <span className="school-details-info-na">N/A</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="school-details-info-section">
                  <h4 className="school-details-info-section-title">
                    General Information
                  </h4>
                  <div className="school-details-info-grid">
                    <InfoItem
                      label="Class Size"
                      value={school.classSize}
                      formatNumber={true}
                    />
                    <InfoItem
                      label="Mission Focus"
                      value={school.missionFocus}
                    />
                    <InfoItem
                      label="Annual Tuition (In-State)"
                      value={school.annualTuitionInState}
                      prefix="$"
                      formatNumber={true}
                    />
                    <InfoItem
                      label="Annual Tuition (Out-of-State)"
                      value={school.annualTuitionOutOfState}
                      prefix="$"
                      formatNumber={true}
                    />
                    <InfoItem
                      label="Official Website"
                      value={school.officialURL}
                      isLink={true}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "admissions" && (
              <div
                className="school-details-tab-panel"
                id="tabpanel-admissions"
                role="tabpanel"
                aria-labelledby="tab-admissions"
                tabIndex={0}
              >
                <div className="school-details-info-section">
                  <h4 className="school-details-info-section-title">
                    Admission Requirements & Deadlines
                  </h4>
                  <div className="school-details-info-grid">
                    <InfoItem
                      label="Primary App Deadline"
                      value={school.primaryDeadline}
                    />
                    <InfoItem
                      label="Secondary App Deadline"
                      value={school.secondaryDeadline}
                    />
                    <InfoItem
                      label="Requires CASPer"
                      value={school.casperRequired}
                      isBoolean={true}
                    />
                    <InfoItem
                      label="Requires AAMC PREview"
                      value={school.aamcPreviewRequired}
                      isBoolean={true}
                    />
                    <InfoItem
                      label="Interview Format"
                      value={school.interviewFormat}
                    />
                    <InfoItem
                      label="Letters of Recommendation"
                      value={school.lettersOfRecommendation}
                    />
                    <InfoItem
                      label="Accepts Out-of-State"
                      value={school.acceptsOutOfState}
                      isBoolean={true}
                    />
                    <InfoItem
                      label="Accepts International"
                      value={school.acceptsInternational}
                      isBoolean={true}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "curriculum" && (
              <div
                className="school-details-tab-panel"
                id="tabpanel-curriculum"
                role="tabpanel"
                aria-labelledby="tab-curriculum"
                tabIndex={0}
              >
                <div className="school-details-info-section">
                  <h4 className="school-details-info-section-title">
                    Academic Programs & Features
                  </h4>
                  <div className="school-details-info-grid">
                    <InfoItem
                      label="Curriculum Structure"
                      value={school.curriculumFeatures}
                    />
                    <InfoItem
                      label="Research Opportunities"
                      value={school.researchOpportunities}
                    />
                    <InfoItem
                      label="Dual Degrees Offered"
                      value={school.dualDegreesOffered}
                    />
                    <InfoItem
                      label="Clinical Rotations Info"
                      value={school.clinicalRotationsInfo}
                    />
                    <InfoItem
                      label="Global Health Opportunities"
                      value={school.globalHealthOpportunities}
                    />
                    <InfoItem
                      label="Financial Aid Highlights"
                      value={school.financialAidHighlights}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="school-details-modal-footer">
          <button
            onClick={onClose}
            className="school-details-close-details-button"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetailsModal; 