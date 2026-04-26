import React from 'react';
import Badge from '../common/Badge';

const TaskTable = ({
  tasks = [],
  onEdit,
  onDelete,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-lg font-medium mb-2">No tasks found</div>
        <p className="text-sm">Add your first task to get started</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    // Handle numeric difficulty (1-10 scale)
    if (typeof difficulty === 'number') {
      if (difficulty >= 8) return 'danger';      // High difficulty (8-10)
      if (difficulty >= 5) return 'warning';     // Medium difficulty (5-7)
      return 'success';                          // Low difficulty (1-4)
    }

    // Handle string difficulty (fallback)
    switch (difficulty?.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'assigned':
        return 'primary';
      case 'unassigned':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getDeadlineColor = (deadline) => {
    if (!deadline) return 'default';

    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDeadline < 0) return 'danger';
    if (daysUntilDeadline <= 3) return 'warning';
    if (daysUntilDeadline <= 7) return 'info';
    return 'success';
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline';

    const date = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDeadline < 0) {
      return `Overdue by ${Math.abs(daysUntilDeadline)} days`;
    } else if (daysUntilDeadline === 0) {
      return 'Due today';
    } else if (daysUntilDeadline === 1) {
      return 'Due tomorrow';
    } else if (daysUntilDeadline <= 7) {
      return `Due in ${daysUntilDeadline} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Required Skills
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deadline
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="table-row">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{task.title}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {task.skills?.map((skill, index) => (
                    <Badge key={index} variant="purple" size="small">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getDifficultyColor(task.difficulty)} size="small">
                  {typeof task.difficulty === 'number' ?
                    `${task.difficulty}/10` :
                    (task.difficulty || 'Medium')
                  }
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getDeadlineColor(task.deadline)} size="small">
                  {formatDeadline(task.deadline)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getStatusColor(task.status)} size="small">
                  {task.status || 'unassigned'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(task)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
