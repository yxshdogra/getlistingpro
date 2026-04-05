import Container from "./ui/Container";
import SectionLabel from "./ui/SectionLabel";

const trustItems = [
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Fast Delivery",
    description: "Get your content within 48 hours of placing your order.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Satisfaction Guaranteed",
    description:
      "Not happy? We'll revise until you are — no extra cost.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "WhatsApp Support",
    description: "Get quick help anytime directly on WhatsApp.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    title: "Cancel Anytime",
    description: "No lock-ins, no commitments. Cancel whenever you want.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 lg:py-24 bg-bg-alt">
      <Container>
        <div className="text-center mb-12">
          <SectionLabel>WHY US</SectionLabel>
          <h2 className="font-heading text-2xl leading-8 lg:text-[30px] lg:leading-9 font-bold text-text-heading mt-3">
            Why Sellers <span className="text-primary">Trust Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-border rounded-card p-5 text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-tint mb-4">
                {item.icon}
              </div>
              <h3 className="text-base font-semibold leading-6 text-text-dark mb-1">
                {item.title}
              </h3>
              <p className="text-sm leading-5 text-text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
