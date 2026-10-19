import type { MouseEvent } from "react";
import { Icon } from "./shared";
import { formatOpsPhoneDisplay, type OpsPhoneDisplay } from "../utils/formatters";
import type { AddressCardData } from "./AddressCards";

export interface AddressPopoverCardProps {
  address: AddressCardData;
  title?: string;
}

function stopPropagation(event: MouseEvent<HTMLElement>) {
  event.stopPropagation();
}

/** Address detail card for use inside anchored popovers and tooltips. */
export function AddressPopoverCard({
  address,
  title,
}: AddressPopoverCardProps) {
  const addressType = address.type?.trim();
  const heading = title?.trim()
    || address.nickname?.trim()
    || (addressType ? `${addressType} address` : "Address details");
  const streetLines = [
    address.streetAddress,
    address.streetAddress2,
    address.streetAddress3,
  ].map((line) => line?.trim() ?? "").filter(Boolean);
  const locality = [address.city, address.state, address.postalCode]
    .map((part) => part?.trim() ?? "")
    .filter(Boolean)
    .join(", ");
  const hasAddress = streetLines.length > 0 || Boolean(locality) || Boolean(address.country?.trim());
  const phone: OpsPhoneDisplay | undefined = address.phone?.trim()
    ? formatOpsPhoneDisplay(address.phone)
    : undefined;
  const hasContact = Boolean(address.recipient?.trim() || address.email?.trim() || phone);

  return (
    <section
      className="ops-address-popover-card"
      role="dialog"
      aria-label={`${heading} full address`}
      onClick={stopPropagation}
    >
      <header className="ops-address-popover-card__header">
        <div className="ops-address-popover-card__heading">
          <span className="ops-address-popover-card__type">
            {addressType || "ADDRESS"}
          </span>
          <strong>{heading}</strong>
        </div>
        {address.primary && (
          <span className="ops-address-popover-card__primary">Primary</span>
        )}
      </header>

      <div className="ops-address-popover-card__body">
        <Icon name="map-pin" size={18} />
        <div className="ops-address-popover-card__lines">
          {streetLines.map((line, index) => (
            <span key={`${index}-${line}`}>{line}</span>
          ))}
          {locality && <span>{locality}</span>}
          {address.country?.trim() && <span>{address.country}</span>}
          {!hasAddress && <span>No address details available.</span>}
        </div>
      </div>

      {hasContact && (
        <footer className="ops-address-popover-card__contact">
          {address.recipient?.trim() && <strong>{address.recipient}</strong>}
          {address.email?.trim() && (
            <a href={`mailto:${address.email}`}>{address.email}</a>
          )}
          {phone && (
            <a className="ops-address-popover-card__phone" href={`tel:${address.phone}`}>
              {phone.flag && (
                <span role="img" aria-label={`${phone.countryCode} flag`}>
                  {phone.flag}
                </span>
              )}
              <span>{phone.display}</span>
            </a>
          )}
        </footer>
      )}
    </section>
  );
}
