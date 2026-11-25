import type { Metadata } from "next";
import Image from "@/app/components/ManagedImage";
import Link from "next/link";
import CurrentSpecials from "@/app/components/CurrentSpecials";

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
        <CurrentSpecials />
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
