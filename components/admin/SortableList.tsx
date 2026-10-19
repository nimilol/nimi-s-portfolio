"use client";
// A list you can reorder by dragging the ⋮⋮ handle (works with mouse, touch and keyboard).
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteItem, reorderItems, reorderSections } from "@/app/admin/actions";

export type Row = {
  id: string;
  title: string;
  meta?: string;
  badge?: { text: string; on: boolean };
  thumb?: string | null;
  href: string;
};

export function SortableList({ rows: initial, kind }: { rows: Row[]; kind: "items" | "sections" }) {
  const [rows, setRows] = useState(initial);
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState("");
  const [lastInitial, setLastInitial] = useState(initial);

  // When the server sends fresh rows (after a save), use them.
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setRows(initial);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const from = rows.findIndex((r) => r.id === e.active.id);
    const to = rows.findIndex((r) => r.id === e.over!.id);
    const next = arrayMove(rows, from, to);
    setRows(next);
    setError("");
    startSaving(async () => {
      try {
        const ids = next.map((r) => r.id);
        await (kind === "items" ? reorderItems(ids) : reorderSections(ids));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save the new order.");
      }
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this item? Its uploaded files are deleted too. This can't be undone.")) return;
    startSaving(async () => {
      try {
        await deleteItem(id);
        setRows((r) => r.filter((x) => x.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not delete.");
      }
    });
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <ul className="border-t border-line">
            {rows.map((row) => (
              <SortableRow key={row.id} row={row} onDelete={kind === "items" ? onDelete : undefined} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <p className="mt-3 h-4 text-xs text-muted">{saving ? "Saving…" : error ? "" : rows.length > 1 ? "Drag ⋮⋮ to reorder." : ""}</p>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

function SortableRow({ row, onDelete }: { row: Row; onDelete?: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 border-b border-line bg-bg py-3 ${isDragging ? "relative z-10 opacity-80" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none px-2 py-2 text-muted hover:text-fg active:cursor-grabbing"
        aria-label={`Drag to reorder ${row.title}`}
      >
        ⋮⋮
      </button>
      {row.thumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.thumb} alt="" className="h-10 w-10 shrink-0 border border-line object-cover" />
      )}
      <Link href={row.href} className="min-w-0 flex-1 hover:text-accent">
        <span className="block truncate">{row.title || "(untitled)"}</span>
        {row.meta && <span className="block truncate text-xs text-muted">{row.meta}</span>}
        {row.badge && (
          <span className={`mt-1 block text-xs sm:hidden ${row.badge.on ? "text-accent" : "text-muted"}`}>{row.badge.text}</span>
        )}
      </Link>
      {row.badge && (
        <span className={`hidden shrink-0 border px-2 py-0.5 text-xs sm:inline ${row.badge.on ? "border-accent/50 text-accent" : "border-line text-muted"}`}>
          {row.badge.text}
        </span>
      )}
      <Link href={row.href} className="px-2 text-sm text-muted hover:text-fg">
        Edit
      </Link>
      {onDelete && (
        <button type="button" onClick={() => onDelete(row.id)} className="px-2 text-sm text-muted hover:text-red-400">
          Delete
        </button>
      )}
    </li>
  );
}
