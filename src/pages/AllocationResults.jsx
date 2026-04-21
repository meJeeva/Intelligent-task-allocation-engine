import React, { useState } from 'react';
import Card from '../components/common/Card';
import AllocationTable from '../components/allocation/AllocationTable';
import useFetch from '../hooks/useFetch';
import { allocationApi, mockApi } from '../services/api';
import { showNotification } from '../utils/helpers';

const AllocationResults = () => {
  const [allocationData, setAllocationData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Using mock data for demonstration
  const { data: mockAllocations, refetch } = useFetch(mockApi.getMockAllocationResults);

  const handleRunAllocation = async () => {
    setIsRunning(true);
    try {
      // Try real API first, fallback to mock
      let result;
      try {
        result = await allocationApi.runAllocation();
      } catch (apiError) {
        // If real API fails, use mock API with delay
        result = await mockApi.runAllocation();
      }

      setAllocationData(result);
      showNotification('Task allocation completed successfully!', 'success');
    } catch (error) {
      showNotification('Error running allocation algorithm', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const currentAllocations = allocationData || mockAllocations;

  // Calculate allocation statistics
  const getAllocationStats = () => {
    if (!currentAllocations || currentAllocations.length === 0) {
      return {
        totalAllocated: 0,
        avgMatchScore: 0,
        highConfidenceMatches: 0,
        overloadedAssignments: 0
      };
    }

    const totalAllocated = currentAllocations.length;
    const avgMatchScore = Math.round(
      currentAllocations.reduce((sum, allocation) => sum + allocation.matchScore, 0) / totalAllocated
    );
    const highConfidenceMatches = currentAllocations.filter(a => a.matchScore >= 80).length;
    const overloadedAssignments = currentAllocations.filter(a => a.newWorkload > 90).length;

    return {
      totalAllocated,
      avgMatchScore,
      highConfidenceMatches,
      overloadedAssignments
    };
  };

  const stats = getAllocationStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Allocation Results</h1>
        <p className="text-slate-600 mt-2">View and analyze intelligent task allocation results</p>
      </div>

      {/* Allocation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{stats.totalAllocated}</div>
              <div className="text-sm text-slate-600">Tasks Allocated</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{stats.avgMatchScore || 0}%</div>
              <div className="text-sm text-slate-600">Avg Match Score</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{stats.highConfidenceMatches}</div>
              <div className="text-sm text-slate-600">High Confidence</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.overloadedAssignments}</div>
              <div className="text-sm text-slate-600">Overloaded</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Allocation Algorithm Info */}
      <Card title="Allocation Algorithm">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">How It Works</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Analyzes team member skills and current workload</li>
              <li>• Matches task requirements with team capabilities</li>
              <li>• Considers task priority and complexity</li>
              <li>• Optimizes for balanced workload distribution</li>
              <li>• Provides confidence scores for each assignment</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="text-sm font-medium text-gray-900">Skill Matching</div>
              <div className="text-xs text-gray-600">Finds best skill matches</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">⚖</span>
              </div>
              <div className="text-sm font-medium text-gray-900">Load Balancing</div>
              <div className="text-xs text-gray-600">Distributes workload evenly</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">🎯</span>
              </div>
              <div className="text-sm font-medium text-gray-900">Priority Based</div>
              <div className="text-xs text-gray-600">Considers task priorities</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Allocation Results */}
      <Card>
        <AllocationTable
          allocations={currentAllocations || []}
          loading={isRunning}
          onRunAllocation={handleRunAllocation}
        />
      </Card>

      {/* Export Options */}
      {currentAllocations && currentAllocations.length > 0 && (
        <Card title="Export Options">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Export allocation results for documentation or further analysis.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="btn-secondary"
                onClick={() => {
                  // Export functionality would go here
                  showNotification('Export to CSV feature coming soon!', 'info');
                }}
              >
                Export to CSV
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  // Print functionality would go here
                  window.print();
                }}
              >
                Print Report
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  // Share functionality would go here
                  showNotification('Share feature coming soon!', 'info');
                }}
              >
                Share Results
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {currentAllocations && currentAllocations.length > 0 && (
        <Card title="Recommendations">
          <div className="space-y-3">
            {stats.overloadedAssignments > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-600 mt-1">⚠</span>
                <div>
                  <div className="text-sm font-medium text-yellow-900">
                    Workload Imbalance Detected
                  </div>
                  <div className="text-xs text-yellow-800 mt-1">
                    Consider redistributing tasks or adding more team members to reduce overload.
                  </div>
                </div>
              </div>
            )}

            {stats.avgMatchScore < 70 && (
              <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-600 mt-1">ℹ</span>
                <div>
                  <div className="text-sm font-medium text-blue-900">
                    Skill Gap Identified
                  </div>
                  <div className="text-xs text-blue-800 mt-1">
                    Some tasks require skills not present in the current team. Consider training or hiring.
                  </div>
                </div>
              </div>
            )}

            {stats.avgMatchScore >= 80 && stats.overloadedAssignments === 0 && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-600 mt-1">✓</span>
                <div>
                  <div className="text-sm font-medium text-green-900">
                    Optimal Allocation Achieved
                  </div>
                  <div className="text-xs text-green-800 mt-1">
                    Tasks are well-matched with team skills and workload is balanced.
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AllocationResults;
