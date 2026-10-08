import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  ClientCard,
  EventDetailsCard,
  InventoryLocationCard,
  MetricCard,
  OrderLineItemCard,
  PermissionCard,
  PermissionCategoryCard,
  PackageCard,
  ProductCard,
  SupportTicketCard,
  UserGroupCard,
  type ClientCardData,
  type EventDetailsCardData,
  type InventoryLocationCardData,
  type MetricCardData,
  type OrderLineItemCardData,
  type PackageCardData,
  type ProductCardData,
  type SupportTicketCardData,
} from "@simplishelf/opscards";

type CardId = "product" | "inventory" | "package" | "event" | "client" | "metric" | "ticket" | "order";
type ViewMode = "desktop" | "mobile";
type ToastMessage = { title: string; message: string };

const CARD_TYPES: { id: CardId; number: string; title: string; kind: string; code: string }[] = [
  { id: "product", number: "01", title: "Product", kind: "CATALOG", code: `<ProductCard data={product} onClick={(product) => console.log(product)} />` },
  { id: "inventory", number: "02", title: "Inventory", kind: "OPERATIONS", code: `<InventoryLocationCard data={location} />` },
  { id: "package", number: "03", title: "Package", kind: "FULFILLMENT", code: `<PackageCard data={packageSpec} />` },
  { id: "event", number: "04", title: "Event", kind: "CALENDAR", code: `<EventDetailsCard data={event} />` },
  { id: "client", number: "05", title: "Client", kind: "WORKSPACE", code: `<ClientCard data={client} onClick={(client) => console.log(client.id)} />` },
  { id: "metric", number: "06", title: "Metric", kind: "DASHBOARD", code: `<MetricCard data={revenue} />` },
  { id: "ticket", number: "07", title: "Support", kind: "CUSTOMER CARE", code: `<SupportTicketCard data={ticket} />` },
  { id: "order", number: "08", title: "Order item", kind: "PURCHASE ORDER", code: `<OrderLineItemCard data={lineItem} />` },
];

const product: ProductCardData = {
  id: "JKT-048",
  title: "Morrow quilted jacket",
  brand: "NORTHLINE SUPPLY",
  category: "Outerwear",
  condition: "New · A grade",
  images: [
    { src: "/products/quilted-jacket.jpg", alt: "Black quilted jacket hanging on a clothing rack" },
    { src: "/products/outerwear-rack.jpg", alt: "Close view of quilted coats and jackets on hangers" },
  ],
  description: "Lightweight warmth with recycled fill and room to roam.",
  sku: "NL-048",
  price: 148,
  compareAtPrice: 179,
  currency: "USD",
  locale: "en-US",
  badge: "In stock",
  discountPercent: 17,
  specs: { "Fabric": "Nylon", "Weight": "620 g" },
};

const location: InventoryLocationCardData = {
  id: "loc-toronto",
  name: "Toronto west hub",
  code: "YYZ · WAREHOUSE 04",
  address: "88 Sterling Road",
  city: "Toronto",
  country: "Canada",
  onHand: 286,
  reorderPoint: 120,
  unitLabel: "units",
  restockDate: "2026-10-12T12:00:00-04:00",
  inventoryValue: 34782.5,
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  locale: "en-CA",
};

const packageSpec: PackageCardData = {
  id: "PKG-RSC-04",
  name: "Recycled shipper",
  code: "PACKAGING · MEDIUM",
  quantity: 25,
  dimensions: { length: 32, width: 24, height: 11, unit: "cm" },
  weight: 0.42,
  weightUnit: "kg",
  capacity: 2,
  capacityUnit: "items",
  price: 24,
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  locale: "en-IN",
  featured: true,
};

const event: EventDetailsCardData = {
  id: "evt-autumn-review",
  title: "Autumn range · buying review",
  startAt: "2026-10-08T14:30:00-04:00",
  endAt: "2026-10-08T15:15:00-04:00",
  timeZone: "America/Toronto",
  locale: "en-CA",
  location: "Studio 2 · Toronto",
  organizer: { name: "Sofia Bennett", role: "Merchandising", phone: "+1 416 555 0148", phoneCountryCode: "CA" },
  attendees: [{ name: "Sofia Bennett" }, { name: "Marcus Lee" }, { name: "Asha Rao" }],
  attendeeCount: 9,
  priority: "High",
  status: "TEAM EVENT",
  description: "Final assortment, seasonal depth, and launch dates.",
};

