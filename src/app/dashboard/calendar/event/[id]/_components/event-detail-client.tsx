'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSidebarStore } from '~/store/sidebar-store'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { useToast } from '~/components/ui/use-toast'
import { api } from '~/trpc/react'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react'
import type { CalendarEventResponse, GoogleCalendarEventResponse } from '~/entities/api/calendar'
import type { GoogleCalendarAttendee, GoogleCalendarPerson, GoogleCalendarReminders } from '~/entities/integration'
import { GoogleIcon } from "../../../_components/google-icon"

interface EventDetailClientProps {
  eventId: string
}

// Type guard to check if event is a Google Calendar event
function isGoogleCalendarEvent(event: CalendarEventResponse): event is GoogleCalendarEventResponse {
  return event.isGoogleEvent && 'organizer' in event
}

// Type guard to check if event has attendees
function hasAttendees(event: CalendarEventResponse): event is CalendarEventResponse & { attendees: GoogleCalendarAttendee[] } {
  return event.isGoogleEvent && 'attendees' in event && Array.isArray(event.attendees)
}

// Type guard to check if event has organizer
function hasOrganizer(event: CalendarEventResponse): event is CalendarEventResponse & { organizer: GoogleCalendarPerson } {
  return event.isGoogleEvent && 'organizer' in event && event.organizer !== undefined
}

// Type guard to check if event has location
function hasLocation(event: CalendarEventResponse): event is CalendarEventResponse & { location: string } {
  return event.isGoogleEvent && 'location' in event && typeof event.location === 'string'
}

// Type guard to check if event has reminders
function hasReminders(event: CalendarEventResponse): event is CalendarEventResponse & { reminders: GoogleCalendarReminders } {
  return event.isGoogleEvent && 'reminders' in event && event.reminders !== undefined
}

// Type guard to check if event has status
function hasStatus(event: CalendarEventResponse): event is CalendarEventResponse & { status: string } {
  return event.isGoogleEvent && 'status' in event && typeof event.status === 'string'
}

