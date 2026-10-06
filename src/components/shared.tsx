import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import type { OpsCardProps } from "../types";
import { getInitials } from "../utils/formatters";

type CardFrameProps<TData> = OpsCardProps<TData> & {
  children: ReactNode;
  variant: string;
  ariaLabel?: string;
  allowNestedInteractions?: boolean;
};

export function CardFrame<TData>({
  data,
  children,
  variant,
  className = "",
  style,
  onClick,
  onHover,
  ariaLabel,
  allowNestedInteractions = false,
}: CardFrameProps<TData>) {
  const cardClassName = `ops-card ops-card--${variant} ${onClick ? "ops-card--clickable" : ""} ${className}`.trim();
  const handleHover = onHover ? () => onHover(data) : undefined;
  const handleNestedCardKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (!allowNestedInteractions || !onClick || event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(data);
    }
  };

  if (onClick && !allowNestedInteractions) {
    return (
      <button
        type="button"
        className={cardClassName}
        style={style}
        aria-label={ariaLabel}
        onClick={() => onClick(data)}
        onPointerEnter={handleHover}
      >
        {children}
      </button>
    );
  }

  return (
    <article
      className={cardClassName}
      style={style}
      aria-label={onClick && allowNestedInteractions && ariaLabel ? `${ariaLabel}. Press Enter or Space to open.` : ariaLabel}
      tabIndex={onClick && allowNestedInteractions ? 0 : undefined}
      aria-keyshortcuts={onClick && allowNestedInteractions ? "Enter Space" : undefined}
      onClick={onClick ? () => onClick(data) : undefined}
      onPointerEnter={handleHover}
      onKeyDown={handleNestedCardKeyDown}
    >
      {children}
    </article>
  );
}

export type IconName =
  | "arrow-up-right"
  | "box"
  | "calendar"
  | "check"
  | "chevron-left"
  | "chevron-right"
  | "clock"
  | "cube"
  | "headset"
  | "map-pin"
  | "package"
  | "palette"
  | "ruler"
  | "shirt"
  | "spark"
  | "tag"
  | "trend"
  | "user"
  | "weight";

export function Icon({
  name,
  size = 18,
}: {
  name: IconName;
  size?: number;
}) {
  const paths: Record<typeof name, ReactNode> = {
    "arrow-up-right": <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v9l9 5 9-5V8" /><path d="M12 13v9" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    "chevron-left": <path d="m15 18-6-6 6-6" />,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    cube: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.5 7.5 4 7.5-4M12 12v9" /></>,
    headset: <><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><path d="M4 13h3v6H6a2 2 0 0 1-2-2v-4ZM20 13h-3v6h1a2 2 0 0 0 2-2v-4Z" /></>,
    "map-pin": <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    package: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.5 7.5 4 7.5-4M12 12v9" /><path d="m8 5.2 8 4.4" /></>,
    palette: <><path d="M12 3a9 9 0 1 0 0 18h1.1a2 2 0 0 0 1.6-3.2 1.7 1.7 0 0 1 1.4-2.8H18a3 3 0 0 0 3-3c0-5-4-9-9-9Z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7.5" r="1" /><circle cx="15" cy="8" r="1" /></>,
    ruler: <><path d="M4 4h16v16H4z" /><path d="M8 4v4m4-4v2m4-2v4m4-4v2M4 12h4m-4 4h2m-2 4h4" /></>,
    shirt: <><path d="m8 4 4 2 4-2 5 3-3 5-2-1v9H8v-9l-2 1-3-5 5-3Z" /><path d="M10 5.2a2 2 0 0 0 4 0" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></>,
    tag: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1 0-2.8L10.6 3.4H20v9.4Z" /><circle cx="15.5" cy="8.5" r="1" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    weight: <><path d="M6 7h12l2 14H4L6 7Z" /><path d="M9 7a3 3 0 1 1 6 0" /><path d="m12 11 2 3" /></>,
  };

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="ops-eyebrow">{children}</span>;
}

export function Pill({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue" | "violet";
  dot?: boolean;
}) {
  return <span className={`ops-pill ops-pill--${tone}`}>{dot && <span className="ops-pill__dot" />}{children}</span>;
}

export function Avatar({ name, src, size = "normal" }: { name: string; src?: string; size?: "normal" | "small" }) {
  return (
    <span className={`ops-avatar ops-avatar--${size}`} aria-hidden="true">
      {src ? <img src={src} alt="" /> : getInitials(name)}
    </span>
  );
}

export function getStatusTone(status = ""): "neutral" | "green" | "amber" | "red" | "blue" | "violet" {
  const value = status.toLowerCase();
  if (/resolved|complete|available|in stock|confirmed|paid|shipped|healthy/.test(value)) return "green";
  if (/urgent|critical|out of stock|overdue|blocked/.test(value)) return "red";
  if (/waiting|low|restock|pending|medium/.test(value)) return "amber";
  if (/progress|scheduled|open|active|processing/.test(value)) return "blue";
  if (/high|vip|featured/.test(value)) return "violet";
  return "neutral";
}

export function ProductImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  return (
    <div className={`ops-product-image ${className}`.trim()}>
      {src ? <img src={src} alt={alt} /> : <span className="ops-product-image__fallback"><Icon name="cube" size={32} /></span>}
    </div>
  );
}
