
import React from 'react';
import { useState } from 'react';
import DashboardNavbar from '../components/dashboard/shared/DashboardNavbar';
import Sidebar from '../components/dashboard/shared/Sidebar';
import CollapsedSidebar from '../components/dashboard/shared/CollapsedSidebar';
import CompetitionForm from '../components/dashboard/addCompetition/CompetitionForm'
import 'react-loading-skeleton/dist/skeleton.css';
import '../css/dashboardPage.css';

const AddCompetition = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
	setIsSidebarCollapsed((prev) => !prev);
  };

  return (
	<div className="flex min-h-screen">
	  {isSidebarCollapsed ? <CollapsedSidebar /> : <Sidebar />}
	  <div className="flex-1 flex flex-col bg-[#EFEFEF]">
		<DashboardNavbar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
		<div className="w-[95%] mx-auto py-7">
		  <h2 className="font-inter font-bold text-base py-4">ADD COMPETITION</h2>
		  <CompetitionForm />
		</div>
	  </div>
	</div>
  );
};

export default AddCompetition;