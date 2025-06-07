# Flux Utilisateur MedSchool Copilot

Ce document décrit le parcours utilisateur complet de l'application MedSchool Copilot, depuis l'inscription jusqu'à la génération d'essais personnalisés pour les écoles de médecine. Ce document sert de référence pour l'implémentation frontend.

## 1. Authentification et Onboarding Initial

### 1.1 Inscription et Première Connexion

- **Déclencheur** : Première connexion uniquement après inscription
- **Composant** : `ProfileOnboard.jsx`
- **Comportement** :
  - Le modal d'onboarding s'affiche automatiquement après la première connexion
  - Un indicateur doit être stocké (localStorage ou base de données) pour ne pas réafficher ce modal lors des connexions ultérieures
  - Le composant affiche un message de bienvenue et une explication du processus à venir

### 1.2 Transition vers la Configuration du Profil

- **Déclencheur** : Clic sur le bouton "Set Up Your Profile Now!"
- **Action** : Redirection vers le composant `ProfileWizard.jsx`
- **Implémentation** :
  ```javascript
  // Dans ProfileOnboard.jsx
  const handleSetupProfile = () => {
    navigate('/profile/setup');
  };
  ```

## 2. Configuration du Profil Utilisateur

### 2.1 Wizard de Configuration

- **Composant** : `ProfileWizard.jsx`
- **Structure** : Assistant multi-étapes avec persistance des données
- **Fonctionnalités** :
  - Navigation entre les différentes étapes
  - Sauvegarde progressive des informations
  - Validation des données à chaque étape
  - Indicateur de progression
  - Option pour reprendre la configuration plus tard

### 2.2 Finalisation de la Configuration

- **Déclencheur** : Complétion de toutes les étapes requises
- **Transition** : Affichage du composant `ProfileSetupComplete.jsx`
- **État** : Toutes les données du profil doivent être sauvegardées en base de données à ce stade

## 3. Transition vers la Sélection d'Écoles

### 3.1 Écran de Complétion

- **Composant** : `ProfileSetupComplete.jsx`
- **Comportement** :
  - Affichage d'un message de confirmation
  - Indication des prochaines étapes
  - Le profil utilisateur est désormais considéré comme complet

### 3.2 Redirection vers la Base de Données d'Écoles

- **Déclencheur** : Clic sur le bouton "Let's get started"
- **Action** : Redirection vers `ViewAllMedicalSchool.jsx`
- **Implémentation** :
  ```javascript
  // Dans ProfileSetupComplete.jsx
  const handleGoToSchools = () => {
    if (onGetStarted) {
      onGetStarted(); // Fonction callback optionnelle
    }
    navigate('/viewAllSchool');
  };
  ```

## 4. Recherche et Sélection d'Écoles

### 4.1 Interface de Recherche d'Écoles

- **Composant** : `ViewAllMedicalSchool.jsx`
- **Fonctionnalités** :
  - Barre de recherche avec filtrage en temps réel
  - Affichage des écoles avec informations pertinentes
  - Possibilité de trier et filtrer par différents critères
  - Pagination pour gérer de grandes quantités d'écoles
  - Bouton "Save" pour chaque école

### 4.2 Sauvegarde d'une École

- **Déclencheur** : Clic sur le bouton "Save" pour une école
- **Actions** :
  - Stockage de l'école dans la liste des écoles sauvegardées de l'utilisateur
  - Déclenchement immédiat du flux d'onboarding spécifique à cette école
  - Notification visuelle (toast) confirmant la sauvegarde

## 5. Configuration Spécifique à l'École

### 5.1 Démarrage du Flux d'Onboarding d'École

- **Composant** : Nouveau composant `SchoolOnboarding.jsx` à créer
- **Déclencheur** : Automatique après sauvegarde d'une école
- **Format** : Modal moderne et épuré ou composant plein écran
- **Implémentation** :
  ```javascript
  // Dans ViewAllMedicalSchool.jsx
  const handleSaveSchool = (school) => {
    // Logique de sauvegarde existante...
    
    // Lancer le flux d'onboarding d'école
    setCurrentSchool(school);
    setShowSchoolOnboarding(true);
  };
  ```

### 5.2 Configuration du Nombre d'Essais

- **Étape 1** du `SchoolOnboarding`
- **Interface** :
  - Titre avec le nom de l'école
  - Sélecteur de nombre d'essais requis (1-5)
  - Explication de l'importance de ces essais
  - Boutons de navigation (Suivant/Précédent)

## 6. Configuration des Essais

### 6.1 Configuration Individuelle de Chaque Essai

- **Étape 2+** du `SchoolOnboarding`
- **Comportement** :
  - Créer des sous-étapes dynamiques basées sur le nombre d'essais sélectionnés
  - Pour chaque essai (1 à N), afficher un formulaire de configuration
  - S'inspirer du design et des fonctionnalités de `EssayStep1.jsx`

### 6.2 Paramètres de Configuration par Essai

- **Champs requis** :
  - Sujet/Prompt de l'essai
  - Limite de mots ou de caractères
  - Contexte additionnel pour personnalisation
  - Style et ton préférés
- **Interface** :
  - Formulaire intuitif avec validation
  - Indicateurs visuels de progression
  - Prévisualisation des paramètres

### 6.3 Finalisation de la Configuration

- **Déclencheur** : Configuration de tous les essais terminée
- **Actions** :
  - Sauvegarde des configurations d'essais en base de données
  - Notification de réussite
  - Redirection vers `MySchoolTab.jsx`

## 7. Gestion des Écoles Sauvegardées

### 7.1 Interface des Écoles Sauvegardées

- **Composant** : `MySchoolTab.jsx`
- **Modifications requises** :
  - Supprimer le bouton "Add School"
  - Conserver uniquement le bouton "View All"
  - Ajouter des indicateurs visuels pour les écoles avec essais configurés

### 7.2 Navigation vers de Nouvelles Écoles

- **Déclencheur** : Clic sur le bouton "View All"
- **Action** : Redirection vers `ViewAllMedicalSchool.jsx`
- **Comportement** : Permet à l'utilisateur de recommencer le processus pour d'autres écoles

## 8. Considérations Techniques pour l'Implémentation Frontend

### 8.1 Gestion des États

- Utiliser React Context ou Redux pour gérer l'état global de l'application
- Sauvegarder les données transitoires dans localStorage pour permettre la reprise du flux
- Synchroniser régulièrement avec le backend pour éviter la perte de données

### 8.2 Transitions et Animation

- Implémenter des transitions fluides entre les différentes étapes
- Utiliser des animations subtiles pour améliorer l'expérience utilisateur
- Assurer des retours visuels pour chaque action utilisateur

### 8.3 Responsive Design

- Tous les composants doivent être parfaitement responsifs
- Porter une attention particulière aux formulaires complexes sur mobile
- Adapter les modaux pour différentes tailles d'écran

### 8.4 Accessibilité

- Assurer que tous les composants sont accessibles au clavier
- Fournir des textes alternatifs appropriés
- Respecter les contrastes de couleur WCAG
- Implémenter les rôles ARIA appropriés

## 9. Priorités d'Implémentation

1. Créer le composant `SchoolOnboarding.jsx` et son CSS associé
2. Modifier `ViewAllMedicalSchool.jsx` pour déclencher le flux d'onboarding
3. Modifier `MySchoolTab.jsx` pour refléter les nouvelles spécifications d'interface
4. Tester et affiner le flux utilisateur complet

---

Ce document servira de référence pour l'implémentation du flux utilisateur. Toute modification significative du flux devrait être documentée ici pour maintenir la cohérence. 