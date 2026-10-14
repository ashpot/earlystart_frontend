
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUsers,
} from "react-icons/fa";

import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const COLORS = {
  navy: "#343652",
  yellow: "#FBD22F",
};

const API = `${BASE_URL}/api/v1/rest-auth/admin`;

const audienceLabels = {
  all: "All Users",
  parents: "Parents",
  students: "Students",
  specific: "Specific User",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString();
}

function ResultCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{label}</p>
        <Icon style={{ color }} />
      </div>
      <p className="mt-3 text-2xl font-bold" style={{ color: COLORS.navy }}>
        {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
}

export default function NotificationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  useEffect(() => {
    let cancelled = false;

    async function fetchNotification() {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API}/notifications/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Unable to load notification details."
          );
        }

        if (!cancelled) {
          setNotification(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load notification details."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNotification();

    return () => {
      cancelled = true;
    };
  }, [id, token]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F7F8FA", color: COLORS.navy }}
    >
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

        <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/admin/notifications")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft /> Back to notifications
          </button>

          <div className="mb-7">
            <p className="mb-2 text-sm text-gray-500">Communication</p>
            <h1 className="text-2xl font-bold">Notification Details</h1>
            <p className="mt-2 text-sm text-gray-500">
              Review the notification content and FCM sending results.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500">
              Loading notification details...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
              <p className="font-semibold text-red-800">{error}</p>
              <button
                onClick={() => navigate("/admin/notifications")}
                className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold"
              >
                Return to notifications
              </button>
            </div>
          ) : notification ? (
            <div className="space-y-6">
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: COLORS.yellow }}
                    >
                      <FaBell className="text-xl" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">
                        {notification.title}
                      </h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Sent on {formatDate(notification.date_created)}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    {audienceLabels[notification.audience] ||
                      notification.audience ||
                      "Unknown audience"}
                  </span>
                </div>

                <div className="mt-6 rounded-xl bg-gray-50 p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Message body
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
                    {notification.body}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Recipient group</p>
                    <p className="mt-1 font-semibold">
                      {notification.receiver || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Eligible users</p>
                    <p className="mt-1 font-semibold">
                      {Number(
                        notification.recipient_count || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-lg font-bold">Sending results</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <ResultCard
                    label="Devices attempted"
                    value={notification.device_count}
                    icon={FaUsers}
                    color={COLORS.navy}
                  />
                  <ResultCard
                    label="Accepted by FCM"
                    value={notification.success_count}
                    icon={FaCheckCircle}
                    color="#15803D"
                  />
                  <ResultCard
                    label="Failed sends"
                    value={notification.failure_count}
                    icon={FaExclamationTriangle}
                    color="#DC2626"
                  />
                </div>

                <p className="mt-4 text-xs leading-5 text-gray-500">
                  FCM acceptance does not guarantee that a notification
                  was displayed on the recipient's device.
                </p>
              </section>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/admin/notifications/send")}
                  className="rounded-xl px-5 py-3 text-sm font-bold text-gray-900"
                  style={{ backgroundColor: COLORS.yellow }}
                >
                  Send another notification
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
