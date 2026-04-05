import Container from "./ui/Container";
import SectionLabel from "./ui/SectionLabel";

const problems = [
  {
    icon: "📉",
    title: "Low Click-Through Rate",
    description: "Listings don't stand out in a sea of competitors.",
  },
  {
    icon: "📷",
    title: "No Professional Photos",
    description: "Phone photos reduce trust and lower conversions.",
  },
  {
    icon: "🎬",
    title: "No Time for Reels",
    description: "Video creation takes too much time and effort.",
  },
  {
    icon: "📝",
    title: "Weak Listings",
    description: "Poor description = low visibility and fewer orders.",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-16 lg:py-24 bg-bg-alt">
      <Container>
        <div className="text-center mb-12">
          <SectionLabel>THE PROBLEM</SectionLabel>
          <h2 className="font-heading text-2xl leading-8 lg:text-[30px] lg:leading-9 font-bold text-text-heading mt-3">
            Are you struggling with{" "}
            <span className="text-primary">low conversions?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="bg-white border border-border rounded-card p-6"
            >
              <span className="text-2xl mb-3 block">{problem.icon}</span>
              <h3 className="text-base font-semibold leading-6 text-text-dark mb-1">
                {problem.title}
              </h3>
              <p className="text-sm leading-5 text-text-muted">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
