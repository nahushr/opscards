import type { OpsCardProps, SupportTicketCardData } from "../types";
import { formatOpsDateTime, formatOpsPhone } from "../utils/formatters";
import { Avatar, CardFrame, Eyebrow, Icon, Pill, getStatusTone } from "./shared";

export type SupportTicketCardProps = OpsCardProps<SupportTicketCardData>;

export function SupportTicketCard({ data, ...props }: SupportTicketCardProps) {
  const status = data.status.replace(/-/g, " ");
  const priorityTone = data.priority?.toLowerCase() === "urgent" ? "red" : data.priority?.toLowerCase() === "high" ? "amber" : "neutral";

  return (
    <CardFrame data={data} variant="ticket" ariaLabel={`Ticket ${data.ticketNumber}: ${data.summary}`} {...props}>
      <div className="ops-ticket-card__header">
        <div className="ops-ticket-card__id"><span className="ops-icon-tile ops-icon-tile--blue"><Icon name="headset" /></span><div><Eyebrow>SUPPORT REQUEST</Eyebrow><strong>{data.ticketNumber}</strong></div></div>
        <Pill tone={getStatusTone(status)} dot>{status}</Pill>
      </div>
      <h3>{data.summary}</h3>
      <div className="ops-ticket-card__meta">
        {data.category && <span>{data.category}</span>}
        {data.priority && <Pill tone={priorityTone}>{data.priority} priority</Pill>}
        <span><Icon name="clock" size={14} />{formatOpsDateTime(data.createdAt, data.locale, data.timeZone, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
      </div>
      <div className="ops-ticket-card__footer">
        <div className="ops-ticket-card__requester">
          {data.requester && <Avatar name={data.requester.name} size="small" />}
          <span>{data.requester?.name ?? "Customer"}{data.requester?.phone ? <small>{formatOpsPhone(data.requester.phone, data.requester.phoneCountryCode)}</small> : null}</span>
        </div>
        <span className="ops-ticket-card__assignee">{data.assignee ? `Assigned to ${data.assignee}` : "Unassigned"}<Icon name="arrow-up-right" size={15} /></span>
      </div>
    </CardFrame>
  );
}
