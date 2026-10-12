
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

import ESlogo from "../../../assets/images/eslogowhite.png";
import { adminNavigation } from "../../../config/adminNavigation";

const CollapsedSidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [flyoutPosition, setFlyoutPosition] = useState(80);

  const sidebarRef = useRef(null);
  const triggerRefs = useRef({});
  const flyoutRef = useRef(null);

  const location = useLocation();

  // Close the flyout after navigating to another page.
  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  // Close when clicking outside the sidebar and flyout.
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        sidebarRef.current?.contains(event.target) ||
        flyoutRef.current?.contains(event.target)
      ) {
        return;
      }

      setOpenMenu(null);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openFlyout = (item) => {
    const trigger = triggerRefs.current[item.label];
    const rect = trigger?.getBoundingClientRect();

    if (rect) {
      const estimatedHeight = Math.min(
        item.children.length * 42 + 76,
        window.innerHeight * 0.8
      );

      const top = Math.max(
        12,
        Math.min(
          rect.top,
          window.innerHeight - estimatedHeight - 12
        )
      );

      setFlyoutPosition(top);
    }

    setOpenMenu((current) =>
      current === item.label ? null : item.label
    );
  };

  const isGroupActive = (item) =>
    item.children?.some(
      (child) => child.path === location.pathname
    );

  const activeLinkClasses = ({ isActive }) =>
    [
      "flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors",
      isActive
        ? "bg-yellow-50 font-semibold text-gray-900"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    ].join(" ");

  const activeIconClasses = (active) =>
    [
      "flex h-12 w-full items-center justify-center rounded-xl transition-colors",
      active
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-800 hover:bg-white/70",
    ].join(" ");

  return (
    <>
      <aside
        ref={sidebarRef}
        className="sticky top-0 z-30 flex h-screen w-20 shrink-0 flex-col overflow-y-auto bg-primary text-secondaryDark shadow-sm"
      >
        {/* Logo */}
        <NavLink
          to="/admin/dashboard"
          title="Earlystart Dashboard"
          aria-label="Earlystart Dashboard"
          className="flex min-h-[65px] items-center justify-center border-b border-black/10 px-3"
        >
          <img
            src={ESlogo}
            alt="Earlystart"
            className="h-10 w-10 object-contain"
          />
        </NavLink>

        {/* Collapsed navigation */}
        <nav
          aria-label="Collapsed admin navigation"
          className="flex-1 px-3 py-6"
        >
          <ul className="flex flex-col items-center gap-3">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.children?.length);
              const active = hasChildren
                ? isGroupActive(item)
                : item.path === location.pathname;

              // Items without submenus navigate directly.
              if (!hasChildren) {
                return (
                  <li key={item.label} className="w-full">
                    <NavLink
                      to={item.path}
                      end={item.end}
                      title={item.label}
                      aria-label={item.label}
                      className={({ isActive }) =>
                        activeIconClasses(isActive)
                      }
                    >
                      <Icon className="text-xl" />
                    </NavLink>
                  </li>
                );
              }

              const expanded = openMenu === item.label;

              return (
                <li key={item.label} className="w-full">
                  <button
                    ref={(element) => {
                      triggerRefs.current[item.label] = element;
                    }}
                    type="button"
                    title={item.label}
                    aria-label={item.label}
                    aria-expanded={expanded}
                    aria-haspopup="true"
                    onClick={() => openFlyout(item)}
                    className={activeIconClasses(active)}
                  >
                    <Icon className="text-xl" />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Flyout rendered outside the scrolling sidebar */}
      {openMenu && (
        <div
          ref={flyoutRef}
          className="fixed z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
          style={{
            left: "80px",
            top: `${flyoutPosition}px`,
            maxHeight: "80vh",
          }}
          role="menu"
          aria-label={`${openMenu} submenu`}
        >
          {adminNavigation
            .filter((item) => item.label === openMenu)
            .map((item) => {
              const Icon = item.icon;

              return (
                <React.Fragment key={item.label}>
                  {/* Flyout heading */}
                  <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100 text-gray-800">
                      <Icon className="text-lg" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        Select a page
                      </p>
                    </div>
                  </div>

                  {/* Submenu links */}
                  <div className="overflow-y-auto p-2">
                    <ul className="space-y-1">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            role="menuitem"
                            onClick={() => setOpenMenu(null)}
                            className={activeLinkClasses}
                          >
                            <span className="flex-1">
                              {child.label}
                            </span>

                            <FaChevronRight className="text-[10px] text-gray-400" />
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </React.Fragment>
              );
            })}
        </div>
      )}
    </>
  );
};

export default CollapsedSidebar;
