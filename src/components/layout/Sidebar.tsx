import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { navSections } from "../../config/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          data-testid="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        id="app-sidebar"
        data-testid="app-sidebar"
        aria-label="Main navigation"
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 lg:z-0 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 lg:hidden">
          <span className="font-semibold text-slate-800 text-sm">Navigation</span>
          <button
            type="button"
            id="sidebar-close-button"
            data-testid="sidebar-close-button"
            aria-label="Close sidebar navigation"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3" aria-label="Sections">
          <p className="px-2.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Test Management</p>
          <ul className="space-y-1" id="sidebar-nav-list" data-testid="sidebar-nav-list">
            {navSections.map((section) => (
              <li key={section.key}>
                <NavLink
                  to={section.path}
                  id={`sidebar-nav-${section.key}`}
                  data-testid={`sidebar-nav-${section.key}`}
                  aria-label={`Go to ${section.label}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-brand-50 text-brand-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <section.icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col">
                    <span>{section.label}</span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400">
          <p>Version 1.0.0 &middot; Practice Build</p>
        </div>
      </aside>
    </>
  );
}
