
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
};

const API_PREFIX = `${BASE_URL}/api/v1/rest-auth/admin/`;

export default function EditSectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    const loadPageData = async () => {
      setLoading(true);
      setError("");

      try {
        const headers = {
          Authorization: `Token ${token}`,
        };

        const [sectionResponse, coursesResponse] = await Promise.all([
          fetch(`${API_PREFIX}sections/${id}/`, { headers }),
          fetch(`${API_PREFIX}courses/`, { headers }),
        ]);

        if (!sectionResponse.ok) {
          if (sectionResponse.status === 404) {
            throw new Error("Section not found.");
          }

          throw new Error("Unable to load section details.");
        }

        const section = await sectionResponse.json();

        setFormData({
          title: section.title || "",
          course:
            typeof section.course === "object"
              ? String(section.course?.id || "")
              : String(section.course || ""),
          description: section.description || "",
        });

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();

          setCourses(
            Array.isArray(coursesData)
              ? coursesData
              : coursesData.results || []
          );
        } else {
          throw new Error("Unable to load course options.");
        }
      } catch (err) {
        setError(err.message || "Failed to load section.");
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [id, token]);

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

    if (!title) {
      setError("Section title is required.");
      return;
    }

    if (title.length > 40) {
      setError("Section title cannot exceed 40 characters.");
      return;
    }

    if (!formData.course) {
      setError("Please select a course.");
      return;
    }

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_PREFIX}sections/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            course: Number(formData.course),
            description: formData.description.trim(),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail =
          data.detail ||
          Object.entries(data)
            .map(([field, messages]) => {
              const message = Array.isArray(messages)
                ? messages.join(" ")
                : String(messages);

              return `${field}: ${message}`;
            })
            .join(" ") ||
          "Unable to update section.";

        throw new Error(detail);
      }

      setSuccess("Section updated successfully.");

      setTimeout(() => {
        navigate("/admin/sections");
      }, 800);
    } catch (err) {
      setError(err.message || "Failed to update section.");
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
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <Link
                    to="/admin/sections"
                    className="hover:text-[#343652]"
                  >
                    Sections
                  </Link>
                  <span>/</span>
                  <span style={{ color: COLORS.navy }}>Edit Section</span>
                </div>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Edit Section
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Update the section information and assigned course.
                </p>
              </div>

              <Link
                to="/admin/sections"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                <FaArrowLeft />
                Back to Sections
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-5 py-5 sm:px-8">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#FBD22F35" }}
                >
                  <FaBook size={21} />
                </div>

                <div>
                  <h2 className="font-semibold">Section Information</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Section ID: {id}
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

                {loading ? (
                  <div className="py-12 text-center text-sm text-gray-500">
                    Loading section details...
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="title"
                          className="text-sm font-semibold"
                        >
                          Section Title{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <input
                          id="title"
                          name="title"
                          type="text"
                          required
                          maxLength={40}
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter section title"
                          className={inputClass}
                        />

                        <p className="mt-2 text-xs text-gray-400">
                          {formData.title.length}/40 characters
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="course"
                          className="text-sm font-semibold"
                        >
                          Course{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <select
                          id="course"
                          name="course"
                          required
                          value={formData.course}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option value="">Select a course</option>

                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.title}
                            </option>
                          ))}
                        </select>
                      </div>

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
                          placeholder="Describe this section..."
                          className={`${inputClass} resize-y`}
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => navigate("/admin/sections")}
                        className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                        style={{
                          backgroundColor: COLORS.yellow,
                          color: COLORS.navy,
                        }}
                      >
                        <FaSave />
                        {submitting ? "Saving Changes..." : "Save Changes"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
