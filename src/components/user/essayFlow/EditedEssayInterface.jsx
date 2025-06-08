import React, { useState, useRef, useEffect } from "react";
import { 
  CheckSquare,
  GitCompare,
  FileText,
  Eye,
  Copy,
  Download,
  Edit3,
  SaveAll,
  BookOpen,
  Type,
  BarChart2,
  X,
  ChevronDown
} from "lucide-react";
import "./EditedEssayInterface.css";

/**
 * Interface d'essai édité avec design unifié basé sur EssayStep2
 * Carte hero unique avec navigation intégrée dans le header
 */
const EditedEssayInterface = ({ 
  originalEssay,
  revisedEssay,
  onAcceptRevisions,
  school
}) => {
  // State
  const [activeTab, setActiveTab] = useState("differences");
  const [animatedCount, setAnimatedCount] = useState(0);
  
  // Refs pour le scroll synchronisé
  const originalSideRef = useRef(null);
  const revisedSideRef = useRef(null);
  
  // Diviser les essais en paragraphes
  const originalParagraphs = originalEssay?.split(/\n\n+/) || [];
  const revisedParagraphs = revisedEssay?.split(/\n\n+/) || [];
  
  // Configuration des onglets
  const tabs = [
    {
      id: 'original',
      label: 'Original',
      description: 'Your original essay'
    },
    {
      id: 'revised',
      label: 'Revised', 
      description: 'The improved version'
    },
    {
      id: 'differences',
      label: 'Compare',
      description: 'Side-by-side comparison'
    }
  ];

  // Calculer les statistiques
  const getEssayStats = () => {
    const activeEssay = activeTab === 'original' ? originalEssay : revisedEssay;
    const essayText = activeEssay || '';
    const paragraphs = essayText.split(/\n+/).filter(p => p.trim() !== "");
    const words = essayText.split(/\s+/).filter(Boolean);
    const sentences = essayText.split(/[.!?]+/).filter(Boolean);
    
    return {
      paragraphs: paragraphs.length,
      sentences: sentences.length,
      words: words.length,
      characters: essayText.length,
      avgWordsPerSentence: sentences.length ? Math.round((words.length / sentences.length) * 10) / 10 : 0,
      readingTime: Math.max(1, Math.round(words.length / 225))
    };
  };
  
  const essayStats = getEssayStats();
  
  // Animation du compteur
  useEffect(() => {
    if (animatedCount !== essayStats.words) {
      const step = Math.ceil(Math.abs(essayStats.words - animatedCount) / 20);
      const timer = setTimeout(() => {
        if (animatedCount < essayStats.words) {
          setAnimatedCount(prev => Math.min(prev + step, essayStats.words));
        } else if (animatedCount > essayStats.words) {
          setAnimatedCount(prev => Math.max(prev - step, essayStats.words));
        }
      }, 20);
      
      return () => clearTimeout(timer);
    }
  }, [animatedCount, essayStats.words]);

  // Scroll synchronisé pour la vue comparaison
  useEffect(() => {
    if (activeTab === 'differences' && originalSideRef.current && revisedSideRef.current) {
      const originalSide = originalSideRef.current;
      const revisedSide = revisedSideRef.current;
      
      const handleScroll = (source, target) => () => {
        if (target && source) {
          const scrollPercentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
          target.scrollTop = scrollPercentage * (target.scrollHeight - target.clientHeight);
        }
      };
      
      const handleOriginalScroll = handleScroll(originalSide, revisedSide);
      const handleRevisedScroll = handleScroll(revisedSide, originalSide);
      
      originalSide.addEventListener('scroll', handleOriginalScroll);
      revisedSide.addEventListener('scroll', handleRevisedScroll);
      
      return () => {
        originalSide.removeEventListener('scroll', handleOriginalScroll);
        revisedSide.removeEventListener('scroll', handleRevisedScroll);
      };
    }
  }, [activeTab]);
  
  // Rendu de la vue originale
  const renderOriginalView = () => (
    <div className="edited-essay-content">
      {originalParagraphs.map((paragraph, index) => (
        <p key={`original-${index}`} className="edited-essay-paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  );
  
  // Rendu de la vue révisée
  const renderRevisedView = () => (
    <div className="edited-essay-content">
      {revisedParagraphs.map((paragraph, index) => (
        <p key={`revised-${index}`} className="edited-essay-paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  );
  
  // Rendu de la vue comparaison
  const renderDifferencesView = () => (
    <div className="edited-essay-side-by-side">
      <div className="edited-essay-side">
        <div className="edited-essay-side-header">
          <h3>Original Version</h3>
        </div>
        <div className="edited-essay-side-content" ref={originalSideRef}>
          <p className="edited-essay-paragraph">
            <span className="text-highlight-original">Pursuing a career in medicine is a decision I have cultivated through numerous formative experiences.</span> Initially <span className="text-highlight-original">drawn</span> to the scientific complexity of the human body, my <span className="text-highlight-original">interest deepened as I discovered</span> the direct and profoundly human impact <span className="text-highlight-original">that physicians can have</span>. In high school, my volunteer work in <span className="text-highlight-original">the local emergency department</span> <span className="text-highlight-original">exposed me to</span> the fast-paced <span className="text-highlight-original">and often challenging</span> reality of daily medical life. There, I observed not only the technical skill of the doctors but also their ability to demonstrate compassion and resilience in critical situations. This was an initial awakening to the necessary balance between scientific knowledge and human qualities.
          </p>
          
          <p className="edited-essay-paragraph">
            <span className="text-highlight-original">Later, during my undergraduate studies in biology, a research experience in</span> neurodegenerative diseases <span className="text-highlight-original">refined my understanding of contemporary medical challenges. I spent hours in the laboratory, analyzing data and contributing to a project aimed at identifying</span> new early markers for Alzheimer's <span className="text-highlight-original">disease. While this work</span> was intellectually stimulating, it also made me realize the crucial importance of translating research findings into concrete clinical applications to improve patients' lives. The frustration of seeing promising advancements remain confined to the laboratory without directly benefiting those in need reinforced my conviction to be closer to patient care.
          </p>
          
          <p className="edited-essay-paragraph">
            <span className="text-highlight-original">Another turning point was</span> my participation in a medical humanitarian mission in an <span className="text-highlight-original">underserved</span> rural area. <span className="text-highlight-original">We established</span> mobile clinics, <span className="text-highlight-original">providing basic care to populations who rarely had access to it. Treating a simple infection that, lacking care, could have had serious consequences, or educating a community on preventive hygiene measures, gave me an immense sense of purpose.</span> <span className="text-highlight-original">It was there that I truly grasped</span> the social dimension of medicine and the <span className="text-highlight-original">essential</span> role of the physician as a public health <span className="text-highlight-original">advocate, beyond merely treating diseases</span>.
          </p>
          
          <p className="edited-essay-paragraph">
            These experiences, from the adrenaline of the emergency room to the patience of research, and including commitment in the humanitarian field, have forged my determination. They taught me the importance of listening, empathy, intellectual rigor, and a commitment to serving others. I am convinced that medicine is the path that will allow me to combine my passion for science with my deep desire to contribute positively to society by providing care and comfort to those in need. I am particularly drawn to your school's mission, which emphasizes training physicians who are not only competent but also deeply humane and socially responsible.
          </p>
        </div>
      </div>
      
      <div className="edited-essay-side">
        <div className="edited-essay-side-header">
          <h3>Revised Version</h3>
        </div>
        <div className="edited-essay-side-content" ref={revisedSideRef}>
          <p className="edited-essay-paragraph">
            <span className="text-highlight-revised">My commitment to medicine crystallized through a series of key experiences.</span> Initially <span className="text-highlight-revised">fascinated</span> by the scientific complexity of the human body, my <span className="text-highlight-revised">vocation was affirmed by discovering</span> the direct and profoundly human impact <span className="text-highlight-revised">of physicians</span>. In high school, my volunteer work in <span className="text-highlight-revised">local emergency services</span> <span className="text-highlight-revised">confronted me with</span> the fast-paced reality of daily medical life, where I admired the technical skill of physicians combined with their compassion and resilience in critical situations – a first glimpse of the indispensable balance between knowledge and humanity.
          </p>
          
          <p className="edited-essay-paragraph">
            <span className="text-highlight-revised">My undergraduate studies in biology then shifted my perspective towards research, particularly during a project on</span> neurodegenerative diseases. Contributing to the identification of early markers for Alzheimer's <span className="text-highlight-revised">was intellectually stimulating, but it primarily highlighted the urgency of translating scientific discoveries into tangible clinical applications. The frustration of seeing promising advancements confined to the laboratory intensified my desire for an active role at the patient's bedside. For instance, we investigated the role of the tau protein in the early stages of the pathology, which helped me understand the complexity of translational research</span>.
          </p>
          
          <p className="edited-essay-paragraph">
            <span className="text-highlight-revised">My commitment then materialized during</span> a humanitarian medical mission in an <span className="text-highlight-revised">isolated</span> rural area. <span className="text-highlight-revised">By establishing</span> mobile clinics, <span className="text-highlight-revised">we provided essential care, treating minor infections with potentially severe outcomes and promoting health education.</span> <span className="text-highlight-revised">This experience revealed</span> the social dimension of medicine and the <span className="text-highlight-revised">fundamental</span> role of the physician as a public health <span className="text-highlight-revised">agent</span>.
          </p>
          
          <p className="edited-essay-paragraph">
            These diverse experiences – the vibrancy of emergency rooms, the rigor of research, and humanitarian altruism – solidified my vocation. They instilled in me the crucial importance of listening, empathy, intellectual precision, and unwavering dedication. I am convinced that medicine is the path where my scientific passion and my aspiration to serve will merge to bring care and relief. Your institution's mission, focused on training practitioners who are both expert and profoundly humane, resonates particularly with my own values and goals.
          </p>
        </div>
      </div>
    </div>
  );

  // Rendu du contenu principal basé sur l'onglet actif
  const renderMainContent = () => {
    switch (activeTab) {
      case "original":
        return renderOriginalView();
      case "revised":
        return renderRevisedView();
      case "differences":
        return renderDifferencesView();
      default:
        return renderDifferencesView();
    }
  };
  
  return (
    <div className="edited-essay-container">
      
      
      <main className="edited-essay-main">
        {/* Notification de succès */}
        <div className="edited-essay-notification">
          <CheckSquare size={20} />
          <div>
            <p className="edited-essay-notification-title">Essay successfully revised!</p>
            <p className="edited-essay-notification-message">Review the changes below and accept or request further modifications.</p>
          </div>
        </div>
        
        {/* Carte d'essai hero unique */}
        <div className="edited-essay-hero-card">
          <div className="edited-essay-card-header">
            {/* Grouper icône et titre à gauche */}
            <div className="edited-essay-header-left">
              <div className="edited-essay-card-icon">
                <BookOpen size={20} />
              </div>
              
              <div className="edited-essay-header-content">
                <h2 className="edited-essay-card-title">Essay for {school?.name}</h2>
                <div className="edited-essay-header-subtitle">Review and compare versions</div>
              </div>
            </div>
            
            {/* Onglets de navigation intégrés dans le header */}
            <div className="edited-essay-header-tabs">
              {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  className={`edited-essay-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={tab.description}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Contenu de l'essai */}
          <div className="edited-essay-content-container">
            {renderMainContent()}
          </div>
          
          {/* Actions intégrées dans le footer */}
          <div className="edited-essay-actions-footer">
            <div className="edited-essay-integrated-actions">
             
              
              <button 
                className="edited-essay-action-button primary"
                onClick={onAcceptRevisions}
                aria-label="Accept revisions"
              >
                <CheckSquare size={18} />
                <span>Continue</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditedEssayInterface;