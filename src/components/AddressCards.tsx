import type { HTMLAttributes } from "react";
import { Icon } from "./shared";
import { formatOpsPhoneDisplay } from "../utils/formatters";

export interface AddressCardData {
  id?: number | string;
  type?: string;
  primary?: boolean;
  recipient?: string;
  streetAddress?: string;
  streetAddress2?: string;
  streetAddress3?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  email?: string;
  phone?: string;
}

export interface AddressCardsProps extends HTMLAttributes<HTMLDivElement> {
  addresses: readonly AddressCardData[];
  emptyText?: string;
}

const text = (...values: Array<string | undefined>): string[] =>
  values.map((value) => value?.trim() ?? "").filter(Boolean);

/** Read-only address cards for profile and record detail views. */
export function AddressCards({
  addresses,
  emptyText = "No addresses on file.",
  className,
  ...rootProps
}: AddressCardsProps) {
  const classes = ["ops-address-cards", className].filter(Boolean).join(" ");

  if (!addresses.length) {
    return (
      <div {...rootProps} className={`${classes} ops-address-cards--empty`}>
        {emptyText}
      </div>
    );
  }

  return (
    <div {...rootProps} className={classes} aria-label="Addresses">
      {addresses.map((address, index) => {
        const locality = text(address.city, address.state, address.postalCode).join(", ");
        const key = address.id ?? `${address.type ?? "address"}-${index}`;
        const addressType = address.type?.trim() || `Address ${index + 1}`;
        const phone = address.phone?.trim()
          ? formatOpsPhoneDisplay(address.phone)
          : undefined;

        return (
          <article className="ops-address-card" key={key}>
            <header className="ops-address-card__header">
              <span className="ops-address-card__icon" aria-hidden="true">
                <Icon name="map-pin" size={18} />
              </span>
              <div className="ops-address-card__heading">
                <span className="ops-address-card__type">{addressType}</span>
                {address.recipient?.trim() && (
                  <h4 className="ops-address-card__recipient">{address.recipient}</h4>
                )}
              </div>
              {address.primary && (
                <span className="ops-address-card__primary">Primary</span>
              )}
            </header>

            <div className="ops-address-card__body">
              {text(address.streetAddress, address.streetAddress2, address.streetAddress3).map(
                (line, lineIndex) => (
                  <p className="ops-address-card__street" key={`${key}-street-${lineIndex}`}>
                    {line}
                  </p>
                ),
              )}
              {locality && (
                <p className="ops-address-card__locality">
                  {locality}
                </p>
              )}
              {address.country?.trim() && (
                <p className="ops-address-card__country">{address.country}</p>
              )}
            </div>

            {(address.email?.trim() || address.phone?.trim()) && (
              <footer className="ops-address-card__contact">
                {phone && (
                  <a href={`tel:${address.phone}`}>
                    <span>Phone</span>
                    <strong>
                      {phone.flag && (
                        <span
                          className="ops-address-card__country-flag"
                          role="img"
                          aria-label={`${phone.countryCode} flag`}
                        >
                          {phone.flag}
                        </span>
                      )}
                      {phone.display}
                    </strong>
                  </a>
                )}
                {address.email?.trim() && (
                  <a href={`mailto:${address.email}`}>
                    <span>Email</span>
                    <strong>{address.email}</strong>
                  </a>
                )}
              </footer>
            )}
          </article>
        );
      })}
    </div>
  );
}

