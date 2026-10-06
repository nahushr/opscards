import type { MetricCardData, OpsCardProps } from "../types";
import { formatOpsCurrency, formatOpsNumber } from "../utils/formatters";
import { CardFrame, Icon } from "./shared";

export type MetricCardProps = OpsCardProps<MetricCardData>;

function formatMetricValue(data: MetricCardData): string {
  if (typeof data.value !== "number" || data.format === "plain") return `${data.prefix ?? ""}${data.value}${data.suffix ?? ""}`;
  if (data.format === "currency") {
    return formatOpsCurrency(data.value, {
      locale: data.locale,
      currency: data.currency,
      currencyDisplay: data.currencyDisplay,
      amountInMinorUnits: data.amountInMinorUnits,
      minorUnits: data.minorUnits,
    });
  }
  if (data.format === "percent") {
    return `${data.prefix ?? ""}${formatOpsNumber(data.value, data.locale, { maximumFractionDigits: 1 })}%${data.suffix ?? ""}`;
  }
  return `${data.prefix ?? ""}${formatOpsNumber(data.value, data.locale)}${data.suffix ?? ""}`;
}

export function MetricCard({ data, ...props }: MetricCardProps) {
  const iconName = data.iconName === "orders" ? "box" : data.iconName === "inventory" ? "cube" : data.iconName === "customers" ? "user" : "trend";
  const hasTrend = data.trend && data.trend.length > 1;
  const trend = data.trend ?? [24, 29, 26, 38, 34, 43, 50, 45, 61];
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const points = trend.map((value, index) => `${(index / (trend.length - 1)) * 100},${35 - ((value - min) / Math.max(max - min, 1)) * 29}`).join(" ");
  const positive = (data.change ?? 0) >= 0;

  return (
    <CardFrame data={data} variant="metric" ariaLabel={`${data.label}: ${formatMetricValue(data)}`} {...props}>
      <div className="ops-metric-card__top">
        <div><span className="ops-metric-card__label">{data.label}</span><div className="ops-metric-card__value">{formatMetricValue(data)}</div></div>
        <span className="ops-icon-tile ops-icon-tile--mint">{data.icon ?? <Icon name={iconName} />}</span>
      </div>
      <div className="ops-metric-card__bottom">
        <div className="ops-metric-card__change-wrap">
          {data.change != null && <span className={`ops-metric-card__change ${positive ? "is-positive" : "is-negative"}`}><Icon name="trend" size={13} />{positive ? "+" : ""}{formatOpsNumber(data.change, data.locale, { maximumFractionDigits: 1 })}%</span>}
          <span className="ops-metric-card__comparison">{data.comparisonLabel ?? "vs. last month"}</span>
        </div>
        {hasTrend && <svg className="ops-metric-card__sparkline" viewBox="0 0 100 38" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} /></svg>}
      </div>
      {data.detail && <p className="ops-metric-card__detail">{data.detail}</p>}
    </CardFrame>
  );
}
