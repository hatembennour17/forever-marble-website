"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Role = "admin" | "staff";
type SessionUser = { sub: string; email: string; role: Role };
type EstimateStatus = "New" | "Contacted" | "Scheduled" | "Won" | "Archived";
type Estimate = { id: string; createdAt: string; name: string; phone: string; email: string; project: string; material: string; message: string; status: EstimateStatus };
type AdminUser = { id: string; email: string; role: Role; active: boolean; createdAt: string };
const statuses: EstimateStatus[] = ["New", "Contacted", "Scheduled", "Won", "Archived"];
const api = "/.netlify/functions";

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${api}/${path}`, { credentials: "same-origin", ...options, headers: { "content-type": "application/json", ...(options?.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Unknown date" : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date); }
function csvEscape(value: string) { return `"${value.replace(/"/g, '""')}"`; }

export default function AdminEstimates() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | EstimateStatus>("All");
  const [tab, setTab] = useState<"estimates" | "users">("estimates");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadEstimates() { const data = await request("estimates"); setEstimates(data.estimates || []); }
  async function loadUsers() { if (session?.role === "admin") { const data = await request("admin-users"); setUsers(data.users || []); } }

  useEffect(() => { request("admin-auth").then((data) => setSession(data.user)).catch(() => setSession(null)).finally(() => setChecking(false)); }, []);
  useEffect(() => { if (session) loadEstimates().catch((e) => setError(e.message)); }, [session]);
  useEffect(() => { if (tab === "users" && session?.role === "admin") loadUsers().catch((e) => setError(e.message)); }, [tab, session]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return estimates.filter((estimate) => (status === "All" || estimate.status === status) && (!normalized || `${estimate.name} ${estimate.phone} ${estimate.email} ${estimate.project} ${estimate.material} ${estimate.message}`.toLowerCase().includes(normalized)));
  }, [estimates, query, status]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try { const data = await request("admin-auth", { method: "POST", body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) }); setSession({ sub: data.user.id, email: data.user.email, role: data.user.role }); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in"); }
    finally { setBusy(false); }
  }

  async function logout() { await request("admin-auth", { method: "DELETE" }); setSession(null); setEstimates([]); setUsers([]); }
  async function updateStatus(id: string, next: EstimateStatus) { await request("estimates", { method: "PATCH", body: JSON.stringify({ id, status: next }) }); setEstimates((items) => items.map((item) => item.id === id ? { ...item, status: next } : item)); }
  async function removeEstimate(id: string) { if (!confirm("Delete this estimate permanently?")) return; await request("estimates", { method: "DELETE", body: JSON.stringify({ id }) }); setEstimates((items) => items.filter((item) => item.id !== id)); }

  async function addUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); const form = new FormData(event.currentTarget);
    try { await request("admin-users", { method: "POST", body: JSON.stringify({ email: form.get("email"), password: form.get("password"), role: form.get("role") }) }); event.currentTarget.reset(); await loadUsers(); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to add user"); } finally { setBusy(false); }
  }

  async function toggleUser(user: AdminUser) { await request("admin-users", { method: "PATCH", body: JSON.stringify({ id: user.id, active: !user.active }) }); await loadUsers(); }
  async function resetPassword(user: AdminUser) { const password = prompt(`Enter a new password for ${user.email} (minimum 8 characters):`); if (!password) return; try { await request("admin-users", { method: "PATCH", body: JSON.stringify({ id: user.id, password }) }); alert("Password updated."); } catch (e) { setError(e instanceof Error ? e.message : "Unable to reset password"); } }

  function exportCsv() {
    const rows = [["Date", "Name", "Phone", "Email", "Project", "Material", "Status", "Message"], ...filtered.map((item) => [formatDate(item.createdAt), item.name, item.phone, item.email, item.project, item.material, item.status, item.message])];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.map(csvEscape).join(",")).join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "forever-marble-estimates.csv"; link.click(); URL.revokeObjectURL(url);
  }

  if (checking) return <section className="admin-section"><div className="shell admin-empty"><h2>Loading admin…</h2></div></section>;
  if (!session) return <section className="admin-section"><div className="shell admin-login"><p className="eyebrow">Secure administration</p><h1>Admin Login</h1><p>Sign in to view estimate requests and manage authorized users.</p><form onSubmit={login}><label>Email<input name="email" type="email" required autoComplete="username" /></label><label>Password<input name="password" type="password" required autoComplete="current-password" /></label>{error ? <p className="admin-error">{error}</p> : null}<button className="button gold" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form></div></section>;

  return <section className="admin-section"><div className="shell">
    <div className="admin-session"><span>Signed in as <b>{session.email}</b></span><button type="button" onClick={logout}>Sign out</button></div>
    <div className="admin-toolbar"><div><p className="eyebrow">Admin dashboard</p><h1>{tab === "estimates" ? "Estimate Requests" : "User Management"}</h1><p>{tab === "estimates" ? "Review shared requests from every browser and update their progress." : "Create staff accounts, assign passwords and control access."}</p></div><div className="admin-stats"><b>{tab === "estimates" ? estimates.length : users.length}</b><span>{tab === "estimates" ? "Total estimates" : "Users"}</span></div></div>
    <div className="admin-tabs"><button className={tab === "estimates" ? "active" : ""} onClick={() => setTab("estimates")}>Estimates</button>{session.role === "admin" ? <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Users</button> : null}</div>
    {error ? <p className="admin-error">{error}</p> : null}
    {tab === "estimates" ? <>
      <div className="admin-controls"><label>Search<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, phone, material..." /></label><label>Status<select value={status} onChange={(e) => setStatus(e.target.value as "All" | EstimateStatus)}><option>All</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><button className="button outline" type="button" onClick={() => loadEstimates()}>Refresh</button><button className="button gold" type="button" onClick={exportCsv} disabled={!filtered.length}>Export CSV</button></div>
      {filtered.length ? <div className="estimate-table-wrap"><table className="estimate-table"><thead><tr><th>Customer</th><th>Project</th><th>Submitted</th><th>Status</th><th>Notes</th><th /></tr></thead><tbody>{filtered.map((estimate) => <tr key={estimate.id}><td><b>{estimate.name}</b><a href={`tel:${estimate.phone}`}>{estimate.phone}</a><a href={`mailto:${estimate.email}`}>{estimate.email}</a></td><td><b>{estimate.project}</b><span>{estimate.material}</span></td><td>{formatDate(estimate.createdAt)}</td><td><select value={estimate.status} onChange={(e) => updateStatus(estimate.id, e.target.value as EstimateStatus)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></td><td>{estimate.message || "No message provided."}</td><td><button onClick={() => removeEstimate(estimate.id)}>Delete</button></td></tr>)}</tbody></table></div> : <div className="admin-empty"><h2>No estimates found</h2><p>New website submissions will appear here automatically.</p></div>}
    </> : <>
      <form className="admin-user-form" onSubmit={addUser}><label>Email<input name="email" type="email" required /></label><label>Temporary password<input name="password" type="password" minLength={8} required /></label><label>Role<select name="role"><option value="staff">Staff</option><option value="admin">Administrator</option></select></label><button className="button gold" disabled={busy}>Add user</button></form>
      <div className="admin-user-list">{users.map((user) => <article key={user.id}><div><b>{user.email}</b><span>{user.role} · {user.active ? "Active" : "Disabled"}</span></div><div><button onClick={() => resetPassword(user)}>Reset password</button><button onClick={() => toggleUser(user)}>{user.active ? "Disable" : "Enable"}</button></div></article>)}</div>
    </>}
  </div></section>;
}
