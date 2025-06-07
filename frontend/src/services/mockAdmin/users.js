// Mock data for users
const generateMockUsers = (count) => {
  const plans = ['Free', 'Standard', 'Premium', 'Enterprise'];
  const statuses = ['active', 'inactive', 'pending', 'banned'];
  
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
    const randomPlan = plans[Math.floor(Math.random() * plans.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id,
      firstName: ['John', 'Mary', 'Thomas', 'Sophie', 'Lucas', 'Emma', 'Leo', 'Chloe'][Math.floor(Math.random() * 8)],
      lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson'][Math.floor(Math.random() * 8)],
      email: `user${id}@example.com`,
      createdAt: randomDate.toISOString(),
      plan: randomPlan,
      status: randomStatus,
      avatar: null,
      usage: {
        logins: Math.floor(Math.random() * 50),
        searches: Math.floor(Math.random() * 200),
        agentsUsed: Math.floor(Math.random() * 8)
      },
      schools: Array.from(
        { length: Math.floor(Math.random() * 6) }, 
        (_, i) => ({
          id: i + 1,
          name: ['Harvard Medical School', 'Johns Hopkins', 'Mayo Clinic Alix', 'Stanford Medicine', 'UCSF School of Medicine'][Math.floor(Math.random() * 5)]
        })
      )
    };
  });
};

// Generate users
let mockUsers = generateMockUsers(50);

// Function to retrieve paginated user list with filters
export const getUsersList = (page = 1, pageSize = 10, filters = {}) => {
  let filteredUsers = [...mockUsers];
  
  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.status) {
    filteredUsers = filteredUsers.filter(user => user.status === filters.status);
  }
  
  if (filters.plan) {
    filteredUsers = filteredUsers.filter(user => user.plan === filters.plan);
  }
  
  if (filters.dateFrom) {
    const dateFrom = new Date(filters.dateFrom);
    filteredUsers = filteredUsers.filter(user => new Date(user.createdAt) >= dateFrom);
  }
  
  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo);
    filteredUsers = filteredUsers.filter(user => new Date(user.createdAt) <= dateTo);
  }
  
  // Pagination
  const totalCount = filteredUsers.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
  
  return {
    users: paginatedUsers,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages
    }
  };
};

// Function to retrieve a user by ID
export const getUserDetails = (id) => {
  const user = mockUsers.find(user => user.id === parseInt(id));
  
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }
  
  // Add additional data for detailed view
  return {
    ...user,
    address: {
      street: '123 Main Street',
      city: 'New York',
      zipCode: '10001',
      country: 'USA'
    },
    phone: '+1 555-123-4567',
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
    verifiedEmail: Math.random() > 0.2, // 80% of users have verified their email
    billingInfo: {
      type: Math.random() > 0.7 ? 'credit_card' : 'paypal',
      lastPayment: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      nextPayment: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    }
  };
};

// Function to retrieve a user's activity history
export const getUserActivity = () => {
  const activities = [];
  
  // Generate random activities
  const activityTypes = [
    'Performed a search',
    'Viewed a school',
    'Logged in',
    'Updated profile',
    'Changed plan',
    'Interacted with AI agent',
    'Downloaded a document'
  ];
  
  // Generate between 5 and 15 activities
  const activityCount = 5 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < activityCount; i++) {
    const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
    
    activities.push({
      id: i + 1,
      type: randomType,
      timestamp: randomDate.toISOString(),
      details: randomType === 'Viewed a school' 
        ? { schoolName: ['Harvard Medical School', 'Johns Hopkins', 'Mayo Clinic Alix', 'Stanford Medicine', 'UCSF School of Medicine'][Math.floor(Math.random() * 5)] }
        : randomType === 'Interacted with AI agent'
        ? { agentName: ['General Assistant', 'Admission Advisor', 'Interview Expert', 'CV Analyst'][Math.floor(Math.random() * 4)] }
        : null
    });
  }
  
  // Sort by descending date
  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Function to update a user
export const updateUser = (id, userData) => {
  const index = mockUsers.findIndex(user => user.id === parseInt(id));
  
  if (index === -1) {
    throw new Error(`User with ID ${id} not found`);
  }
  
  mockUsers[index] = {
    ...mockUsers[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  return mockUsers[index];
};

// Function to update a user's status
export const updateUserStatus = (id, status) => {
  const validStatuses = ['active', 'inactive', 'pending', 'banned'];
  
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  
  return updateUser(id, { status });
};

// Function to delete a user
export const deleteUser = (id) => {
  const index = mockUsers.findIndex(user => user.id === parseInt(id));
  
  if (index === -1) {
    throw new Error(`User with ID ${id} not found`);
  }
  
  mockUsers = mockUsers.filter(user => user.id !== parseInt(id));
  
  return { success: true, message: `User with ID ${id} successfully deleted` };
};

// Function to create a new user
export const createUser = (userData) => {
  const newId = Math.max(...mockUsers.map(user => user.id)) + 1;
  
  const newUser = {
    id: newId,
    createdAt: new Date().toISOString(),
    status: 'active',
    ...userData
  };
  
  mockUsers.push(newUser);
  
  return newUser;
}; 