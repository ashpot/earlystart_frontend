
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaSync,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserFriends,
  FaUserShield,
  FaTimes,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileExcel
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

const PAGE_SIZE = 10;

const ROLES = [
  { value: "all", label: "All Users" },
  { value: "Student", label: "Students" },
  { value: "Instructor", label: "Instructors" },
  { value: "Parent", label: "Parents" },
  { value: "Admin", label: "Admins" },
];

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

const fullName = (user) =>
  [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

// Escape CSV values and guard against spreadsheet formula injection.
const toCsvCell = (value) => {
  let text = value == null ? "" : String(value);

  if (/^[=+@\-\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
};

const roleIcon = {
  Student: FaUserGraduate,
  Instructor: FaChalkboardTeacher,
  Parent: FaUserFriends,
  Admin: FaUserShield,
};



const UsersPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const loadUsers = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Please sign in again to view users.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/users/`, {
        headers: authHeaders,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Unable to load users.");
      }

      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authHeaders, token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = role === "all" || user.role === role;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);

      const searchable = [
        user.username,
        user.first_name,
        user.middle_name,
        user.last_name,
        user.email,
        user.phone,
        user.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesRole &&
        matchesStatus &&
        (!query || searchable.includes(query))
      );
    });
  }, [users, role, statusFilter, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [role, statusFilter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / PAGE_SIZE)
  );

  const exportUsersToExcel = () => {
    if (!filteredUsers.length) {
      window.alert("There are no users to export.");
      return;
    }

    // Export every user matching the current filters, not only the visible page.
    const columns = [
      "User ID",
      "Full Name",
      "Username",
      "Role",
      "Email",
      "Phone",
      "Children",
      "Date Joined",
      "Status",
    ];

    const rows = filteredUsers.map((user) => [
      user.id,
      fullName(user) || user.username,
      user.username,
      user.role,
      user.email,
      user.phone,
      user.role === "Parent" ? user.children_count || 0 : "",
      formatDate(user.date_joined),
      user.is_active ? "Active" : "Inactive",
    ]);

    const csv = [columns, ...rows]
      .map((row) => row.map(toCsvCell).join(","))
      .join("\r\n");

    // UTF-8 BOM helps Excel display names and other non-ASCII text correctly.
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `earlystart-users-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const location = useLocation();

const canManageUser = (user) =>
  ["Instructor", "Admin"].includes(user.role);

const handleDeleteUser = async (user) => {
  if (!canManageUser(user)) {
    window.alert("Only Instructor and Admin accounts can be deleted.");
    return;
  }

  const confirmed = window.confirm(
    `Delete ${user.first_name || user.username}'s account? This action cannot be undone.`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/rest-auth/admin/users/${user.id}/manage/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || "Unable to delete this user.");
    }

    // Refresh the list using your existing loading function.
    await loadUsers();
  } catch (error) {
    window.alert(error.message);
  }
};

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pageUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const countForRole = (selectedRole) =>
    selectedRole === "all"
      ? users.length
      : users.filter((user) => user.role === selectedRole).length;

  const stats = [
    {
      label: "All Users",
      value: countForRole("all"),
      icon: FaUsers,
      role: "all",
      bg: "bg-blue-50",
    },
    {
      label: "Students",
      value: countForRole("Student"),
      icon: FaUserGraduate,
      role: "Student",
      bg: "bg-yellow-50",
    },
    {
      label: "Instructors",
      value: countForRole("Instructor"),
      icon: FaChalkboardTeacher,
      role: "Instructor",
      bg: "bg-green-50",
    },
    {
      label: "Parents",
      value: countForRole("Parent"),
      icon: FaUserFriends,
      role: "Parent",
      bg: "bg-purple-50",
    },
    {
      label: "Admins",
      value: countForRole("Admin"),
      icon: FaUserShield,
      role: "Admin",
      bg: "bg-orange-50",
    },
  ];

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
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                View student, instructor, parent, and administrator accounts.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/add-user/")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FBD22F] px-4 py-3 text-sm font-bold text-[#343652] hover:opacity-90"
              >
                <FaPlus />
                Add User
              </button>

              <button
                type="button"
                onClick={loadUsers}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <FaSync />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <button
                  key={stat.label}
                  type="button"
                  onClick={() => setRole(stat.role)}
                  className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow ${
                    role === stat.role
                      ? "border-blue-300 ring-2 ring-blue-100"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_180px_auto]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, username, email, or phone..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                {ROLES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                <option value="all">All account statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRole("all");
                  setStatusFilter("all");
                }}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="font-semibold">User Directory</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Select a user to view their profile.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  {filteredUsers.length} users
                </span>
                <button
                  type="button"
                  onClick={exportUsersToExcel}
                  disabled={loading || filteredUsers.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Export all users matching the current filters"
                >
                  <FaFileExcel />
                  Export to Excel
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-500">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <FaUsers className="mx-auto mb-3 text-4xl text-gray-300" />
                <h3 className="font-semibold text-gray-700">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <>
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4">User</th>
                        <th className="px-5 py-4">Role</th>
                        <th className="px-5 py-4">Contact</th>
                        <th className="px-5 py-4">Joined</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {pageUsers.map((user) => {
                        const Icon = roleIcon[user.role] || FaUsers;
                        const name = fullName(user);

                        return (
                          <tr
                            key={user.id}
                            className="transition hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {user.photo ? (
                                  <img
                                    src={user.photo}
                                    alt=""
                                    className="h-10 w-10 rounded-full border border-gray-100 object-cover"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                    <Icon />
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-800">
                                    {name || user.username}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    @{user.username}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                                {user.role}
                              </span>
                              {user.role === "Parent" && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {user.children_count || 0} children
                                </p>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-gray-700">
                                {user.email || "No email"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {user.phone || "No phone"}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                              {formatDate(user.date_joined)}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  user.is_active
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {user.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
  <button
    type="button"
    onClick={() => navigate(`/admin/users/${user.id}`)}
    title="View user"
    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
  >
    <FaEye />
  </button>

  {canManageUser(user) && (
    <>
      <button
        type="button"
        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
        title="Edit user"
        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
      >
        <FaEdit />
      </button>

      <button
        type="button"
        onClick={() => handleDeleteUser(user)}
        title="Delete user"
        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
      >
        <FaTrash />
      </button>
    </>
  )}
</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      filteredUsers.length
                    )}{" "}
                    of {filteredUsers.length} users
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      aria-label="Previous page"
                      className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"
                    >
                      <FaChevronLeft size={12} />
                    </button>

                    <span className="px-2 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      aria-label="Next page"
                      className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"
                    >
                      <FaChevronRight size={12} />
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
};

export default UsersPage;
