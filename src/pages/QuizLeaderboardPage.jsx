import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaRedo,
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
};

const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-NG");

const formatPercent = (value) =>
  `${Number(value || 0).toFixed(1)}%`;

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDuration = (seconds) => {
  const totalSeconds = Math.max(0, Number(seconds || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
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

export default function QuizLeaderboardPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(getLocalDate());
  const [limit, setLimit] = useState("20");

  const [quizTitle, setQuizTitle] = useState("");
  const [totalLearners, setTotalLearners] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const fetchLeaderboard = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Your session is unavailable. Please sign in again.");
      return;
    }

    if (!id || !/^\d+$/.test(id)) {
      setLoading(false);
      setError("The quiz ID in this URL is invalid.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      if (limit) params.set("limit", limit);

      const query = params.toString();
      const url =
        `${API}/analytics/quizzes/${id}/leaderboard/` +
        (query ? `?${query}` : "");

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
            "Unable to load this quiz leaderboard."
        );
      }

      setQuizTitle(data.quiz_title || `Quiz #${id}`);
      setTotalLearners(Number(data.total_learners || 0));
      setLeaderboard(
        Array.isArray(data.leaderboard) ? data.leaderboard : []
      );
    } catch (err) {
      setError(err.message || "Something went wrong while loading the leaderboard.");
    } finally {
      setLoading(false);
    }
  }, [token, id, startDate, endDate, limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const resetFilters = () => {
    setStartDate("");
    setEndDate(getLocalDate());
    setLimit("20");
  };

  const getRankStyle = (rank) => {
    if (Number(rank) === 1) {
      return {
        backgroundColor: "#FFF5C2",
        color: "#8A6800",
        label: "1st",
      };
    }

    if (Number(rank) === 2) {
      return {
        backgroundColor: "#F0F1F4",
        color: "#555B67",
        label: "2nd",
      };
    }

    if (Number(rank) === 3) {
      return {
        backgroundColor: "#F8E5D6",
        color: "#8D542C",
        label: "3rd",
      };
    }

    return {
      backgroundColor: "#F3F4F6",
      color: COLORS.navy,
      label: `#${rank}`,
    };
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
                onClick={() => navigate("/admin/analytics/quizzes")}
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                <FaArrowLeft size={12} />
                Back to Quiz Analytics
              </button>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Quiz Leaderboard
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {quizTitle || `Quiz #${id}`} · Learner rankings based on the
                best recorded quiz result.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLeaderboard}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FaCalendarAlt />
              <h2 className="font-semibold">Leaderboard filters</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label
                  htmlFor="leaderboard-start-date"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  Start date
                </label>
                <input
                  id="leaderboard-start-date"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="leaderboard-end-date"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  End date
                </label>
                <input
                  id="leaderboard-end-date"
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
                  htmlFor="leaderboard-limit"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  Number of learners
                </label>
                <select
                  id="leaderboard-limit"
                  value={limit}
                  onChange={(event) => setLimit(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-blue-400"
                >
                  <option value="10">Top 10</option>
                  <option value="20">Top 20</option>
                  <option value="50">Top 50</option>
                  <option value="100">Top 100</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={fetchLeaderboard}
                  disabled={loading}
                  className="flex-1 rounded-lg px-4 py-2.5 font-semibold disabled:opacity-60"
                  style={{ backgroundColor: COLORS.yellow }}
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg border border-gray-200 px-3 py-2.5 font-medium hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              The leaderboard ranks each learner by their best percentage,
              with shorter completion time used as a tie-breaker. The date
              range limits which attempts are considered.
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
                onClick={fetchLeaderboard}
                className="self-start font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryCard
              title="Learners ranked"
              value={formatNumber(leaderboard.length)}
              icon={FaTrophy}
              description={`Top ${limit} results displayed`}
            />
            <SummaryCard
              title="Total unique learners"
              value={formatNumber(totalLearners)}
              icon={FaUsers}
              description="Unique learners with qualifying attempts in the selected period"
            />
          </div>

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h2 className="text-lg font-bold">Rankings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Higher percentages rank first. Ties are resolved using
                completion time as returned by the backend.
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-gray-500">
                Loading leaderboard...
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Rank</th>
                      <th className="px-5 py-4">Learner</th>
                      <th className="px-5 py-4">Score</th>
                      <th className="px-5 py-4">Percentage</th>
                      <th className="px-5 py-4">Time taken</th>
                      <th className="px-5 py-4">Result</th>
                      <th className="px-5 py-4">Attempt</th>
                      <th className="px-5 py-4">Completed</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {leaderboard.map((learner, index) => {
                      const rank = learner.rank ?? index + 1;
                      const rankStyle = getRankStyle(rank);
                      const photoUrl = getPhotoUrl(learner.photo);
                      const name =
                        learner.name ||
                        learner.username ||
                        `Learner ${learner.user_id || ""}`;

                      return (
                        <tr
                          key={`${learner.user_id || learner.username}-${rank}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <span
                              className="inline-flex min-w-12 items-center justify-center rounded-full px-3 py-2 font-bold"
                              style={{
                                backgroundColor: rankStyle.backgroundColor,
                                color: rankStyle.color,
                              }}
                            >
                              {rank === 1 && <FaTrophy className="mr-1" size={11} />}
                              {rankStyle.label}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt=""
                                  className="h-10 w-10 rounded-full border border-gray-100 object-cover"
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
                                  {String(name).charAt(0).toUpperCase()}
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800">
                                  {name}
                                </p>
                                {learner.username && learner.name && (
                                  <p className="text-xs text-gray-500">
                                    @{learner.username}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 font-medium">
                            {formatNumber(learner.score)} /{" "}
                            {formatNumber(learner.total_questions)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(
                                        0,
                                        Number(learner.best_percentage || 0)
                                      )
                                    )}%`,
                                    backgroundColor: COLORS.blue,
                                  }}
                                />
                              </div>
                              <span className="font-semibold">
                                {formatPercent(learner.best_percentage)}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 text-gray-600">
                              <FaClock className="text-gray-400" />
                              {formatDuration(learner.duration_seconds)}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {learner.passed ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700">
                                <FaCheckCircle />
                                Passed
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700">
                                Not passed
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {formatNumber(learner.attempt_number)}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {formatDateTime(learner.completed_at)}
                          </td>
                        </tr>
                      );
                    })}

                    {leaderboard.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-5 py-12 text-center text-gray-500"
                        >
                          No leaderboard entries are available for this quiz
                          and date range.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
              Displaying {formatNumber(leaderboard.length)} learner
              {leaderboard.length === 1 ? "" : "s"}.
            </div>
          </section>

          <button
            type="button"
            onClick={() => navigate("/admin/analytics/quizzes")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            <FaArrowLeft />
            Back to all quizzes
          </button>
        </main>
      </div>
    </div>
  );
}