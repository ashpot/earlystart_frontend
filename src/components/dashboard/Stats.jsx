import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../../features/stats/statsSlice';
import { FaCopy, FaUsers, FaPenToSquare } from 'react-icons/fa6';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Stats = () => {
  const dispatch = useDispatch();
  const { data: stats = {}, loading, error } = useSelector((state) => state.stats);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="font-inter grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <Skeleton height={40} width={40} className="mb-5" />
            <Skeleton height={16} width="60%" className="mb-2" />
            <Skeleton height={14} width="40%" className="mb-4" />
            <Skeleton height={12} width="30%" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="font-inter grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-2xl mb-5">
          <FaCopy className="bg-tertiary text-5xl p-2 rounded-md" />
        </div>
        <p className="text-sm font-semibold text-secondaryDark">YTD Earnings</p>
        <h3 className="text-xs font-normal text-tertiary mb-4">${stats.ytdEarnings || 0}</h3>
        <Link
          to="/dashboard/earnings"
          className="font-medium text-[10px] flex items-center text-[#E60FE2]"
        >
          View all <HiOutlineArrowNarrowRight className="ml-3" />
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-2xl mb-5">
          <FaUsers className="bg-secondary text-5xl p-2 rounded-md" />
        </div>
        <p className="text-sm font-semibold text-secondaryDark">Total Students</p>
        <h3 className="text-xs font-normal text-tertiary mb-4">{stats.totalStudents || 0}</h3>
        <Link
          to="/dashboard/students"
          className="font-medium text-[10px] flex items-center text-[#07C851]"
        >
          View all <HiOutlineArrowNarrowRight className="ml-3" />
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-2xl mb-5">
          <FaChalkboardTeacher className="bg-secondaryDark text-5xl p-2 text-white rounded-md" />
        </div>
        <p className="text-sm font-semibold text-secondaryDark">Total Instructors</p>
        <h3 className="text-xs font-normal text-tertiary mb-4">{stats.totalInstructors || 0}</h3>
        <Link
          to="/dashboard/instructors"
          className="font-medium text-[10px] flex items-center text-[#E68C0F]"
        >
          View all <HiOutlineArrowNarrowRight className="ml-3" />
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-2xl mb-5">
          <FaPenToSquare className="bg-primary text-5xl p-2 rounded-md" />
        </div>
        <p className="text-sm font-semibold text-secondaryDark">Total Courses</p>
        <h3 className="text-xs font-normal text-tertiary mb-4">{stats.totalCourses || 0}</h3>
        <Link
          to="/dashboard/courses"
          className="font-medium text-[10px] flex items-center text-primary"
        >
          View all <HiOutlineArrowNarrowRight className="ml-3" />
        </Link>
      </div>
    </div>
  );
};

export default Stats;