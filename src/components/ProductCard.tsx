import { useState } from "react";
import type { OpsCardProps, ProductCardData, ProductImage as ProductImageData } from "../types";
import { formatOpsCurrency } from "../utils/formatters";
import { CardFrame, Eyebrow, Icon, Pill, ProductImage, type IconName } from "./shared";

export type ProductCardProps = OpsCardProps<ProductCardData>;

function getSpecIcon(label: string): IconName {
  const normalized = label.toLowerCase();
  if (/sku|code|barcode/.test(normalized)) return "tag";
  if (/fabric|material|composition/.test(normalized)) return "shirt";
  if (/weight|mass/.test(normalized)) return "weight";
  if (/size|dimension|length|width|height/.test(normalized)) return "ruler";
  if (/color|colour/.test(normalized)) return "palette";
  return "spark";
}

function ProductGallery({
  images,
  title,
  category,
  badge,
}: {
  images: ProductImageData[];
  title: string;
  category?: string;
  badge?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const image = images[activeIndex];
  const hasMultipleImages = images.length > 1;
  const moveTo = (index: number) => setActiveIndex((index + images.length) % images.length);

  return (
    <div className="ops-product-card__gallery" role="group" aria-label={`${title} product images`} aria-roledescription="carousel">
      <ProductImage src={image?.src} alt={image?.alt ?? title} />
      {badge && <Pill tone="green" dot>{badge}</Pill>}
      {category && <span className="ops-product-card__category">{category}</span>}
      {hasMultipleImages && (
        <>
          <button
            type="button"
            className="ops-product-card__gallery-control ops-product-card__gallery-control--previous"
            aria-label="Previous product image"
            onClick={(event) => { event.stopPropagation(); moveTo(activeIndex - 1); }}
          >
            <Icon name="chevron-left" size={19} />
          </button>
          <button
            type="button"
            className="ops-product-card__gallery-control ops-product-card__gallery-control--next"
            aria-label="Next product image"
            onClick={(event) => { event.stopPropagation(); moveTo(activeIndex + 1); }}
          >
            <Icon name="chevron-right" size={19} />
          </button>
          <div className="ops-product-card__gallery-dots" role="group" aria-label="Choose product image">
            {images.map((entry, index) => (
              <button
                key={`${entry.src}-${index}`}
                type="button"
                className={`ops-product-card__gallery-dot ${index === activeIndex ? "is-active" : ""}`}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-pressed={index === activeIndex}
                onClick={(event) => { event.stopPropagation(); moveTo(index); }}
              />
            ))}
          </div>
          <span className="ops-visually-hidden" aria-live="polite">Image {activeIndex + 1} of {images.length}</span>
        </>
      )}
    </div>
  );
}

export function ProductCard({ data, ...props }: ProductCardProps) {
  const images = data.images?.length
    ? data.images
    : data.imageUrl
      ? [{ src: data.imageUrl, alt: data.title }]
      : [];
  const galleryKey = `${data.id ?? data.title}:${images.map(({ src }) => src).join("|")}`;
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
  const computedDiscount = data.price != null && data.compareAtPrice != null && data.compareAtPrice > data.price
    ? Math.round(((data.compareAtPrice - data.price) / data.compareAtPrice) * 100)
    : undefined;
  const discountPercent = data.discountPercent ?? computedDiscount;
  const discountLabel = discountPercent != null && discountPercent > 0
    ? `${Math.round(discountPercent)}% OFF`
    : undefined;

  return (
    <CardFrame data={data} variant="product" ariaLabel={data.title} allowNestedInteractions {...props}>
      <div className="ops-product-card__visual">
        <ProductGallery key={galleryKey} images={images} title={data.title} category={data.category} badge={data.badge} />
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
            {discountLabel && <Pill tone="amber">{discountLabel}</Pill>}
            {props.onClick ? (
              <button
                type="button"
                className="ops-card__arrow ops-product-card__action"
                aria-label={`View ${data.title}`}
                onClick={(event) => { event.stopPropagation(); props.onClick?.(data); }}
              >
                <Icon name="arrow-up-right" size={18} />
              </button>
            ) : (
              <span className="ops-card__arrow" aria-hidden="true"><Icon name="arrow-up-right" size={18} /></span>
            )}
          </div>
          {(data.sku || (data.specs && Object.keys(data.specs).length > 0)) && (
            <div className="ops-product-card__specs" aria-label="Product specifications">
              {data.sku && (
                <span className="ops-product-card__spec ops-product-card__spec--sku" title={`SKU ${data.sku}`}>
                  <Icon name="tag" size={15} /><span className="ops-product-card__spec-label">SKU</span><strong>{data.sku}</strong>
                </span>
              )}
              {Object.entries(data.specs ?? {}).map(([label, value]) => (
                <span className={`ops-product-card__spec ops-product-card__spec--${getSpecIcon(label)}`} key={label} title={`${label}: ${value}`}>
                  <Icon name={getSpecIcon(label)} size={15} /><span className="ops-product-card__spec-label">{label}</span><strong>{value}</strong>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </CardFrame>
  );
}
