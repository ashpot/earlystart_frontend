
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopInstructors } from '../../../features/topInstructors/topInstructorsSlice';
import photo from '../../../assets/images/photo.png';
import icon from '../../../assets/images/dashboardicon.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TopInstructors = () => {
  const dispatch = useDispatch();
  const { data: topInstructors = [], loading, error } = useSelector((state) => state.topInstructors);

  useEffect(() => {
    dispatch(fetchTopInstructors());
  }, [dispatch]);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (loading) {
    return (
      <section className="bg-white p-2 rounded-lg shadow-md font-inter">
        <div className="flex gap-2 items-center mb-4 border-b border-tertiaryDark py-3 -mx-3 px-3">
          <Skeleton circle={true} width={20} height={20} />
          <Skeleton width={120} height={20} />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center px-1 space-x-3">
              <Skeleton circle={true} width={28} height={28} />
              <div className="flex justify-between w-full">
                <div>
                  <Skeleton width={80} height={12} className="mb-1" />
                  <Skeleton width={60} height={10} />
                </div>
                <div className="text-right">
                  <Skeleton width={70} height={12} className="mb-1" />
                  <Skeleton width={50} height={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-2 rounded-lg shadow-md font-inter">
      <h2 className="flex gap-2 text-base font-bold mb-4 border-b border-tertiaryDark py-3 -mx-3 px-3">
        <img src={icon} alt="Top Instructor Icon" /> Top Instructor
      </h2>
      <div className="space-y-4">
        {topInstructors.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            No instructors available.
          </div>
        ) : (
        topInstructors.map((instructor, index) => (
          <div key={index} className="flex items-center px-1 space-x-3">
            <img
              src={photo}
              alt="Instructor"
              className="w-7 h-7 rounded-full"
            />
            <div className="flex justify-between w-full">
              <p className="font-bold text-xs">
                {instructor.name} <br />{' '}
                <span className="text-[11px] font-normal text-tertiary">{instructor.degree}</span>
              </p>
              <p className="text-xs font-bold text-primary text-right">
                {instructor.classes} Classes <br />{' '}
                <span className="text-[11px] font-normal text-tertiary">{instructor.course}</span>
              </p>
            </div>
          </div>
        )))}
      </div>
    </section>
  );
};

export default TopInstructors;