
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlus, FaSearch, FaEdit, FaTrash,
  FaChevronLeft, FaChevronRight, FaClipboardList,
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

export default function ManageLessonTestsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [tests, setTests] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lessonFilter, setLessonFilter] = useState("all");
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

      const [testResponse, lessonResponse] = await Promise.all([
        fetch(`${API}lesson-tests/`, { headers }),
        fetch(`${API}lessons/`, { headers }),
      ]);

      if (!testResponse.ok) throw new Error("Unable to load questions.");

      const testData = await testResponse.json();
      setTests(Array.isArray(testData) ? testData : testData.results || []);

      if (lessonResponse.ok) {
        const lessonData = await lessonResponse.json();
        setLessons(Array.isArray(lessonData) ? lessonData : lessonData.results || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getLessonTitle = (test) => {
    if (test.lesson_title) return test.lesson_title;

    const lessonId =
      typeof test.lesson === "object" ? test.lesson?.id : test.lesson;

    if (!lessonId) return "Unassigned";

    return lessons.find((lesson) => String(lesson.id) === String(lessonId))?.title
      || `Lesson #${lessonId}`;
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tests.filter((test) => {
      const lessonId =
        typeof test.lesson === "object" ? test.lesson?.id : test.lesson;

      const matchesSearch =
        !query ||
        test.question_text?.toLowerCase().includes(query) ||
        test.lesson_title?.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (lessonFilter === "all" ||
          String(lessonId || "") === String(lessonFilter))
      );
    });
  }, [tests, search, lessonFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, lessonFilter]);

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `${API}lesson-tests/${deleteTarget.id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to delete question.");
      }

      setTests((previous) =>
        previous.filter((test) => test.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Failed to delete question.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
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
              <h1 className="text-2xl font-bold sm:text-3xl">Manage Lesson Tests</h1>
              <p className="mt-2 text-sm text-gray-500">Create and manage lesson assessment questions.</p>
            </div>
            <Link to="/admin/lesson-test/add" className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold" style={{ backgroundColor: YELLOW, color: NAVY }}>
              <FaPlus /> Add Question
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Questions</p>
              <p className="mt-2 text-3xl font-bold">{tests.length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Lessons With Questions</p>
              <p className="mt-2 text-3xl font-bold">
                {new Set(tests.map((test) => test.lesson).filter(Boolean).map((lesson) => typeof lesson === "object" ? lesson.id : lesson)).size}
              </p>
            </div>
          </div>

          {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search questions..." className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#91ADC6]" />
              </div>

              <select value={lessonFilter} onChange={(event) => setLessonFilter(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm">
                <option value="all">All lessons</option>
                <option value="">Unassigned questions</option>
                {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
              </select>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead style={{ backgroundColor: "#F9FAFB" }}>
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Question</th>
                    <th className="px-5 py-4">Lesson</th>
                    <th className="px-5 py-4">Options</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="4" className="px-5 py-12 text-center text-gray-500">Loading questions...</td></tr>
                  ) : visible.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-5 py-12 text-center">
                        <FaClipboardList className="mx-auto mb-3 text-3xl text-gray-300" />
                        <p className="font-semibold">No questions found</p>
                        <p className="mt-1 text-gray-500">Try a different search or add a question.</p>
                      </td>
                    </tr>
                  ) : visible.map((test) => (
                    <tr key={test.id} className="transition hover:bg-gray-50">
                      <td className="max-w-md px-5 py-4">
                        <p className="line-clamp-3 font-medium">{test.question_text}</p>
                        <p className="mt-1 text-xs text-gray-400">ID: {test.id}</p>
                      </td>
                      <td className="px-5 py-4">{getLessonTitle(test)}</td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-500">A. {test.option_a}</p>
                        <p className="mt-1 text-xs text-gray-500">B. {test.option_b}</p>
                        <p className="mt-1 text-xs text-gray-500">C. {test.option_c}</p>
                        <p className="mt-1 text-xs text-gray-500">D. {test.option_d}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" title="Edit question" onClick={() => navigate(`/admin/lesson-test/edit/${test.id}`)} className="rounded-lg p-2 hover:bg-blue-50"><FaEdit /></button>
                          <button type="button" title="Delete question" onClick={() => setDeleteTarget(test)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FaTrash /></button>
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
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} questions
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
          <div role="dialog" aria-modal="true" aria-labelledby="delete-question-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"><FaTrash size={20} /></div>
            <h2 id="delete-question-title" className="text-lg font-bold">Delete Question?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
