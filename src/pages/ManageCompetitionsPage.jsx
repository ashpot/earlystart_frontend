
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlus, FaSearch, FaEdit, FaTrash, FaUsers,
  FaClipboardCheck, FaScroll, FaTrophy,
} from "react-icons/fa";
import CompetitionAdminLayout from "../components/dashboard/shared/CompetitionAdminLayout";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

export default function ManageCompetitionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.message || "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [plan, setPlan] = useState("");
  const [page, setPage] = useState(1);

  const endpoint = `${BASE_URL}/api/v1/rest-auth/admin/competitions/`;
  const pageSize = 10;

  const fetchItems = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Your session is unavailable. Please sign in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter) params.set("status", statusFilter);
      if (plan) params.set("plan", plan);

      const response = await fetch(
        `${endpoint}?${params.toString()}`,
        { headers: { Authorization: `Token ${token}` } }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Unable to load competitions.");
      }

      setItems(Array.isArray(data) ? data : data.results || []);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, endpoint, search, statusFilter, plan]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (item) => {
    if (!window.confirm(
      `Delete "${item.title}"? Its participants, rules, and judging criteria will also be deleted.`
    )) return;

    try {
      const response = await fetch(`${endpoint}${item.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to delete competition.");
      }

      setItems((previous) => previous.filter((row) => row.id !== item.id));
      setNotice("Competition deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const visibleItems = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <CompetitionAdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm text-gray-500">Content Management</p>
          <h1 className="text-2xl font-bold">Competitions</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage competitions, participants, rules, and judging criteria.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/competitions/add")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBD22F] px-5 py-3 text-sm font-bold"
        >
          <FaPlus /> Add Competition
        </button>
      </div>

      {notice && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {notice}
          <button onClick={() => setNotice("")} className="ml-3 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={fetchItems} className="ml-3 underline">Retry</button>
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Total Competitions", items.length],
          ["Active", items.filter((item) => item.status).length],
          ["Total Participants", items.reduce(
            (sum, item) => sum + (item.total_competitors || 0), 0
          )],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search competitions..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <input
          value={plan}
          onChange={(event) => setPlan(event.target.value)}
          placeholder="Filter by plan"
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading competitions...</div>
        ) : visibleItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No competitions found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Competition</th>
                    <th className="px-5 py-4">Sponsor</th>
                    <th className="px-5 py-4">Prize</th>
                    <th className="px-5 py-4">Plan</th>
                    <th className="px-5 py-4">Participants</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.photo ? (
                            <img src={item.photo} alt="" className="h-12 w-16 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100">
                              <FaTrophy className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="mt-1 max-w-xs truncate text-xs text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">{item.sponsor_name || "—"}</td>
                      <td className="px-5 py-4">{item.prize}</td>
                      <td className="px-5 py-4">{item.plan}</td>
                      <td className="px-5 py-4">{item.total_competitors ?? 0}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {item.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button title="View participants" onClick={() => navigate(`/admin/competitions/${item.id}/participants`)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                            <FaUsers />
                          </button>
                          <button title="Manage rules and judging" onClick={() => navigate(`/admin/competitions/${item.id}/settings`)} className="rounded-lg p-2 text-purple-600 hover:bg-purple-50">
                            <FaClipboardCheck />
                          </button>
                          <button title="Edit competition" onClick={() => navigate(`/admin/competitions/edit/${item.id}`)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                            <FaEdit />
                          </button>
                          <button title="Delete competition" onClick={() => handleDelete(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, items.length)} of {items.length}
              </p>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Previous</button>
                <span className="text-sm text-gray-500">Page {page} of {pageCount}</span>
                <button disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </CompetitionAdminLayout>
  );
}
