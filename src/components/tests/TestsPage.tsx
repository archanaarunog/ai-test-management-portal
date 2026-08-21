import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import { mockTests } from "../../data/mockTests";
import type { TestCase } from "../../types";
import TestFilters, { defaultFilters, type FiltersState } from "./TestFilters";
import TestsTable from "./TestsTable";
import AddEditTestModal from "./AddEditTestModal";
import ViewTestModal from "./ViewTestModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function TestsPage() {
  const [tests, setTests] = useState<TestCase[]>(mockTests);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [activeTest, setActiveTest] = useState<TestCase | null>(null);
  const [viewingTest, setViewingTest] = useState<TestCase | null>(null);
  const [deletingTest, setDeletingTest] = useState<TestCase | null>(null);

  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const matchesSearch =
        filters.search.trim() === "" ||
        t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.key.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.owner.toLowerCase().includes(filters.search.toLowerCase());
      const matchesModule = filters.module === "All Modules" || t.module === filters.module;
      const matchesType = filters.types.length === 0 || filters.types.includes(t.type);
      const matchesAutomated = !filters.automatedOnly || t.automated;
      return matchesSearch && matchesModule && matchesType && matchesAutomated;
    });
  }, [tests, filters]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const handleSave = (values: {
    title: string;
    module: string;
    type: TestCase["type"];
    priority: TestCase["priority"];
    status: TestCase["status"];
    owner: string;
    automated: boolean;
    description: string;
  }) => {
    if (modalMode === "add") {
      const newTest: TestCase = {
        id: `tc-new-${Date.now()}`,
        key: `QA-${1030 + tests.length}`,
        title: values.title,
        module: values.module,
        type: values.type,
        priority: values.priority,
        status: values.status,
        owner: values.owner,
        automated: values.automated,
        lastRun: "Not yet run",
        duration: "-",
        tags: ["new"],
        description: values.description || "No description provided.",
        steps: [{ id: `new-${Date.now()}-s1`, action: "Define test steps", expectedResult: "Pending author input" }],
      };
      setTests((prev) => [newTest, ...prev]);
    } else if (modalMode === "edit" && activeTest) {
      setTests((prev) =>
        prev.map((t) => (t.id === activeTest.id ? { ...t, ...values, description: values.description || t.description } : t))
      );
    }
    setModalMode(null);
    setActiveTest(null);
  };

  const handleExecute = (test: TestCase) => {
    toast.info(`Running ${test.key}...`);
    setTimeout(() => {
      const passed = Math.random() > 0.25;
      setTests((prev) => prev.map((t) => (t.id === test.id ? { ...t, status: passed ? "Passed" : "Failed", lastRun: "Just now" } : t)));
      passed ? toast.success(`${test.key} passed.`) : toast.error(`${test.key} failed.`);
    }, 1200);
  };

  const handleDeleteConfirmed = () => {
    if (!deletingTest) return;
    setTests((prev) => prev.filter((t) => t.id !== deletingTest.id));
    toast.success(`${deletingTest.key} deleted.`);
    setDeletingTest(null);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Delete ${selectedIds.size} selected test case(s)? This cannot be undone.`)) {
      setTests((prev) => prev.filter((t) => !selectedIds.has(t.id)));
      toast.success(`${selectedIds.size} test case(s) deleted.`);
      setSelectedIds(new Set());
    }
  };

  return (
    <div id="tests-page" data-testid="tests-page" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Test Cases</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, execute, and review automated and manual test cases.</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              type="button"
              id="bulk-delete-button"
              data-testid="bulk-delete-button"
              aria-label={`Delete ${selectedIds.size} selected test cases`}
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-red-200 text-danger-600 text-sm font-medium hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete ({selectedIds.size})
            </button>
          )}
          <button
            type="button"
            id="add-test-button"
            data-testid="add-test-button"
            aria-label="Add new test case"
            onClick={() => {
              setModalMode("add");
              setActiveTest(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Test Case
          </button>
        </div>
      </div>

      <TestFilters filters={filters} onChange={setFilters} />

      <TestsTable
        data={filteredTests}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onView={setViewingTest}
        onEdit={(t) => {
          setActiveTest(t);
          setModalMode("edit");
        }}
        onExecute={handleExecute}
        onDelete={setDeletingTest}
      />

      <AnimatePresence>
        {modalMode && (
          <AddEditTestModal
            mode={modalMode}
            initialData={activeTest ?? undefined}
            onClose={() => {
              setModalMode(null);
              setActiveTest(null);
            }}
            onSave={handleSave}
          />
        )}
        {viewingTest && <ViewTestModal test={viewingTest} onClose={() => setViewingTest(null)} />}
        {deletingTest && (
          <DeleteConfirmDialog test={deletingTest} onCancel={() => setDeletingTest(null)} onConfirm={handleDeleteConfirmed} />
        )}
      </AnimatePresence>
    </div>
  );
}
