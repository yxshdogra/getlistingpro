import Container from "./ui/Container";
import SectionLabel from "./ui/SectionLabel";

const steps = [
  {
    number: "1",
    title: "Choose Your Plan",
    description: "Pick the plan that fits your business.",
  },
  {
    number: "2",
    title: "Share Your Products",
    description: "Send us your product details and brand info.",
  },
  {
    number: "3",
    title: "We Create Content",
    description: "Photos, reels & listings — done for you.",
  },
  {
    number: "4",
    title: "Watch Orders Grow",
    description: "Publish and start getting more orders.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-24 bg-bg-alt">
      <Container>
        <div className="text-center mb-12">
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 className="font-heading text-2xl leading-8 lg:text-[30px] lg:leading-9 font-bold text-text-heading mt-3">
            Start getting results in{" "}
            <span className="text-primary">4 simple steps.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-heading font-bold text-sm mb-4">
                {step.number}
              </div>
              <h3 className="text-base font-semibold leading-6 text-text-dark mb-1">
                {step.title}
              </h3>
              <p className="text-sm leading-5 text-text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
