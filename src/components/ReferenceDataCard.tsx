import type { HTMLAttributes, ReactNode } from "react";

export interface ReferenceDataCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Optional ordinal shown in the card's leading number tile. */
  ordinal?: number;
  /** Heading for this reference-data section. */
  title: ReactNode;
  /** Short instruction or context for the reference list. */
  description?: ReactNode;
  /** Grid or other reference content. */
  children: ReactNode;
}

const joinClasses = (...classes: Array<string | undefined | false>): string =>
  classes.filter(Boolean).join(" ");

/** Shared OpsCards shell for a read-only reference-data section and its grid. */
export function ReferenceDataCard({
  ordinal,
  title,
  description,
  children,
  className,
  ...rootProps
}: ReferenceDataCardProps) {
  return (
    <article {...rootProps} className={joinClasses("ops-reference-data-card", className)}>
      <header className="ops-reference-data-card__heading">
        {ordinal != null ? (
          <span className="ops-reference-data-card__ordinal" aria-hidden="true">
            {String(ordinal).padStart(2, "0")}
          </span>
        ) : null}
        <div className="ops-reference-data-card__copy">
          <h3 className="ops-reference-data-card__title">{title}</h3>
          {description != null && description !== "" ? (
            <p className="ops-reference-data-card__description">{description}</p>
          ) : null}
        </div>
      </header>
      <div className="ops-reference-data-card__content">{children}</div>
    </article>
  );
}

export default ReferenceDataCard;
