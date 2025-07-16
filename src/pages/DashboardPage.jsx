import React, { useState } from 'react';
import DashboardNavbar from '../components/dashboard/shared/DashboardNavbar';
import Sidebar from '../components/dashboard/shared/Sidebar';
import CollapsedSidebar from '../components/dashboard/shared/CollapsedSidebar';
import TopCategories from '../components/dashboard/shared/TopCategories';
import Stats from '../components/dashboard/shared/Stats';
import ActiveLearning from '../components/dashboard/shared/ActiveLearning';
import Earnings from '../components/dashboard/shared/Earnings';
import TopInstructors from '../components/dashboard/shared/TopInstructors';
import NewStudents from '../components/dashboard/shared/NewStudents';
import Payments from '../components/dashboard/shared/Payments';
import CourseList from '../components/dashboard/shared/CourseList';
import 'react-loading-skeleton/dist/skeleton.css';
import '../css/dashboardPage.css';   
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // const navigate = useNavigate();
  // const { logout } = useAuth();

  // const handleLogout = () => {
  //   logout();
  //   navigate('/login');
  // };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen">
      {isSidebarCollapsed ? (
        <CollapsedSidebar />
      ) : (
        <Sidebar />
      )}
      <div className="flex-1 flex flex-col bg-[#EFEFEF]">
        <DashboardNavbar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <div className="w-[95%] mx-auto py-7">
          <h2 className="font-inter font-bold text-base py-4">Dashboard</h2>

          <div className="first_section mb-10">
            <div className="item1">
              <TopCategories />
            </div>
            <div className="item2">
              <Stats />
            </div>
            <div className="item3">
              <Earnings />
            </div>
            <div className="item4">
              <ActiveLearning />
            </div>
            
          </div>

          <div className="grid grid-cols-[30%_42%_25%] gap-3 justify-between">
            <TopInstructors />
            <NewStudents />
            <Payments />
          </div>

          <CourseList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;