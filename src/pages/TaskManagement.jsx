import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TaskTable from '../components/tasks/TaskTable';
import TaskForm from '../components/tasks/TaskForm';
import useFetch from '../hooks/useFetch';
import { taskApi, mockApi } from '../services/api';
import { showNotification } from '../utils/helpers';

const TaskManagement = () => {
  const { data: tasks, loading, error, refetch } = useFetch(mockApi.getMockTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // Try real API first, fallback to mock
        try {
          await taskApi.deleteTask(taskId);
        } catch (apiError) {
          // If real API fails, use mock API
          await mockApi.deleteTask(taskId);
        }

        showNotification('Task deleted successfully', 'success');
        refetch();
      } catch (error) {
        showNotification('Error deleting task', 'error');
      }
    }
  };

  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        try {
          await taskApi.updateTask(editingTask.id, taskData);
        } catch (apiError) {
          // If real API fails, use mock API
          await mockApi.updateTask(editingTask.id, taskData);
        }

        showNotification('Task updated successfully', 'success');
      } else {
        // Add new task
        try {
          await taskApi.addTask(taskData);
        } catch (apiError) {
          // If real API fails, use mock API
          await mockApi.addTask(taskData);
        }

        showNotification('Task created successfully', 'success');
      }

      setIsModalOpen(false);
      refetch();
    } catch (error) {
      showNotification('Error saving task', 'error');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Calculate enhanced task statistics
  const totalTasks = tasks?.length || 0;
  const unassignedTasks = tasks?.filter(task => task.status === 'unassigned').length || 0;
  const assignedTasks = tasks?.filter(task => task.status === 'assigned').length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === 'in-progress').length || 0;
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const highDifficultyTasks = tasks?.filter(task => task.difficulty === 'High').length || 0;
  const overdueTasks = tasks?.filter(task => {
    if (!task.deadline) return false;
    return new Date(task.deadline) < new Date();
  }).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-2">Create and manage tasks for intelligent allocation</p>
        </div>
        <Button onClick={handleAddTask}>
          Add Task
        </Button>
      </div>

      {/* Enhanced Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
            <div className="text-sm text-gray-600 mt-1">Total Tasks</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{unassignedTasks}</div>
            <div className="text-sm text-gray-600 mt-1">Unassigned</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{assignedTasks}</div>
            <div className="text-sm text-gray-600 mt-1">Assigned</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{inProgressTasks}</div>
            <div className="text-sm text-gray-600 mt-1">In Progress</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <div className="text-sm text-gray-600 mt-1">Overdue</div>
          </div>
        </Card>
      </div>

      {/* Task Status Progress */}
      <Card title="Task Progress Overview">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Unassigned</span>
                <span className="text-sm text-gray-600">{unassignedTasks}/{totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalTasks > 0 ? (unassignedTasks / totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Assigned</span>
                <span className="text-sm text-gray-600">{assignedTasks}/{totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalTasks > 0 ? (assignedTasks / totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">In Progress</span>
                <span className="text-sm text-gray-600">{inProgressTasks}/{totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Completed</span>
                <span className="text-sm text-gray-600">{completedTasks}/{totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-900">High Difficulty Tasks</span>
                <span className="text-lg font-bold text-red-600">{highDifficultyTasks}</span>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-900">Overdue Tasks</span>
                <span className="text-lg font-bold text-orange-600">{overdueTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card title="Tasks">
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Error loading task data</div>
            <Button onClick={refetch} variant="secondary">Retry</Button>
          </div>
        ) : (
          <TaskTable
            tasks={tasks || []}
            loading={loading}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingTask ? 'Edit Task' : 'Add Task'}
        size="large"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default TaskManagement;
