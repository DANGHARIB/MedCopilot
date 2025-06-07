// src/services/mockEssayService/essayProvider.js

// --- Sample Initial Essay (Version 1) ---
const initialEssayExample = `Pursuing a career in medicine is a decision I have cultivated through numerous formative experiences. Initially drawn to the scientific complexity of the human body, my interest deepened as I discovered the direct and profoundly human impact that physicians can have. In high school, my volunteer work in the local emergency department exposed me to the fast-paced and often challenging reality of daily medical life. There, I observed not only the technical skill of the doctors but also their ability to demonstrate compassion and resilience in critical situations. This was an initial awakening to the necessary balance between scientific knowledge and human qualities.

Later, during my undergraduate studies in biology, a research experience in neurodegenerative diseases refined my understanding of contemporary medical challenges. I spent hours in the laboratory, analyzing data and contributing to a project aimed at identifying new early markers for Alzheimer's disease. While this work was intellectually stimulating, it also made me realize the crucial importance of translating research findings into concrete clinical applications to improve patients' lives. The frustration of seeing promising advancements remain confined to the laboratory without directly benefiting those in need reinforced my conviction to be closer to patient care.

Another turning point was my participation in a medical humanitarian mission in an underserved rural area. We established mobile clinics, providing basic care to populations who rarely had access to it. Treating a simple infection that, lacking care, could have had serious consequences, or educating a community on preventive hygiene measures, gave me an immense sense of purpose. It was there that I truly grasped the social dimension of medicine and the essential role of the physician as a public health advocate, beyond merely treating diseases.

These experiences, from the adrenaline of the emergency room to the patience of research, and including commitment in the humanitarian field, have forged my determination. They taught me the importance of listening, empathy, intellectual rigor, and a commitment to serving others. I am convinced that medicine is the path that will allow me to combine my passion for science with my deep desire to contribute positively to society by providing care and comfort to those in need. I am particularly drawn to your school's mission, which emphasizes training physicians who are not only competent but also deeply humane and socially responsible.`;

// --- Sample Revised Essay (Version 2) - CLEAN VERSION WITHOUT REVISION TAGS ---
const revisedEssayExample = `My commitment to medicine crystallized through a series of key experiences. Initially fascinated by the scientific complexity of the human body, my vocation was affirmed by discovering the direct and profoundly human impact of physicians. In high school, my volunteer work in local emergency services confronted me with the fast-paced reality of daily medical life, where I admired the technical skill of physicians combined with their compassion and resilience in critical situations – a first glimpse of the indispensable balance between knowledge and humanity.

My undergraduate studies in biology then shifted my perspective towards research, particularly during a project on neurodegenerative diseases. Contributing to the identification of early markers for Alzheimer's was intellectually stimulating, but it primarily highlighted the urgency of translating scientific discoveries into tangible clinical applications. The frustration of seeing promising advancements confined to the laboratory intensified my desire for an active role at the patient's bedside. For instance, we investigated the role of the tau protein in the early stages of the pathology, which helped me understand the complexity of translational research.

My commitment then materialized during a humanitarian medical mission in an isolated rural area. By establishing mobile clinics, we provided essential care, treating minor infections with potentially severe outcomes and promoting health education. This experience revealed the social dimension of medicine and the fundamental role of the physician as a public health agent.

These diverse experiences – the vibrancy of emergency rooms, the rigor of research, and humanitarian altruism – solidified my vocation. They instilled in me the crucial importance of listening, empathy, intellectual precision, and unwavering dedication. I am convinced that medicine is the path where my scientific passion and my aspiration to serve will merge to bring care and relief. Your institution's mission, focused on training practitioners who are both expert and profoundly humane, resonates particularly with my own values and goals.`;

// Generate difference structure for providing a clean diff view
const generateStructuredDifferences = () => {
  return [
    {
      paragraphIndex: 0,
      changes: [
        { type: "removed", text: "Pursuing a career in medicine is a decision I have cultivated through numerous formative experiences." },
        { type: "added", text: "My commitment to medicine crystallized through a series of key experiences." },
        { type: "context", text: " Initially " },
        { type: "removed", text: "drawn" },
        { type: "added", text: "fascinated" },
        { type: "context", text: " by the scientific complexity of the human body, my " },
        { type: "removed", text: "interest deepened as I discovered" },
        { type: "added", text: "vocation was affirmed by discovering" },
        { type: "context", text: " the direct and profoundly human impact " },
        { type: "removed", text: "that physicians can have" },
        { type: "added", text: "of physicians" },
        { type: "context", text: ". In high school, my volunteer work in " },
        { type: "removed", text: "the local emergency department" },
        { type: "added", text: "local emergency services" },
        { type: "context", text: " " },
        { type: "removed", text: "exposed me to" },
        { type: "added", text: "confronted me with" },
        { type: "context", text: " the fast-paced " },
        { type: "removed", text: "and often challenging " },
        { type: "context", text: "reality of daily medical life" },
        // ... additional changes would continue here
      ]
    },
    // Additional paragraph changes would be defined here
  ];
};

/**
 * Simulates the generation of an initial essay.
 * @param {object} essayConfig - Essay configuration (prompt, wordLimit, etc.).
 * @returns {string} A sample essay text.
 */
export const generateMockEssay = (essayConfig) => {
  console.log("generateMockEssay called with config:", essayConfig);
  // Maintenir la compatibilité en retournant directement la chaîne de texte
  return initialEssayExample;
};

/**
 * Simulates the revision of an essay based on notes.
 * @param {string} originalEssay - The original essay.
 * @param {Array<object>} revisionNotes - The revision notes.
 * @param {object} essayConfig - Essay configuration.
 * @returns {string} A sample revised essay.
 */
export const reviseMockEssay = (originalEssay, revisionNotes, essayConfig) => {
  console.log("reviseMockEssay called with originalEssay, notes:", revisionNotes, "and config:", essayConfig);
  
  // Pour l'interface EditedEssayInterface, nous pouvons stocker des données supplémentaires dans window
  // qui seront utilisées mais n'affecteront pas l'interface existante
  window.essayRevisionData = {
    originalEssay: originalEssay || initialEssayExample,
    revisedEssay: revisedEssayExample,
    differences: generateStructuredDifferences()
  };
  
  // Maintenir la compatibilité en retournant directement la chaîne de texte
  return revisedEssayExample;
};