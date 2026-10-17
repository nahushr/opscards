import type { HTMLAttributes, ReactNode } from "react";
import { AddressCards, type AddressCardData } from "./AddressCards";
import { Icon } from "./shared";
import { formatOpsPhoneDisplay, getInitials } from "../utils/formatters";

export interface UserProfileCardProps extends Omit<HTMLAttributes<HTMLElement>, "role"> {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  dateOfBirth?: Date | string | null;
  profilePicture?: string | null;
  addresses: readonly AddressCardData[];
  title?: string;
  subtitle?: string;
}

type ProfileFactProps = {
  icon: "user" | "mail" | "phone" | "calendar" | "shield-check";
  label: string;
  children: ReactNode;
};

const ProfileFact = ({ icon, label, children }: ProfileFactProps) => (
  <div className="ops-user-profile-card__fact">
    <span className="ops-user-profile-card__fact-icon" aria-hidden="true">
      <Icon name={icon} size={17} />
    </span>
    <div className="ops-user-profile-card__fact-copy">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  </div>
);

const getRoleTone = (role: string): string => {
  const normalized = role.toUpperCase().replace(/[^A-Z0-9]+/gu, "");
  if (normalized === "SUPERADMIN" || normalized === "ADMIN") return "purple";
  if (normalized === "MANAGER") return "cyan";
  if (normalized === "CUSTOM") return "amber";
  return "slate";
};

const formatDateOfBirth = (value: Date | string | null | undefined): string => {
  if (!value) return "Not provided";
  const date = value instanceof Date
    ? value
    : /^\d{4}-\d{2}-\d{2}$/u.test(value)
      ? new Date(`${value}T00:00:00`)
      : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const clean = (value: string | null | undefined): string => value?.trim() ?? "";

/** Unified read-only profile card with contact details and all address cards. */
export function UserProfileCard({
  firstName,
  lastName,
  email,
  phone,
  role,
  dateOfBirth,
  profilePicture,
  addresses,
  title = "User details",
  subtitle = "Profile, contact details, and saved addresses for this user.",
  className,
  ...rootProps
}: UserProfileCardProps) {
  const first = clean(firstName);
  const last = clean(lastName);
  const fullName = [first, last].filter(Boolean).join(" ") || "Unnamed user";
  const emailValue = clean(email);
  const phoneValue = clean(phone);
  const roleValue = clean(role);
  const phoneDisplay = phoneValue ? formatOpsPhoneDisplay(phoneValue) : undefined;
  const classes = ["ops-user-profile-card", className].filter(Boolean).join(" ");

  return (
    <article {...rootProps} className={classes} aria-label={title}>
      <header className="ops-user-profile-card__header">
        <span className="ops-user-profile-card__avatar" aria-hidden="true">
          {profilePicture ? <img src={profilePicture} alt="" /> : getInitials(fullName)}
        </span>
        <div className="ops-user-profile-card__heading">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span className="ops-user-profile-card__name">{fullName}</span>
      </header>

      <dl className="ops-user-profile-card__facts">
        <ProfileFact icon="user" label="First name">
          {first || "Not provided"}
        </ProfileFact>
        <ProfileFact icon="user" label="Last name">
          {last || "Not provided"}
        </ProfileFact>
        <ProfileFact icon="mail" label="Email">
          {emailValue ? (
            <a href={`mailto:${emailValue}`} className="ops-user-profile-card__link">
              {emailValue}
            </a>
          ) : (
            "Not provided"
          )}
        </ProfileFact>
        <ProfileFact icon="phone" label="Phone">
          {phoneDisplay && phoneValue ? (
            <a href={`tel:${phoneValue}`} className="ops-user-profile-card__link">
              {phoneDisplay.flag && (
                <span
                  className="ops-user-profile-card__phone-flag"
                  role="img"
                  aria-label={`${phoneDisplay.countryCode} flag`}
                >
                  {phoneDisplay.flag}
                </span>
              )}
              <span className="ops-user-profile-card__phone-number">
                {phoneDisplay.display}
              </span>
            </a>
          ) : (
            "Not provided"
          )}
        </ProfileFact>
        <ProfileFact icon="calendar" label="Date of birth">
          {formatDateOfBirth(dateOfBirth)}
        </ProfileFact>
        <ProfileFact icon="shield-check" label="Role">
          {roleValue ? (
            <span className={`ops-user-profile-card__role ops-user-profile-card__role--${getRoleTone(roleValue)}`}>
              <Icon name="shield-check" size={14} />
              {roleValue}
            </span>
          ) : (
            "Not provided"
          )}
        </ProfileFact>
      </dl>

      <section className="ops-user-profile-card__addresses" aria-label="User addresses">
        <header className="ops-user-profile-card__addresses-header">
          <div className="ops-user-profile-card__addresses-title">
            <span className="ops-user-profile-card__addresses-icon" aria-hidden="true">
              <Icon name="map-pin" size={17} />
            </span>
            <h3>Addresses</h3>
          </div>
          <span className="ops-user-profile-card__address-count">
            {addresses.length} {addresses.length === 1 ? "address" : "addresses"}
          </span>
        </header>
        <AddressCards addresses={addresses} emptyText="No addresses on file." />
      </section>
    </article>
  );
}
