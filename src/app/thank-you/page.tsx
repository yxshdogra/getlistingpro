import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import ThankYouContent from "./ThankYouContent";

export const metadata = {
  title: "Payment Successful — ListingPro",
};

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <Container>
          <Suspense fallback={<div className="animate-pulse h-96" />}>
            <ThankYouContent />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
}
