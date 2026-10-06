import type { OpsCardProps, OrderLineItemCardData } from "../types";
import { formatOpsCurrency, formatOpsNumber } from "../utils/formatters";
import { CardFrame, Icon, Pill, ProductImage, getStatusTone } from "./shared";

export type OrderLineItemCardProps = OpsCardProps<OrderLineItemCardData>;

export function OrderLineItemCard({ data, ...props }: OrderLineItemCardProps) {
  const lineTotal = data.subtotal ?? data.unitPrice * data.quantity;
  const priceOptions = {
    locale: data.locale,
    currency: data.currency,
    currencyDisplay: data.currencyDisplay,
    amountInMinorUnits: data.amountInMinorUnits,
    minorUnits: data.minorUnits,
  };

  return (
    <CardFrame data={data} variant="order-line" ariaLabel={`${data.productTitle}, quantity ${data.quantity}`} {...props}>
      <ProductImage src={data.productImageUrl} alt={data.productTitle} className="ops-order-card__image" />
      <div className="ops-order-card__body">
        <div className="ops-order-card__heading">
          <div><span className="ops-order-card__sku">{data.sku ?? "ORDER ITEM"}</span><h3>{data.productTitle}</h3>{data.variant && <span className="ops-order-card__variant">{data.variant}</span>}</div>
          {data.status && <Pill tone={getStatusTone(data.status)} dot>{data.status}</Pill>}
        </div>
        <div className="ops-order-card__details">
          <span><small>Quantity</small><strong>× {formatOpsNumber(data.quantity, data.locale)}</strong></span>
          <span><small>Unit price</small><strong>{formatOpsCurrency(data.unitPrice, priceOptions)}</strong></span>
          {data.location && <span className="ops-order-card__location"><Icon name="map-pin" size={13} /><small>{data.location}</small></span>}
        </div>
      </div>
      <div className="ops-order-card__total"><small>LINE TOTAL</small><strong>{formatOpsCurrency(lineTotal, priceOptions)}</strong><span><Icon name="arrow-up-right" size={15} /></span></div>
    </CardFrame>
  );
}
