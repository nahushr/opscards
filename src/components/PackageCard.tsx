import type { OpsCardProps, PackageCardData } from "../types";
import { formatOpsCurrency, formatOpsNumber } from "../utils/formatters";
import { CardFrame, Eyebrow, Icon, Pill } from "./shared";

export type PackageCardProps = OpsCardProps<PackageCardData>;

export function PackageCard({ data, ...props }: PackageCardProps) {
  const dimensions = data.dimensions;
  const price = data.price == null
    ? undefined
    : formatOpsCurrency(data.price, {
        locale: data.locale,
        currency: data.currency,
        currencyDisplay: data.currencyDisplay,
        amountInMinorUnits: data.amountInMinorUnits,
        minorUnits: data.minorUnits,
      });

  return (
    <CardFrame data={data} variant="package" ariaLabel={`${data.name} package specification`} {...props}>
      <div className="ops-card__topline">
        <div className="ops-icon-tile ops-icon-tile--lavender"><Icon name="package" /></div>
        {data.featured && <Pill tone="violet">MOST USED</Pill>}
      </div>
      <div className="ops-package-card__heading">
        <div><Eyebrow>{data.code ?? "PACKAGING SPEC"}</Eyebrow><h3>{data.name}</h3></div>
        {price && <div className="ops-package-card__price"><strong>{price}</strong><small>per pack</small></div>}
      </div>
      <div className="ops-package-card__diagram" aria-hidden="true">
        <span className="ops-package-card__box"><i /><b /><em /></span>
        {dimensions && <span className="ops-package-card__dimensions">{dimensions.length} × {dimensions.width} × {dimensions.height} <small>{dimensions.unit ?? "cm"}</small></span>}
      </div>
      <div className="ops-package-card__details">
        {data.quantity != null && <div><span>Pack quantity</span><strong>{formatOpsNumber(data.quantity, data.locale)} <small>units</small></strong></div>}
        {data.weight != null && <div><span>Package weight</span><strong>{formatOpsNumber(data.weight, data.locale, { maximumFractionDigits: 2 })} <small>{data.weightUnit ?? "kg"}</small></strong></div>}
        {data.capacity != null && <div><span>Item capacity</span><strong>{formatOpsNumber(data.capacity, data.locale)} <small>{data.capacityUnit ?? "items"}</small></strong></div>}
      </div>
      <div className="ops-package-card__foot"><Icon name="cube" size={15} /><span>Dimensions shown as L × W × H</span><Icon name="arrow-up-right" size={16} /></div>
    </CardFrame>
  );
}
