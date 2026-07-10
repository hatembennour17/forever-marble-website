import Image from "next/image";

const productFaqs = [
  { question: "Why is granite the perfect material for countertops?", answer: "Granite not only elevates the aesthetic of your space but ensures longevity due to its natural durability and resistance to heat, making it ideal for bustling kitchens and bathrooms. Opting for granite means investing in a surface that withstands the test of time and frequent use." },
  { question: "How do I maintain my granite countertop?", answer: "Simple daily cleaning with mild soap and water will keep your countertop looking pristine. To maintain its polished finish, avoid abrasive cleaners which can dull the surface over time." },
  { question: "What are the trends in granite countertop innovations?", answer: "The current trend emphasizes minimalist and elegant designs, with neutral shades that blend seamlessly into modern and traditional décors alike, enhancing the overall style of your space." },
  { question: "How long does granite countertop installation take?", answer: "Most installations can be completed within a day, depending on the complexity of the project, ensuring minimal disruption to your daily routine." },
  { question: "Are there customizable options for granite countertops?", answer: "Absolutely! We offer a wide array of finishes and edges, allowing you to customize your countertop to meet your specific design preferences and functional needs." },
];

export default function LegacyProductTail() {
  return <>
    <section className="legacy-faq-section">
      <div className="legacy-faq-shell">
        <h2>FAQs</h2>
        <div className="legacy-faq-list">{productFaqs.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{index + 1}. {item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}</div>
      </div>
    </section>
    <section className="legacy-dream-cta">
      <div className="shell">
        <h2>You dream It, we Make It</h2>
        <Image src="/images/information/slogan.png" alt="Marble kitchen countertop offers" width={600} height={80} />
        <a className="button gold" href="https://square.site/book/6J5Y31VF9BB8M/forever-marble-granite-quartz-stone-philadelphia-pa">Book An Appointment</a>
      </div>
    </section>
  </>;
}
