import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LegacyProductTail from "../components/LegacyProductTail";

export const metadata: Metadata = { title: "Tile Selection", description: "Tile selection guidance for Forever Marble & Granite kitchen, bath and backsplash projects.", alternates: { canonical: "/tile-selection/" } };

export default function TileSelectionPage() {
  return <><section className="legacy-hero product-legacy-hero"><Image src="/images/breadcrumb-default.jpg" alt="Tile selection from Forever Marble" fill priority sizes="100vw" /><div className="legacy-hero-shade" /><div className="shell legacy-hero-content"><p className="legacy-breadcrumb"><Link href="/">Home</Link> / Tile Selection</p><h1>Tile Selection</h1></div></section><section className="legacy-product-section"><div className="shell legacy-product-grid"><figure className="legacy-product-image"><Image src="/images/information/quartz.png" alt="Tile selection" fill sizes="(max-width: 900px) 100vw, 55vw" /></figure><article className="legacy-product-copy"><p className="legacy-product-eyebrow">Product</p><h2>Tile Selection</h2><p>Choose tile that complements your countertop, cabinet color, wall finish and overall design.</p><p>Forever Marble can help you think through tile direction for kitchens, bathrooms, backsplashes and shower areas while coordinating the look with your selected stone or quartz surface.</p><div className="actions"><Link className="button gold" href="/contact-us/">Request an estimate</Link><a className="button outline" href="tel:+12152038666">Call us</a></div></article></div></section><LegacyProductTail /></>;
}
