import { useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import { PlusSquare, Pencil, Trash2, MessageSquare, HelpCircle, Keyboard, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import AddEditTestModal from "../tests/AddEditTestModal";
import DeleteConfirmDialog from "../tests/DeleteConfirmDialog";
import { mockTests } from "../../data/mockTests";

const sampleTest = mockTests[0];

export default function DialogsPage() {
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [confirmResult, setConfirmResult] = useState<string | null>(null);

  return (
    <div id="dialogs-page" data-testid="dialogs-page" className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dialogs &amp; Alerts</h1>
        <p className="text-sm text-slate-500 mt-1">Modals, browser-native alerts, and toast notifications.</p>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Modal Dialogs</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            id="open-add-test-modal-button"
            data-testid="open-add-test-modal-button"
            aria-label="Open add test modal"
            onClick={() => setModalMode("add")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"
          >
            <PlusSquare className="h-4 w-4" aria-hidden="true" /> Open Add Modal
          </button>
          <button
            type="button"
            id="open-edit-test-modal-button"
            data-testid="open-edit-test-modal-button"
            aria-label="Open edit test modal"
            onClick={() => setModalMode("edit")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" /> Open Edit Modal
          </button>
          <button
            type="button"
            id="open-delete-confirm-dialog-button"
            data-testid="open-delete-confirm-dialog-button"
            aria-label="Open delete confirmation dialog"
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-red-200 text-danger-600 text-sm font-medium hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Open Delete Dialog
          </button>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Browser-Native Alerts</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            id="trigger-browser-alert-button"
            data-testid="trigger-browser-alert-button"
            aria-label="Trigger browser alert"
            onClick={() => window.alert("This is a native browser alert from AI Test Management Portal.")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" /> Trigger alert()
          </button>
          <button
            type="button"
            id="trigger-browser-confirm-button"
            data-testid="trigger-browser-confirm-button"
            aria-label="Trigger browser confirm dialog"
            onClick={() => {
              const result = window.confirm("Do you want to archive this test suite?");
              setConfirmResult(result ? "Confirmed" : "Cancelled");
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" /> Trigger confirm()
          </button>
          <button
            type="button"
            id="trigger-browser-prompt-button"
            data-testid="trigger-browser-prompt-button"
            aria-label="Trigger browser prompt dialog"
            onClick={() => {
              const result = window.prompt("Enter a name for the new test suite:", "Regression Suite");
              setPromptResult(result);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
          >
            <Keyboard className="h-4 w-4" aria-hidden="true" /> Trigger prompt()
          </button>
        </div>
        {confirmResult && (
          <p id="confirm-result-text" data-testid="confirm-result-text" className="mt-3 text-sm text-slate-500">
            Confirm result: <span className="font-medium text-slate-700">{confirmResult}</span>
          </p>
        )}
        {promptResult !== null && (
          <p id="prompt-result-text" data-testid="prompt-result-text" className="mt-1 text-sm text-slate-500">
            Prompt result: <span className="font-medium text-slate-700">{promptResult || "(empty / cancelled)"}</span>
          </p>
        )}
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Toast Notifications</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            id="trigger-success-toast-button"
            data-testid="trigger-success-toast-button"
            aria-label="Trigger success toast"
            onClick={() => toast.success("Test suite executed successfully.")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-success-50 text-success-700 text-sm font-medium hover:bg-green-100"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Success Toast
          </button>
          <button
            type="button"
            id="trigger-error-toast-button"
            data-testid="trigger-error-toast-button"
            aria-label="Trigger error toast"
            onClick={() => toast.error("Test execution failed. See logs for details.")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-danger-50 text-danger-700 text-sm font-medium hover:bg-red-100"
          >
            <XCircle className="h-4 w-4" aria-hidden="true" /> Error Toast
          </button>
          <button
            type="button"
            id="trigger-warning-toast-button"
            data-testid="trigger-warning-toast-button"
            aria-label="Trigger warning toast"
            onClick={() => toast.warning("This test suite has flaky test cases.")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-warning-50 text-warning-600 text-sm font-medium hover:bg-amber-100"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Warning Toast
          </button>
          <button
            type="button"
            id="trigger-info-toast-button"
            data-testid="trigger-info-toast-button"
            aria-label="Trigger info toast"
            onClick={() => toast.info("A new build is ready for testing.")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-info-50 text-info-600 text-sm font-medium hover:bg-sky-100"
          >
            <Info className="h-4 w-4" aria-hidden="true" /> Info Toast
          </button>
        </div>
      </section>

      <AnimatePresence>
        {modalMode && (
          <AddEditTestModal
            mode={modalMode}
            initialData={modalMode === "edit" ? sampleTest : undefined}
            onClose={() => setModalMode(null)}
            onSave={() => {}}
          />
        )}
        {showDelete && <DeleteConfirmDialog test={sampleTest} onCancel={() => setShowDelete(false)} onConfirm={() => setShowDelete(false)} />}
      </AnimatePresence>
    </div>
  );
}
