import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LegacyProductTail from "../../components/LegacyProductTail";

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

const brandInventoryUrls: Record<string, string> = {
  caesarstone: "https://www.caesarstoneus.com/countertops/",
  sliestone: "https://www.cosentino.com/usa/colors/",
  "msi-quartz": "https://www.msisurfaces.com/quartz-countertops/quartz-collections/",
  emerstone: "https://emerstone.com/product-category/all/",
  "one-quartz-surfaces": "https://www.daltile.com/countertops-product-category/one-quartz",
  "spectrum-quartz": "https://spectrumquartz.com/",
  zodiac: "https://www.na.corian.com/",
};

const brandCatalogUrls: Record<string, string> = {
  cambria: "https://www.cambriausa.com/quartz-countertops/quartz-colors",
  pentalquartz: "https://arcsurfaces.com/quartz/pentalquartz/",
  wilsonart: "https://www.wilsonart.com/advance-search?category_option%5B%5D=22",
  ...brandInventoryUrls,
};

const brandDescriptions: Record<string, { intro: string; details: string }> = {
  sliestone: { intro: "Explore versatile quartz designs for kitchens, bathrooms, vanities and custom countertop projects.", details: "Compare colors, movement and finishes with our team to find a durable, low-maintenance surface that complements your space." },
  emerstone: { intro: "Discover Emerstone quartz surfaces designed to balance modern style with practical everyday performance.", details: "Forever Marble can help you review color options, coordinate cabinetry and flooring, and plan fabrication details for a polished installation." },
  pentalquartz: { intro: "Explore PentalQuartz colors ranging from subtle neutrals to expressive stone-inspired patterns.", details: "Our specialists help you compare samples, understand availability and select the right edge and layout for your kitchen or bathroom." },
  "one-quartz-surfaces": { intro: "One Quartz Surfaces offers refined designs for residential and commercial interiors.", details: "Choose from versatile colors and patterns, then work with Forever Marble on measurements, fabrication and installation details." },
  "spectrum-quartz": { intro: "Spectrum Quartz brings together contemporary colors, natural-looking movement and easy-care performance.", details: "Visit our showroom to compare selections and plan a quartz surface suited to your style, space and daily routine." },
  wilsonart: { intro: "Explore Wilsonart quartz designs created for stylish, durable kitchens, bathrooms and workspaces.", details: "Our team can help coordinate samples, color direction, edge profiles and project measurements before fabrication." },
  zodiac: { intro: "Discover Zodiac quartz surfaces in versatile colors and patterns for custom countertops and vanities.", details: "Forever Marble guides you through material selection, layout planning, fabrication and professional installation." },
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
  const inventoryUrl = brandInventoryUrls[brand];
  const catalogUrl = brandCatalogUrls[brand];
  const copy = brandDescriptions[brand] ?? { intro: `Explore ${name} quartz surfaces for kitchens, bathrooms, vanities and custom countertop projects.`, details: "Forever Marble helps clients compare quartz brands, colors, slab availability, edge profiles and installation details." };
  return <>
    <section className="legacy-hero product-legacy-hero">
      <Image src="/images/breadcrumb-default.jpg" alt={`${name} quartz`} fill priority sizes="100vw" />
      <div className="legacy-hero-shade" />
      <div className="shell legacy-hero-content"><p className="legacy-breadcrumb"><Link href="/">Home</Link> / <Link href="/quartz/">Quartz</Link> / {name}</p><h1>{name}</h1></div>
    </section>
    <section className="legacy-product-section">
      <div className="shell legacy-product-grid">
        <figure className="legacy-product-image"><Image src="/images/quartz-countertops.png" alt={`${name} quartz`} fill sizes="(max-width: 900px) 100vw, 55vw" /></figure>
        <article className="legacy-product-copy"><p className="legacy-product-eyebrow">Product</p><h2>{name}</h2><p>{copy.intro}</p><p>{copy.details}</p><div className="actions"><Link className="button gold" href="/contact-us/">Request an estimate</Link><Link className="button outline" href="/quartz/">Back to Quartz</Link></div></article>
      </div>
      {inventoryUrl ? <div className="legacy-inventory-embed-wrap">
        <iframe
          className="legacy-inventory-embed"
          src={inventoryUrl}
          title={`${name} quartz colors and inventory`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div> : null}
      {catalogUrl && !inventoryUrl ? <div className="shell legacy-info-card">
        <h2>Browse {name} Quartz Colors</h2>
        <p>Open the official {name} supplier catalog to explore available colors and designs.</p>
        <a className="button gold" href={catalogUrl} target="_blank" rel="noopener noreferrer">View {name} Colors</a>
      </div> : null}
    </section>
    <LegacyProductTail showFaqs={false} />
  </>;
}
