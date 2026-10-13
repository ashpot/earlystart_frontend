
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBook, FaSave } from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const API = `${BASE_URL}/api/v1/rest-auth/admin/`;
const NAVY = "#343652";
const YELLOW = "#FBD22F";

export default function AddLessonPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    course: "",
    section: "",
    description: "",
    durationMinutes: "0",
    durationSeconds: "0",
    order: "1",
    video_url: "",
    file_url: "",
    preview: false,
  });

  const toggleSidebar = () => setCollapsed((previous) => !previous);

  useEffect(() => {
    const loadOptions = async () => {
      if (!token) {
        setError("Your session has expired. Please sign in again.");
        setLoadingOptions(false);
        return;
      }

      setLoadingOptions(true);
      try {
        const headers = { Authorization: `Token ${token}` };

        const [courseResponse, sectionResponse] = await Promise.all([
          fetch(`${API}courses/`, { headers }),
          fetch(`${API}sections/`, { headers }),
        ]);

        if (!courseResponse.ok || !sectionResponse.ok) {
          throw new Error("Unable to load courses and sections.");
        }

        const courseData = await courseResponse.json();
        const sectionData = await sectionResponse.json();

        setCourses(
          Array.isArray(courseData) ? courseData : courseData.results || []
        );
        setSections(
          Array.isArray(sectionData) ? sectionData : sectionData.results || []
        );
      } catch (err) {
        setError(err.message || "Failed to load form options.");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [token]);

  const availableSections = sections.filter((section) => {
    const courseId =
      typeof section.course === "object"
        ? section.course?.id
        : section.course;

    return String(courseId) === String(form.course);
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "course" ? { section: "" } : {}),
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const title = form.title.trim();
    const minutes = Number(form.durationMinutes);
    const seconds = Number(form.durationSeconds);
    const order = Number(form.order);

    if (!title || title.length > 40) {
      setError("Enter a lesson title of no more than 40 characters.");
      return;
    }

    if (!form.course) {
      setError("Please select a course.");
      return;
    }

    if (
      !Number.isInteger(minutes) ||
      minutes < 0 ||
      !Number.isInteger(seconds) ||
      seconds < 0 ||
      seconds > 59 ||
      minutes * 60 + seconds <= 0
    ) {
      setError("Enter a valid duration greater than zero.");
      return;
    }

    if (!Number.isInteger(order) || order < 1) {
      setError("Lesson order must be a positive whole number.");
      return;
    }

    // Django REST Framework DurationField accepts this format.
    const totalSeconds = minutes * 60 + seconds;
    const hours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    const duration = [
      String(hours).padStart(2, "0"),
      String(remainingMinutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0"),
    ].join(":");

    const payload = {
      title,
      course: Number(form.course),
      section: form.section ? Number(form.section) : null,
      description: form.description.trim(),
      duration,
      order,
      video_url: form.video_url.trim() || null,
      file_url: form.file_url.trim() || null,
      preview: form.preview,
    };

    setSubmitting(true);

    try {
      const response = await fetch(`${API}lessons/`, {
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
            .map(([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages.join(" ") : messages}`
            )
            .join(" ") ||
          "Unable to create lesson.";

        throw new Error(message);
      }

      setSuccess("Lesson created successfully.");
      setTimeout(() => navigate("/admin/lessons"), 800);
    } catch (err) {
      setError(err.message || "Failed to create lesson.");
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
                  <Link to="/admin/lessons">Lessons</Link> / Add Lesson
                </p>
                <h1 className="text-2xl font-bold sm:text-3xl">Add New Lesson</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Add a learning lesson to a course.
                </p>
              </div>
              <Link to="/admin/lessons" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm">
                <FaArrowLeft /> Back to Lessons
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "#FBD22F35" }}>
                  <FaBook size={21} />
                </div>
                <div>
                  <h2 className="font-semibold">Lesson Information</h2>
                  <p className="mt-1 text-xs text-gray-500">Fields marked * are required.</p>
                </div>
              </div>

              {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              {success && <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

              {loadingOptions ? (
                <p className="py-8 text-center text-sm text-gray-500">Loading courses and sections...</p>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="title" className="text-sm font-semibold">Lesson Title *</label>
                    <input id="title" name="title" required maxLength={40} value={form.title} onChange={handleChange} placeholder="e.g. Variables in Python" className={inputClass} />
                    <p className="mt-1 text-xs text-gray-400">{form.title.length}/40 characters</p>
                  </div>

                  <div>
                    <label htmlFor="course" className="text-sm font-semibold">Course *</label>
                    <select id="course" name="course" required value={form.course} onChange={handleChange} className={inputClass}>
                      <option value="">Select course</option>
                      {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="section" className="text-sm font-semibold">Section (Optional)</label>
                    <select id="section" name="section" value={form.section} onChange={handleChange} disabled={!form.course} className={inputClass}>
                      <option value="">No section</option>
                      {availableSections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Duration *</label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <div>
                        <input aria-label="Duration in minutes" name="durationMinutes" type="number" min="0" value={form.durationMinutes} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm" />
                        <p className="mt-1 text-xs text-gray-400">Minutes</p>
                      </div>
                      <div>
                        <input aria-label="Duration in seconds" name="durationSeconds" type="number" min="0" max="59" value={form.durationSeconds} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm" />
                        <p className="mt-1 text-xs text-gray-400">Seconds</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="order" className="text-sm font-semibold">Lesson Order *</label>
                    <input id="order" name="order" type="number" min="1" required value={form.order} onChange={handleChange} className={inputClass} />
                    <p className="mt-1 text-xs text-gray-400">Position within the course.</p>
                  </div>

                  <div>
                    <label htmlFor="video_url" className="text-sm font-semibold">Video URL (Optional)</label>
                    <input id="video_url" name="video_url" type="url" value={form.video_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="file_url" className="text-sm font-semibold">Resource File URL (Optional)</label>
                    <input id="file_url" name="file_url" type="url" value={form.file_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="text-sm font-semibold">Description (Optional)</label>
                    <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} placeholder="Describe what learners will learn..." className={`${inputClass} resize-y`} />
                  </div>

                  <label className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 md:col-span-2">
                    <input type="checkbox" name="preview" checked={form.preview} onChange={handleChange} className="h-4 w-4 accent-yellow-400" />
                    <span>
                      <span className="block text-sm font-semibold">Free Preview</span>
                      <span className="mt-1 block text-xs text-gray-500">Allow learners to preview this lesson.</span>
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => navigate("/admin/lessons")} className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={submitting || loadingOptions || courses.length === 0} className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: YELLOW, color: NAVY }}>
                  <FaSave /> {submitting ? "Creating Lesson..." : "Create Lesson"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
