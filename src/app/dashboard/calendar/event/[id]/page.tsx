import { Suspense } from "react";
import { EventDetailClient } from "./_components/event-detail-client";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading event details...
        </div>
      }
    >
      <EventDetailClient eventId={id} />
    </Suspense>
  );
}
