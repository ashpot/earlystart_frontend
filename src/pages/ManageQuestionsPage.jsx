
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaChevronLeft,
  FaChevronRight,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaTimes,
  FaCheckCircle,
  FaFilter,
  FaSync,
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
  gray: "#BDBEC0",
  white: "#FFFFFF",
};

const PAGE_SIZE = 10;

const ManageQuestionsPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [search, setSearch] = useState("");
  const [quizFilter, setQuizFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const apiUrl = `${BASE_URL}/api/v1/rest-auth/admin`;

  const authHeaders = useMemo(
    () => ({
      Authorization: `Token ${token}`,
    }),
    [token]
  );

  const loadData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Please sign in again to manage quiz questions.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [questionsResponse, quizzesResponse] = await Promise.all([
        fetch(`${apiUrl}/questions/`, {
          headers: authHeaders,
        }),
        fetch(`${apiUrl}/quizzes/`, {
          headers: authHeaders,
        }),
      ]);

      if (!questionsResponse.ok) {
        throw new Error("Unable to load quiz questions.");
      }

      if (!quizzesResponse.ok) {
        throw new Error("Unable to load quizzes.");
      }

      const questionsData = await questionsResponse.json();
      const quizzesData = await quizzesResponse.json();

      setQuestions(
        Array.isArray(questionsData)
          ? questionsData
          : questionsData.results || []
      );

      setQuizzes(
        Array.isArray(quizzesData)
          ? quizzesData
          : quizzesData.results || []
      );
    } catch (err) {
      setError(err.message || "Something went wrong while loading data.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authHeaders, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesSearch =
        !normalizedSearch ||
        String(question.question_text || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(question.quiz_title || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(question.id).includes(normalizedSearch);

      const matchesQuiz =
        quizFilter === "all" ||
        String(question.quiz) === String(quizFilter);

      return matchesSearch && matchesQuiz;
    });
  }, [questions, search, quizFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / PAGE_SIZE)
  );

  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredQuestions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredQuestions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, quizFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async () => {
    if (!questionToDelete) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${apiUrl}/questions/${questionToDelete.id}/`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.detail || "Failed to delete the question."
        );
      }

      setQuestions((previous) =>
        previous.filter(
          (question) => question.id !== questionToDelete.id
        )
      );

      setSuccess("Question deleted successfully.");
      setQuestionToDelete(null);
    } catch (err) {
      setError(err.message || "Unable to delete the question.");
    } finally {
      setDeleting(false);
    }
  };

  const truncate = (value, length = 90) => {
    if (!value) return "—";
    return value.length > length
      ? `${value.slice(0, length)}…`
      : value;
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
          {/* Page heading */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: COLORS.navy }}>
                Quiz Questions
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create, organize, and manage questions across your quizzes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/admin/questions/bulk-upload")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50"
                style={{ borderColor: COLORS.blue, color: COLORS.navy }}
              >
                <FaFileExcel className="text-green-700" />
                Bulk Upload
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/question/add")}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: COLORS.navy }}
              >
                <FaPlus />
                Add Question
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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

          {success && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <FaCheckCircle />
              <span className="flex-1">{success}</span>
              <button
                type="button"
                onClick={() => setSuccess("")}
                aria-label="Dismiss success message"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Questions</p>
                  <p className="mt-2 text-2xl font-bold">
                    {questions.length}
                  </p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#E9EDF4" }}
                >
                  <FaQuestionCircle
                    size={22}
                    style={{ color: COLORS.navy }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Available Quizzes</p>
                  <p className="mt-2 text-2xl font-bold">
                    {quizzes.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50">
                  <FaFilter size={20} style={{ color: COLORS.navy }} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Filtered Results</p>
                  <p className="mt-2 text-2xl font-bold">
                    {filteredQuestions.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                  <FaSearch size={20} className="text-green-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_280px_auto]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search questions, quiz titles, or IDs..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={quizFilter}
                onChange={(event) => setQuizFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All quizzes</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={String(quiz.id)}>
                    {quiz.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setQuizFilter("all");
                  setSuccess("");
                  setError("");
                  loadData();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <FaSync />
                Refresh
              </button>
            </div>
          </div>

          {/* Questions table */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="font-semibold" style={{ color: COLORS.navy }}>
                  All Questions
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Manage the questions assigned to each quiz.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {filteredQuestions.length} records
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div
                  className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-transparent"
                  style={{ borderTopColor: COLORS.navy }}
                />
                <p className="text-sm text-gray-500">
                  Loading quiz questions...
                </p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <FaQuestionCircle className="mx-auto mb-3 text-4xl text-gray-300" />
                <h3 className="font-semibold text-gray-700">
                  No questions found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add a question or adjust your search and filters.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/admin/question/add")}
                  className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.navy }}
                >
                  Add your first question
                </button>
              </div>
            ) : (
              <>
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Question</th>
                        <th className="px-5 py-4 font-semibold">Quiz</th>
                        <th className="px-5 py-4 font-semibold">Correct Answer</th>
                        <th className="px-5 py-4 text-center font-semibold">
                          Marks
                        </th>
                        <th className="px-5 py-4 text-right font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {paginatedQuestions.map((question) => (
                        <tr
                          key={question.id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="max-w-md px-5 py-4">
                            <div className="flex items-start gap-3">
                              <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                                style={{
                                  backgroundColor: "#EEF1F6",
                                  color: COLORS.navy,
                                }}
                              >
                                #{question.id}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {truncate(question.question_text, 100)}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  {[
                                    question.option_a,
                                    question.option_b,
                                    question.option_c,
                                    question.option_d,
                                  ]
                                    .filter(Boolean)
                                    .length}{" "}
                                  answer options
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-block max-w-[220px] truncate rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-800">
                              {question.quiz_title || `Quiz #${question.quiz}`}
                            </span>
                          </td>

                          <td className="max-w-xs px-5 py-4">
                            <span className="inline-block max-w-[240px] truncate rounded-md bg-green-50 px-2.5 py-1.5 text-xs text-green-800">
                              {truncate(question.correct_answer, 55)}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-gray-800">
                              {question.marks}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                title="Edit question"
                                aria-label={`Edit question ${question.id}`}
                                onClick={() =>
                                  navigate(
                                    `/admin/question/edit/${question.id}`
                                  )
                                }
                                className="rounded-lg border border-gray-200 p-2.5 text-blue-700 transition hover:bg-blue-50"
                              >
                                <FaEdit />
                              </button>

                              <button
                                type="button"
                                title="Delete question"
                                aria-label={`Delete question ${question.id}`}
                                onClick={() =>
                                  setQuestionToDelete(question)
                                }
                                className="rounded-lg border border-gray-200 p-2.5 text-red-600 transition hover:bg-red-50"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    {(currentPage - 1) * PAGE_SIZE + 1}–{" "}
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      filteredQuestions.length
                    )}{" "}
                    of {filteredQuestions.length} questions
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
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
                      className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
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

      {/* Delete confirmation */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <FaExclamationTriangle className="text-xl text-red-600" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Delete question?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete this question?
              This action cannot be undone.
            </p>

            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              {truncate(questionToDelete.question_text, 150)}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setQuestionToDelete(null)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestionsPage;
