import { Suspense } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ThankYouContent from "./ThankYouContent";

export const metadata = {
  title: "Payment Successful — ListingPro",
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      <Container className="max-w-lg text-center">
        <Suspense fallback={<div className="animate-pulse h-96" />}>
          <ThankYouContent />
        </Suspense>
      </Container>
    </main>
  );
}
