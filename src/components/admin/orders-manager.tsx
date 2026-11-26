"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import type { AdminData } from "@/lib/data";
import { formatBdt } from "@/lib/utils";

type Order = AdminData["orders"][number];

const statuses = ["pending", "in_progress", "completed", "cancelled"];
const paymentStatuses = ["unpaid", "awaiting_verification", "paid", "failed", "refunded"];

function StatusBadge({ value }: { value: string }) {
  const color = value === "paid" || value === "completed" ? "bg-green-50 text-green-700"
    : value === "failed" || value === "cancelled" ? "bg-red-50 text-red-700"
      : value === "awaiting_verification" || value === "in_progress" ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${color}`}>{value}</span>;
}

export function OrdersManager({ orders, onMutate, onVerify }: {
  orders: Order[];
  onMutate: (path: string, method: "POST" | "PATCH" | "DELETE", body?: Record<string, unknown>) => Promise<void>;
  onVerify: (orderId: string, action: "approve" | "reject" | "revalidate-ssl") => Promise<void>;
}) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { status: string; paymentStatus: string; adminNotes: string }>>({});
  const [busy, setBusy] = useState("");

  const filtered = useMemo(() => orders.filter((order) => filter === "all" || order.status === filter || order.paymentStatus === filter), [orders, filter]);

  function draft(order: Order) {
    return drafts[order.id] ?? { status: order.status, paymentStatus: order.paymentStatus, adminNotes: order.adminNotes };
  }

  async function save(order: Order) {
    setBusy(order.id);
    try {
      await onMutate("/api/admin/orders", "PATCH", { id: order.id, ...draft(order) });
    } finally {
      setBusy("");
    }
  }

  async function verify(order: Order, action: "approve" | "reject" | "revalidate-ssl") {
    setBusy(order.id);
    try {
      await onVerify(order.id, action);
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-heading">Orders & Payment Verification</h2>
          <p className="mt-1 text-sm text-muted">Inspect bKash sender/TrxID, approve or reject payments, revalidate SSLCommerz, and update order status.</p>
        </div>
        <select className="input !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All orders</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto admin-scrollbar">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2 pr-3">Order</th>
              <th className="py-2 pr-3">Customer</th>
              <th className="py-2 pr-3">Package</th>
              <th className="py-2 pr-3">Amount</th>
              <th className="py-2 pr-3">Payment</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted">No orders found.</td></tr>}
            {filtered.map((order) => (
              <tr key={order.id} className="align-top">
                <td className="py-3 pr-3">
                  <button type="button" className="font-bold text-brand hover:underline" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>{order.orderNumber}</button>
                  <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                </td>
                <td className="py-3 pr-3">
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-xs text-muted">{order.customerPhone}</p>
                </td>
                <td className="py-3 pr-3">{order.packageNameEn}</td>
                <td className="py-3 pr-3 font-semibold">{formatBdt(order.amountBdt, "en")}</td>
                <td className="py-3 pr-3"><StatusBadge value={order.paymentStatus} /><p className="mt-1 text-xs text-muted">{order.paymentMethod}</p></td>
                <td className="py-3 pr-3"><StatusBadge value={order.status} /></td>
                <td className="py-3">
                  <button type="button" className="btn btn-outline !px-3 !py-1 text-xs" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expanded && (() => {
        const order = orders.find((item) => item.id === expanded);
        if (!order) return null;
        const current = draft(order);
        return (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-bold text-heading">{order.orderNumber} — {order.customerName}</h3>
              <button type="button" className="text-sm font-semibold text-muted hover:underline" onClick={() => setExpanded(null)}>Close</button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4 text-sm">
                <p className="font-bold text-heading">Customer & project</p>
                <p className="mt-2">Phone: {order.customerPhone}</p>
                <p>Email: {order.customerEmail || "—"}</p>
                <p>Address: {order.customerAddress || "—"}</p>
                <p className="mt-2 whitespace-pre-wrap text-muted">Notes: {order.notes || "—"}</p>
                <p className="mt-2 text-xs text-muted">Language: {order.language}</p>
              </div>
              <div className="rounded-lg bg-white p-4 text-sm">
                <p className="font-bold text-heading">Payment evidence</p>
                {order.paymentMethod === "bkash" ? (
                  <>
                    <p className="mt-2">Sender: <span className="font-semibold">{order.bkashSenderNumber || "—"}</span></p>
                    <p>TrxID: <span className="font-mono font-semibold">{order.bkashTrxId || "—"}</span></p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="btn btn-whatsapp !px-3 !py-1.5 text-xs" disabled={busy === order.id || order.paymentStatus === "paid"} onClick={() => void verify(order, "approve")}><CheckCircle2 className="h-4 w-4" /> Approve bKash</button>
                      <button type="button" className="btn btn-outline !px-3 !py-1.5 text-xs" disabled={busy === order.id} onClick={() => void verify(order, "reject")}><XCircle className="h-4 w-4" /> Reject</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-2">Tran ID: <span className="font-mono">{order.sslTranId || "—"}</span></p>
                    <p>Val ID: <span className="font-mono">{order.sslValId || "—"}</span></p>
                    <p className="break-all text-xs text-muted">Session: {order.sslSessionKey || "—"}</p>
                    <button type="button" className="btn btn-primary mt-3 !px-3 !py-1.5 text-xs" disabled={busy === order.id || !order.sslValId} onClick={() => void verify(order, "revalidate-ssl")}><RefreshCcw className="h-4 w-4" /> Revalidate SSLCommerz</button>
                  </>
                )}
                {order.paidAt && <p className="mt-2 text-xs text-green-700">Paid at {new Date(order.paidAt).toLocaleString()}</p>}
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <span className="label">Order status</span>
                <select className="input" value={current.status} onChange={(e) => setDrafts({ ...drafts, [order.id]: { ...current, status: e.target.value } })}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div>
                <span className="label">Payment status</span>
                <select className="input" value={current.paymentStatus} onChange={(e) => setDrafts({ ...drafts, [order.id]: { ...current, paymentStatus: e.target.value } })}>
                  {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div className="md:col-span-3">
                <span className="label">Admin notes</span>
                <textarea className="input min-h-20" value={current.adminNotes} onChange={(e) => setDrafts({ ...drafts, [order.id]: { ...current, adminNotes: e.target.value } })} />
              </div>
            </div>
            {order.sslValidationJson && (
              <details className="mt-4 rounded-lg bg-white p-3 text-xs">
                <summary className="cursor-pointer font-semibold">SSLCommerz validation response</summary>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">{order.sslValidationJson}</pre>
              </details>
            )}
            <button type="button" className="btn btn-primary mt-4" disabled={busy === order.id} onClick={() => void save(order)}>{busy === order.id ? "Saving…" : "Save order"}</button>
          </div>
        );
      })()}
    </section>
  );
}
