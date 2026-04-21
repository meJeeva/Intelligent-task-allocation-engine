import React, { useState } from 'react';
import Badge from '../common/Badge';

const AllocationTable = ({
  allocations = [],
  loading = false,
  onRunAllocation
}) => {
  const [hoveredAllocation, setHoveredAllocation] = useState(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Running intelligent allocation algorithm...</p>
        <p className="text-sm text-gray-500 mt-2">Analyzing skills, workload, and performance metrics</p>
      </div>
    );
  }

  if (allocations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No allocation data available</h3>
          <p className="text-gray-500 mb-6">Run the intelligent allocation algorithm to see optimal task assignments</p>
          <button
            onClick={onRunAllocation}
            className="btn-primary"
          >
            Run Allocation
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'danger';
  };

  const getWorkloadStatus = (newWorkload) => {
    if (newWorkload >= 95) return { color: 'danger', label: 'Overloaded', icon: '!' };
    if (newWorkload >= 80) return { color: 'warning', label: 'High Load', icon: '!' };
    if (newWorkload >= 60) return { color: 'info', label: 'Balanced', icon: 'i' };
    return { color: 'success', label: 'Available', icon: 'i' };
  };

  const avgScore = Math.round(allocations.reduce((sum, a) => sum + a.suitabilityScore, 0) / allocations.length);
  const overloadedCount = allocations.filter(a => a.updatedWorkload >= 95).length;
  const balancedCount = allocations.filter(a => a.updatedWorkload >= 60 && a.updatedWorkload < 80).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Allocation Results</h3>
          <p className="text-sm text-gray-600 mt-1">
            Intelligent task assignment based on skills, performance, and workload balance
          </p>
        </div>
        <button
          onClick={onRunAllocation}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Running...' : 'Run Allocation Again'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasks Allocated</p>
              <p className="text-2xl font-bold text-gray-900">{allocations.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">T</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Balanced</p>
              <p className="text-2xl font-bold text-gray-900">{balancedCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">B</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overloaded</p>
              <p className="text-2xl font-bold text-red-600">{overloadedCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600">!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suitability Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skills Match
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated Workload
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allocations.map((allocation, index) => {
              const workloadStatus = getWorkloadStatus(allocation.updatedWorkload);

              return (
                <tr
                  key={index}
                  className={`table-row ${allocation.updatedWorkload >= 95 ? 'bg-red-50' : ''}`}
                  onMouseEnter={() => setHoveredAllocation(index)}
                  onMouseLeave={() => setHoveredAllocation(null)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{allocation.taskTitle}</div>
                    <Badge variant="info" size="small">
                      {allocation.taskDifficulty} difficulty
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{allocation.assigneeName}</div>
                    <div className="text-sm text-gray-500">{allocation.assigneeEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getScoreColor(allocation.suitabilityScore)} size="small">
                        {allocation.suitabilityScore}%
                      </Badge>
                      {hoveredAllocation === index && (
                        <div className="relative group">
                          <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                            <div className="font-medium mb-1">Score Calculation</div>
                            <div>Score calculated using Machine Learning + rule-based logic considering:</div>
                            <ul className="mt-1 ml-4 list-disc">
                              <li>Skill matching accuracy</li>
                              <li>Performance history</li>
                              <li>Current workload balance</li>
                              <li>Task difficulty alignment</li>
                            </ul>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {allocation.matchedSkills?.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="success" size="small">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      {allocation.missingSkills?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {allocation.missingSkills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="danger" size="small">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                        <div
                          className={`h-2 rounded-full ${allocation.updatedWorkload >= 95 ? 'bg-red-600' :
                              allocation.updatedWorkload >= 80 ? 'bg-yellow-600' :
                                allocation.updatedWorkload >= 60 ? 'bg-blue-600' : 'bg-green-600'
                            }`}
                          style={{ width: `${allocation.updatedWorkload}%` }}
                        ></div>
                      </div>
                      <Badge variant={workloadStatus.color} size="small">
                        {allocation.updatedWorkload}%
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {allocation.workloadChange} from current
                    </div>
                    {allocation.updatedWorkload >= 95 && (
                      <div className="text-xs text-red-600 mt-1 font-medium">
                        {workloadStatus.label} - Consider reassignment
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Allocation Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-3">Allocation Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Tasks Allocated:</span>
            <span className="ml-2 font-medium text-blue-900">{allocations.length}</span>
          </div>
          <div>
            <span className="text-blue-700">Average Suitability Score:</span>
            <span className="ml-2 font-medium text-blue-900">{avgScore}%</span>
          </div>
          <div>
            <span className="text-blue-700">High Confidence Matches:</span>
            <span className="ml-2 font-medium text-blue-900">
              {allocations.filter(a => a.suitabilityScore >= 90).length}
            </span>
          </div>
          <div>
            <span className="text-blue-700">Overloaded Members:</span>
            <span className="ml-2 font-medium text-red-600">{overloadedCount}</span>
          </div>
        </div>

        {overloadedCount > 0 && (
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800">
              <strong>Recommendation:</strong> {overloadedCount} team member(s) are overloaded. Consider redistributing tasks or adding more resources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocationTable;
