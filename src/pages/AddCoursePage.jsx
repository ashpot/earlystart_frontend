
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaCheckCircle,
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

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
  gray: "#BDBEC0",
  white: "#FFFFFF",
};

const API_PREFIX = "/api/v1/rest-auth/admin/";

export default function AddCoursePage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Sidebar state: matches AddCategoryPage.jsx.
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  // Form state.
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

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [optionsWarning, setOptionsWarning] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Clean up temporary image preview URLs.
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Load categories and age levels.
  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      if (!token) {
        setApiError("Your session has expired. Please sign in again.");
        setLoadingOptions(false);
        return;
      }

      setLoadingOptions(true);
      setApiError("");
      setOptionsWarning("");

      const headers = {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      };

      try {
        const [categoryResult, ageLevelResult] = await Promise.allSettled([
          fetch(`${BASE_URL}${API_PREFIX}categories/`, { headers }),
          fetch(`${BASE_URL}${API_PREFIX}age-levels/`, { headers }),
        ]);

        if (cancelled) return;

        // Categories are required to create a course.
        if (categoryResult.status === "rejected") {
          throw new Error(
            "Could not connect to the categories endpoint. Please try again."
          );
        }

        const categoryResponse = categoryResult.value;

        if (!categoryResponse.ok) {
          throw new Error(
            `Unable to load categories (HTTP ${categoryResponse.status}).`
          );
        }

        const categoryData = await categoryResponse.json();
        const categoryList = Array.isArray(categoryData)
          ? categoryData
          : categoryData.results || [];

        if (cancelled) return;

        setCategories(categoryList);

        // Age level is optional, so its failure should not block course creation.
        if (ageLevelResult.status === "fulfilled") {
          const ageResponse = ageLevelResult.value;

          if (ageResponse.ok) {
            const ageData = await ageResponse.json();

            if (!cancelled) {
              setAgeLevels(
                Array.isArray(ageData) ? ageData : ageData.results || []
              );
            }
          } else {
            setOptionsWarning(
              "Age levels could not be loaded. You can still create a course without selecting one. Please verify the age-level API URL."
            );
          }
        } else {
          setOptionsWarning(
            "Age levels could not be loaded. You can still create a course without selecting one."
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load course options:", error);
          setApiError(
            error.message || "Unable to load the course form. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    };

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setApiError("");
    setSuccessMessage("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setErrors((previous) => ({ ...previous, image: "" }));
    setApiError("");
    setSuccessMessage("");

    if (!file.type.startsWith("image/")) {
      setErrors((previous) => ({
        ...previous,
        image: "Please select a valid image file.",
      }));

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        image: "Image size must not exceed 5 MB.",
      }));

      event.target.value = "";
      return;
    }

    setFormData((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: null,
    }));

    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setErrors((previous) => ({
      ...previous,
      image: "",
    }));
  };

  const validateForm = () => {
    const validationErrors = {};

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      validationErrors.title = "Course title is required.";
    } else if (title.length > 40) {
      validationErrors.title =
        "Course title cannot exceed 40 characters.";
    }

    if (!formData.category) {
      validationErrors.category = "Please select a category.";
    }

    if (!description) {
      validationErrors.description = "Course description is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const getApiErrorMessage = (data, statusCode) => {
    if (data?.detail && typeof data.detail === "string") {
      return data.detail;
    }

    if (typeof data === "string") {
      return data;
    }

    if (data && typeof data === "object") {
      const messages = Object.entries(data)
        .map(([field, value]) => {
          const message = Array.isArray(value)
            ? value.join(" ")
            : typeof value === "string"
              ? value
              : "";

          if (!message) return "";

          const label =
            field === "non_field_errors"
              ? ""
              : `${field.replaceAll("_", " ")}: `;

          return `${label}${message}`;
        })
        .filter(Boolean);

      if (messages.length) return messages.join(" ");
    }

    if (statusCode === 401 || statusCode === 403) {
      return "You are not authorized to create courses. Please check your login and admin permissions.";
    }

    return `Unable to create course (HTTP ${statusCode}). Please try again.`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    if (!token) {
      setApiError("Your session has expired. Please sign in again.");
      return;
    }

    const payload = new FormData();

    payload.append("title", formData.title.trim());
    payload.append("category", formData.category);
    payload.append("description", formData.description.trim());
    payload.append("is_active", String(formData.is_active));

    // Age level is optional in the Django model.
    if (formData.age_level) {
      payload.append("age_level", formData.age_level);
    }

    if (formData.image) {
      payload.append("image", formData.image);
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${BASE_URL}${API_PREFIX}courses/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
          body: payload,
        }
      );

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        setApiError(
          getApiErrorMessage(responseData, response.status)
        );
        return;
      }

      const createdTitle =
        responseData?.title || formData.title.trim();

      setSuccessMessage(
        `Course "${createdTitle}" was created successfully.`
      );

      setFormData({
        title: "",
        category: "",
        description: "",
        age_level: "",
        is_active: true,
        image: null,
      });

      setImagePreview("");
      setErrors({});

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Course creation failed:", error);

      setApiError(
        "Could not connect to the server. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-gray-200 focus:border-[#91ADC6] focus:ring-[#91ADC6]/20"
    }`;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F7F8FA", color: COLORS.navy }}
    >
      {/* Desktop sidebar: same layout as AddCategoryPage.jsx */}
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

      {/* Main page */}
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
              <button
                type="button"
                onClick={() => navigate("/admin/courses")}
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
              >
                <FaArrowLeft size={12} />
                Back to Courses
              </button>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Add Course
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Create a course for Earlystart learners. Provide the
                course details, choose a category and optionally assign
                an age level and cover image.
              </p>
            </div>

            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: COLORS.yellow }}
            >
              <FaBookOpen size={23} color={COLORS.navy} />
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div
              role="status"
              className="mb-6 flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <FaCheckCircle
                className="mt-1 shrink-0 text-emerald-600"
                size={18}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-800">
                  Course created successfully
                </p>

                <p className="mt-1 break-words text-sm text-emerald-700">
                  {successMessage}
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/admin/courses")}
                  className="mt-3 text-sm font-bold text-emerald-800 underline"
                >
                  View all courses
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSuccessMessage("")}
                aria-label="Dismiss success message"
                className="text-emerald-700"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* API error */}
          {apiError && (
            <div
              role="alert"
              className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <span>{apiError}</span>
              <button
                type="button"
                onClick={() => setApiError("")}
                aria-label="Dismiss error"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Optional age-level warning */}
          {optionsWarning && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {optionsWarning}
            </div>
          )}

          {loadingOptions && (
            <div
              className="mb-6 rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-500"
              role="status"
            >
              Loading categories and age levels...
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
              {/* Main form */}
              <div className="min-w-0 space-y-6 xl:col-span-2">
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-6 border-b border-gray-100 pb-5">
                    <h2 className="text-base font-bold">
                      Course Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter the basic details for this course.
                    </p>
                  </div>

                  {/* Course title */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor="title"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Course Title <span className="text-red-500">*</span>
                      </label>

                      <span
                        className={`text-xs ${
                          formData.title.length >= 40
                            ? "text-amber-700"
                            : "text-gray-400"
                        }`}
                      >
                        {formData.title.length}/40
                      </span>
                    </div>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      maxLength={40}
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Introduction to Python"
                      className={inputClass("title")}
                      aria-invalid={Boolean(errors.title)}
                    />

                    {errors.title && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <label
                      htmlFor="category"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={loadingOptions || categories.length === 0}
                      className={inputClass("category")}
                      aria-invalid={Boolean(errors.category)}
                    >
                      <option value="">
                        {loadingOptions
                          ? "Loading categories..."
                          : categories.length
                            ? "Select a category"
                            : "No categories available"}
                      </option>

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>

                    {errors.category && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.category}
                      </p>
                    )}

                    {!loadingOptions && categories.length === 0 && (
                      <p className="mt-2 text-xs text-amber-700">
                        Create a category before adding a course.
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      rows={7}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe what students will learn in this course..."
                      className={`${inputClass("description")} resize-y`}
                      aria-invalid={Boolean(errors.description)}
                    />

                    {errors.description && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      Write a clear description that helps parents and
                      learners understand the course.
                    </p>
                  </div>
                </section>

                {/* Age level and status */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-6 border-b border-gray-100 pb-5">
                    <h2 className="text-base font-bold">
                      Audience and Availability
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose the intended age group and course status.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="age_level"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Age Level{" "}
                      <span className="font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>

                    <select
                      id="age_level"
                      name="age_level"
                      value={formData.age_level}
                      onChange={handleChange}
                      disabled={loadingOptions || ageLevels.length === 0}
                      className={inputClass("age_level")}
                    >
                      <option value="">
                        {ageLevels.length
                          ? "Select an age level"
                          : "No age levels available"}
                      </option>

                      {ageLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.title ||
                            level.name ||
                            `Age level ${level.id}`}
                        </option>
                      ))}
                    </select>

                    <p className="mt-2 text-xs text-gray-400">
                      Leave this empty if the course does not need a
                      specific age-level assignment.
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Active Course
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Enable this course according to your publishing rules.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="h-5 w-5 shrink-0 accent-yellow-400"
                    />
                  </label>
                </section>

                {/* Image upload */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-5">
                    <h2 className="text-base font-bold">
                      Course Cover Image
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload an optional image to visually identify the course.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="overflow-hidden rounded-2xl border border-gray-200">
                      <div className="relative flex min-h-48 items-center justify-center bg-gray-50 p-3">
                        <img
                          src={imagePreview}
                          alt="Course cover preview"
                          className="max-h-72 w-full rounded-xl object-contain"
                        />

                        <button
                          type="button"
                          onClick={removeImage}
                          aria-label="Remove selected image"
                          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50"
                        >
                          <FaTimes />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 p-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-700">
                            {formData.image?.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {formData.image
                              ? `${(
                                  formData.image.size /
                                  (1024 * 1024)
                                ).toFixed(2)} MB`
                              : ""}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm font-semibold"
                          style={{ color: COLORS.navy }}
                        >
                          Change image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition hover:bg-gray-50"
                      style={{ borderColor: COLORS.blue }}
                    >
                      <span
                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: "#EAF0F5" }}
                      >
                        <FaUpload
                          size={20}
                          style={{ color: COLORS.navy }}
                        />
                      </span>

                      <span className="text-sm font-bold text-gray-800">
                        Click to upload an image
                      </span>

                      <span className="mt-2 text-xs text-gray-500">
                        Select an image from your device
                      </span>

                      <span className="mt-2 text-xs text-gray-400">
                        Maximum file size: 5 MB
                      </span>
                    </button>
                  )}

                  {errors.image && (
                    <p className="mt-3 text-xs text-red-600">
                      {errors.image}
                    </p>
                  )}
                </section>
              </div>

              {/* Course preview and tips */}
              <div className="min-w-0 space-y-6">
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div
                    className="p-5"
                    style={{
                      backgroundColor: COLORS.navy,
                      color: COLORS.white,
                    }}
                  >
                    <h2 className="text-base font-bold">Course Preview</h2>
                    <p className="mt-1 text-sm text-white/75">
                      Preview the details as you enter them.
                    </p>
                  </div>

                  <div className="p-5">
                    <div
                      className="mb-4 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl"
                      style={{
                        backgroundColor: imagePreview
                          ? "#F3F4F6"
                          : "#EAF0F5",
                      }}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Course preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaImage
                          size={34}
                          style={{ color: COLORS.blue }}
                        />
                      )}
                    </div>

                    <h3 className="break-words text-lg font-bold">
                      {formData.title.trim() || "Course title"}
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-500">
                      {formData.description.trim() ||
                        "Your course description will appear here as you type."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                        style={{
                          backgroundColor: "#FFF8D6",
                          color: COLORS.navy,
                        }}
                      >
                        <FaBookOpen size={11} />
                        {categories.find(
                          (category) =>
                            String(category.id) === String(formData.category)
                        )?.title || "Course category"}
                      </span>

                      {formData.age_level && (
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                          {ageLevels.find(
                            (level) =>
                              String(level.id) === String(formData.age_level)
                          )?.title ||
                            ageLevels.find(
                              (level) =>
                                String(level.id) === String(formData.age_level)
                            )?.name ||
                            "Age level selected"}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                          formData.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {formData.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-bold">Before you save</h2>

                  <ul className="mt-4 space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle
                        className="mt-0.5 shrink-0"
                        style={{ color: COLORS.blue }}
                      />
                      Use a clear title of no more than 40 characters.
                    </li>

                    <li className="flex items-start gap-2">
                      <FaCheckCircle
                        className="mt-0.5 shrink-0"
                        style={{ color: COLORS.blue }}
                      />
                      Assign the course to the correct category.
                    </li>

                    <li className="flex items-start gap-2">
                      <FaCheckCircle
                        className="mt-0.5 shrink-0"
                        style={{ color: COLORS.blue }}
                      />
                      Describe the learning objectives clearly.
                    </li>

                    <li className="flex items-start gap-2">
                      <FaCheckCircle
                        className="mt-0.5 shrink-0"
                        style={{ color: COLORS.blue }}
                      />
                      Select an age level when applicable.
                    </li>
                  </ul>
                </section>
              </div>
            </div>

            {/* Form actions */}
            <div className="mt-6 flex flex-col-reverse justify-end gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:px-6">
              <button
                type="button"
                onClick={() => navigate("/admin/courses")}
                disabled={submitting}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingOptions ||
                  categories.length === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: COLORS.yellow,
                  color: COLORS.navy,
                }}
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating course...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
