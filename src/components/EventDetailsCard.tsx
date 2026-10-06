import type { EventDetailsCardData, OpsCardProps } from "../types";
import { formatOpsDateTime, formatOpsPhone } from "../utils/formatters";
import { Avatar, CardFrame, Eyebrow, Icon, Pill } from "./shared";

export type EventDetailsCardProps = OpsCardProps<EventDetailsCardData>;

export function EventDetailsCard({ data, ...props }: EventDetailsCardProps) {
  const day = formatOpsDateTime(data.startAt, data.locale, data.timeZone, { day: "2-digit" });
  const month = formatOpsDateTime(data.startAt, data.locale, data.timeZone, { month: "short" });
  const start = formatOpsDateTime(data.startAt, data.locale, data.timeZone, { hour: "numeric", minute: "2-digit" });
  const end = data.endAt
    ? formatOpsDateTime(data.endAt, data.locale, data.timeZone, { hour: "numeric", minute: "2-digit" })
    : undefined;
  const attendeeCount = data.attendeeCount ?? data.attendees?.length ?? 0;
  const priorityTone = data.priority?.toLowerCase() === "urgent" || data.priority?.toLowerCase() === "high" ? "amber" : "neutral";

  return (
    <CardFrame data={data} variant="event" ariaLabel={data.title} {...props}>
      <div className="ops-event-card__calendar">
        <span>{month}</span><strong>{day}</strong>
      </div>
      <div className="ops-event-card__content">
        <div className="ops-event-card__topline">
          <Eyebrow>{data.status ?? "ON THE CALENDAR"}</Eyebrow>
          {data.priority && <Pill tone={priorityTone}>{data.priority} priority</Pill>}
        </div>
        <h3>{data.title}</h3>
        {data.description && <p className="ops-card__description">{data.description}</p>}
        <div className="ops-event-card__meta">
          <span><Icon name="clock" size={15} />{start}{end ? ` – ${end}` : ""}</span>
          {data.location && <span><Icon name="map-pin" size={15} />{data.location}</span>}
        </div>
        <div className="ops-event-card__bottom">
          <div className="ops-event-card__organizer">
            {data.organizer && <Avatar name={data.organizer.name} src={data.organizer.avatarUrl} size="small" />}
            {data.organizer && <span><strong>{data.organizer.name}</strong><small>{data.organizer.role ?? "Organizer"}{data.organizer.phone ? ` · ${formatOpsPhone(data.organizer.phone, data.organizer.phoneCountryCode)}` : ""}</small></span>}
          </div>
          <div className="ops-event-card__attendees" aria-label={`${attendeeCount} attendees`}>
            {(data.attendees ?? []).slice(0, 3).map((person, index) => <Avatar key={`${person.name}-${index}`} name={person.name} src={person.avatarUrl} size="small" />)}
            {attendeeCount > (data.attendees?.length ?? 0) && <span className="ops-avatar ops-avatar--small ops-avatar--more">+{attendeeCount - (data.attendees?.length ?? 0)}</span>}
            <small>{attendeeCount} attending</small>
          </div>
        </div>
        <span className="ops-card__arrow"><Icon name="arrow-up-right" size={17} /></span>
      </div>
    </CardFrame>
  );
}
