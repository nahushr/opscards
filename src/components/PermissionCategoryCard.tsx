import type { HTMLAttributes, ReactNode } from "react";

export interface PermissionCategoryCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Category heading displayed above its permission rows. */
  title: ReactNode;
  /** Permission rows or other category content. */
  children?: ReactNode;
  /** Override the category heading styling. */
  titleClassName?: string;
  /** Override the content stack styling. */
  contentClassName?: string;
}

const joinClasses = (...classes: Array<string | undefined | false>): string =>
  classes.filter(Boolean).join(" ");

/** A styled section that groups related permission rows. */
export function PermissionCategoryCard({
  title,
  children,
  className,
  titleClassName,
  contentClassName,
  ...rootProps
}: PermissionCategoryCardProps) {
  return (
    <section {...rootProps} className={joinClasses("ops-permission-category-card", className)}>
      <h3 className={joinClasses("ops-permission-category-card__title", titleClassName)}>
        {title}
      </h3>
      <div className={joinClasses("ops-permission-category-card__content", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
