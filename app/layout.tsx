import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const siteUrl = "https://forevermarble.com";
const whatsappUrl = "https://wa.me/12152038666?text=Hi%20Forever%20Marble%2C%20I%27d%20like%20help%20with%20a%20countertop%20project.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Forever Marble & Granite | Philadelphia Countertops", template: "%s | Forever Marble & Granite" },
  description: "Custom granite, marble, quartz and quartzite countertops fabricated and installed in Philadelphia and nearby communities.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", siteName: "Forever Marble & Granite", images: [{ url: "/images/hero-kitchen.png", width: 1600, height: 900 }] },
  icons: { icon: "/images/favicon.png" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${siteUrl}/#business`,
  name: "Forever Marble & Granite",
  url: siteUrl,
  image: `${siteUrl}/images/hero-kitchen.png`,
  logo: `${siteUrl}/images/logo-white.png`,
  telephone: "+1-215-203-8666",
  email: "granite@forevermarble.com",
  address: { "@type": "PostalAddress", streetAddress: "7339 Wissinoming Street", addressLocality: "Philadelphia", addressRegion: "PA", postalCode: "19136", addressCountry: "US" },
  areaServed: ["Philadelphia", "Bucks County", "Montgomery County", "South Jersey"],
  priceRange: "$$",
  sameAs: ["https://www.facebook.com/ForeverMarbleandGranite", "https://www.instagram.com/forevermarble"],
};

function Header() {
  return <header className="site-header">
    <div className="utility"><div className="shell utility-inner"><span>Philadelphia&#39;s stone surface specialists</span><div><a href="mailto:granite@forevermarble.com">granite@forevermarble.com</a><a href="tel:+12152038666">(215) 203-8666</a><a className="book-small" href="https://square.site/book/6J5Y31VF9BB8M/forever-marble-granite-quartz-stone-philadelphia-pa">Book appointment →</a></div></div></div>
    <div className="shell nav-row">
      <Link href="/" aria-label="Forever Marble home"><Image src="/images/logo-white.png" alt="Forever Marble & Granite" width={245} height={70} priority /></Link>
      <nav aria-label="Primary navigation" className="desktop-nav">
        <Link href="/about-us/">About</Link>
        <div className="nav-group"><button type="button">Materials <span>⌄</span></button><div className="dropdown"><Link href="/granite/">Granite</Link><Link href="/marble/">Marble</Link><Link href="/quartz/">Quartz</Link><Link href="/quartzite/">Quartzite</Link><Link href="/natural-stones/">All natural stone</Link></div></div>
        <div className="nav-group"><button type="button">Information <span>⌄</span></button><div className="dropdown information-dropdown"><Link href="/where-do-i-begin/">Where Do I Begin?</Link><Link href="/going-green/">Going Green</Link><Link href="/maintenance-care/">Maintenance &amp; Care</Link><Link href="/edge-profiles/">Edge Profiles</Link><Link href="/getting-an-estimate/">Getting an Estimate</Link><Link href="/faqs/">F.A.Q</Link></div></div>
        <div className="nav-group"><button type="button">3D Tools <span>⌄</span></button><div className="dropdown tools-dropdown"><Link href="/kitchen-virturalizer/">Kitchen Visualizer</Link><Link href="/bathroom-virtualizer/">Bathroom Visualizer</Link><Link href="/3d-edges/">3D Edge Profiles</Link><Link href="/edge-profiles/">Edge Profile Guide</Link></div></div>
        <Link href="/gallery/">Gallery</Link><Link href="/specials/">Specials</Link><Link href="/contact-us/">Contact</Link>
      </nav>
      <details className="mobile-menu"><summary aria-label="Open menu">Menu</summary><nav><Link href="/about-us/">About</Link><Link href="/granite/">Granite</Link><Link href="/marble/">Marble</Link><Link href="/quartz/">Quartz</Link><Link href="/quartzite/">Quartzite</Link><strong>Information</strong><Link href="/where-do-i-begin/">Where Do I Begin?</Link><Link href="/going-green/">Going Green</Link><Link href="/maintenance-care/">Maintenance &amp; Care</Link><Link href="/edge-profiles/">Edge Profiles</Link><Link href="/getting-an-estimate/">Getting an Estimate</Link><Link href="/faqs/">F.A.Q</Link><strong>3D Tools</strong><Link href="/kitchen-virturalizer/">Kitchen Visualizer</Link><Link href="/bathroom-virtualizer/">Bathroom Visualizer</Link><Link href="/3d-edges/">3D Edge Profiles</Link><Link href="/edge-profiles/">Edge Profile Guide</Link><Link href="/gallery/">Gallery</Link><Link href="/specials/">Specials</Link><Link href="/contact-us/">Contact</Link></nav></details>
    </div>
  </header>;
}

function Footer() {
  return <footer className="footer"><div className="shell footer-grid"><div><Image src="/images/logo-white.png" alt="Forever Marble & Granite" width={245} height={70}/><p>Custom stone countertops, measured, fabricated and installed by a local Philadelphia team.</p></div><div><h2>Visit our showroom</h2><address>7339 Wissinoming Street<br/>Philadelphia, PA 19136</address><a href="tel:+12152038666">(215) 203-8666</a><a href="mailto:granite@forevermarble.com">granite@forevermarble.com</a></div><div><h2>Explore</h2><Link href="/granite/">Granite</Link><Link href="/marble/">Marble</Link><Link href="/quartz/">Quartz</Link><Link href="/quartzite/">Quartzite</Link></div><div><h2>Plan your project</h2><Link href="/where-do-i-begin/">Where do I begin?</Link><Link href="/getting-an-estimate/">Getting an estimate</Link><Link href="/maintenance-care/">Maintenance &amp; care</Link><Link href="/kitchen-virturalizer/">Kitchen visualizer</Link><Link href="/gallery/">Project gallery</Link><Link href="/contact-us/">Request an estimate</Link></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Forever Marble & Granite</span><span>Serving Philadelphia and surrounding communities</span></div></footer>;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><Header/><main>{children}</main><Footer/><a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with Forever Marble on WhatsApp"><svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16.02 3.2A12.72 12.72 0 0 0 5.14 22.5L3.8 28.8l6.42-1.48A12.72 12.72 0 1 0 16.02 3.2Zm0 22.95c-2.05 0-3.95-.6-5.55-1.65l-.4-.26-3.27.75.7-3.18-.27-.42a10.22 10.22 0 1 1 8.8 4.76Zm5.62-7.65c-.3-.16-1.8-.9-2.08-1-.28-.1-.48-.16-.68.16-.2.3-.78 1-.96 1.18-.18.2-.36.22-.66.06-.3-.16-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.31-.02-.48.14-.64.14-.14.3-.36.46-.54.16-.18.2-.3.3-.5.1-.2.05-.38-.02-.54-.08-.16-.68-1.64-.94-2.25-.25-.6-.5-.5-.68-.52h-.58c-.2 0-.54.08-.82.38-.28.3-1.08 1.06-1.08 2.58s1.1 2.98 1.26 3.18c.16.2 2.18 3.32 5.27 4.65.74.32 1.31.5 1.76.65.74.23 1.4.2 1.94.12.6-.09 1.8-.74 2.06-1.45.26-.72.26-1.34.18-1.46-.08-.13-.28-.2-.58-.36Z"/></svg><span>WhatsApp</span></a><a className="floating-call" href="tel:+12152038666" aria-label="Call Forever Marble">Call (215) 203-8666</a></body></html>;
}
