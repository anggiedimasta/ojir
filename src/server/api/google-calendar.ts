import type { GoogleCalendarEvent } from '~/entities';

interface GoogleCalendarApiEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  status?: 'confirmed' | 'tentative' | 'cancelled';
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
    optional?: boolean;
    organizer?: boolean;
    self?: boolean;
  }>;
  creator?: {
    email: string;
    displayName?: string;
    self?: boolean;
  };
  organizer?: {
    email: string;
    displayName?: string;
    self?: boolean;
  };
  htmlLink?: string;
  iCalUID?: string;
  sequence?: number;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
  visibility?: 'default' | 'public' | 'private' | 'confidential';
}

interface GoogleCalendarApiResponse {
  items?: GoogleCalendarApiEvent[];
}

export async function fetchGoogleCalendarEvents(
  accessToken: string,
  timeMin: Date,
  timeMax: Date
): Promise<GoogleCalendarEvent[]> {
  if (!accessToken) {
    return [];
  }

  const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
  url.searchParams.append("timeMin", timeMin.toISOString());
  url.searchParams.append("timeMax", timeMax.toISOString());
  url.searchParams.append("singleEvents", "true");
  url.searchParams.append("orderBy", "startTime");

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Token may be invalid or expired");
      }

      let errorMessage = `Google Calendar API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMessage += ` - ${errorData.error.message}`;
        }
      } catch {
        // If we can't parse the error response, just use the status
      }

      throw new Error(errorMessage);
    }

    const data: GoogleCalendarApiResponse = await response.json();
    return data.items?.map((event: GoogleCalendarApiEvent): GoogleCalendarEvent => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.start.dateTime,
        timeZone: event.start.timeZone || 'UTC',
      },
      end: {
        dateTime: event.end.dateTime,
        timeZone: event.end.timeZone || 'UTC',
      },
      status: event.status,
      location: event.location,
      attendees: event.attendees,
      creator: event.creator,
      organizer: event.organizer,
      htmlLink: event.htmlLink,
      iCalUID: event.iCalUID,
      sequence: event.sequence,
      reminders: event.reminders,
      visibility: event.visibility,
    })) ?? [];
  } catch (error) {
    // Preserve the original error message and type
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to fetch Google Calendar events: ${String(error)}`);
  }
}

export async function createGoogleCalendarEvent(
  accessToken: string,
  event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
  }
): Promise<GoogleCalendarEvent> {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create Google Calendar event");
  }

  return response.json();
}

export async function updateGoogleCalendarEvent(
  accessToken: string,
  eventId: string,
  event: {
    summary?: string;
    description?: string;
    start?: { dateTime: string; timeZone: string };
    end?: { dateTime: string; timeZone: string };
  }
): Promise<GoogleCalendarEvent> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Google Calendar event");
  }

  return response.json();
}

export async function deleteGoogleCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Google Calendar event");
  }
}