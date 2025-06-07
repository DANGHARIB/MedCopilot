import React, { useState, useEffect } from "react";
import {
  Book,
  Edit2,
  CheckCircle,
  Home,
  ChevronRight,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./ProfileSections.css";

const PersonalStatementSection = () => {
  const [editMode, setEditMode] = useState(false);
  const [personalStatement, setPersonalStatement] = useState(
    "From an early age, I've been fascinated by the intersection of science and human compassion. Growing up with a chronically ill parent, I witnessed first-hand the impact that dedicated healthcare professionals can have on patients and their families. These experiences ignited my desire to pursue medicine, where I could combine my passion for scientific inquiry with my commitment to serving others.\n\nMy undergraduate research in immunology has taught me to approach problems methodically, while my volunteer work at Memorial Hospital has shown me the importance of empathy in healthcare settings. Working directly with patients from diverse backgrounds has reinforced my belief that effective medical care must be both scientifically sound and culturally responsive.\n\nI'm particularly drawn to the field of pediatric medicine, as I find the resilience of young patients inspiring and believe in the profound impact early intervention can have. My experiences coordinating health literacy workshops in underserved communities have highlighted the critical need for accessible medical education and preventative care.\n\nI approach medicine with the understanding that each patient is more than their diagnosis - they're individuals with unique stories, fears, and hopes. My goal is to become a physician who not only treats disease but also empowers patients through education and compassionate care. I believe that the practice of medicine is both a science and an art, requiring continuous learning, adaptation, and deep human connection."
  );

  // Contraintes AMCAS réelles
  const MAX_CHARACTERS = 5300;
  const MIN_WORDS = 250;
  const MAX_WORDS = 1200;

  // États pour les statistiques
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Calculs en temps réel
  useEffect(() => {
    const words =
      personalStatement.trim() === ""
        ? 0
        : personalStatement.trim().split(/\s+/).length;
    const chars = personalStatement.length;

    setWordCount(words);
    setCharCount(chars);
  }, [personalStatement]);

  // Calcul du niveau de complétion
  const getCompletionLevel = () => {
    if (wordCount < MIN_WORDS) return "insufficient";
    if (wordCount <= MAX_WORDS && charCount <= MAX_CHARACTERS) return "optimal";
    if (charCount <= MAX_CHARACTERS) return "acceptable";
    return "exceeded";
  };

  const completionLevel = getCompletionLevel();
  const completionPercentage = Math.min(100, (wordCount / MAX_WORDS) * 100);

  // Obtention des suggestions contextuelles
  const getSuggestions = () => {
    const wordsNeeded = MIN_WORDS - wordCount;
    const charsOver = charCount - MAX_CHARACTERS;

    switch (completionLevel) {
      case "insufficient":
        return {
          type: "info",
          message: `Add ${wordsNeeded} more words to complete`,
          icon: <FileText className="suggestion-icon" />,
        };
      case "optimal":
        return {
          type: "success",
          message: "Perfect length!",
          icon: <CheckCircle className="suggestion-icon" />,
        };
      case "acceptable":
        return {
          type: "warning",
          message: "Consider shortening for impact",
          icon: <AlertCircle className="suggestion-icon" />,
        };
      case "exceeded":
        return {
          type: "error",
          message: `${charsOver} characters over limit`,
          icon: <AlertCircle className="suggestion-icon" />,
        };
      default:
        return null;
    }
  };

  const suggestion = getSuggestions();

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    // Ici nous simulons la sauvegarde pour la démo
    // En production, vous enverriez cela à votre backend
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    // En production, vous récupéreriez la valeur originale du backend
  };

  const handleChange = (e) => {
    setPersonalStatement(e.target.value);
  };

  return (
    <div className="profile-section-wrapper">
      <div className="profile-breadcrumb">
        <Link to="/profile" className="profile-breadcrumb-link">
          <Home size={16} className="profile-breadcrumb-icon" />
          Profile
        </Link>
        <span className="profile-breadcrumb-separator">
          <ChevronRight size={14} />
        </span>
        <Link to="/profile/information" className="profile-breadcrumb-link">
          Profile Information
        </Link>
        <span className="profile-breadcrumb-separator">
          <ChevronRight size={14} />
        </span>
        <span className="profile-breadcrumb-current">Personal Statement</span>
      </div>

      {/* Header modernisé */}
      <div className="profile-section-container">
        <div className="profile-section-header-modern">
          <div className="header-main-row">
            <div className="header-text-group">
              <div className="header-title">
                Personal{" "}
                <span className="header-title-highlight">Statement</span>
              </div>
            </div>

            <button
              className="profile-section-edit-button"
              onClick={handleEdit}
            >
              <Edit2 size={16} />
              Edit Statement
            </button>
          </div>


        </div>

        {/* Zone de contenu principal */}
        <div className="profile-statement-body">
          {editMode ? (
            <div className="profile-section-edit-area">
              <textarea
                className="profile-section-textarea"
                value={personalStatement}
                onChange={handleChange}
                rows={15}
                maxLength={MAX_CHARACTERS}
              />
              <div className="profile-section-edit-actions">
                <button
                  className="profile-section-button-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="profile-section-button-primary"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-section-text-display">
                {personalStatement.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </>
          )}

          {/* Cards de statistiques */}
          <div className="writing-stats">
            <div className="stats-unified-grid">
              {/* Progress Card */}
              <div className="stat-card progress-card">
                <div className="stat-card-header">
                  <span className="stat-card-title">Writing Progress</span>
                </div>
                <div className="stat-card-content">
                  <div className="stat-progress-row">
                    <span className="stat-progress-label">Overall</span>
                    <span className="stat-progress-value">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                  <div className="progress-bar-container-full">
                    <div
                      className={`progress-bar-fill ${completionLevel}`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <div className="stat-advice">
                    {suggestion && (
                      <div className={`stat-advice-content ${suggestion.type}`}>
                        <div className="stat-advice-icon">
                          {suggestion.icon}
                        </div>
                        <span className="stat-advice-text">
                          {suggestion.message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Word Count Card */}
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-title">Words</span>
                </div>
                <div className="stat-card-content">
                  <div className="stat-main-row">
                    <div className="stat-main-value">
                      {wordCount.toLocaleString()}
                    </div>
                  </div>
                  <div className="progress-bar-container-full">
                    <div
                      className={`progress-bar-fill ${
                        wordCount < MIN_WORDS
                          ? "insufficient"
                          : wordCount <= MAX_WORDS
                          ? "optimal"
                          : "acceptable"
                      }`}
                      style={{
                        width: `${Math.min(
                          (wordCount / MAX_WORDS) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="stat-main-range">
                    Range: {MIN_WORDS} - {MAX_WORDS.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Character Count Card */}
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-title">Characters</span>
                </div>
                <div className="stat-card-content">
                  <div className="stat-main-row">
                    <div
                      className={`stat-main-value ${
                        charCount > MAX_CHARACTERS ? "exceeded" : ""
                      }`}
                    >
                      {charCount.toLocaleString()}
                    </div>
                  </div>
                  <div className="progress-bar-container-full">
                    <div
                      className={`progress-bar-fill ${
                        charCount > MAX_CHARACTERS
                          ? "exceeded"
                          : charCount > MAX_CHARACTERS * 0.9
                          ? "acceptable"
                          : "optimal"
                      }`}
                      style={{
                        width: `${Math.min(
                          (charCount / MAX_CHARACTERS) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="stat-main-range">
                    Max: {MAX_CHARACTERS.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section-info">
          <div className="profile-section-info-item">
            <CheckCircle size={16} className="profile-section-info-icon" />
            <span>
              Your personal statement should tell your unique story and
              motivation for pursuing medicine.
            </span>
          </div>
          <div className="profile-section-info-item">
            <CheckCircle size={16} className="profile-section-info-icon" />
            <span>
              Aim for approximately 5,300 characters (250-1,200 words).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalStatementSection;
