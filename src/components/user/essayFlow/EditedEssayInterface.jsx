import React, { useState, useRef, useEffect } from "react";
import { 
  CheckSquare,
  GitCompare,
  FileText,
  Eye,
  Diff
} from "lucide-react";
import "./EditedEssayInterface.css";

/**
 * Modern interface for reviewing essay revisions
 * Clean, elegant design with focus on readability and user experience
 */
const EditedEssayInterface = ({ 
  originalEssay,
  revisedEssay,
  onAcceptRevisions,
  school
}) => {
  // State
  const [activeTab, setActiveTab] = useState("differences");
  
  // Refs for synchronized scrolling
  const originalSideRef = useRef(null);
  const revisedSideRef = useRef(null);
  
  // Split essays into paragraphs
  const originalParagraphs = originalEssay?.split(/\n\n+/) || [];
  const revisedParagraphs = revisedEssay?.split(/\n\n+/) || [];
  
  // Synchronized scrolling for side-by-side view
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
  
  // Tab configuration
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
  
  // Render original essay view
  const renderOriginalView = () => (
    <div className="essay-content">
      <div className="essay-content-body">
        {originalParagraphs.map((paragraph, index) => (
          <p key={`original-${index}`} className="essay-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
  
  // Render revised essay view
  const renderRevisedView = () => (
    <div className="essay-content">
      <div className="essay-content-body">
        {revisedParagraphs.map((paragraph, index) => (
          <p key={`revised-${index}`} className="essay-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
  
  // Render differences view with highlighted changes
  const renderDifferencesView = () => (
    <div className="essay-side-by-side">
      <div className="essay-side">
        <div className="essay-side-header">
          <h3>Original Version</h3>
        </div>
        <div className="essay-side-content" ref={originalSideRef}>
          {/* Premier paragraphe avec surlignage des suppressions */}
          <p className="essay-paragraph">
            <span className="text-highlight-original">Pursuing a career in medicine is a decision I have cultivated through numerous formative experiences.</span> Initially <span className="text-highlight-original">drawn</span> to the scientific complexity of the human body, my <span className="text-highlight-original">interest deepened as I discovered</span> the direct and profoundly human impact <span className="text-highlight-original">that physicians can have</span>. In high school, my volunteer work in <span className="text-highlight-original">the local emergency department</span> <span className="text-highlight-original">exposed me to</span> the fast-paced <span className="text-highlight-original">and often challenging</span> reality of daily medical life. There, I observed not only the technical skill of the doctors but also their ability to demonstrate compassion and resilience in critical situations. This was an initial awakening to the necessary balance between scientific knowledge and human qualities.
          </p>
          
          {/* Deuxième paragraphe */}
          <p className="essay-paragraph">
            <span className="text-highlight-original">Later, during my undergraduate studies in biology, a research experience in</span> neurodegenerative diseases <span className="text-highlight-original">refined my understanding of contemporary medical challenges. I spent hours in the laboratory, analyzing data and contributing to a project aimed at identifying</span> new early markers for Alzheimer's <span className="text-highlight-original">disease. While this work</span> was intellectually stimulating, it also made me realize the crucial importance of translating research findings into concrete clinical applications to improve patients' lives. The frustration of seeing promising advancements remain confined to the laboratory without directly benefiting those in need reinforced my conviction to be closer to patient care.
          </p>
          
          {/* Troisième paragraphe */}
          <p className="essay-paragraph">
            <span className="text-highlight-original">Another turning point was</span> my participation in a medical humanitarian mission in an <span className="text-highlight-original">underserved</span> rural area. <span className="text-highlight-original">We established</span> mobile clinics, <span className="text-highlight-original">providing basic care to populations who rarely had access to it. Treating a simple infection that, lacking care, could have had serious consequences, or educating a community on preventive hygiene measures, gave me an immense sense of purpose.</span> <span className="text-highlight-original">It was there that I truly grasped</span> the social dimension of medicine and the <span className="text-highlight-original">essential</span> role of the physician as a public health <span className="text-highlight-original">advocate, beyond merely treating diseases</span>.
          </p>
          
          {/* Quatrième paragraphe */}
          <p className="essay-paragraph">
            These experiences, from the adrenaline of the emergency room to the patience of research, and including commitment in the humanitarian field, have forged my determination. They taught me the importance of listening, empathy, intellectual rigor, and a commitment to serving others. I am convinced that medicine is the path that will allow me to combine my passion for science with my deep desire to contribute positively to society by providing care and comfort to those in need. I am particularly drawn to your school's mission, which emphasizes training physicians who are not only competent but also deeply humane and socially responsible.
          </p>
        </div>
      </div>
      
      <div className="essay-side">
        <div className="essay-side-header">
          <h3>Revised Version</h3>
        </div>
        <div className="essay-side-content" ref={revisedSideRef}>
          {/* Premier paragraphe avec surlignage des ajouts */}
          <p className="essay-paragraph">
            <span className="text-highlight-revised">My commitment to medicine crystallized through a series of key experiences.</span> Initially <span className="text-highlight-revised">fascinated</span> by the scientific complexity of the human body, my <span className="text-highlight-revised">vocation was affirmed by discovering</span> the direct and profoundly human impact <span className="text-highlight-revised">of physicians</span>. In high school, my volunteer work in <span className="text-highlight-revised">local emergency services</span> <span className="text-highlight-revised">confronted me with</span> the fast-paced reality of daily medical life, where I admired the technical skill of physicians combined with their compassion and resilience in critical situations – a first glimpse of the indispensable balance between knowledge and humanity.
          </p>
          
          {/* Deuxième paragraphe */}
          <p className="essay-paragraph">
            <span className="text-highlight-revised">My undergraduate studies in biology then shifted my perspective towards research, particularly during a project on</span> neurodegenerative diseases. Contributing to the identification of early markers for Alzheimer's <span className="text-highlight-revised">was intellectually stimulating, but it primarily highlighted the urgency of translating scientific discoveries into tangible clinical applications. The frustration of seeing promising advancements confined to the laboratory intensified my desire for an active role at the patient's bedside. For instance, we investigated the role of the tau protein in the early stages of the pathology, which helped me understand the complexity of translational research</span>.
          </p>
          
          {/* Troisième paragraphe */}
          <p className="essay-paragraph">
            <span className="text-highlight-revised">My commitment then materialized during</span> a humanitarian medical mission in an <span className="text-highlight-revised">isolated</span> rural area. <span className="text-highlight-revised">By establishing</span> mobile clinics, <span className="text-highlight-revised">we provided essential care, treating minor infections with potentially severe outcomes and promoting health education.</span> <span className="text-highlight-revised">This experience revealed</span> the social dimension of medicine and the <span className="text-highlight-revised">fundamental</span> role of the physician as a public health <span className="text-highlight-revised">agent</span>.
          </p>
          
          {/* Quatrième paragraphe */}
          <p className="essay-paragraph">
            These diverse experiences – the vibrancy of emergency rooms, the rigor of research, and humanitarian altruism – solidified my vocation. They instilled in me the crucial importance of listening, empathy, intellectual precision, and unwavering dedication. I am convinced that medicine is the path where my scientific passion and my aspiration to serve will merge to bring care and relief. Your institution's mission, focused on training practitioners who are both expert and profoundly humane, resonates particularly with my own values and goals.
          </p>
        </div>
      </div>
    </div>
  );
  
  // Render the appropriate content based on active tab
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
    <div className="essay-container">
      {/* Header */}
      <header className="essay-header">
        <div className="essay-header-content">
          <div className="essay-header-title">
            <GitCompare size={40} className="essay-icon" />
            <div>
              <h1>Essay Review</h1>
              <p className="essay-header-subtitle">
                {school?.name || 'Harvard Medical School'} Application
              </p>
            </div>
          </div>
          
          <div className="essay-actions">
            <button 
              className="essay-action-button primary"
              onClick={onAcceptRevisions}
            >
              <CheckSquare size={18} />
              <span>Accept Changes</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <div className="essay-tabs">
        <div className="essay-tabs-container">
          <div className="essay-tabs-list">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                className={`essay-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-label={tab.description}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="essay-main">
        {activeTab === 'differences' ? (
          renderMainContent()
        ) : (
          <div className="essay-content-wrapper">
            {renderMainContent()}
          </div>
        )}
      </main>
    </div>
  );
};

export default EditedEssayInterface;