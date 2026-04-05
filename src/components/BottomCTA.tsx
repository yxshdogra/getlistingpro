import Container from "./ui/Container";
import Button from "./ui/Button";

export default function BottomCTA() {
  return (
    <section className="py-16 lg:py-24 bg-primary">
      <Container className="text-center">
        <h2 className="font-heading text-2xl leading-8 lg:text-[30px] lg:leading-9 font-bold text-white mb-3">
          Ready to get more orders?
        </h2>
        <p className="text-base leading-6 text-white/80 mb-8 max-w-md mx-auto">
          Join 500+ Indian sellers who are growing with ListingPro.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="white" href="#pricing">
            Choose a Plan
          </Button>
          <Button
            variant="whatsapp"
            href={process.env.NEXT_PUBLIC_WHATSAPP_ONBOARDING_URL || "#"}
          >
            Chat on WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}
