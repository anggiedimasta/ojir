import { Suspense } from 'react'
import { EventDetailClient } from './_components/event-detail-client'

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading event details...</div>}>
      <EventDetailClient eventId={id} />
    </Suspense>
  )
}