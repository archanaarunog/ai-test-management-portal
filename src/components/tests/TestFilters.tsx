import { useState, useRef, useEffect } from "react";
import { Search, RotateCcw, ChevronDown, Check } from "lucide-react";
import { modulesList, typesList } from "../../data/mockTests";

export interface FiltersState {
  search: string;
  module: string;
  types: string[];
  automatedOnly: boolean;
}

export const defaultFilters: FiltersState = {
  search: "",
  module: "All Modules",
  types: [],
  automatedOnly: false,
};

interface TestFiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
}

export default function TestFilters({ filters, onChange }: TestFiltersProps) {
  const [moduleOpen, setModuleOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const moduleRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moduleRef.current && !moduleRef.current.contains(e.target as Node)) setModuleOpen(false);
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleType = (type: string) => {
    const next = filters.types.includes(type) ? filters.types.filter((t) => t !== type) : [...filters.types, type];
    onChange({ ...filters, types: next });
  };

  return (
    <div
      id="test-filters-bar"
      data-testid="test-filters-bar"
      className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center gap-3"
    >
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
        <input
          id="test-search-input"
          name="testSearch"
          type="text"
          data-testid="test-search-input"
          aria-label="Search test cases"
          placeholder="Search by title, key, or owner..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Single-select dropdown */}
      <div className="relative" ref={moduleRef}>
        <button
          type="button"
          id="module-filter-dropdown-trigger"
          data-testid="module-filter-dropdown-trigger"
          aria-label="Filter by module"
          aria-haspopup="listbox"
          aria-expanded={moduleOpen}
          onClick={() => setModuleOpen((s) => !s)}
          className="flex items-center justify-between gap-2 min-w-[170px] px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:border-slate-400"
        >
          {filters.module}
          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </button>
        {moduleOpen && (
          <ul
            id="module-filter-dropdown-list"
            data-testid="module-filter-dropdown-list"
            role="listbox"
            aria-label="Module options"
            className="absolute z-20 mt-1.5 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 max-h-64 overflow-y-auto scrollbar-thin"
          >
            {["All Modules", ...modulesList].map((m) => (
              <li key={m}>
                <button
                  type="button"
                  id={`module-option-${m.replace(/\s+/g, "-").toLowerCase()}`}
                  data-testid={`module-option-${m.replace(/\s+/g, "-").toLowerCase()}`}
                  role="option"
                  aria-selected={filters.module === m}
                  onClick={() => {
                    onChange({ ...filters, module: m });
                    setModuleOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                    filters.module === m ? "text-brand-700 font-medium" : "text-slate-600"
                  }`}
                >
                  {m}
                  {filters.module === m && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Multi-select dropdown */}
      <div className="relative" ref={typeRef}>
        <button
          type="button"
          id="type-filter-dropdown-trigger"
          data-testid="type-filter-dropdown-trigger"
          aria-label="Filter by test type, multi-select"
          aria-haspopup="listbox"
          aria-expanded={typeOpen}
          onClick={() => setTypeOpen((s) => !s)}
          className="flex items-center justify-between gap-2 min-w-[170px] px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:border-slate-400"
        >
          {filters.types.length === 0 ? "All Types" : `${filters.types.length} type(s)`}
          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </button>
        {typeOpen && (
          <ul
            id="type-filter-dropdown-list"
            data-testid="type-filter-dropdown-list"
            role="listbox"
            aria-multiselectable="true"
            aria-label="Test type options"
            className="absolute z-20 mt-1.5 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 max-h-64 overflow-y-auto scrollbar-thin"
          >
            {typesList.map((t) => (
              <li key={t}>
                <label
                  htmlFor={`type-option-${t.toLowerCase()}`}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    id={`type-option-${t.toLowerCase()}`}
                    data-testid={`type-option-${t.toLowerCase()}`}
                    type="checkbox"
                    aria-label={t}
                    checked={filters.types.includes(t)}
                    onChange={() => toggleType(t)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  {t}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toggle switch */}
      <label htmlFor="automated-only-toggle" className="flex items-center gap-2.5 px-1 cursor-pointer select-none">
        <span className="text-sm text-slate-600 whitespace-nowrap">Automated only</span>
        <span className="relative inline-flex items-center">
          <input
            id="automated-only-toggle"
            data-testid="automated-only-toggle"
            type="checkbox"
            role="switch"
            aria-checked={filters.automatedOnly}
            aria-label="Show automated tests only"
            checked={filters.automatedOnly}
            onChange={(e) => onChange({ ...filters, automatedOnly: e.target.checked })}
            className="sr-only peer"
          />
          <span className="h-5.5 w-10 rounded-full bg-slate-300 peer-checked:bg-brand-600 transition-colors" />
          <span className="absolute left-0.5 top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4.5" />
        </span>
      </label>

      <button
        type="button"
        id="reset-filters-button"
        data-testid="reset-filters-button"
        aria-label="Reset all filters"
        onClick={() => onChange(defaultFilters)}
        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 whitespace-nowrap"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Reset
      </button>
    </div>
  );
}
