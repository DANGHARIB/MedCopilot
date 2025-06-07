import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminBreadcrumbs from '../layout/AdminBreadcrumbs';
import FilterPanel from '../common/FilterPanel';
import StatusBadge from '../common/StatusBadge';
import BulkActionBar from '../common/BulkActionBar';
import ConfirmationDialog from '../common/ConfirmationDialog';
import AdminTable from '../common/AdminTable';
import { getUsersList, deleteUser, updateUserStatus } from '../../../services/mockAdmin/users';
import './UsersList.css';
// Import React Icons
import { FiEye, FiEdit, FiTrash2, FiAlertCircle, FiUsers } from 'react-icons/fi';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { users: loadedUsers, pagination: paginationData } = await getUsersList(
        pagination.page,
        pagination.pageSize,
        filters
      );
      
      setUsers(loadedUsers);
      setPagination(paginationData);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Unable to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.pageSize, filters]);

  // Filter handling
  const handleApplyFilters = (newFilters) => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    setFilters(newFilters);
    setIsFilterExpanded(false);
  };

  const handleResetFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    setFilters({});
    setIsFilterExpanded(false);
  };

  // Pagination handling
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // User selection
  const handleSelectAllUsers = (isChecked) => {
    if (isChecked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, isChecked) => {
    if (isChecked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // User actions
  const handleRowClick = (user) => {
    window.location.href = `/admin/users/${user.id}`;
  };

  const handleDeleteClick = (user = null) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (userToDelete) {
        // Delete single user
        await deleteUser(userToDelete.id);
        setUsers(users.filter(user => user.id !== userToDelete.id));
      } else {
        // Delete multiple users
        for (const userId of selectedUsers) {
          await deleteUser(userId);
        }
        setUsers(users.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Unable to delete user. Please try again later.');
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      
      // Update UI
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Unable to update status. Please try again later.');
    }
  };

  // Filter options
  const filterOptions = [
    {
      id: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Name, email...'
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
        { value: 'banned', label: 'Banned' }
      ]
    },
    {
      id: 'plan',
      label: 'Plan',
      type: 'select',
      options: [
        { value: 'Free', label: 'Free' },
        { value: 'Standard', label: 'Standard' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Enterprise', label: 'Enterprise' }
      ]
    },
    {
      id: 'dateRange',
      label: 'Registration',
      type: 'daterange'
    }
  ];

  // Bulk actions
  const bulkActions = [
    {
      label: 'Activate',
      type: 'success',
      onClick: () => {
        selectedUsers.forEach(userId => handleUpdateStatus(userId, 'active'));
        setSelectedUsers([]);
      }
    },
    {
      label: 'Deactivate',
      type: 'warning',
      onClick: () => {
        selectedUsers.forEach(userId => handleUpdateStatus(userId, 'inactive'));
        setSelectedUsers([]);
      }
    },
    {
      label: 'Delete',
      type: 'danger',
      onClick: () => handleDeleteClick()
    }
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Helper function to determine plan type for styling
  const getPlanType = (plan) => {
    switch (plan) {
      case 'Premium':
        return 'premium';
      case 'Standard':
        return 'standard';
      case 'Enterprise':
        return 'enterprise';
      case 'Free':
        return 'free';
      default:
        return 'default';
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'user',
      header: 'USER',
      width: '110px',
      render: (user) => (
        <div className="user-info">
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <div className="user-initials">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            )}
          </div>
          <div className="user-details">
            <Link to={`/admin/users/${user.id}`} className="user-name">
              {user.firstName} {user.lastName}
            </Link>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'REGISTRATION DATE',
      width: '110px', // Réduit la largeur de la colonne
      render: (user) => formatDate(user.createdAt)
    },
    {
      key: 'plan',
      header: 'PLAN',
      width: '110px', // Largeur fixe pour la colonne plan
      render: (user) => (
        <StatusBadge status={user.plan} type={getPlanType(user.plan)} />
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      width: '110px', // Largeur fixe pour la colonne status
      render: (user) => (
        <StatusBadge status={user.status} type={user.status} />
      )
    }
  ];

  // Table actions
  const tableActions = [
    {
      icon: <FiEye size={16} />,
      onClick: (user) => window.location.href = `/admin/users/${user.id}`,
      label: 'View Details',
      className: 'view'
    },
    {
      icon: <FiEdit size={16} />,
      onClick: (user) => window.location.href = `/admin/users/${user.id}/edit`,
      label: 'Edit',
      className: 'edit'
    },
    {
      icon: <FiTrash2 size={16} />,
      onClick: (user) => handleDeleteClick(user),
      label: 'Delete',
      className: 'delete'
    }
  ];

  // Custom empty state for the table
  const emptyState = (
    <div className="admin-empty-state">
      <div className="admin-empty-icon">
        <FiUsers size={36} />
      </div>
      <h3>No users found</h3>
      <p>Try adjusting your search or filter criteria</p>
      <button 
        className="admin-button secondary small"
        onClick={handleResetFilters}
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="admin-users-list">
      <AdminBreadcrumbs />
      
      <div className="users-list-header">
        <div className="header-content">
          <h1>Users</h1>
          <p className="users-list-subtitle">
            Manage user accounts and permissions
            <span className="admin-count-badge">{pagination.totalCount} total users</span>
          </p>
        </div>
      </div>
      
      <FilterPanel 
        filters={filterOptions}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        initialValues={filters}
        isExpanded={isFilterExpanded}
      />
      
      {error && (
        <div className="admin-error-alert">
          <FiAlertCircle size={16} />
          {error}
        </div>
      )}
      
      <div className="admin-table-container">
        <AdminTable
          columns={columns}
          data={users}
          selectedIds={selectedUsers}
          onSelectAll={handleSelectAllUsers}
          onSelectRow={handleSelectUser}
          actions={tableActions}
          loading={loading}
          emptyState={emptyState}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      </div>
      
      <BulkActionBar 
        selectedCount={selectedUsers.length}
        actions={bulkActions}
        onClearSelection={() => setSelectedUsers([])}
        isVisible={selectedUsers.length > 0}
      />
      
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title={userToDelete ? "Delete User" : "Delete Selected Users"}
        message={userToDelete 
          ? `Are you sure you want to delete the user ${userToDelete.firstName} ${userToDelete.lastName}? This action cannot be undone.` 
          : `Are you sure you want to delete ${selectedUsers.length} selected users? This action cannot be undone.`
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
};

export default UsersList;