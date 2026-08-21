import { useRef, useState } from "react";
import { GripVertical, UploadCloud, MoveHorizontal, Copy, Pencil, Archive, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const initialItems = [
  { id: "d-1", label: "Verify login flow" },
  { id: "d-2", label: "Verify checkout flow" },
  { id: "d-3", label: "Verify search flow" },
  { id: "d-4", label: "Verify profile update flow" },
];

export default function MouseActionsPage() {
  const [items, setItems] = useState(initialItems);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropHighlight, setDropHighlight] = useState<string | null>(null);
  const [droppedFile, setDroppedFile] = useState<string | null>(null);
  const [dblClickCount, setDblClickCount] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null);
  const [panelWidth, setPanelWidth] = useState(280);
  const resizing = useRef(false);

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDropHighlight(id);
  };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDropHighlight(null);
    if (!dragId || dragId === targetId) return;
    setItems((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((i) => i.id === dragId);
      const toIdx = next.findIndex((i) => i.id === targetId);
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    toast.info("Priority order updated.");
    setDragId(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setDroppedFile(file.name);
      toast.success(`${file.name} dropped successfully.`);
    }
  };

  const startResize = () => {
    resizing.current = true;
    const onMove = (e: MouseEvent) => {
      if (!resizing.current) return;
      setPanelWidth(Math.min(480, Math.max(180, e.clientX - 24)));
    };
    const onUp = () => {
      resizing.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div id="mouse-actions-page" data-testid="mouse-actions-page" className="space-y-5" onClick={() => setContextMenu(null)}>
      <div>
        <h1 className="text-xl font-bold text-slate-900">Mouse Actions</h1>
        <p className="text-sm text-slate-500 mt-1">Drag &amp; drop, hover, right-click, double-click, and resize interactions.</p>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Drag &amp; Drop Reorder</h2>
        <p className="text-xs text-slate-400 mb-4">Drag priority queue items to reorder them.</p>
        <ul id="drag-drop-list" data-testid="drag-drop-list" className="space-y-2 max-w-md">
          {items.map((item, idx) => (
            <li
              key={item.id}
              id={`drag-item-${item.id}`}
              data-testid={`drag-item-${item.id}`}
              draggable
              aria-label={`Drag to reorder: ${item.label}`}
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragLeave={() => setDropHighlight(null)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-lg border cursor-grab active:cursor-grabbing transition-colors ${
                dropHighlight === item.id ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-slate-50"
              }`}
            >
              <GripVertical className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}</span>
              <span className="text-sm text-slate-700">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Drag &amp; Drop File Upload</h2>
        <p className="text-xs text-slate-400 mb-4">Drop a test data file to attach it to the current run.</p>
        <div
          id="mouse-file-dropzone"
          data-testid="mouse-file-dropzone"
          role="button"
          tabIndex={0}
          aria-label="Drop zone for test data file"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-slate-300 rounded-xl px-6 py-6 text-center max-w-sm hover:border-brand-400 hover:bg-brand-50/30"
        >
          <UploadCloud className="h-6 w-6 text-slate-400 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm text-slate-500">Drag a file here to drop it</p>
        </div>
        {droppedFile && (
          <p data-testid="dropped-file-name" className="mt-2.5 text-sm text-slate-600">
            Attached: <span className="font-medium">{droppedFile}</span>
          </p>
        )}
      </section>

      <div className="grid sm:grid-cols-2 gap-5">
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Hover Menu</h2>
          <div className="relative inline-block group">
            <button
              type="button"
              id="hover-menu-trigger"
              data-testid="hover-menu-trigger"
              aria-label="Hover to reveal quick actions"
              aria-haspopup="true"
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600"
            >
              Hover for quick actions
            </button>
            <div
              id="hover-menu-panel"
              data-testid="hover-menu-panel"
              role="menu"
              className="absolute left-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10"
            >
              <button type="button" id="hover-menu-item-clone" data-testid="hover-menu-item-clone" role="menuitem" className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Clone
              </button>
              <button type="button" id="hover-menu-item-rename" data-testid="hover-menu-item-rename" role="menuitem" className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Rename
              </button>
              <button type="button" id="hover-menu-item-archive" data-testid="hover-menu-item-archive" role="menuitem" className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Archive className="h-3.5 w-3.5" aria-hidden="true" /> Archive
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Double-Click Action</h2>
          <button
            type="button"
            id="double-click-button"
            data-testid="double-click-button"
            aria-label="Double-click to increment counter"
            onDoubleClick={() => setDblClickCount((c) => c + 1)}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 select-none"
          >
            Double-click me
          </button>
          <p className="mt-2.5 text-sm text-slate-500">
            Count: <span data-testid="double-click-count" className="font-medium text-slate-700">{dblClickCount}</span>
          </p>
        </section>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Right-Click Context Menu</h2>
        <p className="text-xs text-slate-400 mb-4">Right-click the row below to open a context menu.</p>
        <div
          id="context-menu-target"
          data-testid="context-menu-target"
          role="button"
          tabIndex={0}
          aria-label="Right-click for context menu"
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({ x: e.clientX, y: e.clientY, id: "ctx-1" });
          }}
          className="px-4 py-4 rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 max-w-md text-center"
        >
          QA-1001 &middot; Verify user can log in with valid credentials
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Resizable Panel</h2>
        <p className="text-xs text-slate-400 mb-4">Drag the handle to resize the panel below.</p>
        <div className="flex items-stretch border border-slate-200 rounded-lg overflow-hidden max-w-2xl h-40">
          <div id="resizable-panel" data-testid="resizable-panel" style={{ width: panelWidth }} className="bg-brand-50 p-4 text-xs text-brand-700 overflow-hidden">
            Panel width: <span data-testid="resizable-panel-width">{panelWidth}</span>px
          </div>
          <div
            id="resizable-panel-handle"
            data-testid="resizable-panel-handle"
            role="separator"
            aria-label="Resize panel"
            aria-orientation="vertical"
            onMouseDown={startResize}
            className="w-2 bg-slate-200 hover:bg-brand-400 cursor-col-resize flex items-center justify-center"
          >
            <MoveHorizontal className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          </div>
          <div className="flex-1 bg-white p-4 text-xs text-slate-400">Remaining content area</div>
        </div>
      </section>

      {contextMenu && (
        <ul
          id="context-menu-panel"
          data-testid="context-menu-panel"
          role="menu"
          style={{ position: "fixed", top: contextMenu.y, left: contextMenu.x }}
          className="bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 w-40 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <li>
            <button type="button" id="context-menu-view" data-testid="context-menu-view" role="menuitem" className="w-full text-left px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
              View details
            </button>
          </li>
          <li>
            <button type="button" id="context-menu-edit" data-testid="context-menu-edit" role="menuitem" className="w-full text-left px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Edit
            </button>
          </li>
          <li>
            <button
              type="button"
              id="context-menu-delete"
              data-testid="context-menu-delete"
              role="menuitem"
              className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-danger-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
