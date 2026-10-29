
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api/v1/rest-auth/admin/courses/`;

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
};

const getList = (data) =>
  Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];

const getCategoryName = (course) =>
  typeof course.category === "object"
    ? course.category?.title || course.category?.name || "Uncategorized"
    : course.category_title || "Category assigned";

const getAgeLevelName = (course) =>
  typeof course.age_level === "object"
    ? course.age_level?.title || course.age_level?.name || "Not specified"
    : course.age_level_title || (course.age_level ? "Assigned" : "Not specified");

export default function CoursesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.successMessage || "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [courseToPublish, setCourseToPublish] = useState(null);

  const pageSize = 10;

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const loadCourses = useCallback(async () => {
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || `Unable to load courses (HTTP ${response.status}).`
        );
      }

      setCourses(getList(data));
    } catch (err) {
      console.error("Loading courses failed:", err);
      setError(err.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        [
          course.title,
          course.description,
          getCategoryName(course),
          getAgeLevelName(course),
        ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && course.is_active) ||
        (statusFilter === "inactive" && !course.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [courses, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedCourses = filteredCourses.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const confirmPublish = async () => {
    if (!courseToPublish) return;

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setCourseToPublish(null);
      return;
    }

    const course = courseToPublish;
    setPublishingId(course.id);
    setError("");
    setNotice("");

    try {
      // Assumes publish_course is a DRF detail action:
      // POST /admin/courses/<course_id>/publish_course/
      const response = await fetch(`${API_URL}${course.id}/publish/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || data?.error ||
            `Unable to publish course (HTTP ${response.status}).`
        );
      }

      setCourses((previous) =>
        previous.map((item) =>
          item.id === course.id
            ? { ...item, is_published: true }
            : item
        )
      );
      setNotice(data?.message || data?.detail || `"${course.title}" was published successfully.`);
      setCourseToPublish(null);
    } catch (err) {
      console.error("Publishing course failed:", err);
      setError(err.message || "Unable to publish this course.");
    } finally {
      setPublishingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!courseToDelete || !token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    const course = courseToDelete;
    setDeletingId(course.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}${course.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ||
            `Unable to delete course (HTTP ${response.status}).`
        );
      }

      setCourses((previous) =>
        previous.filter((item) => item.id !== course.id)
      );
      setNotice(`"${course.title}" was deleted successfully.`);
      setCourseToDelete(null);
    } catch (err) {
      console.error("Deleting course failed:", err);
      setError(err.message || "Unable to delete this course.");
      setCourseToDelete(null);
    } finally {
      setDeletingId(null);
    }
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
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Courses</h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage Earlystart courses, categories and learning levels.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/course/add")}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
              style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
            >
              <FaPlus />
              Add Course
            </button>
          </div>

          {notice && (
            <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <span className="flex items-center gap-2">
                <FaCheckCircle />
                {notice}
              </span>
              <button onClick={() => setNotice("")} aria-label="Dismiss message">
                <FaTimes />
              </button>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <span>{error}</span>
              <button onClick={() => setError("")} aria-label="Dismiss error">
                <FaTimes />
              </button>
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Total courses", value: courses.length },
              {
                label: "Active courses",
                value: courses.filter((course) => course.is_active).length,
              },
              {
                label: "Inactive courses",
                value: courses.filter((course) => !course.is_active).length,
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold">{metric.value}</p>
              </div>
            ))}
          </div>

          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="relative min-w-0 flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search title, description, category..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#91ADC6]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="all">All statuses</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-gray-500">
                Loading courses...
              </div>
            ) : paginatedCourses.length === 0 ? (
              <div className="p-12 text-center">
                <FaBookOpen className="mx-auto text-3xl text-gray-300" />
                <h3 className="mt-4 font-semibold">No courses found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {courses.length
                    ? "Try changing your search or filter."
                    : "Create your first course to get started."}
                </p>
                {!courses.length && (
                  <button
                    onClick={() => navigate("/admin/course/add")}
                    className="mt-4 rounded-xl px-4 py-2 text-sm font-bold"
                    style={{
                      backgroundColor: COLORS.yellow,
                      color: COLORS.navy,
                    }}
                  >
                    Add your first course
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Course</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Age level</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedCourses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50/70">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {course.image_url || course.image ? (
                                <img
                                  src={course.image_url || course.image}
                                  alt=""
                                  className="h-12 w-14 rounded-lg border border-gray-100 object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-14 items-center justify-center rounded-lg bg-gray-100">
                                  <FaBookOpen className="text-gray-400" />
                                </div>
                              )}
                              <div className="min-w-0 max-w-xs">
                                <p className="truncate font-semibold text-gray-800">
                                  {course.title}
                                </p>
                                <p className="mt-1 truncate text-xs text-gray-500">
                                  {course.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {getCategoryName(course)}
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {getAgeLevelName(course)}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                course.is_active
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {course.is_active ? "Active" : "Inactive"}
                            </span>
                            <div className="mt-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  course.is_published
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {course.is_published ? "Published" : "Unpublished"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              {!course.is_published && (
                                <button
                                  type="button"
                                  title="Publish course"
                                  aria-label={`Publish ${course.title}`}
                                  disabled={publishingId === course.id || Boolean(deletingId)}
                                  onClick={() => setCourseToPublish(course)}
                                  className="rounded-lg border border-emerald-100 p-2 text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {publishingId === course.id ? (
                                    <span className="text-xs font-semibold">...</span>
                                  ) : (
                                    <FaCheckCircle />
                                  )}
                                </button>
                              )}
                              <button
                                type="button"
                                title="View course"
                                onClick={() =>
                                  navigate(`/admin/course/edit/${course.id}`)
                                }
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                              >
                                <FaEye />
                              </button>
                              <button
                                type="button"
                                title="Edit course"
                                onClick={() =>
                                  navigate(`/admin/course/edit/${course.id}`)
                                }
                                className="rounded-lg border border-blue-100 p-2 text-blue-700 hover:bg-blue-50"
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                title="Delete course"
                                disabled={deletingId === course.id}
                                onClick={() => setCourseToDelete(course)}
                                className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {(safePage - 1) * pageSize + 1}–
                    {Math.min(safePage * pageSize, filteredCourses.length)} of{" "}
                    {filteredCourses.length} courses
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safePage === 1}
                      onClick={() => setPage((current) => current - 1)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="px-2 text-sm text-gray-600">
                      {safePage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={safePage === totalPages}
                      onClick={() => setPage((current) => current + 1)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      {/* Publish confirmation */}
      {courseToPublish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !publishingId) {
              setCourseToPublish(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="publish-course-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <FaCheckCircle size={20} />
            </div>
            <h2 id="publish-course-title" className="mt-4 text-lg font-bold">
              Publish course?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to publish <strong>{courseToPublish.title}</strong>?
              Once published, it may become visible to learners in the app.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={Boolean(publishingId)}
                onClick={() => setCourseToPublish(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(publishingId)}
                onClick={confirmPublish}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishingId ? "Publishing..." : "Yes, publish course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {courseToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingId) {
              setCourseToDelete(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-course-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FaExclamationTriangle size={20} />
            </div>
            <h2
              id="delete-course-title"
              className="mt-4 text-lg font-bold"
            >
              Delete course?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{courseToDelete.title}</strong>? This action cannot be
              undone. Check whether related lessons or other records depend
              on this course before confirming.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setCourseToDelete(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deletingId ? "Deleting..." : "Delete course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
