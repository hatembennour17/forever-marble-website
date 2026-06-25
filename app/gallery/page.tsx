import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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

const galleryImages = [
  { src: "/images/gallery/gallery-n1.jpg", alt: "Bright kitchen with stone countertops and pendant lighting" },
  { src: "/images/gallery/gallery-n2.jpg", alt: "Modern white kitchen with custom countertops" },
  { src: "/images/gallery/gallery-n3.jpg", alt: "Kitchen shelving and countertop detail" },
  { src: "/images/gallery/gallery-n4.jpg", alt: "Custom kitchen countertop and cabinet installation" },
  { src: "/images/gallery/gallery-n5.jpg", alt: "Kitchen island with polished stone surface" },
  { src: "/images/gallery/gallery-n6.jpg", alt: "Stone countertop with backsplash and sink" },
  { src: "/images/gallery/gallery-n7.jpg", alt: "Finished kitchen with marble-look countertop" },
  { src: "/images/gallery/gallery-n8.jpg", alt: "Contemporary kitchen countertop project" },
  { src: "/images/gallery/gallery-n9.jpg", alt: "Bathroom vanity and stone surface inspiration" },
  { src: "/images/gallery/gallery-n10.jpg", alt: "Kitchen stone countertop detail" },
  { src: "/images/gallery/gallery-n11.jpg", alt: "Installed countertop with clean modern cabinetry" },
  { src: "/images/gallery/gallery-n12.jpg", alt: "Custom stone kitchen and backsplash design" },
];

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
      <div className="shell legacy-gallery-grid">
        {galleryImages.map((image, index) => (
          <figure className="legacy-gallery-card" key={image.src}>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 50vw, 33vw" priority={index < 3} />
          </figure>
        ))}
      </div>
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
