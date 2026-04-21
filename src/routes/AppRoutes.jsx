import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import TeamManagement from '../pages/TeamManagement';
import TaskManagement from '../pages/TaskManagement';
import AllocationResults from '../pages/AllocationResults';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="allocation" element={<AllocationResults />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
