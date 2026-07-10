import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "../content";
import LegacyProductTail from "../components/LegacyProductTail";

const informationSlugs = new Set(["where-do-i-begin", "going-green", "maintenance-care", "edge-profiles", "getting-an-estimate", "faqs"]);
const productSlugs = new Set(["granite", "marble", "quartz", "quartzite", "natural-stones"]);

const informationImages: Record<string, { src: string; alt: string }[]> = {
  "where-do-i-begin": [
    { src: "/images/information/quartzite-care.png", alt: "Natural stone selection from Forever Marble" },
    { src: "/images/information/quartz.png", alt: "Quartz stone surface selection" },
    { src: "/images/information/slate-counters.jpg", alt: "Quartz kitchen island inspiration" },
  ],
  "going-green": [
    { src: "/images/information/quartzite-care.png", alt: "Natural soapstone and quartzite selection" },
    { src: "/images/information/quartz.png", alt: "Quartz surface sample" },
    { src: "/images/information/slate-counters.jpg", alt: "Quartz kitchen islands" },
    { src: "/images/information/great-pyramid.jpg", alt: "Historic natural stone monument" },
    { src: "/images/information/mexican-pyramid.jpg", alt: "Historic pyramid stonework" },
    { src: "/images/information/stonehenge.jpg", alt: "Stonehenge natural stone monument" },
  ],
  "maintenance-care": [
    { src: "/images/information/quartzite-care.png", alt: "Natural stone countertop surface" },
    { src: "/images/information/quartz.png", alt: "Quartz surface care example" },
    { src: "/images/information/draner.jpg", alt: "Marble maintenance care tips" },
    { src: "/images/information/draner1.jpg", alt: "Marble care guide" },
    { src: "/images/information/slider-marble-4.jpg", alt: "Marble upkeep essentials" },
  ],
  "getting-an-estimate": [
    { src: "/images/information/kitchen-estimate.png", alt: "Kitchen countertop estimate illustration" },
  ],
  faqs: [
    { src: "/images/information/stone-creation.gif", alt: "Stone creation and fabrication animation" },
  ],
  "edge-profiles": [
    { src: "/images/information/about-01.png", alt: "Forever Marble stone fabrication" },
    { src: "/images/information/about-02.jpg", alt: "Marble edge profiles display" },
    { src: "/images/information/projects-edge.jpeg", alt: "Elegant marble edge profile" },
    { src: "/images/information/popular-edges.png", alt: "Popular countertop edge profiles" },
    { src: "/images/information/premium-edges.png", alt: "Premium countertop edge profiles" },
    { src: "/images/information/laminated-edges.png", alt: "Laminated countertop edge profiles" },
  ],
};

