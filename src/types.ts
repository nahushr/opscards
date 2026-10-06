import type { CSSProperties, ReactNode } from "react";

/** Shared optional behavior for every OpsCards component. */
export interface OpsCardProps<TData> {
  /** The record rendered by the card. */
  data: TData;
  /** Called when the card is clicked. Clickable cards also support Enter and Space. */
  onClick?: (data: TData) => void;
  /** Called once when a pointer enters the card. */
  onHover?: (data: TData) => void;
  /** Extra class for layout or app-specific selectors. */
  className?: string;
  /** Inline styles for sizing or positioning the card. */
  style?: CSSProperties;
}

export interface RegionFormat {
  /** BCP 47 locale used for numbers, currencies, and dates (for example `en-GB`). */
  locale?: string;
  /** IANA time zone used for dates (for example `Europe/London`). */
  timeZone?: string;
  /** Optional currency style. Use `code` to distinguish currencies that share a symbol. */
  currencyDisplay?: "symbol" | "narrowSymbol" | "code";
}

export interface ProductImage {
  src: string;
  alt?: string;
}

export interface ProductCardData extends RegionFormat {
  id?: string;
  title: string;
  brand?: string;
  category?: string;
  condition?: string;
  imageUrl?: string;
  images?: ProductImage[];
  description?: string;
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  currency?: string;
  amountInMinorUnits?: boolean;
  minorUnits?: number;
  badge?: string;
  specs?: Record<string, string | number>;
}

export interface InventoryLocationCardData extends RegionFormat {
  id?: string;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  country?: string;
  onHand: number;
  reorderPoint: number;
  unitLabel?: string;
  restockDate?: string;
  inventoryValue?: number;
  currency?: string;
  status?: string;
}

export interface PackageCardData extends RegionFormat {
  id?: string;
  name: string;
  code?: string;
  quantity?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit?: string;
  };
  weight?: number;
  weightUnit?: string;
  capacity?: number;
  capacityUnit?: string;
  price?: number;
  currency?: string;
  amountInMinorUnits?: boolean;
  minorUnits?: number;
  featured?: boolean;
}

export interface EventAttendee {
  name: string;
  avatarUrl?: string;
}

export interface EventDetailsCardData extends RegionFormat {
  id?: string;
  title: string;
  startAt: string | Date;
  endAt?: string | Date;
  location?: string;
  organizer?: {
    name: string;
    role?: string;
    email?: string;
    phone?: string;
    phoneCountryCode?: string;
    avatarUrl?: string;
  };
  attendees?: EventAttendee[];
  attendeeCount?: number;
  priority?: "low" | "normal" | "high" | "urgent" | string;
  status?: string;
  description?: string;
}

export interface MetricCardData extends RegionFormat {
  id?: string;
  label: string;
  value: string | number;
  format?: "number" | "currency" | "percent" | "plain";
  currency?: string;
  amountInMinorUnits?: boolean;
  minorUnits?: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  comparisonLabel?: string;
  detail?: string;
  icon?: ReactNode;
  iconName?: "revenue" | "orders" | "inventory" | "customers" | "trend";
  trend?: number[];
}

export interface SupportTicketCardData extends RegionFormat {
  id?: string;
  ticketNumber: string;
  summary: string;
  status: "open" | "in-progress" | "waiting" | "resolved" | string;
  priority?: "low" | "normal" | "high" | "urgent" | string;
  createdAt: string | Date;
  requester?: {
    name: string;
    email?: string;
    phone?: string;
    phoneCountryCode?: string;
  };
  assignee?: string;
  category?: string;
}

export interface OrderLineItemCardData extends RegionFormat {
  id?: string;
  productTitle: string;
  productImageUrl?: string;
  sku?: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  currency?: string;
  amountInMinorUnits?: boolean;
  minorUnits?: number;
  status?: string;
  location?: string;
}
