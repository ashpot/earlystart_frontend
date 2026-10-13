
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaEye,
  FaSync,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
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

const PAGE_SIZE = 10;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};

const formatDuration = (seconds) => {
  const total = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

const QuizAttemptsPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [attempts, setAttempts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [quizFilter, setQuizFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const loadData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Please sign in again to view quiz attempts.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [attemptResponse, quizResponse] = await Promise.all([
        fetch(`${apiUrl}/quiz-attempts/`, { headers: authHeaders }),
        fetch(`${apiUrl}/quizzes/`, { headers: authHeaders }),
      ]);

      if (!attemptResponse.ok) {
        throw new Error("Unable to load quiz attempts.");
      }
      if (!quizResponse.ok) {
        throw new Error("Unable to load quizzes.");
      }

      const attemptData = await attemptResponse.json();
      const quizData = await quizResponse.json();

      setAttempts(
        Array.isArray(attemptData)
          ? attemptData
          : attemptData.results || []
      );

      setQuizzes(
        Array.isArray(quizData) ? quizData : quizData.results || []
      );
    } catch (err) {
      setError(err.message || "Unable to load quiz results.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authHeaders, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAttempts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attempts.filter((attempt) => {
      const matchesSearch =
        !query ||
        String(attempt.learner_username || "").toLowerCase().includes(query) ||
        String(attempt.learner_email || "").toLowerCase().includes(query) ||
        String(attempt.quiz_title || "").toLowerCase().includes(query);

      const matchesQuiz =
        quizFilter === "all" ||
        String(attempt.quiz) === String(quizFilter);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "passed" && attempt.passed) ||
        (statusFilter === "failed" && !attempt.passed);

      return matchesSearch && matchesQuiz && matchesStatus;
    });
  }, [attempts, search, quizFilter, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, quizFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAttempts.length / PAGE_SIZE)
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pageAttempts = filteredAttempts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const passedCount = attempts.filter((attempt) => attempt.passed).length;
  const failedCount = attempts.length - passedCount;

  const averagePercentage = attempts.length
    ? attempts.reduce(
        (sum, attempt) => sum + Number(attempt.percentage || 0),
        0
      ) / attempts.length
    : 0;

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
              <h1 className="text-2xl font-bold">Quiz Attempts</h1>
              <p className="mt-1 text-sm text-gray-500">
                Review learner performance and completed quiz attempts.
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FaSync />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <FaTimesCircle className="mt-0.5 shrink-0" />
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

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Total Attempts</p>
                  <p className="mt-2 text-2xl font-bold">{attempts.length}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <FaClipboardCheck size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Passed</p>
                  <p className="mt-2 text-2xl font-bold text-green-700">
                    {passedCount}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <FaCheckCircle className="text-green-700" size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Not Passed</p>
                  <p className="mt-2 text-2xl font-bold text-red-700">
                    {failedCount}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                  <FaTimesCircle className="text-red-700" size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="mt-2 text-2xl font-bold">
                    {averagePercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50">
                  <FaClipboardCheck size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_250px_180px_auto]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search learner or quiz..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={quizFilter}
                onChange={(event) => setQuizFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                <option value="all">All quizzes</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={String(quiz.id)}>
                    {quiz.title}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                <option value="all">All results</option>
                <option value="passed">Passed</option>
                <option value="failed">Not passed</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setQuizFilter("all");
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
                <h2 className="font-semibold">Attempt Records</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Select a record to inspect the learner's answers.
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {filteredAttempts.length} records
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-500">
                Loading quiz attempts...
              </div>
            ) : filteredAttempts.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <FaClipboardCheck className="mx-auto mb-3 text-4xl text-gray-300" />
                <h3 className="font-semibold text-gray-700">
                  No attempts found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <>
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[1050px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Learner</th>
                        <th className="px-5 py-4">Quiz</th>
                        <th className="px-5 py-4 text-center">Attempt</th>
                        <th className="px-5 py-4 text-center">Score</th>
                        <th className="px-5 py-4 text-center">Grade</th>
                        <th className="px-5 py-4 text-center">Result</th>
                        <th className="px-5 py-4">Completed</th>
                        <th className="px-5 py-4 text-right">Details</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {pageAttempts.map((attempt) => (
                        <tr
                          key={attempt.id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-800">
                              {attempt.learner_username || `User #${attempt.user}`}
                            </p>
                            {attempt.learner_email && (
                              <p className="mt-1 text-xs text-gray-500">
                                {attempt.learner_email}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <p className="max-w-[220px] truncate font-medium text-gray-700">
                              {attempt.quiz_title || `Quiz #${attempt.quiz}`}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-center">
                            {attempt.attempt_number}
                          </td>

                          <td className="px-5 py-4 text-center">
                            <p className="font-semibold text-gray-800">
                              {attempt.percentage}%
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {attempt.correct_answers}/
                              {attempt.total_questions} correct
                            </p>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 font-bold">
                              {attempt.grade || "—"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                attempt.passed
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {attempt.passed ? "Passed" : "Not passed"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <p className="whitespace-nowrap text-gray-700">
                              {formatDate(attempt.completed_at)}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                              <FaClock />
                              {formatDuration(attempt.time_taken_seconds)}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/quiz-attempts/${attempt.id}`)
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                            >
                              <FaEye />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      filteredAttempts.length
                    )}{" "}
                    of {filteredAttempts.length} attempts
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

export default QuizAttemptsPage;
