import Image from "next/image";
import Container from "./ui/Container";
import Button from "./ui/Button";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full bg-hero-circle-blue" />
      <div className="absolute top-40 -right-32 w-[350px] h-[350px] rounded-full bg-hero-circle-orange" />

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 rounded-pill bg-success/10 px-3 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm font-medium text-text-dark">
                Trusted by 500+ Indian sellers
              </span>
            </div>

            <h1 className="font-heading text-[30px] leading-[38px] lg:text-[48px] lg:leading-[60px] font-bold tracking-[-0.75px] lg:tracking-[-1.2px] text-text-heading mb-4">
              Get More Orders with{" "}
              <span className="text-primary">Better Content.</span>
            </h1>

            <p className="text-base leading-[26px] lg:text-lg lg:leading-7 text-text-muted mb-8 max-w-lg mx-auto lg:mx-0">
              Increase product visibility and conversions with model shoots,
              viral reels, and SEO-optimized marketplace listings.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button variant="primary" href="#pricing">
                Boost My Sales
              </Button>
              <Button variant="outlined" href="#pricing">
                View Plans →
              </Button>
            </div>

            {/* Marketplace logos */}
            <div className="mt-12">
              <p className="text-xs font-semibold uppercase tracking-[0.7px] text-text-muted mb-4">
                Works with top marketplaces
              </p>
              <div className="flex items-center gap-4 sm:gap-6 justify-center lg:justify-start flex-wrap">
                {[
                  { name: "Amazon", src: "/images/logos/Amazon_logo.svg", w: 90, h: 28, cls: "h-5 sm:h-7 w-auto" },
                  { name: "Flipkart", src: "/images/logos/Flipkart-Logo.wine.svg", w: 100, h: 30, cls: "h-7 sm:h-9 w-auto" },
                  { name: "Meesho", src: "/images/logos/meesho.svg", w: 90, h: 20, cls: "h-5 sm:h-7 w-auto" },
                  { name: "Myntra", src: "/images/logos/myntra.svg", w: 80, h: 34, cls: "h-7 sm:h-9 w-auto" },
                ].map((logo) => (
                  <Image
                    key={logo.name}
                    src={logo.src}
                    alt={logo.name}
                    width={logo.w}
                    height={logo.h}
                    className={logo.cls}
                    unoptimized
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side — before/after image */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <Image
              src="/images/hero-before-after.webp"
              alt="Before and after: plain product photo transformed into professional model shoot with phone mockup"
              width={366}
              height={215}
              priority
              className="w-full h-auto rounded-card"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