const client: ClientCardData = {
  id: "northstar-retail",
  name: "Northstar Retail",
  clientCode: "CLIENT · NS-2048",
  description: "Modern essentials for everyday adventures, across every channel.",
  industry: "Apparel & lifestyle",
  location: "Austin, TX · 14 stores",
  status: "Healthy",
  plan: "Enterprise",
  accentColor: "#4c7655",
  metrics: [
    { label: "Revenue", value: "$10.2M" },
    { label: "Orders", value: "248K" },
    { label: "Stores", value: 14 },
  ],
};

const clientPortfolio: ClientCardData[] = [
  client,
  {
    id: "field-and-fable",
    name: "Field & Fable",
    clientCode: "CLIENT · FF-1172",
    description: "Thoughtful home goods, made to be lived with.",
    industry: "Home & garden",
    location: "Portland, OR · 8 stores",
    status: "Active",
    plan: "Growth",
    accentColor: "#9b7650",
    metrics: [
      { label: "Revenue", value: "$2.8M" },
      { label: "Orders", value: "64K" },
      { label: "Stores", value: 8 },
    ],
  },
  {
    id: "goodkind-market",
    name: "Goodkind Market",
    clientCode: "CLIENT · GK-3051",
    description: "A neighborhood market growing into a national favorite.",
    industry: "Food & grocery",
    location: "Brooklyn, NY · 3 stores",
    status: "Onboarding",
    plan: "Starter",
    accentColor: "#648390",
    metrics: [
      { label: "Revenue", value: "$840K" },
      { label: "Orders", value: "18.6K" },
      { label: "Stores", value: 3 },
    ],
  },
];

const revenue: MetricCardData = {
  id: "revenue-month",
  label: "Revenue this month",
  value: 10_200_000,
  format: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  locale: "en-US",
  change: 12.8,
  comparisonLabel: "vs. last month",
  detail: "Across all active client workspaces",
  iconName: "revenue",
  trend: [18, 23, 21, 32, 28, 43, 39, 52, 62, 57, 75],
};

const dashboardMetrics: MetricCardData[] = [
  revenue,
  {
    id: "orders-month",
    label: "Orders this month",
    value: 248_400,
    format: "number",
    locale: "en-US",
    change: 8.2,
    comparisonLabel: "vs. last month",
    iconName: "orders",
    trend: [24, 27, 31, 28, 37, 41, 40, 47, 53, 61],
  },
  {
    id: "average-order-value",
    label: "Average order value",
    value: 42.8,
    format: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    locale: "en-US",
    change: 3.6,
    comparisonLabel: "vs. last month",
    iconName: "trend",
    trend: [29, 31, 30, 36, 35, 39, 37, 42, 45, 48],
  },
  {
    id: "fulfillment-rate",
    label: "Fulfillment rate",
    value: 98.6,
    format: "percent",
    locale: "en-US",
    change: 1.4,
    comparisonLabel: "vs. last month",
    iconName: "inventory",
    trend: [83, 86, 85, 89, 92, 91, 94, 92, 97, 99],
  },
];

const ticket: SupportTicketCardData = {
  id: "TKT-2048",
  ticketNumber: "#2048",
  summary: "My order is showing as delivered, but it hasn’t arrived yet.",
  status: "In progress",
  priority: "High",
  createdAt: "2026-10-06T09:42:00-07:00",
  locale: "en-GB",
  timeZone: "Europe/London",
  requester: { name: "Oliver James", phone: "+44 20 7946 0958", phoneCountryCode: "GB" },
  assignee: "Priya K.",
  category: "Delivery",
};

const lineItem: OrderLineItemCardData = {
  id: "PO-1836-01",
  productTitle: "Everyday parcel kit",
  productImageUrl: "/products/packing-kit.svg",
  sku: "FUL-KIT-025",
  variant: "Recycled kraft · medium",
  quantity: 12,
  unitPrice: 5.6,
  subtotal: 67.2,
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  locale: "de-DE",
  status: "Ready to pack",
  location: "Berlin fulfilment",
};

const DATA: Record<CardId, object> = { product, inventory: location, package: packageSpec, event, client, metric: revenue, ticket, order: lineItem };

