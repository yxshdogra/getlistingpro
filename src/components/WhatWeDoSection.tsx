import Image from "next/image";
import Container from "./ui/Container";
import SectionLabel from "./ui/SectionLabel";

const services = [
  {
    tag: "Photos",
    title: "Model Photo Shoots",
    description: "Studio-quality photos with AI models in 48 hours.",
    image: "/images/service-photos.webp",
    alt: "Phone displaying AI model wearing an orange dress in a clothing store",
    width: 318,
    height: 253,
  },
  {
    tag: "Reels",
    title: "Viral Reels & Videos",
    description: "Scroll-stopping content that sells your products.",
    image: "/images/service-reels.webp",
    alt: "Model holding a skincare product for a promotional reel",
    width: 318,
    height: 262,
  },
  {
    tag: "SEO",
    title: "SEO Marketplace Listings",
    description: "Rank higher, get more clicks with optimized copy.",
    image: "/images/service-seo.webp",
    alt: "Hands typing on laptop with search bar overlay representing SEO optimization",
    width: 318,
    height: 254,
  },
  {
    tag: "Branding",
    title: "Brand & Logo Design",
    description: "Look professional from day one with cohesive branding.",
    image: "/images/service-branding.webp",
    alt: "Designer working on a colorful logo with color swatches on desk",
    width: 316,
    height: 253,
  },
];

export default function WhatWeDoSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="text-center mb-12">
          <SectionLabel>WHAT WE DO</SectionLabel>
          <h2 className="font-heading text-2xl leading-8 lg:text-[30px] lg:leading-9 font-bold text-text-heading mt-3">
            Everything you need to{" "}
            <span className="text-primary">sell more.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white border border-border rounded-card overflow-hidden"
            >
              <div className="aspect-[16/10] relative bg-bg-alt">
                <Image
                  src={service.image}
                  alt={service.alt}
                  width={service.width}
                  height={service.height}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <span className="inline-block text-xs font-semibold text-feature-green bg-feature-green-tint rounded-pill px-2.5 py-1 mb-3">
                  {service.tag}
                </span>
                <h3 className="text-base font-semibold leading-6 text-text-dark mb-1">
                  {service.title}
                </h3>
                <p className="text-sm leading-5 text-text-muted">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
