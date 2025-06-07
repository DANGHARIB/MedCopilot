import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminBreadcrumbs from '../layout/AdminBreadcrumbs';
import StatusBadge from '../common/StatusBadge';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { getUserDetails, getUserActivity, deleteUser, updateUserStatus } from '../../../services/mockAdmin/users';
import './UserDetails.css';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Charger les détails de l'utilisateur et ses activités
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les détails de l'utilisateur
        const userData = await getUserDetails(id);
        setUser(userData);
        
        // Récupérer l'historique d'activité
        const activityData = await getUserActivity();
        setActivities(activityData);
        
      } catch (err) {
        console.error(`Erreur lors du chargement des données de l'utilisateur:`, err);
        setError(`Impossible de charger les informations de l'utilisateur. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id]);

  // Gérer la suppression de l'utilisateur
  const handleDeleteUser = async () => {
    try {
      await deleteUser(id);
      navigate('/admin/users', { 
        state: { 
          notification: {
            type: 'success',
            message: `L'utilisateur ${user.firstName} ${user.lastName} a été supprimé avec succès.`
          }
        }
      });
    } catch (err) {
      console.error(`Erreur lors de la suppression de l'utilisateur:`, err);
      setError(`Impossible de supprimer l'utilisateur. ${err.message}`);
      setIsDeleteDialogOpen(false);
    }
  };

  // Gérer le changement de statut de l'utilisateur
  const handleStatusChange = async () => {
    try {
      await updateUserStatus(id, newStatus);
      setUser(prev => ({ ...prev, status: newStatus }));
      setIsStatusDialogOpen(false);
    } catch (err) {
      console.error(`Erreur lors de la mise à jour du statut:`, err);
      setError(`Impossible de mettre à jour le statut. ${err.message}`);
      setIsStatusDialogOpen(false);
    }
  };

  // Ouvrir la boîte de dialogue de changement de statut
  const openStatusDialog = (status) => {
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

  // Formater une date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Rendu du contenu de l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'activity':
        return renderActivityTab();
      default:
        return renderProfileTab();
    }
  };

  // Rendu de l'onglet profil
  const renderProfileTab = () => {
    if (!user) return null;
    
    return (
      <div className="user-profile-tab">
        <div className="user-info-section">
          <h3 className="section-title">Informations personnelles</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Prénom</span>
              <span className="info-value">{user.firstName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Nom</span>
              <span className="info-value">{user.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Téléphone</span>
              <span className="info-value">{user.phone || 'Non renseigné'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date d'inscription</span>
              <span className="info-value">{formatDate(user.createdAt)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Dernière connexion</span>
              <span className="info-value">{formatDate(user.lastLogin)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email vérifié</span>
              <span className="info-value">
                {user.verifiedEmail ? (
                  <span className="verification-status verified">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Vérifié
                  </span>
                ) : (
                  <span className="verification-status not-verified">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    Non vérifié
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="user-info-section">
          <h3 className="section-title">Adresse</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Rue</span>
              <span className="info-value">{user.address?.street || 'Non renseignée'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ville</span>
              <span className="info-value">{user.address?.city || 'Non renseignée'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Code postal</span>
              <span className="info-value">{user.address?.zipCode || 'Non renseigné'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Pays</span>
              <span className="info-value">{user.address?.country || 'Non renseigné'}</span>
            </div>
          </div>
        </div>
        
        <div className="user-info-section">
          <h3 className="section-title">Abonnement</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Forfait</span>
              <span className="info-value">{user.plan}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Méthode de paiement</span>
              <span className="info-value">
                {user.billingInfo?.type === 'credit_card' ? 'Carte de crédit' : 
                 user.billingInfo?.type === 'paypal' ? 'PayPal' : 'Non renseignée'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Dernier paiement</span>
              <span className="info-value">{formatDate(user.billingInfo?.lastPayment)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Prochain paiement</span>
              <span className="info-value">{formatDate(user.billingInfo?.nextPayment)}</span>
            </div>
          </div>
        </div>
        
        <div className="user-info-section">
          <h3 className="section-title">Écoles suivies</h3>
          {user.schools && user.schools.length > 0 ? (
            <ul className="schools-list">
              {user.schools.map(school => (
                <li key={school.id} className="school-item">
                  {school.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data-message">Aucune école suivie</p>
          )}
        </div>
        
        <div className="user-info-section">
          <h3 className="section-title">Statistiques d'utilisation</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{user.usage?.logins || 0}</div>
              <div className="stat-label">Connexions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{user.usage?.searches || 0}</div>
              <div className="stat-label">Recherches</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{user.usage?.agentsUsed || 0}</div>
              <div className="stat-label">Agents utilisés</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rendu de l'onglet activité
  const renderActivityTab = () => {
    return (
      <div className="user-activity-tab">
        <div className="activity-list">
          {activities.length === 0 ? (
            <p className="no-data-message">Aucune activité enregistrée</p>
          ) : (
            activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-type">{activity.type}</span>
                    <span className="activity-time">{formatDate(activity.timestamp)}</span>
                  </div>
                  {activity.details && (
                    <div className="activity-details">
                      {activity.details.schoolName && (
                        <span>École: {activity.details.schoolName}</span>
                      )}
                      {activity.details.agentName && (
                        <span>Agent: {activity.details.agentName}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Icônes pour les différents types d'activités
  const getActivityIcon = (type) => {
    switch (type) {
      case 'A effectué une recherche':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        );
      case 'A consulté une école':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case 'S\'est connecté':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
        );
      case 'A modifié son profil':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        );
      case 'A changé de forfait':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        );
      case 'A interagi avec un agent IA':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case 'A téléchargé un document':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  // Si chargement en cours
  if (loading) {
    return (
      <div className="admin-user-details">
        <AdminBreadcrumbs />
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <p>Chargement des informations de l'utilisateur...</p>
        </div>
      </div>
    );
  }

  // Si erreur
  if (error) {
    return (
      <div className="admin-user-details">
        <AdminBreadcrumbs />
        <div className="admin-error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
        <div className="admin-error-actions">
          <Link to="/admin/users" className="admin-button secondary">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  // Si utilisateur non trouvé
  if (!user) {
    return (
      <div className="admin-user-details">
        <AdminBreadcrumbs />
        <div className="admin-error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Utilisateur non trouvé.
        </div>
        <div className="admin-error-actions">
          <Link to="/admin/users" className="admin-button secondary">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-user-details">
      <AdminBreadcrumbs />
      
      <header className="admin-content-header">
        <div className="user-header-left">
          <h1>{user.firstName} {user.lastName}</h1>
          <StatusBadge status={user.status} type={user.status} size="medium" />
        </div>
        
        <div className="user-header-actions">
          <div className="user-status-actions">
            {user.status !== 'active' && (
              <button 
                className="admin-button success"
                onClick={() => openStatusDialog('active')}
              >
                Activer
              </button>
            )}
            {user.status === 'active' && (
              <button 
                className="admin-button warning"
                onClick={() => openStatusDialog('inactive')}
              >
                Désactiver
              </button>
            )}
            {user.status !== 'banned' && (
              <button 
                className="admin-button danger"
                onClick={() => openStatusDialog('banned')}
              >
                Bannir
              </button>
            )}
          </div>
          
          <Link to={`/admin/users/${id}/edit`} className="admin-button primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Modifier
          </Link>
          
          <button 
            className="admin-button danger"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Supprimer
          </button>
        </div>
      </header>
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profil
        </button>
        <button 
          className={`admin-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activité
        </button>
      </div>
      
      <div className="admin-tab-content">
        {renderTabContent()}
      </div>
      
      {/* Boîte de dialogue de confirmation de suppression */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        type="danger"
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
      
      {/* Boîte de dialogue de confirmation de changement de statut */}
      <ConfirmationDialog
        isOpen={isStatusDialogOpen}
        title={
          newStatus === 'active' ? "Activer l'utilisateur" :
          newStatus === 'inactive' ? "Désactiver l'utilisateur" :
          newStatus === 'banned' ? "Bannir l'utilisateur" : 
          "Modifier le statut"
        }
        message={
          newStatus === 'active' ? `Êtes-vous sûr de vouloir activer l'utilisateur ${user.firstName} ${user.lastName} ?` :
          newStatus === 'inactive' ? `Êtes-vous sûr de vouloir désactiver l'utilisateur ${user.firstName} ${user.lastName} ?` :
          newStatus === 'banned' ? `Êtes-vous sûr de vouloir bannir l'utilisateur ${user.firstName} ${user.lastName} ? Cela l'empêchera d'accéder à tous les services.` :
          `Êtes-vous sûr de vouloir modifier le statut de l'utilisateur ${user.firstName} ${user.lastName} ?`
        }
        confirmLabel={
          newStatus === 'active' ? "Activer" :
          newStatus === 'inactive' ? "Désactiver" :
          newStatus === 'banned' ? "Bannir" : "Confirmer"
        }
        cancelLabel="Annuler"
        type={
          newStatus === 'active' ? "success" :
          newStatus === 'inactive' ? "warning" :
          newStatus === 'banned' ? "danger" : "info"
        }
        onConfirm={handleStatusChange}
        onCancel={() => setIsStatusDialogOpen(false)}
      />
    </div>
  );
};

export default UserDetails; 