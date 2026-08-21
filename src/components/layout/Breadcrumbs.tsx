import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { navSections } from "../../config/navigation";

export default function Breadcrumbs({ trailingLabel }: { trailingLabel?: string }) {
  const location = useLocation();
  const active = navSections.find((s) => location.pathname.startsWith(s.path));

  return (
    <nav aria-label="Breadcrumb" id="breadcrumbs" data-testid="breadcrumbs" className="flex items-center text-sm text-slate-500 gap-1.5">
      <Link
        to="/app/dashboard"
        id="breadcrumb-home"
        data-testid="breadcrumb-home"
        aria-label="Go to dashboard"
        className="flex items-center gap-1 hover:text-brand-600"
      >
        <Home className="h-3.5 w-3.5" aria-hidden="true" />
        Home
      </Link>
      {active && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
          <span data-testid="breadcrumb-section" className={trailingLabel ? "hover:text-brand-600" : "text-slate-700 font-medium"}>
            {active.label}
          </span>
        </>
      )}
      {trailingLabel && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
          <span data-testid="breadcrumb-current" className="text-slate-700 font-medium">
            {trailingLabel}
          </span>
        </>
      )}
    </nav>
  );
}
