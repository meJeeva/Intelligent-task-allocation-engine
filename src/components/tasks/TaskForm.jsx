import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const TaskForm = ({
  task = null,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title: '',
    requiredSkills: '',
    difficulty: 'Medium',
    deadline: '',
    status: 'unassigned'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        requiredSkills: task.requiredSkills?.join(', ') || '',
        difficulty: task.difficulty || 'Medium',
        deadline: task.deadline || '',
        status: task.status || 'unassigned'
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.requiredSkills.trim()) {
      newErrors.requiredSkills = 'Required skills are needed for allocation';
    }

    if (formData.deadline && new Date(formData.deadline) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.deadline = 'Deadline cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const skillsArray = formData.requiredSkills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const submitData = {
      ...formData,
      requiredSkills: skillsArray,
      id: task?.id
    };

    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter task title"
        error={errors.title}
        required
      />

      <div>
        <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills *
        </label>
        <input
          type="text"
          id="requiredSkills"
          name="requiredSkills"
          value={formData.requiredSkills}
          onChange={handleChange}
          className={`input-field ${errors.requiredSkills ? 'border-red-500' : ''}`}
          placeholder="e.g., JavaScript, React, Node.js"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter required skills separated by commas (used for intelligent allocation)
        </p>
        {errors.requiredSkills && (
          <p className="mt-1 text-sm text-red-600">{errors.requiredSkills}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Difficulty (1-10)"
          type="number"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          min="1"
          max="10"
          placeholder="Enter difficulty (1-10)"
        />

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={today}
            className={`input-field ${errors.deadline ? 'border-red-500' : ''}`}
          />
          {errors.deadline && (
            <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
          )}
        </div>
      </div>

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={[
          { value: 'unassigned', label: 'Unassigned' },
          { value: 'assigned', label: 'Assigned' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' }
        ]}
        placeholder="Select task status"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Task Information</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <p>· <strong>Difficulty:</strong> Affects allocation priority and complexity scoring</p>
          <p>· <strong>Deadline:</strong> Used for urgent task prioritization</p>
          <p>· <strong>Required Skills:</strong> Critical for matching with team members</p>
          <p>· <strong>Status:</strong> Tracks assignment and progress</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {task ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
