
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CompetitionAdminLayout from "../components/dashboard/shared/CompetitionAdminLayout";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const BASE = `${BASE_URL}/api/v1/rest-auth/admin/`;

function ResourceSection({ title, endpoint, competitionId, withScore = false }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${endpoint}?competition=${competitionId}`,
        { headers: { Authorization: `Token ${token}` } }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Unable to load ${title.toLowerCase()}.`);
      }

      setItems(Array.isArray(data) ? data : data.results || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, competitionId, token, title]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const reset = () => {
    setText("");
    setScore(0);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) {
      setError("Enter a title before saving.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        competition: Number(competitionId),
        title: text.trim(),
      };
      if (withScore) payload.score = Number(score);

      const response = await fetch(
        editingId ? `${endpoint}${editingId}/` : endpoint,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data.detail ||
          Object.values(data).flat().join(" ") ||
          "Unable to save this record."
        );
      }

      reset();
      await fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setText(item.title || "");
    setScore(item.score ?? 0);
    setError("");
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title || "this record"}"?`)) return;

    try {
      const response = await fetch(`${endpoint}${item.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to delete record.");
      }

      if (editingId === item.id) reset();
      await fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">
        {withScore
          ? "Define the evaluation criteria and score for judges."
          : "Manage the rules participants must follow."}
      </p>

      {error && (
        <div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div>
          <label className="text-sm font-semibold">Title *</label>
          <textarea
            required
            maxLength={300}
            rows={2}
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            placeholder={withScore ? "Describe the judging criterion..." : "Enter a competition rule..."}
          />
        </div>

        {withScore && (
          <div>
            <label className="text-sm font-semibold">Score *</label>
            <input
              type="number"
              min="0"
              step="1"
              required
              value={score}
              onChange={(event) => setScore(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FBD22F] px-4 py-3 text-sm font-bold disabled:opacity-60"
          >
            <FaPlus />
            {saving ? "Saving..." : editingId ? "Save Changes" : "Add"}
          </button>

          {editingId && (
            <button type="button" onClick={reset} className="rounded-xl border px-4 py-3 text-sm">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 divide-y divide-gray-100">
        {loading ? (
          <p className="py-5 text-sm text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="py-5 text-sm text-gray-500">No records added yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="whitespace-pre-wrap break-words text-sm font-medium">
                  {item.title || "Untitled"}
                </p>
                {withScore && (
                  <p className="mt-1 text-xs text-gray-500">Score: {item.score}</p>
                )}
              </div>

              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  title="Edit"
                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                >
                  <FaEdit />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  title="Delete"
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function CompetitionSettingsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [competition, setCompetition] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCompetition() {
      try {
        const response = await fetch(`${BASE}competitions/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Unable to load competition.");
        }

        if (!cancelled) setCompetition(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    loadCompetition();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  return (
    <CompetitionAdminLayout>
      <button
        onClick={() => navigate("/admin/competitions")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600"
      >
        <FaArrowLeft /> Back to Competitions
      </button>

      <h1 className="text-2xl font-bold">Competition Rules & Judging</h1>
      <p className="mb-6 mt-2 text-sm text-gray-500">
        {competition?.title || (error ? error : `Competition #${id}`)}
      </p>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <ResourceSection
          title="Competition Rules"
          endpoint={`${BASE}competition-rules/`}
          competitionId={id}
        />
        <ResourceSection
          title="Judging Criteria"
          endpoint={`${BASE}judging-criteria/`}
          competitionId={id}
          withScore
        />
      </div>
    </CompetitionAdminLayout>
  );
}
