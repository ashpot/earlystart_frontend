
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

import {
  FaClipboardCheck,
  FaUsers,
  FaChartLine,
  FaCheckCircle,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
};

const API = `${BASE_URL}/api/v1/rest-auth`;

function StatCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-3 text-2xl font-bold" style={{ color: COLORS.navy }}>
            {value}
          </p>
          <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
        </div>

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}35`, color: COLORS.navy }}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value }) {
  const percentage = Math.min(100, Math.max(0, Number(value || 0)));

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor:
              percentage >= 70
                ? "#16A34A"
                : percentage >= 40
                  ? COLORS.yellow
                  : COLORS.blue,
          }}
        />
      </div>
      <span className="whitespace-nowrap text-sm">
        {percentage.toFixed(1)}%
      </span>
    </div>
  );
}

export default function LessonTestAnalyticsPage() {
  const { token } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("attempts");

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const loadAnalytics = useCallback(async () => {
    if (!token) {
      setError("Your session token is unavailable. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);

    try {
      const response = await fetch(
        `${API}/analytics/lesson-tests/?${params.toString()}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(
          `Request failed (${response.status}). ${detail.slice(0, 250)}`
        );
      }

      setData(await response.json());
    } catch (err) {
      setError(err.message || "Unable to load lesson test analytics.");
    } finally {
      setLoading(false);
    }
  }, [token, startDate, endDate]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const summary = data?.summary || {};
  const lessons = data?.lessons || [];

  const filteredLessons = useMemo(() => {
    const term = search.trim().toLowerCase();

    return lessons
      .filter((lesson) => {
        return (
          !term ||
          lesson.lesson_title?.toLowerCase().includes(term) ||
          lesson.course_title?.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        if (sortBy === "average_percentage") {
          return (b.average_percentage || 0) - (a.average_percentage || 0);
        }

        if (sortBy === "pass_rate") {
          return (b.pass_rate || 0) - (a.pass_rate || 0);
        }

        if (sortBy === "unique_learners") {
          return (b.unique_learners || 0) - (a.unique_learners || 0);
        }

        return (b.attempts || 0) - (a.attempts || 0);
      });
  }, [lessons, search, sortBy]);

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400";

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

        <main className="w-full min-w-0 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-500">Analytics / Lesson Tests</p>
              <h1 className="mt-1 text-2xl font-bold">
                Lesson Test Analytics
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Track test participation, learner scores, and pass rates.
              </p>
            </div>

            <button
              type="button"
              onClick={loadAnalytics}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: COLORS.navy }}
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Attempts"
              value={(summary.total_attempts || 0).toLocaleString()}
              subtitle="Completed test attempts"
              icon={FaClipboardCheck}
              accent={COLORS.blue}
            />

            <StatCard
              title="Unique Learners"
              value={(summary.unique_learners || 0).toLocaleString()}
              subtitle="Learners who attempted tests"
              icon={FaUsers}
              accent={COLORS.yellow}
            />

            <StatCard
              title="Average Score"
              value={`${Number(summary.average_percentage || 0).toFixed(1)}%`}
              subtitle="Average across all attempts"
              icon={FaChartLine}
              accent={COLORS.blue}
            />

            <StatCard
              title="Pass Rate"
              value={`${Number(summary.pass_rate || 0).toFixed(1)}%`}
              subtitle={`${summary.passed_attempts || 0} passed attempts`}
              icon={FaCheckCircle}
              accent={COLORS.yellow}
            />
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Filter results</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-600">From</span>
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-600">To</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-600">Search</span>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search lesson or course"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-600">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className={inputClass}
                >
                  <option value="attempts">Most attempts</option>
                  <option value="average_percentage">Highest average score</option>
                  <option value="pass_rate">Highest pass rate</option>
                  <option value="unique_learners">Most learners</option>
                </select>
              </label>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p className="font-semibold">Unable to load lesson test analytics</p>
              <p className="mt-1 break-words">{error}</p>
              <button
                type="button"
                onClick={loadAnalytics}
                className="mt-3 font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-semibold">Performance by Lesson</h2>
              <p className="mt-1 text-sm text-gray-500">
                Compare attempts, average scores, and pass rates across lessons.
              </p>
            </div>

            {loading && !data ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-12 animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : filteredLessons.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-500">
                No lesson test attempts found for the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Lesson</th>
                      <th className="px-5 py-4">Course</th>
                      <th className="px-5 py-4">Attempts</th>
                      <th className="px-5 py-4">Learners</th>
                      <th className="px-5 py-4">Average score</th>
                      <th className="px-5 py-4">Passed</th>
                      <th className="px-5 py-4">Failed</th>
                      <th className="px-5 py-4">Pass rate</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredLessons.map((lesson) => (
                      <tr
                        key={lesson.lesson_id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-semibold">
                          {lesson.lesson_title || "Untitled lesson"}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {lesson.course_title || "—"}
                        </td>

                        <td className="px-5 py-4">
                          {lesson.attempts}
                        </td>

                        <td className="px-5 py-4">
                          {lesson.unique_learners}
                        </td>

                        <td className="px-5 py-4 font-semibold">
                          {Number(lesson.average_percentage || 0).toFixed(1)}%
                        </td>

                        <td className="px-5 py-4 text-green-700">
                          {lesson.passed_attempts}
                        </td>

                        <td className="px-5 py-4 text-red-600">
                          {lesson.failed_attempts}
                        </td>

                        <td className="px-5 py-4">
                          <ProgressBar value={lesson.pass_rate} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="text-xs text-gray-500">
            Scores and pass rates are calculated from completed attempts in the
            selected date range. A learner with multiple attempts contributes
            each attempt to the overall average.
          </p>
        </main>
      </div>
    </div>
  );
}
