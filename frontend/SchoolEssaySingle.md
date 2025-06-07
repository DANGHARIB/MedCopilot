# SchoolEssaySingle - Interface de Gestion d'Essai Individuel

## Vue d'ensemble

L'interface `SchoolEssaySingle` représente la vision détaillée d'un essai spécifique pour une école médicale. Cette interface centralisée offre à l'utilisateur un espace dédié pour consulter, gérer et améliorer son essai à travers plusieurs versions et révisions.

## Objectifs de conception

1. **Clarté historique** : Offrir une visualisation claire de l'évolution de l'essai
2. **Accessibilité du contenu** : Permettre une lecture confortable du contenu actuel
3. **Facilité d'action** : Simplifier les actions de révision et d'amélioration
4. **Continuité d'expérience** : Maintenir une cohérence avec les autres interfaces de l'application

## Structure de l'interface

### 1. En-tête (Header)

**Composants :**
- **Fil d'Ariane** : Affiche le chemin navigable (Schools > [Nom de l'école] > Essays > [Titre de l'essai])
- **Titre principal** : Nom de l'essai avec icône de document
- **Badge de statut** : Indique si l'essai est "Complété", "En cours" ou "À réviser"
- **Métadonnées** : Affiche le type de limite (mots/caractères) et la valeur de cette limite
- **Actions rapides** : Boutons pour copier, télécharger en PDF et partager l'essai

### 2. Panneau principal (70% de l'écran)

**Contenu principal :**
- **Affichage de l'essai actuel** :
  - Titre de section "Version actuelle" avec badge de version (ex: "v3")
  - Texte formaté de l'essai avec paragraphes clairement délimités
  - Compteur de mots/caractères flottant indiquant "[Nombre actuel]/[Limite]"
  - Icônes pour basculer en mode focus (plein écran)

**Zone d'informations :**
- **Section pliable "À propos de cet essai"** :
  - Prompt/sujet original
  - Ton et style choisis
  - Contexte additionnel fourni
  - Date de dernière modification

### 3. Panneau latéral (30% de l'écran)

**Historique des versions :**
- **Timeline verticale** avec points de connexion
- Pour chaque version :
  - Numéro de version et date
  - Badge "Actuelle" pour la version affichée
  - Résumé des modifications apportées (si applicable)
  - Actions : "Afficher", "Comparer" et "Utiliser comme base" (pour révision)

**Statistiques :**
- Carte affichant :
  - Nombre de mots/caractères
  - Nombre de paragraphes
  - Temps de lecture estimé
  - Complexité textuelle (score de lisibilité)
  - Jauge visuelle comparant à la limite

**Actions principales :**
- Bouton primaire "Demander une révision"
- Bouton secondaire "Exporter"
- Liste des prochaines étapes recommandées (avec icônes)

## États et transitions

### État 1: Consultation
L'état par défaut affichant la version actuelle de l'essai avec toutes les informations associées.

### État 2: Comparaison
Déclenché par le bouton "Comparer" sur une version différente de la version actuelle:
- L'interface se divise horizontalement
- La version actuelle à gauche, la version sélectionnée à droite
- Les différences sont surlignées (suppressions en rouge, ajouts en vert)
- Un bouton "Définir comme version actuelle" apparaît pour la version comparée

### État 3: Demande de révision
Déclenché par le bouton "Demander une révision":
- Un panneau s'ouvre sur la droite
- Champs pour spécifier les instructions de révision
- Possibilité de surligner des sections spécifiques de l'essai pour commentaires
- Options pour le type de révision (style, contenu, structure, etc.)
- Bouton "Générer révision"

### État 4: Génération en cours
Après avoir demandé une révision:
- Indication visuelle de progression
- Estimation du temps restant
- Possibilité d'annuler

### État 5: Révision générée
Après la génération d'une nouvelle version:
- Transition automatique vers l'interface de comparaison (similaire à EditedEssayInterface)
- Ancienne version à gauche, nouvelle version à droite
- Boutons "Accepter la révision" ou "Rejeter"

## Éléments d'interaction

### Mode focus
- Activé par un bouton dédié
- Masque les éléments d'interface non essentiels
- Agrandit le texte pour une meilleure lisibilité
- Compteur flottant minimaliste
- Contrôles d'action minimalistes en bas d'écran

### Sélection de texte
- Sélectionner du texte fait apparaître un menu contextuel
- Options: surligner, commenter, demander une révision spécifique
- Les surlignages sont visibles lors de la demande de révision

### Navigation entre versions
- Cliquer sur une version dans la timeline l'affiche instantanément
- Animation de transition entre les versions
- Indicateur visuel de la différence de longueur entre versions

## Design visuel

### Palette de couleurs
- Couleur principale: Bleu royal (#4361ee)
- Accent: Turquoise (#06B6D4)
- Succès: Vert émeraude (#10B981)
- Avertissement: Orange (#F59E0B)
- Danger: Rouge (#EF4444)
- Fond principal: Blanc (#FFFFFF)
- Fond secondaire: Gris très clair (#F9FAFB)

### Typographie
- Titres: Inter, semi-bold, 24px/18px/16px
- Corps du texte: Inter, regular, 16px
- Métadonnées: Inter, medium, 14px
- Interface: Inter, medium, 14px

### Éléments visuels
- Carte principale avec ombre légère et bordure arrondie (12px)
- Timeline avec points de connexion colorés selon l'état
- Icônes minimalistes et cohérentes (Lucide ou équivalent)
- Transitions fluides entre les états (300ms)
- Feedback visuel instantané pour toutes les actions

## Responsive Design

### Tablette (< 1024px)
- Le panneau latéral se déplace sous le panneau principal
- La timeline devient horizontale
- Les statistiques s'affichent en grille de 2x3

### Mobile (< 768px)
- Navigation par onglets entre contenu et historique
- Timeline affichée sous forme de liste compacte
- Actions principales fixées en bas de l'écran
- Mode focus automatique pour la lecture

## Interactions clavier et accessibilité

### Raccourcis clavier
- `Ctrl+F` : Activer/désactiver le mode focus
- `Ctrl+C` : Copier l'essai entier
- `Ctrl+P` : Télécharger en PDF
- `Ctrl+→/←` : Naviguer entre les versions
- `Esc` : Quitter les modes spéciaux

### Accessibilité
- Structure sémantique complète (ARIA)
- Contraste élevé pour tous les textes
- Support complet du clavier
- Messages d'état pour lecteurs d'écran
- Tailles ajustables pour tout le texte

## Points UX spécifiques

1. **Transition fluide depuis SchoolEssayList**
   - Animation d'ouverture depuis la ligne du tableau
   - Préchargement des données en arrière-plan

2. **Feedback constant sur l'état**
   - Toasts discrets pour confirmer les actions
   - Indicateurs de progression pour les opérations longues
   - Persistance d'état entre navigations

3. **Prévention des pertes de données**
   - Sauvegarde automatique des versions
   - Confirmation avant de quitter une révision non terminée
   - Option de restauration des versions précédentes

4. **Intégration naturelle avec EssayGenerator**
   - Réutilisation des paradigmes d'interface
   - Transition fluide vers/depuis le générateur
   - Partage du contexte entre les composants

## Flux utilisateur principaux

### Flux 1: Consultation simple
1. L'utilisateur clique sur un essai dans SchoolEssayList
2. SchoolEssaySingle s'ouvre affichant la dernière version
3. L'utilisateur lit l'essai, consulte les statistiques
4. L'utilisateur peut copier ou télécharger l'essai

### Flux 2: Révision complète
1. L'utilisateur demande une révision
2. Il rédige des instructions spécifiques
3. Le système génère une nouvelle version
4. Interface de comparaison s'affiche
5. L'utilisateur accepte ou refuse la révision
6. La nouvelle version est ajoutée à la timeline

### Flux 3: Exploration de l'historique
1. L'utilisateur navigue dans la timeline
2. Il sélectionne une ancienne version
3. Il compare avec la version actuelle
4. Il peut choisir de revenir à cette version

## Notes d'implémentation

- Réutiliser les composants d'EditedEssayInterface pour la comparaison
- Adapter EssayStep3 pour le mode de révision
- S'assurer que la persistance des données est cohérente avec EssayGenerator
- Maintenir les états dans un store global pour éviter les pertes pendant la navigation 