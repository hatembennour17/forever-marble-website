import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const faucetTypes: Record<string, string> = { "bathroom-faucets": "Bathroom Faucets", "kitchen-faucets": "Kitchen Faucets" };
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(faucetTypes).map((type) => ({ type })); }
export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> { const { type } = await params; const name = faucetTypes[type] ?? "Faucets"; return { title: name, description: `${name} for Forever Marble countertop projects.`, alternates: { canonical: `/faucets/${type}/` } }; }

export default async function FaucetTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params; const name = faucetTypes[type] ?? "Faucets";
  return <><section className="legacy-hero product-legacy-hero"><Image src="/images/breadcrumb-default.jpg" alt={name} fill priority sizes="100vw" /><div className="legacy-hero-shade" /><div className="shell legacy-hero-content"><p className="legacy-breadcrumb"><Link href="/">Home</Link> / <Link href="/faucets/">Faucets</Link> / {name}</p><h1>{name}</h1></div></section><section className="legacy-product-section"><div className="shell legacy-product-grid"><figure className="legacy-product-image"><Image src="/images/luxury-kitchen.jpg" alt={name} fill sizes="(max-width: 900px) 100vw, 55vw" /></figure><article className="legacy-product-copy"><p className="legacy-product-eyebrow">Product</p><h2>{name}</h2><p>{name} planned alongside sink placement, countertop material and installation details.</p><p>Forever Marble helps plan faucet placement, sink compatibility and countertop cutouts as part of the full project workflow.</p><div className="actions"><Link className="button gold" href="/contact-us/">Request an estimate</Link><Link className="button outline" href="/faucets/">All faucets</Link></div></article></div></section></>;
}