function ComponentPreview({ id, actions }: { id: CardId; actions: { onClick: () => void; onHover: () => void } }) {
  switch (id) {
    case "product": return <ProductCard data={product} {...actions} />;
    case "inventory": return <InventoryLocationCard data={location} {...actions} />;
    case "package": return <PackageCard data={packageSpec} {...actions} />;
    case "event": return <EventDetailsCard data={event} {...actions} />;
    case "client": return <ClientCard data={client} {...actions} />;
    case "metric": return <MetricCard data={revenue} {...actions} />;
    case "ticket": return <SupportTicketCard data={ticket} {...actions} />;
    case "order": return <OrderLineItemCard data={lineItem} {...actions} />;
  }
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button className="demo-toggle" type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}>
      <span className={`demo-toggle__track ${checked ? "is-on" : ""}`}><span /></span>
      <span>{label}</span>
    </button>
  );
}

function DesktopIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.25" y="3" width="15.5" height="11" rx="1.7"/><path d="M7 17h6m-3-3v3"/></svg>;
}

function MobileIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5.25" y="1.75" width="9.5" height="16.5" rx="2.1"/><path d="M8.5 4h3M9.3 15.7h1.4"/></svg>;
}

function CardTabIcon({ id }: { id: CardId }) {
  const paths: Record<CardId, ReactNode> = {
    product: <><path d="m10 2.5 7 4v7l-7 4-7-4v-7l7-4Z"/><path d="m3.5 6.5 6.5 4 6.5-4M10 10.5v7"/></>,
    inventory: <><path d="M16.7 8.3c0 4.4-6.7 9.2-6.7 9.2S3.3 12.7 3.3 8.3a6.7 6.7 0 1 1 13.4 0Z"/><circle cx="10" cy="8" r="2"/></>,
    package: <><path d="m10 2.5 7 4v7l-7 4-7-4v-7l7-4Z"/><path d="m3.5 6.5 6.5 4 6.5-4M10 10.5v7"/></>,
    event: <><rect x="3" y="4.5" width="14" height="13" rx="2"/><path d="M6.5 2.5v4M13.5 2.5v4M3 8.5h14"/></>,
    client: <><rect x="3" y="4" width="14" height="13" rx="2"/><circle cx="8" cy="9" r="2"/><path d="M5.5 14a2.7 2.7 0 0 1 5 0M13 8h2M13 11h2"/></>,
    metric: <><path d="m3 14 4-4 3 3 7-8"/><path d="M12.5 5H17v4.5"/></>,
    ticket: <><path d="M3 11V9a7 7 0 0 1 14 0v2"/><path d="M3 10h3v6H5a2 2 0 0 1-2-2v-4ZM17 10h-3v6h1a2 2 0 0 0 2-2v-4Z"/></>,
    order: <><path d="M3 6.5 10 3l7 3.5v8L10 18l-7-3.5v-8Z"/><path d="m3.5 6.8 6.5 3.4 6.5-3.4M10 10.2V18"/></>,
  };
  return <svg viewBox="0 0 20 20" aria-hidden="true">{paths[id]}</svg>;
}

