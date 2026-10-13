
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
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
  black: "#000000",
};

export default function AddCategoryPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  // Release temporary image preview URLs when they are no longer needed.
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
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

    setErrors((previous) => ({
      ...previous,
      image: "",
    }));

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
      validationErrors.title = "Category title is required.";
    } else if (title.length > 40) {
      validationErrors.title =
        "Category title cannot exceed 40 characters.";
    }

    if (!description) {
      validationErrors.description =
        "Category description is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const getApiErrorMessage = (data) => {
    if (!data) return "Unable to create category. Please try again.";

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (typeof data === "string") {
      return data;
    }

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

    return messages.join(" ") || "Unable to create category.";
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
    payload.append("description", formData.description.trim());

    if (formData.image) {
      payload.append("image", formData.image);
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/rest-auth/admin/categories/`,
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
        if (response.status === 401 || response.status === 403) {
          setApiError(
            "You are not authorized to create categories. Please check your login and admin permissions."
          );
        } else {
          setApiError(getApiErrorMessage(responseData));
        }

        return;
      }

      setSuccessMessage(
        `Category "${responseData?.title || formData.title.trim()}" was created successfully.`
      );

      setFormData({
        title: "",
        description: "",
        image: null,
      });

      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setErrors({});
    } catch (error) {
      console.error("Category creation failed:", error);

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
      {/* Desktop sidebar */}
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
                onClick={() => navigate("/admin/categories")}
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
              >
                <FaArrowLeft size={12} />
                Back to Categories
              </button>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Add Category
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Create a category to organize Earlystart learning content.
                Add a clear title, description, and optional cover image.
              </p>
            </div>

            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: COLORS.yellow }}
            >
              <FaImage size={23} color={COLORS.navy} />
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
                  Category created successfully
                </p>
                <p className="mt-1 break-words text-sm text-emerald-700">
                  {successMessage}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/admin/categories")}
                  className="mt-3 text-sm font-bold text-emerald-800 underline"
                >
                  View all categories
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
              className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
              {/* Main form */}
              <div className="min-w-0 space-y-6 xl:col-span-2">
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-6 border-b border-gray-100 pb-5">
                    <h2 className="text-base font-bold">
                      Category Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter the basic details for this category.
                    </p>
                  </div>

                  {/* Title */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor="title"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Category Title <span className="text-red-500">*</span>
                      </label>

                      <span
                        className={`text-xs ${
                          formData.title.length > 40
                            ? "text-red-600"
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
                      placeholder="e.g. Programming, Robotics, Artificial Intelligence"
                      className={inputClass("title")}
                      aria-invalid={Boolean(errors.title)}
                      aria-describedby={
                        errors.title ? "title-error" : undefined
                      }
                    />

                    {errors.title && (
                      <p
                        id="title-error"
                        className="mt-2 text-xs text-red-600"
                      >
                        {errors.title}
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
                      placeholder="Describe this category and the learning activities or courses students will find in it..."
                      className={`${inputClass("description")} resize-y`}
                      aria-invalid={Boolean(errors.description)}
                      aria-describedby={
                        errors.description
                          ? "description-error"
                          : undefined
                      }
                    />

                    {errors.description && (
                      <p
                        id="description-error"
                        className="mt-2 text-xs text-red-600"
                      >
                        {errors.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      Write a clear description that helps parents and
                      learners understand the category.
                    </p>
                  </div>
                </section>

                {/* Image upload */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-5">
                    <h2 className="text-base font-bold">
                      Category Cover Image
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload an image to visually identify this category.
                      This field is optional.
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
                          alt="Category cover preview"
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

              {/* Sidebar summary */}
              <div className="min-w-0 space-y-6">
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div
                    className="p-5"
                    style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                  >
                    <h2 className="text-base font-bold">Category Preview</h2>
                    <p className="mt-1 text-sm text-white/75">
                      Preview your category details.
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
                          alt="Category preview"
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
                      {formData.title.trim() || "Category title"}
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-500">
                      {formData.description.trim() ||
                        "Your category description will appear here as you type."}
                    </p>

                    <div
                      className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                      style={{
                        backgroundColor: "#FFF8D6",
                        color: COLORS.navy,
                      }}
                    >
                      <FaImage size={11} />
                      Learning Category
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
                      Explain what learners can expect from this category.
                    </li>

                    <li className="flex items-start gap-2">
                      <FaCheckCircle
                        className="mt-0.5 shrink-0"
                        style={{ color: COLORS.blue }}
                      />
                      Choose a relevant, high-quality image if available.
                    </li>
                  </ul>
                </section>
              </div>
            </div>

            {/* Form actions */}
            <div className="mt-6 flex flex-col-reverse justify-end gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:px-6">
              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                disabled={submitting}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: COLORS.yellow,
                  color: COLORS.navy,
                }}
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating category...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Create Category
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
