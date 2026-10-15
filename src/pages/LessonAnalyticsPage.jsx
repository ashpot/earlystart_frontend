
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

import {
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaSearch,
  FaSyncAlt,
  FaSortAmountDown,
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

function formatDuration(seconds = 0) {
  const totalMinutes = Math.floor(Number(seconds || 0) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function StatCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
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

export default function LessonAnalyticsPage() {
  const { token } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("learning_time_seconds");

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const loadLessons = useCallback(async () => {
    if (!token) {
      setError("Your session token is unavailable. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const params = new URLSearchParams();

    if (courseId) params.set("course_id", courseId);
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);

    try {
      const response = await fetch(
        `${API}/analytics/lessons/?${params.toString()}`,
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

      const data = await response.json();
      setLessons(data.results || []);
    } catch (err) {
      setError(err.message || "Unable to load lesson analytics.");
    } finally {
      setLoading(false);
    }
  }, [token, courseId, startDate, endDate]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const courses = useMemo(() => {
    const unique = new Map();

    lessons.forEach((lesson) => {
      unique.set(String(lesson.course_id), {
        id: lesson.course_id,
        title: lesson.course_title,
      });
    });

    return Array.from(unique.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    const term = search.trim().toLowerCase();

    return lessons
      .filter((lesson) => {
        if (!term) return true;

        return (
          lesson.title?.toLowerCase().includes(term) ||
          lesson.course_title?.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        if (sortBy === "completion_rate") {
          return (b.completion_rate || 0) - (a.completion_rate || 0);
        }

        if (sortBy === "learners_started") {
          return (b.learners_started || 0) - (a.learners_started || 0);
        }

        if (sortBy === "learners_completed") {
          return (b.learners_completed || 0) - (a.learners_completed || 0);
        }

        return (
          (b.learning_time_seconds || 0) -
          (a.learning_time_seconds || 0)
        );
      });
  }, [lessons, search, sortBy]);

  const summary = useMemo(() => {
    const totalEnrolled = new Set();

    let totalStarted = 0;
    let totalCompleted = 0;
    let totalLearningSeconds = 0;

    lessons.forEach((lesson) => {
      totalEnrolled.add(`${lesson.course_id}`);
      totalStarted += lesson.learners_started || 0;
      totalCompleted += lesson.learners_completed || 0;
      totalLearningSeconds += lesson.learning_time_seconds || 0;
    });

    return {
      totalLessons: lessons.length,
      totalStarted,
      totalCompleted,
      totalLearningSeconds,
    };
  }, [lessons]);

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
              <p className="text-sm text-gray-500">Analytics / Lessons</p>
              <h1 className="mt-1 text-2xl font-bold">Lesson Analytics</h1>
              <p className="mt-2 text-sm text-gray-500">
                Understand learner engagement and completion across lessons.
              </p>
            </div>

            <button
              type="button"
              onClick={loadLessons}
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
              title="Total Lessons"
              value={summary.totalLessons.toLocaleString()}
              subtitle="Lessons returned by the API"
              icon={FaBookOpen}
              accent={COLORS.blue}
            />

            <StatCard
              title="Learner Starts"
              value={summary.totalStarted.toLocaleString()}
              subtitle="Summed across lessons"
              icon={FaUsers}
              accent={COLORS.yellow}
            />

            <StatCard
              title="Lesson Completions"
              value={summary.totalCompleted.toLocaleString()}
              subtitle="Completed progress records"
              icon={FaCheckCircle}
              accent={COLORS.blue}
            />

            <StatCard
              title="Recorded Learning Time"
              value={formatDuration(summary.totalLearningSeconds)}
              subtitle="Based on recorded progress"
              icon={FaClock}
              accent={COLORS.yellow}
            />
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Filter lessons</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-600">Search</span>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Lesson or course..."
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-600">Course</span>
                <select
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  className={inputClass}
                >
                  <option value="">All courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>

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
                <span className="font-medium text-gray-600">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className={inputClass}
                >
                  <option value="learning_time_seconds">Learning time</option>
                  <option value="learners_started">Learner starts</option>
                  <option value="learners_completed">Completions</option>
                  <option value="completion_rate">Completion rate</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Showing {filteredLessons.length} of {lessons.length} lessons
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCourseId("");
                  setStartDate("");
                  setEndDate("");
                  setSortBy("learning_time_seconds");
                }}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Clear filters
              </button>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p className="font-semibold">Unable to load lesson analytics</p>
              <p className="mt-1 break-words">{error}</p>
              <button
                type="button"
                onClick={loadLessons}
                className="mt-3 font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 p-5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#91ADC625" }}
              >
                <FaSortAmountDown />
              </div>
              <div>
                <h2 className="font-semibold">Lesson Performance</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Engagement and completion by lesson.
                </p>
              </div>
            </div>

            {loading && lessons.length === 0 ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-12 animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : filteredLessons.length === 0 ? (
              <div className="p-12 text-center">
                <FaBookOpen className="mx-auto text-3xl text-gray-300" />
                <p className="mt-3 font-medium">No lessons found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing the search or filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Lesson</th>
                      <th className="px-5 py-4">Course</th>
                      <th className="px-5 py-4">Enrolled</th>
                      <th className="px-5 py-4">Started</th>
                      <th className="px-5 py-4">Completed</th>
                      <th className="px-5 py-4">Completion rate</th>
                      <th className="px-5 py-4">Learning time</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredLessons.map((lesson) => {
                      const completion = Math.min(
                        100,
                        Math.max(0, Number(lesson.completion_rate || 0))
                      );

                      return (
                        <tr key={lesson.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="font-semibold">
                              {lesson.title}
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              Lesson #{lesson.id}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {lesson.course_title}
                          </td>

                          <td className="px-5 py-4">
                            {lesson.enrolled_learners}
                          </td>

                          <td className="px-5 py-4">
                            {lesson.learners_started}
                          </td>

                          <td className="px-5 py-4">
                            {lesson.learners_completed}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${completion}%`,
                                    backgroundColor:
                                      completion >= 75
                                        ? "#16A34A"
                                        : completion >= 40
                                          ? COLORS.yellow
                                          : COLORS.blue,
                                  }}
                                />
                              </div>
                              <span className="whitespace-nowrap">
                                {completion.toFixed(1)}%
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 font-medium">
                            {formatDuration(lesson.learning_time_seconds)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="text-xs text-gray-500">
            Learning-time values are based on your existing progress records.
            Because recorded time is cumulative, date-filtered totals should
            be interpreted as engagement indicators rather than exact time
            accumulated only during the selected dates.
          </p>
        </main>
      </div>
    </div>
  );
}
