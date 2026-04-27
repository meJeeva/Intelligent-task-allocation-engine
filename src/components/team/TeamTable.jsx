import React from 'react';
import Badge from '../common/Badge';

const TeamTable = ({
  members = [],
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

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-lg font-medium mb-2">No team members found</div>
        <p className="text-sm">Add your first team member to get started</p>
      </div>
    );
  }

  const getSkillLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'senior': return 'success';
      case 'mid': return 'warning';
      case 'junior': return 'info';
      default: return 'default';
    }
  };

  const getPerformanceColor = (score) => {
    const normalizedScore = score <= 1 ? score * 100 : score;
    if (normalizedScore >= 90) return 'success';
    if (normalizedScore >= 80) return 'warning';
    return 'danger';
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 90) return 'danger';
    if (workload >= 70) return 'warning';
    return 'success';
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Skills
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Workload
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id} className="table-row">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{member.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{member.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {member.skills?.map((skill, index) => (
                    <Badge key={index} variant="purple" size="small">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getSkillLevelColor(member.level)} size="small">
                  {member.level || 'N/A'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                    <div
                      className={`h-2 rounded-full ${member.workload >= 90 ? 'bg-red-500' :
                        member.workload >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      style={{ width: `${member.workload || 0}%` }}
                    ></div>
                  </div>
                  <Badge variant={getWorkloadColor(member.workload)} size="small">
                    {member.workload || 0}%
                  </Badge>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {member.performance !== undefined ?
                      (member.performance <= 1 ? Math.round(member.performance * 100) : member.performance) :
                      (member.performanceScore || 0)
                    }
                  </span>
                  <Badge
                    variant={getPerformanceColor(member.performance ?? member.performance ?? 0)}
                    size="small"
                  >
                    {(member.performance >= 90) ? 'Excellent' :
                      ( member.performance >= 80) ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(member)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(member.id || member.name?.replace(/\s+/g, '_').toLowerCase() || 'unknown')}
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

export default TeamTable;
