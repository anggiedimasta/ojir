interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
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
      throw new Error(`Google Calendar API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items?.map((event: any) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
    })) ?? [];
  } catch {
    throw new Error("Failed to fetch Google Calendar events");
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