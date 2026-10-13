
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const API = `${BASE_URL}/api/v1/rest-auth/admin/`;
const NAVY = "#343652";
const YELLOW = "#FBD22F";

const emptyForm = {
  lesson: "",
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correctOption: "A",
};

export default function AddLessonTestPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleSidebar = () => setCollapsed((previous) => !previous);

  useEffect(() => {
    const loadLessons = async () => {
      if (!token) {
        setError("Your session has expired. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}lessons/`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) throw new Error("Unable to load lessons.");

        const data = await response.json();
        setLessons(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message || "Failed to load lessons.");
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const question = form.question_text.trim();
    const options = [
      form.option_a.trim(),
      form.option_b.trim(),
      form.option_c.trim(),
      form.option_d.trim(),
    ];

    if (!question) {
      setError("Please enter the question.");
      return;
    }

    if (options.some((option) => !option)) {
      setError("Please complete all four answer options.");
      return;
    }

    const answerIndex = ["A", "B", "C", "D"].indexOf(form.correctOption);
    const answer = options[answerIndex];

    const payload = {
      lesson: form.lesson ? Number(form.lesson) : null,
      question_text: question,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      answer,
    };

    setSubmitting(true);

    try {
      const response = await fetch(`${API}lesson-tests/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data.detail ||
          Object.entries(data)
            .map(([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(" ") : value}`
            )
            .join(" ") ||
          "Unable to create question.";

        throw new Error(message);
      }

      setSuccess("Question created successfully.");
      setTimeout(() => navigate("/admin/lesson-tests"), 800);
    } catch (err) {
      setError(err.message || "Failed to create question.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#91ADC6] focus:ring-2 focus:ring-[#91ADC6]/20";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F8FA", color: NAVY }}>
      <aside className={`fixed inset-y-0 left-0 z-40 hidden overflow-y-auto border-r border-gray-100 bg-white transition-[width] duration-300 md:block ${collapsed ? "w-20" : "w-60"}`}>
        {collapsed
          ? <CollapsedSidebar toggleSidebar={toggleSidebar} isSidebarCollapsed={collapsed} />
          : <Sidebar toggleSidebar={toggleSidebar} isSidebarCollapsed={collapsed} />}
      </aside>

      <div className={`min-h-screen min-w-0 transition-[margin] duration-300 ${collapsed ? "md:ml-20" : "md:ml-60"}`}>
        <DashboardNavbar toggleSidebar={toggleSidebar} isSidebarCollapsed={collapsed} />

        <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-sm text-gray-500">
                  <Link to="/admin/lesson-tests">Lesson Tests</Link> / Add Question
                </p>
                <h1 className="text-2xl font-bold sm:text-3xl">Add Lesson Test</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Create a multiple-choice question for a lesson.
                </p>
              </div>
              <Link to="/admin/lesson-tests" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm">
                <FaArrowLeft /> Back to Questions
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
              {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              {success && <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

              <div className="mb-6">
                <label htmlFor="lesson" className="text-sm font-semibold">Lesson (Optional)</label>
                <select id="lesson" name="lesson" value={form.lesson} onChange={handleChange} disabled={loading} className={inputClass}>
                  <option value="">Not assigned to a lesson</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
                {loading && <p className="mt-1 text-xs text-gray-400">Loading lessons...</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="question_text" className="text-sm font-semibold">Question *</label>
                <textarea id="question_text" name="question_text" required rows={4} value={form.question_text} onChange={handleChange} placeholder="Enter the question..." className={`${inputClass} resize-y`} />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {["a", "b", "c", "d"].map((letter) => (
                  <div key={letter}>
                    <label htmlFor={`option_${letter}`} className="text-sm font-semibold">
                      Option {letter.toUpperCase()} *
                    </label>
                    <textarea id={`option_${letter}`} name={`option_${letter}`} required rows={3} value={form[`option_${letter}`]} onChange={handleChange} placeholder={`Enter option ${letter.toUpperCase()}...`} className={`${inputClass} resize-y`} />
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label htmlFor="correctOption" className="text-sm font-semibold">Correct Answer *</label>
                <select id="correctOption" name="correctOption" value={form.correctOption} onChange={handleChange} className={inputClass}>
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  The selected option's text will be stored as the answer.
                </p>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => navigate("/admin/lesson-tests")} className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || loading} className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: YELLOW, color: NAVY }}>
                  <FaSave /> {submitting ? "Saving..." : "Create Question"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
