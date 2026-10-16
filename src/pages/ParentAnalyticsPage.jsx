import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaChild,
  FaCheckCircle,
  FaCreditCard,
  FaMoneyBillWave,
  FaRedo,
  FaSearch,
  FaUsers,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";

const API = `${BASE_URL}/api/v1/rest-auth`;

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
};

const getLocalDate = () => {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-NG");

const formatMoney = (value) =>
  `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

function SummaryCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 break-words text-2xl font-bold" style={{ color: COLORS.navy }}>
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "#EEF3F7", color: COLORS.navy }}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

export default function ParentAnalyticsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(getLocalDate());
  const [limit, setLimit] = useState("100");

  const [summary, setSummary] = useState({});
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const fetchParents = useCallback(async () => {
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
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      params.set("limit", limit);

      const response = await fetch(
        `${API}/analytics/parents/?${params.toString()}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Unable to load parent analytics."
        );
      }

      setSummary(data.summary || {});
      setParents(Array.isArray(data.parents) ? data.parents : []);
    } catch (err) {
      setError(err.message || "Unable to load parent analytics.");
    } finally {
      setLoading(false);
    }
  }, [token, search, startDate, endDate, limit]);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStartDate("");
    setEndDate(getLocalDate());
    setLimit("100");
  };

  const getName = (parent) =>
    parent.name?.trim() || parent.username || `Parent ${parent.id}`;

  const getInitials = (parent) =>
    getName(parent)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (/^https?:\/\//i.test(photo)) return photo;
    const base = String(BASE_URL || "").replace(/\/$/, "");
    return `${base}${photo.startsWith("/") ? photo : `/${photo}`}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F8FA", color: COLORS.navy }}>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden overflow-y-auto border-r border-gray-100 bg-white transition-[width] duration-300 md:block ${
          isSidebarCollapsed ? "w-20" : "w-60"
        }`}
      >
        {isSidebarCollapsed ? (
          <CollapsedSidebar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        ) : (
          <Sidebar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        )}
      </aside>

      <div className={`min-h-screen min-w-0 transition-[margin] duration-300 ${
        isSidebarCollapsed ? "md:ml-20" : "md:ml-60"
      }`}>
        <DashboardNavbar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />

        <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <button
                type="button"
                onClick={() => navigate("/admin/analytics")}
                className="mb-3 text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                ← Back to Analytics Overview
              </button>
              <h1 className="text-2xl font-bold sm:text-3xl">Parent Analytics</h1>
              <p className="mt-2 text-sm text-gray-500">
                Review parent accounts, linked children, subscription information, and payments.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchParents}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard title="Total parents" value={formatNumber(summary.total_parents)} icon={FaUsers} description="Parents matching the filters" />
            <SummaryCard title="Linked children" value={formatNumber(summary.total_children)} icon={FaChild} description="Children linked to the returned parents" />
            <SummaryCard title="Parents with children" value={formatNumber(summary.parents_with_children)} icon={FaUsers} description="Parents with at least one linked child" />
            <SummaryCard title="Completed payments" value={formatNumber(summary.completed_payments)} icon={FaCheckCircle} description="Successful payment records in the period" />
            <SummaryCard title="Pending payments" value={formatNumber(summary.pending_payments)} icon={FaCreditCard} description="Payments awaiting completion" />
            <SummaryCard title="Recorded revenue" value={formatMoney(summary.payment_revenue)} icon={FaMoneyBillWave} description="Completed parent payments in the period" />
          </div>

          <section className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <form onSubmit={handleSearch}>
              <label htmlFor="parent-search" className="mb-2 block text-sm font-semibold">
                Search parents
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="parent-search"
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Name, username, email, or phone..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 outline-none focus:border-blue-400"
                  />
                </div>
                <button type="submit" className="rounded-lg px-5 py-2.5 font-semibold" style={{ backgroundColor: COLORS.yellow }}>
                  Search
                </button>
              </div>
            </form>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label htmlFor="parents-start-date" className="mb-1.5 block text-sm text-gray-600">Registered from</label>
                <input
                  id="parents-start-date"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label htmlFor="parents-end-date" className="mb-1.5 block text-sm text-gray-600">Registered to</label>
                <input
                  id="parents-end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  max={getLocalDate()}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label htmlFor="parents-limit" className="mb-1.5 block text-sm text-gray-600">Maximum results</label>
                <select
                  id="parents-limit"
                  value={limit}
                  onChange={(event) => setLimit(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-blue-400"
                >
                  <option value="25">25 parents</option>
                  <option value="50">50 parents</option>
                  <option value="100">100 parents</option>
                  <option value="250">250 parents</option>
                  <option value="500">500 parents</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="button" onClick={resetFilters} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-medium hover:bg-gray-50">
                  Reset filters
                </button>
              </div>
            </div>
          </section>

          {error && (
            <div role="alert" className="mb-5 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button type="button" onClick={fetchParents} className="self-start font-semibold underline">Try again</button>
            </div>
          )}

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h2 className="text-lg font-bold">Parent directory</h2>
              <p className="mt-1 text-sm text-gray-500">Open a parent to view their children and payment history.</p>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-gray-500">Loading parent analytics...</div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Parent</th>
                      <th className="px-5 py-4">Registered</th>
                      <th className="px-5 py-4">Children</th>
                      <th className="px-5 py-4">Plan</th>
                      <th className="px-5 py-4">Paid until</th>
                      <th className="px-5 py-4">Completed payments</th>
                      <th className="px-5 py-4">Payment revenue</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parents.map((parent) => {
                      const photoUrl = getPhotoUrl(parent.photo);
                      return (
                        <tr key={parent.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt=""
                                  className="h-10 w-10 shrink-0 rounded-full border border-gray-100 object-cover"
                                  onError={(event) => { event.currentTarget.style.display = "none"; }}
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold" style={{ backgroundColor: "#EEF3F7", color: COLORS.navy }}>
                                  {getInitials(parent)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800">{getName(parent)}</p>
                                <p className="text-xs text-gray-500">@{parent.username}</p>
                                <p className="mt-1 text-xs text-gray-500">{parent.email || parent.phone || "No contact details"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-gray-600">{formatDate(parent.date_joined)}</td>
                          <td className="px-5 py-4 font-semibold">{formatNumber(parent.children_count)}</td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">{parent.plan || "Free"}</span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-gray-600">{formatDate(parent.paid_until)}</td>
                          <td className="px-5 py-4">{formatNumber(parent.completed_payments)}</td>
                          <td className="whitespace-nowrap px-5 py-4 font-medium">{formatMoney(parent.payment_revenue)}</td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/analytics/parents/${parent.id}`)}
                              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold hover:opacity-80"
                              style={{ backgroundColor: "#EEF3F7", color: COLORS.navy }}
                            >
                              View <FaArrowRight size={11} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {parents.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-5 py-12 text-center text-gray-500">
                          No parents match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
              Displaying {formatNumber(parents.length)} parent{parents.length === 1 ? "" : "s"}.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}