export function EventDetailClient({ eventId }: EventDetailClientProps) {
  const { isCollapsed } = useSidebarStore()
  const { toast } = useToast()
  const router = useRouter()

  // For Google events, eventId will be the Google event ID
  // For local events, it will be the database ID
  const isGoogleEvent = eventId.includes('@') || eventId.includes('_')

  const { data: localEvents = [] } = api.calendar.getByDateRange.useQuery(
    {
      startDate: new Date(new Date().getFullYear() - 1, 0, 1), // Large date range to find the event
      endDate: new Date(new Date().getFullYear() + 1, 11, 31),
      includeGoogleEvents: true,
    },
    {
      enabled: true,
    }
  )

  // Find the specific event
  const event = localEvents.find(e => e.id === eventId)

  useEffect(() => {
    if (localEvents.length > 0 && !event) {
      toast({
        variant: 'destructive',
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
      })
      router.push('/dashboard/calendar')
    }
  }, [localEvents, event, toast, router])

  if (!event) {
    return (
      <div className={`transition-all duration-200 ease-out transform-gpu ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
        <div className="mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading event details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.round(diffMs / (1000 * 60))
    const hours = Math.floor(diffMins / 60)
    const minutes = diffMins % 60

    if (hours === 0) return `${minutes} minutes`
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`
  }

  const handleViewInGoogleCalendar = () => {
    if (!event) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Event not found.',
      })
      return
    }

    if (!event.isGoogleEvent) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'This event is not linked to Google Calendar.',
      })
      return
    }

    try {
      // Use the correct Google Calendar URL format for viewing events
      // Option 1: Open Google Calendar and search for the event
      const searchQuery = event.title || event.id || 'event'
      const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/search?q=${encodeURIComponent(searchQuery)}`

      // Option 2: Alternative - open Google Calendar to the event date
      const eventDate = new Date(event.startTime)
      const year = eventDate.getFullYear()
      const month = eventDate.getMonth() + 1 // getMonth() returns 0-11, so add 1
      const day = eventDate.getDate()
      const calendarDateUrl = `https://calendar.google.com/calendar/u/0/r/day/${year}/${month}/${day}`

      // Use the date-based URL as it's more reliable
      window.open(calendarDateUrl, '_blank', 'noopener,noreferrer')

      toast({
        title: 'Opening Google Calendar',
        description: 'Opening Google Calendar to the event date.',
      })
    } catch (error) {
      console.error('Failed to open Google Calendar:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to open Google Calendar. Please try again.',
      })
    }
  }

  const handleShareEvent = async () => {
    if (!event) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Event not found.',
      })
      return
    }

    try {
      // Use the current dashboard URL for sharing
      const shareUrl = window.location.href

      // Try native sharing first (mobile/modern browsers)
      if (navigator.share) {
        try {
          await navigator.share({
            title: event.title,
            text: `Check out this event: ${event.title}`,
            url: shareUrl,
          })

          toast({
            title: 'Event Shared',
            description: 'Event has been shared successfully.',
          })
          return
        } catch (error) {
          // If sharing is cancelled or fails, fall through to clipboard
          console.log('Native sharing cancelled or failed:', error)
        }
      }

      // Fallback to copying link to clipboard
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link Copied',
        description: 'Event link has been copied to your clipboard.',
      })
    } catch (error) {
      console.error('Failed to share event:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to share event. Please try again.',
      })
    }
  }

  return (
    <div className={`transition-all duration-200 ease-out transform-gpu ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            color="gray"
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex items-center gap-2">
                {event.isGoogleEvent && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border">
                    <GoogleIcon className="h-3 w-3 mr-1" />
                    Google Calendar
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!event.isGoogleEvent && (
                <>
                  <Button color="gray" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button color="gray" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date & Time Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
                Date & Time
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-1 text-gray-500" />
                  <div>
                    <p className="font-medium">Start</p>
                    <p className="text-gray-600">{formatDateTime(new Date(event.startTime))}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-1 text-gray-500" />
                  <div>
                    <p className="font-medium">End</p>
                    <p className="text-gray-600">{formatDateTime(new Date(event.endTime))}</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500">
                    Duration: {formatDuration(new Date(event.startTime), new Date(event.endTime))}
                  </p>
                </div>
              </div>
            </Card>

            {/* Location Card */}
            {hasLocation(event) && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                  Location
                </h2>
                <p className="text-gray-700">{event.location}</p>
              </Card>
            )}

            {/* Meeting Links Card */}
            {event.description && (event.description.includes('meet.google.com') || event.description.includes('zoom.us') || event.description.includes('teams.microsoft.com')) && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2 text-emerald-600" />
                  Meeting Links
                </h2>
                <div className="space-y-2">
                  {event.description.split('\n').filter(line =>
                    line.includes('meet.google.com') ||
                    line.includes('zoom.us') ||
                    line.includes('teams.microsoft.com') ||
                    line.includes('Join by phone') ||
                    line.includes('+1') ||
                    line.includes('PIN:')
                  ).map((line, index) => (
                    <div key={index} className="text-sm">
                      {line.includes('http') ? (
                        <a
                          href={line.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {line.trim()}
                        </a>
                      ) : (
                        <p className="text-gray-700">{line.trim()}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Attendees Card */}
            {hasAttendees(event) && event.attendees.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-emerald-600" />
                  Attendees ({event.attendees.length})
                </h2>
                <div className="space-y-3">
                  {/* Organizer */}
                  {hasOrganizer(event) && (
                    <div className="pb-3 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">
                          {event.organizer.displayName || event.organizer.email}
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                          Organizer
                        </span>
                      </div>
                      {event.organizer.displayName && (
                        <p className="text-xs text-gray-500 ml-4">{event.organizer.email}</p>
                      )}
                    </div>
                  )}

                  {/* Attendee List */}
                  <div className="space-y-2">
                    {event.attendees.map((attendee: GoogleCalendarAttendee, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          attendee.responseStatus === 'accepted' ? 'bg-green-500' :
                          attendee.responseStatus === 'declined' ? 'bg-red-500' :
                          attendee.responseStatus === 'tentative' ? 'bg-yellow-500' :
                          'bg-gray-300'
                        }`}></div>
                        <span className="text-sm text-gray-900">
                          {attendee.displayName || attendee.email}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          attendee.responseStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                          attendee.responseStatus === 'declined' ? 'bg-red-100 text-red-800' :
                          attendee.responseStatus === 'tentative' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {attendee.responseStatus === 'needsAction' ? 'Awaiting' :
                           attendee.responseStatus === 'accepted' ? 'Yes' :
                           attendee.responseStatus === 'declined' ? 'No' :
                           attendee.responseStatus === 'tentative' ? 'Maybe' :
                           'Unknown'}
                        </span>
                        {attendee.optional && (
                          <span className="text-xs text-gray-500">(Optional)</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Response Summary */}
                  <div className="pt-3 border-t">
                    <div className="flex gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {event.attendees.filter((a: GoogleCalendarAttendee) => a.responseStatus === 'accepted').length} yes
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        {event.attendees.filter((a: GoogleCalendarAttendee) => a.responseStatus === 'needsAction').length} awaiting
                      </span>
                      {event.attendees.filter((a: GoogleCalendarAttendee) => a.responseStatus === 'declined').length > 0 && (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          {event.attendees.filter((a: GoogleCalendarAttendee) => a.responseStatus === 'declined').length} no
                        </span>
                      )}
                      {event.attendees.filter((a: GoogleCalendarAttendee) => a.responseStatus === 'tentative').length > 0 && (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          {event.attendees.filter((a: GoogleCalendarAttendee) => a.responseStatus === 'tentative').length} maybe
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Description Card */}
            {event.description && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  color="gray"
                  size="sm"
                  align="left"
                  onClick={handleShareEvent}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
                {event.isGoogleEvent && (
                  <Button className="w-full" color="gray" size="sm" align="left" onClick={handleViewInGoogleCalendar}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Google Calendar
                  </Button>
                )}
              </div>
            </Card>

            {/* Event Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Event Info</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Event ID</p>
                  <p className="text-gray-600 font-mono text-xs break-all">{event.id}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Source</p>
                  <p className="text-gray-600">{event.isGoogleEvent ? 'Google Calendar' : 'Local Calendar'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Created</p>
                  <p className="text-gray-600">
                    {event.isGoogleEvent ? 'Synced from Google' : 'Created locally'}
                  </p>
                </div>
                {hasStatus(event) && (
                  <div>
                    <p className="font-medium text-gray-900">Status</p>
                    <p className="text-gray-600 capitalize">{event.status}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Reminders Card */}
            {hasReminders(event) && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Reminders</h2>
                <div className="space-y-2 text-sm">
                  {event.reminders.useDefault ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Default reminders (30 minutes before)</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {event.reminders.overrides?.map((reminder, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            reminder.method === 'popup' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}></div>
                          <span className="text-gray-700">
                            {reminder.method === 'popup' ? 'Popup' : 'Email'} - {reminder.minutes} minutes before
                          </span>
                        </div>
                      )) || (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-gray-500">No reminders set</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}