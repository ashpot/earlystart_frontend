
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSearch,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaSyncAlt,
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

export default function LiveClassParticipantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [liveClass, setLiveClass] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const endpoint =
    `${BASE_URL}/api/v1/rest-auth/admin/live-classes/${id}/participants/`;

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const fetchParticipants = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Your session is unavailable. Please sign in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load live class participants."
        );
      }

      setLiveClass(data.live_class);
      setParticipants(data.participants || []);
      setTotalParticipants(data.total_participants ?? 0);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, token]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const filteredParticipants = participants.filter((student) => {
    const term = search.trim().toLowerCase();

    if (!term) return true;

    return [
      student.username,
      student.first_name,
      student.last_name,
      student.email,
      student.phone,
    ].some((value) => String(value || "").toLowerCase().includes(term));
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredParticipants.length / PAGE_SIZE)
  );

  const visibleParticipants = filteredParticipants.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

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
          <button
            type="button"
            onClick={() => navigate("/admin/live-classes")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#343652]"
          >
            <FaArrowLeft />
            Back to Live Classes
          </button>

          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Live Class Management
              </p>

              <h1 className="text-2xl font-bold text-[#343652]">
                Enrolled Students
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                View students enrolled in this live class.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchParticipants}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchParticipants}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {liveClass && (
            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E9EAEC]">
                  <FaUsers className="text-xl text-[#343652]" />
                </div>

                <div className="min-w-0">
                  <h2 className="break-words text-lg font-bold text-[#343652]">
                    {liveClass.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Starts: {formatDate(liveClass.start_time)}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Ends: {formatDate(liveClass.end_time)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Enrollments</p>
                <FaUsers className="text-[#91ADC6]" />
              </div>

              <p className="mt-3 text-3xl font-bold text-[#343652]">
                {totalParticipants}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Search Results</p>
                <FaSearch className="text-[#91ADC6]" />
              </div>

              <p className="mt-3 text-3xl font-bold text-[#343652]">
                {filteredParticipants.length}
              </p>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={search}
                onChange={handleSearch}
                placeholder="Search by student name, username, email, or phone..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                Loading enrolled students...
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="p-12 text-center">
                <FaUsers className="mx-auto mb-4 text-3xl text-gray-300" />

                <h2 className="font-bold text-[#343652]">
                  {participants.length === 0
                    ? "No students enrolled yet"
                    : "No matching students"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {participants.length === 0
                    ? "Students will appear here when they enroll in this live class."
                    : "Try a different search term."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Student</th>
                        <th className="px-5 py-4">Username</th>
                        <th className="px-5 py-4">Contact</th>
                        <th className="px-5 py-4">Date Enrolled</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {visibleParticipants.map((student) => {
                        const fullName = [
                          student.first_name,
                          student.last_name,
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <tr
                            key={student.id}
                            className="hover:bg-gray-50/70"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {student.student_photo ? (
                                  <img
                                    src={student.student_photo}
                                    alt=""
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9EAEC] font-bold text-[#343652]">
                                    {(fullName || student.username || "S")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                )}

                                <div>
                                  <p className="font-semibold text-[#343652]">
                                    {fullName || "Name not provided"}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-400">
                                    Student ID: {student.student_id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                              {student.username || "—"}
                            </td>

                            <td className="px-5 py-4">
                              <div className="space-y-2">
                                {student.email && (
                                  <p className="flex items-center gap-2 text-gray-600">
                                    <FaEnvelope className="shrink-0 text-gray-400" />
                                    <span className="break-all">
                                      {student.email}
                                    </span>
                                  </p>
                                )}

                                {student.phone && (
                                  <p className="flex items-center gap-2 text-gray-600">
                                    <FaPhone className="shrink-0 text-gray-400" />
                                    {student.phone}
                                  </p>
                                )}

                                {!student.email && !student.phone && (
                                  <span className="text-gray-400">—</span>
                                )}
                              </div>
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                              {formatDate(student.date_added)}
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
                    {Math.min(page * PAGE_SIZE, filteredParticipants.length)} of{" "}
                    {filteredParticipants.length} students
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
