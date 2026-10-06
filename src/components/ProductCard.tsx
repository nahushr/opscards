import type { OpsCardProps, ProductCardData } from "../types";
import { formatOpsCurrency } from "../utils/formatters";
import { CardFrame, Eyebrow, Icon, Pill, ProductImage } from "./shared";

export type ProductCardProps = OpsCardProps<ProductCardData>;

export function ProductCard({ data, ...props }: ProductCardProps) {
  const image = data.imageUrl ?? data.images?.[0]?.src;
  const price = data.price == null
    ? undefined
    : formatOpsCurrency(data.price, {
        locale: data.locale,
        currency: data.currency,
        currencyDisplay: data.currencyDisplay,
        amountInMinorUnits: data.amountInMinorUnits,
        minorUnits: data.minorUnits,
      });
  const compareAt = data.compareAtPrice == null
    ? undefined
    : formatOpsCurrency(data.compareAtPrice, {
        locale: data.locale,
        currency: data.currency,
        currencyDisplay: data.currencyDisplay,
        amountInMinorUnits: data.amountInMinorUnits,
        minorUnits: data.minorUnits,
      });

  return (
    <CardFrame data={data} variant="product" ariaLabel={data.title} {...props}>
      <div className="ops-product-card__visual">
        <ProductImage src={image} alt={data.images?.[0]?.alt ?? data.title} />
        {data.badge && <Pill tone="green" dot>{data.badge}</Pill>}
        {data.category && <span className="ops-product-card__category">{data.category}</span>}
      </div>
      <div className="ops-product-card__body">
        <div className="ops-product-card__heading">
          <div>
            {data.brand && <Eyebrow>{data.brand}</Eyebrow>}
            <h3>{data.title}</h3>
          </div>
          {price && (
            <div className="ops-product-card__price">
              <strong>{price}</strong>
              {compareAt && <del>{compareAt}</del>}
            </div>
          )}
        </div>
        {data.description && <p className="ops-card__description">{data.description}</p>}
        <div className="ops-product-card__footer">
          <div className="ops-product-card__attributes">
            {data.condition && <Pill>{data.condition}</Pill>}
            {data.sku && <span className="ops-microcopy">SKU {data.sku}</span>}
          </div>
          {data.specs && Object.keys(data.specs).length > 0 && (
            <div className="ops-product-card__specs">
              {Object.entries(data.specs).slice(0, 2).map(([label, value]) => (
                <span key={label}><Icon name="spark" size={13} /> {label}: {value}</span>
              ))}
            </div>
          )}
          <span className="ops-card__arrow"><Icon name="arrow-up-right" size={17} /></span>
        </div>
      </div>
    </CardFrame>
  );
}
