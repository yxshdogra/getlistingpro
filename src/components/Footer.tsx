import Container from "./ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-heading text-base font-bold text-primary">
          ListingPro
        </span>
        <div className="flex items-center gap-6">
          <a
            href="#pricing"
            className="text-xs leading-4 text-text-muted hover:text-text-dark transition-colors"
          >
            Plans
          </a>
          <a
            href="#how-it-works"
            className="text-xs leading-4 text-text-muted hover:text-text-dark transition-colors"
          >
            How It Works
          </a>
          <a
            href="#"
            className="text-xs leading-4 text-text-muted hover:text-text-dark transition-colors"
          >
            Contact
          </a>
        </div>
        <p className="text-xs leading-4 text-text-muted">
          &copy; 2026 ListingPro. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
