import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome, FaSearch } from "react-icons/fa";

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
};

export default function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/admin/dashboard", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg text-center">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-44 w-44 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: "#E9EAEC" }}
          />

          <div
            className="relative flex h-32 w-32 items-center justify-center rounded-3xl shadow-sm"
            style={{ backgroundColor: COLORS.navy }}
          >
            <FaSearch className="text-5xl text-white" />

            <span
              className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full border-4 border-gray-50 text-lg font-bold"
              style={{
                backgroundColor: COLORS.yellow,
                color: COLORS.navy,
              }}
            >
              ?
            </span>
          </div>
        </div>

        {/* Error message */}
        <p
          className="mb-3 text-sm font-bold uppercase tracking-[0.25em]"
          style={{ color: COLORS.blue }}
        >
          Error 404
        </p>

        <h1
          className="mb-4 text-3xl font-extrabold sm:text-4xl"
          style={{ color: COLORS.navy }}
        >
          Page Not Found
        </h1>

        <p className="mx-auto mb-8 max-w-md text-base leading-7 text-gray-500">
          Oops! The page you are looking for doesn't exist, may have been moved,
          or the link may be incorrect.
        </p>

        {/* Navigation actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard", { replace: true })}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-sm transition hover:opacity-90"
            style={{
              backgroundColor: COLORS.yellow,
              color: COLORS.navy,
            }}
          >
            <FaHome />
            Back to Dashboard
          </button>

          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold transition hover:bg-gray-100"
            style={{ color: COLORS.navy }}
          >
            <FaArrowLeft />
            Back to Previous Page
          </button>
        </div>

        <p className="mt-10 text-sm text-gray-400">
          Earlystart Admin Panel
        </p>
      </div>
    </div>
  );
}