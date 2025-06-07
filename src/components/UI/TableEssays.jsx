import React from "react";
import {
  FileText,
  Edit3,
  BookText,
  Eye,
  Clock,
  CheckCircle2,
  Trash2,
  Info,
} from "lucide-react";
import "./TableEssays.css";

/**
 * TableEssays - A specialized table component for displaying essay configurations
 * with modern design and optimized layout for essay-specific content
 */
const TableEssays = ({
  essays = [],
  onGenerateEssay,
  onEditEssay,
  onDeleteEssay,
  onViewEssay,
  isLoading = false,
  emptyMessage = "No essays configured",
}) => {
  // Format word or character limit with appropriate unit
  const formatLimit = (essay) => {
    if (!essay) return "N/A";

    if (essay.limitType === "words") {
      return `${essay.wordLimit} words`;
    } else {
      return `${essay.characterLimit || essay.wordLimit * 5} characters`;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Handle row click to view essay details
  const handleRowClick = (essay, event) => {
    // Si on clique sur un bouton d'action, ne pas rediriger
    if (event.target.closest(".essay-action-btn")) {
      return;
    }

    if (essay.isGenerated && onViewEssay) {
      onViewEssay(essay);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="table-essays-container">
        <div className="table-essays-loading">
          <div className="table-essays-spinner"></div>
          <p>Loading essay configurations...</p>
        </div>
      </div>
    );
  }

  // Render empty state
  if (essays.length === 0) {
    return (
      <div className="table-essays-container">
        <div className="table-essays-empty">
          <FileText size={48} className="table-essays-empty-icon" />
          <h3>No Essay Configurations</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-essays-container">
      {/* Header */}
      <div className="table-essays-header">
        <div className="table-essays-header-cell essay-topic">Essay Topic</div>
        <div className="table-essays-header-cell essay-context">Context</div>
        <div className="table-essays-header-cell essay-status">Status</div>
        <div className="table-essays-header-cell essay-actions">Actions</div>
      </div>

      {/* Essay Cards */}
      <div className="table-essays-body">
        {essays.map((essay, index) => (
          <div
            key={essay.id || index}
            className={`table-essays-card ${
              essay.isGenerated ? "clickable-row" : ""
            }`}
            onClick={(e) => handleRowClick(essay, e)}
            role={essay.isGenerated ? "button" : undefined}
            tabIndex={essay.isGenerated ? 0 : undefined}
            aria-label={
              essay.isGenerated
                ? `View details of ${essay.subject || "Untitled Essay"}`
                : undefined
            }
          >
            {/* Essay Topic Section */}
            <div className="table-essays-cell essay-topic">
              <div className="essay-topic-content">
                <div className="essay-topic-header">
                  <FileText size={20} className="essay-topic-icon" />
                  <h4 className="essay-topic-title">
                    {essay.subject || "Untitled Essay"}
                  </h4>
                </div>
                <div className="essay-topic-meta">
                  <span className="essay-limit-badge">
                    {formatLimit(essay)}
                  </span>
                </div>
              </div>
            </div>

            {/* Context Section (replaces Style & Tone) */}
            <div className="table-essays-cell essay-context">
              <div className="essay-context-content">
                {essay.context ? (
                  <p className="essay-context-text">{essay.context}</p>
                ) : (
                  <p className="essay-context-empty">
                    <Info size={14} className="context-icon" />
                    <span>No additional context provided</span>
                  </p>
                )}
              </div>
            </div>

            {/* Status Section */}
            <div className="table-essays-cell essay-status">
              <div className="essay-status-content">
                {essay.isGenerated ? (
                  <div className="essay-status-generated">
                    <CheckCircle2 size={16} className="status-icon" />
                    <div className="status-text">
                      <span className="status-label">Generated</span>
                      {essay.generatedDate && (
                        <span className="status-date">
                          {formatDate(essay.generatedDate)}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="essay-status-pending">
                    <Clock size={16} className="status-icon" />
                    <div className="status-text">
                      <span className="status-label">Not Generated</span>
                      <span className="status-date">Ready to create</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="table-essays-cell essay-actions">
              <div className="essay-actions-content">
                {/* Afficher le bouton Generate ou View en premier selon l'état */}
                {essay.isGenerated ? (
                  <button
                    className="essay-action-btn view-btn"
                    onClick={() => onViewEssay && onViewEssay(essay)}
                    aria-label="View essay details"
                    title="View essay details"
                  >
                    <Eye size={18} className="btn-icon" />
                  </button>
                ) : (
                  <button
                    className="essay-action-btn generate-btn"
                    onClick={() => onGenerateEssay && onGenerateEssay(essay)}
                    aria-label="Generate essay"
                    title="Generate essay"
                  >
                    <BookText size={18} className="btn-icon" />
                  </button>
                )}

                <button
                  className="essay-action-btn edit-btn"
                  onClick={() => onEditEssay && onEditEssay(essay)}
                  aria-label="Edit essay configuration"
                  title="Edit essay configuration"
                >
                  <Edit3 size={18} className="btn-icon" />
                </button>

                <button
                  className="essay-action-btn delete-btn"
                  onClick={() => onDeleteEssay && onDeleteEssay(essay)}
                  aria-label="Delete essay configuration"
                  title="Delete essay configuration"
                >
                  <Trash2 size={18} className="btn-icon" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableEssays;
