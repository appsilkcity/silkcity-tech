"use client";

import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from "lucide-react";

export type AdminRecord = Record<string, unknown> & { id: string };

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "list" | "url" | "color";
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
  placeholder?: string;
  wide?: boolean;
}

interface EntityManagerProps {
  title: string;
  description?: string;
  resource: string;
  items: AdminRecord[];
  fields: FieldConfig[];
  defaults: Record<string, unknown>;
  summaryField?: string;
  allowCreate?: boolean;
  onMutate: (path: string, method: "POST" | "PATCH" | "DELETE", body?: Record<string, unknown>) => Promise<void>;
}

function toFormValues(item: AdminRecord | null, fields: FieldConfig[], defaults: Record<string, unknown>) {
  const source = item ?? defaults;
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    const value = source[field.name] ?? defaults[field.name] ?? (field.type === "checkbox" ? false : field.type === "number" ? 0 : "");
    values[field.name] = field.type === "list" && Array.isArray(value) ? value.join("\n") : value;
  }
  return values;
}

export function EntityManager({ title, description, resource, items, fields, defaults, summaryField = "titleEn", allowCreate = true, onMutate }: EntityManagerProps) {
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function openCreate() {
    setEditing(null);
    setCreating(true);
    setValues(toFormValues(null, fields, defaults));
    setError("");
  }

  function openEdit(item: AdminRecord) {
    setCreating(false);
    setEditing(item);
    setValues(toFormValues(item, fields, defaults));
    setError("");
  }

  function close() {
    setEditing(null);
    setCreating(false);
    setError("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body: Record<string, unknown> = {};
      for (const field of fields) {
        const raw = values[field.name];
        if (field.type === "list") body[field.name] = String(raw ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
        else if (field.type === "number") body[field.name] = Number(raw ?? 0);
        else if (field.type === "checkbox") body[field.name] = Boolean(raw);
        else body[field.name] = raw ?? "";
      }
      if (editing) await onMutate(`/api/admin/${resource}`, "PATCH", { id: editing.id, ...body });
      else await onMutate(`/api/admin/${resource}`, "POST", body);
      close();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = items[index + direction];
    const current = items[index];
    if (!target || !current) return;
    const currentOrder = Number(current.sortOrder ?? index);
    const targetOrder = Number(target.sortOrder ?? index + direction);
    await onMutate(`/api/admin/${resource}`, "PATCH", { id: current.id, sortOrder: targetOrder });
    await onMutate(`/api/admin/${resource}`, "PATCH", { id: target.id, sortOrder: currentOrder === targetOrder ? currentOrder + 1 : currentOrder });
  }

  async function remove(item: AdminRecord) {
    if (!window.confirm(`Delete this ${title.toLowerCase()} item? This cannot be undone.`)) return;
    await onMutate(`/api/admin/${resource}?id=${encodeURIComponent(item.id)}`, "DELETE");
  }

  const sorted = [...items].sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-heading">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {allowCreate && <button type="button" className="btn btn-primary !py-2 text-sm" onClick={openCreate}><Plus className="h-4 w-4" /> Add</button>}
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {sorted.length === 0 && <p className="py-6 text-center text-sm text-muted">No items yet.</p>}
        {sorted.map((item, index) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-heading">{String(item[summaryField] ?? item.nameEn ?? item.labelEn ?? item.id)}</p>
              <p className="text-xs text-muted">
                Order {String(item.sortOrder ?? "—")}
                {"visible" in item && <span className={`ml-2 rounded-full px-2 py-0.5 font-semibold ${item.visible ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>{item.visible ? "Visible" : "Hidden"}</span>}
                {"enabled" in item && <span className={`ml-2 rounded-full px-2 py-0.5 font-semibold ${item.enabled ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>{item.enabled ? "Enabled" : "Disabled"}</span>}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {"sortOrder" in item && (
                <>
                  <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30" disabled={index === 0} onClick={() => void move(index, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30" disabled={index === sorted.length - 1} onClick={() => void move(index, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
                </>
              )}
              <button type="button" className="rounded-lg p-2 text-brand hover:bg-blue-50" onClick={() => openEdit(item)} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button type="button" className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => void remove(item)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
          <form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-heading">{editing ? "Edit" : "Add"} {title}</h3>
              <button type="button" onClick={close} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={field.wide || field.type === "textarea" || field.type === "list" ? "sm:col-span-2" : ""}>
                  {field.type === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <input type="checkbox" checked={Boolean(values[field.name])} onChange={(e) => setValues({ ...values, [field.name]: e.target.checked })} />
                      {field.label}
                    </label>
                  ) : (
                    <>
                      <label className="label" htmlFor={`field-${field.name}`}>{field.label}{field.required ? " *" : ""}</label>
                      {field.type === "textarea" || field.type === "list" ? (
                        <textarea id={`field-${field.name}`} className="input min-h-24" required={field.required} placeholder={field.placeholder ?? (field.type === "list" ? "One item per line" : "")} value={String(values[field.name] ?? "")} onChange={(e) => setValues({ ...values, [field.name]: e.target.value })} />
                      ) : field.type === "select" ? (
                        <select id={`field-${field.name}`} className="input" required={field.required} value={String(values[field.name] ?? "")} onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}>
                          {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      ) : (
                        <input id={`field-${field.name}`} type={field.type === "number" ? "number" : field.type === "color" ? "color" : field.type === "url" ? "url" : "text"} className="input" required={field.required} placeholder={field.placeholder} value={String(values[field.name] ?? "")} onChange={(e) => setValues({ ...values, [field.name]: e.target.value })} />
                      )}
                      {field.help && <p className="mt-1 text-xs text-muted">{field.help}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
