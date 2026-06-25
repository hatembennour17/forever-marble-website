import Image from "next/image";
import Link from "next/link";

const materials = [
  {title:"Marble", href:"/marble/", image:"/images/marble-countertops.jpg", text:"Elegant, one-of-a-kind veining for kitchens, baths and statement spaces."},
  {title:"Granite", href:"/granite/", image:"/images/granite-countertops.jpg", text:"Naturally durable surfaces with depth, character and enduring value."},
  {title:"Quartz", href:"/quartz/", image:"/images/quartz-countertops.png", text:"Low-maintenance performance in a wide range of consistent colors."},
  {title:"Quartzite", href:"/quartzite/", image:"/images/quartzite-kitchen.png", text:"Natural stone beauty with exceptional strength and distinctive movement."},
];

const reviews = [
  {quote:"Forever Marble & Granite always has a great selection and does a fast turnaround and installation every time. Ben is terrific to work with.", name:"Jessica Cifaldi", source:"Google Review"},
  {quote:"They came out and measured, and came back a week later for the installation. Professional and friendly—the easiest people I've worked with in a while.", name:"TJ Finley", source:"Google Review"},
  {quote:"The craftsmanship is top-notch, and the marble's quality adds a luxurious touch to my bathroom. Five stars well deserved!", name:"Nada S.", source:"BBB Review"},
];

export default function Home() {
  return <>
    <section className="hero"><Image src="/images/hero-kitchen.png" alt="Custom marble vanity and backsplash installed in Philadelphia" fill priority sizes="100vw"/><div className="hero-shade"/><div className="shell hero-content"><p className="eyebrow light">Fabricated locally. Installed beautifully.</p><h1>Luxury countertops,<br/><em>made for real life.</em></h1><p>Custom granite, marble, quartz and quartzite countertops for Philadelphia homes—measured, fabricated and installed by one experienced team.</p><div className="actions"><Link className="button gold" href="/contact-us/">Get a free estimate</Link><a className="button ghost" href="https://square.site/book/6J5Y31VF9BB8M/forever-marble-granite-quartz-stone-philadelphia-pa">Visit the showroom</a></div></div><div className="hero-proof shell"><span>20+ years of craftsmanship</span><span>Full-service installation</span><span>Philadelphia showroom</span></div></section>

    <section className="quick-links"><div className="shell quick-grid"><Link href="/specials/" style={{backgroundImage:"linear-gradient(180deg,transparent,rgba(15,17,20,.72)),url('/images/specials-optimized.webp')"}}><span>Limited-time</span><h2>Special Deals</h2></Link><Link href="/natural-stones/" style={{backgroundImage:"linear-gradient(180deg,transparent,rgba(15,17,20,.72)),url('/images/natural-stone.jpg')"}}><span>Explore</span><h2>Natural Stone</h2></Link><Link href="/edge-profiles/" style={{backgroundImage:"linear-gradient(180deg,transparent,rgba(15,17,20,.72)),url('/images/edge-profiles.jpeg')"}}><span>Design details</span><h2>Edge Profiles</h2></Link></div></section>

    <section className="section intro"><div className="shell split"><div><p className="eyebrow">Forever Marble & Granite</p><h2>A local countertop company built around your project</h2></div><div><p className="lead">From the first slab you choose to the final seam we polish, our team handles every detail with care. You get practical guidance, precise fabrication and a finished surface that belongs in your home.</p><Link className="text-link" href="/about-us/">Meet our team →</Link></div></div></section>

    <section className="section materials"><div className="shell"><div className="section-head"><div><p className="eyebrow">Find your surface</p><h2>Stone selected for the way you live</h2></div><p>Compare natural and engineered materials, then see full slabs in our Philadelphia showroom.</p></div><div className="material-grid">{materials.map((m,i)=><Link href={m.href} className="material-card" key={m.title}><div className="card-image"><Image src={m.image} alt={`${m.title} countertop inspiration`} fill sizes="(max-width: 800px) 100vw, 25vw"/></div><div><span>0{i+1}</span><h3>{m.title} Countertops</h3><p>{m.text}</p><b>Explore {m.title.toLowerCase()} →</b></div></Link>)}</div></div></section>

    <section className="dark-section"><div className="shell process-grid"><div><p className="eyebrow light">One team, start to finish</p><h2>A smoother path to a better countertop</h2><p>Clear decisions. Careful measurements. Expert installation. We keep your project moving without losing sight of the details.</p><Link className="button gold" href="/contact-us/">Plan your project</Link></div><ol><li><span>01</span><div><h3>Choose your material</h3><p>See full slabs and samples with guidance based on your style, budget and daily routine.</p></div></li><li><span>02</span><div><h3>Template & fabricate</h3><p>We measure your space precisely, plan seams and cut each piece in our local shop.</p></div></li><li><span>03</span><div><h3>Professional installation</h3><p>Our installers fit, level and finish your new surface with respect for your home.</p></div></li></ol></div></section>

    <section className="feature"><div className="feature-image"><Image src="/images/craftsmanship.jpg" alt="Bright kitchen with custom stone countertops" fill sizes="50vw"/></div><div className="feature-copy"><p className="eyebrow">Precision in every detail</p><h2>Craftsmanship you can see—and service you can feel</h2><div className="mini-grid"><div><b>Full service</b><p>Selection, templating, fabrication and installation.</p></div><div><b>Premium materials</b><p>Trusted suppliers and a carefully curated inventory.</p></div><div><b>Local experience</b><p>Knowledge built across thousands of area projects.</p></div><div><b>Perfect-fit focus</b><p>Careful planning for clean lines and polished results.</p></div></div></div></section>

    <section className="section testimonials"><div className="shell"><div className="section-head"><div><p className="eyebrow">Our clients</p><h2>Philadelphia homeowners say it best</h2></div><a className="text-link" href="https://g.page/r/CQa5dWdF6DmHEB0/review">Review us on Google →</a></div><div className="review-grid">{reviews.map(r=><figure key={r.name}><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“{r.quote}”</blockquote><figcaption><b>{r.name}</b><span>{r.source}</span></figcaption></figure>)}</div></div></section>

    <section className="cta"><div className="shell cta-inner"><div><p className="eyebrow light">Bring us your ideas</p><h2>You dream it.<br/>We make it.</h2></div><div><p>Visit our showroom at 7339 Wissinoming Street in Philadelphia, or tell us about your project online.</p><div className="actions"><Link className="button white" href="/contact-us/">Request an estimate</Link><a className="phone-link" href="tel:+12152038666">(215) 203-8666</a></div></div></div></section>
  </>;
}
