
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaperPlane,
  FaSearch,
  FaUsers,
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
};

const API = `${BASE_URL}/api/v1/rest-auth/admin`;

const audienceOptions = [
  { value: "all", label: "All users", description: "All active users with registered devices." },
  { value: "parents", label: "Parents only", description: "Active users whose role is Parent." },
  { value: "students", label: "Students only", description: "Active users whose role is Student." },
  { value: "specific", label: "Specific user", description: "Send to one selected user's registered devices." },
];

export default function SendNotificationPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [confirmSend, setConfirmSend] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  useEffect(() => {
    if (audience !== "specific" || !token) {
      setUsers([]);
      return;
    }

    const search = userSearch.trim();

    if (search.length < 2) {
      setUsers([]);
      return;
    }

    let cancelled = false;

    async function searchUsers() {
      setLoadingUsers(true);

      try {
        const params = new URLSearchParams({
          search,
        });

        const response = await fetch(
          `${API}/users/?${params.toString()}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Unable to search users.");
        }

        const list = Array.isArray(data)
          ? data
          : data.results || data.users || [];

        if (!cancelled) {
          setUsers(
            list.filter((user) =>
              ["Parent", "Student", "Instructor", "Admin", "Support"].includes(user.role)
            )
          );
        }
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    searchUsers();

    return () => {
      cancelled = true;
    };
  }, [audience, userSearch, token]);

  async function handleSend(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!title.trim() || !body.trim()) {
      setError("Enter both a notification title and message.");
      return;
    }

    if (audience === "specific" && !selectedUser) {
      setError("Select the user who should receive this notification.");
      return;
    }

    setConfirmSend(true);
  }

  async function confirmAndSend() {
    setSending(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        audience,
      };

      if (audience === "specific") {
        payload.user_id = selectedUser.id;
      }

      const response = await fetch(`${API}/notifications/send/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to send notification.");
      }

      setResult(data);
      setConfirmSend(false);
    } catch (err) {
      setError(err.message || "An error occurred while sending.");
      setConfirmSend(false);
    } finally {
      setSending(false);
    }
  }

  const selectedAudience = audienceOptions.find(
    (option) => option.value === audience
  );

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
            <h1 className="text-2xl font-bold">Send Notification</h1>
            <p className="mt-2 text-sm text-gray-500">
              Send a push notification to Earlystart users.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <FaExclamationCircle className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="mt-1 text-green-700" />
                <div className="flex-1">
                  <h2 className="font-bold text-green-900">
                    Notification processing completed
                  </h2>
                  <p className="mt-1 text-sm text-green-800">
                    {result.message}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["Users", result.recipient_count],
                      ["Devices", result.device_count],
                      ["Accepted by FCM", result.success_count],
                      ["Failed", result.failure_count],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-white p-3">
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="mt-1 text-xl font-bold text-gray-800">
                          {Number(value || 0).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/admin/notifications")}
                    className="mt-4 rounded-lg border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-900"
                  >
                    View notification history
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSend}>
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold">Notification content</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Keep the message clear, useful, and easy to read on a phone.
                  </p>

                  <div className="mt-5 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Notification title *
                      </label>
                      <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        maxLength={300}
                        required
                        placeholder="e.g. A new lesson is ready!"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
                      />
                      <p className="mt-1 text-right text-xs text-gray-400">
                        {title.length}/300
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Message *
                      </label>
                      <textarea
                        value={body}
                        onChange={(event) => setBody(event.target.value)}
                        required
                        rows={5}
                        placeholder="Write the message users will receive..."
                        className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold">Choose recipients</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Select who should receive this notification.
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {audienceOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => {
                          setAudience(option.value);
                          setSelectedUser(null);
                          setUserSearch("");
                          setError("");
                        }}
                        className={`rounded-xl border p-4 text-left transition ${
                          audience === option.value
                            ? "border-[#91ADC6] bg-blue-50 ring-1 ring-[#91ADC6]"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">{option.label}</span>
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                              audience === option.value
                                ? "border-[#343652] bg-[#343652]"
                                : "border-gray-300"
                            }`}
                          >
                            {audience === option.value && (
                              <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>

                  {audience === "specific" && (
                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-semibold">
                        Search for a user *
                      </label>
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={userSearch}
                          onChange={(event) => {
                            setUserSearch(event.target.value);
                            setSelectedUser(null);
                          }}
                          placeholder="Search by name, username, or email"
                          className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
                        />
                      </div>

                      {selectedUser && (
                        <div className="mt-3 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-3">
                          <div>
                            <p className="font-semibold">
                              {[selectedUser.first_name, selectedUser.last_name]
                                .filter(Boolean)
                                .join(" ") || selectedUser.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{selectedUser.username} · {selectedUser.role}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedUser(null)}
                            className="text-sm font-medium text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {!selectedUser && userSearch.trim().length >= 2 && (
                        <div className="mt-2 overflow-hidden rounded-xl border border-gray-200">
                          {loadingUsers ? (
                            <p className="p-4 text-sm text-gray-500">
                              Searching users...
                            </p>
                          ) : users.length === 0 ? (
                            <p className="p-4 text-sm text-gray-500">
                              No users found. Confirm that the users endpoint supports search.
                            </p>
                          ) : (
                            <div className="max-h-64 overflow-y-auto">
                              {users.map((user) => (
                                <button
                                  type="button"
                                  key={user.id}
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setUserSearch("");
                                    setUsers([]);
                                  }}
                                  className="block w-full border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-gray-50"
                                >
                                  <p className="font-medium">
                                    {[user.first_name, user.last_name]
                                      .filter(Boolean)
                                      .join(" ") || user.username}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    @{user.username} · {user.role}
                                    {user.email ? ` · ${user.email}` : ""}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/notifications")}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: COLORS.yellow }}
                  >
                    <FaPaperPlane /> Review and Send
                  </button>
                </div>
              </div>

              <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <FaBell />
                  <h2 className="font-bold">Notification preview</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  An example of how the message may appear on a device.
                </p>

                <div className="mt-5 rounded-2xl bg-gray-100 p-3">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FBD22F]">
                        <FaBell style={{ color: COLORS.navy }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-800">
                          Earlystart
                        </p>
                        <p className="text-[10px] text-gray-400">now</p>
                      </div>
                    </div>
                    <p className="mt-3 break-words font-bold text-gray-900">
                      {title || "Your notification title"}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-600">
                      {body || "Your notification message will appear here."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <FaUsers className="mt-1 text-gray-500" />
                    <div>
                      <p className="text-sm font-semibold">
                        {selectedAudience?.label}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {selectedAudience?.description}
                      </p>
                      {selectedUser && (
                        <p className="mt-2 text-xs font-medium">
                          Selected: {selectedUser.username}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        </main>
      </div>

      {confirmSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
              <FaPaperPlane style={{ color: COLORS.navy }} />
            </div>
            <h2 className="text-xl font-bold">Confirm notification</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              You are about to send this notification to{" "}
              <strong>{selectedAudience?.label}</strong>
              {selectedUser ? ` (${selectedUser.username})` : ""}. Review the
              title and message before continuing.
            </p>

            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <p className="font-bold">{title}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                {body}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={sending}
                onClick={() => setConfirmSend(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                Go back
              </button>
              <button
                type="button"
                disabled={sending}
                onClick={confirmAndSend}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 disabled:opacity-50"
                style={{ backgroundColor: COLORS.yellow }}
              >
                <FaPaperPlane />
                {sending ? "Sending..." : "Confirm and Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
