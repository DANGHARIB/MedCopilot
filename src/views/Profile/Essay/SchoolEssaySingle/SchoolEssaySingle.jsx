import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Copy, 
  Download, 
  Share2, 
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  BookOpen,
  Type,
  Star,
  MessageSquare,
  BarChart2,
  HistoryIcon,
  School,
  Calendar,
  Edit3,
  Target,
  HelpCircle,
  ArrowRight,
  X,
  Lightbulb,
  Check,
  CheckCircle,
  Eye,
  Layers,
  PenTool
} from 'lucide-react';

import UserLayout from '../../../../components/user/layout/UserLayout';
import VersionCompare from './VersionCompare';
import RevisionRequest from './RevisionRequest';
import LoadingState from './LoadingState';

import './SchoolEssaySingle.css';

/**
 * SchoolEssaySingle - Vue détaillée pour un essai unique avec historique des versions
 * et capacités de révision - Refactorisé dans le style d'EssayStep4
 */
const SchoolEssaySingle = () => {
  const { schoolId, essayId } = useParams();
  const navigate = useNavigate();

  // État principal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [school, setSchool] = useState(null);
  const [essay, setEssay] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeView, setActiveView] = useState('view'); // 'view', 'compare', 'revise', 'generating'
  const [compareVersion, setCompareVersion] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  
  // États pour la navigation et les modals
  const [showStats, setShowStats] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showVersioningModal, setShowVersioningModal] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [hasUnseenVersions, setHasUnseenVersions] = useState(false);
  
  // Position de défilement pour les effets d'ombre
  const [scrolled, setScrolled] = useState(false);
  
  // Refs
  const essayContainerRef = useRef(null);
  const tipsModalRef = useRef(null);
  const versioningModalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Hook personnalisé pour la gestion du verrouillage de défilement
  const useScrollLock = () => {
    const scrollPosition = useRef(0);
    
    const lockScroll = useCallback(() => {
      scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }, []);
    
    const unlockScroll = useCallback(() => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      
      window.scrollTo(0, scrollPosition.current);
    }, []);
    
    return { lockScroll, unlockScroll };
  };
  
  const { lockScroll, unlockScroll } = useScrollLock();

  // Fonction pour centrer la position du modal
  const centerModal = useCallback((modalRef) => {
    if (!modalRef.current) return;
    
    const modal = modalRef.current;
    const rect = modal.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const centerX = (viewportWidth - rect.width) / 2;
    const centerY = (viewportHeight - rect.height) / 2;
    
    const minX = 16;
    const minY = 16;
    const maxX = viewportWidth - rect.width - 16;
    const maxY = viewportHeight - rect.height - 16;
    
    const finalX = Math.max(minX, Math.min(centerX, maxX));
    const finalY = Math.max(minY, Math.min(centerY, maxY));
    
    modal.style.position = 'fixed';
    modal.style.left = `${finalX}px`;
    modal.style.top = `${finalY}px`;
    modal.style.transform = 'none';
    modal.style.margin = '0';
  }, []);

  // Déterminer si nous comptons les caractères ou les mots basé sur limitType
  const isCountingCharacters = essay?.limitType === 'characters';
  
  // Nombre maximum (mots ou caractères) basé sur le choix de l'utilisateur
  const maxCount = isCountingCharacters 
    ? (essay?.characterLimit || 2500) 
    : (essay?.wordLimit || 500);
  
  // Libellé pour le comptage (mots ou caractères)
  const countLabel = isCountingCharacters ? "characters" : "words";

  // Calculer le nombre de mots
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };
  
  // Calculer le nombre de caractères
  const countCharacters = (text) => {
    if (!text) return 0;
    return text.length;
  };

  // Calculs des statistiques et métriques
  const calculateStats = () => {
    const essayText = currentVersion?.content || "";
    const words = essayText.split(/\s+/).filter(word => word.length > 0);
    const sentences = essayText.split(/[.!?]+/).filter(sent => sent.trim().length > 0);
    const paragraphs = essayText.split(/\n\n+/).filter(para => para.trim().length > 0);
    
    return {
      wordCount: words.length,
      characterCount: essayText.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordsPerSentence: sentences.length ? Math.round((words.length / sentences.length) * 10) / 10 : 0,
      readingTime: Math.max(1, Math.round(words.length / 225))
    };
  };
  
  const stats = calculateStats();

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les données de l'école
        const savedSchools = JSON.parse(localStorage.getItem('mySavedSchools') || '[]');
        const schoolData = savedSchools.find(s => s.id.toString() === schoolId);
        
        if (!schoolData) {
          throw new Error('School not found');
        }
        
        setSchool(schoolData);
        
        // Récupérer la configuration de l'essai
        const schoolEssays = JSON.parse(localStorage.getItem('schoolEssays') || '{}');
        const essays = schoolEssays[schoolId] || [];
        const essayData = essays.find(e => e.id.toString() === essayId);
        
        if (!essayData) {
          throw new Error('Essay not found');
        }
        
        setEssay(essayData);
        
        // Récupérer les versions (de essayGenerationHistory)
        const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
        const essayVersions = essayHistory[schoolId]?.[essayId]?.versions || [];
        
        setVersions(essayVersions);
        
        // Définir la version actuelle comme la plus récente, ou null si aucune n'existe
        if (essayVersions.length > 0) {
          const latest = essayVersions[essayVersions.length - 1];
          setCurrentVersion(latest);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading essay data:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [schoolId, essayId]);

  // Gérer les événements de défilement pour les effets d'ombre
  useEffect(() => {
    const handleScroll = () => {
      if (essayContainerRef.current) {
        setScrolled(essayContainerRef.current.scrollTop > 10);
      }
    };
    
    const currentRef = essayContainerRef.current;
    
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Mettre à jour le comptage actuel quand les données de l'essai changent
  useEffect(() => {
    const updateCount = () => {
      const essayText = currentVersion?.content || "";
      if (essayText) {
        const count = isCountingCharacters 
          ? countCharacters(essayText) 
          : countWords(essayText);
        setCurrentCount(count);
      }
    };
    
    updateCount();
  }, [currentVersion?.content, isCountingCharacters, countWords, countCharacters]);

  // Effet de comptage animé
  useEffect(() => {
    if (animatedCount !== currentCount) {
      const step = Math.ceil(Math.abs(currentCount - animatedCount) / 20);
      const timer = setTimeout(() => {
        if (animatedCount < currentCount) {
          setAnimatedCount(Math.min(animatedCount + step, currentCount));
        } else {
          setAnimatedCount(Math.max(animatedCount - step, currentCount));
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [currentCount, animatedCount]);

  // Gestion des modals
  const openModal = (modalType) => {
    previousFocusRef.current = document.activeElement;
    lockScroll();
    
    if (modalType === 'tips') {
      setShowTipsModal(true);
    }
    if (modalType === 'versioning') {
      setShowVersioningModal(true);
    }
  };
  
  const closeModal = (modalType) => {
    unlockScroll();
    
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
    
    if (modalType === 'tips') {
      setShowTipsModal(false);
    }
    if (modalType === 'versioning') {
      setShowVersioningModal(false);
    }
  };

  // Basculer le modal des conseils
  const handleTipsClick = () => {
    openModal('tips');
  };
  
  // Fermer le modal des conseils
  const handleCloseTipsModal = () => {
    closeModal('tips');
  };

  // Fermer le modal de versioning
  const handleCloseVersioningModal = () => {
    closeModal('versioning');
  };

  // Gérer la touche d'échappement pour les modals
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        if (showTipsModal) {
          handleCloseTipsModal();
        }
        if (showVersioningModal) {
          handleCloseVersioningModal();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showTipsModal, showVersioningModal]);

  // Auto-centrer les modals quand ils s'ouvrent
  useEffect(() => {
    if (showVersioningModal && versioningModalRef.current) {
      setTimeout(() => centerModal(versioningModalRef), 10);
    }
  }, [showVersioningModal, centerModal]);
  
  useEffect(() => {
    if (showTipsModal && tipsModalRef.current) {
      setTimeout(() => centerModal(tipsModalRef), 10);
    }
  }, [showTipsModal, centerModal]);

  // Gérer le redimensionnement de la fenêtre pour re-centrer les modals
  useEffect(() => {
    const handleResize = () => {
      if (showVersioningModal && versioningModalRef.current) {
        centerModal(versioningModalRef);
      }
      if (showTipsModal && tipsModalRef.current) {
        centerModal(tipsModalRef);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showVersioningModal, showTipsModal, centerModal]);

  // Gestion de la navigation de retour à la liste des essais
  const handleBackToList = () => {
    navigate(`/schools/${schoolId}/essays`);
  };



  // Gérer le passage à une version différente
  const handleViewVersion = (version) => {
    setCurrentVersion(version);
    setActiveView('view');
  };

  // Gérer la comparaison des versions
  const handleCompareVersions = (version) => {
    setCompareVersion(version);
    setActiveView('compare');
  };

  // Gérer le démarrage d'une révision
  const handleInitiateRevision = () => {
    if (!currentVersion) {
      showToast('No version to revise', 'error');
      return;
    }
    
    setActiveView('revise');
  };

  // Gérer la soumission d'une demande de révision
  const handleSubmitRevision = (instructions) => {
    setActiveView('generating');
    
    // Simuler le temps de génération
    setTimeout(() => {
      // Créer une nouvelle version
      const newVersion = {
        id: versions.length + 1,
        date: new Date().toISOString(),
        content: "This is a new version of the essay based on your revisions...",
        revisionInstructions: instructions,
        wordCount: currentVersion.wordCount + 15,
        characterCount: currentVersion.characterCount + 80,
      };
      
      // Mettre à jour les versions
      const updatedVersions = [...versions, newVersion];
      setVersions(updatedVersions);
      
      // Mettre à jour le localStorage
      const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
      if (!essayHistory[schoolId]) essayHistory[schoolId] = {};
      if (!essayHistory[schoolId][essayId]) essayHistory[schoolId][essayId] = {};
      
      essayHistory[schoolId][essayId].versions = updatedVersions;
      localStorage.setItem('essayGenerationHistory', JSON.stringify(essayHistory));
      
      // Définir le mode de comparaison pour comparer l'ancienne version avec la nouvelle
      setCompareVersion(currentVersion);
      setCurrentVersion(newVersion);
      setActiveView('compare');
      
      showToast('New revision generated successfully', 'success');
    }, 3000);
  };

  // Gérer l'acceptation d'une version comparée
  const handleAcceptVersion = (version) => {
    setCurrentVersion(version);
    setActiveView('view');
    showToast('Version set as current', 'success');
  };

  // Gérer l'annulation d'une comparaison ou révision
  const handleCancelAction = () => {
    setActiveView('view');
  };

  // Afficher la notification toast
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    
    // Cacher automatiquement le toast après 3 secondes
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'Not generated yet';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Déterminer le contenu à rendre basé sur la vue active
  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return (
        <div className="ses-essay-error-state">
          <div className="ses-essay-error-icon">!</div>
          <h2>Error Loading Essay</h2>
          <p>{error}</p>
          <button 
            className="ses-essay-error-button"
            onClick={handleBackToList}
          >
            Return to Essay List
          </button>
        </div>
      );
    }

    switch (activeView) {
      case 'compare':
        return (
          <VersionCompare 
            currentVersion={currentVersion}
            compareVersion={compareVersion}
            onAccept={handleAcceptVersion}
            onCancel={handleCancelAction}
          />
        );
        
      case 'revise':
        return (
          <RevisionRequest 
            version={currentVersion}
            essay={essay}
            onSubmit={handleSubmitRevision}
            onCancel={handleCancelAction}
          />
        );
        
      case 'generating':
        return (
          <div className="ses-essay-generating-state">
            <div className="ses-essay-generating-animation">
              <div className="ses-generating-circle"></div>
              <div className="ses-generating-circle"></div>
              <div className="ses-generating-circle"></div>
            </div>
            <h2>Generating New Essay Version</h2>
            <p>Our AI is crafting a revised version based on your instructions...</p>
            <div className="ses-essay-generating-progress">
              <div className="ses-essay-generating-bar">
                <div className="ses-essay-generating-fill"></div>
              </div>
            </div>
          </div>
        );
        
      case 'view':
      default:
        return (
          <div className="ses-essay-finalized-container">
            {/* Navigation supérieure */}
            <header className="ses-essay-viewer-header">
              <div className="ses-essay-viewer-nav-left">
                <button 
                  className="ses-essay-back-button"
                  onClick={handleBackToList}
                  aria-label="Back to essay list"
                >
                  <ChevronLeft size={16} />
                  <span>Back to Essays</span>
                </button>
                <h1 className="ses-essay-viewer-title">
                  <FileText size={20} />
                  <span>{essay?.subject || 'Essay'} </span>
                </h1>
              </div>
              
              <div className="ses-essay-viewer-nav-right">
                <div 
                  className="ses-essay-viewer-word-count"
                  onClick={() => setShowStats(!showStats)}
                  aria-label="Show statistics"
                  role="button"
                >
                  <span className="ses-essay-viewer-count-current">{animatedCount}</span>
                  <span className="ses-essay-viewer-count-separator">/</span>
                  <span className="ses-essay-viewer-count-limit">{maxCount}</span>
                  <span className="ses-essay-viewer-count-label">{countLabel}</span>
                  <ChevronDown size={14} className="ses-essay-viewer-count-icon" />
                </div>
                
                <button 
                  className={`ses-essay-viewer-action-button secondary ${
                    versions.length > 1 ? 'has-versions' : ''
                  }`}
                  onClick={() => {
                    setShowVersioningModal(true);
                    setHasUnseenVersions(false);
                  }}
                  aria-label="View revision versions"
                >
                  <HistoryIcon size={16} />
                  <span>
                    Versioning ({versions.length})
                  </span>
                  {hasUnseenVersions && versions.length > 1 && (
                    <div className="ses-essay-versions-badge" />
                  )}
                </button>
                
                <button 
                  className="ses-essay-viewer-action-button primary"
                  onClick={handleInitiateRevision}
                  disabled={!currentVersion}
                  aria-label="Edit with AI"
                >
                  <Edit3 size={16} />
                  <span>Edit with AI</span>
                </button>
                
                <button 
                  className="ses-essay-viewer-icon-button ses-essay-viewer-help-button"
                  onClick={handleTipsClick}
                  aria-label="Show tips"
                  title="Show tips"
                >
                  <Lightbulb size={18} />
                </button>
              </div>
            </header>

            {/* Panneau de statistiques (conditionnel) */}
            {showStats && (
              <div className="ses-essay-viewer-stats-panel">
                <div className="ses-essay-viewer-stats-header">
                  <BarChart2 size={16} />
                  <h2>Essay Statistics</h2>
                  <button 
                    className="ses-essay-viewer-close-button"
                    onClick={() => setShowStats(false)}
                    aria-label="Close statistics"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="ses-essay-viewer-stats-content">
                  <div className="ses-essay-viewer-stat-item">
                    <Type size={16} />
                    <div className="ses-essay-viewer-stat-info">
                      <span className="ses-essay-viewer-stat-value">{stats.wordCount}</span>
                      <span className="ses-essay-viewer-stat-label">Words</span>
                    </div>
                  </div>
                  <div className="ses-essay-viewer-stat-item">
                    <FileText size={16} />
                    <div className="ses-essay-viewer-stat-info">
                      <span className="ses-essay-viewer-stat-value">{stats.characterCount}</span>
                      <span className="ses-essay-viewer-stat-label">Characters</span>
                    </div>
                  </div>
                  <div className="ses-essay-viewer-stat-item">
                    <MessageSquare size={16} />
                    <div className="ses-essay-viewer-stat-info">
                      <span className="ses-essay-viewer-stat-value">{stats.sentenceCount}</span>
                      <span className="ses-essay-viewer-stat-label">Sentences</span>
                    </div>
                  </div>
                  <div className="ses-essay-viewer-stat-item">
                    <BookOpen size={16} />
                    <div className="ses-essay-viewer-stat-info">
                      <span className="ses-essay-viewer-stat-value">{stats.paragraphCount}</span>
                      <span className="ses-essay-viewer-stat-label">Paragraphs</span>
                    </div>
                  </div>
                  <div className="ses-essay-viewer-stat-item">
                    <Star size={16} />
                    <div className="ses-essay-viewer-stat-info">
                      <span className="ses-essay-viewer-stat-value">{stats.avgWordsPerSentence}</span>
                      <span className="ses-essay-viewer-stat-label">Words per Sentence</span>
                    </div>
                  </div>
                  <div className="ses-essay-viewer-stat-item">
                    <Clock size={16} />
                    <div className="ses-essay-viewer-stat-info">
                      <span className="ses-essay-viewer-stat-value">{stats.readingTime} min</span>
                      <span className="ses-essay-viewer-stat-label">Reading Time</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Zone de contenu principal */}
            <div className="ses-essay-viewer-main">
              {/* Contenu principal - Pleine largeur */}
              <div className="ses-essay-final-content-container">
                {/* Carte d'essai améliorée - Pleine largeur */}
                <div className="ses-essay-final-card">
                  <div className={`ses-essay-final-header ${scrolled ? 'scrolled' : ''}`}>
                    <div className="ses-essay-final-header-content">
                      <div className="ses-essay-final-title">
                        <School size={36} className="ses-essay-icon" />
                        <h2>{school?.name || 'Medical School'}</h2>
                        <div className="ses-essay-final-tag success">
                          <CheckCircle size={14} />
                          <span>{currentVersion ? 'Generated' : 'Not Generated'}</span>
                        </div>
                        {currentVersion && (
                          <div className="ses-essay-meta-item">
                            <Type size={14} />
                            <span>Version {currentVersion.id || 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ses-essay-final-content" ref={essayContainerRef}>
                    {currentVersion?.content ? (
                      currentVersion.content.split(/\n\n+/).map((paragraph, index) => (
                        <p key={`paragraph-${index}`} className="ses-essay-paragraph">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <div className="ses-essay-no-content">
                        <div className="ses-essay-no-content-icon">
                          <FileText size={48} />
                        </div>
                        <h3>No Essay Generated Yet</h3>
                        <p>This essay configuration exists but no content has been generated yet.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ses-essay-final-footer">
                    <div className="ses-essay-final-timestamp">
                      <Calendar size={14} />
                      <span>Last updated {formatDate(currentVersion?.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <UserLayout>
      <div className="ses-school-essay-single-container">
        <main className="ses-school-essay-single-main">
          {renderContent()}
        </main>
        
        {/* Modal de versioning - Historique de révision */}
        {showVersioningModal && (
          <div 
            className="ses-essay-modal-overlay" 
            onClick={handleCloseVersioningModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="versioning-modal-title"
          >
            <div 
              className="ses-essay-versioning-modal" 
              ref={versioningModalRef}
              onClick={e => e.stopPropagation()}
              tabIndex="-1"
            >
              <div className="ses-essay-modal-header">
                <div className="ses-essay-modal-title">
                  <HistoryIcon size={18} />
                  <h2 id="versioning-modal-title">Revision History</h2>
                </div>
                
                <button 
                  className="ses-essay-modal-close"
                  onClick={handleCloseVersioningModal}
                  aria-label="Close versioning"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="ses-essay-modal-content">
                <div className="ses-essay-versioning-timeline">
                  {versions.length === 0 ? (
                    <div className="ses-essay-versions-empty">
                      <FileText size={24} />
                      <p>No versions yet</p>
                      <span>Generate your first version to get started</span>
                    </div>
                  ) : (
                    versions.map((version, index) => (
                      <div 
                        key={`revision-${index}`} 
                        className={`ses-essay-versioning-item ${currentVersion?.id === version.id ? 'active' : ''}`}
                      >
                        <div className="ses-essay-versioning-connector">
                          <div className="ses-essay-versioning-line"></div>
                          <div className="ses-essay-versioning-dot"></div>
                        </div>
                        
                        <div className="ses-essay-versioning-content">
                          <div className="ses-essay-versioning-header">
                            <div className="ses-essay-versioning-title">
                              <span className="ses-essay-versioning-version">Version {version.id}</span>
                              {currentVersion?.id === version.id && (
                                <span className="ses-essay-versioning-current-badge">Current</span>
                              )}
                            </div>
                            <div className="ses-essay-versioning-date">
                              <Clock size={14} />
                              <span>{formatDate(version.date)}</span>
                            </div>
                          </div>
                          
                          <div className="ses-essay-versioning-details">
                            <div className="ses-essay-versioning-instructions">
                              <div className="ses-essay-versioning-label">Instructions:</div>
                              <p>{version.instructions || version.revisionInstructions || "Initial generation"}</p>
                            </div>
                            
                            <div className="ses-essay-versioning-preview">
                              <div className="ses-essay-versioning-label">Content Preview:</div>
                              <p className="ses-essay-versioning-text-preview">
                                {(version.content || "").substring(0, 200)}
                                {(version.content || "").length > 200 ? "..." : ""}
                              </p>
                            </div>
                            
                            <div className="ses-essay-version-actions">
                              <button 
                                className="ses-essay-version-button"
                                onClick={() => {
                                  handleViewVersion(version);
                                  handleCloseVersioningModal();
                                }}
                                disabled={currentVersion?.id === version.id}
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                              
                              {currentVersion?.id !== version.id && (
                                <button 
                                  className="ses-essay-version-button"
                                  onClick={() => {
                                    handleCompareVersions(version);
                                    handleCloseVersioningModal();
                                  }}
                                >
                                  <Layers size={14} />
                                  <span>Compare</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="ses-essay-modal-footer">
                <button 
                  className="ses-essay-modal-button"
                  onClick={handleCloseVersioningModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal de conseils */}
        {showTipsModal && (
          <div 
            className="ses-essay-modal-overlay" 
            onClick={handleCloseTipsModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tips-modal-title"
          >
            <div 
              className="ses-essay-modal" 
              ref={tipsModalRef}
              onClick={e => e.stopPropagation()}
              tabIndex="-1"
            >
              <div className="ses-essay-modal-header">
                <div className="ses-essay-modal-title">
                  <Lightbulb size={18} />
                  <h2 id="tips-modal-title">Essay Management Tips</h2>
                </div>
                
                <button 
                  className="ses-essay-modal-close"
                  onClick={handleCloseTipsModal}
                  aria-label="Close tips"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="ses-essay-modal-content">
                <div className="ses-essay-tip-list">
                  <div className="ses-essay-tip-item">
                    <div className="ses-essay-tip-number">1</div>
                    <div className="ses-essay-tip-text">
                      <strong>Review Versions</strong> - Click the <strong>Versioning</strong> button to see all revision history and track your essay's evolution.
                    </div>
                  </div>
                  
                  <div className="ses-essay-tip-item">
                    <div className="ses-essay-tip-number">2</div>
                    <div className="ses-essay-tip-text">
                      <strong>Request Revisions</strong> - Use the edit button to request specific improvements to your essay.
                    </div>
                  </div>
                  
                  <div className="ses-essay-tip-item">
                    <div className="ses-essay-tip-number">3</div>
                    <div className="ses-essay-tip-text">
                      <strong>Compare Versions</strong> - Use the compare feature to see differences between versions.
                    </div>
                  </div>
                  
                  <div className="ses-essay-tip-item">
                    <div className="ses-essay-tip-number">4</div>
                    <div className="ses-essay-tip-text">
                      <strong>Track Statistics</strong> - Monitor word count, reading time, and other metrics via the statistics panel.
                    </div>
                  </div>
                </div>
                
                <div className="ses-essay-shortcut-section">
                  <h3>Additional Actions</h3>
                  <div className="ses-essay-resources-grid">
                    <div className="ses-essay-resource-item">
                      <ArrowRight size={14} />
                      <a href="#" className="ses-resource-link">Export to PDF</a>
                    </div>
                    
                    <div className="ses-essay-resource-item">
                      <ArrowRight size={14} />
                      <a href="#" className="ses-resource-link">Share Essay</a>
                    </div>
                    
                    <div className="ses-essay-resource-item">
                      <ArrowRight size={14} />
                      <a href="#" className="ses-resource-link">Copy to Clipboard</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="ses-essay-modal-footer">
                <button 
                  className="ses-essay-modal-button"
                  onClick={handleCloseTipsModal}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Notification toast */}
        {toast.show && (
          <div className={`ses-essay-toast ses-toast-${toast.type}`}>
            <div className="ses-essay-toast-icon">
              {toast.type === 'success' ? (
                <div className="ses-success-icon"></div>
              ) : toast.type === 'error' ? (
                <div className="ses-error-icon"></div>
              ) : (
                <div className="ses-info-icon"></div>
              )}
            </div>
            <p>{toast.message}</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default SchoolEssaySingle;