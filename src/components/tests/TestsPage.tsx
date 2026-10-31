import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import type { TestCase } from "../../types";
import TestFilters, { defaultFilters, type FiltersState } from "./TestFilters";
import TestsTable from "./TestsTable";
import AddEditTestModal from "./AddEditTestModal";
import ViewTestModal from "./ViewTestModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function TestsPage() {
  const [tests, setTests] = useState<TestCase[]>([]);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [activeTest, setActiveTest] = useState<TestCase | null>(null);
  const [viewingTest, setViewingTest] = useState<TestCase | null>(null);
  const [deletingTest, setDeletingTest] = useState<TestCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async (current = filters) => {
    setLoading(true); setError(null);
    try {
      const result = await api.tests.list({ search: current.search || undefined, module: current.module === "All Modules" ? undefined : current.module, types: current.types, automated: current.automatedOnly, page: 1, page_size: 100 });
      setTests(current.types.length > 1 ? result.items.filter(test => current.types.includes(test.type)) : result.items);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load test cases"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(filters); }, [filters.search, filters.module, filters.types.join(","), filters.automatedOnly]);

  const toggleSelect = (id: string) => setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const toggleSelectAll = (ids: string[]) => setSelectedIds(prev => { const all = ids.every(id => prev.has(id)); const next = new Set(prev); ids.forEach(id => all ? next.delete(id) : next.add(id)); return next; });
  const handleSave = async (values: { title: string; module: string; type: TestCase["type"]; priority: TestCase["priority"]; status: TestCase["status"]; owner: string; automated: boolean; description: string }): Promise<boolean> => {
    try {
      const data = { ...values, tags: activeTest?.tags ?? [], steps: activeTest?.steps ?? [] };
      if (modalMode === "add") await api.tests.create(data);
      else if (modalMode === "edit" && activeTest) await api.tests.update(activeTest.id, data);
      toast.success(modalMode === "add" ? "Test case created." : "Test case updated.");
      setModalMode(null); setActiveTest(null); await refresh();
      return true;
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not save test case"); return false; }
  };
  const handleExecute = async (test: TestCase) => {
    try { await api.tests.execute(test.id); toast.success(`${test.key} execution recorded.`); await refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not execute test"); }
  };
  const handleDeleteConfirmed = async () => {
    if (!deletingTest) return;
    try { await api.tests.remove(deletingTest.id); toast.success(`${deletingTest.key} deleted.`); setDeletingTest(null); await refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not delete test"); }
  };
  const handleBulkDelete = async () => {
    if (!selectedIds.size || !window.confirm(`Delete ${selectedIds.size} selected test case(s)? This cannot be undone.`)) return;
    try { await Promise.all([...selectedIds].map(id => api.tests.remove(id))); toast.success(`${selectedIds.size} test case(s) deleted.`); setSelectedIds(new Set()); await refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not delete selected tests"); await refresh(); }
  };

  return <div id="tests-page" data-testid="tests-page" className="space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h1 className="text-xl font-bold text-slate-900">Test Cases</h1><p className="text-sm text-slate-500 mt-1">Manage, execute, and review automated and manual test cases.</p></div><div className="flex items-center gap-2">
      {selectedIds.size > 0 && <button type="button" id="bulk-delete-button" data-testid="bulk-delete-button" aria-label={`Delete ${selectedIds.size} selected test cases`} onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-red-200 text-danger-600 text-sm font-medium hover:bg-red-50"><Trash2 className="h-4 w-4" aria-hidden="true" />Delete ({selectedIds.size})</button>}
      <button type="button" id="add-test-button" data-testid="add-test-button" aria-label="Add new test case" onClick={() => { setModalMode("add"); setActiveTest(null); }} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"><Plus className="h-4 w-4" aria-hidden="true" />Add Test Case</button>
    </div></div>
    <TestFilters filters={filters} onChange={setFilters} />
    {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}<button className="ml-3 underline" onClick={() => void refresh()}>Retry</button></div>}
    {loading ? <div data-testid="tests-loading" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading test cases…</div> : <TestsTable data={tests} selectedIds={selectedIds} onToggleSelect={toggleSelect} onToggleSelectAll={toggleSelectAll} onView={setViewingTest} onEdit={t => { setActiveTest(t); setModalMode("edit"); }} onExecute={handleExecute} onDelete={setDeletingTest} />}
    <AnimatePresence>
      {modalMode && <AddEditTestModal mode={modalMode} initialData={activeTest ?? undefined} onClose={() => { setModalMode(null); setActiveTest(null); }} onSave={handleSave} />}
      {viewingTest && <ViewTestModal test={viewingTest} onClose={() => setViewingTest(null)} />}
      {deletingTest && <DeleteConfirmDialog test={deletingTest} onCancel={() => setDeletingTest(null)} onConfirm={handleDeleteConfirmed} />}
    </AnimatePresence>
  </div>;
}
