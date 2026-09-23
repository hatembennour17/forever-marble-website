import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const areas = {
  philadelphia: { name: "Philadelphia", region: "PA", description: "Custom granite, marble, quartz and quartzite countertops for Philadelphia homes and businesses." },
  "bucks-county": { name: "Bucks County", region: "PA", description: "Countertop design, fabrication and installation for homeowners throughout Bucks County, Pennsylvania." },
  "montgomery-county": { name: "Montgomery County", region: "PA", description: "Custom stone and quartz countertops for kitchens, bathrooms and commercial spaces across Montgomery County." },
  "delaware-county": { name: "Delaware County", region: "PA", description: "Professional countertop measurement, fabrication and installation throughout Delaware County, Pennsylvania." },
  "chester-county": { name: "Chester County", region: "PA", description: "Granite, marble, quartz and quartzite countertop service for Chester County renovation projects." },
  "camden-county": { name: "Camden County", region: "NJ", description: "Custom countertop fabrication and installation for Camden County, New Jersey homes and businesses." },
  "burlington-county": { name: "Burlington County", region: "NJ", description: "Countertop selection, fabrication and installation for Burlington County, New Jersey." },
} as const;

type AreaSlug = keyof typeof areas;

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(areas).map((area) => ({ area })); }

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const { area } = await params;
  const item = areas[area as AreaSlug];
  if (!item) return {};
  return {
    title: `Countertops in ${item.name}, ${item.region}`,
    description: item.description,
    alternates: { canonical: `/service-areas/${area}/` },
  };
}

export default async function ServiceAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const item = areas[area as AreaSlug];
  if (!item) notFound();

  return <>
    <section className="page-hero">
      <Image src="/images/luxury-kitchen.jpg" alt={`Stone countertops installed near ${item.name}`} fill priority sizes="100vw" />
      <div className="hero-shade" />
      <div className="shell">
        <p className="eyebrow light">Serving {item.name}</p>
        <h1>Countertops in {item.name}, {item.region}</h1>
        <p>{item.description}</p>
      </div>
    </section>
    <section className="section">
      <div className="shell detail-grid">
        <article>
          <p className="lead">Local countertop service from selection through installation.</p>
          <p>Forever Marble &amp; Granite helps {item.name} customers choose the right granite, marble, quartz or quartzite for kitchens, bathrooms, bars and commercial spaces. Projects are measured, fabricated and installed by an experienced Philadelphia-area team.</p>
          <p>Visit the showroom to compare full slabs and samples, discuss performance and care, and review edge profiles and layout details. Bring rough measurements, cabinet plans or photos for a project-specific estimate.</p>
          <div className="actions">
            <Link className="button gold" href="/contact-us/">Request an estimate</Link>
            <a className="button outline" href="tel:+12152038666">Call (215) 203-8666</a>
          </div>
        </article>
        <aside>
          <p className="eyebrow">Services</p>
          <ul>
            <li>Granite, marble, quartz and quartzite</li>
            <li>Kitchen countertops and islands</li>
            <li>Bathroom vanities and surrounds</li>
            <li>Field templates and custom fabrication</li>
            <li>Professional delivery and installation</li>
          </ul>
          <div className="visit-card"><b>Philadelphia showroom</b><p>7339 Wissinoming Street<br />Philadelphia, PA 19136</p><Link href="/contact-us/">Plan your visit →</Link></div>
        </aside>
      </div>
    </section>
    <section className="cta slim"><div className="shell cta-inner"><div><p className="eyebrow light">Start your {item.name} project</p><h2>Let&apos;s create something lasting.</h2></div><Link className="button white" href="/contact-us/">Tell us about your project</Link></div></section>
  </>;
}
