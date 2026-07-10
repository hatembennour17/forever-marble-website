import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LegacyProductTail from "../../components/LegacyProductTail";

const sinkTypes: Record<string, string> = { "kitchen-sinks": "Kitchen Sinks", "bathroom-sinks": "Bathroom Sinks", "bar-sinks": "Bar Sinks" };
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(sinkTypes).map((type) => ({ type })); }
export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> { const { type } = await params; const name = sinkTypes[type] ?? "Sinks"; return { title: name, description: `${name} for Forever Marble countertop projects.`, alternates: { canonical: `/sinks/${type}/` } }; }

export default async function SinkTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params; const name = sinkTypes[type] ?? "Sinks";
  return <><section className="legacy-hero product-legacy-hero"><Image src="/images/breadcrumb-default.jpg" alt={name} fill priority sizes="100vw" /><div className="legacy-hero-shade" /><div className="shell legacy-hero-content"><p className="legacy-breadcrumb"><Link href="/">Home</Link> / <Link href="/sinks/">Sinks</Link> / {name}</p><h1>{name}</h1></div></section><section className="legacy-product-section"><div className="shell legacy-product-grid"><figure className="legacy-product-image"><Image src="/images/project-kitchen.jpg" alt={name} fill sizes="(max-width: 900px) 100vw, 55vw" /></figure><article className="legacy-product-copy"><p className="legacy-product-eyebrow">Product</p><h2>{name}</h2><p>{name} that pair cleanly with custom granite, marble, quartz and quartzite countertops.</p><p>Our team helps coordinate sink selection with your countertop template, cutout, edge profile and installation schedule.</p><div className="actions"><Link className="button gold" href="/contact-us/">Request an estimate</Link><Link className="button outline" href="/sinks/">All sinks</Link></div></article></div></section><LegacyProductTail /></>;
}
