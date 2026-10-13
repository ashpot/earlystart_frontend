
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaImage,
  FaSave,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const API_PREFIX = `${BASE_URL}/api/v1/rest-auth/admin/`;

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
};

const getList = (data) =>
  Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];

const getRelationId = (value) =>
  value && typeof value === "object" ? value.id ?? "" : value ?? "";

export default function EditCoursePage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed((previous) => !previous);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    age_level: "",
    is_active: true,
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [ageLevels, setAgeLevels] = useState([]);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [optionsWarning, setOptionsWarning] = useState("");

  useEffect(() => {
    if (!formData.image) {
      setImagePreview("");
      return undefined;
    }

    const url = URL.createObjectURL(formData.image);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [formData.image]);

  const loadCourse = useCallback(async () => {
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_PREFIX}courses/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || `Unable to load course (HTTP ${response.status}).`
        );
      }

      setFormData({
        title: data.title || "",
        category: String(getRelationId(data.category)),
        description: data.description || "",
        age_level:
          getRelationId(data.age_level) === ""
            ? ""
            : String(getRelationId(data.age_level)),
        is_active: data.is_active ?? true,
        image: null,
      });

      setExistingImageUrl(data.image_url || data.image || "");
    } catch (err) {
      console.error("Loading course failed:", err);
      setError(err.message || "Unable to load this course.");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  const loadOptions = useCallback(async () => {
    if (!token) return;

    const headers = {
      Authorization: `Token ${token}`,
      Accept: "application/json",
    };

    try {
      const [categoryResult, ageResult] = await Promise.allSettled([
        fetch(`${API_PREFIX}categories/`, { headers }),
        fetch(`${API_PREFIX}age-levels/`, { headers }),
      ]);

      if (categoryResult.status === "fulfilled" && categoryResult.value.ok) {
        const data = await categoryResult.value.json();
        setCategories(getList(data));
      } else {
        setOptionsWarning("Unable to load categories. Check the category API endpoint.");
      }

      if (ageResult.status === "fulfilled" && ageResult.value.ok) {
        const data = await ageResult.value.json();
        setAgeLevels(getList(data));
      } else {
        setOptionsWarning((previous) =>
          [
            previous,
            "Age levels could not be loaded. The existing age level may still be retained if left unchanged.",
          ]
            .filter(Boolean)
            .join(" ")
        );
      }
    } catch (err) {
      console.error("Loading course options failed:", err);
      setOptionsWarning("Some form options could not be loaded.");
    }
  }, [token]);

  useEffect(() => {
    loadCourse();
    loadOptions();
  }, [loadCourse, loadOptions]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccessMessage("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setFormData((previous) => ({ ...previous, image: file }));
    setError("");
  };

  const removeNewImage = () => {
    setFormData((previous) => ({ ...previous, image: null }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (formData.title.trim().length > 40) {
      setError("Course title cannot exceed 40 characters.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Course description is required.");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("category", formData.category);
    payload.append("description", formData.description.trim());
    payload.append("is_active", String(formData.is_active));

    if (formData.age_level) {
      payload.append("age_level", formData.age_level);
    } else {
      // Explicitly clear an existing nullable age-level relation.
      payload.append("age_level", "");
    }

    if (formData.image) {
      payload.append("image", formData.image);
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_PREFIX}courses/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
        body: payload,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detail =
          data?.detail ||
          (data && typeof data === "object"
            ? Object.entries(data)
                .map(([field, value]) => {
                  const message = Array.isArray(value)
                    ? value.join(" ")
                    : String(value);
                  return `${field.replaceAll("_", " ")}: ${message}`;
                })
                .join(" ")
            : "");

        throw new Error(
          detail || `Unable to update course (HTTP ${response.status}).`
        );
      }

      setSuccessMessage("Course updated successfully.");
      setExistingImageUrl(data?.image_url || data?.image || existingImageUrl);
      setFormData((previous) => ({ ...previous, image: null }));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Updating course failed:", err);
      setError(err.message || "Unable to update course.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayedImage = imagePreview || existingImageUrl;

  const inputClass =
    "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#91ADC6] focus:ring-2 focus:ring-[#91ADC6]/20";

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
            onClick={() => navigate("/admin/courses")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            <FaArrowLeft size={12} />
            Back to Courses
          </button>

          <div className="mb-7">
            <h1 className="text-2xl font-bold sm:text-3xl">Edit Course</h1>
            <p className="mt-2 text-sm text-gray-500">
              Update the course details and availability.
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-5 flex justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span>{error}</span>
              <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
                <FaTimes />
              </button>
            </div>
          )}

          {successMessage && (
            <div role="status" className="mb-5 flex justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <span>{successMessage}</span>
              <button type="button" onClick={() => setSuccessMessage("")} aria-label="Dismiss message">
                <FaTimes />
              </button>
            </div>
          )}

          {optionsWarning && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {optionsWarning}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-500">
              Loading course details...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
                <div className="min-w-0 space-y-6 xl:col-span-2">
                  <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                    <h2 className="mb-6 border-b border-gray-100 pb-5 text-base font-bold">
                      Course Information
                    </h2>

                    <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                      Course Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={40}
                      required
                      className={inputClass}
                    />
                    <p className="mt-1 text-right text-xs text-gray-400">
                      {formData.title.length}/40
                    </p>

                    <div className="mt-6">
                      <label htmlFor="category" className="text-sm font-semibold text-gray-700">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-6">
                      <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={7}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className={`${inputClass} resize-y`}
                      />
                    </div>

                    <div className="mt-6">
                      <label htmlFor="age_level" className="text-sm font-semibold text-gray-700">
                        Age Level (Optional)
                      </label>
                      <select
                        id="age_level"
                        name="age_level"
                        value={formData.age_level}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">No specific age level</option>
                        {ageLevels.map((level) => (
                          <option key={level.id} value={level.id}>
                            {level.title || level.name || `Age level ${level.id}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
                      <span>
                        <span className="block text-sm font-semibold text-gray-800">
                          Active Course
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          Enable or disable this course.
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-5 w-5 accent-yellow-400"
                      />
                    </label>
                  </section>
                </div>

                <aside className="space-y-6">
                  <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="text-base font-bold">Course Cover Image</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload a replacement image if needed.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {displayedImage ? (
                      <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
                        <img
                          src={displayedImage}
                          alt="Course cover"
                          className="aspect-[4/3] w-full object-cover"
                        />
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={removeNewImage}
                            className="w-full border-t border-gray-100 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Remove replacement image
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="mt-5 flex min-h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center" style={{ borderColor: COLORS.blue }}>
                        <FaImage size={28} className="mb-3" style={{ color: COLORS.blue }} />
                        <p className="text-sm text-gray-500">No cover image selected</p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <FaUpload />
                      {displayedImage ? "Change Image" : "Upload Image"}
                    </button>
                    <p className="mt-3 text-xs text-gray-400">
                      Optional. Maximum image size: 5 MB.
                    </p>
                  </section>

                  <section className="rounded-2xl p-5" style={{ backgroundColor: "#EAF0F5" }}>
                    <h2 className="text-sm font-bold">Editing tips</h2>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                      <li>• Keep the title clear and concise.</li>
                      <li>• Verify the category and age level.</li>
                      <li>• Check the description before saving.</li>
                      <li>• Your current image remains if no replacement is uploaded.</li>
                    </ul>
                  </section>
                </aside>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-end gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate("/admin/courses")}
                  disabled={submitting}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold disabled:opacity-60"
                  style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
                >
                  <FaSave />
                  {submitting ? "Saving changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
