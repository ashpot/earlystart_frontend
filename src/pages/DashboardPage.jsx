
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowDown,
  FaArrowRight,
  FaArrowUp,
  FaBookOpen,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaMoneyBillWave,
  FaRedo,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import "../index.css";
import DashboardNavbar from "../components/dashboard/shared/DashboardNavbar";
import Sidebar from "../components/dashboard/shared/Sidebar";
import CollapsedSidebar from "../components/dashboard/shared/CollapsedSidebar";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("en-NG")
    : "0";
};

const formatCurrency = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(number);
};

const getArray = (...values) => {
  return values.find(Array.isArray) || [];
};

const getValue = (object, keys, fallback = 0) => {
  if (!object || typeof object !== "object") return fallback;

  for (const key of keys) {
    const value = object[key];

    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return fallback;
};

const getInitials = (name = "") => {
  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
};

const getDisplayName = (user) => {
  if (!user) return "Admin";

  return (
    user.first_name ||
    user.firstName ||
    user.name ||
    user.username ||
    user.email?.split("@")[0] ||
    "Admin"
  );
};

/* -------------------------------------------------------
   Reusable components
------------------------------------------------------- */

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass = "bg-blue-50 text-blue-600",
  trend,
  trendType = "neutral",
}) {
  const trendClass =
    trendType === "positive"
      ? "text-emerald-600"
      : trendType === "negative"
        ? "text-red-600"
        : "text-gray-500";

  return (
    <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-3 break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {trend && (
            <span className={`flex items-center gap-1 font-semibold ${trendClass}`}>
              {trendType === "positive" ? (
                <FaArrowUp />
              ) : trendType === "negative" ? (
                <FaArrowDown />
              ) : null}
              {trend}
            </span>
          )}

          {description && <span className="text-gray-500">{description}</span>}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
        >
          {action}
          <FaArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-xl bg-gray-50 px-4 py-8 text-center">
      <FaChartLine className="mb-3 text-2xl text-gray-300" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

/* -------------------------------------------------------
   Engagement chart
------------------------------------------------------- */

function EngagementChart({ data }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.slice(-7).map((item, index) => {
      if (typeof item === "number") {
        return {
          label: `Day ${index + 1}`,
          value: item,
        };
      }

      return {
        label:
          item.label ||
          item.day ||
          item.date ||
          item.name ||
          `Day ${index + 1}`,
        value: Number(
          item.value ??
          item.count ??
          item.students ??
          item.active_students ??
          item.total ??
          0
        ),
      };
    });
  }, [data]);

  const maxValue = Math.max(
    1,
    ...chartData.map((item) => item.value)
  );

  if (!chartData.length) {
    return <EmptyState message="Learning activity data is not available yet." />;
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Learning activity</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatNumber(
              chartData.reduce((total, item) => total + item.value, 0)
            )}
          </p>
        </div>

        <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
          Last 7 data points
        </span>
      </div>

      <div className="flex h-48 w-full items-end gap-2 sm:gap-4">
        {chartData.map((item, index) => {
          const height = Math.max(
            item.value > 0 ? 8 : 3,
            (item.value / maxValue) * 100
          );

          return (
            <div
              key={`${item.label}-${index}`}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="flex h-full w-full items-end justify-center">
                <div
                  title={`${item.label}: ${formatNumber(item.value)}`}
                  className="dashboard-chart-bar w-full max-w-10 rounded-t-lg transition-all"
                  style={{ height: `${height}%` }}
                />
              </div>

              <span className="w-full truncate text-center text-[10px] text-gray-500 sm:text-xs">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Student list
------------------------------------------------------- */

function StudentList({ students }) {
  if (!students.length) {
    return <EmptyState message="No student records available yet." />;
  }

  return (
    <div className="w-full min-w-0">
      {students.slice(0, 5).map((student, index) => {
        const name =
          student.name ||
          student.full_name ||
          student.username ||
          student.email ||
          "Student";

        const subtitle =
          student.email ||
          student.username ||
          student.age_level?.name ||
          student.level ||
          "Earlystart learner";

        return (
          <div
            key={student.id ?? student.pk ?? `${name}-${index}`}
            className="flex min-w-0 items-center gap-3 border-b border-gray-100 py-4 last:border-0"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
              {getInitials(name) || "S"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {name}
              </p>
              <p className="mt-1 truncate text-xs text-gray-500">
                {subtitle}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 sm:text-xs">
              Student
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------
   Payment list
------------------------------------------------------- */

function PaymentList({ payments }) {
  if (!payments.length) {
    return <EmptyState message="No payment records available yet." />;
  }

  return (
    <div className="w-full min-w-0">
      {payments.slice(0, 5).map((payment, index) => {
        const payer =
          payment.user_name ||
          payment.name ||
          payment.user?.name ||
          payment.user?.username ||
          payment.email ||
          "Customer";

        const amount = getValue(
          payment,
          ["amount", "total", "price"],
          0
        );

        const status = String(
          payment.status ||
          (payment.paid ? "Completed" : "Pending")
        );

        const completed =
          payment.paid === true ||
          ["completed", "success", "successful", "paid"].includes(
            status.toLowerCase()
          );

        return (
          <div
            key={payment.id ?? payment.reference ?? index}
            className="flex min-w-0 items-center gap-3 border-b border-gray-100 py-4 last:border-0"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                completed
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {completed ? <FaCheckCircle /> : <FaClock />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {payer}
              </p>
              <p className="mt-1 truncate text-xs text-gray-500">
                {payment.reference || payment.subscription || "Payment"}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-gray-900">
                {formatCurrency(amount)}
              </p>
              <p
                className={`mt-1 text-xs font-medium ${
                  completed ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {status}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------
   Dashboard page
------------------------------------------------------- */

export default function DashboardPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((previous) => !previous);
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Your session could not be found. Please sign in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/rest-auth/admin/dashboard/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Your session may have expired or you do not have permission to view this dashboard."
          );
        }

        throw new Error(
          `Unable to load dashboard data (HTTP ${response.status}).`
        );
      }

      const result = await response.json();

      // Support APIs that return either the data directly
      // or inside a "data" object.
      setDashboard(result?.data ?? result);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(
        err.message || "Something went wrong while loading the dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = dashboard?.stats || {};

  const students = getArray(
    dashboard?.latest_students,
    dashboard?.students
  );

  const payments = getArray(
    dashboard?.payments,
    dashboard?.latest_payments
  );

  const categories = getArray(dashboard?.categories);
  const instructors = getArray(dashboard?.top_instructors);

  const learningData = getArray(
    dashboard?.engagement,
    dashboard?.learning_activity,
    dashboard?.activity_over_time,
    dashboard?.active_learning
  );

  const totalStudents = getValue(
    stats,
    ["total_students", "students", "student_count"],
    getValue(dashboard, ["total_students", "student_count"], students.length)
  );

  const totalInstructors = getValue(
    stats,
    ["total_instructors", "instructors", "instructor_count"],
    getValue(dashboard, ["total_instructors", "instructor_count"], instructors.length)
  );

  const totalCourses = getValue(
    stats,
    ["total_courses", "courses", "course_count"],
    getValue(dashboard, ["total_courses", "course_count"], 0)
  );

  const totalRevenue = getValue(
    stats,
    ["total_revenue", "revenue", "total_earnings", "earnings"],
    getValue(dashboard, ["total_revenue", "total_earnings"], null)
  );

  const completedPayments = useMemo(
    () =>
      payments.filter((payment) => {
        const status = String(payment.status || "").toLowerCase();
        return (
          payment.paid === true ||
          ["completed", "success", "successful", "paid"].includes(status)
        );
      }),
    [payments]
  );

  const displayedRevenue =
    totalRevenue !== null
      ? formatCurrency(totalRevenue)
      : "—";

  const quickActions = [
    {
      title: "Add a student",
      description: "Manage student accounts",
      icon: FaUsers,
      path: "/admin/students",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Add a course",
      description: "Create learning content",
      icon: FaBookOpen,
      path: "/admin/course/add",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Add an instructor",
      description: "Manage teaching staff",
      icon: FaUserTie,
      path: "/admin/instructors/add",
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "View payments",
      description: "Review transactions",
      icon: FaMoneyBillWave,
      path: "/admin/payments",
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed desktop sidebar */}
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

      {/* Main content moves to make room for the sidebar */}
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
          {/* Page heading */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                Earlystart Administration
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {getGreeting()}, {getDisplayName(user)}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Here&apos;s what&apos;s happening across your learning platform.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
            >
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={loadDashboard}
                className="text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          

{/* Brand-colored metric cards */}
<div
  className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
  }}
>
  <MetricCard
    title="Total Students"
    value={loading ? "…" : formatNumber(totalStudents)}
    description="Registered learners"
    icon={FaGraduationCap}
    background="#343652"
    foreground="#FFFFFF"
  />

  <MetricCard
    title="Total Instructors"
    value={loading ? "…" : formatNumber(totalInstructors)}
    description="Teaching team"
    icon={FaUsers}
    background="#91ADC6"
    foreground="#343652"
  />

  <MetricCard
    title="Total Courses"
    value={loading ? "…" : formatNumber(totalCourses)}
    description="Learning content"
    icon={FaBookOpen}
    background="#FBD22F"
    foreground="#343652"
  />

  <MetricCard
    title="Total Revenue"
    value={loading ? "…" : displayedRevenue}
    description="Reported platform revenue"
    icon={FaMoneyBillWave}
    background="#BDBEC0"
    foreground="#343652"
  />
</div>


          
{/* Engagement chart: 70% / Learning summary: 30% */}
<div className="dashboard-chart-layout mt-6">
  {/* Engagement chart - 70% */}
  <Panel>
    <SectionHeader
      title="Engagement Chart"
      subtitle="A snapshot of learner activity"
    />

    {loading ? (
      <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
    ) : (
      <EngagementChart data={learningData} />
    )}
  </Panel>

  {/* Learning summary - 30% */}
  <Panel>
    <SectionHeader
      title="Learning Summary"
      subtitle="Explore your learning catalog"
      action="View all"
      onAction={() => navigate("/admin/categories")}
    />

    {/* Keep your existing categories content here */}
    {loading ? (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-12 animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    ) : categories.length ? (
      <div className="space-y-3">
        {categories.slice(0, 5).map((category, index) => (
          <div
            key={category.id ?? category.pk ?? index}
            className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
              <FaBookOpen />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800">
                {category.name || category.title || "Category"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {formatNumber(
                  category.course_count ??
                  category.total_courses ??
                  category.courses_count ??
                  0
                )}{" "}
                courses
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <EmptyState message="No categories to display yet." />
    )}
  </Panel>
</div>


          
{/* Latest students: 50% / Recent payments: 50% */}

  <div className="dashboard-activity-layout mt-6">
  <Panel>
    <SectionHeader
      title="Latest Students"
      subtitle="Recently registered learners"
      action="View students"
      onAction={() => navigate("/admin/students")}
    />

    {loading ? (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-14 animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    ) : (
      <StudentList students={students} />
    )}
  </Panel>

  <Panel>
    <SectionHeader
      title="Recent Payments"
      subtitle="Latest payment transactions"
      action="View payments"
      onAction={() => navigate("/admin/payments")}
    />

    {loading ? (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-14 animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    ) : (
      <PaymentList payments={payments} />
    )}
  </Panel>
</div>

          {/* Instructors and learning content */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel>
              <SectionHeader
                title="Top instructors"
                subtitle="Your featured teaching team"
                action="View instructors"
                onAction={() => navigate("/admin/instructors")}
              />

              {loading ? (
                <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
              ) : instructors.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {instructors.slice(0, 4).map((instructor, index) => {
                    const name =
                      instructor.name ||
                      instructor.full_name ||
                      instructor.username ||
                      instructor.email ||
                      "Instructor";

                    return (
                      <div
                        key={instructor.id ?? instructor.pk ?? index}
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-purple-600">
                          {getInitials(name) || "I"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {name}
                          </p>
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {instructor.email || "Instructor"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState message="No instructor data available yet." />
              )}
            </Panel>

            <Panel>
              <SectionHeader
                title="Quick actions"
                subtitle="Common administration tasks"
              />

              <div className="dashboard-quick-actions">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.title}
                      type="button"
                      onClick={() => navigate(action.path)}
                      className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:border-indigo-100 hover:bg-indigo-50/50"
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}
                      >
                        <Icon />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {action.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-gray-500">
                          {action.description}
                        </p>
                      </div>

                      <FaArrowRight className="shrink-0 text-xs text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </Panel>
          </div>

          <footer className="mt-8 pb-4 text-center text-xs text-gray-400">
            Earlystart Admin Dashboard
          </footer>
        </main>
      </div>
    </div>
  );
}
