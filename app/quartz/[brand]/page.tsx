import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const brands: Record<string, string> = {
  cambria: "Cambria",
  caesarstone: "Caesarstone",
  sliestone: "Sliestone",
  "msi-quartz": "MSI Quartz",
  emerstone: "Emerstone",
  pentalquartz: "PentalQuartz",
  "one-quartz-surfaces": "One Quartz Surfaces",
  "spectrum-quartz": "Spectrum Quartz",
  wilsonart: "Wilsonart",
  zodiac: "Zodiac",
};

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(brands).map((brand) => ({ brand })); }

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand } = await params;
  const name = brands[brand] || "Quartz";
  return { title: `${name} Quartz`, description: `Explore ${name} quartz options with Forever Marble & Granite.`, alternates: { canonical: `/quartz/${brand}/` } };
}

export default async function QuartzBrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const name = brands[brand] || "Quartz";
  return <>
    <section className="legacy-hero product-legacy-hero">
      <Image src="/images/breadcrumb-default.jpg" alt={`${name} quartz`} fill priority sizes="100vw" />
      <div className="legacy-hero-shade" />
      <div className="shell legacy-hero-content"><p className="legacy-breadcrumb"><Link href="/">Home</Link> / <Link href="/quartz/">Quartz</Link> / {name}</p><h1>{name}</h1></div>
    </section>
    <section className="legacy-product-section">
      <div className="shell legacy-product-grid">
        <figure className="legacy-product-image"><Image src="/images/quartz-countertops.png" alt={`${name} quartz`} fill sizes="(max-width: 900px) 100vw, 55vw" /></figure>
        <article className="legacy-product-copy"><p className="legacy-product-eyebrow">Product</p><h2>{name}</h2><p>Explore {name} quartz surfaces for kitchens, bathrooms, vanities and custom countertop projects.</p><p>Forever Marble helps clients compare quartz brands, colors, slab availability, edge profiles and installation details. Visit the showroom or request an estimate to match the right material to your project.</p><div className="actions"><Link className="button gold" href="/contact-us/">Request an estimate</Link><Link className="button outline" href="/quartz/">Back to Quartz</Link></div></article>
      </div>
    </section>
  </>;
}
