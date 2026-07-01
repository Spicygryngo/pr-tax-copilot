# Replit System Inventory & Governance Handoff

**Account:** `tetradprotocol`  
**GitHub org:** `Spicygryngo`  
**Audit date:** 2026-07-01  
**Total Replit apps found:** 21  
**Source-of-truth principle:** GitHub is canonical. Replit is runtime/deployment only.  
**Scope:** Documentation only. No code, secrets, deployments, webhooks, wallets, exchange keys, or trading execution were modified.

---

## Executive Summary

Claude Code local Replit MCP successfully enumerated 21 reachable Replit apps. The current system is partially GitHub-backed, but several critical trading and protocol components are either co-located with marketing infrastructure, unverified, stale, or not backed by GitHub.

Key findings:

- 21 Replit apps were found.
- 6 apps were confirmed GitHub-backed.
- 1 app was confirmed to have no GitHub remote: `Tetrad Protocol DEX Bots Hyperliquid`.
- 14 apps require manual Git status verification because Replit Agent sessions timed out or could not confirm remotes.
- Two active Replit apps point to the same GitHub repo: `Spicygryngo/tetrad-protocol-site`.
- `Alex-Automates` contains marketing/outreach plus Hyperliquid/Praxis executor environment namespaces, creating a critical blast-radius issue.
- MLTT/RORO, Kronos, Praxis, and Signum do not appear as clean standalone Replit apps in the visible inventory.

The immediate goal is not to deploy anything. The immediate goal is to give Fable 5 a clean map before it touches architecture.

---

## 1. Complete App Inventory

Sorted by last-updated descending.

| # | App Title | Replit ID | Last Updated | Tier / Status |
|---:|---|---|---|---|
| 1 | Alex-Automates | `8e1574b3` | 2026-06-30 | Active |
| 2 | Portal El Alcázar | `137cc3fe` | 2026-06-30 | Active / Unknown purpose |
| 3 | TetradStrategyVaults | `1dcdef31` | 2026-06-29 | Active |
| 4 | Tetrad_Lab | `e33ea4bb` | 2026-06-27 | Active |
| 5 | Tetrad Protocol Website Remastered | `b664e8c6` | 2026-06-26 | Active |
| 6 | pr-tax-copilot | `c055caef` | 2026-06-26 | Active |
| 7 | Crypto Intelligence Hub | `c59d2815` | 2026-06-15 | Active / Conflict |
| 8 | Control Tower | `c22c1abc` | 2026-06-08 | Active |
| 9 | DNAX Arena | `5f438ef3` | 2026-05-22 | Active / Unknown |
| 10 | House Kling Website | `c0ca7887` | 2026-05-06 | Active / External |
| 11 | Crypto Trading Gamified | `60687eba` | 2026-04-04 | Active |
| 12 | Bybit Forwarder | `b471ce43` | 2026-03-19 | Active |
| 13 | EventPlannerPro – Dev Copy | `a0fca49b` | 2025-04-09 | Stale |
| 14 | EventPlannerPro | `0f4bf881` | 2025-03-23 | Stale |
| 15 | Tetrad Protocol Solana DEX (Jupiter) | `2060ae25` | 2025-02-25 | Stale / Prototype |
| 16 | Tetrad Protocol DEX Bots Hyperliquid | `0cc90179` | 2025-02-22 | Stale / No GitHub backing confirmed |
| 17 | Tetrad Protocol User Vaults | `83f3c55f` | 2025-02-20 | Stale / Prototype |
| 18 | Tetrad Presale Platform | `0e2fe6c3` | 2025-02-16 | Stale |
| 19 | Tetrad Dapp | `8202bfaf` | 2025-02-12 | Stale |
| 20 | AcademicScheduler | `138cf49e` | 2025-01-16 | Stale / Unrelated |
| 21 | USDTVesting | `381e078d` | 2025-01-16 | Stale |

---

## 2. Confirmed GitHub-Connected Apps

