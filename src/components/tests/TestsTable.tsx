import { useMemo, useState, Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  Eye,
  Pencil,
  Play,
  Trash2,
  ChevronDown as ChevronExpand,
} from "lucide-react";
import type { TestCase } from "../../types";

const statusStyles: Record<TestCase["status"], string> = {
  Passed: "bg-success-50 text-success-700 border-success-500/20",
  Failed: "bg-danger-50 text-danger-700 border-danger-500/20",
  Blocked: "bg-warning-50 text-warning-600 border-warning-500/20",
  "Not Run": "bg-slate-100 text-slate-500 border-slate-300",
  "In Progress": "bg-info-50 text-info-600 border-info-500/20",
};

const priorityStyles: Record<TestCase["priority"], string> = {
  Critical: "text-danger-600",
  High: "text-warning-600",
  Medium: "text-brand-600",
  Low: "text-slate-500",
};

interface TestsTableProps {
  data: TestCase[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[]) => void;
  onView: (test: TestCase) => void;
  onEdit: (test: TestCase) => void;
  onExecute: (test: TestCase) => void;
  onDelete: (test: TestCase) => void;
}

const columnHelper = createColumnHelper<TestCase>();

export default function TestsTable({
  data,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onExecute,
  onDelete,
}: TestsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(8);

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("key", {
        header: "Key",
        cell: (info) => <span className="font-mono text-xs text-slate-500">{info.getValue()}</span>,
      }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => (
          <div>
            <p className="text-sm font-medium text-slate-800 line-clamp-1">{info.getValue()}</p>
            <p className="text-xs text-slate-400">{info.row.original.module}</p>
          </div>
        ),
      }),
      columnHelper.accessor("type", { header: "Type" }),
      columnHelper.accessor("priority", {
        header: "Priority",
        cell: (info) => <span className={`text-xs font-semibold ${priorityStyles[info.getValue()]}`}>{info.getValue()}</span>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span
            data-testid={`status-badge-${info.row.original.id}`}
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusStyles[info.getValue()]}`}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("owner", { header: "Owner" }),
      columnHelper.accessor("lastRun", { header: "Last Run", cell: (info) => <span className="text-xs text-slate-500">{info.getValue()}</span> }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  useMemo(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const pageRows = table.getRowModel().rows;
  const allVisibleIds = pageRows.map((r) => r.original.id);
  const allVisibleSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

  return (
    <div id="tests-table-container" data-testid="tests-table-container" className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto max-h-[560px] overflow-y-auto scrollbar-thin">
        <table id="tests-table" data-testid="tests-table" className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-10 px-3 py-3">
                <input
                  id="select-all-tests-checkbox"
                  data-testid="select-all-tests-checkbox"
                  type="checkbox"
                  aria-label="Select all visible test cases"
                  checked={allVisibleSelected}
                  onChange={() => onToggleSelectAll(allVisibleIds)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </th>
              <th className="w-8" />
              {table.getFlatHeaders().map((header) => {
                const sortState = header.column.getIsSorted();
                return (
                  <th key={header.id} className="px-3 py-3 text-left">
                    <button
                      type="button"
                      id={`sort-header-${header.column.id}`}
                      data-testid={`sort-header-${header.column.id}`}
                      aria-label={`Sort by ${header.column.id}`}
                      onClick={header.column.getToggleSortingHandler()}
                      className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sortState === "asc" && <ArrowUp className="h-3 w-3" aria-hidden="true" />}
                      {sortState === "desc" && <ArrowDown className="h-3 w-3" aria-hidden="true" />}
                      {!sortState && <ArrowUpDown className="h-3 w-3 opacity-40" aria-hidden="true" />}
                    </button>
                  </th>
                );
              })}
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody data-testid="tests-table-body">
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400" data-testid="tests-table-empty-state">
                  No test cases match your filters. Try adjusting search or filters.
                </td>
              </tr>
            )}
            {pageRows.map((row) => {
              const test = row.original;
              const expanded = expandedRows.has(test.id);
              return (
                <Fragment key={row.id}>
                  <tr
                    id={`test-row-${test.id}`}
                    data-testid={`test-row-${test.id}`}
                    className={`border-b border-slate-100 hover:bg-slate-50 ${selectedIds.has(test.id) ? "bg-brand-50/40" : ""}`}
                  >
                    <td className="px-3 py-3">
                      <input
                        id={`select-test-${test.id}`}
                        data-testid={`select-test-${test.id}`}
                        type="checkbox"
                        aria-label={`Select test ${test.key}`}
                        checked={selectedIds.has(test.id)}
                        onChange={() => onToggleSelect(test.id)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                    <td className="px-1 py-3">
                      <button
                        type="button"
                        id={`expand-row-${test.id}`}
                        data-testid={`expand-row-${test.id}`}
                        aria-label={expanded ? `Collapse details for ${test.key}` : `Expand details for ${test.key}`}
                        aria-expanded={expanded}
                        onClick={() => toggleExpand(test.id)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-400"
                      >
                        {expanded ? <ChevronExpand className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </td>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-3 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          id={`view-test-${test.id}`}
                          data-testid={`view-test-${test.id}`}
                          aria-label={`View ${test.key}`}
                          title="View"
                          onClick={() => onView(test)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          id={`edit-test-${test.id}`}
                          data-testid={`edit-test-${test.id}`}
                          aria-label={`Edit ${test.key}`}
                          title="Edit"
                          onClick={() => onEdit(test)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          id={`execute-test-${test.id}`}
                          data-testid={`execute-test-${test.id}`}
                          aria-label={`Execute ${test.key}`}
                          title="Execute"
                          onClick={() => onExecute(test)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-success-600 hover:bg-success-50"
                        >
                          <Play className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          id={`delete-test-${test.id}`}
                          data-testid={`delete-test-${test.id}`}
                          aria-label={`Delete ${test.key}`}
                          title="Delete"
                          onClick={() => onDelete(test)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-danger-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded && (
                    <tr id={`expanded-row-${test.id}`} data-testid={`expanded-row-${test.id}`} className="bg-slate-50/70 border-b border-slate-100">
                      <td colSpan={9} className="px-8 py-4">
                        <p className="text-xs text-slate-500 mb-3">{test.description}</p>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Test Steps</p>
                        <ol className="space-y-1.5">
                          {test.steps.map((step, idx) => (
                            <li key={step.id} className="text-xs text-slate-600 flex gap-2">
                              <span className="font-semibold text-slate-400">{idx + 1}.</span>
                              <span>
                                <span className="font-medium text-slate-700">{step.action}</span> &rarr; {step.expectedResult}
                              </span>
                            </li>
                          ))}
                        </ol>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {test.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] text-slate-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div id="tests-table-pagination" data-testid="tests-table-pagination" className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>
            Page <span data-testid="current-page-number" className="font-medium text-slate-700">{table.getState().pagination.pageIndex + 1}</span> of{" "}
            <span data-testid="total-page-count">{table.getPageCount() || 1}</span> &middot; {data.length} results
          </span>
          <select
            id="page-size-select"
            name="pageSize"
            data-testid="page-size-select"
            aria-label="Rows per page"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="ml-2 rounded-lg border border-slate-300 px-2 py-1 text-xs"
          >
            {[5, 8, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="pagination-prev-button"
            data-testid="pagination-prev-button"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className="p-1.5 rounded-lg border border-slate-300 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            id="pagination-next-button"
            data-testid="pagination-next-button"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            className="p-1.5 rounded-lg border border-slate-300 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
