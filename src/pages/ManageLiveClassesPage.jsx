
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaVideo,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaSyncAlt,
  FaUsers,
} from "react-icons/fa";
import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getScheduleStatus(item) {
  const now = Date.now();
  const start = new Date(item.start_time).getTime();
  const end = new Date(item.end_time).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return "Invalid schedule";
  if (now < start) return "Upcoming";
  if (now > end) return "Ended";

  return "In scheduled window";
}

export default function ManageLiveClassesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.message || "");
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [enabled, setEnabled] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const endpoint = `${BASE_URL}/api/v1/rest-auth/admin/live-classes/`;

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const fetchLiveClasses = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Your session is unavailable. Please sign in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (plan) params.set("plan", plan);
      if (enabled) params.set("on", enabled);

      const query = params.toString();
      const response = await fetch(
        `${endpoint}${query ? `?${query}` : ""}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load live classes."
        );
      }

      setLiveClasses(
        Array.isArray(data) ? data : data.results || []
      );
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, endpoint, search, plan, enabled]);

  useEffect(() => {
    fetchLiveClasses();
  }, [fetchLiveClasses]);

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${endpoint}${item.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to delete this live class.");
      }

      setLiveClasses((previous) =>
        previous.filter((liveClass) => liveClass.id !== item.id)
      );
      setNotice("Live class deleted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(liveClasses.length / PAGE_SIZE));
  const visibleClasses = liveClasses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const upcomingCount = liveClasses.filter(
    (item) => getScheduleStatus(item) === "Upcoming"
  ).length;

  const inWindowCount = liveClasses.filter(
    (item) => getScheduleStatus(item) === "In scheduled window"
  ).length;

  const enabledCount = liveClasses.filter((item) => item.on).length;

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#343652]">
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
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Content Management
              </p>
              <h1 className="text-2xl font-bold text-[#343652]">
                Live Classes
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage scheduled sessions, instructors, and access plans.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/live-classes/add")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBD22F] px-5 py-3 text-sm font-bold text-[#343652] hover:opacity-90"
            >
              <FaPlus /> Add Live Class
            </button>
          </div>

          {notice && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                className="font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchLiveClasses}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Classes", value: liveClasses.length, icon: FaVideo },
              { label: "Upcoming", value: upcomingCount, icon: FaCalendarAlt },
              { label: "Within Schedule", value: inWindowCount, icon: FaVideo },
              { label: "Enabled", value: enabledCount, icon: FaExternalLinkAlt },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{label}</p>
                  <Icon className="text-[#91ADC6]" />
                </div>
                <p className="mt-3 text-2xl font-bold text-[#343652]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:flex-row">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search live classes by title..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <select
              value={plan}
              onChange={(event) => setPlan(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
            >
              <option value="">All plans</option>
              <option value="Free">Free</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>

            <select
              value={enabled}
              onChange={(event) => setEnabled(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
            >
              <option value="">All statuses</option>
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>

            <button
              type="button"
              onClick={fetchLiveClasses}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <FaSyncAlt /> Refresh
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                Loading live classes...
              </div>
            ) : liveClasses.length === 0 ? (
              <div className="p-12 text-center">
                <FaVideo className="mx-auto mb-4 text-3xl text-gray-300" />
                <h2 className="font-bold text-[#343652]">
                  No live classes found
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Add a class or change your search filters.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Class</th>
                        <th className="px-5 py-4">Instructor</th>
                        <th className="px-5 py-4">Schedule</th>
                        <th className="px-5 py-4">Plan</th>
                        <th className="px-5 py-4">Schedule Status</th>
                        <th className="px-5 py-4">Enabled</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {visibleClasses.map((item) => {
                        const scheduleStatus = getScheduleStatus(item);

                        return (
                          <tr key={item.id} className="hover:bg-gray-50/70">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="h-12 w-16 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100">
                                    <FaVideo className="text-gray-400" />
                                  </div>
                                )}

                                <div>
                                  <p className="font-semibold text-[#343652]">
                                    {item.title}
                                  </p>
                                  <p className="mt-1 max-w-xs truncate text-xs text-gray-400">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              {item.instructor_name || `Instructor #${item.instructor}`}
                            </td>

                            <td className="px-5 py-4">
                              <p>{formatDate(item.start_time)}</p>
                              <p className="mt-1 text-xs text-gray-400">
                                Ends {formatDate(item.end_time)}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                {item.plan}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-xs text-gray-600">
                                {scheduleStatus}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  item.on
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {item.on ? "Enabled" : "Disabled"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Open class link"
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                  >
                                    <FaExternalLinkAlt />
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(`/admin/live-classes/${item.id}/participants`)
                                  }
                                  title="View enrolled students"
                                  className="rounded-lg p-2 text-[#343652] hover:bg-blue-50"
                                >
                                  <FaUsers />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(`/admin/live-classes/edit/${item.id}`)
                                  }
                                  title="Edit live class"
                                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                >
                                  <FaEdit />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(item)}
                                  disabled={deletingId === item.id}
                                  title="Delete live class"
                                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {(page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, liveClasses.length)} of{" "}
                    {liveClasses.length} classes
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((previous) => previous - 1)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="px-2 text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((previous) => previous + 1)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