| App | GitHub Repo | Notes |
|---|---|---|
| Alex-Automates | `Spicygryngo/alex-automates` | Core platform. Marketing/outreach plus executor namespaces currently co-located. |
| TetradStrategyVaults | `Spicygryngo/TetradStrategyVaults` | Active protocol/vault infrastructure. Also had a review remote noted during audit. |
| Tetrad Protocol Website Remastered | `Spicygryngo/tetrad-protocol-site` | Shares repo with Crypto Intelligence Hub. Production owner must be clarified. |
| Crypto Intelligence Hub | `Spicygryngo/tetrad-protocol-site` | Same repo as website remastered. Dual-deployment conflict. |
| Control Tower | `Spicygryngo/tetrad-control-tower` | Admin/auth/deployment hub. |
| Bybit Forwarder | `Spicygryngo/Bybit-Forwarder` | TradingView alert relay / forwarder. |

**Confirmed GitHub-backed:** 6 of 21 apps.

---

## 3. Confirmed Replit-Only / No GitHub Backing

| App | Evidence | Risk |
|---|---|---|
| Tetrad Protocol DEX Bots Hyperliquid | Replit Agent confirmed no git remotes configured. | Code exists only in Replit. If deleted, corrupted, or abandoned, the code can be lost. |

**Confirmed no GitHub backing:** 1 of 21 apps.

---

## 4. Apps with Unknown GitHub Status

These apps require manual verification in Replit Settings → Git because Replit Agent timed out or could not confirm the remote.

| App | Replit ID | Likely Status / Notes |
|---|---|---|
| Portal El Alcázar | `137cc3fe` | Unknown. Active client/external app. |
| Tetrad_Lab | `e33ea4bb` | Unknown. Important because name suggests strategy/lab code. Must verify. |
| pr-tax-copilot | `c055caef` | Likely GitHub-backed; clean local repo exists and was pushed to `Spicygryngo/pr-tax-copilot`. |
| DNAX Arena | `5f438ef3` | Unknown. Potential client/demo product. |
| House Kling Website | `c0ca7887` | Unknown / external. |
| Crypto Trading Gamified | `60687eba` | Unknown. Likely education / Quant Quest. |
| EventPlannerPro – Dev Copy | `a0fca49b` | Unknown / stale. |
| EventPlannerPro | `0f4bf881` | Unknown / stale. |
| Tetrad Protocol Solana DEX (Jupiter) | `2060ae25` | Likely prototype. GitHub status unverified. |
| Tetrad Protocol User Vaults | `83f3c55f` | Likely prototype. GitHub status unverified. |
| Tetrad Presale Platform | `0e2fe6c3` | Likely prototype. GitHub status unverified. |
| Tetrad Dapp | `8202bfaf` | Likely prototype. GitHub status unverified. |
| AcademicScheduler | `138cf49e` | Unknown / unrelated. |
| USDTVesting | `381e078d` | Unknown / stale. |

---

## 5. Environment Variable Names by App

Values are intentionally omitted. Names only.

### 5.1 Alex-Automates (`Spicygryngo/alex-automates`)

Infrastructure:

```text
PORT
NODE_ENV
LOG_LEVEL
DATABASE_URL
SESSION_SECRET
ADMIN_SECRET
```

Outreach Automation / TWIN:

```text
TWIN_WEBHOOK_URL
TWIN_EMITTER_DRY_RUN
TWIN_FUND_READY_URL
TWIN_FUND_REPLY_URL
TWIN_FUND_BOUNCE_URL
TWIN_FUND_BOOKED_URL
TWIN_FUND_CANCELED_URL
TWIN_RETAIL_READY_URL
FUND_OUTBOUND_PAUSED
```

Dune Analytics:

```text
DUNE_API_KEY
DUNE_QUERY_STABLES_VENUE_FLOW_ID
DUNE_QUERY_CEX_ASSET_NETFLOW_ID
DUNE_QUERY_DEX_RISK_ROTATION_ID
```

Calendly:

