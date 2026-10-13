
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaClipboardCheck,
  FaExclamationTriangle,
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

  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

const QuizAttemptDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [attempt, setAttempt] = useState(null);
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

  const loadAttempt = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Please sign in again to view this attempt.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/quiz-attempts/${id}/`,
        { headers: authHeaders }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load this quiz attempt."
        );
      }

      setAttempt(data);
    } catch (err) {
      setError(err.message || "Unable to load attempt details.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authHeaders, id, token]);

  useEffect(() => {
    loadAttempt();
  }, [loadAttempt]);

  const answers = attempt?.answers || [];

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
          <button
            type="button"
            onClick={() => navigate("/admin/quiz-attempts")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <FaArrowLeft />
            Back to Quiz Attempts
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Quiz Attempt Details</h1>
            <p className="mt-1 text-sm text-gray-500">
              Review the learner's performance and submitted answers.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
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

          {loading ? (
            <div className="rounded-xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-500 shadow-sm">
              Loading attempt details...
            </div>
          ) : !attempt ? (
            <div className="rounded-xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
              <FaClipboardCheck className="mx-auto mb-3 text-4xl text-gray-300" />
              <h2 className="font-semibold text-gray-800">
                Attempt not available
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                The requested quiz attempt could not be found.
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/quiz-attempts")}
                className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: COLORS.navy }}
              >
                Return to Attempts
              </button>
            </div>
          ) : (
            <>
              {/* Learner and quiz details */}
              <section className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Attempt #{attempt.id}
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      {attempt.quiz_title || `Quiz #${attempt.quiz}`}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Learner:{" "}
                      <span className="font-semibold text-gray-800">
                        {attempt.learner_username ||
                          `User #${attempt.user}`}
                      </span>
                    </p>
                    {attempt.learner_email && (
                      <p className="mt-1 text-sm text-gray-500">
                        {attempt.learner_email}
                      </p>
                    )}
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${
                      attempt.passed
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {attempt.passed ? "Passed" : "Not passed"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {[
                    {
                      label: "Percentage",
                      value: `${attempt.percentage}%`,
                    },
                    {
                      label: "Score",
                      value: attempt.score,
                    },
                    {
                      label: "Grade",
                      value: attempt.grade || "—",
                    },
                    {
                      label: "Attempt Number",
                      value: attempt.attempt_number,
                    },
                    {
                      label: "Total Questions",
                      value: attempt.total_questions,
                    },
                    {
                      label: "Duration",
                      value: formatDuration(attempt.time_taken_seconds),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg bg-gray-50 p-3"
                    >
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="mt-2 break-words text-lg font-bold text-gray-800">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <FaClock className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Started At</p>
                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {formatDate(attempt.started_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaClock className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Completed At</p>
                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {formatDate(attempt.completed_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Answer summary */}
              <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Correct Answers</p>
                  <p className="mt-2 text-2xl font-bold text-green-700">
                    {attempt.correct_answers}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Wrong Answers</p>
                  <p className="mt-2 text-2xl font-bold text-red-700">
                    {attempt.wrong_answers}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Unanswered</p>
                  <p className="mt-2 text-2xl font-bold text-gray-700">
                    {attempt.unanswered}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Recorded Answers</p>
                  <p className="mt-2 text-2xl font-bold">
                    {answers.length}
                  </p>
                </div>
              </section>

              {/* Answer-by-answer review */}
              <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-4">
                  <h2 className="font-semibold">Submitted Answers</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Compare the learner's answer with the correct answer.
                  </p>
                </div>

                {answers.length === 0 ? (
                  <div className="px-6 py-14 text-center">
                    <FaClipboardCheck className="mx-auto mb-3 text-4xl text-gray-300" />
                    <h3 className="font-semibold text-gray-700">
                      No answer records
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This attempt does not have any associated answer records.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {answers.map((answer, index) => (
                      <article key={answer.id} className="p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                            style={{
                              backgroundColor: "#EEF1F6",
                              color: COLORS.navy,
                            }}
                          >
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                              <h3 className="font-semibold leading-6 text-gray-800">
                                {answer.question_text ||
                                  `Question #${answer.question}`}
                              </h3>

                              <span
                                className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                  answer.is_correct
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {answer.is_correct ? (
                                  <FaCheckCircle />
                                ) : (
                                  <FaTimesCircle />
                                )}
                                {answer.is_correct ? "Correct" : "Incorrect"}
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                              <div
                                className={`rounded-lg border p-4 ${
                                  answer.is_correct
                                    ? "border-green-200 bg-green-50"
                                    : "border-red-200 bg-red-50"
                                }`}
                              >
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Learner's Answer
                                </p>
                                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-800">
                                  {answer.selected_answer?.trim()
                                    ? answer.selected_answer
                                    : "No answer recorded"}
                                </p>
                              </div>

                              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-green-800">
                                  Correct Answer
                                </p>
                                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-800">
                                  {answer.correct_answer || "Not available"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default QuizAttemptDetailsPage;
