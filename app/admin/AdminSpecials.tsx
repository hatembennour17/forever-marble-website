"use client";

import { useEffect, useState, type FormEvent } from "react";
import { imagePayload } from "@/app/lib/image-upload";
import { formatPrice, type Special } from "@/app/lib/specials";
import { usePhotos } from "@/app/components/ManagedImage";

function SpecialEditor({ deal, busy, save }: { deal?: Special; busy: boolean; save: (values: Record<string, unknown>) => Promise<boolean> }) {
  const [name, setName] = useState(deal?.name || "");
  const [before, setBefore] = useState(deal?.before?.toFixed(2) || "");
  const [price, setPrice] = useState(deal?.price.toFixed(2) || "");
  const [minimum, setMinimum] = useState(String(deal?.minimumSqFt ?? 50));
  const [alt, setAlt] = useState(deal?.alt || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const photos = usePhotos();
  const existingImage = photos.find((photo) => photo.originalSrc === deal?.image)?.src || deal?.image;
  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setPreparing(true); setError("");
    try {
      if (!deal && !file) throw new Error("Choose a photo for the new special.");
      const image = file ? await imagePayload(file) : undefined;
      const saved = await save({ action: "save", id: deal?.id, name, before: before === "" ? null : Number(before), price: Number(price), minimumSqFt: Number(minimum), alt: alt.trim() || `${name.trim()} countertop slab special`, image });
      if (saved) {
        setFile(null); setFileKey((key) => key + 1);
        if (!deal) { setName(""); setBefore(""); setPrice(""); setMinimum("50"); setAlt(""); }
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to prepare special"); }
    finally { setPreparing(false); }
  }
  return <form className="photo-editor special-editor" onSubmit={submit}>
    <div className="photo-preview">{preview || existingImage ? <img src={preview || existingImage} alt={alt || name || "Special image preview"} /> : <span>Choose a special image to preview it here</span>}</div>
    {price && Number.isFinite(Number(price)) ? <p className="special-price-preview">{before && Number.isFinite(Number(before)) ? <del>{formatPrice(Number(before))}</del> : null} <strong>{formatPrice(Number(price))}/SF</strong>{Number(minimum) > 0 ? <small>Minimum {minimum} SF</small> : null}</p> : null}
    <label>Special name<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} disabled={busy || preparing} /></label>
    <label>{deal ? "Replace special image" : "New special image"}<input key={fileKey} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} disabled={busy || preparing} required={!deal} /></label>
    <div className="special-price-fields"><label>Original price ($/SF)<input type="number" min="0.01" max="99999" step="0.01" value={before} onChange={(event) => setBefore(event.target.value)} placeholder="Optional" disabled={busy || preparing} /></label><label>Sale price ($/SF)<input type="number" min="0.01" max="99999" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required disabled={busy || preparing} /></label></div>
    <label>Minimum square feet<input type="number" min="0" max="100000" step="1" value={minimum} onChange={(event) => setMinimum(event.target.value)} required disabled={busy || preparing} /></label>
    <label>Photo description<input value={alt} onChange={(event) => setAlt(event.target.value)} maxLength={240} placeholder="Defaults to the special name" disabled={busy || preparing} /></label>
    <p className="photo-hint">Review the image and prices above. Changes go live only when you publish. Leave original price blank for no crossed-out price; use zero for no minimum.</p>
    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    <button className="button gold" disabled={busy || preparing}>{preparing ? "Preparing special…" : deal ? "Publish changes" : "Publish new special"}</button>
  </form>;
}

function PreviousSpecialImages({ deal, busy, save }: { deal: Special; busy: boolean; save: (values: Record<string, unknown>) => Promise<boolean> }) {
  const [selected, setSelected] = useState(0);
  const history = deal.imageHistory || [];
  if (!history.length) return <p className="photo-hint">After you replace this image, its previous version will be available here.</p>;
  const index = Math.min(selected, history.length - 1);
  const previous = history[index];
  return <div className="special-image-history">
    <h3>Previous images</h3>
    <img src={previous.image} alt={`Previous image: ${previous.alt}`} />
    {history.length > 1 ? <label>Choose previous image<select value={index} disabled={busy} onChange={(event) => setSelected(Number(event.target.value))}>{history.map((item, itemIndex) => <option key={`${item.image}:${itemIndex}`} value={itemIndex}>{itemIndex === 0 ? "Most recent previous image" : `Earlier image ${itemIndex + 1}`}</option>)}</select></label> : null}
    <p className="photo-hint">Restores the image and its description. Your prices and minimum square footage stay as they are.</p>
    <button className="button outline" disabled={busy} onClick={() => void save({ action: "restore-image", id: deal.id, historyIndex: index })}>{index === 0 ? "Restore previous image" : "Restore selected image"}</button>
  </div>;
}

export default function AdminSpecials() {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [revision, setRevision] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/.netlify/functions/specials?admin=1", { cache: "no-store" });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load specials");
      setSpecials(data.specials); setRevision(data.revision);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load specials"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  async function save(values: Record<string, unknown>) {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/.netlify/functions/specials", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...values, revision }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to save special");
      setSpecials(data.specials); setRevision(data.revision); setMessage(values.action === "restore-image" ? "Previous image restored. Your prices are unchanged. Refresh the Specials page to see it." : "Saved. Your specials are live. Refresh the Specials page to see them."); return true;
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save special"); return false; }
    finally { setBusy(false); }
  }
  const ordered = [...specials].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const active = ordered.filter((deal) => !deal.hidden);
  return <div className="admin-specials">
    <p>Manage the offers shown on the Specials page. Replace images, update prices and minimums, or add a new offer. JPG, PNG and WebP images up to 15 MB are resized automatically.</p>
    <div className="photo-toolbar"><button className="button outline" disabled={loading || busy} onClick={() => void load()}>Refresh specials</button><a className="button outline" href="/specials/" target="_blank" rel="noreferrer">View specials ↗</a></div>
    {message ? <p className="photo-success" role="status">{message}</p> : null}{error ? <p className="admin-error" role="alert">{error}</p> : null}
    {loading ? <p role="status">Loading specials…</p> : specials.length ? <>
      <details className="photo-add"><summary>Add a new special</summary><SpecialEditor busy={busy} save={save} /></details>
      <label className="photo-search">Find a special<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by special name" /></label>
      <div className="photo-grid">{ordered.filter((deal) => deal.name.toLowerCase().includes(query.toLowerCase())).map((deal) => <article className={`photo-card${deal.hidden ? " photo-hidden" : ""}`} key={`${deal.id}:${deal.image}:${deal.name}:${deal.price}:${deal.before}:${deal.minimumSqFt}:${deal.alt}`}>
        <h2>{deal.name}</h2><p className="photo-locations">{deal.hidden ? "Hidden from the Specials page" : "Visible on the Specials page"}</p>
        <SpecialEditor deal={deal} busy={busy} save={save} />
        <PreviousSpecialImages deal={deal} busy={busy} save={save} />
        <div className="photo-actions">{!deal.hidden ? <><button disabled={busy || active[0]?.id === deal.id} onClick={() => void save({ action: "move", id: deal.id, direction: "up" })}>Move up</button><button disabled={busy || active[active.length - 1]?.id === deal.id} onClick={() => void save({ action: "move", id: deal.id, direction: "down" })}>Move down</button></> : null}<button disabled={busy} onClick={() => void save({ action: "visibility", id: deal.id, hidden: !deal.hidden })}>{deal.hidden ? "Show special" : "Hide special"}</button></div>
      </article>)}</div>
    </> : null}
  </div>;
}
