
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
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
  white: "#FFFFFF",
};

export default function CategoryEditPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const loadCategory = useCallback(async () => {
    if (!token) {
      setError("Your session could not be found. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/rest-auth/admin/categories/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || `Unable to load category (HTTP ${response.status}).`
        );
      }

      setCategory(data);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setImagePreview(data.image_url || data.image || "");
    } catch (err) {
      console.error("Failed to load category:", err);
      setError(err.message || "Unable to load this category.");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  useEffect(() => {
    if (!newImage) return undefined;

    const objectUrl = URL.createObjectURL(newImage);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [newImage]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    setNewImage(file);
    setErrors((previous) => ({ ...previous, image: "" }));
    setError("");
    setSuccess("");
  };

  const removeNewImage = () => {
    setNewImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Restore the image currently stored by the server.
    setImagePreview(category?.image_url || category?.image || "");
  };

  const validate = () => {
    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Category title is required.";
    } else if (title.trim().length > 40) {
      nextErrors.title = "Title cannot exceed 40 characters.";
    }

    if (!description.trim()) {
      nextErrors.description = "Category description is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validate()) return;

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    const payload = new FormData();
    payload.append("title", title.trim());
    payload.append("description", description.trim());

    if (newImage) {
      payload.append("image", newImage);
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/rest-auth/admin/categories/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
          body: payload,
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detail =
          data?.detail ||
          Object.entries(data || {})
            .map(([field, messages]) => {
              const message = Array.isArray(messages)
                ? messages.join(" ")
                : String(messages);

              return `${field}: ${message}`;
            })
            .join(" ");

        throw new Error(
          detail || `Unable to update category (HTTP ${response.status}).`
        );
      }

      setCategory(data);
      setTitle(data.title || title.trim());
      setDescription(data.description || description.trim());
      setNewImage(null);
      setImagePreview(data.image_url || data.image || "");
      setSuccess("Category updated successfully.");
    } catch (err) {
      console.error("Failed to update category:", err);
      setError(err.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#91ADC6] focus:ring-2 focus:ring-[#91ADC6]/20";

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ color: COLORS.navy }}>
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

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            <FaArrowLeft size={12} />
            Back to Categories
          </button>

          <div className="mb-7">
            <h1 className="text-2xl font-bold sm:text-3xl">Edit Category</h1>
            <p className="mt-2 text-sm text-gray-500">
              Update the category details and cover image.
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
              {error.includes("not found") && (
                <button
                  type="button"
                  onClick={() => navigate("/admin/categories")}
                  className="ml-2 font-bold underline"
                >
                  Return to categories
                </button>
              )}
            </div>
          )}

          {success && (
            <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              {success}
              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                className="ml-2 font-bold underline"
              >
                Back to categories
              </button>
            </div>
          )}

          {loading ? (
            <div className="animate-pulse rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-5 h-5 w-48 rounded bg-gray-200" />
              <div className="mb-5 h-12 rounded bg-gray-100" />
              <div className="mb-5 h-36 rounded bg-gray-100" />
              <div className="h-10 w-36 rounded bg-gray-200" />
            </div>
          ) : category ? (
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
                <section className="min-w-0 space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7 xl:col-span-2">
                  <div className="border-b border-gray-100 pb-5">
                    <h2 className="font-bold">Category Information</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Make changes to the category below.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                        Category Title <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-400">
                        {title.length}/40
                      </span>
                    </div>

                    <input
                      id="title"
                      name="title"
                      value={title}
                      maxLength={40}
                      onChange={(event) => {
                        setTitle(event.target.value);
                        setErrors((previous) => ({ ...previous, title: "" }));
                      }}
                      className={inputClass}
                      placeholder="Enter category title"
                      aria-invalid={Boolean(errors.title)}
                    />

                    {errors.title && (
                      <p className="mt-2 text-xs text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      rows={7}
                      value={description}
                      onChange={(event) => {
                        setDescription(event.target.value);
                        setErrors((previous) => ({
                          ...previous,
                          description: "",
                        }));
                      }}
                      className={`${inputClass} resize-y`}
                      placeholder="Describe this category..."
                      aria-invalid={Boolean(errors.description)}
                    />

                    {errors.description && (
                      <p className="mt-2 text-xs text-red-600">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-gray-700">
                      Category Cover Image
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Leave the existing image unchanged or select a replacement.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Category cover"
                          className="max-h-72 w-full bg-gray-50 object-contain"
                        />

                        {newImage && (
                          <div className="flex items-center justify-between gap-3 border-t border-gray-100 p-3">
                            <span className="min-w-0 truncate text-xs text-gray-500">
                              {newImage.name}
                            </span>
                            <button
                              type="button"
                              onClick={removeNewImage}
                              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-red-600"
                            >
                              <FaTimes />
                              Undo replacement
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-dashed border-[#91ADC6] bg-gray-50 p-6 text-center">
                        <FaImage className="mx-auto text-2xl text-[#91ADC6]" />
                        <p className="mt-2 text-sm text-gray-600">
                          No category image uploaded.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <FaUpload />
                      {imagePreview ? "Replace image" : "Upload image"}
                    </button>

                    {errors.image && (
                      <p className="mt-2 text-xs text-red-600">{errors.image}</p>
                    )}
                  </div>

                  <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/categories")}
                      disabled={saving}
                      className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
                    >
                      <FaSave />
                      {saving ? "Saving changes..." : "Save Changes"}
                    </button>
                  </div>
                </section>

                <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="p-5" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                    <h2 className="font-bold">Live Preview</h2>
                    <p className="mt-1 text-sm text-white/75">
                      Preview your category details.
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl bg-[#EAF0F5]">
                      {imagePreview ? (
                        <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <FaImage size={34} color={COLORS.blue} />
                      )}
                    </div>

                    <h3 className="break-words text-lg font-bold">
                      {title.trim() || "Category title"}
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-500">
                      {description.trim() || "Your category description will appear here."}
                    </p>
                  </div>
                </section>
              </div>
            </form>
          ) : null}
        </main>
      </div>
    </div>
  );
}
