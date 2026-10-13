
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config";

const initialForm = {
  title: "",
  description: "",
  photo: null,
  start_date: "",
  end_date: "",
  prize: "",
  status: true,
  sponsor: "",
  caveat: "",
  plan: "Pro",
};

function toLocalDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString().slice(0, 16);
}

export default function CompetitionForm({ competitionId = null }) {
  const isEditing = Boolean(competitionId);
  const navigate = useNavigate();
  const { token } = useAuth();

  const base = `${BASE_URL}/api/v1/rest-auth/admin/`;

  const [form, setForm] = useState(initialForm);
  const [sponsors, setSponsors] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Your session is unavailable. Please sign in again.");
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const sponsorResponse = await fetch(`${base}sponsors/`, {
          headers: { Authorization: `Token ${token}` },
        });

        const sponsorData = await sponsorResponse.json();

        if (!sponsorResponse.ok) {
          throw new Error("Unable to load sponsors.");
        }

        if (!cancelled) {
          setSponsors(
            Array.isArray(sponsorData)
              ? sponsorData
              : sponsorData.results || []
          );
        }

        if (isEditing) {
          const response = await fetch(
            `${base}competitions/${competitionId}/`,
            { headers: { Authorization: `Token ${token}` } }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.detail || "Unable to load competition.");
          }

          if (!cancelled) {
            setForm({
              title: data.title || "",
              description: data.description || "",
              photo: null,
              start_date: toLocalDateTime(data.start_date),
              end_date: toLocalDateTime(data.end_date),
              prize: data.prize || "",
              status: Boolean(data.status),
              sponsor: data.sponsor ?? "",
              caveat: data.caveat || "",
              plan: data.plan || "Pro",
            });
            setCurrentPhoto(data.photo || "");
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [token, competitionId, isEditing]);

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

  const renderError = (name) => {
    const value = fieldErrors[name];
    if (!value) return null;

    return (
      <p className="mt-1 text-sm text-red-600">
        {Array.isArray(value) ? value.join(" ") : value}
      </p>
    );
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (!form.title.trim() || form.title.length > 40) {
      setError("Enter a title with no more than 40 characters.");
      return;
    }

    if (
      form.start_date &&
      form.end_date &&
      new Date(form.end_date) <= new Date(form.start_date)
    ) {
      setError("End date must be later than start date.");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("prize", form.prize.trim());
    payload.append("status", String(form.status));
    payload.append("plan", form.plan);

    payload.append(
      "start_date",
      form.start_date ? new Date(form.start_date).toISOString() : ""
    );
    payload.append(
      "end_date",
      form.end_date ? new Date(form.end_date).toISOString() : ""
    );
    payload.append("caveat", form.caveat.trim());

    if (form.sponsor !== "") {
      payload.append("sponsor", form.sponsor);
    } else {
      payload.append("sponsor", "");
    }

    if (form.photo) payload.append("photo", form.photo);

    try {
      setSaving(true);

      const response = await fetch(
        isEditing
          ? `${base}competitions/${competitionId}/`
          : `${base}competitions/`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { Authorization: `Token ${token}` },
          body: payload,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data && typeof data === "object" && !data.detail) {
          setFieldErrors(data);
          throw new Error("Please correct the highlighted fields.");
        }
        throw new Error(data.detail || "Unable to save competition.");
      }

      navigate("/admin/competitions", {
        state: {
          message: isEditing
            ? "Competition updated successfully."
            : "Competition created successfully.",
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={() => navigate("/admin/competitions")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600"
      >
        <FaArrowLeft /> Back to Competitions
      </button>

      <h1 className="text-2xl font-bold text-[#343652]">
        {isEditing ? "Edit Competition" : "Add Competition"}
      </h1>
      <p className="mb-6 mt-2 text-sm text-gray-500">
        Manage the competition details, sponsor, schedule, and prize.
      </p>

      {error && (
        <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="text-sm font-semibold">
              Competition Title *
            </label>
            <input
              id="title"
              name="title"
              required
              maxLength={40}
              value={form.title}
              onChange={handleChange}
              className={inputClass}
            />
            {renderError("title")}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="text-sm font-semibold">
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
            />
            {renderError("description")}
          </div>

          <div>
            <label htmlFor="start_date" className="text-sm font-semibold">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="datetime-local"
              value={form.start_date}
              onChange={handleChange}
              className={inputClass}
            />
            {renderError("start_date")}
          </div>

          <div>
            <label htmlFor="end_date" className="text-sm font-semibold">
              End Date
            </label>
            <input
              id="end_date"
              name="end_date"
              type="datetime-local"
              value={form.end_date}
              onChange={handleChange}
              className={inputClass}
            />
            {renderError("end_date")}
          </div>

          <div>
            <label htmlFor="prize" className="text-sm font-semibold">
              Prize *
            </label>
            <input
              id="prize"
              name="prize"
              required
              maxLength={50}
              value={form.prize}
              onChange={handleChange}
              className={inputClass}
            />
            {renderError("prize")}
          </div>

          <div>
            <label htmlFor="sponsor" className="text-sm font-semibold">
              Sponsor
            </label>
            <select
              id="sponsor"
              name="sponsor"
              value={form.sponsor}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">No sponsor</option>
              {sponsors.map((sponsor) => (
                <option key={sponsor.id} value={sponsor.id}>
                  {sponsor.name}
                </option>
              ))}
            </select>
            {renderError("sponsor")}
          </div>

          <div>
            <label htmlFor="plan" className="text-sm font-semibold">
              Plan
            </label>
            <input
              id="plan"
              name="plan"
              maxLength={20}
              required
              value={form.plan}
              onChange={handleChange}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter a value accepted by your PLANS choices.
            </p>
            {renderError("plan")}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="caveat" className="text-sm font-semibold">
              Caveat / Additional Conditions
            </label>
            <textarea
              id="caveat"
              name="caveat"
              maxLength={300}
              rows={3}
              value={form.caveat}
              onChange={handleChange}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400">
              {form.caveat.length}/300 characters
            </p>
            {renderError("caveat")}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="photo" className="text-sm font-semibold">
              Competition Photo
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className={inputClass}
            />
            {currentPhoto && !form.photo && (
              <img
                src={currentPhoto}
                alt="Current competition"
                className="mt-3 h-36 w-56 rounded-xl object-cover"
              />
            )}
            {form.photo && (
              <p className="mt-2 text-xs text-gray-500">{form.photo.name}</p>
            )}
            {renderError("photo")}
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
            className="h-4 w-4 accent-[#343652]"
          />
          <span>
            <span className="block text-sm font-semibold">Competition active</span>
            <span className="block text-xs text-gray-500">
              Enable or disable the competition.
            </span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/competitions")}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBD22F] px-5 py-3 text-sm font-bold text-[#343652] disabled:opacity-60"
          >
            <FaSave />
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Competition"}
          </button>
        </div>
      </form>
    </div>
  );
}
