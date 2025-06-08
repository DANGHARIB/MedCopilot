# UploadAmcasFlow

Flow d'upload et de traitement des fichiers PDF AMCAS pour l'extraction automatique des données.

## Structure

```
UploadAmcasFlow/
├── UploadAmcasFlow.jsx          # Composant principal du flow
├── UploadAmcasFlow.css          # Styles du container principal
├── index.js                     # Export principal
├── components/
│   ├── Step1Upload/
│   │   ├── UploadAmcas.jsx      # Interface d'upload PDF
│   │   ├── UploadAmcas.css      # Styles de l'upload
│   │   └── index.js             # Export du composant
│   └── ProcessingModal/
│       ├── ProcessingModal.jsx  # Modal de traitement
│       ├── ProcessingModal.css  # Styles du modal
│       └── index.js             # Export du composant
└── README.md                    # Documentation
```

## Utilisation

```jsx
import UploadAmcasFlow from './UploadAmcasFlow';

<UploadAmcasFlow
  formData={formData}
  updateFormData={updateFormData}
  onComplete={handleComplete}
  onBack={handleBack}
/>
```

## Props

- `formData`: Données du formulaire principal
- `updateFormData`: Fonction pour mettre à jour les données
- `onComplete`: Callback appelé à la fin du traitement
- `onBack`: Callback pour retourner au choix de méthode

## Flow

1. **Upload** : L'utilisateur sélectionne/dépose son PDF AMCAS
2. **Processing** : Modal avec progression du traitement
3. **Completion** : Redirection vers le profil avec données extraites

## Design

- Design minimaliste inspiré de Jony Ive
- Animations fluides et feedback visuel
- Interface responsive et accessible
- Cohérence avec ManualAmcasFlow 