```text
CALENDLY_URL
PUBLIC_CALENDLY_URL
CALENDLY_WEBHOOK_SECRET
```

Marketing Engine:

```text
MARKETING_WEBHOOK_SECRET
MARKETING_LIVE_SEND_ENABLED
MARKETING_ALLOW_LEGACY_BATCH_SEND
MARKETING_ALLOW_LEGACY_SINGLE_APPROVE_SEND
MARKETING_COMMUNICATION_LIVE_EMAIL_ENABLED
MARKETING_GOVERNED_EXECUTOR_LIVE_SEND
MARKETING_SINGLE_PROSPECT_CANARY_ENABLED
AUTO_APPROVE_FUND_CAP
AUTO_APPROVE_RETAIL_CAP
SEND_ELIGIBLE_HARD_CAP
```

Hyperliquid Live Executor namespace:

```text
HYPERLIQUID_PRIVATE_KEY
HYPERLIQUID_WALLET_ADDRESS
HYPERLIQUID_API_KEY
HYPERLIQUID_API_SECRET
HYPERLIQUID_API_WALLET_ADDRESS
HYPERLIQUID_API_WALLET_MODE
HYPERLIQUID_TESTNET
DRY_RUN
TETRAD_EXECUTOR_BRIDGE_SECRET
```

Praxis Testnet Executor namespace:

```text
PRAXIS_HYPERLIQUID_PRIVATE_KEY
PRAXIS_HYPERLIQUID_WALLET_ADDRESS
PRAXIS_HYPERLIQUID_API_WALLET_ADDRESS
PRAXIS_HYPERLIQUID_API_WALLET_MODE
PRAXIS_HYPERLIQUID_TESTNET
PRAXIS_EXECUTOR_BRIDGE_SECRET
PRAXIS_EXECUTOR_KILL_SWITCH
PRAXIS_TESTNET_ORDERING_ENABLED
PRAXIS_TESTNET_ORDERING_ACK
PRAXIS_TESTNET_ALLOW_OPEN_ORDERS
PRAXIS_TESTNET_ALLOW_REDUCE_ONLY
PRAXIS_MAX_TESTNET_ORDER_NOTIONAL_USDC
PRAXIS_MAX_TESTNET_QTY_BTC
```

ElevenLabs:

```text
ELEVENLABS_AGENT_ID
```

Frontend / Vite:

```text
VITE_COURSE_PAYMENT_CHAIN
VITE_COURSE_PAYMENT_WALLET_ADDRESS
VITE_TETRAD_PAYMENT_CHAIN
VITE_TETRAD_PAYMENT_WALLET_ADDRESS
VITE_PAYPAL_URL
VITE_VENMO_URL
```

### 5.2 TetradStrategyVaults (`Spicygryngo/TetradStrategyVaults`)

Database / Auth / AI:

```text
DATABASE_URL
REPL_ID
OPENAI_API_KEY
```

MEXC Exchange:

```text
MEXC_API_KEY
MEXC_API_SECRET
MEXC_SUBACCOUNT_IDS
```

Vault Management:

```text
VAULT_PRIVATE_KEYS
VAULT_ADDRESSES
VAULT_INACTIVITY_PERIOD_DAYS
VAULT_STORAGE_TYPE
```

