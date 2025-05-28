
import React, { useState } from 'react';
import { coursesData } from '../../data/DashboardContent';
import { IoMdArrowDropdown, IoMdClose } from 'react-icons/io'; // Added IoMdClose for clear button
import { FaSearch } from 'react-icons/fa'; // Added search icon
import icon from '../../assets/images/dashboardicon.png';

const CourseList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1); // Reset to first page
  };

  // Filter courses based on search query
  const filteredCourses = coursesData.filter((course) =>
    course.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination data based on filtered courses
  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Generate page numbers for pagination
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section className="bg-white p-4 my-10 rounded-lg shadow-md font-inter">
      <div className="flex justify-between items-center mb-10 border-b border-tertiaryDark pb-3 -mx-6 px-6">
        <h2 className="flex gap-2 text-base font-bold">
          <img src={icon} alt="dashboard icon" /> Course List
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
              <option className="hover:bg-yellow-200 " value={5}>5</option>
              <option className="hover:bg-yellow-200 " value={10}>10</option>
              <option className="hover:bg-yellow-200 " value={20}>20</option>
              <option className="hover:bg-yellow-200 " value={50}>50</option>
            </select>
            {/* <IoMdArrowDropdown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" /> */}
          </div>
        </div>
      </div>
      {totalItems === 0 ? (
        <div className="text-center py-6 text-sm text-gray-500">
          No courses found matching your search.
        </div>
      ) : (
        <table className="w-[97%] mx-auto text-left border-l-2 border-t-2 border-collapse">
          <thead>
            <tr className="border-b border-gray-300 font-bold text-sm text-left">
              <th className="px-4 py-3 border-r-2 border-tertiary">Course</th>
              <th className="px-2 border-r-2 border-tertiary">Category</th>
              <th className="px-2 border-r-2 border-tertiary">No. of Lessons</th>
              <th className="px-2 border-r-2 border-tertiary">Date Added</th>
              <th className="px-2 border-r-2 border-tertiary">Last Updated</th>
              <th className="px-2 border-r-2 border-tertiary">No. of Students</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course, index) => (
              <tr
                key={index}
                className="border-b border-tertiary font-normal text-xs"
              >
                <td className="py-3 px-4 border-r-2 border-tertiary">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary w-9 h-9 rounded-md"></div>
                    {course.course}
                  </div>
                </td>
                <td className="p-2 border-r-2 border-tertiary">{course.category}</td>
                <td className="p-2 border-r-2 border-tertiary">{course.lessons}</td>
                <td className="p-2 border-r-2 border-tertiary">{course.dateAdded}</td>
                <td className="p-2 border-r-2 border-tertiary">{course.lastUpdated}</td>
                <td className="p-2 border-r-2 border-tertiary">{course.students}</td>
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
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-200'
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

export default CourseList;