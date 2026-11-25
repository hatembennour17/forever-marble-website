"use client";

import { useEffect, useState } from "react";
import Image from "./ManagedImage";
import { formatPrice, type Special } from "@/app/lib/specials";

export default function CurrentSpecials() {
  const [specials, setSpecials] = useState<Special[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    function refresh() {
      fetch("/.netlify/functions/specials", { cache: "no-store", signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then((data) => { if (!Array.isArray(data.specials)) throw new Error(); setSpecials(data.specials); setError(false); })
        .catch(() => { if (!controller.signal.aborted) setError(true); });
    }
    refresh(); window.addEventListener("focus", refresh);
    return () => { controller.abort(); window.removeEventListener("focus", refresh); };
  }, []);
  if (error) return <p className="specials-message" role="status">Please call (215) 203-8666 for current specials and pricing.</p>;
  if (specials === null) return <p className="specials-message" role="status">Loading current specials…</p>;
  const visible = specials.filter((deal) => !deal.hidden).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  if (!visible.length) return <p className="specials-message">New specials are coming soon. Contact us for available materials and a free estimate.</p>;
  return <div className="specials-grid">{visible.map((deal) => <article className="special-card" key={deal.id}>
    <h2>{deal.name}</h2>
    <div className="special-card-image"><Image src={deal.image} alt={deal.alt} fill sizes="(max-width: 900px) 50vw, 33vw" /></div>
    <p>{deal.before !== null ? <><span>{formatPrice(deal.before)}</span> now </> : null}<strong>{formatPrice(deal.price)}/SF</strong></p>
    {deal.minimumSqFt > 0 ? <small>Minimum {deal.minimumSqFt} SF</small> : null}
  </article>)}</div>;
}
