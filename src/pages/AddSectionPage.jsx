
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBook, FaSave } from "react-icons/fa";

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

const API_PREFIX = `${BASE_URL}/api/v1/rest-auth/admin/`;

export default function AddSectionPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      setError("");

      try {
        const response = await fetch(`${API_PREFIX}courses/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load courses. Please try again.");
        }

        const data = await response.json();
        const courseList = Array.isArray(data)
          ? data
          : data.results || [];

        setCourses(courseList);
      } catch (err) {
        setError(err.message || "Failed to load courses.");
      } finally {
        setLoadingCourses(false);
      }
    };

    if (token) {
      fetchCourses();
    } else {
      setLoadingCourses(false);
      setError("Your session has expired. Please sign in again.");
    }
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      setError("Please enter a section title.");
      return;
    }

    if (title.length > 40) {
      setError("The section title cannot exceed 40 characters.");
      return;
    }

    if (!formData.course) {
      setError("Please select a course.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_PREFIX}sections/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          course: Number(formData.course),
          description,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail =
          data.detail ||
          Object.entries(data)
            .map(([field, messages]) => {
              const text = Array.isArray(messages)
                ? messages.join(" ")
                : String(messages);

              return `${field}: ${text}`;
            })
            .join(" ") ||
          "Unable to create section.";

        throw new Error(detail);
      }

      setSuccess("Section created successfully.");

      setFormData({
        title: "",
        course: "",
        description: "",
      });

      // Keep the success message visible briefly before navigating.
      setTimeout(() => {
        navigate("/admin/sections");
      }, 1000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#91ADC6] focus:ring-2 focus:ring-[#91ADC6]/20";

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
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        
            
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <Link
                    to="/admin/sections"
                    className="transition hover:text-[#343652]"
                  >
                    Sections
                  </Link>
                  <span>/</span>
                  <span style={{ color: COLORS.navy }}>Add Section</span>
                </div>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Add New Section
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Create a learning section and assign it to a course.
                </p>
              </div>

              <Link
                to="/admin/sections"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50"
              >
                <FaArrowLeft />
                Back to Sections
              </Link>
            </div>

            {/* Form card */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div
                className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-8"
                style={{ backgroundColor: "#FCFCFD" }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#FBD22F30" }}
                >
                  <FaBook size={21} style={{ color: COLORS.navy }} />
                </div>

                <div>
                  <h2 className="font-semibold">Section Information</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the details for this learning section.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-8">
                {error && (
                  <div
                    role="alert"
                    className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                  >
                    {success}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Section title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="text-sm font-semibold"
                    >
                      Section Title <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      maxLength={40}
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Introduction to Python"
                      className={inputClass}
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      {formData.title.length}/40 characters
                    </p>
                  </div>

                  {/* Course selection */}
                  <div>
                    <label
                      htmlFor="course"
                      className="text-sm font-semibold"
                    >
                      Course <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="course"
                      name="course"
                      required
                      value={formData.course}
                      onChange={handleChange}
                      disabled={loadingCourses || courses.length === 0}
                      className={inputClass}
                    >
                      <option value="">
                        {loadingCourses
                          ? "Loading courses..."
                          : courses.length === 0
                            ? "No courses available"
                            : "Select a course"}
                      </option>

                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>

                    {!loadingCourses && courses.length === 0 && (
                      <p className="mt-2 text-xs text-amber-600">
                        Create a course before adding a section.
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-semibold"
                    >
                      Description{" "}
                      <span className="font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe what learners will cover in this section..."
                      className={`${inputClass} resize-y`}
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      Provide a brief overview of the section's content.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/sections")}
                    className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      loadingCourses ||
                      courses.length === 0
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      backgroundColor: COLORS.yellow,
                      color: COLORS.navy,
                    }}
                  >
                    <FaSave />
                    {submitting ? "Creating Section..." : "Create Section"}
                  </button>
                </div>
              </form>
            </div>
          
        </main>
      </div>
    </div>
  );
}
