
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config";

const emptyForm = {
  username: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  phone: "",
  role: "Instructor",
  is_active: true,
  password: "",
};

export default function ManagedUserForm({ userId = null }) {
  const isEditing = Boolean(userId);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const endpoint = `${BASE_URL}/api/v1/rest-auth/admin/users/`;

  useEffect(() => {
    if (!isEditing || !token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetch(
          `${endpoint}${userId}/manage/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Unable to load this user."
          );
        }

        if (!["Instructor", "Admin"].includes(data.role)) {
          throw new Error(
            "Only Instructor and Admin accounts can be edited here."
          );
        }

        if (!cancelled) {
          setForm({
            ...emptyForm,
            ...data,
            password: "",
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [userId, token, endpoint, isEditing]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (!form.username.trim()) {
      setFieldErrors({ username: "Username is required." });
      return;
    }

    if (!isEditing && !form.password) {
      setFieldErrors({ password: "Password is required." });
      return;
    }

    if (form.password && form.password.length < 8) {
      setFieldErrors({
        password: "Use a password with at least 8 characters.",
      });
      return;
    }

    const payload = {
      username: form.username.trim(),
      first_name: form.first_name.trim(),
      middle_name: form.middle_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      is_active: form.is_active,
    };

    if (form.password) {
      payload.password = form.password;
    }

    try {
      setSaving(true);

      const response = await fetch(
        isEditing
          ? `${endpoint}${userId}/manage/`
          : `${endpoint}create/`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data && typeof data === "object" && !data.detail) {
          setFieldErrors(data);
          throw new Error("Please correct the highlighted fields.");
        }

        throw new Error(
          data.detail || "Unable to save this user."
        );
      }

      navigate("/admin/users", {
        state: {
          message: isEditing
            ? "User updated successfully."
            : "User created successfully.",
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  const renderInput = (
    name,
    label,
    { required = false, type = "text", placeholder = "" } = {}
  ) => (
    <div key={name}>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-gray-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={form[name] ?? ""}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        autoComplete={name === "password" ? "new-password" : "off"}
        className={inputClass}
      />

      {fieldErrors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {Array.isArray(fieldErrors[name])
            ? fieldErrors[name].join(" ")
            : fieldErrors[name]}
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading user...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={() => navigate("/admin/users")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
      >
        <FaArrowLeft /> Back to Users
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#343652]">
          {isEditing ? "Edit User" : "Add New User"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {isEditing
            ? "Update the account details below."
            : "Create an Instructor or Admin account."}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
      >
        <div>
          <h2 className="font-bold text-[#343652]">
            Account Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Only Instructor and Admin roles are available.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {renderInput("first_name", "First Name", { required: true })}
          {renderInput("middle_name", "Middle Name")}
          {renderInput("last_name", "Last Name", { required: true })}
          {renderInput("username", "Username", { required: true })}
          {renderInput("email", "Email Address", { type: "email" })}
          {renderInput("phone", "Phone Number")}
          {renderInput("password", isEditing ? "New Password (optional)" : "Password", {
            required: !isEditing,
            type: "password",
            placeholder: isEditing
              ? "Leave blank to keep current password"
              : "Enter an initial password",
          })}

          <div>
            <label
              htmlFor="role"
              className="text-sm font-semibold text-gray-700"
            >
              Role <span className="text-red-500">*</span>
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="Instructor">Instructor</option>
              <option value="Admin">Admin</option>
            </select>

            {fieldErrors.role && (
              <p className="mt-1 text-sm text-red-600">
                {Array.isArray(fieldErrors.role)
                  ? fieldErrors.role.join(" ")
                  : fieldErrors.role}
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <input
            type="checkbox"
            name="is_active"
            checked={Boolean(form.is_active)}
            onChange={handleChange}
            className="h-4 w-4 accent-[#343652]"
          />
          <span>
            <span className="block text-sm font-semibold text-gray-700">
              Active account
            </span>
            <span className="block text-xs text-gray-500">
              Inactive accounts cannot log in normally.
            </span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBD22F] px-5 py-3 text-sm font-bold text-[#343652] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaSave />
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
