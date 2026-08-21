import { useEffect, useState } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";

const accordionItems = [
  { id: "acc-1", title: "How is test coverage calculated?", body: "Coverage is calculated as the percentage of mapped requirements that have at least one passing automated test associated with them." },
  { id: "acc-2", title: "What counts as a flaky test?", body: "A test is flagged flaky when it produces different results across three or more runs against the same build without any code changes." },
  { id: "acc-3", title: "How often does the nightly suite run?", body: "The full regression suite runs nightly at 01:00 UTC, with smoke suites running on every merge to the main branch." },
];

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "environments", label: "Environments" },
  { id: "integrations", label: "Integrations" },
];

export default function DynamicUIPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>("acc-1");
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [reloadKey]);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 8));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="dynamic-ui-page" data-testid="dynamic-ui-page" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dynamic UI</h1>
          <p className="text-sm text-slate-500 mt-1">Loading states, tooltips, tabs, accordions, and collapsibles.</p>
        </div>
        <button
          type="button"
          id="reload-dynamic-content-button"
          data-testid="reload-dynamic-content-button"
          aria-label="Reload dynamic content"
          onClick={() => setReloadKey((k) => k + 1)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Reload
        </button>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Loading &amp; Progress</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-slate-400 mb-2">Loading spinner</p>
            <div id="loading-spinner" data-testid="loading-spinner" className="h-8 w-8 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" role="status" aria-label="Loading" />
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">Progress bar</p>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} id="progress-bar" data-testid="progress-bar">
              <div className="h-full bg-brand-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p data-testid="progress-bar-value" className="text-[11px] text-slate-400 mt-1.5">{progress}% complete</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs text-slate-400 mb-2">Skeleton loader (simulates data fetch on reload)</p>
          <div id="skeleton-loader-container" data-testid="skeleton-loader-container">
            {loading ? (
              <div data-testid="skeleton-loader" className="space-y-2.5 max-w-md">
                <div className="h-4 rounded bg-slate-200 animate-pulse w-3/4" />
                <div className="h-4 rounded bg-slate-200 animate-pulse w-full" />
                <div className="h-4 rounded bg-slate-200 animate-pulse w-5/6" />
              </div>
            ) : (
              <div data-testid="skeleton-loaded-content" className="max-w-md text-sm text-slate-600 space-y-1.5">
                <p>Build 2026.08.11-rc3 &middot; 193 tests executed</p>
                <p>Environment: staging-eu-west &middot; Runner: playwright-java-1</p>
                <p>Last synced just now.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Tooltips</h2>
        <div className="flex flex-wrap gap-6">
          <span className="relative group inline-block">
            <button
              type="button"
              id="tooltip-trigger-info"
              data-testid="tooltip-trigger-info"
              aria-label="Hover for coverage info"
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-600"
            >
              Hover for coverage info
            </button>
            <span
              role="tooltip"
              id="tooltip-content-info"
              data-testid="tooltip-content-info"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 rounded-lg bg-slate-800 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              Coverage reflects requirements mapped to at least one automated test.
            </span>
          </span>

          <span className="relative group inline-block">
            <button
              type="button"
              id="tooltip-trigger-warning"
              data-testid="tooltip-trigger-warning"
              aria-label="Hover for flaky test warning"
              className="px-3.5 py-2 rounded-lg border border-warning-500/40 bg-warning-50 text-warning-600 text-sm"
            >
              Flaky test indicator
            </button>
            <span
              role="tooltip"
              id="tooltip-content-warning"
              data-testid="tooltip-content-warning"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded-lg bg-slate-800 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              This test has failed intermittently 4 times in the last 7 days.
            </span>
          </span>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Tabs</h2>
        <div id="dynamic-tabs" data-testid="dynamic-tabs" role="tablist" aria-label="Portal settings tabs" className="flex gap-1 border-b border-slate-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`tab-${tab.id}`}
              data-testid={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div key={tab.id} id={`tabpanel-${tab.id}`} data-testid={`tabpanel-${tab.id}`} role="tabpanel" className="text-sm text-slate-600">
                {tab.id === "overview" && "This portal exposes a stable, single-page surface for practicing UI automation end to end."}
                {tab.id === "environments" && "Available environments: staging-eu-west, staging-us-east, and local-dev (mock data only)."}
                {tab.id === "integrations" && "Simulated integrations: Slack alerts, Jira sync, and nightly CI triggers."}
              </div>
            )
        )}
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Accordion</h2>
        <div id="faq-accordion" data-testid="faq-accordion" className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
          {accordionItems.map((item) => {
            const open = openAccordion === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  id={`accordion-trigger-${item.id}`}
                  data-testid={`accordion-trigger-${item.id}`}
                  aria-expanded={open}
                  aria-controls={`accordion-panel-${item.id}`}
                  onClick={() => setOpenAccordion(open ? null : item.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {item.title}
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {open && (
                  <div id={`accordion-panel-${item.id}`} data-testid={`accordion-panel-${item.id}`} className="px-4 pb-4 text-sm text-slate-500">
                    {item.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Collapsible Section</h2>
          <button
            type="button"
            id="collapsible-toggle-button"
            data-testid="collapsible-toggle-button"
            aria-expanded={!collapsed}
            aria-controls="collapsible-content"
            onClick={() => setCollapsed((c) => !c)}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
        {!collapsed && (
          <div id="collapsible-content" data-testid="collapsible-content" className="mt-4 text-sm text-slate-600">
            Advanced execution settings: retry failed tests up to 2 times, capture screenshots on failure, and record
            video for cross-browser runs on Chromium, Firefox, and WebKit.
          </div>
        )}
      </section>
    </div>
  );
}
