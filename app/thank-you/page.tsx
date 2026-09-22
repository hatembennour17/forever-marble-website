import Link from "next/link";

export const metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <section className="contact-hero"><div className="shell"><p className="eyebrow light">Request received</p><h1>Thank you.</h1><p>Your estimate request was sent successfully. A member of the Forever Marble team will follow up with you soon.</p><div className="actions"><Link className="button gold" href="/">Return home</Link><a className="button ghost" href="tel:+12152038666">Call (215) 203-8666</a></div></div></section>;
}
