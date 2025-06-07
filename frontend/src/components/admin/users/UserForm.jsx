import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminBreadcrumbs from '../layout/AdminBreadcrumbs';
import { getUserDetails, createUser, updateUser } from '../../../services/mockAdmin/users';
import './UserForm.css';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // État du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active',
    plan: 'Gratuit',
    address: {
      street: '',
      city: '',
      zipCode: '',
      country: ''
    }
  });
  
  // État de validation et erreurs
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);

  // Chargement des données utilisateur en mode édition
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        setLoadError(null);
        
        const userData = await getUserDetails(id);
        
        // Mettre à jour le formulaire avec les données de l'utilisateur
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          status: userData.status || 'active',
          plan: userData.plan || 'Gratuit',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            zipCode: userData.address?.zipCode || '',
            country: userData.address?.country || ''
          }
        });
      } catch (err) {
        console.error(`Erreur lors du chargement des données de l'utilisateur:`, err);
        setLoadError(`Impossible de charger les informations de l'utilisateur. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, isEditMode]);

  // Mettre à jour le state du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Gestion des champs imbriqués (ex: address.street)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Champs simples
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Supprimer l'erreur pour ce champ si elle existe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation des champs obligatoires
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }
    
    if (formData.phone && !/^(\+\d{1,3})?\s?\d{9,15}$/.test(formData.phone)) {
      newErrors.phone = 'Le numéro de téléphone est invalide';
    }
    
    if (formData.address.zipCode && !/^\d{5}$/.test(formData.address.zipCode)) {
      newErrors['address.zipCode'] = 'Le code postal doit contenir 5 chiffres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      let result;
      
      if (isEditMode) {
        // Mise à jour d'un utilisateur existant
        result = await updateUser(id, formData);
        
        navigate(`/admin/users/${id}`, { 
          state: { 
            notification: {
              type: 'success',
              message: `L'utilisateur ${result.firstName} ${result.lastName} a été mis à jour avec succès.`
            }
          }
        });
      } else {
        // Création d'un nouvel utilisateur
        result = await createUser(formData);
        
        navigate(`/admin/users/${result.id}`, { 
          state: { 
            notification: {
              type: 'success',
              message: `L'utilisateur ${result.firstName} ${result.lastName} a été créé avec succès.`
            }
          }
        });
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setSubmitError(`Impossible d'enregistrer l'utilisateur. ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="admin-user-form">
        <AdminBreadcrumbs />
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <p>Chargement des informations...</p>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur de chargement
  if (loadError) {
    return (
      <div className="admin-user-form">
        <AdminBreadcrumbs />
        <div className="admin-error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {loadError}
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
    <div className="admin-user-form">
      <AdminBreadcrumbs />
      
      <header className="admin-content-header">
        <h1>{isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</h1>
      </header>
      
      {submitError && (
        <div className="admin-error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-section">
          <h3 className="section-title">Informations personnelles</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                Prénom <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'invalid' : ''}
                required
              />
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">
                Nom <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'invalid' : ''}
                required
              />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'invalid' : ''}
                required
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'invalid' : ''}
                placeholder="+33 6 12 34 56 78"
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Statut</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="pending">En attente</option>
                <option value="banned">Banni</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="plan">Forfait</label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
              >
                <option value="Gratuit">Gratuit</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3 className="section-title">Adresse</h3>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="street">Rue</label>
              <input
                type="text"
                id="street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Ville</label>
              <input
                type="text"
                id="city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">Code postal</label>
              <input
                type="text"
                id="zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                className={errors['address.zipCode'] ? 'invalid' : ''}
              />
              {errors['address.zipCode'] && <div className="error-message">{errors['address.zipCode']}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Pays</label>
              <input
                type="text"
                id="country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <Link to={isEditMode ? `/admin/users/${id}` : '/admin/users'} className="admin-button secondary">
            Annuler
          </Link>
          <button type="submit" className="admin-button primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="button-spinner"></div>
                {isEditMode ? 'Enregistrement...' : 'Création...'}
              </>
            ) : (
              isEditMode ? 'Enregistrer' : 'Créer l\'utilisateur'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm; 