
import React, { useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaAngleDown,
  FaUser,
} from "react-icons/fa";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { FaXmark } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import photo from "../../../assets/images/photo.png";
import { useAuth } from "../../../context/AuthContext.jsx";

const DashboardNavbar = ({
  toggleSidebar,
  isSidebarCollapsed,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate("/admin/search-results", {
      state: { searchQuery: query },
    });

    searchRef.current?.blur();
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const fullName = [
    user?.first_name,
    user?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <nav className="flex min-h-[72px] items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Sidebar toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={
            isSidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="shrink-0 rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
        >
          {isSidebarCollapsed ? (
            <FaXmark size={22} />
          ) : (
            <HiOutlineMenuAlt1 size={24} />
          )}
        </button>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="relative mx-auto w-full max-w-xl"
        >
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />

          <input
            ref={searchRef}
            type="search"
            placeholder="Search courses, students..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            aria-label="Search the admin dashboard"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
          />
        </form>

        {/* User menu */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() =>
              setIsDropdownOpen((previous) => !previous)
            }
            aria-expanded={isDropdownOpen}
            aria-label="Open administrator menu"
            className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-gray-50 sm:gap-3 sm:px-2"
          >
            <img
              src={user?.photo || photo}
              alt=""
              className="h-9 w-9 rounded-full border border-gray-200 object-cover"
            />

            <span className="hidden min-w-0 sm:block">
              <span className="block max-w-36 truncate text-sm font-semibold text-gray-900">
                {fullName ||
                  user?.username ||
                  "Administrator"}
              </span>

              <span className="block text-xs capitalize text-gray-500">
                {user?.role || "Administrator"}
              </span>
            </span>

            <FaAngleDown
              className={`hidden text-gray-400 transition-transform sm:block ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
              <div className="border-b border-gray-100 px-4 py-3 sm:hidden">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {fullName ||
                    user?.username ||
                    "Administrator"}
                </p>
                <p className="text-xs capitalize text-gray-500">
                  {user?.role || "Administrator"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/admin/profile");
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <FaUser className="text-gray-400" />
                Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
              >
                <FiLogOut />
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default DashboardNavbar;
