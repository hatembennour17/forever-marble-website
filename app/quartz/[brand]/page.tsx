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
  "msi-quartz": "https://www.msisurfaces.com/quartz-countertops/quartz-collections/",
};

const brandCatalogUrls: Record<string, string> = {
  cambria: "https://www.cambriausa.com/quartz-countertops/quartz-colors",
  ...brandInventoryUrls,
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
        <p>{name} protects its catalog from being displayed inside other websites. Open the official catalog to explore available colors and designs.</p>
        <a className="button gold" href={catalogUrl} target="_blank" rel="noopener noreferrer">View {name} Colors</a>
      </div> : null}
    </section>
    <LegacyProductTail />
  </>;
}
