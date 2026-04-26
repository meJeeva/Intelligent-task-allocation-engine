import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      console.error('Network Error - Possible CORS issue:', error);
      console.error('URL:', error.config?.url);
      console.error('Method:', error.config?.method);
      console.error('Headers:', error.config?.headers);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - Backend might be down');
    } else if (error.response?.status === 401) {
      console.error('Unauthorized access');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    } else {
      console.error('API Error:', error.message);
      console.error('Error details:', error);
    }

    return Promise.reject(error);
  }
);

export const teamApi = {
  getTeam: async () => {
    const response = await api.get('/team-management/members');
    return response;
  },

  getTeamSummary: async () => {
    const response = await api.get('/team-management/summary');
    return response;
  },

  addMember: async (memberData) => {
    try {
      const apiRequestData = {
        id: `u${Date.now()}`,
        name: memberData.name,
        email: memberData.email || null,
        skill_level: memberData.skills && Array.isArray(memberData.skills) ?
          memberData.skills.reduce((acc, skill) => {
            acc[skill] = memberData.skillLevel === 'Senior' ? 9 :
              memberData.skillLevel === 'Mid' ? 6 : 3;
            return acc;
          }, {}) : {},
        level: memberData.skillLevel?.toLowerCase() || 'junior',
        current_workload: memberData.workload || 0,
        max_capacity: memberData.capacity || 3,
        past_performance: (memberData.performanceScore || 0) / 100
      };

      const response = await api.post('/team-management/members', apiRequestData);
      return response;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  },

  updateMember: async (id, memberData) => {
    try {
      const apiRequestData = {
        id: id,
        name: memberData.name,
        email: memberData.email || null,
        skill_level: memberData.skills && Array.isArray(memberData.skills) ?
          memberData.skills.reduce((acc, skill) => {
            acc[skill] = memberData.skillLevel === 'Senior' ? 10 :
              memberData.skillLevel === 'Mid' ? 6 : 3;
            return acc;
          }, {}) : {},
        level: memberData.skillLevel?.toLowerCase() || 'junior',
        current_workload: memberData.workload || 0,
        max_capacity: memberData.capacity || 5,
        past_performance: (memberData.performanceScore || 0) / 100
      };

      const response = await api.put(`/users/${id}`, apiRequestData);
      return response;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  deleteMember: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },
};

export const taskApi = {
  getTasks: async () => {
    try {
      const response = await api.get('/task-management/tasks');
      return response;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getTaskSummary: async () => {
    try {
      const response = await api.get('/task-management/summary');
      return response;
    } catch (error) {
      console.error('Error fetching task summary:', error);
      throw error;
    }
  },

  addTask: async (taskData) => {
    try {
      let requiredSkills = [];
      if (taskData.required_skills && Array.isArray(taskData.required_skills)) {
        requiredSkills = taskData.required_skills;
      } else if (taskData.requiredSkills) {
        requiredSkills = typeof taskData.requiredSkills === 'string'
          ? taskData.requiredSkills.split(',').map(skill => skill.trim())
          : taskData.requiredSkills;
      }

      const apiRequestData = {
        id: taskData.id || `t${Date.now()}`, // Use provided ID or generate unique ID
        title: taskData.title,
        required_skills: requiredSkills,
        difficulty: typeof taskData.difficulty === 'number'
          ? taskData.difficulty
          : (taskData.difficulty === 'High' ? 8 :
            taskData.difficulty === 'Medium' ? 5 : 3),
        deadline: taskData.deadline || null,
        status: taskData.status || 'pending'
      };

      const response = await api.post('/tasks', apiRequestData);
      return response;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (id, taskData) => {
    try {
      let requiredSkills = [];
      if (taskData.required_skills && Array.isArray(taskData.required_skills)) {
        requiredSkills = taskData.required_skills;
      } else if (taskData.requiredSkills) {
        requiredSkills = typeof taskData.requiredSkills === 'string'
          ? taskData.requiredSkills.split(',').map(skill => skill.trim())
          : taskData.requiredSkills;
      }

      const apiRequestData = {
        id: taskData.id || id,
        title: taskData.title,
        required_skills: requiredSkills,
        difficulty: typeof taskData.difficulty === 'number'
          ? taskData.difficulty
          : (taskData.difficulty === 'High' ? 8 :
            taskData.difficulty === 'Medium' ? 5 : 3),
        deadline: taskData.deadline || null,
        status: taskData.status || 'pending'
      };

      const response = await api.put(`/tasks/${id}`, apiRequestData);
      return response;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
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
      const response = await api.get('/assign');
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

  // Get allocation summary
  getAllocationSummary: async () => {
    try {
      const response = await api.get('/allocation-results/summary');
      return response;
    } catch (error) {
      console.error('Error fetching allocation summary:', error);
      throw error;
    }
  },

  // Get allocation details
  getAllocationDetails: async () => {
    try {
      const response = await api.get('/allocation-results/details');
      return response;
    } catch (error) {
      console.error('Error fetching allocation details:', error);
      throw error;
    }
  },

  // Export allocation results to CSV
  exportToCsv: async () => {
    try {
      const response = await api.get('/allocation-results/export/csv', {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  },

  // Get print report data
  getPrintReport: async () => {
    try {
      const response = await api.get('/allocation-results/print-report');
      return response;
    } catch (error) {
      console.error('Error fetching print report:', error);
      throw error;
    }
  },

  // Share allocation results
  shareResults: async (payload) => {
    try {
      const response = await api.post('/allocation-results/share-results', payload);
      return response;
    } catch (error) {
      console.error('Error sharing results:', error);
      throw error;
    }
  },
};

// Dashboard API
export const dashboardApi = {
  getSummary: async () => {
    try {
      const response = await api.get('/dashboard/summary');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }
};

export default api;
