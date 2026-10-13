
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaUserFriends,
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaGlobe,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
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
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString();
};

const fullName = (user) =>
  [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const apiUrl = `${BASE_URL}/api/v1/rest-auth/admin`;

  const authHeaders = useMemo(
    () => ({ Authorization: `Token ${token}` }),
    [token]
  );

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Please sign in again to view this profile.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/users/${id}/`, {
        headers: authHeaders,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Unable to load user profile.");
      }

      setUser(data);
    } catch (err) {
      setError(err.message || "Unable to load user profile.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authHeaders, id, token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const name = user ? fullName(user) : "";

  const profileFields = user
    ? [
        { label: "Username", value: user.username },
        { label: "First Name", value: user.first_name },
        { label: "Middle Name", value: user.middle_name },
        { label: "Last Name", value: user.last_name },
        { label: "Email", value: user.email, icon: FaEnvelope },
        { label: "Phone", value: user.phone, icon: FaPhone },
        { label: "Sex", value: user.sex },
        { label: "Date of Birth", value: formatDate(user.date_of_birth) },
        { label: "Town", value: user.town },
        { label: "Country", value: user.country, icon: FaGlobe },
        { label: "Age Level ID", value: user.age_level_id },
        { label: "Plan", value: user.plan },
        { label: "Paid Until", value: formatDate(user.paid_until) },
        { label: "Total Completions", value: user.total_completions },
        { label: "Joined", value: formatDate(user.date_joined), icon: FaCalendarAlt },
      ].filter((field) => field.value !== null && field.value !== undefined && field.value !== "")
    : [];

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
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <FaArrowLeft />
            Back to Users
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold">User Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              View account details and linked relationships.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-500 shadow-sm">
              Loading user profile...
            </div>
          ) : !user ? (
            <div className="rounded-xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
              <FaUser className="mx-auto mb-3 text-4xl text-gray-300" />
              <h2 className="font-semibold text-gray-800">
                User not found
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                This user may no longer be available.
              </p>
            </div>
          ) : (
            <>
              <section className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt=""
                      className="h-20 w-20 rounded-full border border-gray-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <FaUser size={30} className="text-gray-500" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold">
                      {name || user.username}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      @{user.username}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                        {user.role}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Active Account" : "Inactive Account"}
                      </span>

                      {user.account_status && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          {user.account_status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-semibold">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Personal and account details.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {profileFields.map((field) => {
                    const Icon = field.icon;

                    return (
                      <div
                        key={field.label}
                        className="min-w-0 rounded-lg border border-gray-100 p-4"
                      >
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          {Icon && <Icon />}
                          {field.label}
                        </p>
                        <p className="mt-2 break-words text-sm font-medium text-gray-800">
                          {String(field.value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-semibold">Account Information</h2>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Online Status</p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                      {user.is_online ? (
                        <>
                          <FaCheckCircle className="text-green-600" />
                          Online
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="text-gray-400" />
                          Offline
                        </>
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Admin Flag</p>
                    <p className="mt-2 text-sm font-semibold">
                      {user.is_admin ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Parent Account</p>
                    <p className="mt-2 text-sm font-semibold">
                      {user.parent_username || "Not linked"}
                    </p>
                  </div>
                </div>
              </section>

              {user.role === "Parent" && (
                <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                  <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <FaUserFriends size={20} />
                      </div>
                      <div>
                        <h2 className="font-semibold">Linked Children</h2>
                        <p className="mt-1 text-xs text-gray-500">
                          {user.children?.length || 0} child accounts
                        </p>
                      </div>
                    </div>
                  </div>

                  {!user.children?.length ? (
                    <div className="px-6 py-10 text-center text-sm text-gray-500">
                      No linked children were found for this parent.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {user.children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                              <FaUserGraduate />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800">
                                {fullName(child) || child.username}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                @{child.username}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              child.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {child.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDetailsPage;
