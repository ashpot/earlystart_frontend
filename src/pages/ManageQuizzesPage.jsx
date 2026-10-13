
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

export default function ManageQuizzesPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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

      const [quizResponse, categoryResponse] = await Promise.all([
        fetch(`${API}quizzes/`, { headers }),
        fetch(`${API}categories/`, { headers }),
      ]);

      if (!quizResponse.ok) throw new Error("Unable to load quizzes.");

      const quizData = await quizResponse.json();
      setQuizzes(Array.isArray(quizData) ? quizData : quizData.results || []);

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategories(
          Array.isArray(categoryData) ? categoryData : categoryData.results || []
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quizzes.filter((quiz) => {
      const categoryId =
        typeof quiz.category === "object"
          ? quiz.category?.id
          : quiz.category;

      const matchesSearch =
        !query ||
        quiz.title?.toLowerCase().includes(query) ||
        quiz.description?.toLowerCase().includes(query) ||
        quiz.category_title?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        String(categoryId || "") === String(categoryFilter);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && quiz.is_active) ||
        (statusFilter === "inactive" && !quiz.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [quizzes, search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter]);

  const getCategoryTitle = (quiz) => {
    if (quiz.category_title) return quiz.category_title;

    const id =
      typeof quiz.category === "object"
        ? quiz.category?.id
        : quiz.category;

    return categories.find((item) => String(item.id) === String(id))?.title
      || (id ? `Category #${id}` : "Uncategorized");
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`${API}quizzes/${deleteTarget.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to delete quiz.");
      }

      setQuizzes((previous) =>
        previous.filter((quiz) => quiz.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Failed to delete quiz.");
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
              <h1 className="text-2xl font-bold sm:text-3xl">Manage Quizzes</h1>
              <p className="mt-2 text-sm text-gray-500">Manage quizzes, plans, and assessment settings.</p>
            </div>
            <Link to="/admin/quiz/add" className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold" style={{ backgroundColor: YELLOW, color: NAVY }}>
              <FaPlus /> Add Quiz
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ["Total Quizzes", quizzes.length],
              ["Active Quizzes", quizzes.filter((quiz) => quiz.is_active).length],
              ["Inactive Quizzes", quizzes.filter((quiz) => !quiz.is_active).length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search quizzes..." className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#91ADC6]" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm">
                  <option value="all">All categories</option>
                  <option value="">Uncategorized</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
                </select>

                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm">
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead style={{ backgroundColor: "#F9FAFB" }}>
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Quiz</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Plan</th>
                    <th className="px-5 py-4">Pass Mark</th>
                    <th className="px-5 py-4">Time Limit</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="7" className="px-5 py-12 text-center text-gray-500">Loading quizzes...</td></tr>
                  ) : visible.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-5 py-12 text-center">
                        <FaClipboardList className="mx-auto mb-3 text-3xl text-gray-300" />
                        <p className="font-semibold">No quizzes found</p>
                        <p className="mt-1 text-gray-500">Try another filter or create a quiz.</p>
                      </td>
                    </tr>
                  ) : visible.map((quiz) => (
                    <tr key={quiz.id} className="transition hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {quiz.photo_url ? (
                            <img src={quiz.photo_url} alt="" className="h-11 w-11 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100"><FaClipboardList /></div>
                          )}
                          <div>
                            <p className="font-semibold">{quiz.title}</p>
                            <p className="mt-1 max-w-xs truncate text-xs text-gray-500">{quiz.description || "No description"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">{getCategoryTitle(quiz)}</td>
                      <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">{quiz.plan}</span></td>
                      <td className="px-5 py-4">{quiz.pass_mark}%</td>
                      <td className="px-5 py-4">{quiz.time_limit ? `${quiz.time_limit} min` : "Unlimited"}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${quiz.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {quiz.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" title="Edit quiz" onClick={() => navigate(`/admin/quiz/edit/${quiz.id}`)} className="rounded-lg p-2 hover:bg-blue-50"><FaEdit /></button>
                          <button type="button" title="Delete quiz" onClick={() => setDeleteTarget(quiz)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && filtered.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} quizzes</p>
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
          <div role="dialog" aria-modal="true" aria-labelledby="delete-quiz-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"><FaTrash size={20} /></div>
            <h2 id="delete-quiz-title" className="text-lg font-bold">Delete Quiz?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">Are you sure you want to delete <strong className="text-gray-700">{deleteTarget.title}</strong>? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{deleting ? "Deleting..." : "Delete Quiz"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
