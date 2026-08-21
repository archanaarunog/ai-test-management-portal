import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { TestCase } from "../../types";

export default function ViewTestModal({ test, onClose }: { test: TestCase; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-test-modal-title"
      id="view-test-modal"
      data-testid="view-test-modal"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <div>
            <p className="text-xs font-mono text-slate-400">{test.key}</p>
            <h3 id="view-test-modal-title" className="text-lg font-semibold text-slate-900">
              {test.title}
            </h3>
          </div>
          <button
            type="button"
            id="view-test-modal-close-button"
            data-testid="view-test-modal-close-button"
            aria-label="Close dialog"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <ReadOnlyField label="Module" value={test.module} testId="view-test-module" />
            <ReadOnlyField label="Type" value={test.type} testId="view-test-type" />
            <ReadOnlyField label="Priority" value={test.priority} testId="view-test-priority" />
            <ReadOnlyField label="Status" value={test.status} testId="view-test-status" />
            <ReadOnlyField label="Owner" value={test.owner} testId="view-test-owner" />
            <ReadOnlyField label="Automated" value={test.automated ? "Yes" : "No"} testId="view-test-automated" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description</p>
            <p data-testid="view-test-description" className="text-sm text-slate-600">
              {test.description}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Steps</p>
            <ol className="space-y-1.5">
              {test.steps.map((step, idx) => (
                <li key={step.id} className="text-sm text-slate-600 flex gap-2">
                  <span className="font-semibold text-slate-400">{idx + 1}.</span>
                  <span>
                    <span className="font-medium text-slate-700">{step.action}</span> &rarr; {step.expectedResult}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ReadOnlyField({ label, value, testId }: { label: string; value: string; testId: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p data-testid={testId} className="text-slate-700 font-medium">
        {value}
      </p>
    </div>
  );
}
