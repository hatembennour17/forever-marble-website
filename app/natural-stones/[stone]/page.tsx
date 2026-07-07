import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const stones: Record<string, { name: string; image: string; intro: string }> = {
  precioustone: { name: "Precioustone", image: "/images/natural-stone.jpg", intro: "Distinctive natural stone surfaces selected for statement kitchens, baths, fireplaces and feature details." },
  travertine: { name: "Travertine", image: "/images/natural-stone.jpg", intro: "Warm, textured natural stone with timeless character for indoor and outdoor design projects." },
  onyx: { name: "Onyx", image: "/images/natural-stone.jpg", intro: "Dramatic translucent stone with rich movement for decorative counters, walls and custom accents." },
  slate: { name: "Slate", image: "/images/information/slate-counters.jpg", intro: "A refined natural stone option known for earthy color, texture and durable everyday performance." },
  soapstone: { name: "Soapstone", image: "/images/soapstone.webp", intro: "A smooth, low-sheen natural stone with classic depth and a comfortable lived-in feel." },
};

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(stones).map((stone) => ({ stone })); }

export async function generateMetadata({ params }: { params: Promise<{ stone: string }> }): Promise<Metadata> {
  const { stone } = await params;
  const item = stones[stone] ?? stones.travertine;
  return { title: `${item.name} Natural Stone`, description: `Explore ${item.name} natural stone options with Forever Marble & Granite in Philadelphia.`, alternates: { canonical: `/natural-stones/${stone}/` } };
}

export default async function NaturalStonePage({ params }: { params: Promise<{ stone: string }> }) {
  const { stone } = await params;
  const item = stones[stone] ?? stones.travertine;
  return <>
    <section className="legacy-hero product-legacy-hero">
      <Image src="/images/breadcrumb-default.jpg" alt={`${item.name} natural stone`} fill priority sizes="100vw" />
      <div className="legacy-hero-shade" />
      <div className="shell legacy-hero-content"><p className="legacy-breadcrumb"><Link href="/">Home</Link> / <Link href="/natural-stones/">Natural Stones</Link> / {item.name}</p><h1>{item.name}</h1></div>
    </section>
    <section className="legacy-product-section">
      <div className="shell legacy-product-grid">
        <figure className="legacy-product-image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 900px) 100vw, 55vw" /></figure>
        <article className="legacy-product-copy"><p className="legacy-product-eyebrow">Product</p><h2>{item.name}</h2><p>{item.intro}</p><p>Forever Marble helps you compare natural stone materials, finishes, edge profiles and installation details. Visit the showroom to review samples and plan the right surface for your project.</p><div className="actions"><Link className="button gold" href="/contact-us/">Request an estimate</Link><Link className="button outline" href="/natural-stones/">Back to Natural Stones</Link></div></article>
      </div>
    </section>
  </>;
}
