import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TeamTable from '../components/team/TeamTable';
import TeamForm from '../components/team/TeamForm';
import useFetch from '../hooks/useFetch';
import { teamApi } from '../services/api';
import { showNotification } from '../utils/helpers';

const TeamManagement = () => {
  const { data: teamData, loading: teamLoading, error, refetch: refetchTeam } = useFetch(teamApi.getTeam);
  const { data: summaryData, loading: summaryLoading } = useFetch(teamApi.getTeamSummary);

  const teamMembers = React.useMemo(() => {
    if (!teamData || !Array.isArray(teamData)) return [];
    return teamData.filter(member => member.name && member.name !== 'string');
  }, [teamData]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const handleAddMember = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member) => {
    const memberWithId = {
      ...member,
      id: member.id || member.name?.replace(/\s+/g, '_').toLowerCase() || 'unknown'
    };
    setEditingMember(memberWithId);
    setIsModalOpen(true);
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamApi.deleteMember(memberId);
        showNotification('Team member deleted successfully', 'success');
        refetch();
      } catch (error) {
        console.error('Error deleting team member:', error);
        showNotification('Error deleting team member', 'error');
      }
    }
  };

  const handleFormSubmit = async (memberData) => {
    try {
      if (editingMember) {
        await teamApi.updateMember(editingMember.id, memberData);
        showNotification('Team member updated successfully', 'success');
      } else {
        console.log(memberData);
        await teamApi.addMember(memberData);
        showNotification('Team member added successfully', 'success');
      }

      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error saving team member:', error);
      showNotification('Error saving team member', 'error');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const totalMembers = summaryData?.total_members || teamMembers?.length || 0;
  const avgWorkload = summaryData?.avg_workload_percentage || (totalMembers > 0
    ? Math.round(teamMembers.reduce((sum, member) => sum + (member.workload || 0), 0) / totalMembers)
    : 0);
  const avgPerformance = summaryData?.avg_performance ?
    Math.round(summaryData.avg_performance * 100) :
    (totalMembers > 0 ? Math.round(teamMembers.reduce((sum, member) => sum + (member.performance || 0), 0) / totalMembers * 100) : 0);
  const uniqueSkills = summaryData?.unique_skills ?
    summaryData.unique_skills.length :
    (teamMembers ? [...new Set(teamMembers.flatMap(member => member.skills || []))].length : 0);
  const seniorMembers = summaryData?.senior_members || 0;
  const activeMembers = teamMembers?.filter(member => member.workload > 0).length || 0;

  const isLoading = teamLoading || summaryLoading;

  const refetch = () => {
    refetchTeam();
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-2">Manage your team members, skills, and performance metrics</p>
          </div>
          <Button onClick={handleAddMember}>
            Add Team Member
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
              <div className="text-2xl font-bold text-indigo-600">{activeMembers}</div>
              <div className="text-sm text-gray-600 mt-1">Active Members</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{seniorMembers}</div>
              <div className="text-sm text-gray-600 mt-1">Senior Members</div>
            </div>
          </Card>
        </div>

        <Card title="Team Members">
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Error loading team data</div>
              <Button onClick={refetch} variant="secondary">Retry</Button>
            </div>
          ) : (
            <TeamTable
              members={teamMembers || []}
              loading={isLoading}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
            />
          )}
        </Card>


      </div>
      <div>
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
    </div>
  );
};

export default TeamManagement;
