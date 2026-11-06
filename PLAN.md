# Birthday Discovery Agent Implementation Plan

This plan details the design and implementation for the Birthday Discovery Agent in `apps/agent`, data modeling in `packages/db`, and API routing in `packages/api` based on the target birthday perk card:

- **Brand & Badge**: Name, short description, reward category (e.g. `Free`)
- **Action Links**: `[Location]` (Google Maps), `[App Store]` (iOS), `[Play Store]` (Android)
- **Birthday Perks**: Specific rewards list (e.g. `Free Root Beer`)
- **Validity**: Period (e.g. `Not specified`, `Birthday month`, `Birthday week`)
- **How To Redeem**: Instructions (e.g. `Via the mobile app`, `Show IC/ID`)

---

## 1. System Architecture

```mermaid
flowchart TD
    Trigger["Agent Trigger / Schedule<br/>(apps/agent)"] --> Agent["Eve Agent<br/>(apps/agent/agent/agent.ts)"]

    subgraph Connections ["Connections (apps/agent/agent/connections/)"]
        Treg["treg.ts<br/>(Web Search, SERP, Scraping)"]
        Composio["composio.ts<br/>(Google Maps, App Stores, Sheets)"]
    end

    Agent --> Treg
    Agent --> Composio

    subgraph Tools ["Tools (apps/agent/agent/tools/)"]
        T1["upsert-brand-perk.ts<br/>(Write to DB)"]
    end

    Agent --> Treg
    Agent --> Composio
    Agent --> Tools

    Tools --> DB[("Neon PostgreSQL<br/>(@befday-2.0/db)")]
    Contracts["Shared Contracts<br/>(@befday-2.0/contracts)"] --> Agent
    Contracts --> TRPC
    Contracts --> Web
    Contracts --> Native
    DB --> TRPC["tRPC API<br/>(packages/api)"]
    TRPC --> Web["apps/web"]
    TRPC --> Native["apps/native"]

    subgraph Deferred ["Deferred Pipelines"]
        D1["Reporting: Composio Google Sheets"]
        D2["Social Media: Neulink Publishing"]
        D3["SEO & Blog Writing Agent"]
        D4["Email Marketing"]
    end

    DB -.-> Deferred
```

---

## 2. Eve Agent Blueprint (`apps/agent`)

### A. Connections

- **`apps/agent/agent/connections/treg.ts`** _(Configured)_:
  - Proxies Google Search and web scraping to fetch brand promotion/rewards pages, forum posts, and lifestyle blogs.
- **`apps/agent/agent/connections/composio.ts`** _(New)_:
  - Configures Composio MCP client for Google Maps Place resolution, Play Store/App Store search, and later Google Sheets sync.

### B. Tool (`apps/agent/agent/tools/`)

- **`upsert-brand-perk.ts`**:
  - Connects to `@befday-2.0/db` to create or update `Brand` and `BirthdayPerk` records directly in Neon PostgreSQL.
  - Consumes `upsertBrandPerkSchema` from `@befday-2.0/contracts`.
  - Derives `brandSlug` deterministically via `slugify`.
  - External search, app store link resolution, and Google Maps place lookups are performed directly by the agent via **Treg MCP** and **Composio MCP** connections.

### C. Instructions (`apps/agent/agent/instructions.md`)

- Defines standard operating procedures for verifying information:
  - Strict field consistency with the card UI.
  - Mark ambiguous or unconfirmed perks as `status: DRAFT`.
  - Store source URLs for auditability and verification.

---

## 3. Database Schema (`packages/db/prisma/schema/perk.prisma`)

Add new models to Neon PostgreSQL via Prisma:

```prisma
enum PerkBadge {
  FREE
  VOUCHER
}

enum PerkStatus {
  DRAFT
  PUBLISHED
  EXPIRED
  ARCHIVED
}

model Brand {
  id            String         @id @default(cuid())
  name          String
  slug          String         @unique
  description   String?
  logoUrl       String?
  websiteUrl    String?

  // External Action Links (matching UI card)
  googleMapUrl  String?
  appStoreUrl   String?
  playStoreUrl  String?

  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  perks         BirthdayPerk[]

  @@index([slug])
  @@map("brand")
}

model BirthdayPerk {
  id              String      @id @default(cuid())
  brandId         String
  brand           Brand       @relation(fields: [brandId], references: [id], onDelete: Cascade)

  badge           PerkBadge   @default(FREE)
  headline        String?     // e.g. "Discover exclusive birthday perks at A&W."
  perksList       String[]    // e.g. ["Free Root Beer"]
  validity        String      @default("Not specified")
  howToRedeem     String[]    // e.g. ["Via the mobile app"]
  termsConditions String?

  status          PerkStatus  @default(DRAFT)
  sourceUrls      String[]
  verifiedAt      DateTime?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([brandId])
  @@index([status])
  @@map("birthday_perk")
}
```

---

## 4. API Layer (`packages/api/src/routers/`)

Create modular tRPC routers:

1. **`perksRouter` (`packages/api/src/routers/perk.ts`)**:
   - `list`: Filter by badge (`FREE` / `VOUCHER`), search query, and pagination.
   - `bySlug`: Get complete brand + perk data for rendering the card.
   - `featured`: Curated or latest verified freebies.
2. **`agentRouter` (`packages/api/src/routers/agent.ts`)** _(Protected / Admin)_:
   - `triggerDiscovery`: Start agent run for a brand name.
   - `listDrafts`: View perks waiting for review.
   - `updateStatus`: Publish or edit draft perks.

---

## 5. Deferred Modules Roadmap

1. **Google Sheets Sync**:
   - Add `agent/tools/export-to-sheets.ts` using Composio Google Sheets tool to maintain a live QA sheet.
2. **Social Media Publishing**:
   - Connect NeuLink via `agent/connections/neulink.ts` to schedule birthday perk promo posts across social channels.
3. **SEO Discovery & Blog Subagent**:
   - Eve subagent in `agent/subagents/seo-writer/` for generating localized blog posts and programmatic landing pages.
4. **Email Marketing**:
   - Cloudflare Email / Resend integration for weekly birthday month digests.

---

## 6. Execution Order

- **Step 1**: Write `packages/db/prisma/schema/perk.prisma`, run `prisma generate` and migration.
- **Step 2**: Create `apps/agent/agent/connections/composio.ts` and discovery tools in `apps/agent/agent/tools/`.
- **Step 3**: Update `apps/agent/agent/instructions.md` with birthday perk extraction rules.
- **Step 4**: Create tRPC routers in `packages/api` and expose to web/native.
- **Step 5**: Test discovery flow end-to-end on target brands (e.g., A&W, Starbucks).
