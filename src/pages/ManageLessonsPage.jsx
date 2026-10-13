
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlus, FaSearch, FaEdit, FaTrash,
  FaBook, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const API = `${BASE_URL}/api/v1/rest-auth/admin/`;
const NAVY = "#343652";
const YELLOW = "#FBD22F";
const PAGE_SIZE = 10;

export default function ManageLessonsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toggleSidebar = () => setCollapsed((previous) => !previous);

  const loadData = useCallback(async () => {
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = { Authorization: `Token ${token}` };

      const [lessonResponse, courseResponse] = await Promise.all([
        fetch(`${API}lessons/`, { headers }),
        fetch(`${API}courses/`, { headers }),
      ]);

      if (!lessonResponse.ok) throw new Error("Unable to load lessons.");

      const lessonData = await lessonResponse.json();
      setLessons(
        Array.isArray(lessonData) ? lessonData : lessonData.results || []
      );

      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourses(
          Array.isArray(courseData) ? courseData : courseData.results || []
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load lessons.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getCourseTitle = (lesson) => {
    if (lesson.course_title) return lesson.course_title;

    const courseId =
      typeof lesson.course === "object" ? lesson.course?.id : lesson.course;

    return courses.find((course) => String(course.id) === String(courseId))?.title
      || `Course #${courseId}`;
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const courseId =
        typeof lesson.course === "object"
          ? lesson.course?.id
          : lesson.course;

      const matchesSearch =
        !query ||
        lesson.title?.toLowerCase().includes(query) ||
        lesson.course_title?.toLowerCase().includes(query) ||
        lesson.section_title?.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (courseFilter === "all" || String(courseId) === String(courseFilter))
      );
    });
  }, [lessons, search, courseFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, courseFilter]);

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `${API}lessons/${deleteTarget.id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to delete lesson.");
      }

      setLessons((previous) =>
        previous.filter((lesson) => lesson.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Failed to delete lesson.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatDuration = (value) => {
    if (!value) return "—";

    // DRF DurationField may return "HH:MM:SS" or "P..." ISO duration.
    const match = String(value).match(
      /^(-)?(?:(\d+)\s+days?,?\s*)?(\d{1,2}):(\d{2}):(\d{2})(?:\.\d+)?$/
    );

    if (match) {
      const totalMinutes =
        (Number(match[2] || 0) * 24 + Number(match[3] || 0)) * 60 +
        Number(match[4] || 0);

      return `${match[1] || ""}${totalMinutes}m ${match[5]}s`;
    }

    return String(value);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F8FA", color: NAVY }}>
      <aside className={`fixed inset-y-0 left-0 z-40 hidden overflow-y-auto border-r border-gray-100 bg-white transition-[width] duration-300 md:block ${collapsed ? "w-20" : "w-60"}`}>
        {collapsed
          ? <CollapsedSidebar toggleSidebar={toggleSidebar} isSidebarCollapsed={collapsed} />
          : <Sidebar toggleSidebar={toggleSidebar} isSidebarCollapsed={collapsed} />}
      </aside>

      <div className={`min-h-screen min-w-0 transition-[margin] duration-300 ${collapsed ? "md:ml-20" : "md:ml-60"}`}>
        <DashboardNavbar toggleSidebar={toggleSidebar} isSidebarCollapsed={collapsed} />

        <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Manage Lessons</h1>
              <p className="mt-2 text-sm text-gray-500">Manage learning content across your courses.</p>
            </div>

            <Link to="/admin/lesson/add" className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold" style={{ backgroundColor: YELLOW, color: NAVY }}>
              <FaPlus /> Add Lesson
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Lessons</p>
              <p className="mt-2 text-3xl font-bold">{lessons.length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Free Preview Lessons</p>
              <p className="mt-2 text-3xl font-bold">{lessons.filter((lesson) => lesson.preview).length}</p>
            </div>
          </div>

          {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search lessons..." className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#91ADC6]" />
              </div>

              <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm">
                <option value="all">All courses</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead style={{ backgroundColor: "#F9FAFB" }}>
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Lesson</th>
                    <th className="px-5 py-4">Course / Section</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Preview</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="6" className="px-5 py-12 text-center text-gray-500">Loading lessons...</td></tr>
                  ) : visible.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-12 text-center">
                        <FaBook className="mx-auto mb-3 text-3xl text-gray-300" />
                        <p className="font-semibold">No lessons found</p>
                        <p className="mt-1 text-gray-500">Try a different search or add a lesson.</p>
                      </td>
                    </tr>
                  ) : visible.map((lesson) => (
                    <tr key={lesson.id} className="transition hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{lesson.title}</p>
                        <p className="mt-1 text-xs text-gray-400">ID: {lesson.id}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p>{getCourseTitle(lesson)}</p>
                        <p className="mt-1 text-xs text-gray-500">{lesson.section_title || "No section"}</p>
                      </td>
                      <td className="px-5 py-4">{formatDuration(lesson.duration)}</td>
                      <td className="px-5 py-4">{lesson.order}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${lesson.preview ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {lesson.preview ? "Enabled" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" title="Edit lesson" onClick={() => navigate(`/admin/lesson/edit/${lesson.id}`)} className="rounded-lg p-2 hover:bg-blue-50">
                            <FaEdit />
                          </button>
                          <button type="button" title="Delete lesson" onClick={() => setDeleteTarget(lesson)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && filtered.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} lessons
                </p>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40" aria-label="Previous page"><FaChevronLeft size={12} /></button>
                  <span className="px-2 text-sm">Page {safePage} of {totalPages}</span>
                  <button type="button" disabled={safePage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40" aria-label="Next page"><FaChevronRight size={12} /></button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-lesson-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"><FaTrash size={20} /></div>
            <h2 id="delete-lesson-title" className="text-lg font-bold">Delete Lesson?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Delete <strong className="text-gray-700">{deleteTarget.title}</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
