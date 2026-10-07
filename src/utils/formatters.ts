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

interface CompactNotation {
  value: number;
  suffix: string;
}

function getCompactNotation(value: number): CompactNotation | undefined {
  if (!Number.isFinite(value) || Math.abs(value) < 1_000) return undefined;

  const suffixes = ["K", "M", "B", "T"];
  let unitIndex = Math.min(Math.floor(Math.log10(Math.abs(value)) / 3) - 1, suffixes.length - 1);
  let divisor = 1_000 ** (unitIndex + 1);

  // Promote rounded values such as 999.99K to 1M instead of displaying 1,000K.
  while (unitIndex < suffixes.length - 1 && Math.round(Math.abs(value / divisor) * 100) >= 100_000) {
    unitIndex += 1;
    divisor *= 1_000;
  }

  return { value: value / divisor, suffix: suffixes[unitIndex] };
}

export function formatOpsCompactNumber(value: number, locale = "en-US"): string {
  const notation = getCompactNotation(value);
  if (!notation) return formatOpsNumber(value, locale);

  return `${formatOpsNumber(notation.value, locale, { maximumFractionDigits: 2 })}${notation.suffix}`;
}

export function formatOpsCompactCurrency(
  amount: number,
  options: MoneyFormatOptions = {},
): string {
  const {
    locale = "en-US",
    currency = "USD",
    amountInMinorUnits = false,
    minorUnits = 2,
    currencyDisplay = "symbol",
  } = options;
  const majorAmount = amountInMinorUnits ? amount / 10 ** minorUnits : amount;
  const notation = getCompactNotation(majorAmount);
  if (!notation) return formatOpsCurrency(amount, options);

  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      currencyDisplay,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).formatToParts(notation.value);
    let lastNumberPart = -1;
    parts.forEach((part, index) => {
      if (["integer", "group", "decimal", "fraction"].includes(part.type)) lastNumberPart = index;
    });

    return parts
      .map((part, index) => `${part.value}${index === lastNumberPart ? notation.suffix : ""}`)
      .join("");
  } catch {
    return `${formatOpsCurrency(notation.value, {
      ...options,
      amountInMinorUnits: false,
    })}${notation.suffix}`;
  }
}

function parseLocalizedNumber(value: string, locale: string): number | undefined {
  let formatter: Intl.NumberFormat;
  try {
    formatter = new Intl.NumberFormat(locale);
  } catch {
    formatter = new Intl.NumberFormat("en-US");
  }

  const parts = formatter.formatToParts(12_345.6);
  const groupSeparator = parts.find((part) => part.type === "group")?.value;
  const decimalSeparator = parts.find((part) => part.type === "decimal")?.value ?? ".";
  let normalized = value.replace(/−/gu, "-");
  if (groupSeparator) normalized = normalized.split(groupSeparator).join("");
  normalized = normalized.replace(/[\s'’]/gu, "");
  if (decimalSeparator !== ".") normalized = normalized.split(decimalSeparator).join(".");

  try {
    const digitFormatter = new Intl.NumberFormat(locale, { useGrouping: false });
    const localizedDigits = new Map<string, string>();
    for (let digit = 0; digit <= 9; digit += 1) {
      const localizedDigit = digitFormatter
        .formatToParts(digit)
        .find((part) => part.type === "integer")?.value;
      if (localizedDigit) localizedDigits.set(localizedDigit, String(digit));
    }
    normalized = [...normalized].map((character) => localizedDigits.get(character) ?? character).join("");
  } catch {
    // Keep ASCII digits when the runtime does not support the requested locale.
  }

  normalized = normalized.replace(/[^\d.+-]/gu, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function compactOpsMetricText(value: string, locale = "en-US"): string {
  if (value.includes("%")) return value;

  const numericMatch = /[+\-−]?\p{Nd}[\p{Nd}\s.,'’\u066B\u066C]*/u.exec(value);
  if (!numericMatch) return value;

  const numericText = numericMatch[0].trimEnd();
  const prefix = value.slice(0, numericMatch.index);
  const suffix = value.slice(numericMatch.index + numericText.length);
  const currencyPrefix = prefix.replace(/[\s\p{Sc}\u200e\u200f\u061c+\-−]/gu, "");
  const currencySuffix = suffix.replace(/[\s\p{Sc}\u200e\u200f\u061c]/gu, "");
  if (currencyPrefix && !/^[A-Z]{1,3}$/u.test(currencyPrefix)) return value;
  if (currencySuffix && !/^[A-Z]{1,3}$/u.test(currencySuffix)) return value;

  const amount = parseLocalizedNumber(numericText, locale);
  if (amount === undefined || Math.abs(amount) < 1_000) return value;

  return `${prefix}${formatOpsCompactNumber(amount, locale)}${suffix}`;
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
