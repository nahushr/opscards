import type { HTMLAttributes } from "react";

export interface PermissionCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Permission key or machine-readable code. */
  code: string;
  /** Human-readable permission name. */
  name: string;
  /** Optional explanation shown below the name. */
  description?: string;
  /** Override the code badge styling. */
  codeClassName?: string;
  /** Override the text container styling. */
  contentClassName?: string;
  /** Override the permission name styling. */
  nameClassName?: string;
  /** Override the description styling. */
  descriptionClassName?: string;
}

const joinClasses = (...classes: Array<string | undefined | false>): string =>
  classes.filter(Boolean).join(" ");

/** A reusable permission row for access-control lists and settings dialogs. */
export function PermissionCard({
  code,
  name,
  description,
  className,
  codeClassName,
  contentClassName,
  nameClassName,
  descriptionClassName,
  ...rootProps
}: PermissionCardProps) {
  return (
    <div {...rootProps} className={joinClasses("ops-permission-card", className)}>
      <span className={joinClasses("ops-permission-card__code", codeClassName)}>
        {code}
      </span>
      <div className={joinClasses("ops-permission-card__content", contentClassName)}>
        <strong className={joinClasses("ops-permission-card__name", nameClassName)}>
          {name}
        </strong>
        {description ? (
          <span className={joinClasses("ops-permission-card__description", descriptionClassName)}>
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
}
