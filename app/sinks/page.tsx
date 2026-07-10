import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LegacyProductTail from "../components/LegacyProductTail";

export const metadata: Metadata = { title: "Sinks", description: "Kitchen, bathroom and bar sink options for Forever Marble & Granite countertop projects.", alternates: { canonical: "/sinks/" } };

export default function SinksPage() {
  return <>
    <section className="legacy-hero product-legacy-hero"><Image src="/images/breadcrumb-default.jpg" alt="Sink options from Forever Marble" fill priority sizes="100vw" /><div className="legacy-hero-shade" /><div className="shell legacy-hero-content"><p className="legacy-breadcrumb"><Link href="/">Home</Link> / Sinks</p><h1>Sinks</h1></div></section>
    <section className="legacy-product-section"><div className="shell legacy-product-grid"><figure className="legacy-product-image"><Image src="/images/project-kitchen.jpg" alt="Sinks" fill sizes="(max-width: 900px) 100vw, 55vw" /></figure><article className="legacy-product-copy"><p className="legacy-product-eyebrow">Product</p><h2>Sinks</h2><p>Choose a sink category that fits your kitchen, bath, bar or prep area.</p><p>Forever Marble coordinates sink details with measurement, fabrication and installation so your countertop cutout and finished surface are planned correctly from the start.</p><div className="actions"><Link className="button gold" href="/sinks/kitchen-sinks/">Kitchen Sinks</Link><Link className="button outline" href="/contact-us/">Request Estimate</Link></div></article></div></section>
    <LegacyProductTail />
  </>;
}
