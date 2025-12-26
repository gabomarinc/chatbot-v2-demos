import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_APP_URL + '/api/auth/google/callback'
);

export function getGoogleAuthUrl(agentId: string) {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly'],
        state: agentId,
        prompt: 'consent'
    });
}

export async function getGoogleTokens(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
}

export async function getCalendarService(tokens: any) {
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    client.setCredentials(tokens);
    return google.calendar({ version: 'v3', auth: client });
}

export async function listAvailableSlots(tokens: any, dateStr: string) {
    const calendar = await getCalendarService(tokens);
    const date = new Date(dateStr);

    // Set search range: from 00:00 to 23:59 of the given date
    const timeMin = new Date(date.setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(date.setHours(23, 59, 59, 999)).toISOString();

    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
    });

    const busySlots = response.data.items?.map(event => ({
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
    })) || [];

    // Simple slot logic: return the list of events to the LLM so it can decide
    return busySlots;
}

export async function createCalendarEvent(tokens: any, eventDetails: {
    summary: string;
    description: string;
    startTime: string;
    endTime: string;
    attendeeEmail?: string;
}) {
    const calendar = await getCalendarService(tokens);

    const event = {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: {
            dateTime: eventDetails.startTime,
            timeZone: 'UTC', // We should ideally use the agent's timezone
        },
        end: {
            dateTime: eventDetails.endTime,
            timeZone: 'UTC',
        },
        attendees: eventDetails.attendeeEmail ? [{ email: eventDetails.attendeeEmail }] : [],
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
    });

    return response.data;
}
