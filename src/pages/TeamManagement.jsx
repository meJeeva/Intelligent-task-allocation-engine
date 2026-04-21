import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TeamTable from '../components/team/TeamTable';
import TeamForm from '../components/team/TeamForm';
import useFetch from '../hooks/useFetch';
import { teamApi, mockApi } from '../services/api';
import { showNotification } from '../utils/helpers';

const TeamManagement = () => {
  const { data: teamMembers, loading, error, refetch } = useFetch(mockApi.getMockTeam);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const handleAddMember = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        // Try real API first, fallback to mock
        try {
          await teamApi.deleteMember(memberId);
        } catch (apiError) {
          // If real API fails, use mock API
          await mockApi.deleteMember(memberId);
        }

        showNotification('Team member deleted successfully', 'success');
        refetch();
      } catch (error) {
        showNotification('Error deleting team member', 'error');
      }
    }
  };

  const handleFormSubmit = async (memberData) => {
    try {
      if (editingMember) {
        // Update existing member
        try {
          await teamApi.updateMember(editingMember.id, memberData);
        } catch (apiError) {
          // If real API fails, use mock API
          await mockApi.updateMember(editingMember.id, memberData);
        }

        showNotification('Team member updated successfully', 'success');
      } else {
        // Add new member
        try {
          await teamApi.addMember(memberData);
        } catch (apiError) {
          // If real API fails, use mock API
          await mockApi.addMember(memberData);
        }

        showNotification('Team member added successfully', 'success');
      }

      setIsModalOpen(false);
      refetch();
    } catch (error) {
      showNotification('Error saving team member', 'error');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  // Calculate enhanced statistics
  const totalMembers = teamMembers?.length || 0;
  const avgWorkload = totalMembers > 0
    ? Math.round(teamMembers.reduce((sum, member) => sum + member.workload, 0) / totalMembers)
    : 0;
  const avgPerformance = totalMembers > 0
    ? Math.round(teamMembers.reduce((sum, member) => sum + (member.performanceScore || 0), 0) / totalMembers)
    : 0;
  const uniqueSkills = teamMembers
    ? [...new Set(teamMembers.flatMap(member => member.skills || []))].length
    : 0;
  const seniorMembers = teamMembers?.filter(member => member.skillLevel === 'Senior').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage your team members, skills, and performance metrics</p>
        </div>
        <Button onClick={handleAddMember}>
          Add Team Member
        </Button>
      </div>

      {/* Enhanced Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalMembers}</div>
            <div className="text-sm text-gray-600 mt-1">Total Members</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{avgWorkload}%</div>
            <div className="text-sm text-gray-600 mt-1">Avg Workload</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{avgPerformance}</div>
            <div className="text-sm text-gray-600 mt-1">Avg Performance</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{uniqueSkills}</div>
            <div className="text-sm text-gray-600 mt-1">Unique Skills</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{seniorMembers}</div>
            <div className="text-sm text-gray-600 mt-1">Senior Members</div>
          </div>
        </Card>
      </div>

      {/* Team Table */}
      <Card title="Team Members">
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Error loading team data</div>
            <Button onClick={refetch} variant="secondary">Retry</Button>
          </div>
        ) : (
          <TeamTable
            members={teamMembers || []}
            loading={loading}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
        size="large"
      >
        <TeamForm
          member={editingMember}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default TeamManagement;
