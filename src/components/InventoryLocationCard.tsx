import type { InventoryLocationCardData, OpsCardProps } from "../types";
import { formatOpsCurrency, formatOpsDateTime, formatOpsNumber } from "../utils/formatters";
import { CardFrame, Eyebrow, Icon, Pill, getStatusTone } from "./shared";

export type InventoryLocationCardProps = OpsCardProps<InventoryLocationCardData>;

export function InventoryLocationCard({ data, ...props }: InventoryLocationCardProps) {
  const unit = data.unitLabel ?? "units";
  const lowStock = data.onHand <= data.reorderPoint;
  const ratio = data.reorderPoint > 0 ? Math.min(data.onHand / (data.reorderPoint * 2), 1) : 1;
  const status = data.status ?? (lowStock ? "Reorder soon" : "Healthy stock");

  return (
    <CardFrame data={data} variant="inventory" ariaLabel={`${data.name} inventory`} {...props}>
      <div className="ops-card__topline">
        <div className="ops-icon-tile ops-icon-tile--sage"><Icon name="map-pin" /></div>
        <Pill tone={getStatusTone(status)} dot>{status}</Pill>
      </div>
      <div className="ops-inventory-card__heading">
        <div>
          <Eyebrow>{data.code ?? "STOCK LOCATION"}</Eyebrow>
          <h3>{data.name}</h3>
        </div>
        <span className="ops-card__arrow"><Icon name="arrow-up-right" size={17} /></span>
      </div>
      {(data.address || data.city || data.country) && (
        <p className="ops-inventory-card__address"><Icon name="map-pin" size={14} /> {[data.address, data.city, data.country].filter(Boolean).join(", ")}</p>
      )}
      <div className="ops-inventory-card__stock">
        <div className="ops-inventory-card__number"><strong>{formatOpsNumber(data.onHand, data.locale)}</strong><span><Icon name="box" size={14} />{unit} on hand</span></div>
        {data.inventoryValue != null && data.currency && <span className="ops-inventory-card__value">{formatOpsCurrency(data.inventoryValue, { locale: data.locale, currency: data.currency, currencyDisplay: data.currencyDisplay })}<small>stock value</small></span>}
      </div>
      <div className={`ops-stock-meter ${lowStock ? "ops-stock-meter--low" : ""}`} aria-label={`${Math.round(ratio * 100)} percent of healthy stock target`}>
        <span style={{ width: `${Math.max(ratio * 100, 7)}%` }} />
      </div>
      <div className="ops-inventory-card__meta">
        <span><Icon name="cube" size={14} />Reorder level <strong>{formatOpsNumber(data.reorderPoint, data.locale)} {unit}</strong></span>
        {data.restockDate && <span><Icon name="clock" size={13} /> Restock {formatOpsDateTime(data.restockDate, data.locale, data.timeZone, { month: "short", day: "numeric" })}</span>}
      </div>
    </CardFrame>
  );
}
