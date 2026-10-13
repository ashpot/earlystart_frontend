
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaUsers } from "react-icons/fa";
import CompetitionAdminLayout from "../components/dashboard/shared/CompetitionAdminLayout";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

export default function CompetitionParticipantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const endpoint =
    `${BASE_URL}/api/v1/rest-auth/admin/competitions/${id}/participants/`;

  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());

      const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to load participants.");
      }

      setCompetition(data.competition);
      setParticipants(data.participants || []);
      setCount(data.total_participants || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, token, search]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return (
    <CompetitionAdminLayout>
      <button
        onClick={() => navigate("/admin/competitions")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600"
      >
        <FaArrowLeft /> Back to Competitions
      </button>

      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-xl bg-[#E9EAEC] p-4">
          <FaUsers className="text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Competition Participants</h1>
          <p className="mt-1 text-sm text-gray-500">
            {competition?.title || "Registered students"}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total participants</p>
        <p className="mt-2 text-3xl font-bold">{count}</p>
      </div>

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search students..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm"
          />
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={fetchParticipants} className="ml-3 underline">Retry</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <p className="p-10 text-center text-gray-500">Loading participants...</p>
        ) : participants.length === 0 ? (
          <p className="p-10 text-center text-gray-500">No participants found.</p>
        ) : (
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Username</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {participants.map((student) => (
                <tr key={student.id}>
                  <td className="px-5 py-4 font-semibold">
                    {[student.first_name, student.last_name].filter(Boolean).join(" ") || "Name not provided"}
                  </td>
                  <td className="px-5 py-4">{student.username || "—"}</td>
                  <td className="px-5 py-4">{student.email || "—"}</td>
                  <td className="px-5 py-4">{student.phone || "—"}</td>
                  <td className="px-5 py-4">
                    {student.date_created
                      ? new Date(student.date_created).toLocaleString()
                      : "—"}
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
