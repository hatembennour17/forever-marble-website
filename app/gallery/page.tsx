import type { Metadata } from "next";
import Image from "@/app/components/ManagedImage";
import Link from "next/link";
import ManagedGallery from "@/app/components/ManagedGallery";

export const metadata: Metadata = {
  title: "Gallery | Kitchen & Bathroom Countertop Inspiration",
  description: "Browse Forever Marble & Granite's gallery of kitchen countertops, bathroom vanities, backsplashes and custom stone installations in Philadelphia.",
  alternates: { canonical: "/gallery/" },
  openGraph: {
    title: "Gallery | Forever Marble & Granite",
    description: "Kitchen and bathroom countertop inspiration from Forever Marble & Granite.",
    images: ["/images/gallery/gallery-n1.jpg"],
  },
};


export default function GalleryPage() {
  return <>
    <section className="legacy-hero gallery-hero">
      <Image src="/images/breadcrumb-default.jpg" alt="Forever Marble stone kitchen showroom backdrop" fill priority sizes="100vw" />
      <div className="legacy-hero-shade" />
      <div className="shell legacy-hero-content">
        <p className="legacy-breadcrumb"><Link href="/">Home</Link> / Gallery</p>
        <h1>Gallery</h1>
      </div>
    </section>

    <section className="legacy-gallery-section">
      <ManagedGallery />
    </section>

    <section className="gallery-slogan">
      <div className="shell">
        <p>You dream it, we make it</p>
        <h2>Bring us your favorite inspiration and we&#39;ll help you choose the right stone, edge and finish.</h2>
        <div className="actions">
          <Link className="button gold" href="/contact-us/">Request an estimate</Link>
          <Link className="button outline" href="/specials/">View specials</Link>
        </div>
      </div>
    </section>
  </>;
}