export default function App() {
  const [activeId, setActiveId] = useState<CardId>("product");
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [hoverSnacks, setHoverSnacks] = useState(false);
  const [clickSnacks, setClickSnacks] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = CARD_TYPES.find((card) => card.id === activeId)!;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % CARD_TYPES.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + CARD_TYPES.length) % CARD_TYPES.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = CARD_TYPES.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    const nextCard = CARD_TYPES[nextIndex];
    setActiveId(nextCard.id);
    document.getElementById(`tab-${nextCard.id}`)?.focus();
  };

  const showToast = useCallback((title: string, message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ title, message });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const actions = {
    onClick: () => clickSnacks && showToast("Card clicked", `${active.title} action received.`),
    onHover: () => hoverSnacks && showToast("Card hovered", `${active.title} hover action received.`),
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="OpsCards home">
          <img src="/brand-mark.svg" alt="" />
          <span>ops<span>cards</span></span>
        </a>
        <nav className="topnav" aria-label="Main navigation">
          <a href="#playground">Components <span>08</span></a>
          <a href="https://github.com/nahushr/opscards" target="_blank" rel="noreferrer">GitHub <span className="external-arrow">↗</span></a>
          <a className="topnav__install" href="#install">Get started <span>↘</span></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__main">
            <div className="hero__eyebrow"><span className="status-orb" /> OPEN SOURCE COMPONENTS FOR DAILY OPERATIONS</div>
            <h1>Useful data.<br /><em>Already at home.</em></h1>
            <p>Eight considered cards for the things your team keeps track of. Bring your data; we’ll bring the layout, detail, and a little polish.</p>
            <div className="hero__actions">
              <a href="#playground" className="button button--dark">Explore the cards <span>↓</span></a>
              <span className="hero__tech"><b>React</b><i /> TypeScript <i /> MIT</span>
            </div>
          </div>
          <div className="hero-note" aria-label="The OpsCards approach">
            <div className="hero-note__number">01<span>—</span>08</div>
            <span className="hero-note__rule" />
            <span className="hero-note__caption">CARD TYPES<br />ONE EASY API</span>
            <div className="hero-note__stack" aria-hidden="true"><span /><span /><span /></div>
          </div>
          <div className="hero__side-note"><span>MADE FOR WORK THAT MOVES</span><span>SimpliShelf ecosystem · Locale ready</span></div>
        </section>

        <section className="playground-section" id="playground">
          <div className="section-heading">
            <div><span className="section-kicker">THE COMPONENT STUDIO <span>01 / 08</span></span><h2>Pick a card.<br /><span>Bring it to life.</span></h2></div>
            <p>Each card turns a familiar ops workflow into one small, useful component. Choose one to preview it at full size.</p>
          </div>

          <div className="studio" aria-label="OpsCards live component studio">
            <div className="studio__header">
              <div className="studio__identity"><span className="studio__pulse" /><span>LIVE COMPONENT STUDIO</span><span className="studio__divider">/</span><span>{active.kind}</span></div>
              <span className="studio__built">BUILT FOR YOUR DATA <span>✳</span></span>
            </div>

            <div className="card-tabs" role="tablist" aria-label="Choose an OpsCards component">
              {CARD_TYPES.map((card, index) => (
                <button
                  key={card.id}
                  id={`tab-${card.id}`}
                  className={`card-tab ${activeId === card.id ? "is-active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={activeId === card.id}
                  tabIndex={activeId === card.id ? 0 : -1}
                  aria-controls="card-panel"
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  onClick={() => { setActiveId(card.id); setToast(null); }}
                >
                  <span className="card-tab__number">{card.number}</span>
                  <span className={`card-tab__icon card-tab__icon--${card.id}`}><CardTabIcon id={card.id} /></span>
                  <span>{card.title}</span>
                </button>
              ))}
            </div>

            <div className="studio__toolbar">
              <div className="view-switch" role="group" aria-label="Preview size">
                <button type="button" className={viewMode === "desktop" ? "is-active" : ""} aria-pressed={viewMode === "desktop"} onClick={() => setViewMode("desktop")}><DesktopIcon /> Desktop</button>
                <button type="button" className={viewMode === "mobile" ? "is-active" : ""} aria-pressed={viewMode === "mobile"} onClick={() => setViewMode("mobile")}><MobileIcon /> Mobile</button>
              </div>
              <div className="snack-controls" aria-label="Demo interactions">
                <span className="snack-controls__label">DEMO SNACKS</span>
                <Toggle label="On hover" checked={hoverSnacks} onChange={setHoverSnacks} />
                <Toggle label="On click" checked={clickSnacks} onChange={setClickSnacks} />
              </div>
            </div>

            <div className={`preview-stage ${viewMode === "mobile" ? "preview-stage--mobile" : ""}`}>
              <div className="preview-stage__grid" aria-hidden="true" />
              <div className="preview-stage__label"><span>PREVIEW</span><span>{viewMode === "mobile" ? "390 PX · MOBILE" : "RESPONSIVE · DESKTOP"}</span></div>
              <div id="card-panel" className={`preview-device preview-device--${activeId} ${viewMode === "mobile" ? "preview-device--mobile" : ""}`} role="tabpanel" aria-labelledby={`tab-${activeId}`}>
                {viewMode === "mobile" && <div className="device-island" aria-hidden="true" />}
                <ComponentPreview id={activeId} actions={actions} />
              </div>
              {toast && (
                <div className="demo-toast" role="status" aria-live="polite">
                  <span className="demo-toast__check">✓</span><span><strong>{toast.title}</strong><small>{toast.message}</small></span>
                  <button type="button" aria-label="Dismiss message" onClick={() => setToast(null)}>×</button>
                </div>
              )}
              <div className="preview-stage__coordinates" aria-hidden="true">OC / 2026 <span>✳</span></div>
            </div>

            <div className="studio__code">
              <div className="studio__code-meta"><span className="code-dot" /><span>DROP INTO YOUR APP</span><button type="button" onClick={() => navigator.clipboard?.writeText(active.code).then(() => showToast("Copied", "Component usage copied to clipboard."))}>COPY SNIPPET <span>⧉</span></button></div>
              <pre><code><span className="code-tag">{active.code.slice(0, active.code.indexOf(" "))}</span>{active.code.slice(active.code.indexOf(" "))}</code></pre>
              <div className="studio__data-count"><span>↳</span> <strong>{Object.keys(DATA[activeId]).length} fields</strong> in. One ready-to-use card out.</div>
            </div>
          </div>

          <div className="showcase-block client-showcase">
            <div className="showcase-block__heading">
              <div><span className="section-kicker">CLIENT WORKSPACES <span>01 / 03</span></span><h3>Every account, <em>at a glance.</em></h3></div>
              <p>Branded client cards for account pickers, portfolio views, and workspace dashboards.</p>
            </div>
            <div className="client-showcase__grid">
              {clientPortfolio.map((clientRecord) => <ClientCard key={clientRecord.id} data={clientRecord} />)}
            </div>
          </div>

          <div className="showcase-block dashboard-showcase">
            <div className="showcase-block__heading">
              <div><span className="section-kicker">DASHBOARD METRICS <span>02 / 03</span></span><h3>Big numbers, <em>kept tidy.</em></h3></div>
              <p>Compact values keep the whole KPI row readable, from thousands through millions.</p>
            </div>
            <div className="metric-showcase__grid">
              {dashboardMetrics.map((metric) => <MetricCard key={metric.id} data={metric} />)}
            </div>
          </div>

          <div className="showcase-block access-control-showcase">
            <div className="showcase-block__heading">
              <div><span className="section-kicker">ACCESS CONTROL <span>03 / 03</span></span><h3>Permissions and groups, <em>in cards.</em></h3></div>
              <p>Reusable building blocks for permission dialogs, group membership, and access settings.</p>
            </div>
            <div className="access-control-showcase__grid">
              <div className="access-control-showcase__permissions">
                <PermissionCategoryCard title="User management">
                  <PermissionCard code="USER_READ" name="View users" description="See user profiles and account status." />
                  <PermissionCard code="USER_INVITE" name="Invite users" description="Add teammates to this workspace." />
                  <PermissionCard code="USER_EDIT" name="Manage user access" />
                </PermissionCategoryCard>
              </div>
              <div className="access-control-showcase__groups">
                <UserGroupCard
                  name="Workspace administrators"
                  description="Manage users, settings, and workspace access."
                  icon={<span aria-hidden="true">✦</span>}
                  metadata={<span>12 members · Updated today</span>}
                />
                <UserGroupCard
                  name="Merchandising team"
                  description="Coordinate product catalog and seasonal assortment work."
                  icon={<span aria-hidden="true">✦</span>}
                  metadata={<span>8 members · Updated yesterday</span>}
                />
              </div>
            </div>
          </div>

          <p className="playground-caption"><span>↗</span> Try the hover and click switches above, then resize the window. Every card is keyboard accessible and ready to make your own.</p>
        </section>

        <section className="details-strip" id="install">
          <div className="details-strip__lead"><span className="section-kicker">LESS GLUE CODE</span><h2>Make room for<br /><span>the real work.</span></h2></div>
          <div className="details-strip__items">
            <article><span className="detail-number">01</span><h3>Useful by default</h3><p>Layouts, typography, status, and responsive behavior come ready to use.</p></article>
            <article><span className="detail-number">02</span><h3>Region aware</h3><p>Format currency, dates, time zones, and international phone numbers for your people.</p></article>
            <article><span className="detail-number">03</span><h3>Yours to tune</h3><p>Click and hover hooks, class names, and inline styles let every card fit the app.</p></article>
          </div>
        </section>

        <section className="install-panel">
          <div><span className="section-kicker">GET MOVING</span><h2>One install.<br /><span>Eight less things to build.</span></h2></div>
          <div className="install-command"><span className="install-command__label">ADD THE PACKAGE</span><code><i>$</i> npm install @simplishelf/opscards</code><span className="install-command__hint">Then import the component and stylesheet once.</span></div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand brand--footer" href="#top"><img src="/brand-mark.svg" alt="" /><span>ops<span>cards</span></span></a>
        <span>Thoughtful cards for the everyday bits.</span>
        <a href="https://github.com/nahushr/opscards" target="_blank" rel="noreferrer">Open source on GitHub ↗</a>
        <small>© 2026 SimpliShelf</small>
      </footer>
    </div>
  );
}
