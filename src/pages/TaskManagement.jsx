import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TaskTable from '../components/tasks/TaskTable';
import TaskForm from '../components/tasks/TaskForm';
import useFetch from '../hooks/useFetch';
import { taskApi } from '../services/api';
import { showNotification } from '../utils/helpers';

const TaskManagement = () => {
  const { data: tasksData, loading: tasksLoading, error, refetch: refetchTasks } = useFetch(taskApi.getTasks);
  const { data: summaryData, loading: summaryLoading } = useFetch(taskApi.getTaskSummary);
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
        await taskApi.deleteTask(taskId);
        showNotification('Task deleted successfully', 'success');
        refetch();
      } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error deleting task', 'error');
      }
    }
  };

  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, taskData);
        showNotification('Task updated successfully', 'success');
      } else {
        console.log('taskData', taskData)
        await taskApi.addTask(taskData);
        showNotification('Task created successfully', 'success');
      }

      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error saving task:', error);
      showNotification('Error saving task', 'error');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Use summary data if available, otherwise calculate from tasks
  const totalTasks = summaryData?.total_tasks || tasksData?.length || 0;
  const unassignedTasks = summaryData?.unassigned || (tasksData?.filter(task => task.status === 'unassigned').length || 0);
  const assignedTasks = summaryData?.assigned || (tasksData?.filter(task => task.status === 'assigned').length || 0);
  const inProgressTasks = summaryData?.in_progress || (tasksData?.filter(task => task.status === 'in-progress').length || 0);
  const completedTasks = summaryData?.completed || (tasksData?.filter(task => task.status === 'completed').length || 0);
  const highDifficultyTasks = summaryData?.high_difficulty_tasks || (tasksData?.filter(task => task.difficulty >= 8).length || 0);
  const overdueTasks = summaryData?.overdue || (tasksData?.filter(task => {
    if (!task.deadline) return false;
    return new Date(task.deadline) < new Date();
  }).length || 0);

  // Transform tasks data to match component expectations
  const transformedTasks = React.useMemo(() => {
    if (!tasksData || !Array.isArray(tasksData)) return [];
    return tasksData.map(task => ({
      ...task,
      title: task.task_title || task.title,
      skills: task.required_skills || task.requiredSkills || task.skills || [],
      requiredSkills: task.required_skills || task.requiredSkills || task.skills || [],
      difficulty: task.difficulty,
      deadline: task.deadline,
      status: task.status,
      actions: task.actions || { edit: true, delete: true }
    }));
  }, [tasksData]);

  // Combined loading state
  const isLoading = tasksLoading || summaryLoading;

  // Combined refetch function
  const refetch = () => {
    refetchTasks();
    // Summary data will be refetched automatically by useFetch
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600 mt-2">Create and manage tasks for intelligent allocation</p>
          </div>
          <div className="flex gap-2">

            <Button onClick={handleAddTask}>
              Add Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
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
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{highDifficultyTasks}</div>
              <div className="text-sm text-gray-600 mt-1">High Difficulty</div>
            </div>
          </Card>
        </div>

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

        <Card title="Tasks">
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Error loading task data</div>
              <Button onClick={refetch} variant="secondary">Retry</Button>
            </div>
          ) : (
            <TaskTable
              tasks={transformedTasks || []}
              loading={isLoading}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </Card>


      </div>
      <div>
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
    </div>
  );
};

export default TaskManagement;
