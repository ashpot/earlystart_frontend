
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../../features/courses/coursesSlice';
import { IoMdArrowDropdown, IoMdClose } from 'react-icons/io';
import { FaSearch } from 'react-icons/fa';
import icon from '../../../assets/images/dashboardicon.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ManageQuiz = () => {
  const dispatch = useDispatch();
  const { data: courses = [], loading, error } = useSelector((state) => state.courses);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const filteredCourses = courses.filter((course) =>
    course.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (loading || courses.length === 6) {
    return (
      <section className="bg-white p-4 my-10 rounded-lg shadow-md font-inter">
        <div className="flex justify-between items-center mb-10 border-b border-tertiaryDark pb-3 -mx-6 px-6">
          <div className="flex gap-2 items-center">
            <Skeleton circle={true} width={20} height={20} />
            <Skeleton width={120} height={20} />
          </div>
          <div className="space-x-4 flex items-center">
            <Skeleton width={150} height={32} />
            <Skeleton width={60} height={28} />
          </div>
        </div>
        <table className="w-[97%] mx-auto text-left border-l-2 border-t-2 border-collapse">
          <thead>
            <tr className="border-b border-gray-300 font-bold text-sm text-left">
              <th className="px-4 py-3 border-r-2 border-tertiary"><Skeleton width="50%" /></th>
              <th className="px-2 border-r-2 border-tertiary"><Skeleton width="50%" /></th>
              <th className="px-2 border-r-2 border-tertiary"><Skeleton width="50%" /></th>
              <th className="px-2 border-r-2 border-tertiary"><Skeleton width="50%" /></th>
              <th className="px-2 border-r-2 border-tertiary"><Skeleton width="50%" /></th>
              <th className="px-2 border-r-2 border-tertiary"><Skeleton width="50%" /></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, index) => (
              <tr key={index} className="border-b border-tertiary font-normal text-xs">
                <td className="py-3 px-4 border-r-2 border-tertiary">
                  <div className="flex items-center gap-3">
                    <Skeleton width={36} height={36} />
                    <Skeleton width="60%" />
                  </div>
                </td>
                <td className="p-2 border-r-2 border-tertiary"><Skeleton width="60%" /></td>
                <td className="p-2 border-r-2 border-tertiary"><Skeleton width="40%" /></td>
                <td className="p-2 border-r-2 border-tertiary"><Skeleton width="60%" /></td>
                <td className="p-2 border-r-2 border-tertiary"><Skeleton width="60%" /></td>
                <td className="p-2 border-r-2 border-tertiary"><Skeleton width="40%" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <Skeleton width={100} height={12} />
          <div className="flex items-center space-x-2">
            <Skeleton width={60} height={12} />
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} width={24} height={24} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-4 my-10 rounded-lg shadow-md font-inter">
      <div className="flex justify-between items-center mb-10 border-b border-tertiaryDark pb-3 -mx-6 px-6">
        <h2 className="flex gap-2 text-base font-bold">
          <img src={icon} alt="dashboard icon" /> Quiz List
        </h2>
        <div className="space-x-4 flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 pl-8 pr-8 font-normal text-xs rounded-2xl border focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <IoMdClose
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={handleClearSearch}
              />
            )}
          </div>
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-primary text-white text-xs font-semibold p-1 items-center rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
      {totalItems === 0 ? (
        <div className="text-center py-6 text-sm text-gray-500">
          No quiz found matching your search.
        </div>
      ) : (
        <table className="w-[97%] mx-auto text-left border-l-2 border-t-2 border-collapse">
          <thead>
            <tr className="border-b border-gray-300 font-bold text-sm text-left">
              <th className="px-4 py-3 border-r-2 border-tertiary">Question</th>
              <th className="px-2 border-r-2 border-tertiary">Lesson</th>
              <th className="px-2 border-r-2 border-tertiary">Section</th>
              <th className="px-2 border-r-2 border-tertiary">Option A</th>
              <th className="px-2 border-r-2 border-tertiary">Option B</th>
              <th className="px-2 border-r-2 border-tertiary">Option C</th>
			  <th className="px-2 border-r-2 border-tertiary">Option D</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((quiz, index) => (
              <tr key={index} className="border-b border-tertiary font-normal text-xs">
                <td className="py-3 px-4 border-r-2 border-tertiary">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary w-9 h-9 rounded-md"></div>
                    {quiz.question}
                  </div>
                </td>
                <td className="p-2 border-r-2 border-tertiary">{quiz.lesson}</td>
                <td className="p-2 border-r-2 border-tertiary">{quiz.section}</td>
                <td className="p-2 border-r-2 border-tertiary">{quiz.optionA}</td>
                <td className="p-2 border-r-2 border-tertiary">{quiz.optionB}</td>
				<td className="p-2 border-r-2 border-tertiary">{quiz.optionC}</td>
				<td className="p-2 border-r-2 border-tertiary">{quiz.optionD}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between items-center mt-4">
        <span className="font-normal text-xs">
          Showing {totalItems === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
        </span>
        {totalItems > 0 && (
          <div className="flex items-center font-medium text-sm space-x-2">
            <span className="mr-4 text-xs font-normal">Pages</span>
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-2 py-1 rounded ${
                  currentPage === page ? 'bg-primary text-white' : 'hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageQuiz;