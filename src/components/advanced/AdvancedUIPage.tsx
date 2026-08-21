import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const iframeContent = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: -apple-system, sans-serif; margin: 0; padding: 20px; color: #334155; background: #f8fafc; }
      h2 { color: #1e40af; font-size: 15px; margin: 0 0 8px; }
      p { font-size: 13px; line-height: 1.5; }
      button { margin-top: 10px; padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e1; background: white; cursor: pointer; font-size: 13px; }
    </style>
  </head>
  <body>
    <h2>Embedded Report Widget</h2>
    <p>This content is rendered inside an isolated iframe, useful for practicing frame-switching in Selenium and Playwright.</p>
    <button id="iframe-internal-button" data-testid="iframe-internal-button">Click me inside iframe</button>
  </body>
</html>
`;

export default function AdvancedUIPage() {
  const [lastKey, setLastKey] = useState<string>("(none yet)");
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [hiddenVisible, setHiddenVisible] = useState(false);
  const [dynamicText, setDynamicText] = useState("Waiting for live data...");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const combo = `${e.ctrlKey || e.metaKey ? "Ctrl+" : ""}${e.key.length === 1 ? e.key.toUpperCase() : e.key}`;
      setLastKey(combo);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuickPanelOpen((s) => !s);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDynamicText(`Live queue depth: ${3 + (tick % 6)} pending jobs`);
  }, [tick]);

  return (
    <div id="advanced-ui-page" data-testid="advanced-ui-page" className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Advanced UI</h1>
        <p className="text-sm text-slate-500 mt-1">iframes, keyboard shortcuts, disabled/read-only/hidden states, and live content.</p>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Embedded iframe</h2>
        <p className="text-xs text-slate-400 mb-4">Practice frame-switching with a nested, isolated document.</p>
        <iframe
          id="embedded-report-iframe"
          data-testid="embedded-report-iframe"
          title="Embedded report widget"
          srcDoc={iframeContent}
          className="w-full max-w-lg h-40 rounded-lg border border-slate-200"
        />
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Keyboard Shortcuts</h2>
        <p className="text-xs text-slate-400 mb-4">
          Press any key to see it captured below. Try <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-xs">Ctrl</kbd> +{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-xs">K</kbd> to toggle the quick panel.
        </p>
        <p className="text-sm text-slate-600">
          Last key pressed: <span id="last-key-pressed" data-testid="last-key-pressed" className="font-mono font-medium text-brand-700">{lastKey}</span>
        </p>
        {quickPanelOpen && (
          <div id="keyboard-quick-panel" data-testid="keyboard-quick-panel" className="mt-3 max-w-sm rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            Quick panel opened via keyboard shortcut. Press Ctrl+K again to close.
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Control States</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="disabled-input-example" className="block text-xs text-slate-400 mb-1.5">
              Disabled input
            </label>
            <input
              id="disabled-input-example"
              data-testid="disabled-input-example"
              aria-label="Disabled input example"
              type="text"
              value="Cannot edit this"
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-sm text-slate-400"
            />
          </div>
          <div>
            <label htmlFor="readonly-input-example" className="block text-xs text-slate-400 mb-1.5">
              Read-only input
            </label>
            <input
              id="readonly-input-example"
              data-testid="readonly-input-example"
              aria-label="Read-only input example"
              type="text"
              defaultValue="QA-1001 (locked)"
              readOnly
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-600"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Disabled button</label>
            <button
              type="button"
              id="disabled-button-example"
              data-testid="disabled-button-example"
              aria-label="Disabled button example"
              disabled
              className="w-full px-3 py-2.5 rounded-lg bg-slate-200 text-slate-400 text-sm font-medium cursor-not-allowed"
            >
              Unavailable action
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Hidden Elements</h2>
        <p className="text-xs text-slate-400 mb-4">Toggle visibility of an element that starts hidden in the DOM.</p>
        <button
          type="button"
          id="toggle-hidden-element-button"
          data-testid="toggle-hidden-element-button"
          aria-label={hiddenVisible ? "Hide the hidden element" : "Reveal the hidden element"}
          onClick={() => setHiddenVisible((s) => !s)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
        >
          {hiddenVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          {hiddenVisible ? "Hide element" : "Reveal element"}
        </button>
        <p
          id="hidden-element-target"
          data-testid="hidden-element-target"
          hidden={!hiddenVisible}
          className="mt-3 max-w-sm rounded-lg border border-success-500/30 bg-success-50 px-4 py-3 text-sm text-success-700"
        >
          You found the hidden element. It uses the native `hidden` attribute.
        </p>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Dynamic Content Area</h2>
        <p className="text-xs text-slate-400 mb-4">This text updates automatically every second &mdash; useful for practicing explicit waits.</p>
        <p id="dynamic-content-area" data-testid="dynamic-content-area" className="text-sm font-medium text-brand-700">
          {dynamicText}
        </p>
      </section>
    </div>
  );
}
