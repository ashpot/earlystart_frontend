
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaFolderOpen,
  FaPlus,
  FaRedo,
  FaSearch,
  FaTrash,
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

const PAGE_SIZE = 10;

const getCategoryImage = (category) =>
  category.image_url || category.image || null;

export default function CategoriesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const loadCategories = useCallback(async () => {
    if (!token) {
      setError("Your session could not be found. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/rest-auth/admin/categories/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            `Unable to load categories (HTTP ${response.status}).`
        );
      }

      // Supports either a normal list or a paginated DRF response.
      const rows = Array.isArray(result)
        ? result
        : Array.isArray(result?.results)
          ? result.results
          : Array.isArray(result?.data)
            ? result.data
            : [];

      setCategories(rows);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError(
        err.message || "Something went wrong while loading categories."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return categories;

    return categories.filter((category) => {
      const title = String(category.title || "").toLowerCase();
      const description = String(category.description || "").toLowerCase();

      return title.includes(term) || description.includes(term);
    });
  }, [categories, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedCategories = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;

    return filteredCategories.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredCategories, safePage]);

  const firstItem =
    filteredCategories.length === 0
      ? 0
      : (safePage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(
    safePage * PAGE_SIZE,
    filteredCategories.length
  );

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
  }, [safePage, totalPages]);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
    setNotice("");
  };

  
const handleDelete = async (category) => {
  const confirmed = window.confirm(
    `Delete "${category.title}"? This action cannot be undone.`
  );

  if (!confirmed) return;

  if (!token) {
    setError("Your session has expired. Please sign in again.");
    return;
  }

  setDeletingId(category.id);
  setError("");
  setNotice("");

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/rest-auth/admin/categories/${category.id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      throw new Error(
        data?.detail ||
          `Failed to delete category (HTTP ${response.status}).`
      );
    }

    setCategories((previous) =>
      previous.filter((item) => item.id !== category.id)
    );

    setNotice(`"${category.title}" was deleted successfully.`);
  } catch (err) {
    console.error("Category deletion failed:", err);
    setError(err.message || "Unable to delete this category.");
  } finally {
    setDeletingId(null);
  }
};


  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F7F8FA", color: COLORS.navy }}
    >
      {/* Desktop sidebar */}
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

      {/* Main content */}
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
          {/* Heading */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
              >
                <FaArrowLeft size={12} />
                Dashboard
              </button>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Categories
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage the categories used to organize Earlystart learning
                content.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/category/add")}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition hover:brightness-95"
              style={{
                backgroundColor: COLORS.yellow,
                color: COLORS.navy,
              }}
            >
              <FaPlus />
              Add Category
            </button>
          </div>

          {/* Notifications */}
          {notice && (
            <div
              role="status"
              className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
            >
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                className="font-bold"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={loadCategories}
                className="font-bold underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: COLORS.navy,
                  color: COLORS.white,
                }}
              >
                <FaFolderOpen size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Total categories</p>
                <p className="mt-1 text-2xl font-bold">
                  {loading ? "…" : categories.length.toLocaleString("en-NG")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "#FFF5C2",
                  color: COLORS.navy,
                }}
              >
                <FaSearch size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">Matching categories</p>
                <p className="mt-1 text-2xl font-bold">
                  {loading
                    ? "…"
                    : filteredCategories.length.toLocaleString("en-NG")}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="text-base font-bold">All Categories</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Browse and manage your learning categories.
                </p>
              </div>

              <div className="flex w-full items-center gap-3 sm:w-auto">
                <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
                  <FaSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={14}
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search categories..."
                    aria-label="Search categories"
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#91ADC6] focus:ring-2 focus:ring-[#91ADC6]/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={loadCategories}
                  disabled={loading}
                  title="Refresh categories"
                  aria-label="Refresh categories"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  <FaRedo className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Description</th>
                    <th className="px-5 py-4 font-semibold">Image</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }, (_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 4 }, (_, cell) => (
                          <td key={cell} className="px-5 py-5">
                            <div className="h-4 animate-pulse rounded bg-gray-100" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : paginatedCategories.length ? (
                    paginatedCategories.map((category) => (
                      <tr
                        key={category.id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                              style={{ backgroundColor: "#EAF0F5" }}
                            >
                              {getCategoryImage(category) ? (
                                <img
                                  src={getCategoryImage(category)}
                                  alt={category.title}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <FaFolderOpen
                                  style={{ color: COLORS.navy }}
                                  size={17}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-52 break-words text-sm font-semibold text-gray-900">
                                {category.title}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                ID: {category.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-md px-5 py-4">
                          <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                            {category.description || "No description provided"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {getCategoryImage(category) ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              Uploaded
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                              No image
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              title="Edit category"
                              aria-label={`Edit ${category.title}`}
                              onClick={() =>
                                navigate(`/admin/category/edit/${category.id}`)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-[#91ADC6] hover:bg-[#EAF0F5]"
                            >
                              <FaEdit size={14} />
                            </button>

                            <button
                              type="button"
                              title="Delete category"
                              aria-label={`Delete ${category.title}`}
                              disabled={deletingId === category.id}
                              onClick={() => handleDelete(category)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === category.id ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                              ) : (
                                <FaTrash size={13} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-16 text-center">
                        <div
                          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: "#EAF0F5" }}
                        >
                          <FaFolderOpen
                            size={24}
                            style={{ color: COLORS.navy }}
                          />
                        </div>

                        <h3 className="text-sm font-bold text-gray-800">
                          {search
                            ? "No matching categories"
                            : "No categories yet"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                          {search
                            ? "Try another title or description."
                            : "Create your first category to organize learning content."}
                        </p>

                        {!search && (
                          <button
                            type="button"
                            onClick={() => navigate("/admin/category/add")}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
                            style={{
                              backgroundColor: COLORS.yellow,
                              color: COLORS.navy,
                            }}
                          >
                            <FaPlus size={12} />
                            Add Category
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {firstItem}–{lastItem}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {filteredCategories.length}
                </span>{" "}
                categories
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage <= 1 || loading}
                  onClick={() => goToPage(safePage - 1)}
                  className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaChevronLeft size={10} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    disabled={loading}
                    aria-current={safePage === page ? "page" : undefined}
                    className="flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition disabled:opacity-50"
                    style={
                      safePage === page
                        ? {
                            backgroundColor: COLORS.navy,
                            borderColor: COLORS.navy,
                            color: COLORS.white,
                          }
                        : {
                            backgroundColor: COLORS.white,
                            borderColor: "#E5E7EB",
                            color: COLORS.navy,
                          }
                    }
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safePage >= totalPages || loading}
                  onClick={() => goToPage(safePage + 1)}
                  className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">Next</span>
                  <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
