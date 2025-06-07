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
  School,
} from "lucide-react";
import "./TableAllEssays.css";

/**
 * TableAllEssays - Table spécialisée pour afficher tous les essays de toutes les écoles
 * Version étendue de TableEssays avec une colonne école et design moderne
 */
const TableAllEssays = ({
  essays = [],
  onGenerateEssay,
  onEditEssay,
  onDeleteEssay,
  onViewEssay,
  isLoading = false,
  emptyMessage = "Aucun essay configuré",
}) => {
  // Formater la limite de mots ou de caractères
  const formatLimit = (essay) => {
    if (!essay) return "N/A";

    if (essay.limitType === "words") {
      return `${essay.wordLimit} words`;
    } else {
      return `${essay.characterLimit || essay.wordLimit * 5} characters`;
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Gérer le clic sur une ligne
  const handleRowClick = (essay, event) => {
    // Si on clique sur un bouton d'action, ne pas rediriger
    if (event.target.closest(".essay-action-btn")) {
      return;
    }

    if (essay.isGenerated && onViewEssay) {
      onViewEssay(essay);
    }
  };

  // Rendu de l'état de chargement
  if (isLoading) {
    return (
      <div className="table-all-essays-container">
        <div className="table-all-essays-loading">
          <div className="table-all-essays-spinner"></div>
          <p>Loading essays...</p>
        </div>
      </div>
    );
  }

  // Rendu de l'état vide
  if (essays.length === 0) {
    return (
      <div className="table-all-essays-container">
        <div className="table-all-essays-empty">
          <FileText size={48} className="table-all-essays-empty-icon" />
          <h3>No Essays Configured</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-all-essays-container">
      {/* Header de la table */}
      <div className="table-all-essays-header">
        <div className="table-all-essays-header-cell essay-school">School</div>
        <div className="table-all-essays-header-cell essay-topic">Essay Topic</div>
        <div className="table-all-essays-header-cell essay-context">Context</div>
        <div className="table-all-essays-header-cell essay-status">Status</div>
        <div className="table-all-essays-header-cell essay-actions">Actions</div>
      </div>

      {/* Corps de la table - Cards d'essays */}
      <div className="table-all-essays-body">
        {essays.map((essay, index) => (
          <div
            key={essay.schoolId && essay.id ? `${essay.schoolId}-${essay.id}` : index}
            className={`table-all-essays-card ${
              essay.isGenerated ? "clickable-row" : ""
            }`}
            onClick={(e) => handleRowClick(essay, e)}
            role={essay.isGenerated ? "button" : undefined}
            tabIndex={essay.isGenerated ? 0 : undefined}
            aria-label={
              essay.isGenerated
                ? `Voir les détails de ${essay.subject || "Untitled Essay"}`
                : undefined
            }
          >
            {/* Section École */}
            <div className="table-all-essays-cell essay-school">
              <div className="essay-school-content">
                <div className="essay-school-logo">
                  <span className="essay-school-logo-text">
                    {essay.schoolInitials}
                  </span>
                </div>
                <div className="essay-school-info">
                  <h4 className="essay-school-name">{essay.schoolName}</h4>
                  {essay.schoolLocation && (
                    <p className="essay-school-location">{essay.schoolLocation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section Sujet d'Essay */}
            <div className="table-all-essays-cell essay-topic">
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

            {/* Section Contexte */}
            <div className="table-all-essays-cell essay-context">
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

            {/* Section Statut */}
            <div className="table-all-essays-cell essay-status">
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

            {/* Section Actions */}
            <div className="table-all-essays-cell essay-actions">
              <div className="essay-actions-content">
                {/* Bouton principal : Generate ou View selon l'état */}
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

export default TableAllEssays; 