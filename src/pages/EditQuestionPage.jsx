
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaQuestionCircle,
  FaSave,
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

const emptyForm = {
  quiz: "",
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "",
  marks: "1",
};

const EditQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setError("Please sign in again to edit quiz questions.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [questionResponse, quizzesResponse] = await Promise.all([
        fetch(`${apiUrl}/questions/${id}/`, {
          headers: authHeaders,
        }),
        fetch(`${apiUrl}/quizzes/`, {
          headers: authHeaders,
        }),
      ]);

      if (!questionResponse.ok) {
        if (questionResponse.status === 404) {
          throw new Error("The requested question could not be found.");
        }
        throw new Error("Unable to load the question.");
      }

      if (!quizzesResponse.ok) {
        throw new Error("Unable to load available quizzes.");
      }

      const question = await questionResponse.json();
      const quizzesData = await quizzesResponse.json();

      setQuizzes(
        Array.isArray(quizzesData)
          ? quizzesData
          : quizzesData.results || []
      );

      setForm({
        quiz: String(question.quiz ?? ""),
        question_text: question.question_text ?? "",
        option_a: question.option_a ?? "",
        option_b: question.option_b ?? "",
        option_c: question.option_c ?? "",
        option_d: question.option_d ?? "",
        correct_answer: question.correct_answer ?? "",
        marks: String(question.marks ?? 1),
      });
    } catch (err) {
      setError(err.message || "Unable to load question details.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authHeaders, id, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const options = [
    { key: "option_a", label: "Option A", value: form.option_a },
    { key: "option_b", label: "Option B", value: form.option_b },
    { key: "option_c", label: "Option C", value: form.option_c },
    { key: "option_d", label: "Option D", value: form.option_d },
  ];

  const selectedQuiz = quizzes.find(
    (quiz) => String(quiz.id) === String(form.quiz)
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleOptionChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const next = { ...previous, [name]: value };
      const oldCorrectAnswer = previous.correct_answer;

      // Preserve the correct answer when the selected option is unchanged.
      // If its text was edited, update the stored answer to the new text.
      if (
        oldCorrectAnswer &&
        previous[name].trim() === oldCorrectAnswer.trim()
      ) {
        next.correct_answer = value.trim();
      }

      return next;
    });

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!form.quiz) return "Please select a quiz.";
    if (!form.question_text.trim()) return "Question text is required.";

    const optionValues = options.map((option) => option.value.trim());

    if (optionValues.some((value) => !value)) {
      return "Please fill in all four answer options.";
    }

    if (!form.correct_answer.trim()) {
      return "Please select the correct answer.";
    }

    if (!optionValues.includes(form.correct_answer.trim())) {
      return (
        "The correct answer must match one of the options. " +
        "Please select the correct answer again."
      );
    }

    if (
      form.marks.trim() === "" ||
      !Number.isInteger(Number(form.marks)) ||
      Number(form.marks) < 0
    ) {
      return "Marks must be a non-negative whole number.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        quiz: Number(form.quiz),
        question_text: form.question_text.trim(),
        option_a: form.option_a.trim(),
        option_b: form.option_b.trim(),
        option_c: form.option_c.trim(),
        option_d: form.option_d.trim(),
        correct_answer: form.correct_answer.trim(),
        marks: Number(form.marks),
      };

      const response = await fetch(`${apiUrl}/questions/${id}/`, {
        method: "PATCH",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const details =
          data.detail ||
          Object.entries(data)
            .map(([field, messages]) => {
              const message = Array.isArray(messages)
                ? messages.join(" ")
                : typeof messages === "string"
                  ? messages
                  : JSON.stringify(messages);

              return `${field}: ${message}`;
            })
            .join(" ");

        throw new Error(details || "Failed to update the question.");
      }

      setSuccess("Question updated successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "An error occurred while updating.");
    } finally {
      setSubmitting(false);
    }
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
          <button
            type="button"
            onClick={() => navigate("/admin/questions")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <FaArrowLeft />
            Back to Questions
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Edit Quiz Question</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update the question, answer options, quiz assignment, or marks.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <FaExclamationCircle className="mt-0.5 shrink-0" />
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
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
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

          {loading ? (
            <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-transparent" />
              <p className="text-sm text-gray-500">
                Loading question details...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-6">
                  <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <FaQuestionCircle size={20} />
                      </div>
                      <div>
                        <h2 className="font-semibold">Question Details</h2>
                        <p className="text-xs text-gray-500">
                          Question ID: {id}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="quiz"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Quiz <span className="text-red-500">*</span>
                        </label>

                        <select
                          id="quiz"
                          name="quiz"
                          value={form.quiz}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select a quiz</option>
                          {quizzes.map((quiz) => (
                            <option key={quiz.id} value={String(quiz.id)}>
                              {quiz.title}
                              {quiz.is_active === false ? " (Inactive)" : ""}
                            </option>
                          ))}
                        </select>

                        {selectedQuiz && (
                          <p className="mt-2 text-xs text-gray-500">
                            Selected quiz: {selectedQuiz.title}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="question_text"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Question Text <span className="text-red-500">*</span>
                        </label>

                        <textarea
                          id="question_text"
                          name="question_text"
                          value={form.question_text}
                          onChange={handleChange}
                          rows={4}
                          required
                          maxLength={10000}
                          className="w-full resize-y rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 border-b border-gray-100 pb-4">
                      <h2 className="font-semibold">Answer Options</h2>
                      <p className="mt-1 text-xs text-gray-500">
                        Update all four possible answers.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {options.map((option, index) => (
                        <div key={option.key}>
                          <label
                            htmlFor={option.key}
                            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-xs font-bold">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option.label}
                            <span className="text-red-500">*</span>
                          </label>

                          <textarea
                            id={option.key}
                            name={option.key}
                            value={option.value}
                            onChange={handleOptionChange}
                            rows={2}
                            required
                            maxLength={5000}
                            className="w-full resize-y rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="font-semibold">Correct Answer</h2>
                    <p className="mb-4 mt-1 text-xs text-gray-500">
                      Select the full text of the correct option.
                    </p>

                    <label
                      htmlFor="correct_answer"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Correct Option <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="correct_answer"
                      name="correct_answer"
                      value={form.correct_answer}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select the correct answer</option>
                      {options
                        .filter((option) => option.value.trim())
                        .map((option, index) => (
                          <option
                            key={option.key}
                            value={option.value.trim()}
                          >
                            {String.fromCharCode(65 + index)} —{" "}
                            {option.value.trim().slice(0, 150)}
                          </option>
                        ))}
                    </select>
                  </section>
                </div>

                <aside className="space-y-5">
                  <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h2 className="font-semibold">Question Settings</h2>

                    <div className="mt-5">
                      <label
                        htmlFor="marks"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Marks <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="marks"
                        name="marks"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={form.marks}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="mt-5 rounded-lg bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-500">
                        Question Preview
                      </p>
                      <p className="mt-2 text-sm font-medium text-gray-800">
                        {form.question_text || "Your question will appear here."}
                      </p>

                      <div className="mt-3 space-y-2">
                        {options.map((option, index) => (
                          <div
                            key={option.key}
                            className={`rounded-md border px-3 py-2 text-xs ${
                              form.correct_answer === option.value.trim() &&
                              option.value.trim()
                                ? "border-green-300 bg-green-50 text-green-800"
                                : "border-gray-200 bg-white text-gray-600"
                            }`}
                          >
                            <span className="mr-2 font-bold">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option.value || "Option text"}
                            {form.correct_answer === option.value.trim() &&
                              option.value.trim() && " ✓ Correct"}
                          </div>
                        ))}
                      </div>

                      <p className="mt-3 text-xs text-gray-500">
                        Marks: {form.marks || "0"}
                      </p>
                    </div>
                  </section>

                  <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ backgroundColor: COLORS.navy }}
                    >
                      <FaSave />
                      {submitting ? "Saving Changes..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/admin/questions")}
                      disabled={submitting}
                      className="mt-3 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </section>
                </aside>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditQuestionPage;
