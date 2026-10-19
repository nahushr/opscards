import type { InventoryLocationCardData, OpsCardProps } from "../types";
import { formatOpsCurrency, formatOpsDateTime, formatOpsNumber, formatOpsPhone } from "../utils/formatters";
import { CardFrame, Eyebrow, Icon, Pill, getStatusTone } from "./shared";

export type InventoryLocationCardProps = OpsCardProps<InventoryLocationCardData>;

export function InventoryLocationCard({ data, ...props }: InventoryLocationCardProps) {
  const unit = data.unitLabel ?? "units";
  const hasReorderPoint = data.reorderPoint != null && Number.isFinite(data.reorderPoint);
  const reorderPoint = hasReorderPoint ? data.reorderPoint : undefined;
  const lowStock = reorderPoint != null && data.onHand <= reorderPoint;
  const targetStock = data.maxStockLevel != null && data.maxStockLevel > 0
    ? data.maxStockLevel
    : reorderPoint != null && reorderPoint > 0
      ? reorderPoint * 2
      : undefined;
  const ratio = targetStock == null ? 0 : Math.min(Math.max(data.onHand, 0) / targetStock, 1);
  const status = data.status === null
    ? undefined
    : data.status ?? (reorderPoint == null ? undefined : lowStock ? "Reorder soon" : "Healthy stock");
  const contactPhone = data.contactPhone?.trim();
  const contactEmail = data.contactEmail?.trim();
  const contactName = data.contactName?.trim();

  return (
    <CardFrame data={data} variant="inventory" ariaLabel={`${data.name} inventory`} {...props}>
      <div className="ops-card__topline">
        <div className="ops-icon-tile ops-icon-tile--sage"><Icon name="map-pin" /></div>
        {status && <Pill tone={getStatusTone(status)} dot>{status}</Pill>}
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
      {targetStock != null && (
        <div className={`ops-stock-meter ${lowStock ? "ops-stock-meter--low" : ""}`} aria-label={`${Math.round(ratio * 100)} percent of stock capacity`}>
          <span style={{ width: `${Math.max(ratio * 100, 7)}%` }} />
        </div>
      )}
      {(reorderPoint != null || data.maxStockLevel != null || data.restockDate) && (
        <div className="ops-inventory-card__meta">
          {reorderPoint != null && <span><Icon name="cube" size={14} />Reorder level <strong>{formatOpsNumber(reorderPoint, data.locale)} {unit}</strong></span>}
          {data.maxStockLevel != null && <span><Icon name="box" size={14} />Max stock <strong>{formatOpsNumber(data.maxStockLevel, data.locale)} {unit}</strong></span>}
          {data.restockDate && <span><Icon name="clock" size={13} />Last restocked <strong>{formatOpsDateTime(data.restockDate, data.locale, data.timeZone, { month: "short", day: "numeric", year: "numeric" })}</strong></span>}
        </div>
      )}
      {(contactName || contactPhone || contactEmail) && (
        <div className="ops-inventory-card__contact">
          {contactName && <span className="ops-inventory-card__contact-item"><Icon name="user" size={15} />{contactName}</span>}
          {contactPhone && <a className="ops-inventory-card__contact-item" href={data.contactPhoneHref ?? `tel:${contactPhone.replace(/[^+\d]/g, "")}`}><Icon name="phone" size={15} />{formatOpsPhone(contactPhone, data.contactCountryCode)}</a>}
          {contactEmail && <a className="ops-inventory-card__contact-item" href={`mailto:${contactEmail}`}><Icon name="mail" size={15} />{contactEmail}</a>}
        </div>
      )}
    </CardFrame>
  );
}
