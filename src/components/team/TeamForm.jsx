import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const TeamForm = ({
  member = null,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    skillLevel: '',
    workload: 0,
    capacity: 100,
    performanceScore: 0
  });

  const [errors, setErrors] = useState({});

  const skillLevelOptions = [
    { value: 'Junior', label: 'Junior' },
    { value: 'Mid', label: 'Mid-Level' },
    { value: 'Senior', label: 'Senior' }
  ];

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        skills: member.skills?.join(', ') || '',
        skillLevel: member.skillLevel || '',
        workload: member.workload || 0,
        capacity: member.capacity || 100,
        performanceScore: member.performanceScore || 0
      });
    }
  }, [member]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = 'Skill level is required';
    }

    if (formData.workload < 0 || formData.workload > 100) {
      newErrors.workload = 'Workload must be between 0 and 100';
    }

    if (formData.capacity < 0 || formData.capacity > 100) {
      newErrors.capacity = 'Capacity must be between 0 and 100';
    }

    if (formData.performanceScore < 0 || formData.performanceScore > 100) {
      newErrors.performanceScore = 'Performance score must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const skillsArray = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const submitData = {
      ...formData,
      skills: skillsArray,
      id: member?.id
    };

    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['workload', 'capacity', 'performanceScore'].includes(name)
        ? parseInt(value) || 0
        : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter member name"
          error={errors.name}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          error={errors.email}
          required
        />
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., JavaScript, React, Node.js"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter skills separated by commas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Skill Level"
          name="skillLevel"
          value={formData.skillLevel}
          onChange={handleChange}
          options={skillLevelOptions}
          placeholder="Select skill level"
          error={errors.skillLevel}
          required
        />

        <div>
          <label htmlFor="workload" className="block text-sm font-medium text-gray-700 mb-1">
            Workload (%)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="workload"
              name="workload"
              min="0"
              max="100"
              value={formData.workload}
              onChange={handleChange}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-700 w-12 text-center">
              {formData.workload}%
            </span>
          </div>
          {errors.workload && (
            <p className="mt-1 text-sm text-red-600">{errors.workload}</p>
          )}
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
            Capacity (%)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="capacity"
              name="capacity"
              min="0"
              max="100"
              value={formData.capacity}
              onChange={handleChange}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-700 w-12 text-center">
              {formData.capacity}%
            </span>
          </div>
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="performanceScore" className="block text-sm font-medium text-gray-700 mb-1">
          Performance Score (0-100)
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            id="performanceScore"
            name="performanceScore"
            min="0"
            max="100"
            value={formData.performanceScore}
            onChange={handleChange}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-700 w-12 text-center">
            {formData.performanceScore}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          0-59: Needs Improvement | 60-79: Good | 80-100: Excellent
        </p>
        {errors.performanceScore && (
          <p className="mt-1 text-sm text-red-600">{errors.performanceScore}</p>
        )}
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
          {member ? 'Update Member' : 'Add Member'}
        </Button>
      </div>
    </form>
  );
};

export default TeamForm;
