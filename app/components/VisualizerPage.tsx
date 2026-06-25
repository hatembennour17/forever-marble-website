import Link from "next/link";

type VisualizerPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  embedUrl: string;
  embedTitle: string;
  instructions: string[];
};

export default function VisualizerPage({ eyebrow, title, description, embedUrl, embedTitle, instructions }: VisualizerPageProps) {
  return <>
    <section className="tool-hero"><div className="shell"><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div></section>
    <section className="tool-section">
      <div className="shell tool-intro"><div><p className="eyebrow">Interactive design tool</p><h2>See the possibilities before choosing your surface</h2></div><ol>{instructions.map((instruction, index) => <li key={instruction}><span>0{index + 1}</span>{instruction}</li>)}</ol></div>
      <div className="shell tool-frame-wrap"><div className="tool-frame-bar"><span>Forever Marble Design Studio</span><a href={embedUrl} target="_blank" rel="noreferrer">Open full screen ↗</a></div><iframe className="tool-frame" src={embedUrl} title={embedTitle} allow="fullscreen" /></div>
      <div className="shell tool-help"><div><h2>Like what you created?</h2><p>Save a screenshot or note the material name, then bring it to our Philadelphia showroom. Our team can help you compare the digital look with real samples and full slabs.</p></div><div className="actions"><Link className="button gold" href="/contact-us/">Request an estimate</Link><a className="button outline" href="tel:+12152038666">Call (215) 203-8666</a></div></div>
    </section>
  </>;
}
