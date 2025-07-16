import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActiveLearnings } from '../../../features/activeLearnings/activeLearningsSlice';
import icon from '../../../assets/images/dashboardicon.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const truncateText = (text, maxLength = 6) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const ActiveLearning = () => {
  const dispatch = useDispatch();
  const { data: activeLearnings = [], loading, error } = useSelector((state) => state.activeLearnings);

  useEffect(() => {
    dispatch(fetchActiveLearnings());
  }, [dispatch]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return (
      <section className="bg-white p-4 rounded-lg shadow-md font-inter">
        <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-6 px-6">
          <div className="flex gap-2 items-center">
            <Skeleton circle={true} width={20} height={20} />
            <Skeleton width={120} height={20} />
          </div>
          <Skeleton width={80} height={32} />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm">
              <th className="py-2"><Skeleton width="50%" /></th>
              <th className="py-2"><Skeleton width="50%" /></th>
              <th className="py-2"><Skeleton width="50%" /></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index} className="border-b text-xs">
                <td className="py-2"><Skeleton width="60%" /></td>
                <td className="py-2"><Skeleton width="40%" /></td>
                <td className="py-2">
                  <div className="flex items-center">
                    <Skeleton width="80%" height={10} />
                    <Skeleton width={30} height={12} className="ml-3" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  if (activeLearnings.length === 0) {
    return (
      <section className="bg-white p-4 rounded-lg shadow-md font-inter">
        <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-6 px-6">
          <h2 className="flex gap-2 text-base font-bold">
            <img src={icon} alt="Active Learnings Icon" /> Active Learnings
          </h2>
          <Link
            to="/dashboard/active-learnings"
            className="bg-tertiary text-black font-medium text-sm px-4 py-2 rounded hover:bg-yellow-400"
          >
            View all
          </Link>
        </div>
        <p className="text-center text-sm text-gray-500 py-4">No active learnings available</p>
      </section>
    );
  }

  return (
    <section className="bg-white p-4 rounded-lg shadow-md font-inter">
      <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-6 px-6">
        <h2 className="flex gap-2 text-base font-bold">
          <img src={icon} alt="Active Learnings Icon" /> Active Learnings
        </h2>
        <Link
          to="/dashboard/active-learnings"
          className="bg-tertiary text-black font-medium text-sm px-4 py-2 rounded hover:bg-yellow-400"
        >
          View all
        </Link>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-sm">
            <th className="py-2">User</th>
            <th className="py-2">Course</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {activeLearnings.map((item, index) => (
            <tr key={index} className="border-b text-xs">
              <td className="py-2">{item.user}</td>
              <td className="py-2">{truncateText(item.course)}</td>
              <td className="py-2">
                <div className="flex items-center">
                  <div className="w-full bg-primaryLight rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${item.status}%` }}
                    ></div>
                  </div>
                  <span className="text-xs ml-3">{item.status}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ActiveLearning;