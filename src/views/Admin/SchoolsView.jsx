import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SchoolsList from '../../components/admin/schools/SchoolsList';
import SchoolDetails from '../../components/admin/schools/SchoolDetails';
import SchoolForm from '../../components/admin/schools/SchoolForm';
import './SchoolsView.css';

/**
 * Composant principal pour la gestion des écoles de médecine
 * Gère le routage entre les différentes vues (liste, détails, création, édition)
 */
const SchoolsView = () => {
  return (
    <div className="schools-view-container">
      <div className="schools-view-content">
        <Routes>
          <Route index element={<SchoolsList />} />
          <Route path="details/:id" element={<SchoolDetails />} />
          <Route path="create" element={<SchoolForm />} />
          <Route path="edit/:id" element={<SchoolForm />} />
          <Route path="*" element={<Navigate to="/admin/schools" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default SchoolsView; 