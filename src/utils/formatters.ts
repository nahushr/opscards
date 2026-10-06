import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import type { RegionFormat } from "../types";

export interface MoneyFormatOptions {
  locale?: string;
  currency?: string;
  amountInMinorUnits?: boolean;
  minorUnits?: number;
  currencyDisplay?: RegionFormat["currencyDisplay"];
}

export function formatOpsCurrency(
  amount: number,
  {
    locale = "en-US",
    currency = "USD",
    amountInMinorUnits = false,
    minorUnits = 2,
    currencyDisplay = "symbol",
  }: MoneyFormatOptions = {},
): string {
  const majorAmount = amountInMinorUnits ? amount / 10 ** minorUnits : amount;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      currencyDisplay,
    }).format(majorAmount);
  } catch {
    return `${currency.toUpperCase()} ${new Intl.NumberFormat("en-US").format(majorAmount)}`;
  }
}

export function formatOpsNumber(
  value: number,
  locale = "en-US",
  options: Intl.NumberFormatOptions = {},
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return new Intl.NumberFormat("en-US", options).format(value);
  }
}

export function formatOpsDateTime(
  value: string | Date,
  locale = "en-US",
  timeZone?: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  const format = (zone?: string) =>
    new Intl.DateTimeFormat(locale, { ...options, ...(zone ? { timeZone: zone } : {}) }).format(date);
  try {
    return format(timeZone);
  } catch {
    try {
      return format();
    } catch {
      return date.toLocaleString();
    }
  }
}

export function formatOpsPhone(phone: string, countryCode?: string): string {
  const value = phone.trim();
  if (!value) return "";
  try {
    const parsed = countryCode
      ? parsePhoneNumberFromString(value, countryCode.toUpperCase() as CountryCode)
      : parsePhoneNumberFromString(value);
    return parsed?.formatInternational() ?? value;
  } catch {
    return value;
  }
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}
