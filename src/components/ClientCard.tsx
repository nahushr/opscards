import type { CSSProperties } from "react";
import type { ClientCardData, OpsCardProps } from "../types";
import { formatOpsCompactNumber, getInitials } from "../utils/formatters";
import { CardFrame, getStatusTone, Icon, Pill } from "./shared";

export type ClientCardProps = OpsCardProps<ClientCardData> & {
  /** Marks this client as the current selection. */
  selected?: boolean;
  /** Uses a shorter layout for dense client pickers. */
  compact?: boolean;
  /** Optional test selector for the client name heading. */
  nameTestId?: string;
};

export function ClientCard({ data, className, style: customStyle, selected = false, compact = false, nameTestId, ...props }: ClientCardProps) {
  const style = {
    ...customStyle,
    "--ops-client-accent": data.accentColor ?? "#4d805d",
  } as CSSProperties & { "--ops-client-accent": string };
  const cardClassName = [className, selected && "ops-client-card--selected", compact && "ops-client-card--compact"].filter(Boolean).join(" ");

  return (
    <CardFrame data={data} variant="client" className={cardClassName} style={style} ariaLabel={`${data.name} client workspace${selected ? ", selected" : ""}`} {...props}>
      <div className="ops-client-card__glow" aria-hidden="true" />
      <div className="ops-client-card__header">
        <div className="ops-client-card__identity">
          <span className={`ops-client-card__logo ${data.logoUrl ? "ops-client-card__logo--image" : ""}`} aria-hidden="true">
            {data.logoUrl ? <img src={data.logoUrl} alt="" /> : getInitials(data.name)}
          </span>
          <div className="ops-client-card__heading">
            <span className="ops-eyebrow">Client workspace</span>
            <h3 data-test-id={nameTestId}>{data.name}</h3>
            {data.clientCode && <span className="ops-client-card__code">{data.clientCode}</span>}
          </div>
        </div>
      </div>

      {data.description && <p className="ops-client-card__description">{data.description}</p>}

      <div className="ops-client-card__details">
        <Pill tone={getStatusTone(data.status ?? "Active")} dot>{data.status ?? "Active"}</Pill>
        {data.industry && <span className="ops-client-card__industry">{data.industry}</span>}
        {data.location && <span><Icon name="map-pin" size={14} />{data.location}</span>}
        {data.plan && <span className="ops-client-card__plan">{data.plan}</span>}
      </div>

      {data.metrics && data.metrics.length > 0 && (
        <div className="ops-client-card__metrics">
          {data.metrics.slice(0, 3).map((metric) => (
            <div className="ops-client-card__metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{typeof metric.value === "number" ? formatOpsCompactNumber(metric.value, data.locale) : metric.value}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="ops-client-card__footer">
        <span>Open workspace</span>
        <span className="ops-client-card__arrow"><Icon name="arrow-up-right" size={16} /></span>
      </div>
    </CardFrame>
  );
}
