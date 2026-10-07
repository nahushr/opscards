<p align="center">
  <img src="assets/opscards-logo.svg" alt="OpsCards — useful data, ready to go" width="350" />
</p>

<p align="center">
  <a href="https://github.com/nahushr/opscards/actions/workflows/deploy.yml"><img alt="Build, analyze, and publish" src="https://github.com/nahushr/opscards/actions/workflows/deploy.yml/badge.svg?branch=main" /></a>
  <img alt="React 18+" src="https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=111827" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-types%20included-3178C6?logo=typescript&logoColor=white" />
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-16a085.svg" /></a>
</p>

<p align="center">
  <a href="https://stackblitz.com/github/nahushr/opscards?file=examples/src/App.tsx&amp;startScript=dev:example"><img alt="Open the OpsCards example in StackBlitz" src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" /></a>
</p>

OpsCards turns common operational records into ready-to-use React cards. Pass in typed data and get back a considered layout with the spacing, hierarchy, status, and responsive behavior already handled.

## Demo

| Online | Local |
|---|---|
| [Open the live component studio in StackBlitz](https://stackblitz.com/github/nahushr/opscards?file=examples/src/App.tsx&startScript=dev:example) | `npm ci` → `npm run dev:example` → [localhost:7003](http://localhost:7003) |

The example has a tab for each card, desktop and mobile previews, and optional hover and click snackbars so you can see the interaction callbacks in action. It also includes a three-client portfolio and a dashboard row with compact revenue, order, and fulfillment metrics.

## Install

```sh
npm install @simplishelf/opscards
```

Import the stylesheet once from your app entry point:

```tsx
import "@simplishelf/opscards/style.css";
```

## Use a card

`data` is the only required component prop. Each card has its own TypeScript data type; callbacks and styling hooks are optional.

```tsx
import { ProductCard } from "@simplishelf/opscards";
import type { ProductCardData } from "@simplishelf/opscards";
import "@simplishelf/opscards/style.css";

const product: ProductCardData = {
  title: "Morrow field jacket",
  brand: "Northline Supply",
  category: "Outerwear",
  images: [
    { src: "/images/field-jacket-front.jpg", alt: "Field jacket, front view" },
    { src: "/images/field-jacket-detail.jpg", alt: "Field jacket, close detail" },
  ],
  price: 148,
  compareAtPrice: 179, // Optional; calculates and displays the discount.
  discountPercent: 17, // Optional override when you already have the discount.
  currency: "USD",
  locale: "en-US",
  sku: "NL-048-OLV",
  specs: { Fabric: "Organic cotton", Weight: "620 g" },
};

export function ProductPreview() {
  return (
    <ProductCard
      data={product}
      onClick={(record) => console.log(record.title)}
      onHover={(record) => console.log("Hovered:", record.id)}
      className="catalog-card"
      style={{ maxWidth: 440 }}
    />
  );
}
```

Clickable cards respond to mouse, Enter, and Space. The example's snackbars are app-owned; use `onClick` and `onHover` to connect your own feedback or behavior.

## Included cards

| Component | Required data | Typical use |
|---|---|---|
| `ProductCard` | `title` | Storefronts, catalogs, product pickers |
| `ClientCard` | `name` | Client pickers, account portfolios, workspace dashboards |
| `InventoryLocationCard` | `name`, `onHand`, `reorderPoint` | Warehouse and pickup location stock |
| `PackageCard` | `name` | Package dimensions, weight, capacity, and pricing |
| `EventDetailsCard` | `title`, `startAt` | Event time, location, organizer, attendees, and priority |
| `MetricCard` | `label`, `value` | KPI and dashboard summaries |
| `SupportTicketCard` | `ticketNumber`, `summary`, `status`, `createdAt` | Clickable support queue items |
| `OrderLineItemCard` | `productTitle`, `quantity`, `unitPrice` | Purchase order and fulfillment line items |

Each data type accepts optional `id`, `locale`, and `timeZone` fields where applicable. Optional data is omitted cleanly when it is not supplied.

`ClientCard` supports optional client branding, a logo or initials tile, status, plan, industry, location, and up to three summary metrics. Set `selected` to mark the active workspace and `compact` for denser account pickers. Use its callback to open a selected client's workspace:

```tsx
import { ClientCard } from "@simplishelf/opscards";
import type { ClientCardData } from "@simplishelf/opscards";

const client: ClientCardData = {
  id: "northstar-retail",
  name: "Northstar Retail",
  clientCode: "CLIENT · NS-2048",
  industry: "Apparel & lifestyle",
  location: "Austin, TX · 14 stores",
  status: "Active",
  plan: "Enterprise",
  accentColor: "#4c7655",
  metrics: [
    { label: "Revenue", value: "$10.2M" },
    { label: "Orders", value: "248K" },
    { label: "Stores", value: 14 },
  ],
};

<ClientCard data={client} onClick={(record) => openWorkspace(record.id)} />
```

## Formatting for your region

Cards use the browser's `Intl` APIs to format amounts and dates. Pass the customer's BCP 47 locale, an ISO currency code, and an IANA time zone to match your app:

```tsx
<MetricCard
  data={{
    label: "Monthly revenue",
    value: 28490,
    format: "currency",
    currency: "GBP",
    locale: "en-GB",
    currencyDisplay: "code", // Optional: use GBP instead of the £ symbol.
  }}
/>
```

Money values are major units by default (`12.50` means twelve and a half). For integer minor-unit values, set `amountInMinorUnits: true`; `minorUnits` defaults to `2`. Set `currencyDisplay: "code"` when you want an unambiguous ISO code instead of a symbol. Phone fields accept international numbers such as `+44 20 7946 0958`. For national numbers, also pass `phoneCountryCode` as a two-letter country code. Event and support data use this shape:

Metric cards compact values of 1,000 and above with `K`, `M`, `B`, and `T` suffixes (for example, `$10,044.09` displays as `$10.04K`). This also works when a metric value is supplied as a preformatted currency string. Percentages and nonnumeric text remain unchanged.

```ts
requester: {
  name: "Oliver James",
  phone: "+44 20 7946 0958",
  phoneCountryCode: "GB",
}
```

## Shared props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | Card-specific data type | Required | The record to display |
| `onClick` | `(data) => void` | — | Optional card selection or navigation callback |
| `onHover` | `(data) => void` | — | Called once when a pointer enters the card |
| `className` | `string` | — | Add app-specific layout styles or selectors |
| `style` | `CSSProperties` | — | Set width, margins, or positioning |

The card owns its information hierarchy and component styling. Use `className` or `style` for app layout and sizing without rebuilding the rendering logic.

`ProductCard` accepts `images` for a keyboard-accessible image carousel. Keep `imageUrl` for a single-image product. Product specifications stay on one line and can be horizontally scrolled on narrow cards. `discountPercent` can be supplied directly; otherwise the card derives a discount from `price` and `compareAtPrice`.

## Example project

The [Vite example](examples/src/App.tsx) is a small component studio, not a separate design system. It switches between all eight cards, demonstrates regional formats, and adapts each component to a mobile-width viewport. Run it locally with:

```sh
npm ci
npm run dev:example
```

## Release workflow

`.github/workflows/deploy.yml` builds the library and example on pull requests and pushes to `main`, then runs SonarCloud and Snyk analysis before publishing the current package version to npm from `main`. It skips a version that is already on the registry; update `package.json` before a new release. Configure these GitHub Actions repository secrets before expecting analysis or publishing to complete:

- `SONAR_TOKEN`
- `SNYK_TOKEN`
- `NPM_TOKEN`

## License

MIT. See [LICENSE](LICENSE).
