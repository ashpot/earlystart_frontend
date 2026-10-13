
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaImage } from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const API = `${BASE_URL}/api/v1/rest-auth/admin/`;
const NAVY = "#343652";
const YELLOW = "#FBD22F";

export default function EditQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [ageLevels, setAgeLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [existingPhoto, setExistingPhoto] = useState("");
  const [removePhoto, setRemovePhoto] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    age_level: "",
    pass_mark: "50",
    is_active: true,
    plan: "Free",
    allow_multiple_attempts: true,
    time_limit: "0",
    show_result_immediately: true,
    shuffle_questions: false,
    shuffle_answers: false,
  });

  const toggleSidebar = () => setCollapsed((previous) => !previous);

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        setError("Your session has expired. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Token ${token}` };

        const [quizResponse, categoryResponse, ageResponse] =
          await Promise.all([
            fetch(`${API}quizzes/${id}/`, { headers }),
            fetch(`${API}categories/`, { headers }),
            fetch(`${API}age-levels/`, { headers }),
          ]);

        if (!quizResponse.ok) {
          throw new Error(
            quizResponse.status === 404
              ? "Quiz not found."
              : "Unable to load quiz."
          );
        }

        if (!categoryResponse.ok || !ageResponse.ok) {
          throw new Error("Unable to load category or age-level options.");
        }

        const [quiz, categoryData, ageData] = await Promise.all([
          quizResponse.json(),
          categoryResponse.json(),
          ageResponse.json(),
        ]);

        setCategories(
          Array.isArray(categoryData) ? categoryData : categoryData.results || []
        );
        setAgeLevels(
          Array.isArray(ageData) ? ageData : ageData.results || []
        );

        setForm({
          title: quiz.title || "",
          category: quiz.category
            ? String(typeof quiz.category === "object" ? quiz.category.id : quiz.category)
            : "",
          description: quiz.description || "",
          age_level: quiz.age_level
            ? String(typeof quiz.age_level === "object" ? quiz.age_level.id : quiz.age_level)
            : "",
          pass_mark: String(quiz.pass_mark ?? 50),
          is_active: Boolean(quiz.is_active),
          plan: quiz.plan || "Free",
          allow_multiple_attempts: Boolean(quiz.allow_multiple_attempts),
          time_limit: String(quiz.time_limit ?? 0),
          show_result_immediately: Boolean(quiz.show_result_immediately),
          shuffle_questions: Boolean(quiz.shuffle_questions),
          shuffle_answers: Boolean(quiz.shuffle_answers),
        });

        setExistingPhoto(quiz.photo_url || "");
      } catch (err) {
        setError(err.message || "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, token]);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return;
    }

    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setPhoto(file);
    setRemovePhoto(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const title = form.title.trim();
    const passMark = Number(form.pass_mark);
    const timeLimit = Number(form.time_limit);

    if (!title || title.length > 40) {
      setError("Enter a quiz title of no more than 40 characters.");
      return;
    }

    if (!Number.isInteger(passMark) || passMark < 0 || passMark > 100) {
      setError("Pass mark must be a whole number between 0 and 100.");
      return;
    }

    if (!Number.isInteger(timeLimit) || timeLimit < 0) {
      setError("Time limit must be a non-negative whole number.");
      return;
    }

    const payload = new FormData();

    payload.append("title", title);
    payload.append("description", form.description.trim());
    payload.append("category", form.category);
    payload.append("age_level", form.age_level);
    payload.append("pass_mark", String(passMark));
    payload.append("is_active", String(form.is_active));
    payload.append("plan", form.plan.trim());
    payload.append("allow_multiple_attempts", String(form.allow_multiple_attempts));
    payload.append("time_limit", String(timeLimit));
    payload.append("show_result_immediately", String(form.show_result_immediately));
    payload.append("shuffle_questions", String(form.shuffle_questions));
    payload.append("shuffle_answers", String(form.shuffle_answers));

    if (photo) {
      payload.append("photo", photo);
    } else if (removePhoto) {
      // DRF's nullable ImageField accepts an empty multipart value
      // as null when allow_null=True.
      payload.append("photo", "");
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API}quizzes/${id}/`, {
        method: "PATCH",
        headers: { Authorization: `Token ${token}` },
        body: payload,
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
          "Unable to update quiz.";

        throw new Error(message);
      }

      setSuccess("Quiz updated successfully.");
      setTimeout(() => navigate("/admin/quizzes"), 800);
    } catch (err) {
      setError(err.message || "Failed to update quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#91ADC6] focus:ring-2 focus:ring-[#91ADC6]/20";

  const toggleFields = [
    ["is_active", "Active", "Make this quiz available to learners."],
    ["allow_multiple_attempts", "Allow Multiple Attempts", "Allow learners to retake this quiz."],
    ["show_result_immediately", "Show Results Immediately", "Display results after submission."],
    ["shuffle_questions", "Shuffle Questions", "Randomize question order."],
    ["shuffle_answers", "Shuffle Answers", "Randomize answer order."],
  ];

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
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-sm text-gray-500">
                  <Link to="/admin/quizzes">Quizzes</Link> / Edit Quiz
                </p>
                <h1 className="text-2xl font-bold sm:text-3xl">Edit Quiz</h1>
                <p className="mt-2 text-sm text-gray-500">Update quiz content and assessment settings.</p>
              </div>
              <Link to="/admin/quizzes" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm">
                <FaArrowLeft /> Back to Quizzes
              </Link>
            </div>

            {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {success && <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

            {loading ? (
              <div className="rounded-2xl bg-white p-12 text-center text-sm text-gray-500">Loading quiz...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                  <h2 className="mb-6 font-semibold">Basic Information</h2>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="title" className="text-sm font-semibold">Quiz Title *</label>
                      <input id="title" name="title" required maxLength={40} value={form.title} onChange={handleChange} className={inputClass} />
                      <p className="mt-1 text-xs text-gray-400">{form.title.length}/40 characters</p>
                    </div>

                    <div>
                      <label htmlFor="category" className="text-sm font-semibold">Category (Optional)</label>
                      <select id="category" name="category" value={form.category} onChange={handleChange} className={inputClass}>
                        <option value="">No category</option>
                        {categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="age_level" className="text-sm font-semibold">Age Level (Optional)</label>
                      <select id="age_level" name="age_level" value={form.age_level} onChange={handleChange} className={inputClass}>
                        <option value="">All age levels</option>
                        {ageLevels.map((age) => <option key={age.id} value={age.id}>{age.name || age.title || `Age level ${age.id}`}</option>)}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="plan" className="text-sm font-semibold">Plan *</label>
                      <input id="plan" name="plan" required value={form.plan} onChange={handleChange} className={inputClass} />
                      <p className="mt-1 text-xs text-gray-400">Must match a choice in your Django PLANS constant.</p>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="description" className="text-sm font-semibold">Description (Optional)</label>
                      <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} className={`${inputClass} resize-y`} />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold">Quiz Photo</label>
                      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex h-36 w-full max-w-xs items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
                          {photoPreview ? (
                            <img src={photoPreview} alt="New quiz photo preview" className="h-full w-full object-cover" />
                          ) : existingPhoto && !removePhoto ? (
                            <img src={existingPhoto} alt="Current quiz" className="h-full w-full object-cover" />
                          ) : (
                            <div className="text-center text-gray-400"><FaImage className="mx-auto mb-2 text-3xl" /><span className="text-xs">No photo selected</span></div>
                          )}
                        </div>

                        <div>
                          <input type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm" />
                          <p className="mt-2 text-xs text-gray-400">Image files only, maximum 5 MB.</p>
                          {(photo || existingPhoto) && !removePhoto && (
                            <button type="button" onClick={() => { setPhoto(null); setRemovePhoto(true); }} className="mt-2 text-xs font-medium text-red-600">Remove photo</button>
                          )}
                          {removePhoto && (
                            <button type="button" onClick={() => setRemovePhoto(false)} className="mt-2 block text-xs font-medium text-blue-600">Keep existing photo</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                  <h2 className="mb-6 font-semibold">Assessment Settings</h2>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="pass_mark" className="text-sm font-semibold">Pass Mark (%)</label>
                      <input id="pass_mark" name="pass_mark" type="number" min="0" max="100" required value={form.pass_mark} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="time_limit" className="text-sm font-semibold">Time Limit (Minutes)</label>
                      <input id="time_limit" name="time_limit" type="number" min="0" required value={form.time_limit} onChange={handleChange} className={inputClass} />
                      <p className="mt-1 text-xs text-gray-400">0 means unlimited.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {toggleFields.map(([name, label, description]) => (
                      <label key={name} className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                        <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="mt-1 h-4 w-4 accent-yellow-400" />
                        <span>
                          <span className="block text-sm font-semibold">{label}</span>
                          <span className="mt-1 block text-xs text-gray-500">{description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => navigate("/admin/quizzes")} className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold">Cancel</button>
                  <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: YELLOW, color: NAVY }}>
                    <FaSave /> {submitting ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
