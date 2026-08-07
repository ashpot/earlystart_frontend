import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import TopCategories from "../components/dashboard/shared/TopCategories";
import Stats from "../components/dashboard/shared/Stats";
import ActiveLearning from "../components/dashboard/shared/ActiveLearning";
import Earnings from "../components/dashboard/shared/Earnings";
import TopInstructors from "../components/dashboard/shared/TopInstructors";
import NewStudents from "../components/dashboard/shared/NewStudents";
import Payments from "../components/dashboard/shared/Payments";
import CourseList from "../components/dashboard/shared/CourseList";
import "react-loading-skeleton/dist/skeleton.css";
import "../css/dashboardPage.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from '../config';

const DashboardPage = () => {
  const token = localStorage.getItem('token');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  //const { logout, token } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/v1/rest-auth/admin/dashboard/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setDashboard(response.data);
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
      
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {isSidebarCollapsed ? (
        <CollapsedSidebar />
      ) : (
        <Sidebar />
      )}

      <div className="flex-1 flex flex-col bg-[#EFEFEF]">
        <DashboardNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        
        <div className="w-[95%] mx-auto py-7">

          <h2 className="font-inter font-bold text-base py-4">
            Dashboard
          </h2>

          <div className="first_section mb-10">

            <div className="item1">
              <TopCategories
                categories={dashboard.categories}
              />
            </div>

            <div className="item2">
              <Stats stats={dashboard.stats} />
            </div>

            <div className="item3">
              <Earnings earnings={dashboard.earnings} />
            </div>

            <div className="item4">
              <ActiveLearning activeLearning={dashboard.active_learning} />
            </div>

          </div>

          <div className="grid grid-cols-[30%_42%_25%] gap-3 justify-between">

            <TopInstructors
              instructors={dashboard.top_instructors}
            />

            <NewStudents
              students={dashboard.latest_students}
            />

            <Payments payments={dashboard.payments} />

          </div>

          <CourseList
            lessons={dashboard.lesssons}
          />

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;