
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config";

const initialForm = {
  title: "",
  description: "",
  start_time: "",
  end_time: "",
  image: null,
  age_level: "",
  instructor: "",
  link: "",
  on: false,
  plan: "Free",
};

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const local = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 16);
}

export default function LiveClassForm({ liveClassId = null }) {
  const isEditing = Boolean(liveClassId);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [instructors, setInstructors] = useState([]);
  const [ageLevels, setAgeLevels] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const baseEndpoint = `${BASE_URL}/api/v1/rest-auth/admin/`;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Your session is unavailable. Please sign in again.");
      return;
    }

    let cancelled = false;

    async function loadFormData() {
      setLoading(true);
      setError("");

      try {
        // These endpoints reuse the existing admin directory APIs.
        const [instructorResponse, ageLevelResponse] = await Promise.all([
          fetch(
            `${baseEndpoint}users/?role=Instructor`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          ),
          fetch(
            `${baseEndpoint}age-levels/`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          ),
        ]);

        if (!instructorResponse.ok) {
          throw new Error("Unable to load instructors.");
        }

        if (!ageLevelResponse.ok) {
          throw new Error(
            "Unable to load age levels. Check your age-level API endpoint."
          );
        }

        const instructorData = await instructorResponse.json();
        const ageLevelData = await ageLevelResponse.json();

        const instructorList = Array.isArray(instructorData)
          ? instructorData
          : instructorData.results || [];

        const ageLevelList = Array.isArray(ageLevelData)
          ? ageLevelData
          : ageLevelData.results || [];

        if (!cancelled) {
          setInstructors(instructorList);
          setAgeLevels(ageLevelList);
        }

        if (isEditing) {
          const response = await fetch(
            `${baseEndpoint}live-classes/${liveClassId}/`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.detail || "Unable to load this live class."
            );
          }

          if (!cancelled) {
            setForm({
              title: data.title || "",
              description: data.description || "",
              start_time: toDateTimeLocal(data.start_time),
              end_time: toDateTimeLocal(data.end_time),
              image: null,
              age_level: data.age_level ?? "",
              instructor: data.instructor ?? "",
              link: data.link || "",
              on: Boolean(data.on),
              plan: data.plan || "Free",
            });

            setCurrentImage(data.image || "");
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFormData();

    return () => {
      cancelled = true;
    };
  }, [token, liveClassId, isEditing, baseEndpoint]);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files?.[0] || null
            : value,
    }));

    setFieldErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.start_time ||
      !form.end_time ||
      !form.instructor ||
      !form.link.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (new Date(form.end_time) <= new Date(form.start_time)) {
      setError("End time must be later than start time.");
      return;
    }

    const payload = new FormData();

    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append(
      "start_time",
      new Date(form.start_time).toISOString()
    );
    payload.append(
      "end_time",
      new Date(form.end_time).toISOString()
    );
    payload.append("instructor", form.instructor);
    payload.append("link", form.link.trim());
    payload.append("on", String(form.on));
    payload.append("plan", form.plan);

    if (form.age_level !== "") {
      payload.append("age_level", form.age_level);
    } else {
      payload.append("age_level", "");
    }

    if (form.image) {
      payload.append("image", form.image);
    }

    try {
      setSaving(true);

      const response = await fetch(
        isEditing
          ? `${baseEndpoint}live-classes/${liveClassId}/`
          : `${baseEndpoint}live-classes/`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: payload,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data && typeof data === "object" && !data.detail) {
          setFieldErrors(data);
          throw new Error("Please correct the highlighted fields.");
        }

        throw new Error(data.detail || "Unable to save the live class.");
      }

      navigate("/admin/live-classes", {
        state: {
          message: isEditing
            ? "Live class updated successfully."
            : "Live class created successfully.",
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  const renderError = (name) => {
    const value = fieldErrors[name];
    if (!value) return null;

    return (
      <p className="mt-1 text-sm text-red-600">
        {Array.isArray(value) ? value.join(" ") : value}
      </p>
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={() => navigate("/admin/live-classes")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
      >
        <FaArrowLeft /> Back to Live Classes
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#343652]">
          {isEditing ? "Edit Live Class" : "Add Live Class"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Configure the live session, schedule, instructor, and access plan.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="title">
              Class Title *
            </label>
            <input
              id="title"
              name="title"
              maxLength={40}
              required
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Introduction to Python"
            />
            <p className="mt-1 text-xs text-gray-400">
              {form.title.length}/40 characters
            </p>
            {renderError("title")}
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="description">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              className={inputClass}
              placeholder="Describe what students will learn..."
            />
            {renderError("description")}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="start_time">
              Start Time *
            </label>
            <input
              id="start_time"
              name="start_time"
              type="datetime-local"
              required
              value={form.start_time}
              onChange={handleChange}
              className={inputClass}
            />
            {renderError("start_time")}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="end_time">
              End Time *
            </label>
            <input
              id="end_time"
              name="end_time"
              type="datetime-local"
              required
              value={form.end_time}
              onChange={handleChange}
              className={inputClass}
            />
            {renderError("end_time")}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="instructor">
              Instructor *
            </label>
            <select
              id="instructor"
              name="instructor"
              required
              value={form.instructor}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {[
                    instructor.first_name,
                    instructor.last_name,
                  ].filter(Boolean).join(" ") || instructor.username}
                  {" "}(@{instructor.username})
                </option>
              ))}
            </select>
            {renderError("instructor")}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="age_level">
              Age Level
            </label>
            <select
              id="age_level"
              name="age_level"
              value={form.age_level}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">All age levels</option>
              {ageLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name || level.title || `Age Level ${level.id}`}
                </option>
              ))}
            </select>
            {renderError("age_level")}
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="link">
              Live Class Link *
            </label>
            <input
              id="link"
              name="link"
              type="url"
              required
              value={form.link}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://..."
            />
            {renderError("link")}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="plan">
              Subscription Plan
            </label>
            <select
              id="plan"
              name="plan"
              value={form.plan}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Free">Free</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            {renderError("plan")}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="image">
              Cover Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className={inputClass}
            />
            {currentImage && !form.image && (
              <img
                src={currentImage}
                alt="Current class cover"
                className="mt-3 h-28 w-44 rounded-lg object-cover"
              />
            )}
            {form.image && (
              <p className="mt-2 text-xs text-gray-500">
                Selected: {form.image.name}
              </p>
            )}
            {renderError("image")}
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <input
            type="checkbox"
            name="on"
            checked={form.on}
            onChange={handleChange}
            className="h-4 w-4 accent-[#343652]"
          />
          <span>
            <span className="block text-sm font-semibold text-gray-700">
              Enable live class
            </span>
            <span className="block text-xs text-gray-500">
              Turn this on to enable the class in the app. The scheduled live
              window is still determined by the start and end times.
            </span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/live-classes")}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBD22F] px-5 py-3 text-sm font-bold text-[#343652] hover:opacity-90 disabled:opacity-60"
          >
            <FaSave />
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Live Class"}
          </button>
        </div>
      </form>
    </div>
  );
}
