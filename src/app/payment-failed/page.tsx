import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import PaymentFailedContent from "./PaymentFailedContent";

export const metadata = {
  title: "Payment Failed — ListingPro",
};

export default function PaymentFailedPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <Container>
          <Suspense fallback={<div className="animate-pulse h-64" />}>
            <PaymentFailedContent />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
}
