import React from 'react';
import Card from '../components/common/Card';
import useFetch from '../hooks/useFetch';
import { mockApi } from '../services/api';

const Dashboard = () => {
  // Using mock data for now - replace with real API calls when backend is ready
  const { data: teamData, loading: teamLoading } = useFetch(mockApi.getMockTeam);
  const { data: taskData, loading: taskLoading } = useFetch(mockApi.getMockTasks);

  const teamMembers = teamData || [];
  const tasks = taskData || [];

  // Calculate enhanced statistics
  const totalMembers = teamMembers.length;
  const totalTasks = tasks.length;
  const unassignedTasks = tasks.filter(task => task.status === 'unassigned').length;
  const assignedTasks = tasks.filter(task => task.status === 'assigned').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  // Calculate average workload and performance
  const avgWorkload = teamMembers.length > 0
    ? Math.round(teamMembers.reduce((sum, member) => sum + member.workload, 0) / teamMembers.length)
    : 0;
  const avgPerformance = teamMembers.length > 0
    ? Math.round(teamMembers.reduce((sum, member) => sum + (member.performanceScore || 0), 0) / teamMembers.length)
    : 0;

  // Get unique skills
  const allSkills = new Set();
  teamMembers.forEach(member => {
    member.skills?.forEach(skill => allSkills.add(skill));
  });

  const statsCards = [
    {
      title: 'Team Members',
      value: totalMembers,
      subtitle: 'Active members',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      subtitle: 'All tasks',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      color: 'bg-slate-100',
      iconColor: 'text-slate-600'
    },
    {
      title: 'Assigned Tasks',
      value: assignedTasks,
      subtitle: 'Currently assigned',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
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

  const taskStatusData = [
    { label: 'Pending', value: pendingTasks, color: 'bg-amber-500' },
    { label: 'In Progress', value: inProgressTasks, color: 'bg-blue-600' },
    { label: 'Completed', value: completedTasks, color: 'bg-green-600' }
  ];

  const recentTasks = tasks.slice(0, 5);

  if (teamLoading || taskLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Overview of your task allocation system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        {/* Task Status Chart */}
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

            {/* Simple bar chart */}
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

        {/* Team Skills Overview */}
        <Card title="Team Skills Overview">
          <div className="space-y-4">
            <div className="text-sm text-slate-600 mb-3">
              Total unique skills: <span className="font-bold text-slate-900">{allSkills.size}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(allSkills).slice(0, 12).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {allSkills.size > 12 && (
                <span className="inline-flex px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                  +{allSkills.size - 12} more
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card title="Recent Tasks">
        <div className="space-y-3">
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${task.priority === 'high' ? 'bg-red-50 text-red-700' :
                    task.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                    {task.priority}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${task.status === 'completed' ? 'bg-green-50 text-green-700' :
                    task.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                    {task.status}
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

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <span className="text-2xl mb-2 block">👥</span>
            <span className="text-sm font-medium text-blue-900">Add Team Member</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <span className="text-2xl mb-2 block">📋</span>
            <span className="text-sm font-medium text-green-900">Create Task</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <span className="text-2xl mb-2 block">🎯</span>
            <span className="text-sm font-medium text-purple-900">Run Allocation</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
