import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopCategories } from '../../../features/topCategories/topCategoriesSlice';
import icon from '../../../assets/images/dashboardicon.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TopCategories = () => {
  const dispatch = useDispatch();
  const { data: topCategories = [], loading, error } = useSelector((state) => state.topCategories);

  useEffect(() => {
    dispatch(fetchTopCategories());
  }, [dispatch]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return (
      <section className="bg-white rounded-lg p-4 font-inter shadow-md">
        <div>
          <div className="flex justify-between items-center border-b border-tertiaryDark pb-2 -mx-5 px-5">
            <div className="flex gap-2 items-center">
              <Skeleton circle={true} width={20} height={20} />
              <Skeleton width={120} height={20} />
            </div>
            <Skeleton width={80} height={32} />
          </div>
          <div className="grid grid-cols-4 gap-4 my-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="border border-tertiary rounded-lg w-full h-40 p-4">
                <Skeleton height={54} width={84} className="mx-auto mb-2" />
                <Skeleton height={16} width="75%" className="mx-auto mb-1" />
                <Skeleton height={12} width="50%" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (topCategories.length === 0) {
    return (
      <section className="bg-white rounded-lg p-4 font-inter shadow-md">
        <div>
          <div className="flex justify-between items-center border-b border-tertiaryDark pb-2 -mx-5 px-5">
            <h2 className="flex gap-2 font-bold text-base">
              <img src={icon} alt="Top Categories Icon" /> Top Categories
            </h2>
            <Link
              to="/dashboard/categories"
              className="bg-primaryLight text-black font-medium text-sm px-4 py-2 rounded hover:bg-yellow-400"
            >
              View all
            </Link>
          </div>
          <p className="text-center text-sm text-gray-500 py-4">No categories available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg p-4 font-inter shadow-md">
      <div>
        <div className="flex justify-between items-center border-b border-tertiaryDark pb-2 -mx-5 px-5">
          <h2 className="flex gap-2 font-bold text-base">
            <img src={icon} alt="Top Categories Icon" /> Top Categories
          </h2>
          <Link
            to="/dashboard/categories"
            className="bg-primaryLight text-black font-medium text-sm px-4 py-2 rounded hover:bg-yellow-400"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 my-6">
          {topCategories.map((category, index) => (
            <Link
              key={index}
              to={`/dashboard/categories/${category.title.toLowerCase()}`}
              className="border border-tertiary rounded-lg w-full h-40 p-4"
            >
              <div className="bg-primary rounded-lg w-[84px] h-[54px] my-auto mx-auto mb-2"></div>
              <div className="flex flex-col text-center items-center gap-2 max-w-full">
                <h3 className="text-sm font-semibold text-black">{category.title}</h3>
                <p className="text-tertiary text-xs">{category.courseCount} courses</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;