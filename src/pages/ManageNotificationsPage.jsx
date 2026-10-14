
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaPlus,
  FaSearch,
  FaEye,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSync,
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
};

const API = `${BASE_URL}/api/v1/rest-auth/admin`;

const audienceLabels = {
  all: "All Users",
  parents: "Parents",
  students: "Students",
  specific: "Specific User",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString();
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="rounded-xl bg-gray-50 p-3">
          <Icon className="text-lg" style={{ color: COLORS.navy }} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold" style={{ color: COLORS.navy }}>
        {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
}

export default function ManageNotificationsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("all");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (audience !== "all") params.set("audience", audience);

      const query = params.toString();
      const response = await fetch(
        `${API}/notifications/${query ? `?${query}` : ""}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to load notifications.");
      }

      setNotifications(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [token, search, audience]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const totals = notifications.reduce(
    (acc, item) => {
      acc.campaigns += 1;
      acc.devices += Number(item.device_count || 0);
      acc.successes += Number(item.success_count || 0);
      acc.failures += Number(item.failure_count || 0);
      return acc;
    },
    { campaigns: 0, devices: 0, successes: 0, failures: 0 }
  );

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
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="text-left">
              <p className="mb-2 text-sm text-gray-500">
                Communication
              </p>
              <h1 className="text-2xl font-bold">Manage Notifications</h1>
              <p className="mt-2 text-sm text-gray-500">
                View notification history and FCM sending results.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/notifications/send")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-gray-900"
              style={{ backgroundColor: COLORS.yellow }}
            >
              <FaPlus /> Send Notification
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Campaigns shown" value={totals.campaigns} icon={FaBell} />
            <StatCard label="Devices attempted" value={totals.devices} icon={FaUsers} />
            <StatCard label="Accepted by FCM" value={totals.successes} icon={FaCheckCircle} />
            <StatCard label="Failed sends" value={totals.failures} icon={FaExclamationTriangle} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, message, or recipient"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none"
                >
                  <option value="all">All audiences</option>
                  <option value="parents">Parents</option>
                  <option value="students">Students</option>
                  <option value="specific">Specific user</option>
                </select>

                <button
                  onClick={fetchNotifications}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium hover:bg-gray-50"
                >
                  <FaSync /> Refresh
                </button>
              </div>
            </div>

            {error && (
              <div className="m-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Notification</th>
                    <th className="px-5 py-4">Audience</th>
                    <th className="px-5 py-4">Devices</th>
                    <th className="px-5 py-4">Results</th>
                    <th className="px-5 py-4">Date sent</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                        Loading notifications...
                      </td>
                    </tr>
                  ) : notifications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                        No notifications found.
                      </td>
                    </tr>
                  ) : (
                    notifications.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="max-w-xs px-5 py-4">
                          <p className="font-semibold text-gray-800">
                            {item.title}
                          </p>
                          <p className="mt-1 truncate text-gray-500">
                            {item.body}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            To: {item.receiver || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {audienceLabels[item.audience] || item.audience || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold">{item.device_count ?? "—"}</p>
                          <p className="text-xs text-gray-500">
                            {item.recipient_count ?? 0} users
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-green-700">
                            {item.success_count ?? 0} accepted
                          </p>
                          <p className="mt-1 text-xs text-red-600">
                            {item.failure_count ?? 0} failed
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                          {formatDate(item.date_created)}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() =>
                              navigate(`/admin/notifications/${item.id}`)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 font-medium hover:bg-gray-50"
                          >
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
