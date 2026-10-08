import type { HTMLAttributes, ReactNode } from "react";

export interface UserGroupCardProps extends HTMLAttributes<HTMLElement> {
  /** Group display name. */
  name: ReactNode;
  /** Optional group description. */
  description?: ReactNode;
  /** Optional icon rendered in the leading tile. */
  icon?: ReactNode;
  /** Optional metadata, such as a formatted creation date. */
  metadata?: ReactNode;
  /** Override the icon tile styling. */
  iconClassName?: string;
  /** Override the name styling. */
  nameClassName?: string;
  /** Override the description styling. */
  descriptionClassName?: string;
  /** Override the metadata row styling. */
  metadataClassName?: string;
}

const joinClasses = (...classes: Array<string | undefined | false>): string =>
  classes.filter(Boolean).join(" ");

/** A reusable user-group card for membership summaries and access dialogs. */
export function UserGroupCard({
  name,
  description,
  icon,
  metadata,
  className,
  iconClassName,
  nameClassName,
  descriptionClassName,
  metadataClassName,
  ...rootProps
}: UserGroupCardProps) {
  return (
    <article {...rootProps} className={joinClasses("ops-user-group-card", className)}>
      <div className="ops-user-group-card__heading">
        {icon != null ? (
          <span className={joinClasses("ops-user-group-card__icon", iconClassName)}>
            {icon}
          </span>
        ) : null}
        <h3 className={joinClasses("ops-user-group-card__name", nameClassName)}>{name}</h3>
      </div>
      {description != null && description !== "" ? (
        <p className={joinClasses("ops-user-group-card__description", descriptionClassName)}>
          {description}
        </p>
      ) : null}
      {metadata != null ? (
        <div className={joinClasses("ops-user-group-card__metadata", metadataClassName)}>
          {metadata}
        </div>
      ) : null}
    </article>
  );
}
