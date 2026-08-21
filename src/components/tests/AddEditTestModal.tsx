import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { modulesList, typesList, prioritiesList, statusesList } from "../../data/mockTests";
import type { TestCase } from "../../types";

interface FormValues {
  title: string;
  module: string;
  type: TestCase["type"];
  priority: TestCase["priority"];
  status: TestCase["status"];
  owner: string;
  automated: boolean;
  description: string;
  scheduledDate: Date | null;
}

interface AddEditTestModalProps {
  mode: "add" | "edit";
  initialData?: TestCase;
  onClose: () => void;
  onSave: (values: FormValues) => void;
}

export default function AddEditTestModal({ mode, initialData, onClose, onSave }: AddEditTestModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title ?? "",
      module: initialData?.module ?? modulesList[0],
      type: initialData?.type ?? typesList[0],
      priority: initialData?.priority ?? "Medium",
      status: initialData?.status ?? "Not Run",
      owner: initialData?.owner ?? "",
      automated: initialData?.automated ?? false,
      description: initialData?.description ?? "",
      scheduledDate: null,
    },
  });

  useEffect(() => {
    reset({
      title: initialData?.title ?? "",
      module: initialData?.module ?? modulesList[0],
      type: initialData?.type ?? typesList[0],
      priority: initialData?.priority ?? "Medium",
      status: initialData?.status ?? "Not Run",
      owner: initialData?.owner ?? "",
      automated: initialData?.automated ?? false,
      description: initialData?.description ?? "",
      scheduledDate: null,
    });
  }, [initialData, reset]);

  const submit = (values: FormValues) => {
    onSave(values);
    toast.success(mode === "add" ? "Test case created successfully." : "Test case updated successfully.");
    onClose();
  };

  const modalTitle = mode === "add" ? "Add Test Case" : "Edit Test Case";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-edit-test-modal-title"
      id={mode === "add" ? "add-test-modal" : "edit-test-modal"}
      data-testid={mode === "add" ? "add-test-modal" : "edit-test-modal"}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 id="add-edit-test-modal-title" className="text-lg font-semibold text-slate-900">
            {modalTitle}
          </h3>
          <button
            type="button"
            id="add-edit-test-modal-close-button"
            data-testid="add-edit-test-modal-close-button"
            aria-label="Close dialog"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form id="add-edit-test-form" data-testid="add-edit-test-form" onSubmit={handleSubmit(submit)} className="px-6 py-5 space-y-5" noValidate>
          <div>
            <label htmlFor="test-title-input" className="block text-sm font-medium text-slate-700 mb-1.5">
              Test title
            </label>
            <input
              id="test-title-input"
              data-testid="test-title-input"
              aria-label="Test title"
              aria-invalid={!!errors.title}
              type="text"
              placeholder="e.g. Verify user can reset password"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              {...register("title", { required: "Title is required", minLength: { value: 8, message: "Title must be at least 8 characters" } })}
            />
            {errors.title && (
              <p data-testid="test-title-error" className="mt-1.5 text-xs text-danger-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="test-module-select" className="block text-sm font-medium text-slate-700 mb-1.5">
                Module
              </label>
              <select
                id="test-module-select"
                data-testid="test-module-select"
                aria-label="Module"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                {...register("module")}
              >
                {modulesList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="test-type-select" className="block text-sm font-medium text-slate-700 mb-1.5">
                Type
              </label>
              <select
                id="test-type-select"
                data-testid="test-type-select"
                aria-label="Test type"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                {...register("type")}
              >
                {typesList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-slate-700 mb-1.5">Priority</legend>
            <div id="test-priority-radio-group" data-testid="test-priority-radio-group" className="flex flex-wrap gap-3">
              {prioritiesList.map((p) => (
                <label
                  key={p}
                  htmlFor={`priority-${p.toLowerCase()}`}
                  className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer"
                >
                  <input
                    id={`priority-${p.toLowerCase()}`}
                    data-testid={`priority-${p.toLowerCase()}`}
                    type="radio"
                    value={p}
                    aria-label={`Priority ${p}`}
                    className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                    {...register("priority")}
                  />
                  {p}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="test-status-select" className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>
              <select
                id="test-status-select"
                data-testid="test-status-select"
                aria-label="Status"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                {...register("status")}
              >
                {statusesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="test-owner-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                Owner
              </label>
              <input
                id="test-owner-input"
                data-testid="test-owner-input"
                aria-label="Owner"
                type="text"
                placeholder="Assignee name"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                {...register("owner", { required: "Owner is required" })}
              />
              {errors.owner && (
                <p data-testid="test-owner-error" className="mt-1.5 text-xs text-danger-600">
                  {errors.owner.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label htmlFor="test-scheduled-date-picker" className="block text-sm font-medium text-slate-700 mb-1.5">
                Scheduled run date
              </label>
              <Controller
                control={control}
                name="scheduledDate"
                render={({ field }) => (
                  <DatePicker
                    id="test-scheduled-date-picker"
                    selected={field.value}
                    onChange={field.onChange}
                    placeholderText="Select a date"
                    dateFormat="MMM d, yyyy"
                    minDate={new Date()}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    aria-label="Scheduled run date"
                    data-testid="test-scheduled-date-picker"
                  />
                )}
              />
            </div>
            <label htmlFor="test-automated-toggle" className="flex items-center gap-2.5 pb-2.5 cursor-pointer select-none">
              <span className="relative inline-flex items-center">
                <input
                  id="test-automated-toggle"
                  data-testid="test-automated-toggle"
                  type="checkbox"
                  role="switch"
                  aria-label="Automated test"
                  className="sr-only peer"
                  {...register("automated")}
                />
                <span className="h-5.5 w-10 rounded-full bg-slate-300 peer-checked:bg-brand-600 transition-colors" />
                <span className="absolute left-0.5 top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4.5" />
              </span>
              <span className="text-sm text-slate-600">Automated</span>
            </label>
          </div>

          <div>
            <label htmlFor="test-description-textarea" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="test-description-textarea"
              data-testid="test-description-textarea"
              aria-label="Description"
              rows={3}
              placeholder="Describe what this test validates..."
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none"
              {...register("description")}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              id="add-edit-test-cancel-button"
              data-testid="add-edit-test-cancel-button"
              aria-label="Cancel"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="add-edit-test-submit-button"
              data-testid="add-edit-test-submit-button"
              aria-label={mode === "add" ? "Create test case" : "Save changes"}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-60"
            >
              {mode === "add" ? "Create test case" : "Save changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
