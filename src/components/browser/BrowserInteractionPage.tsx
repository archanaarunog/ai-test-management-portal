import { ExternalLink, MonitorUp, Download, Link2 } from "lucide-react";
import { mockTests } from "../../data/mockTests";

function downloadReport() {
  const header = "Key,Title,Module,Status,Owner\n";
  const rows = mockTests
    .map((t) => `${t.key},"${t.title.replace(/"/g, '""')}",${t.module},${t.status},${t.owner}`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "test-execution-report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function BrowserInteractionPage() {
  return (
    <div id="browser-interaction-page" data-testid="browser-interaction-page" className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Browser Interaction</h1>
        <p className="text-sm text-slate-500 mt-1">Multi-tab, multi-window, external navigation, and file download flows.</p>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Navigation</h2>
        <div className="flex flex-wrap gap-3">
          <a
            id="open-new-tab-link"
            data-testid="open-new-tab-link"
            aria-label="Open documentation in a new browser tab"
            href="https://playwright.dev/java/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> Open New Tab
          </a>
          <button
            type="button"
            id="open-new-window-button"
            data-testid="open-new-window-button"
            aria-label="Open reports console in a new browser window"
            onClick={() =>
              window.open(
                "https://playwright.dev/java/docs/intro",
                "reportsConsole",
                "width=900,height=650,noopener,noreferrer"
              )
            }
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
          >
            <MonitorUp className="h-4 w-4" aria-hidden="true" /> Open New Window
          </button>
          <a
            id="external-link-anchor"
            data-testid="external-link-anchor"
            aria-label="Visit external Playwright documentation site"
            href="https://playwright.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-brand-600 text-sm font-medium hover:underline"
          >
            <Link2 className="h-4 w-4" aria-hidden="true" /> External Link (playwright.dev)
          </a>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">File Download</h2>
        <p className="text-xs text-slate-400 mb-4">Download the current test execution report as CSV.</p>
        <button
          type="button"
          id="download-report-button"
          data-testid="download-report-button"
          aria-label="Download test execution report as CSV"
          onClick={downloadReport}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Download Report (.csv)
        </button>
      </section>
    </div>
  );
}
