const DEADLINE_MESSAGES = {
  // Messages pour les jours spécifiques
  1: [
    { text: "The Day!", support: "Trust your preparation 💪" },
    { text: "Today's the day!", support: "You've got this!" },
    { text: "Submission day", support: "Time to shine ✨" }
  ],
  3: [
    { text: "Rush time", support: "Final sprint mode 🚀" },
    { text: "Three days left", support: "The finish line is close" },
    { text: "Crunch time", support: "You're almost there!" }
  ],
  7: [
    { text: "The final week", support: "Time to polish and perfect" },
    { text: "One week to go", support: "The home stretch begins" },
    { text: "Seven days left", support: "You've got momentum!" }
  ],
  14: [
    { text: "Two weeks to go", support: "Perfect timing to finalize" },
    { text: "14 days remaining", support: "Steady progress wins" },
    { text: "The countdown begins", support: "You're on track!" }
  ],
  30: [
    { text: "A month ahead", support: "Plenty of time to excel" },
    { text: "30 days to prepare", support: "Great planning window" },
    { text: "Full month available", support: "Time to craft something amazing" }
  ]
};

// Messages pour les intervalles
const INTERVAL_MESSAGES = {
  // 2-6 jours
  urgent: [
    { text: "Final countdown", support: "Every hour counts now" },
    { text: "Almost there", support: "Push through!" },
    { text: "Last few days", support: "You're so close" }
  ],
  // 8-13 jours  
  soon: [
    { text: "Coming up soon", support: "Time to focus" },
    { text: "Just over a week", support: "Building momentum" },
    { text: "Getting close", support: "Stay consistent" }
  ],
  // 15-29 jours
  normal: [
    { text: "Good timing", support: "Steady progress ahead" },
    { text: "Nice runway", support: "Plan and execute" },
    { text: "Comfortable timeline", support: "Quality over speed" }
  ],
  // 31+ jours
  plenty: [
    { text: "Plenty of time", support: "Start when you're ready" },
    { text: "Long runway", support: "Perfect for thorough prep" },
    { text: "No rush", support: "Quality planning time" }
  ]
};

const OVERDUE_MESSAGES = [
  { text: "Still time", support: "Better late than never" },
  { text: "Don't give up", support: "Submit when ready" },
  { text: "Keep going", support: "Progress matters most" }
];

/**
 * Get personalized deadline message based on days remaining
 * @param {number} daysRemaining - Number of days until deadline
 * @returns {object} - Object with main text and support message
 */
export const getPersonalizedDeadlineMessage = (daysRemaining) => {
  // Overdue
  if (daysRemaining < 0) {
    const randomIndex = Math.floor(Math.random() * OVERDUE_MESSAGES.length);
    return OVERDUE_MESSAGES[randomIndex];
  }

  // Specific day messages
  if (DEADLINE_MESSAGES[daysRemaining]) {
    const messages = DEADLINE_MESSAGES[daysRemaining];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  // Interval-based messages
  let category;
  if (daysRemaining >= 31) {
    category = 'plenty';
  } else if (daysRemaining >= 15) {
    category = 'normal';
  } else if (daysRemaining >= 8) {
    category = 'soon';
  } else {
    category = 'urgent';
  }

  const messages = INTERVAL_MESSAGES[category];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

/**
 * Get simple fallback message (for variety)
 * @param {number} daysRemaining 
 * @returns {string}
 */
export const getSimpleDeadlineMessage = (daysRemaining) => {
  if (daysRemaining < 0) {
    return `${Math.abs(daysRemaining)} days overdue`;
  }
  if (daysRemaining === 0) {
    return 'Due today';
  }
  return `${daysRemaining} days remaining`;
}; 