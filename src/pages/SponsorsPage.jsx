
import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import CompetitionAdminLayout from "../components/dashboard/shared/CompetitionAdminLayout";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const EMPTY = { name: "", website: "", logo: null };

export default function SponsorsPage() {
  const { token } = useAuth();
  const endpoint = `${BASE_URL}/api/v1/rest-auth/admin/sponsors/`;

  const [sponsors, setSponsors] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [currentLogo, setCurrentLogo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchSponsors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());

      const response = await fetch(`${endpoint}?${params}`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Unable to load sponsors.");

      setSponsors(Array.isArray(data) ? data : data.results || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, token, search]);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const startAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setCurrentLogo("");
    setError("");
    setShowForm(true);
  };

  const startEdit = (sponsor) => {
    setEditingId(sponsor.id);
    setForm({ name: sponsor.name || "", website: sponsor.website || "", logo: null });
    setCurrentLogo(sponsor.logo || "");
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("website", form.website.trim());
    if (form.logo) payload.append("logo", form.logo);

    try {
      const response = await fetch(
        editingId ? `${endpoint}${editingId}/` : endpoint,
        {
          method: editingId ? "PATCH" : "POST",
          headers: { Authorization: `Token ${token}` },
          body: payload,
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data.detail ||
          Object.values(data).flat().join(" ") ||
          "Unable to save sponsor."
        );
      }

      setShowForm(false);
      setForm(EMPTY);
      setEditingId(null);
      await fetchSponsors();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sponsor) => {
    if (!window.confirm(
      `Delete sponsor "${sponsor.name}"? Linked competitions will remain but lose this sponsor.`
    )) return;

    try {
      const response = await fetch(`${endpoint}${sponsor.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to delete sponsor.");
      }

      await fetchSponsors();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CompetitionAdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Sponsors</h1>
          <p className="mt-2 text-sm text-gray-500">Manage competition sponsors and their logos.</p>
        </div>
        <button onClick={startAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBD22F] px-5 py-3 text-sm font-bold">
          <FaPlus /> Add Sponsor
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">{editingId ? "Edit Sponsor" : "Add Sponsor"}</h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Sponsor Name *</label>
              <input
                required
                maxLength={40}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Website</label>
              <input
                value={form.website}
                maxLength={50}
                onChange={(event) => setForm({ ...form, website: event.target.value })}
                placeholder="https://example.com"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Sponsor Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setForm({ ...form, logo: event.target.files?.[0] || null })}
                className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
              {currentLogo && !form.logo && (
                <img src={currentLogo} alt="Current sponsor logo" className="mt-3 h-16 max-w-40 object-contain" />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border px-5 py-3 text-sm">Cancel</button>
            <button disabled={saving} className="rounded-xl bg-[#FBD22F] px-5 py-3 text-sm font-bold disabled:opacity-60">
              {saving ? "Saving..." : editingId ? "Save Changes" : "Create Sponsor"}
            </button>
          </div>
        </form>
      )}

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search sponsors..."
        className="mb-5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
      />

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <p className="p-10 text-center text-gray-500">Loading sponsors...</p>
        ) : sponsors.length === 0 ? (
          <p className="p-10 text-center text-gray-500">No sponsors found.</p>
        ) : (
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Sponsor</th>
                <th className="px-5 py-4">Website</th>
                <th className="px-5 py-4">Competitions</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sponsors.map((sponsor) => (
                <tr key={sponsor.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {sponsor.logo && <img src={sponsor.logo} alt="" className="h-10 w-10 rounded-lg object-contain" />}
                      <span className="font-semibold">{sponsor.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {sponsor.website ? (
                      <a href={sponsor.website} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        {sponsor.website}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-4">{sponsor.competition_count ?? 0}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(sponsor)} title="Edit sponsor" className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><FaEdit /></button>
                      <button onClick={() => handleDelete(sponsor)} title="Delete sponsor" className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CompetitionAdminLayout>
  );
}
