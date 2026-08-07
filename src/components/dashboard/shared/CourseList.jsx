import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import icon from "../../../assets/images/dashboardicon.png";

const CourseList = ({ courses = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const search = searchQuery.toLowerCase();

      return (
        course.title?.toLowerCase().includes(search) ||
        course.category?.toLowerCase().includes(search) ||
        course.instructor?.toLowerCase().includes(search)
      );
    });
  }, [courses, searchQuery]);

  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <section className="bg-white p-4 my-10 rounded-lg shadow-md font-inter">

      {/* Header */}

      <div className="flex justify-between items-center mb-8 border-b border-tertiaryDark pb-3 -mx-6 px-6">

        <h2 className="flex gap-2 items-center text-base font-bold">
          <img src={icon} alt="Courses" />
          Course List
        </h2>

        <div className="flex items-center gap-4">

          <div className="relative">

            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-8 py-2 text-xs border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {searchQuery && (
              <IoMdClose
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              />
            )}

          </div>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-primary text-white text-xs rounded-md px-2 py-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

        </div>

      </div>

      {totalItems === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No courses found.
        </div>
      ) : (
        <>

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-gray-50 text-sm">

                <th className="text-left p-3">Course</th>

                <th className="text-left p-3">Category</th>

                <th className="text-center p-3">Lessons</th>

                <th className="text-center p-3">Students</th>

                <th className="text-center p-3">Instructor</th>

                <th className="text-center p-3">Created</th>

              </tr>

            </thead>

            <tbody>

              {currentCourses.map((course) => (

                <tr
                  key={course.id}
                  className="border-b text-sm hover:bg-gray-50"
                >

                  <td className="p-3">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded bg-primary"></div>

                      <div>

                        <p className="font-semibold">
                          {course.title}
                        </p>

                        <p className="text-xs text-gray-500">
                          {course.code}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="p-3">
                    {course.category}
                  </td>

                  <td className="text-center p-3">
                    {course.lessons}
                  </td>

                  <td className="text-center p-3">
                    {course.students}
                  </td>

                  <td className="text-center p-3">
                    {course.instructor}
                  </td>

                  <td className="text-center p-3">
                    {course.created}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="flex justify-between items-center mt-6">

            <span className="text-xs text-gray-500">

              Showing {startIndex + 1} -
              {Math.min(endIndex, totalItems)} of {totalItems}

            </span>

            <div className="flex gap-2">

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>

              ))}

            </div>

          </div>

        </>
      )}

    </section>
  );
};

export default CourseList;