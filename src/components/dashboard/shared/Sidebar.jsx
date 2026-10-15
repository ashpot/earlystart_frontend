
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaChartBar, FaChevronDown } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import logo from "../../../assets/images/eslogo.png";
import { adminNavigation } from "../../../config/adminNavigation";
import { FaChartArea } from "react-icons/fa6";

const Sidebar = () => {
  const location = useLocation();

  const getActiveGroup = () =>
    adminNavigation.find(
      (item) =>
        item.children?.some(
          (child) => child.path === location.pathname
        )
    )?.label || "";

  const [openGroup, setOpenGroup] = useState(getActiveGroup);

  useEffect(() => {
    const activeGroup = getActiveGroup();

    if (activeGroup) {
      setOpenGroup(activeGroup);
    }
  }, [location.pathname]);

  const linkClasses = ({ isActive }) =>
    [
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
      isActive
        ? "bg-white font-semibold text-secondaryDark shadow-sm"
        : "text-secondaryDark hover:bg-white/70",
    ].join(" ");

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col overflow-y-auto bg-primary font-inter text-secondaryDark">
      {/* Brand */}
      <NavLink
        to="/admin/dashboard"
        className="flex min-h-[65px] items-center justify-center border-b border-black/10 px-5"
      >
        <img
          src={logo}
          alt="Earlystart"
          className="h-10 max-w-full object-contain"
        />
      </NavLink>

      {/* Navigation */}
      <nav aria-label="Admin navigation" className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-secondaryDark/60">
          Main menu
        </p>

        <ul className="space-y-2">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openGroup === item.label;

            if (!hasChildren) {
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={linkClasses}
                  >
                    <Icon className="shrink-0 text-lg" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            }

            const isGroupActive = item.children.some(
              (child) => child.path === location.pathname
            );

            return (
              <li key={item.label}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenGroup((current) =>
                      current === item.label ? "" : item.label
                    )
                  }
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                    isGroupActive
                      ? "font-semibold"
                      : "font-medium",
                    "hover:bg-white/70",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="shrink-0 text-lg" />
                    <span>{item.label}</span>
                  </span>

                  <FaChevronDown
                    className={[
                      "text-xs transition-transform duration-200",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {isOpen && (
                  <ul className="ml-5 mt-1 space-y-1 border-l border-black/10 pl-3">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <NavLink
                          to={child.path}
                          className={linkClasses}
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-widest text-secondaryDark/60">
          General
        </p>

        <NavLink
          to="/admin/analytics"
          className={linkClasses}
        >
          <FaChartBar className="shrink-0 text-lg" />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/admin/search-results"
          className={linkClasses}
        >
          <FaSearch className="shrink-0 text-lg" />
          <span>Search Results</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
