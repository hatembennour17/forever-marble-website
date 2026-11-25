"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Photo } from "@/app/lib/photo-catalog";
import { imagePayload } from "@/app/lib/image-upload";


function PhotoEditor({ photo, busy, onSave }: { photo?: Photo; busy: boolean; onSave: (values: Record<string, unknown>) => Promise<boolean> }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [alt, setAlt] = useState(photo?.alt || "");
  const [error, setError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  useEffect(() => { setAlt(photo?.alt || ""); }, [photo?.alt, photo?.id]);
  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setPreparing(true);
    try {
      if (!photo && !file) throw new Error("Choose a photo to add to the gallery.");
      const image = file ? await imagePayload(file) : undefined;
      if (await onSave({ action: file ? "upload" : "describe", id: photo?.id, alt, image })) {
        setFile(null); setFileKey((key) => key + 1); if (!photo) setAlt("");
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to prepare photo"); }
    finally { setPreparing(false); }
  }
  return <form className="photo-editor" onSubmit={submit}>
    <div className="photo-preview">{preview || photo?.src ? <img src={preview || photo?.src} alt={alt || "Selected photo preview"} /> : <span>Choose a photo to preview it here</span>}</div>
    <label>{photo ? "Choose replacement photo" : "Choose new gallery photo"}<input key={fileKey} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || preparing} onChange={(event) => { setError(""); setFile(event.target.files?.[0] || null); }} /></label>
    <label>Photo description<input value={alt} onChange={(event) => setAlt(event.target.value)} maxLength={240} required placeholder="For example: White quartz island in a Philadelphia kitchen" disabled={busy || preparing} /></label>
    {file ? <p className="photo-hint">Preview only. Click Publish photo to make this image live.</p> : null}
    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    <button className="button gold" disabled={busy || preparing || (!photo && !file)}>{preparing ? "Preparing photo…" : file ? "Publish photo" : photo ? "Save description" : "Publish photo"}</button>
  </form>;
}

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [revision, setRevision] = useState("");
  const [section, setSection] = useState<"gallery" | "site">("gallery");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/.netlify/functions/photos?admin=1", { cache: "no-store" });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load photos");
      setPhotos(data.photos); setRevision(data.revision);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load photos"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  async function save(values: Record<string, unknown>) {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/.netlify/functions/photos", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...values, revision }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to save photo");
      setPhotos(data.photos); setRevision(data.revision); setMessage("Saved. Your changes are live. Refresh the website to see them.");
      return true;
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save photo"); return false; }
    finally { setBusy(false); }
  }
  const gallery = photos.filter((photo) => photo.section === "gallery" && !photo.hidden).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const visible = photos.filter((photo) => photo.section === section && !photo.originalSrc?.startsWith("/images/specials-slabs/") && `${photo.label} ${photo.alt} ${photo.pages.join(" ")}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  return <div className="admin-photos">
    <p>Upload JPG, PNG or WebP photos up to 15 MB. Photos are resized automatically. Preview your image, add a description, then publish when ready.</p>
    <div className="photo-toolbar"><div className="admin-tabs"><button aria-pressed={section === "gallery"} className={section === "gallery" ? "active" : ""} onClick={() => setSection("gallery")}>Gallery photos</button><button aria-pressed={section === "site"} className={section === "site" ? "active" : ""} onClick={() => setSection("site")}>Website images</button></div><button className="button outline" onClick={() => void load()} disabled={busy || loading}>Refresh photos</button><a className="button outline" href={section === "gallery" ? "/gallery/" : "/"} target="_blank" rel="noreferrer">View website ↗</a></div>
    {message ? <p className="photo-success" role="status">{message}</p> : null}
    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    {loading ? <p role="status">Loading photos…</p> : photos.length ? <>
      {section === "gallery" ? <details className="photo-add" open><summary>Add a gallery photo</summary><PhotoEditor busy={busy} onSave={save} /></details> : <p className="photo-hint">Special offer photos and prices are managed in the Specials tab. Some images are shared across pages. Replacing one updates every location listed on its card. Original images remain available through Restore original.</p>}
      <label className="photo-search">Find a photo<input placeholder="Search by page, description or image name" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <div className="photo-grid">{visible.map((photo) => <article className={`photo-card${photo.hidden ? " photo-hidden" : ""}`} key={`${photo.id}:${photo.src}`}>
        <h2>{photo.section === "gallery" ? photo.alt : photo.label}</h2>
        <p className="photo-locations">{photo.hidden ? "Hidden from the gallery" : `Used on: ${photo.pages.join(", ")}`}</p>
        <PhotoEditor photo={photo} busy={busy} onSave={save} />
        <div className="photo-actions">{photo.section === "gallery" ? <>
          {!photo.hidden ? <><button disabled={busy || gallery[0]?.id === photo.id} onClick={() => void save({ action: "move", id: photo.id, direction: "up" })}>Move up</button><button disabled={busy || gallery[gallery.length - 1]?.id === photo.id} onClick={() => void save({ action: "move", id: photo.id, direction: "down" })}>Move down</button></> : null}
          <button disabled={busy} onClick={() => void save({ action: "visibility", id: photo.id, hidden: !photo.hidden })}>{photo.hidden ? "Show in gallery" : "Hide from gallery"}</button>
        </> : null}{photo.originalSrc && photo.src !== photo.originalSrc ? <button disabled={busy} onClick={() => { if (confirm("Restore the original photo? You can upload another replacement later.")) void save({ action: "restore", id: photo.id }); }}>Restore original</button> : null}</div>
      </article>)}</div>{!visible.length ? <p>No photos match your search.</p> : null}
    </> : null}
  </div>;
}
