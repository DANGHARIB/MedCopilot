import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UsersList from '../../components/admin/users/UsersList';
import UserDetails from '../../components/admin/users/UserDetails';
import UserForm from '../../components/admin/users/UserForm';

const UsersView = () => {
  return (
    <Routes>
      <Route index element={<UsersList />} />
      <Route path="new" element={<UserForm />} />
      <Route path=":id" element={<UserDetails />} />
      <Route path=":id/edit" element={<UserForm />} />
      <Route path="*" element={<Navigate to="/admin/users" replace />} />
    </Routes>
  );
};

export default UsersView; 