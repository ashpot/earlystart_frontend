import React from 'react'
import { useState } from 'react';
import DashboardNavbar from '../components/dashboard/shared/DashboardNavbar';
import Sidebar from '../components/dashboard/shared/Sidebar';
import CollapsedSidebar from '../components/dashboard/shared/CollapsedSidebar';
import 'react-loading-skeleton/dist/skeleton.css';
import '../css/dashboardPage.css';
import SearchResults from '../components/dashboard/shared/SearchResults';

const SearchResultPage = () => {
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
		  <SearchResults />
		</div>
	  </div>
	</div>
	);
}

export default SearchResultPage;