function labelFromSlug(slug: string) {
  if (slug === "faqs") return "F.A.Q";
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function ProductPage({ slug, page }: { slug: string; page: (typeof pages)[string] }) {
  const title = slug === "natural-stones" ? "Natural Stones" : labelFromSlug(slug);
  const productImage = slug === "granite" ? "/images/product-granite-main.jpg" : page.image;
  const inventoryEmbeds: Record<string, string> = {
    granite: "https://www.ohmintl.com/countertops/granite/",
    marble: "https://www.ohmintl.com/countertops/marble/",
    quartzite: "https://www.ohmintl.com/countertops/quartzite/",
  };
  const inventoryEmbed = inventoryEmbeds[slug] ?? null;
  return <>
    <section className="legacy-hero product-legacy-hero">
      <Image src="/images/breadcrumb-default.jpg" alt={`${title} from Forever Marble`} fill priority sizes="100vw" />
      <div className="legacy-hero-shade" />
      <div className="shell legacy-hero-content">
        <p className="legacy-breadcrumb"><Link href="/">Home</Link> / {title}</p>
        <h1>{title}</h1>
      </div>
    </section>
    <section className="legacy-product-section">
      <div className="shell legacy-product-grid">
        <figure className="legacy-product-image">
          <Image src={productImage} alt={page.title} fill sizes="(max-width: 900px) 100vw, 55vw" />
        </figure>
        <article className="legacy-product-copy">
          <p className="legacy-product-eyebrow">Product</p>
          <h2>{title}</h2>
          <p>{page.intro}</p>
          <p>{page.details}</p>
          <div className="actions">
            <Link className="button gold" href="/contact-us/">Request an estimate</Link>
            <a className="button outline" href="tel:+12152038666">Call us</a>
          </div>
        </article>
      </div>
      {inventoryEmbed ? <div className="legacy-inventory-embed-wrap">
        <iframe className="legacy-inventory-embed" src={inventoryEmbed} title={`${title} slabs inventory`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
      </div> : null}
    </section>
    <LegacyProductTail />
  </>;
}

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(pages).map(slug => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const page = pages[slug]; if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${slug}/` }, openGraph: { title: page.title, description: page.description, images: [informationSlugs.has(slug) ? "/images/breadcrumb-default.jpg" : page.image] } };
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const page = pages[slug]; if (!page) notFound();

  if (productSlugs.has(slug)) {
    return <ProductPage slug={slug} page={page} />;
  }

  if (informationSlugs.has(slug)) {
    const images = informationImages[slug] ?? [];
    return <>
      <section className="legacy-hero information-hero">
        <Image src="/images/breadcrumb-default.jpg" alt={`${page.title} information from Forever Marble`} fill priority sizes="100vw" />
        <div className="legacy-hero-shade" />
        <div className="shell legacy-hero-content">
          <p className="legacy-breadcrumb"><Link href="/">Home</Link> / {labelFromSlug(slug)}</p>
          <h1>{page.title}</h1>
        </div>
      </section>
      <section className="legacy-info-section live-info-page">
        <div className="shell">
          <article className="legacy-info-copy">
            <p className="eyebrow">Forever Marble Information</p>
            <h2>{page.intro}</h2>
            <p>{page.details}</p>
            {images.length ? <div className="live-image-row">{images.slice(0, 3).map((image) => (
              <figure key={image.src}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 33vw" /></figure>
            ))}</div> : null}
            {page.sections?.map((section) => (
              <section className="live-copy-block" key={section.heading}>
                <h3>{section.heading}</h3>
                <p>{section.text}</p>
                {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                {slug === "going-green" && section.heading === "Historic Stones Monuments" ? <div className="live-image-row compact">{images.slice(3, 6).map((image) => (
                  <figure key={image.src}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 33vw" /></figure>
                ))}</div> : null}
                {slug === "maintenance-care" && section.heading === "Effective Maintenance Tips" ? <div className="live-image-row compact">{images.slice(3, 5).map((image) => (
                  <figure key={image.src}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 50vw" /></figure>
                ))}</div> : null}
                {slug === "edge-profiles" && ["Popular edges", "Premium edges", "Laminated Edges"].includes(section.heading) ? <div className="edge-profile-image"><Image src={images[section.heading === "Popular edges" ? 3 : section.heading === "Premium edges" ? 4 : 5].src} alt={images[section.heading === "Popular edges" ? 3 : section.heading === "Premium edges" ? 4 : 5].alt} fill sizes="100vw" /></div> : null}
              </section>
            ))}
            {page.faqs ? <div className="live-faq-list">{page.faqs.map((item) => (
              <details key={item.question} open>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}</div> : null}
            <div className="actions">
              <Link className="button gold" href="/contact-us/">Request an estimate</Link>
              <a className="button outline" href="tel:+12152038666">Call (215) 203-8666</a>
            </div>
          </article>
          <aside className="legacy-info-card live-info-summary">
            <h2>Helpful notes</h2>
            <ul>{page.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            <div className="visit-card">
              <b>Visit our showroom</b>
              <p>7339 Wissinoming Street<br />Philadelphia, PA 19136</p>
              <a href="https://square.site/book/6J5Y31VF9BB8M/forever-marble-granite-quartz-stone-philadelphia-pa">Book appointment →</a>
            </div>
          </aside>
        </div>
      </section>
      <section className="gallery-slogan">
        <div className="shell">
          <p>Have questions?</p>
          <h2>Our team can walk you through materials, measurements, pricing and care.</h2>
          <div className="actions"><Link className="button gold" href="/contact-us/">Talk to us</Link></div>
        </div>
      </section>
    </>;
  }

  return <><section className="page-hero"><Image src={page.image} alt={page.title} fill priority sizes="100vw" /><div className="hero-shade" /><div className="shell"><p className="eyebrow light">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.description}</p></div></section><section className="section"><div className="shell detail-grid"><article><p className="lead">{page.intro}</p><p>{page.details}</p><div className="actions"><Link className="button gold" href="/contact-us/">Request a free estimate</Link><a className="button outline" href="tel:+12152038666">Call (215) 203-8666</a></div></article><aside><p className="eyebrow">What to expect</p><ul>{page.bullets.map(b => <li key={b}>{b}</li>)}</ul><div className="visit-card"><b>See it in person</b><p>7339 Wissinoming Street<br />Philadelphia, PA 19136</p><a href="https://square.site/book/6J5Y31VF9BB8M/forever-marble-granite-quartz-stone-philadelphia-pa">Book a showroom visit →</a></div></aside></div></section><section className="cta slim"><div className="shell cta-inner"><div><p className="eyebrow light">Start with a conversation</p><h2>Let&#39;s create something lasting.</h2></div><Link className="button white" href="/contact-us/">Tell us about your project</Link></div></section></>;
}
