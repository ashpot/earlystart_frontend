
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  FaUsers,
  FaUserGraduate,
  FaBookOpen,
  FaClock,
  FaClipboardCheck,
  FaTrophy,
  FaSyncAlt,
} from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useNavigate } from "react-router-dom";

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
  gray: "#BDBEC0",
  white: "#FFFFFF",
};

const API = `${BASE_URL}/api/v1/rest-auth`;

function formatDuration(seconds = 0) {
  const totalMinutes = Math.floor(Number(seconds || 0) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatPeriod(period, granularity) {
  if (!period) return "";

  const date = new Date(period);

  if (Number.isNaN(date.getTime())) return period;

  if (granularity === "month") {
    return date.toLocaleDateString("en", {
      month: "short",
      year: "2-digit",
    });
  }

  if (granularity === "week") {
    return date.toLocaleDateString("en", {
      day: "numeric",
      month: "short",
    });
  }

  return date.toLocaleDateString("en", {
    day: "numeric",
    month: "short",
  });
}

function StatCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p
            className="mt-3 text-2xl font-bold"
            style={{ color: COLORS.navy }}
          >
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}25`, color: COLORS.navy }}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="font-semibold" style={{ color: COLORS.navy }}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>

      {children}
    </section>
  );
}

function EmptyChart({ message = "No data available for this period." }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50 px-4 text-center text-sm text-gray-500">
      {message}
    </div>
  );
}

export default function AnalyticsOverviewPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [granularity, setGranularity] = useState("day");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 29);
    return date.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );

  const [overview, setOverview] = useState(null);
  const [userTrends, setUserTrends] = useState([]);
  const [lessonData, setLessonData] = useState([]);
  const [quizData, setQuizData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const loadAnalytics = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Your session token is unavailable. Please sign in again.");
      return;
    }

    setLoading(true);
    setError("");

    const query = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    const userQuery = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      granularity,
    });

    const headers = {
      Authorization: `Token ${token}`,
      Accept: "application/json",
    };

    try {
      const endpoints = [
        `${API}/analytics/overview/?${query}`,
        `${API}/analytics/users/?${userQuery}`,
        `${API}/analytics/lessons/?${query}`,
        `${API}/analytics/quizzes/?${query}`,
      ];

      const responses = await Promise.all(
        endpoints.map((url) =>
          fetch(url, { method: "GET", headers })
        )
      );

      const failedResponse = responses.find((response) => !response.ok);

      if (failedResponse) {
        const failedIndex = responses.indexOf(failedResponse);
        const responseBody = await failedResponse.text();

        throw new Error(
          `Analytics request ${failedIndex + 1} failed (${failedResponse.status}). ${
            responseBody.slice(0, 250) || failedResponse.statusText
          }`
        );
      }

      const [overviewResult, usersResult, lessonsResult, quizzesResult] =
        await Promise.all(responses.map((response) => response.json()));

      setOverview(overviewResult);
      setUserTrends(
        (usersResult.results || []).map((item) => ({
          ...item,
          label: formatPeriod(item.period, granularity),
        }))
      );
      setLessonData(lessonsResult.results || []);
      setQuizData(quizzesResult);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load analytics. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [token, startDate, endDate, granularity]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const users = overview?.users || {};
  const lessons = overview?.lessons || {};
  const tests = overview?.lesson_tests || {};
  const quizzes = overview?.quizzes || {};
  const quizSummary = quizData?.summary || {};

  const topLessons = [...lessonData]
    .sort(
      (a, b) =>
        (b.learning_time_seconds || 0) -
        (a.learning_time_seconds || 0)
    )
    .slice(0, 7);

  const assessmentData = [
    {
      name: "Lesson tests",
      attempts: tests.attempts || 0,
      average: Number(tests.average_percentage || 0),
    },
    {
      name: "Quizzes",
      attempts: quizzes.attempts || 0,
      average: Number(quizzes.average_percentage || 0),
    },
  ];

  const selectClass =
    "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400";

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
          {/* Page heading */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-500">Earlystart Admin</p>
              <h1 className="mt-1 text-2xl font-bold">
                Learning Analytics
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Understand learner activity, lesson engagement, and
                assessment performance.
              </p>
            </div>

            <button
              type="button"
              onClick={loadAnalytics}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: COLORS.navy }}
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
          <div className="inline-flex justify-between gap-2">
            <button
                type="button"
                onClick={() => navigate("/admin/analytics/lessons")}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
                >
                View detailed lesson analytics
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/admin/analytics/tests")}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
                    >
                    View lesson test analytics
                    </button>
                
                <button
                    type="button"
                    onClick={() => navigate("/admin/analytics/quizzes")}
                    className="rounded-lg px-4 py-2.5 font-semibold transition hover:opacity-80"
                    style={{ backgroundColor: "#FBD22F", color: "#343652" }}
                    >
                    View Quiz Analytics
                    </button>

                    <button
                    type="button"
                    onClick={() => navigate("/admin/analytics/learners")}
                    className="rounded-lg px-4 py-2.5 font-semibold transition hover:opacity-80"
                    style={{ backgroundColor: "#FBD22F", color: "#343652" }}
                    >
                    View Learner Insights
                    </button>

                    <button
                    type="button"
                    onClick={() => navigate("/admin/analytics/parents")}
                    className="rounded-lg px-4 py-2.5 font-semibold transition hover:opacity-80"
                    style={{ backgroundColor: "#FBD22F", color: "#343652" }}
                    >
                    View Parent Analytics
                    </button>

          </div>

          {/* Filters */}
          <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-600">From</span>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className={selectClass}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-600">To</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => setEndDate(event.target.value)}
                  className={selectClass}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-600">
                  Trend interval
                </span>
                <select
                  value={granularity}
                  onChange={(event) => setGranularity(event.target.value)}
                  className={selectClass}
                >
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={loadAnalytics}
                  disabled={loading}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
                  style={{
                    borderColor: COLORS.blue,
                    color: COLORS.navy,
                  }}
                >
                  Apply filters
                </button>
              </div>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p className="font-semibold">Unable to load analytics</p>
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

          {loading && !overview ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>
          ) : (
            <>
              {/* KPI cards */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Students"
                  value={(users.total_students || 0).toLocaleString()}
                  subtitle={`${(users.new_students || 0).toLocaleString()} new in selected period`}
                  icon={FaUserGraduate}
                  accent={COLORS.blue}
                />

                <StatCard
                  title="Active Learners"
                  value={(users.active_learners || 0).toLocaleString()}
                  subtitle="Learners with recorded activity"
                  icon={FaUsers}
                  accent={COLORS.yellow}
                />

                <StatCard
                  title="Lessons Completed"
                  value={(lessons.completed || 0).toLocaleString()}
                  subtitle="Completed progress records"
                  icon={FaBookOpen}
                  accent={COLORS.blue}
                />

                <StatCard
                  title="Recorded Learning Time"
                  value={formatDuration(lessons.learning_time_seconds)}
                  subtitle="Based on recorded progress"
                  icon={FaClock}
                  accent={COLORS.yellow}
                />

                <StatCard
                  title="Lesson Test Attempts"
                  value={(tests.attempts || 0).toLocaleString()}
                  subtitle={`${Number(tests.average_percentage || 0).toFixed(1)}% average score`}
                  icon={FaClipboardCheck}
                  accent={COLORS.blue}
                />

                <StatCard
                  title="Quiz Attempts"
                  value={(quizzes.attempts || 0).toLocaleString()}
                  subtitle={`${Number(quizzes.average_percentage || 0).toFixed(1)}% average score`}
                  icon={FaTrophy}
                  accent={COLORS.yellow}
                />

                <StatCard
                  title="Parents"
                  value={(users.total_parents || 0).toLocaleString()}
                  subtitle="Registered parent accounts"
                  icon={FaUsers}
                  accent={COLORS.blue}
                />

                <StatCard
                  title="Instructors"
                  value={(users.total_instructors || 0).toLocaleString()}
                  subtitle="Registered instructor accounts"
                  icon={FaUsers}
                  accent={COLORS.yellow}
                />
              </section>

              {/* User trends */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Learner Activity"
                  subtitle="Distinct learners with recorded activity in each interval"
                >
                  {userTrends.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={userTrends}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 11 }}
                          minTickGap={20}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="active_learners"
                          name="Active learners"
                          stroke={COLORS.navy}
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>

                <ChartCard
                  title="New Student Registrations"
                  subtitle="New student accounts created in each interval"
                >
                  {userTrends.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={userTrends}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 11 }}
                          minTickGap={20}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar
                          dataKey="new_students"
                          name="New students"
                          fill={COLORS.blue}
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>
              </section>

              {/* Lessons and assessments */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Most-Engaged Lessons"
                  subtitle="Ranked by recorded learning time"
                >
                  {topLessons.length ? (
                    <ResponsiveContainer
                      width="100%"
                      height={320}
                    >
                      <BarChart
                        data={topLessons}
                        layout="vertical"
                        margin={{ left: 12, right: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />
                        <XAxis type="number" />
                        <YAxis
                          type="category"
                          dataKey="title"
                          width={110}
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip
                          formatter={(value) => [
                            formatDuration(value),
                            "Recorded time",
                          ]}
                        />
                        <Bar
                          dataKey="learning_time_seconds"
                          name="Recorded time"
                          fill={COLORS.blue}
                          radius={[0, 5, 5, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>

                <ChartCard
                  title="Assessment Performance"
                  subtitle="Attempt volume and average score"
                >
                  {assessmentData.some((item) => item.attempts > 0) ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={assessmentData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="attempts" allowDecimals={false} />
                        <YAxis
                          yAxisId="score"
                          orientation="right"
                          domain={[0, 100]}
                          unit="%"
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                          yAxisId="attempts"
                          dataKey="attempts"
                          name="Attempts"
                          fill={COLORS.blue}
                          radius={[5, 5, 0, 0]}
                        />
                        <Bar
                          yAxisId="score"
                          dataKey="average"
                          name="Average score (%)"
                          fill={COLORS.yellow}
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart message="No assessment attempts recorded for this period." />
                  )}
                </ChartCard>
              </section>

              {/* Lesson engagement table */}
              <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div>
                <div className="border-b border-gray-100 p-5">
                  <h2 className="font-semibold">Lesson Engagement Details</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Completion and recorded learning time by lesson.
                  </p>
                </div>
                
                </div>
                

                {lessonData.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-5 py-4">Lesson</th>
                          <th className="px-5 py-4">Course</th>
                          <th className="px-5 py-4">Enrolled</th>
                          <th className="px-5 py-4">Started</th>
                          <th className="px-5 py-4">Completed</th>
                          <th className="px-5 py-4">Completion</th>
                          <th className="px-5 py-4">Learning time</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {lessonData.slice(0, 10).map((lesson) => (
                          <tr key={lesson.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4 font-medium">
                              {lesson.title}
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
                                      width: `${Math.min(
                                        100,
                                        Math.max(
                                          0,
                                          lesson.completion_rate || 0
                                        )
                                      )}%`,
                                      backgroundColor: COLORS.blue,
                                    }}
                                  />
                                </div>
                                <span>
                                  {Number(
                                    lesson.completion_rate || 0
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              {formatDuration(
                                lesson.learning_time_seconds
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8">
                    <EmptyChart message="No lesson records found." />
                  </div>
                )}
              </section>

              <p className="text-xs text-gray-500">
                Quiz attempts in selected period:{" "}
                {quizSummary.total_attempts || 0}. Learning-time figures
                are based on recorded progress and may reflect cumulative
                values.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
