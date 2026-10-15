import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaRedo,
  FaTrophy,
  FaUserGraduate,
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

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

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

const formatDuration = (seconds) => {
  const total = Math.max(0, Number(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = Math.floor(total % 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
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

function SectionHeading({ title, description }) {
  return (
    <div className="border-b border-gray-100 p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

function EmptyTableRow({ colSpan, children }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-gray-500">
        {children}
      </td>
    </tr>
  );
}

export default function LearnerDetailPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(getLocalDate());

  const [learner, setLearner] = useState(null);
  const [summary, setSummary] = useState({});
  const [enrollments, setEnrollments] = useState([]);
  const [lessonProgress, setLessonProgress] = useState([]);
  const [lessonTestAttempts, setLessonTestAttempts] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const fetchDetails = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Your session is unavailable. Please sign in again.");
      return;
    }

    if (!id || !/^\d+$/.test(id)) {
      setLoading(false);
      setError("The learner ID in this URL is invalid.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);

      const query = params.toString();
      const url =
        `${API}/analytics/learners/${id}/` + (query ? `?${query}` : "");

      const response = await fetch(url, {
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
            "Unable to load this learner's details."
        );
      }

      setLearner(data.learner || null);
      setSummary(data.summary || {});
      setEnrollments(Array.isArray(data.enrollments) ? data.enrollments : []);
      setLessonProgress(
        Array.isArray(data.lesson_progress) ? data.lesson_progress : []
      );
      setLessonTestAttempts(
        Array.isArray(data.lesson_test_attempts)
          ? data.lesson_test_attempts
          : []
      );
      setQuizAttempts(
        Array.isArray(data.quiz_attempts) ? data.quiz_attempts : []
      );
    } catch (err) {
      setError(err.message || "Unable to load learner details.");
    } finally {
      setLoading(false);
    }
  }, [token, id, startDate, endDate]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const resetFilters = () => {
    setStartDate("");
    setEndDate(getLocalDate());
  };

  const getLearnerName = () =>
    learner?.name?.trim() || learner?.username || `Learner ${id}`;

  const getInitials = () =>
    getLearnerName()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (/^https?:\/\//i.test(photo)) return photo;

    const base = String(BASE_URL || "").replace(/\/$/, "");
    const path = String(photo).startsWith("/") ? photo : `/${photo}`;

    return `${base}${path}`;
  };

  const photoUrl = getPhotoUrl(learner?.photo);

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
                onClick={() => navigate("/admin/analytics/learners")}
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                <FaArrowLeft size={12} />
                Back to Learner Insights
              </button>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Learner Details
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Individual learning activity and assessment history.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDetails}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <section className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            {loading && !learner ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Loading learner profile...
              </div>
            ) : learner ? (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-full border border-gray-100 object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-xl font-bold"
                    style={{
                      backgroundColor: "#EEF3F7",
                      color: COLORS.navy,
                    }}
                  >
                    {getInitials()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold">{getLearnerName()}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    @{learner.username}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="mt-1 break-words text-sm font-medium">
                        {learner.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="mt-1 text-sm font-medium">
                        {learner.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Age level</p>
                      <p className="mt-1 text-sm font-medium">
                        {learner.age_level || "Not assigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Registered</p>
                      <p className="mt-1 text-sm font-medium">
                        {formatDate(learner.date_joined)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Subscription plan</p>
                      <p className="mt-1 text-sm font-medium">
                        {learner.plan || "Free"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Paid until</p>
                      <p className="mt-1 text-sm font-medium">
                        {formatDate(learner.paid_until)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account status</p>
                      <p className="mt-1 text-sm font-medium">
                        {learner.account_status || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchDetails}
                className="self-start font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          <section className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FaCalendarAlt />
              <h2 className="font-semibold">Filter learning activity</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label
                  htmlFor="learner-detail-start"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  Activity from
                </label>
                <input
                  id="learner-detail-start"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="learner-detail-end"
                  className="mb-1.5 block text-sm text-gray-600"
                >
                  Activity to
                </label>
                <input
                  id="learner-detail-end"
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
                  onClick={fetchDetails}
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
          </section>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              title="Enrolments"
              value={formatNumber(summary.enrollments)}
              icon={FaBookOpen}
              description="Course enrolments"
            />
            <SummaryCard
              title="Lessons completed"
              value={formatNumber(summary.lessons_completed)}
              icon={FaCheckCircle}
              description={`${formatNumber(summary.lessons_started)} progress records in the selected period`}
            />
            <SummaryCard
              title="Lesson-test average"
              value={formatPercent(summary.lesson_test_average)}
              icon={FaChartLine}
              description={`${formatNumber(summary.lesson_test_attempts)} attempts`}
            />
            <SummaryCard
              title="Quiz average"
              value={formatPercent(summary.quiz_average)}
              icon={FaTrophy}
              description={`${formatNumber(summary.quiz_attempts)} attempts`}
            />
          </div>

          <section className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeading
              title="Enrolled courses"
              description="Courses linked to this learner's account."
            />

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Course</th>
                    <th className="px-5 py-4">Enrolled on</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrollments.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 font-medium">
                        {item.course_title || `Course #${item.course_id}`}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(item.date_added)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                            item.status
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {enrollments.length === 0 && (
                    <EmptyTableRow colSpan={3}>
                      No course enrolments found.
                    </EmptyTableRow>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeading
              title="Lesson progress"
              description="Progress records updated during the selected period. The time spent value is cumulative for each record, not time exclusively spent during this date range."
            />

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Lesson</th>
                    <th className="px-5 py-4">Course</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Current position</th>
                    <th className="px-5 py-4">Recorded time spent</th>
                    <th className="px-5 py-4">Last updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lessonProgress.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 font-medium">
                        {item.lesson_title || `Lesson #${item.lesson_id}`}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {item.course_title || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                            item.completed
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.completed ? "Completed" : "In progress"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {formatDuration(item.current_time_seconds)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="inline-flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          {formatDuration(item.time_spent_seconds)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDateTime(item.last_updated)}
                      </td>
                    </tr>
                  ))}
                  {lessonProgress.length === 0 && (
                    <EmptyTableRow colSpan={6}>
                      No lesson progress records found for this period.
                    </EmptyTableRow>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeading
              title="Lesson-test history"
              description="Scores from assessments attached to individual lessons."
            />

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Lesson</th>
                    <th className="px-5 py-4">Course</th>
                    <th className="px-5 py-4">Score</th>
                    <th className="px-5 py-4">Percentage</th>
                    <th className="px-5 py-4">Result</th>
                    <th className="px-5 py-4">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lessonTestAttempts.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 font-medium">
                        {item.lesson_title || `Lesson #${item.lesson_id}`}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {item.course_title || "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {formatNumber(item.score)} /{" "}
                        {formatNumber(item.total_questions)}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        {formatPercent(item.percentage)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                            item.passed
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.passed ? "Passed" : "Not passed"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDateTime(item.completed_at)}
                      </td>
                    </tr>
                  ))}
                  {lessonTestAttempts.length === 0 && (
                    <EmptyTableRow colSpan={6}>
                      No lesson-test attempts found for this period.
                    </EmptyTableRow>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeading
              title="Quiz history"
              description="Recorded quiz attempts, results, and time taken."
            />

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Quiz</th>
                    <th className="px-5 py-4">Attempt</th>
                    <th className="px-5 py-4">Score</th>
                    <th className="px-5 py-4">Percentage</th>
                    <th className="px-5 py-4">Time taken</th>
                    <th className="px-5 py-4">Result</th>
                    <th className="px-5 py-4">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quizAttempts.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 font-medium">
                        {item.quiz_title || `Quiz #${item.quiz_id}`}
                      </td>
                      <td className="px-5 py-4">
                        {formatNumber(item.attempt_number)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {formatNumber(item.score)} /{" "}
                        {formatNumber(item.total_questions)}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        {formatPercent(item.percentage)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {formatDuration(item.duration_seconds)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                            item.passed
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.passed ? "Passed" : "Not passed"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDateTime(item.completed_at)}
                      </td>
                    </tr>
                  ))}
                  {quizAttempts.length === 0 && (
                    <EmptyTableRow colSpan={7}>
                      No quiz attempts found for this period.
                    </EmptyTableRow>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <button
            type="button"
            onClick={() => navigate("/admin/analytics/learners")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            <FaArrowLeft />
            Back to Learner Insights
          </button>
        </main>
      </div>
    </div>
  );
}