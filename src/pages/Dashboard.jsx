import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import useFetch from '../hooks/useFetch';
import { dashboardApi } from '../services/api';
import { showNotification } from '../utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch } = useFetch(dashboardApi.getSummary);

  const dashboardSummary = dashboardData || {};

  const totalMembers = dashboardSummary.team_members || 0;
  const activeMembers = dashboardSummary.active_members || 0;
  const totalTasks = dashboardSummary.total_tasks || 0;
  const assignedTasks = dashboardSummary.assigned_tasks || 0;
  const unassignedTasks = dashboardSummary.unassigned_tasks || 0;

  const taskStatusDist = dashboardSummary.task_status_distribution || {};
  const pendingTasks = taskStatusDist.pending || 0;
  const inProgressTasks = taskStatusDist.in_progress || 0;
  const completedTasks = taskStatusDist.completed || 0;

  const taskStatusData = [
    { label: 'Pending', value: pendingTasks, color: 'bg-amber-500' },
    { label: 'In Progress', value: inProgressTasks, color: 'bg-blue-600' },
    { label: 'Completed', value: completedTasks, color: 'bg-green-600' }
  ];

  const recentTasks = dashboardSummary.recent_tasks || [];

  const uniqueSkillsData = dashboardSummary.unique_skills || {};
  const uniqueSkills = uniqueSkillsData.count || 0;
  const allSkillNames = uniqueSkillsData.names || [];

  const statsCards = [
    {
      title: 'Team Members',
      value: totalMembers,
      subtitle: 'Total members',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Members',
      value: activeMembers,
      subtitle: 'Currently working',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      subtitle: 'All tasks',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Assigned Tasks',
      value: assignedTasks,
      subtitle: 'In progress',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Unassigned Tasks',
      value: unassignedTasks,
      subtitle: 'Need allocation',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];


  const handleAddTeamMember = () => {
    navigate('/team');
    showNotification('Opening Team Management to add new member', 'info');
  };

  const handleCreateTask = () => {
    navigate('/tasks');
    showNotification('Opening Task Management to create new task', 'info');
  };

  const handleRunAllocation = () => {
    navigate('/allocation');
    showNotification('Opening Allocation Results to run intelligent allocation', 'info');
  };

  if (dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-600 mb-4">Error loading dashboard data</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Overview of your task allocation system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} className={stat.iconColor} />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.subtitle}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Task Status Distribution">
          <div className="space-y-4">
            {taskStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${item.color} rounded mr-3`}></div>
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value}</span>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-end justify-between h-24">
                {taskStatusData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full ${item.color} rounded-t mx-1`}
                      style={{
                        height: `${totalTasks > 0 ? (item.value / totalTasks) * 100 : 0}%`,
                        minHeight: '4px'
                      }}
                    ></div>
                    <span className="text-xs text-slate-600 mt-2">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Team Skills Overview">
          <div className="space-y-4">
            <div className="text-sm text-slate-600 mb-3">
              Total unique skills: <span className="font-bold text-slate-900">{uniqueSkills}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allSkillNames.slice(0, 12).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {allSkillNames.length > 12 && (
                <span className="inline-flex px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                  +{allSkillNames.length - 12} more
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Tasks">
        <div className="space-y-3">
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex flex-wrap gap-1">
                      {task.required_skills?.map((skill, index) => (
                        <span key={index} className="inline-flex px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    {task.deadline && (
                      <span className="text-xs text-slate-500">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${task.difficulty >= 8 ? 'bg-red-50 text-red-700' :
                    task.difficulty >= 6 ? 'bg-amber-50 text-amber-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                    Difficulty: {task.difficulty}/10
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No recent tasks available</p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleAddTeamMember}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-all duration-200 hover:shadow-md group"
          >
            <svg className="w-8 h-8 mx-auto mb-2 text-blue-600 group-hover:text-blue-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="text-sm font-medium text-blue-900">Add Team Member</span>
          </button>
          <button
            onClick={handleCreateTask}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-all duration-200 hover:shadow-md group"
          >
            <svg className="w-8 h-8 mx-auto mb-2 text-green-600 group-hover:text-green-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-sm font-medium text-green-900">Create Task</span>
          </button>
          <button
            onClick={handleRunAllocation}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-all duration-200 hover:shadow-md group"
          >
            <svg className="w-8 h-8 mx-auto mb-2 text-purple-600 group-hover:text-purple-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium text-purple-900">Run Allocation</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
