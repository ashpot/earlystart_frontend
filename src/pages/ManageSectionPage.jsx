
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
  gray: "#BDBEC0",
  white: "#FFFFFF",
};

const API_PREFIX = `${BASE_URL}/api/v1/rest-auth/admin/`;
const PAGE_SIZE = 10;

export default function ManageSectionsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const loadData = useCallback(async () => {
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Token ${token}`,
      };

      const [sectionResponse, courseResponse] = await Promise.all([
        fetch(`${API_PREFIX}sections/`, { headers }),
        fetch(`${API_PREFIX}courses/`, { headers }),
      ]);

      if (!sectionResponse.ok) {
        throw new Error("Unable to load sections.");
      }

      const sectionData = await sectionResponse.json();
      const sectionList = Array.isArray(sectionData)
        ? sectionData
        : sectionData.results || [];

      setSections(sectionList);

      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourses(
          Array.isArray(courseData)
            ? courseData
            : courseData.results || []
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load sections.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sections.filter((section) => {
      const matchesSearch =
        !query ||
        section.title?.toLowerCase().includes(query) ||
        section.course_title?.toLowerCase().includes(query) ||
        section.description?.toLowerCase().includes(query);

      const sectionCourseId =
        typeof section.course === "object"
          ? String(section.course?.id)
          : String(section.course);

      const matchesCourse =
        courseFilter === "all" ||
        sectionCourseId === String(courseFilter);

      return matchesSearch && matchesCourse;
    });
  }, [sections, search, courseFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSections.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedSections = filteredSections.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, courseFilter]);

  const handleDelete = async () => {
    if (!sectionToDelete || !token) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_PREFIX}sections/${sectionToDelete.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.detail || "Unable to delete this section."
        );
      }

      setSections((previous) =>
        previous.filter(
          (section) => section.id !== sectionToDelete.id
        )
      );

      setSectionToDelete(null);
    } catch (err) {
      setError(err.message || "Failed to delete section.");
      setSectionToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const getCourseTitle = (section) => {
    if (section.course_title) return section.course_title;

    if (typeof section.course === "object") {
      return section.course?.title || "Untitled course";
    }

    const course = courses.find(
      (item) => String(item.id) === String(section.course)
    );

    return course?.title || `Course #${section.course}`;
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F7F8FA", color: COLORS.navy }}
    >
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden overflow-y-auto border-r border-gray-100 bg-white transition-[width] duration-300 md:block ${
          isSidebarCollapsed ? "w-20" : "w-60"
        }`}
      >
        {isSidebarCollapsed ? (
          <CollapsedSidebar
            toggleSidebar={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        ) : (
          <Sidebar
            toggleSidebar={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        )}
      </aside>

      <div
        className={`min-h-screen min-w-0 transition-[margin] duration-300 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-60"
        }`}
      >
        <DashboardNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Manage Sections
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Organize course sections and manage their content.
              </p>
            </div>

            <Link
              to="/admin/section/add"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold shadow-sm transition hover:opacity-90"
              style={{
                backgroundColor: COLORS.yellow,
                color: COLORS.navy,
              }}
            >
              <FaPlus />
              Add Section
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Sections</p>
                  <p className="mt-2 text-3xl font-bold">
                    {sections.length}
                  </p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#FBD22F35" }}
                >
                  <FaBook size={21} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Courses With Sections</p>
                  <p className="mt-2 text-3xl font-bold">
                    {
                      new Set(
                        sections.map((section) =>
                          typeof section.course === "object"
                            ? section.course?.id
                            : section.course
                        )
                      ).size
                    }
                  </p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#91ADC630" }}
                >
                  <FaBook size={21} />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="relative w-full sm:max-w-sm">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search sections..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#91ADC6]"
                />
              </div>

              <select
                value={courseFilter}
                onChange={(event) => setCourseFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#91ADC6]"
              >
                <option value="all">All courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead style={{ backgroundColor: "#F9FAFB" }}>
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4 font-semibold">Section</th>
                    <th className="px-5 py-4 font-semibold">Course</th>
                    <th className="px-5 py-4 font-semibold">Description</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-5 py-12 text-center text-gray-500"
                      >
                        Loading sections...
                      </td>
                    </tr>
                  ) : paginatedSections.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-5 py-12 text-center"
                      >
                        <FaBook className="mx-auto mb-3 text-3xl text-gray-300" />
                        <p className="font-semibold">No sections found</p>
                        <p className="mt-1 text-gray-500">
                          Try another search or create a new section.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedSections.map((section) => (
                      <tr
                        key={section.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold">{section.title}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            ID: {section.id}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className="inline-flex max-w-xs rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: "#91ADC625",
                              color: COLORS.navy,
                            }}
                          >
                            {getCourseTitle(section)}
                          </span>
                        </td>

                        <td className="max-w-xs px-5 py-4 text-gray-500">
                          <p className="line-clamp-2">
                            {section.description || "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              title="Edit section"
                              aria-label={`Edit ${section.title}`}
                              onClick={() =>
                                navigate(`/admin/section/edit/${section.id}`)
                              }
                              className="rounded-lg p-2 transition hover:bg-blue-50"
                              style={{ color: COLORS.navy }}
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              title="Delete section"
                              aria-label={`Delete ${section.title}`}
                              onClick={() => setSectionToDelete(section)}
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && filteredSections.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Showing{" "}
                  {(safePage - 1) * PAGE_SIZE + 1}– 
                  {Math.min(safePage * PAGE_SIZE, filteredSections.length)}{" "}
                  of {filteredSections.length} sections
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <FaChevronLeft size={12} />
                  </button>

                  <span className="px-2 text-sm">
                    Page {safePage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {sectionToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setSectionToDelete(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-section-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FaTrash size={20} />
            </div>

            <h2 id="delete-section-title" className="text-lg font-bold">
              Delete Section?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <strong className="text-gray-700">
                {sectionToDelete.title}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setSectionToDelete(null)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
