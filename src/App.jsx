import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Accueil from './views/Accueil.jsx';
import About from './views/FooterPages/About.jsx';
import TermsOfService from './views/FooterPages/TermsOfService.jsx';
import PrivacyPolicy from './views/FooterPages/PrivacyPolicy.jsx';
import MedicalSchoolView from './views/FooterPages/MedicalSchoolView.jsx';
import BlogView from './views/FooterPages/BlogView.jsx';
import BlogPost from './views/FooterPages/BlogPost.jsx';
import SignIn from './views/Auth/SignIn.jsx';
import SignUp from './views/Auth/SignUp.jsx';
import Profile from './views/Profile/Profile.jsx';
import Agents from './views/FooterPages/Agents.jsx';
import Subscriptions from './views/Subscriptions.jsx';
import PaymentInterface from './views/PaymentInterface.jsx';
import plansData from './data/plans.json';
import Timeline from './views/Profile/Timeline.jsx';
import ViewAllMedicalSchool from './views/Profile/ViewAllMedicalSchool.jsx';
import EssayGenerator from './views/Profile/Essay/EssayGenerator.jsx';
import GetAllEssays from './views/Profile/GetAllEssays.jsx';
import SchoolEssayList from './views/Profile/SchoolEssayList.jsx';
import SchoolEssaySingle from './views/Profile/Essay/SchoolEssaySingle/SchoolEssaySingle.jsx';
import Settings from './views/Profile/UserSettings/Settings.jsx';
import PaymentMethods from './views/Profile/UserSettings/PaymentMethods.jsx';
import ProfileWizard from './components/user/profile/ProfileWizard.jsx';
// Composant de test des règles .cursorrules
import TestWrapper from './components/test/TestWrapper.jsx';
// Nouveau composant NewEssayStep3
import NewEssayStep3 from './components/user/essayFlow/NewEssayStep3.jsx';
// Admin components
import AdminLayout from './components/admin/layout/AdminLayout.jsx';
import Dashboard from './views/Admin/Dashboard.jsx';
import UsersView from './views/Admin/UsersView.jsx';
import SchoolsView from './views/Admin/SchoolsView.jsx';

// Composant pour le scroll automatique en haut de page lors des changements de route
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
};

// Wrapper pour le ProfileWizard avec redirection après complétion
const ProfileSetupWrapper = () => {
  const navigate = useNavigate();
  
  const handleCompleteProfile = (formData) => {
    console.log('Profil complété avec les données:', formData);
    // Ici, vous pourriez enregistrer les données du profil via une API
    // Exemple: await profileService.saveProfile(formData);
    
    // Rediriger vers le dashboard après la complétion
    navigate('/profile/information');
  };
  
  return (
    <ProfileWizard onCompleteProfile={handleCompleteProfile} />
  );
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Effet pour simuler le chargement initial de l'application
  useEffect(() => {
    // Ajouter la classe 'no-scroll' durant le chargement
    document.body.classList.add('no-scroll');
    
    // Simuler un temps de chargement court
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.classList.remove('no-scroll');
    }, 300);
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className={`app ${isLoaded ? 'app--loaded' : 'app--loading'}`}>
      {/* Écran de chargement */}
      <div className={`app__loader ${isLoaded ? 'app__loader--hidden' : ''}`}>
        <div className="app__loader-spinner"></div>
      </div>
      
      {/* Contenu principal */}
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* ============= ROUTES PRINCIPALES ============= */}
          <Route path="/" element={<Accueil />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/medical-schools" element={<MedicalSchoolView />} />
          <Route path="/blog" element={<BlogView />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payment" element={<PaymentInterface subscriptionPlans={plansData} />} />
          
          {/* ============= ROUTE DE TEST DES RÈGLES ============= */}
          <Route path="/test-rules" element={<TestWrapper />} />
          
          {/* ============= ROUTE DE TEST DU NOUVEAU ESSAY STEP 3 ============= */}
          <Route path="/test-essay-step3" element={<NewEssayStep3 />} />
          
          {/* ============= REDIRECTION PAR DÉFAUT VERS SCHOOLS ============= */}
          <Route path="/profile" element={<Navigate to="/schools" replace />} />
          
          {/* ============= ROUTES DE PROFIL ============= */}
          <Route path="/profile/setup" element={<ProfileSetupWrapper />} />
          <Route path="/profile/information" element={<Profile />} />
          <Route path="/profile/personal-statement" element={<Profile />} />
          <Route path="/profile/experiences" element={<Profile />} />
          <Route path="/profile/impactful-experiences" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/settings/payment-methods" element={<PaymentMethods />} />
          <Route path="/assistants" element={<Profile />} />
          <Route path="/schools" element={<Profile />} />
          <Route path="/timeline" element={<Profile />} />
          <Route path="/viewAllSchool" element={<ViewAllMedicalSchool />} />
          <Route path="/essay-generator" element={<EssayGenerator />} />
          <Route path="/schools/:schoolId/essays" element={<SchoolEssayList />} />
          <Route path="/schools/:schoolId/essays/:essayId" element={<SchoolEssaySingle />} />
          <Route path="/subscription" element={<Profile />} />
          <Route path="/history" element={<Profile />} />
          <Route path="/get-all-essays" element={<GetAllEssays />} />
          
          {/* ============= ROUTES ADMIN ============= */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* Gestion des utilisateurs */}
            <Route path="users/*" element={<UsersView />} />
            
            {/* Gestion des agents IA */}
            <Route path="agents" element={<div>Liste des agents IA - À implémenter</div>} />
            <Route path="agents/new" element={<div>Nouvel agent IA - À implémenter</div>} />
            <Route path="agents/:id" element={<div>Détail agent IA - À implémenter</div>} />
            <Route path="agents/:id/edit" element={<div>Modifier agent IA - À implémenter</div>} />
            
            {/* Gestion des écoles */}
            <Route path="schools/*" element={<SchoolsView />} />
            
            {/* Gestion des événements */}
            <Route path="events" element={<div>Liste des événements - À implémenter</div>} />
            <Route path="events/new" element={<div>Nouvel événement - À implémenter</div>} />
            <Route path="events/:id" element={<div>Détail événement - À implémenter</div>} />
            <Route path="events/:id/edit" element={<div>Modifier événement - À implémenter</div>} />
            
            {/* Gestion du blog */}
            <Route path="blog" element={<div>Liste des articles - À implémenter</div>} />
            <Route path="blog/new" element={<div>Nouvel article - À implémenter</div>} />
            <Route path="blog/:id" element={<div>Détail article - À implémenter</div>} />
            <Route path="blog/:id/edit" element={<div>Modifier article - À implémenter</div>} />
            
            {/* Gestion des forfaits */}
            <Route path="plans" element={<div>Liste des forfaits - À implémenter</div>} />
            <Route path="plans/new" element={<div>Nouveau forfait - À implémenter</div>} />
            <Route path="plans/:id" element={<div>Détail forfait - À implémenter</div>} />
            <Route path="plans/:id/edit" element={<div>Modifier forfait - À implémenter</div>} />
          </Route>
          
          {/* Route 404 */}
          <Route path="*" element={
            <div className="app__not-found">
              <h1>404</h1>
              <p>Page non trouvée</p>
              <a href="/" className="app__not-found-link">Retour à l'accueil</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;