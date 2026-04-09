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
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Dedicated Support",
    description: "Get quick help anytime from our dedicated team.",
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
