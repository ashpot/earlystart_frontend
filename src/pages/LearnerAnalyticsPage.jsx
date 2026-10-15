import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaCheckCircle,
  FaRedo,
  FaSearch,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";

const API = `${BASE_URL}/api/v1/rest-auth`;

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
};

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-NG");

const formatPercent = (value) =>
  `${Number(value || 0).toFixed(1)}%`;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function SummaryCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold" style={{ color: COLORS.navy }}>
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "#EEF3F7", color: COLORS.navy }}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

export default function LearnerAnalyticsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(getLocalDate());
  const [limit, setLimit] = useState("100");

  const [summary, setSummary] = useState({});
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const fetchLearners = useCallback(async () => {
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
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      params.set("limit", limit);

      const response = await fetch(
        `${API}/analytics/learners/?${params.toString()}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Unable to load learner analytics."
        );
      }

      setSummary(data.summary || {});
      setLearners(Array.isArray(data.learners) ? data.learners : []);
    } catch (err) {
      setError(err.message || "Unable to load learner analytics.");
    } finally {
      setLoading(false);
    }
  }, [token, search, startDate, endDate, limit]);

  useEffect(() => {
    fetchLearners();
  }, [fetchLearners]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStartDate("");
    setEndDate(getLocalDate());
    setLimit("100");
  };

  const getLearnerName = (learner) =>
    learner.name?.trim() ||
    learner.username ||
    `Learner ${learner.id}`;

  const getInitials = (learner) => {
    const name = getLearnerName(learner);
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (/^https?:\/\//i.test(photo)) return photo;

    const base = String(BASE_URL || "").replace(/\/$/, "");
    const path = String(photo).startsWith("/") ? photo : `/${photo}`;

    return `${base}${path}`;
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
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <button
                type="button"
                onClick={() => navigate("/admin/analytics")}
                className="mb-3 text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                ← Back to Analytics Overview
              </button>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Learner Insights
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Review student engagement, learning progress, and assessment
                performance.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLearners}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              title="Total learners"
              value={formatNumber(summary.total_learners)}
              icon={FaUsers}
              description="Learners matching the selected filters"
            />
            <SummaryCard
              title="Learners with activity"
              value={formatNumber(summary.learners_with_activity)}
              icon={FaUserGraduate}
              description="Learners with recorded learning or assessment activity"
            />
            <SummaryCard
              title="Lessons completed"
              value={formatNumber(summary.lessons_completed)}
              icon={FaCheckCircle}
              description="Completed progress records in the returned learner set"
            />
            <SummaryCard
              title="Lesson-test attempts"
              value={formatNumber(summary.lesson_test_attempts)}
              icon={FaBookOpen}
              description="Recorded lesson assessment attempts"
            />
            <SummaryCard
              title="Quiz attempts"
              value={formatNumber(summary.quiz_attempts)}
              icon={FaChartLine}
              description="Recorded quiz submissions"
            />
          </div>

          <section className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <form onSubmit={handleSearchSubmit}>
              <label
                htmlFor="learner-search"
                className="mb-2 block text-sm font-semibold"
              >
                Search learners
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="learner-search"
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Name, username, email, or phone..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 outline-none focus:border-blue-400"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg px-5 py-2.5 font-semibold"
                  style={{ backgroundColor: COLORS.yellow }}
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label
                  htmlFor="learners-start-date"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  Registration from
                </label>
                <input
                  id="learners-start-date"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="learners-end-date"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  Registration to
                </label>
                <input
                  id="learners-end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  max={getLocalDate()}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="learners-limit"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  Maximum results
                </label>
                <select
                  id="learners-limit"
                  value={limit}
                  onChange={(event) => setLimit(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-blue-400"
                >
                  <option value="25">25 learners</option>
                  <option value="50">50 learners</option>
                  <option value="100">100 learners</option>
                  <option value="250">250 learners</option>
                  <option value="500">500 learners</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-medium hover:bg-gray-50"
                >
                  Reset filters
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Registration dates filter the learner list. Learning activity
              is calculated for the selected date range by the backend.
            </p>
          </section>

          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchLearners}
                className="self-start font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h2 className="text-lg font-bold">Learner directory</h2>
              <p className="mt-1 text-sm text-gray-500">
                Open a learner to inspect their individual learning history.
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-gray-500">
                Loading learner analytics...
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Learner</th>
                      <th className="px-5 py-4">Registered</th>
                      <th className="px-5 py-4">Enrolments</th>
                      <th className="px-5 py-4">Lessons completed</th>
                      <th className="px-5 py-4">Lesson-test average</th>
                      <th className="px-5 py-4">Quiz average</th>
                      <th className="px-5 py-4">Activity</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {learners.map((learner) => {
                      const photoUrl = getPhotoUrl(learner.photo);

                      return (
                        <tr key={learner.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt=""
                                  className="h-10 w-10 shrink-0 rounded-full border border-gray-100 object-cover"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold"
                                  style={{
                                    backgroundColor: "#EEF3F7",
                                    color: COLORS.navy,
                                  }}
                                >
                                  {getInitials(learner)}
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800">
                                  {getLearnerName(learner)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  @{learner.username}
                                </p>
                                {learner.age_level && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    {learner.age_level}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                            {formatDate(learner.date_joined)}
                          </td>

                          <td className="px-5 py-4">
                            {formatNumber(learner.active_enrollments)}
                          </td>

                          <td className="px-5 py-4">
                            <span className="font-semibold">
                              {formatNumber(learner.lessons_completed)}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {formatNumber(learner.lessons_started)} progress
                              records
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {formatPercent(learner.lesson_test_average)}
                            <span className="block text-xs text-gray-500">
                              {formatNumber(learner.lesson_test_attempts)}{" "}
                              attempts
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {formatPercent(learner.quiz_average)}
                            <span className="block text-xs text-gray-500">
                              {formatNumber(learner.quiz_attempts)} attempts
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {learner.has_activity ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700">
                                <FaCheckCircle />
                                Recorded
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600">
                                No activity
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/analytics/learners/${learner.id}`)
                              }
                              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold hover:opacity-80"
                              style={{
                                backgroundColor: "#EEF3F7",
                                color: COLORS.navy,
                              }}
                            >
                              View <FaArrowRight size={11} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {learners.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-5 py-12 text-center text-gray-500"
                        >
                          No learners match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
              Displaying {formatNumber(learners.length)} learner
              {learners.length === 1 ? "" : "s"} in this result set.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}