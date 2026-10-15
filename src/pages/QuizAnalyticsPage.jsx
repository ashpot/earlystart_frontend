import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaChartBar,
  FaCheckCircle,
  FaClipboardList,
  FaRedo,
  FaSearch,
  FaTimesCircle,
  FaTrophy,
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
  gray: "#BDBEC0",
  white: "#FFFFFF",
};

const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  });

const formatPercent = (value) =>
  `${Number(value || 0).toFixed(1)}%`;

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

export default function QuizAnalyticsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(getLocalDate());
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("total_attempts");
  const [sortDirection, setSortDirection] = useState("desc");

  const [summary, setSummary] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const fetchAnalytics = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Your session is unavailable. Please sign in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);

      const query = params.toString();
      const url = `${API}/analytics/quizzes/${query ? `?${query}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Unable to load quiz analytics. Please try again."
        );
      }

      setSummary(data.summary || {});
      setQuizzes(Array.isArray(data.quizzes) ? data.quizzes : []);
    } catch (err) {
      setError(err.message || "Something went wrong while loading analytics.");
    } finally {
      setLoading(false);
    }
  }, [token, startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const filteredQuizzes = quizzes
    .filter((quiz) => {
      const searchText = search.trim().toLowerCase();

      if (!searchText) return true;

      return String(quiz.title || "")
        .toLowerCase()
        .includes(searchText);
    })
    .sort((a, b) => {
      const aValue = a[sortBy] ?? 0;
      const bValue = b[sortBy] ?? 0;

      const comparison =
        typeof aValue === "string"
          ? aValue.localeCompare(String(bValue))
          : Number(aValue) - Number(bValue);

      return sortDirection === "asc" ? comparison : -comparison;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  const sortIndicator = (field) => {
    if (sortBy !== field) return "";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate(getLocalDate());
    setSearch("");
    setSortBy("total_attempts");
    setSortDirection("desc");
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
                Quiz Analytics
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Review quiz participation, scores, pass rates, and learner
                rankings.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAnalytics}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FaChartBar />
              <h2 className="font-semibold">Filter analytics by date</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="quiz-start-date"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  Start date
                </label>
                <input
                  id="quiz-start-date"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="quiz-end-date"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  End date
                </label>
                <input
                  id="quiz-end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  max={getLocalDate()}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={fetchAnalytics}
                  disabled={loading}
                  className="w-full rounded-lg px-4 py-2.5 font-semibold disabled:opacity-60"
                  style={{ backgroundColor: COLORS.yellow }}
                >
                  Apply filters
                </button>
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
              The date range applies to quiz attempts completed within the
              selected period. Leave the start date empty to include all
              available history up to the end date.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchAnalytics}
                className="self-start font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              title="Total quizzes"
              value={formatNumber(summary.total_quizzes)}
              icon={FaClipboardList}
              description="Quizzes configured in the system"
            />
            <SummaryCard
              title="Quizzes with attempts"
              value={formatNumber(summary.quizzes_with_attempts)}
              icon={FaChartBar}
              description="Quizzes attempted during the selected period"
            />
            <SummaryCard
              title="Total attempts"
              value={formatNumber(summary.total_attempts)}
              icon={FaUsers}
              description="Recorded quiz submissions"
            />
            <SummaryCard
              title="Unique learners"
              value={formatNumber(summary.unique_learners)}
              icon={FaUsers}
              description="Learners who attempted quizzes"
            />
            <SummaryCard
              title="Average score"
              value={formatPercent(summary.average_percentage)}
              icon={FaTrophy}
              description="Average recorded quiz percentage"
            />
            <SummaryCard
              title="Pass rate"
              value={formatPercent(summary.pass_rate)}
              icon={FaCheckCircle}
              description={`${formatNumber(summary.passed_attempts)} passed · ${formatNumber(summary.failed_attempts)} failed attempts`}
            />
          </div>

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Quiz performance</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Select a quiz to inspect its leaderboard.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search quizzes..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-gray-500">
                Loading quiz analytics...
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Quiz</th>
                      <th className="px-5 py-4">
                        <button onClick={() => handleSort("total_attempts")}>
                          Attempts{sortIndicator("total_attempts")}
                        </button>
                      </th>
                      <th className="px-5 py-4">
                        <button onClick={() => handleSort("unique_learners")}>
                          Learners{sortIndicator("unique_learners")}
                        </button>
                      </th>
                      <th className="px-5 py-4">
                        <button onClick={() => handleSort("average_percentage")}>
                          Average score{sortIndicator("average_percentage")}
                        </button>
                      </th>
                      <th className="px-5 py-4">Passed</th>
                      <th className="px-5 py-4">Failed</th>
                      <th className="px-5 py-4">
                        <button onClick={() => handleSort("pass_rate")}>
                          Pass rate{sortIndicator("pass_rate")}
                        </button>
                      </th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredQuizzes.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-800">
                            {quiz.title || `Quiz #${quiz.id}`}
                          </div>
                          <span
                            className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs ${
                              quiz.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {quiz.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {formatNumber(quiz.total_attempts)}
                        </td>
                        <td className="px-5 py-4">
                          {formatNumber(quiz.unique_learners)}
                        </td>
                        <td className="px-5 py-4 font-medium">
                          {formatPercent(quiz.average_percentage)}
                        </td>
                        <td className="px-5 py-4 text-green-700">
                          <span className="inline-flex items-center gap-1">
                            <FaCheckCircle />
                            {formatNumber(quiz.passed_attempts)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-red-600">
                          <span className="inline-flex items-center gap-1">
                            <FaTimesCircle />
                            {formatNumber(quiz.failed_attempts)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(0, Number(quiz.pass_rate || 0))
                                  )}%`,
                                  backgroundColor: COLORS.blue,
                                }}
                              />
                            </div>
                            <span>{formatPercent(quiz.pass_rate)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/analytics/quizzes/${quiz.id}/leaderboard`
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold hover:opacity-80"
                            style={{
                              backgroundColor: "#EEF3F7",
                              color: COLORS.navy,
                            }}
                          >
                            Leaderboard <FaArrowRight size={11} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredQuizzes.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-5 py-12 text-center text-gray-500"
                        >
                          {search
                            ? "No quizzes match your search."
                            : "No quiz analytics are available for this date range."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
              Showing {formatNumber(filteredQuizzes.length)} of{" "}
              {formatNumber(quizzes.length)} quizzes.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}