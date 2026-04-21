import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // You can add authentication token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    } else if (error.response?.status === 404) {
      // Handle not found
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

// Team Management API
export const teamApi = {
  // Get all team members
  getTeam: async () => {
    try {
      const response = await api.get('/api/team');
      return response;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  },

  // Add new team member
  addMember: async (memberData) => {
    try {
      const response = await api.post('/api/team', memberData);
      return response;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  },

  // Update team member
  updateMember: async (id, memberData) => {
    try {
      const response = await api.put(`/api/team/${id}`, memberData);
      return response;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  // Delete team member
  deleteMember: async (id) => {
    try {
      const response = await api.delete(`/api/team/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },
};

// Task Management API
export const taskApi = {
  // Get all tasks
  getTasks: async () => {
    try {
      const response = await api.get('/api/tasks');
      return response;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Add new task
  addTask: async (taskData) => {
    try {
      const response = await api.post('/api/tasks', taskData);
      return response;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/api/tasks/${id}`, taskData);
      return response;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/api/tasks/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};

// Allocation API
export const allocationApi = {
  // Run task allocation algorithm
  runAllocation: async () => {
    try {
      const response = await api.post('/allocate');
      return response;
    } catch (error) {
      console.error('Error running allocation:', error);
      throw error;
    }
  },

  // Get allocation results
  getAllocationResults: async () => {
    try {
      const response = await api.get('/api/allocation/results');
      return response;
    } catch (error) {
      console.error('Error fetching allocation results:', error);
      throw error;
    }
  },
};

// Enhanced Mock data functions for development (when backend is not available)
export const mockApi = {
  // Mock team data with enhanced fields
  getMockTeam: () => {
    return Promise.resolve([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        skills: ['JavaScript', 'React', 'Node.js'],
        skillLevel: 'Senior',
        workload: 75,
        capacity: 100,
        performanceScore: 92
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        skills: ['Python', 'Django', 'PostgreSQL'],
        skillLevel: 'Mid',
        workload: 60,
        capacity: 100,
        performanceScore: 88
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        skills: ['Java', 'Spring', 'MySQL'],
        skillLevel: 'Junior',
        workload: 45,
        capacity: 100,
        performanceScore: 78
      },
      {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        skills: ['React', 'TypeScript', 'GraphQL'],
        skillLevel: 'Senior',
        workload: 85,
        capacity: 100,
        performanceScore: 95
      },
      {
        id: 5,
        name: 'Tom Brown',
        email: 'tom@example.com',
        skills: ['Python', 'Machine Learning', 'TensorFlow'],
        skillLevel: 'Mid',
        workload: 70,
        capacity: 100,
        performanceScore: 85
      }
    ]);
  },

  // Mock tasks data with enhanced fields
  getMockTasks: () => {
    return Promise.resolve([
      {
        id: 1,
        title: 'Build React Dashboard',
        requiredSkills: ['React', 'JavaScript', 'CSS'],
        difficulty: 'High',
        deadline: '2024-02-15',
        status: 'unassigned'
      },
      {
        id: 2,
        title: 'API Integration',
        requiredSkills: ['JavaScript', 'API', 'Axios'],
        difficulty: 'Medium',
        deadline: '2024-02-20',
        status: 'unassigned'
      },
      {
        id: 3,
        title: 'Database Optimization',
        requiredSkills: ['Python', 'SQL', 'PostgreSQL'],
        difficulty: 'Low',
        deadline: '2024-02-25',
        status: 'unassigned'
      },
      {
        id: 4,
        title: 'Machine Learning Model',
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow'],
        difficulty: 'High',
        deadline: '2024-03-01',
        status: 'unassigned'
      },
      {
        id: 5,
        title: 'GraphQL API Development',
        requiredSkills: ['React', 'TypeScript', 'GraphQL'],
        difficulty: 'Medium',
        deadline: '2024-02-18',
        status: 'unassigned'
      }
    ]);
  },

  // Mock allocation results with enhanced data
  getMockAllocationResults: () => {
    return Promise.resolve([
      {
        taskTitle: 'Build React Dashboard',
        taskDifficulty: 'High',
        assigneeName: 'John Doe',
        assigneeEmail: 'john@example.com',
        suitabilityScore: 95,
        matchedSkills: ['React', 'JavaScript'],
        missingSkills: ['CSS'],
        updatedWorkload: 90,
        workloadChange: '+15%'
      },
      {
        taskTitle: 'API Integration',
        taskDifficulty: 'Medium',
        assigneeName: 'John Doe',
        assigneeEmail: 'john@example.com',
        suitabilityScore: 85,
        matchedSkills: ['JavaScript'],
        missingSkills: ['API', 'Axios'],
        updatedWorkload: 85,
        workloadChange: '+10%'
      },
      {
        taskTitle: 'Database Optimization',
        taskDifficulty: 'Low',
        assigneeName: 'Jane Smith',
        assigneeEmail: 'jane@example.com',
        suitabilityScore: 90,
        matchedSkills: ['Python', 'PostgreSQL'],
        missingSkills: ['SQL'],
        updatedWorkload: 80,
        workloadChange: '+20%'
      },
      {
        taskTitle: 'Machine Learning Model',
        taskDifficulty: 'High',
        assigneeName: 'Tom Brown',
        assigneeEmail: 'tom@example.com',
        suitabilityScore: 92,
        matchedSkills: ['Python', 'Machine Learning', 'TensorFlow'],
        missingSkills: [],
        updatedWorkload: 90,
        workloadChange: '+20%'
      },
      {
        taskTitle: 'GraphQL API Development',
        taskDifficulty: 'Medium',
        assigneeName: 'Sarah Williams',
        assigneeEmail: 'sarah@example.com',
        suitabilityScore: 98,
        matchedSkills: ['React', 'TypeScript', 'GraphQL'],
        missingSkills: [],
        updatedWorkload: 100,
        workloadChange: '+15%'
      }
    ]);
  },

  // Mock CRUD operations
  addMember: async (memberData) => {
    const team = await mockApi.getMockTeam();
    const newMember = {
      ...memberData,
      id: Math.max(...team.map(m => m.id)) + 1
    };
    team.push(newMember);
    return newMember;
  },

  updateMember: async (id, memberData) => {
    const team = await mockApi.getMockTeam();
    const index = team.findIndex(m => m.id === parseInt(id));
    if (index !== -1) {
      team[index] = { ...team[index], ...memberData };
      return team[index];
    }
    throw new Error('Member not found');
  },

  deleteMember: async (id) => {
    const team = await mockApi.getMockTeam();
    const index = team.findIndex(m => m.id === parseInt(id));
    if (index !== -1) {
      team.splice(index, 1);
      return { success: true };
    }
    throw new Error('Member not found');
  },

  addTask: async (taskData) => {
    const tasks = await mockApi.getMockTasks();
    const newTask = {
      ...taskData,
      id: Math.max(...tasks.map(t => t.id)) + 1
    };
    tasks.push(newTask);
    return newTask;
  },

  updateTask: async (id, taskData) => {
    const tasks = await mockApi.getMockTasks();
    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      return tasks[index];
    }
    throw new Error('Task not found');
  },

  deleteTask: async (id) => {
    const tasks = await mockApi.getMockTasks();
    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      tasks.splice(index, 1);
      return { success: true };
    }
    throw new Error('Task not found');
  },

  runAllocation: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return await mockApi.getMockAllocationResults();
  }
};

export default api;
