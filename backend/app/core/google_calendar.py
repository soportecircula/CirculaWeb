from __future__ import annotations

import json
import logging
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

from google.oauth2 import service_account
from googleapiclient.discovery import build

from app.core.config import settings

_SCOPES = ["https://www.googleapis.com/auth/calendar"]
_TZ = ZoneInfo("America/Bogota")

_OFFICE_HOURS: dict[int, list[tuple[int, int]]] = {
    0: [(8, 17)],
    1: [(8, 17)],
    2: [(8, 17)],
    3: [(8, 17)],
    4: [(8, 17)],
    5: [(8, 12)],
}

_ATTENDEES_BY_TYPE: dict[str, list[str]] = {
    "demo_rep":  ["diana.erazo@grupocircula.com", "david.salazar@grupocircula.com"],
    "demo_indv": ["diana.erazo@grupocircula.com", "david.salazar@grupocircula.com"],
    "demo_col":  ["diana.erazo@grupocircula.com", "david.salazar@grupocircula.com"],
    "demo_esg":  ["diana.erazo@grupocircula.com", "david.salazar@grupocircula.com"],
    "support":   ["lst@grupocircula.com"],
}


def _get_service(impersonate: str):
    creds = service_account.Credentials.from_service_account_info(
        json.loads(settings.GOOGLE_SERVICE_ACCOUNT_JSON),
        scopes=_SCOPES,
    ).with_subject(impersonate)
    return build("calendar", "v3", credentials=creds, cache_discovery=False)


def get_available_slots(target_date: date, requirement_type: str) -> list[datetime]:
    weekday = target_date.weekday()
    if weekday not in _OFFICE_HOURS:
        return []

    attendees = _ATTENDEES_BY_TYPE.get(requirement_type, [])
    if not attendees:
        return []
    organizer = attendees[0]

    possible: list[tuple[datetime, datetime]] = []
    for start_h, end_h in _OFFICE_HOURS[weekday]:
        h = start_h
        while h < end_h:
            s = datetime(target_date.year, target_date.month, target_date.day, h, 0, tzinfo=_TZ)
            possible.append((s, s + timedelta(hours=1)))
            h += 1

    now = datetime.now(_TZ)
    possible = [(s, e) for s, e in possible if s > now]
    if not possible:
        return []

    day_start = datetime(target_date.year, target_date.month, target_date.day, 0, 0, tzinfo=_TZ)
    day_end = day_start + timedelta(days=1)
    body = {
        "timeMin": day_start.isoformat(),
        "timeMax": day_end.isoformat(),
        "timeZone": "America/Bogota",
        "items": [{"id": email} for email in attendees],
    }
    result = _get_service(organizer).freebusy().query(body=body).execute()

    all_busy: list[dict] = []
    for email in attendees:
        all_busy.extend(result["calendars"].get(email, {}).get("busy", []))

    available = []
    for slot_start, slot_end in possible:
        occupied = any(
            slot_start < datetime.fromisoformat(b["end"]).astimezone(_TZ)
            and slot_end > datetime.fromisoformat(b["start"]).astimezone(_TZ)
            for b in all_busy
        )
        if not occupied:
            available.append(slot_start)
    return available


def create_event(
    *,
    title: str,
    description: str,
    scheduled_at: datetime,
    requirement_type: str,
    attendee_email: str,
) -> str:
    attendees = _ATTENDEES_BY_TYPE.get(requirement_type, [])
    if not attendees:
        raise ValueError(f"requirement_type desconocido: {requirement_type}")
    organizer = attendees[0]

    end_dt = scheduled_at + timedelta(hours=1)
    guests = [{"email": e} for e in attendees]
    guests.append({"email": attendee_email})

    event = {
        "summary": title,
        "description": description,
        "start": {"dateTime": scheduled_at.isoformat(), "timeZone": "America/Bogota"},
        "end":   {"dateTime": end_dt.isoformat(),       "timeZone": "America/Bogota"},
        "attendees": guests,
        "reminders": {"useDefault": True},
    }
    result = (
        _get_service(organizer)
        .events()
        .insert(calendarId=organizer, body=event, sendUpdates="all")
        .execute()
    )
    return result["id"]
