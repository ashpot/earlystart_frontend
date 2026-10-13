
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaDownload,
  FaExclamationTriangle,
  FaFileExcel,
  FaTimes,
  FaUpload,
  FaInfoCircle,
  FaTrash,
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

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const EXPECTED_COLUMNS = [
  "quiz_id",
  "question_text",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
  "marks",
];

const BulkUploadQuestionsPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadResult, setUploadResult] = useState(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () =>
    setIsSidebarCollapsed((previous) => !previous);

  const apiUrl = `${BASE_URL}/api/v1/rest-auth/admin`;

  const authHeaders = useMemo(
    () => ({
      Authorization: `Token ${token}`,
    }),
    [token]
  );

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return "Please select an Excel file.";
    }

    if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
      return "Only .xlsx Excel files are supported.";
    }

    if (selectedFile.size === 0) {
      return "The selected file is empty.";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return "The file must not exceed 10 MB.";
    }

    return "";
  };

  const chooseFile = (selectedFile) => {
    setError("");
    setSuccess("");
    setUploadResult(null);

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setFile(null);
      setError(validationError);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (event) => {
    chooseFile(event.target.files?.[0] || null);
    // Allow selecting the same file again after correcting it.
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    if (uploading) return;

    chooseFile(event.dataTransfer.files?.[0] || null);
  };

  const handleDownloadTemplate = async () => {
    setError("");
    setSuccess("");

    if (!token) {
      setError("Please sign in again to download the template.");
      return;
    }

    setDownloading(true);

    try {
      const response = await fetch(
        `${apiUrl}/questions/template/`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.detail || "Unable to download the Excel template."
        );
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "quiz_questions_template.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      setSuccess("Excel template downloaded successfully.");
    } catch (err) {
      setError(err.message || "Unable to download the template.");
    } finally {
      setDownloading(false);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setUploadResult(null);

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch(
        `${apiUrl}/questions/bulk-upload/`,
        {
          method: "POST",
          headers: authHeaders,
          body: formData,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setUploadResult({
          created: data.created ?? 0,
          error_count: data.error_count ?? 0,
          errors: Array.isArray(data.errors) ? data.errors : [],
        });

        throw new Error(
          data.detail || "The Excel file could not be imported."
        );
      }

      setUploadResult({
        created: data.created ?? 0,
        error_count: data.error_count ?? 0,
        errors: Array.isArray(data.errors) ? data.errors : [],
      });

      setSuccess(
        data.detail ||
          `${data.created ?? 0} questions imported successfully.`
      );

      setFile(null);
    } catch (err) {
      setError(err.message || "An error occurred during the upload.");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError("");
    setSuccess("");
    setUploadResult(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

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
            type="button"
            onClick={() => navigate("/admin/questions")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <FaArrowLeft />
            Back to Questions
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Bulk Upload Questions</h1>
            <p className="mt-1 text-sm text-gray-500">
              Import multiple quiz questions from an Excel spreadsheet.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <FaCheckCircle className="mt-0.5 shrink-0" />
              <span className="flex-1">{success}</span>
              <button
                type="button"
                onClick={() => setSuccess("")}
                aria-label="Dismiss success message"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              {/* Download template */}
              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                    <FaFileExcel className="text-2xl text-green-700" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">Step 1: Download Template</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Start with the official Excel template to ensure your
                      column names and question data match the import format.
                    </p>

                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      disabled={downloading}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ backgroundColor: COLORS.navy }}
                    >
                      <FaDownload />
                      {downloading
                        ? "Downloading..."
                        : "Download Excel Template"}
                    </button>
                  </div>
                </div>
              </section>

              {/* Upload file */}
              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="font-semibold">Step 2: Upload Spreadsheet</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Select the completed Excel workbook from your computer.
                  </p>
                </div>

                <form onSubmit={handleUpload}>
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (!uploading) setDragging(true);
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault();
                      setDragging(false);
                    }}
                    onDrop={handleDrop}
                    className={`rounded-xl border-2 border-dashed p-8 text-center transition sm:p-12 ${
                      dragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50/70"
                    }`}
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                      <FaFileExcel className="text-3xl text-green-700" />
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-800">
                      Drag and drop your Excel file
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Or choose a file from your computer.
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      .xlsx files only · Maximum size 10 MB
                    </p>

                    <label
                      className={`mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 ${
                        uploading ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <FaUpload />
                      Choose Excel File
                      <input
                        type="file"
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {file && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white">
                        <FaFileExcel className="text-xl text-green-700" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {file.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={clearFile}
                        disabled={uploading}
                        aria-label="Remove selected file"
                        className="rounded-lg p-2 text-gray-500 hover:bg-white hover:text-red-600 disabled:opacity-50"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={clearFile}
                      disabled={uploading || !file}
                      className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Clear Selection
                    </button>

                    <button
                      type="submit"
                      disabled={uploading || !file}
                      className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ backgroundColor: COLORS.navy }}
                    >
                      <FaUpload />
                      {uploading ? "Uploading Questions..." : "Upload Questions"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Results */}
              {uploadResult && (
                <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="font-semibold">Import Results</h2>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="text-sm text-green-700">
                        Questions imported
                      </p>
                      <p className="mt-1 text-2xl font-bold text-green-800">
                        {uploadResult.created}
                      </p>
                    </div>

                    <div className="rounded-lg bg-red-50 p-4">
                      <p className="text-sm text-red-700">
                        Rows with errors
                      </p>
                      <p className="mt-1 text-2xl font-bold text-red-800">
                        {uploadResult.error_count}
                      </p>
                    </div>
                  </div>

                  {uploadResult.errors?.length > 0 && (
                    <div className="mt-5">
                      <h3 className="mb-3 font-semibold text-red-800">
                        Rows requiring correction
                      </h3>

                      <div className="overflow-x-auto rounded-lg border border-red-100">
                        <table className="w-full min-w-[420px] text-left text-sm">
                          <thead className="bg-red-50 text-xs uppercase text-red-800">
                            <tr>
                              <th className="px-4 py-3">Excel Row</th>
                              <th className="px-4 py-3">Validation Errors</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-red-100">
                            {uploadResult.errors.map((item, index) => (
                              <tr key={`${item.row}-${index}`}>
                                <td className="px-4 py-3 font-semibold text-gray-800">
                                  {item.row}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                  {Array.isArray(item.errors)
                                    ? item.errors.join(" ")
                                    : String(item.errors || "Invalid row")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <p className="mt-3 text-xs leading-5 text-gray-500">
                        Correct the indicated rows in your spreadsheet and
                        upload the file again. Row numbers refer to Excel
                        worksheet rows, including the header row.
                      </p>
                    </div>
                  )}

                  {uploadResult.error_count === 0 &&
                    uploadResult.created > 0 && (
                      <button
                        type="button"
                        onClick={() => navigate("/admin/questions")}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                        style={{ backgroundColor: COLORS.navy }}
                      >
                        <FaCheckCircle />
                        View Questions
                      </button>
                    )}
                </section>
              )}
            </div>

            {/* Instructions panel */}
            <aside className="space-y-5">
              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <FaInfoCircle style={{ color: COLORS.blue }} />
                  <h2 className="font-semibold">Spreadsheet Requirements</h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Use the exact column names in the template. Each non-empty
                  row represents one question.
                </p>

                <div className="mt-4 space-y-3">
                  {EXPECTED_COLUMNS.map((column) => (
                    <div
                      key={column}
                      className="flex items-start gap-2 text-sm"
                    >
                      <FaCheckCircle className="mt-0.5 shrink-0 text-green-600" />
                      <code className="break-all text-xs text-gray-700">
                        {column}
                      </code>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="font-semibold">Important Guidelines</h2>

                <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: COLORS.navy }}>
                      1.
                    </span>
                    Use an existing quiz ID in the `quiz_id` column.
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: COLORS.navy }}>
                      2.
                    </span>
                    Provide the question and all four answer options.
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: COLORS.navy }}>
                      3.
                    </span>
                    `correct_answer` must exactly match one option's text.
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: COLORS.navy }}>
                      4.
                    </span>
                    Marks must be a non-negative whole number. Blank marks
                    default to 1.
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: COLORS.navy }}>
                      5.
                    </span>
                    Invalid rows cancel the entire import. Correct all
                    reported errors before retrying.
                  </li>
                </ul>
              </section>

              <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="mt-1 shrink-0 text-yellow-700" />
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      Before You Upload
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Review the quiz IDs and correct answers carefully.
                      Upload only the completed `.xlsx` template.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BulkUploadQuestionsPage;
