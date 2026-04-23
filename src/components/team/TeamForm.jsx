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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-2">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="e.g., JavaScript, React, Node.js"
        />
        <p className="mt-1 text-sm text-slate-500">
          Enter skills separated by commas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <label htmlFor="workload" className="block text-sm font-medium text-slate-700 mb-2">
            Workload (%)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="range"
                id="workload"
                name="workload"
                min="0"
                max="100"
                value={formData.workload}
                onChange={handleChange}
                className="flex-1 accent-blue-600"
              />
              <input
                type="number"
                id="workload-input"
                name="workload"
                min="0"
                max="100"
                value={formData.workload}
                onChange={handleChange}
                className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-center font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm font-medium text-slate-600">%</span>
            </div>
          </div>
          {errors.workload && (
            <p className="mt-1 text-sm text-red-600">{errors.workload}</p>
          )}
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-slate-700 mb-2">
            Capacity (%)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="range"
                id="capacity"
                name="capacity"
                min="0"
                max="100"
                value={formData.capacity}
                onChange={handleChange}
                className="flex-1 accent-blue-600"
              />
              <input
                type="number"
                id="capacity-input"
                name="capacity"
                min="0"
                max="100"
                value={formData.capacity}
                onChange={handleChange}
                className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-center font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm font-medium text-slate-600">%</span>
            </div>
          </div>
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="performanceScore" className="block text-sm font-medium text-slate-700 mb-2">
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
            className="flex-1 accent-blue-600"
          />
          <span
            className="min-w-[48px] text-center text-sm font-semibold px-2 py-1 rounded"
            style={{
              backgroundColor: formData.performanceScore >= 80 ? '#dcfce7' :
                formData.performanceScore >= 60 ? '#fef3c7' : '#fee2e2',
              color: formData.performanceScore >= 80 ? '#16a34a' :
                formData.performanceScore >= 60 ? '#d97706' : '#dc2626'
            }}
          >
            {formData.performanceScore}
          </span>
        </div>

        {/* Performance indicator bar */}
        <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${formData.performanceScore}%`,
              backgroundColor: formData.performanceScore >= 80 ? '#16a34a' :
                formData.performanceScore >= 60 ? '#d97706' : '#dc2626'
            }}
          />
        </div>

        <p className="mt-2 text-sm text-slate-500">
          <span className="text-red-600">0-59: Needs Improvement</span> |
          <span className="text-amber-600"> 60-79: Good</span> |
          <span className="text-green-600"> 80-100: Excellent</span>
        </p>
        {errors.performanceScore && (
          <p className="mt-1 text-sm text-red-600">{errors.performanceScore}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
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