import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Faucets", description: "Bathroom and kitchen faucet options for Forever Marble & Granite countertop projects.", alternates: { canonical: "/faucets/" } };

export default function FaucetsPage() {
  return <><section className="legacy-hero product-legacy-hero"><Image src="/images/breadcrumb-default.jpg" alt="Faucet options from Forever Marble" fill priority sizes="100vw" /><div className="legacy-hero-shade" /><div className="shell legacy-hero-content"><p className="legacy-breadcrumb"><Link href="/">Home</Link> / Faucets</p><h1>Faucets</h1></div></section><section className="legacy-product-section"><div className="shell legacy-product-grid"><figure className="legacy-product-image"><Image src="/images/luxury-kitchen.jpg" alt="Faucets" fill sizes="(max-width: 900px) 100vw, 55vw" /></figure><article className="legacy-product-copy"><p className="legacy-product-eyebrow">Product</p><h2>Faucets</h2><p>Coordinate faucet selection with sink placement, counter cutouts and overall project design.</p><p>Our team helps homeowners plan faucet and sink details before fabrication so installation is smooth and accurate.</p><div className="actions"><Link className="button gold" href="/faucets/kitchen-faucets/">Kitchen Faucets</Link><Link className="button outline" href="/contact-us/">Request Estimate</Link></div></article></div></section></>;
}
