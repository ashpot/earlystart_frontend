import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaCalendarAlt,
  FaChild,
  FaCreditCard,
  FaMoneyBillWave,
  FaRedo,
  FaTrophy,
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

const formatPercent = (value) =>
  `${Number(value || 0).toFixed(1)}%`;

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

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
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
          {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "#EEF3F7", color: COLORS.navy }}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="border-b border-gray-100 p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
}

function EmptyRow({ colSpan, children }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-gray-500">
        {children}
      </td>
    </tr>
  );
}

export default function ParentDetailPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(getLocalDate());

  const [parent, setParent] = useState(null);
  const [summary, setSummary] = useState({});
  const [children, setChildren] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const fetchDetails = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Your session is unavailable. Please sign in again.");
      return;
    }

    if (!id || !/^\d+$/.test(id)) {
      setLoading(false);
      setError("The parent ID in this URL is invalid.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);

      const query = params.toString();
      const url =
        `${API}/analytics/parents/${id}/` + (query ? `?${query}` : "");

      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Unable to load parent details."
        );
      }

      setParent(data.parent || null);
      setSummary(data.summary || {});
      setChildren(Array.isArray(data.children) ? data.children : []);
      setPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch (err) {
      setError(err.message || "Unable to load parent details.");
    } finally {
      setLoading(false);
    }
  }, [token, id, startDate, endDate]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const resetFilters = () => {
    setStartDate("");
    setEndDate(getLocalDate());
  };

  const getName = () =>
    parent?.name?.trim() || parent?.username || `Parent ${id}`;

  const getInitials = () =>
    getName()
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

  const parentPhoto = getPhotoUrl(parent?.photo);

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
                onClick={() => navigate("/admin/analytics/parents")}
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                <FaArrowLeft size={12} />
                Back to Parent Analytics
              </button>
              <h1 className="text-2xl font-bold sm:text-3xl">Parent Details</h1>
              <p className="mt-2 text-sm text-gray-500">
                Parent account, linked children, engagement, and payment records.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDetails}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <section className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            {loading && !parent ? (
              <div className="py-8 text-center text-sm text-gray-500">Loading parent profile...</div>
            ) : parent ? (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {parentPhoto ? (
                  <img
                    src={parentPhoto}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-full border border-gray-100 object-cover"
                    onError={(event) => { event.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-xl font-bold" style={{ backgroundColor: "#EEF3F7", color: COLORS.navy }}>
                    {getInitials()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold">{getName()}</h2>
                  <p className="mt-1 text-sm text-gray-500">@{parent.username}</p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="mt-1 break-words text-sm font-medium">{parent.email || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="mt-1 text-sm font-medium">{parent.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Registered</p>
                      <p className="mt-1 text-sm font-medium">{formatDate(parent.date_joined)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account status</p>
                      <p className="mt-1 text-sm font-medium">{parent.account_status || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Subscription plan</p>
                      <p className="mt-1 text-sm font-medium">{parent.plan || "Free"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Paid until</p>
                      <p className="mt-1 text-sm font-medium">{formatDate(parent.paid_until)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          {error && (
            <div role="alert" className="mb-5 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button type="button" onClick={fetchDetails} className="self-start font-semibold underline">Try again</button>
            </div>
          )}

          <section className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FaCalendarAlt />
              <h2 className="font-semibold">Filter activity and payments</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label htmlFor="parent-detail-start" className="mb-1.5 block text-sm text-gray-600">From</label>
                <input
                  id="parent-detail-start"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label htmlFor="parent-detail-end" className="mb-1.5 block text-sm text-gray-600">To</label>
                <input
                  id="parent-detail-end"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  max={getLocalDate()}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex items-end">
                <button type="button" onClick={fetchDetails} disabled={loading} className="w-full rounded-lg px-4 py-2.5 font-semibold disabled:opacity-60" style={{ backgroundColor: COLORS.yellow }}>
                  Apply filters
                </button>
              </div>
              <div className="flex items-end">
                <button type="button" onClick={resetFilters} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-medium hover:bg-gray-50">
                  Reset filters
                </button>
              </div>
            </div>
          </section>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard title="Linked children" value={formatNumber(summary.children_count)} icon={FaChild} description="Student accounts linked to this parent" />
            <SummaryCard title="Lessons completed" value={formatNumber(summary.lessons_completed)} icon={FaBookOpen} description="Completed lesson-progress records" />
            <SummaryCard title="Lesson-test attempts" value={formatNumber(summary.lesson_test_attempts)} icon={FaUsers} description="Attempts across linked children" />
            <SummaryCard title="Quiz attempts" value={formatNumber(summary.quiz_attempts)} icon={FaTrophy} description="Attempts across linked children" />
            <SummaryCard title="Completed payments" value={formatNumber(summary.completed_payments)} icon={FaCreditCard} description="Successful payments in the selected period" />
            <SummaryCard title="Payment revenue" value={formatMoney(summary.payment_revenue)} icon={FaMoneyBillWave} description="Recorded completed payments" />
          </div>

          <section className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeading
              title="Linked children"
              description="Learning engagement and assessment performance for each child."
            />

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Child</th>
                    <th className="px-5 py-4">Age level</th>
                    <th className="px-5 py-4">Lessons completed</th>
                    <th className="px-5 py-4">Lesson-test average</th>
                    <th className="px-5 py-4">Quiz average</th>
                    <th className="px-5 py-4">Attempts</th>
                    <th className="px-5 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {children.map((child) => (
                    <tr key={child.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{child.name || child.username}</p>
                        <p className="text-xs text-gray-500">@{child.username}</p>
                      </td>
                      <td className="px-5 py-4">{child.age_level || "Not assigned"}</td>
                      <td className="px-5 py-4">{formatNumber(child.lessons_completed)}</td>
                      <td className="px-5 py-4">{formatPercent(child.lesson_test_average)}</td>
                      <td className="px-5 py-4">{formatPercent(child.quiz_average)}</td>
                      <td className="px-5 py-4">
                        <span className="block">{formatNumber(child.lesson_test_attempts)} lesson tests</span>
                        <span className="text-xs text-gray-500">{formatNumber(child.quiz_attempts)} quizzes</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">{formatDate(child.date_joined)}</td>
                    </tr>
                  ))}
                  {children.length === 0 && (
                    <EmptyRow colSpan={7}>No linked children found for this parent.</EmptyRow>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeading
              title="Payment history"
              description="Recorded transactions linked to this parent account."
            />

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Reference</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Subscription</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-5 py-4 font-medium">{payment.reference || `Payment #${payment.id}`}</td>
                      <td className="whitespace-nowrap px-5 py-4">{formatMoney(payment.amount)}</td>
                      <td className="px-5 py-4">{payment.subscription || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                          payment.paid && payment.status === "Completed"
                            ? "bg-green-50 text-green-700"
                            : payment.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                        }`}>
                          {payment.status || (payment.paid ? "Completed" : "Unpaid")}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">{formatDateTime(payment.date_added)}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <EmptyRow colSpan={5}>No payment records found for this period.</EmptyRow>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <button
            type="button"
            onClick={() => navigate("/admin/analytics/parents")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            <FaArrowLeft />
            Back to Parent Analytics
          </button>
        </main>
      </div>
    </div>
  );
}