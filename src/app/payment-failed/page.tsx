import { Suspense } from "react";
import Container from "@/components/ui/Container";
import PaymentFailedContent from "./PaymentFailedContent";

export const metadata = {
  title: "Payment Failed — ListingPro",
};

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      <Container className="max-w-lg text-center">
        <Suspense fallback={<div className="animate-pulse h-64" />}>
          <PaymentFailedContent />
        </Suspense>
      </Container>
    </main>
  );
}
