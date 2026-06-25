"use client";

import { useEffect, useMemo, useState } from "react";

type EstimateStatus = "New" | "Contacted" | "Scheduled" | "Won" | "Archived";

type Estimate = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  project: string;
  material: string;
  message: string;
  status?: EstimateStatus;
};

const storageKey = "foreverMarbleEstimates";
const statuses: EstimateStatus[] = ["New", "Contacted", "Scheduled", "Won", "Archived"];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function AdminEstimates() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | EstimateStatus>("All");

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      setEstimates(Array.isArray(stored) ? stored : []);
    } catch {
      setEstimates([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(estimates));
  }, [estimates]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return estimates.filter((estimate) => {
      const matchesStatus = status === "All" || (estimate.status || "New") === status;
      const haystack = `${estimate.name} ${estimate.phone} ${estimate.email} ${estimate.project} ${estimate.material} ${estimate.message}`.toLowerCase();
      const matchesQuery = !normalized || haystack.includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [estimates, query, status]);

  function updateStatus(id: string, nextStatus: EstimateStatus) {
    setEstimates((items) => items.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
  }

  function removeEstimate(id: string) {
    setEstimates((items) => items.filter((item) => item.id !== id));
  }

  function seedDemoEstimate() {
    const demo: Estimate = {
      id: `FM-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: "Demo Customer",
      phone: "(215) 203-8666",
      email: "demo@example.com",
      project: "Kitchen",
      material: "Quartz",
      message: "Demo estimate so you can preview the admin page layout.",
      status: "New",
    };
    setEstimates((items) => [demo, ...items]);
  }

  function exportCsv() {
    const rows = [
      ["Date", "Name", "Phone", "Email", "Project", "Material", "Status", "Message"],
      ...filtered.map((estimate) => [
        formatDate(estimate.createdAt),
        estimate.name,
        estimate.phone,
        estimate.email,
        estimate.project,
        estimate.material,
        estimate.status || "New",
        estimate.message,
      ]),
    ];
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "forever-marble-estimates.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="admin-section">
      <div className="shell">
        <div className="admin-toolbar">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1>Estimate Requests</h1>
            <p>Review saved estimate requests, update their status, and export a CSV copy.</p>
          </div>
          <div className="admin-stats">
            <b>{estimates.length}</b>
            <span>Total estimates</span>
          </div>
        </div>

        <div className="admin-controls">
          <label>
            Search
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, phone, material..." />
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value as "All" | EstimateStatus)}>
              <option>All</option>
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <button className="button outline" type="button" onClick={seedDemoEstimate}>
            Add demo
          </button>
          <button className="button gold" type="button" onClick={exportCsv} disabled={!filtered.length}>
            Export CSV
          </button>
        </div>

        {filtered.length ? (
          <div className="estimate-table-wrap">
            <table className="estimate-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Project</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((estimate) => (
                  <tr key={estimate.id}>
                    <td>
                      <b>{estimate.name}</b>
                      <a href={`tel:${estimate.phone}`}>{estimate.phone}</a>
                      <a href={`mailto:${estimate.email}`}>{estimate.email}</a>
                    </td>
                    <td>
                      <b>{estimate.project}</b>
                      <span>{estimate.material}</span>
                    </td>
                    <td>{formatDate(estimate.createdAt)}</td>
                    <td>
                      <select value={estimate.status || "New"} onChange={(event) => updateStatus(estimate.id, event.target.value as EstimateStatus)}>
                        {statuses.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </td>
                    <td>{estimate.message || "No message provided."}</td>
                    <td>
                      <button type="button" onClick={() => removeEstimate(estimate.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <h2>No estimates yet</h2>
            <p>Submit the contact form once, or click “Add demo,” and the request will appear here.</p>
          </div>
        )}

        <div className="admin-note">
          <b>Important:</b> this version stores estimates in this browser only. For live customer requests from every device, connect the form to a database, CRM, or form service.
        </div>
      </div>
    </section>
  );
}