Telegram:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
TELEGRAM_ENABLED
```

Fee / Revenue:

```text
TAX_WALLET_ADDRESS
SUCCESS_FEE_PERCENTAGE
```

Polygon:

```text
POLYGON_RPC
POLYGON_AMOY_RPC
PRIVATE_KEY
POLYGONSCAN_API_KEY
ETHERSCAN_API_KEY
```

HyperEVM:

```text
HYPEREVM_RPC_URL
HYPEREVM_TESTNET_RPC_URL
HYPEREVM_PRIVATE_KEY
```

Contracts:

```text
TETRAD_WALLET_ADDRESS
BOT_WALLET_ADDRESS
FEE_WALLET_ADDRESS
OWNER_WALLET_ADDRESS
VAULT_ADDRESS
USDC_ADDRESS
DEPOSIT_ASSET_ADDRESS
FACTORY_ADDRESS
```

### 5.3 Tetrad Protocol Website Remastered + Crypto Intelligence Hub (`Spicygryngo/tetrad-protocol-site`)

```text
DATABASE_URL
SESSION_SECRET
ADMIN_ONBOARDING_SECRET
ONBOARDING_DATA_PATH
TELEGRAM_BOT_TOKEN
TELEGRAM_ADMIN_CHAT_ID
TELEGRAM_WEBHOOK_SECRET
EXPO_PUBLIC_DOMAIN
OPENAI_API_KEY
OPENAI_TEXT_MODEL
ORB_MAX_TOKENS
ORB_RATE_LIMIT_MAX
LOG_LEVEL
```

### 5.4 Control Tower (`Spicygryngo/tetrad-control-tower`)

Session / Security:

```text
AUTH_PROVIDER
USE_SECURE_COOKIES
TETRAD_SECRET
ENCRYPTION_KEY
ADMIN_REPLIT_IDS
TEST_EMAIL
DEV_MODE
PORT
```

PostgreSQL:

```text
DATABASE_URL
PGHOST
PGPORT
PGUSER
PGPASSWORD
PGDATABASE
PGSSLMODE
```

Replit OIDC:

```text
REPL_ID
ISSUER_URL
REPLIT_CONNECTORS_HOSTNAME
REPL_IDENTITY
WEB_REPL_RENEWAL
```

AWS Cognito:

```text
COGNITO_REGION
COGNITO_USER_POOL_ID
COGNITO_CLIENT_ID
COGNITO_CLIENT_SECRET
COGNITO_DOMAIN
ADMIN_COGNITO_IDS
```

AWS SES / SMTP:

```text
AWS_SES_ACCESS_KEY_ID
AWS_SES_SECRET_ACCESS_KEY
AWS_SES_REGION
SES_FROM_EMAIL
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_EMAIL
```

Blockchain:

```text
ARBISCAN_API_KEY
```

### 5.5 Bybit Forwarder (`Spicygryngo/Bybit-Forwarder`)

```text
SESSION_SECRET
DATABASE_URL
PGDATABASE
PGHOST
PGPORT
PGUSER
PGPASSWORD
```

### 5.6 Tetrad Protocol DEX Bots Hyperliquid (No GitHub)

```text
DATABASE_URL
HYPERLIQUID_API_KEY
HYPERLIQUID_API_SECRET
SESSION_SECRET
CREATOR_WALLET_ADDRESS
VITE_CONTRACT_ADDRESS
```

### 5.7 Crypto Trading Gamified / Quant Quest

```text
ADMIN_EMAILS
ADMIN_PASSWORD
SESSION_SECRET
DATABASE_URL
PGHOST
PGPORT
PGUSER
PGPASSWORD
PGDATABASE
```

---

## 6. System Category Map

| Category | Replit App(s) | GitHub Repo | Notes |
|---|---|---|---|
| Alex Automates | Alex-Automates | `alex-automates` | Core platform: outreach, TWIN, Dune, Calendly, marketing engine, and executor namespaces currently co-located. |
| Praxis | Alex-Automates embedded namespace | `alex-automates` currently; should move to `praxis-executor` | `PRAXIS_*` environment namespace. Kill switch exists by name. |
| Hyperliquid Live Executor | Alex-Automates embedded namespace | `alex-automates` currently; should move to `tetrad-live-executor` | `HYPERLIQUID_*`, `DRY_RUN`, and executor bridge namespace. |
| MLTT/RORO | Crypto Intelligence Hub, Tetrad Protocol Website | `tetrad-protocol-site` currently references it | No standalone runtime found. Should move to `tetrad-agent` or `tetrad-strategies`. |
| Kronos | Crypto Intelligence Hub, Tetrad Protocol Website | `tetrad-protocol-site` references it | Runtime not visible as Replit app. Must locate before extraction. |
| Signum | Crypto Intelligence Hub, Tetrad Protocol Website | References only | No dedicated app found. Determine if external SaaS, repo, or webhook-only lane. |
| TradingView | Bybit Forwarder | `Bybit-Forwarder` | TradingView alert relay. Keep single-purpose. |
| Deployment / Admin | Control Tower | `tetrad-control-tower` | Auth, user management, email, deployment/admin. |
| Tetrad Protocol Active | TetradStrategyVaults | `TetradStrategyVaults` | Vaults, contracts, MEXC, HyperEVM, Telegram alerts, success fees. |
| Tetrad Protocol Website | Website Remastered, Crypto Intelligence Hub | `tetrad-protocol-site` | Dual deployment conflict. |
| Tetrad Legacy / Prototype | Solana DEX, User Vaults, Presale, Dapp, USDTVesting | Unknown | Early-2025 prototypes. Back up then archive if superseded. |
| Education | Crypto Trading Gamified | Unknown | Quant Quest / gamified onboarding. |
| Tools | pr-tax-copilot | `pr-tax-copilot` | Puerto Rico tax compliance tool. Active local development. |
| External / Client | Portal El Alcázar, House Kling Website, DNAX Arena | Unknown | Separate from trading governance unless intentionally retained. |
| Unrelated | EventPlannerPro, EventPlannerPro Dev Copy, AcademicScheduler | Unknown | Candidate cleanup after backup. |

---

## 7. Consolidation Priorities

### P0 — Critical / Blocking

#### 1. Resolve `tetrad-protocol-site` dual deployment

Problem:

- `Tetrad Protocol Website Remastered` and `Crypto Intelligence Hub` both point to `Spicygryngo/tetrad-protocol-site`.
- Two Replit deployments for one repo create ambiguity over which deployment is production.
- A change can ship to the wrong Repl or leave one deployment stale.

Recommended action:

- Designate one production Repl.
- Archive or repurpose the other.
- If Crypto Intelligence Hub has unique behavior, split it into `Spicygryngo/tetrad-crypto-intelligence-hub`.

#### 2. Back up `Tetrad Protocol DEX Bots Hyperliquid`

Problem:

- It is the only confirmed app with no GitHub backing.
- It may be superseded, but deletion without export could permanently lose code.

Recommended action:

- Export to `Spicygryngo/tetrad-dex-bots-hyperliquid-archive`.
- Mark archived/read-only if superseded.
- Do not connect to live execution until reviewed.

### P1 — High Priority

#### 3. Verify GitHub status of the 14 uninspected apps

Open each in Replit Settings → Git and record remote URL or `none`.

Priority order:

1. `Tetrad_Lab`
2. `Tetrad Protocol Solana DEX (Jupiter)`
3. `Tetrad Protocol User Vaults`
4. `Tetrad Presale Platform`
5. `Tetrad Dapp`
6. `USDTVesting`
7. `Crypto Trading Gamified`
8. `pr-tax-copilot`
9. External/client apps
10. Unrelated stale apps

#### 4. Split Alex-Automates concerns

Problem:

- Marketing/outreach and trading executor namespaces are co-located.
- Marketing failures, webhook bugs, or deployment restarts can affect trading readiness.

Recommended split:

- `alex-automates-marketing`: outreach, CRM, Twin, Dune, Calendly, courses, lead capture.
- `tetrad-agent`: governance, allocation, routing, permissioning, MLTT/RORO.
- `tetrad-live-executor`: Hyperliquid live/paper/testnet executor bridge.
- `praxis-executor`: Praxis-specific lane.

### P2 — Medium Priority

#### 5. Locate Kronos runtime

Kronos is described on the website but no standalone runtime was visible in the Replit app list.

Recommended action:

- Search GitHub for `Kronos`, `timing`, `regime`, `forecast`, `hmm`, `lstm`, and model decision endpoints.
- Confirm whether Kronos runs inside Alex-Automates, another Replit app, or external infrastructure.
- Register it in a repo before Fable 5 attempts integration.

#### 6. Clarify Signum scope

Signum appears as onboarding/reference surface, not as a dedicated app.

Recommended action:

- Determine whether Signum is an external SaaS/webhook integration, internal service, or deprecated name.
- Document webhook schemas and execution constraints.

### P3 — Cleanup

- Archive unrelated stale apps after exporting code.
- Remove dead prototypes only after backups and explicit confirmation.
- Keep client/external apps separated from Tetrad governance work.

---

## 8. Biggest Risks

| Risk | Severity | Detail |
|---|---|---|
| Dual deployment on one repo | Critical | Website Remastered and Crypto Intelligence Hub share `tetrad-protocol-site`. |
| Live trading co-located with marketing | Critical | Hyperliquid/Praxis namespaces are in Alex-Automates alongside marketing/Twin/Calendly. |
| No GitHub backup for DEX Bots Hyperliquid | High | A stale but potentially important trading bot app has no Git backing. |
| Praxis and live executor flags in one app | High | Misconfiguration can confuse paper/testnet/live mode boundaries. |
| 14 apps with unverified GitHub status | Medium | Unknown backup state creates code-loss and drift risk. |
| No visible Kronos runtime | Medium | Model/timing engine appears referenced but not isolated. |
| Stale prototypes may retain secrets | Medium | Early Repls may still hold wallet/API key names or values in Replit Secrets. Values were not inspected. |

---

## 9. Recommended Source-of-Truth Repo Per System

| System / App | Recommended GitHub Repo | Status |
|---|---|---|
| Alex Automates marketing/outreach | `Spicygryngo/alex-automates` or `Spicygryngo/alex-automates-marketing` | Exists but needs separation. |
| Praxis executor | `Spicygryngo/praxis-executor` | New repo recommended. |
| Hyperliquid live executor | `Spicygryngo/tetrad-live-executor` | New repo recommended. |
| MLTT/RORO governance and strategies | `Spicygryngo/tetrad-agent` and/or `Spicygryngo/tetrad-strategies` | Locate real code first. |
| Kronos | `Spicygryngo/kronos` | Locate runtime first. |
| Signum integration | `Spicygryngo/signum` or docs inside `tetrad-agent` | Confirm active scope first. |
| Tetrad Protocol website | `Spicygryngo/tetrad-protocol-site` | Keep one production deployment. |
| TetradStrategyVaults | `Spicygryngo/TetradStrategyVaults` | Exists. Maintain. |
| Control Tower | `Spicygryngo/tetrad-control-tower` | Exists. Maintain. |
| Bybit Forwarder | `Spicygryngo/Bybit-Forwarder` | Exists. Maintain. |
| DEX Bots Hyperliquid archive | `Spicygryngo/tetrad-dex-bots-hyperliquid-archive` | Export before deleting. |
| Quant Quest | `Spicygryngo/quant-quest` | Confirm backing first. |
| pr-tax-copilot | `Spicygryngo/pr-tax-copilot` | Exists. Maintain. |
| Legacy Tetrad apps | `Spicygryngo/tetrad-archive-2025` | Archive before cleanup. |

---

## 10. Fable 5 Handoff Notes

Fable 5 should not start by editing trading code. It should start by validating this map and reducing blast radius.

First operational sequence:

1. Verify the two `tetrad-protocol-site` deployments and choose production.
2. Export or archive no-GitHub Hyperliquid DEX bot.
3. Locate the real MLTT/RORO, Kronos, Praxis, and Signum code paths.
4. Split marketing from executor responsibilities.
5. Build paper-only governance integration.
6. Add testnet gates.
7. Add live gates.
8. Require explicit approval before live execution.

---

## End State for This Handoff

The correct stopping state is:

- Replit MCP connected locally.
- 21-app inventory captured.
- Risks documented.
- Source-of-truth recommendations written.
- No code changed.
- No secrets read or exposed.
- No trading execution touched.
