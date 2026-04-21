// Utility functions for the Task Allocation Engine

// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate skill match percentage between team member skills and task requirements
export const calculateSkillMatch = (memberSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!memberSkills || memberSkills.length === 0) return 0;

  const matchedSkills = requiredSkills.filter(skill =>
    memberSkills.some(memberSkill =>
      memberSkill.toLowerCase().trim() === skill.toLowerCase().trim()
    )
  );

  return Math.round((matchedSkills.length / requiredSkills.length) * 100);
};

// Get matched and missing skills
export const getSkillAnalysis = (memberSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { matchedSkills: [], missingSkills: [] };
  }

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(skill => {
    const isMatched = memberSkills.some(memberSkill =>
      memberSkill.toLowerCase().trim() === skill.toLowerCase().trim()
    );

    if (isMatched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  return { matchedSkills, missingSkills };
};

// Calculate workload impact after assigning a task
export const calculateWorkloadImpact = (currentWorkload, taskComplexity = 'medium') => {
  const complexityImpact = {
    low: 5,
    medium: 10,
    high: 15
  };

  const impact = complexityImpact[taskComplexity] || 10;
  const newWorkload = Math.min(100, currentWorkload + impact);

  return {
    impact,
    newWorkload,
    isOverloaded: newWorkload > 90
  };
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Sort array by specified field
export const sortByField = (array, field, direction = 'asc') => {
  return [...array].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    // Handle string comparison
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (direction === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
};

// Filter array by search term
export const filterBySearchTerm = (array, searchTerm, fields) => {
  if (!searchTerm || searchTerm.trim() === '') return array;

  const term = searchTerm.toLowerCase().trim();

  return array.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      if (Array.isArray(value)) {
        return value.some(v =>
          typeof v === 'string' && v.toLowerCase().includes(term)
        );
      }
      return false;
    });
  });
};

// Get priority color class
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100'
  };
  return colors[priority] || colors.medium;
};

// Get status color class
export const getStatusColor = (status) => {
  const colors = {
    pending: 'text-gray-600 bg-gray-100',
    'in-progress': 'text-blue-600 bg-blue-100',
    completed: 'text-green-600 bg-green-100'
  };
  return colors[status] || colors.pending;
};

// Format percentage with proper color coding
export const getWorkloadColor = (workload) => {
  if (workload >= 90) return 'text-red-600';
  if (workload >= 70) return 'text-yellow-600';
  return 'text-green-600';
};

// Calculate allocation score (combination of skill match and workload)
export const calculateAllocationScore = (skillMatch, currentWorkload, taskPriority) => {
  const priorityWeights = {
    low: 0.8,
    medium: 1.0,
    high: 1.2
  };

  const workloadPenalty = currentWorkload > 80 ? 0.7 : currentWorkload > 60 ? 0.85 : 1.0;
  const priorityWeight = priorityWeights[taskPriority] || 1.0;

  const score = (skillMatch * workloadPenalty * priorityWeight);

  return Math.min(100, Math.round(score));
};

// Export data to CSV format
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle arrays and objects
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        }
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value)}"`;
        }
        // Escape quotes and commas in strings
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Show notification using toast system
export const showNotification = (message, type = 'info') => {
  if (window.showToast) {
    window.showToast(message, type);
  } else {
    // Fallback for development
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
};
