import React, { useState } from 'react';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import Sidebar from '../components/dashboard/Sidebar';
import CollapsedSidebar from '../components/dashboard/CollapsedSidebar';
import TopCategories from '../components/dashboard/TopCategories';
import Stats from '../components/dashboard/Stats';
import ActiveLearning from '../components/dashboard/ActiveLearning';
import Earnings from '../components/dashboard/Earnings';
import TopInstructors from '../components/dashboard/TopInstructors';
import NewStudents from '../components/dashboard/NewStudents';
import Payments from '../components/dashboard/Payments';
import CourseList from '../components/dashboard/CourseList';
import '../css/dashboardPage.css';

const DashboardPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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