import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Countertop Specials & Granite Deals in Philadelphia",
  description: "View current Forever Marble & Granite countertop specials, including featured granite slab promotions and financing options in Philadelphia.",
  alternates: { canonical: "/specials/" },
  openGraph: {
    title: "Countertop Specials & Granite Deals in Philadelphia",
    description: "Featured granite, marble and quartz countertop promotions from Forever Marble & Granite.",
    images: ["/images/specials-slabs/azul-platino.jpg"],
  },
};

const deals = [
  { name: "Azul Platino", before: "$49.99", now: "$34.99/SF", image: "/images/specials-slabs/azul-platino.jpg" },
  { name: "Genesis", before: "$65.99", now: "$49.99/SF", image: "/images/specials-slabs/genesis.jpg" },
  { name: "Caffe Latte", before: "$65.99", now: "$49.99/SF", image: "/images/specials-slabs/caffe-latte.jpg" },
  { name: "Santa Cecilia", before: "$55.99", now: "$34.99/SF", image: "/images/specials-slabs/santa-cecilia.jpg" },
  { name: "Steel Grey", before: "$54.99", now: "$44.99/SF", image: "/images/specials-slabs/steel-grey.jpg" },
  { name: "Brazilian Black", before: "$55.99", now: "$34.99/SF", image: "/images/specials-slabs/brazilian-black.jpg" },
  { name: "Arctic Pearl", before: "$59.99", now: "$39.99/SF", image: "/images/specials-slabs/arctic-pearl.jpg" },
  { name: "Giallo Vicenza", before: "$59.99", now: "$44.99/SF", image: "/images/specials-slabs/giallo-vicenza.jpg" },
  { name: "Fantasy Brown", before: "$65.99", now: "$49.99/SF", image: "/images/specials-slabs/fantasy-brown.jpg" },
  { name: "Patagonia Granite", before: "$79.99", now: "$59.99/SF", image: "/images/specials-slabs/patagonia-granite.jpg" },
  { name: "Emerald Pearl", before: "$75.99", now: "$59.99/SF", image: "/images/specials-slabs/emerald-pearl.jpg" },
];

export default function SpecialsPage() {
  return <>
    <section className="specials-hero">
      <Image src="/images/marble-slabs.jpg" alt="Dark stone kitchen backdrop for Forever Marble specials" fill priority sizes="100vw" />
      <div className="specials-hero-shade" />
      <div className="shell specials-hero-content">
        <p className="specials-breadcrumb"><Link href="/">Home</Link> / Specials</p>
        <h1>Specials</h1>
      </div>
    </section>

    <section className="specials-offers">
      <div className="shell">
        <p className="specials-finance">0% APR $0 Down Finance for 24 Months Available!</p>
        <div className="specials-intro">
          <p>Featured stone deals change quickly. Visit our Philadelphia showroom or contact us to confirm current availability, slab sizes and installed pricing for your project.</p>
          <div className="actions">
            <Link className="button gold" href="/contact-us/">Request estimate</Link>
            <a className="button outline" href="tel:+12152038666">Call (215) 203-8666</a>
          </div>
        </div>
        <div className="specials-grid">
          {deals.map((deal) => (
            <article className="special-card" key={deal.name}>
              <h2>{deal.name}</h2>
              <div className="special-card-image">
                <Image src={deal.image} alt={`${deal.name} countertop slab special`} fill sizes="(max-width: 900px) 50vw, 33vw" />
              </div>
              <p><span>{deal.before}</span> now <strong>{deal.now}</strong></p>
              <small>Minimum 50 SF</small>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="cta slim">
      <div className="shell cta-inner">
        <div><p className="eyebrow light">Limited-time inventory</p><h2>See today&#39;s available slabs.</h2></div>
        <Link className="button white" href="/contact-us/">Check availability</Link>
      </div>
    </section>
  </>;
}
