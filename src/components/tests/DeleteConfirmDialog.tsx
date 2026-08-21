import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { TestCase } from "../../types";

export default function DeleteConfirmDialog({
  test,
  onCancel,
  onConfirm,
}: {
  test: TestCase;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      aria-describedby="delete-confirm-description"
      id="delete-confirm-dialog"
      data-testid="delete-confirm-dialog"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-11 w-11 rounded-full bg-danger-50 flex items-center justify-center mb-4">
          <AlertTriangle className="h-5.5 w-5.5 text-danger-600" aria-hidden="true" />
        </div>
        <h3 id="delete-confirm-title" className="text-lg font-semibold text-slate-900">
          Delete test case?
        </h3>
        <p id="delete-confirm-description" className="text-sm text-slate-500 mt-1.5">
          This will permanently remove <strong>{test.key} &mdash; {test.title}</strong> from the suite. This action
          cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            type="button"
            id="delete-confirm-cancel-button"
            data-testid="delete-confirm-cancel-button"
            aria-label="Cancel delete"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            id="delete-confirm-submit-button"
            data-testid="delete-confirm-submit-button"
            aria-label="Confirm delete"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-danger-600 text-white text-sm font-medium hover:bg-danger-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
