import Container from "./ui/Container";
import Button from "./ui/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg backdrop-blur-[6px] border-b border-border/50">
      <Container className="flex items-center justify-between h-16">
        <a href="/" className="font-heading text-xl font-bold text-primary">
          ListingPro
        </a>
        <Button variant="primary" href="#pricing" className="text-sm py-2 px-4">
          Get Started
        </Button>
      </Container>
    </nav>
  );
}
