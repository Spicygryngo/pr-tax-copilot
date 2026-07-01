# Fable 5 Governance Integration Plan

**Date:** 2026-07-01  
**Companion file:** `REPLIT_SYSTEM_INVENTORY_AND_GOVERNANCE_HANDOFF.md`  
**Purpose:** Give Fable 5 a safe, staged plan for connecting the AI governance layer to real strategy systems through paper, then testnet, then live approval gates.  
**Scope:** Planning only. No code, deployments, secrets, webhooks, wallets, exchange credentials, or trading execution are modified by this document.

---

## 1. Operating Principle

GitHub is the canonical source of truth. Replit is runtime and deployment only.

The system should be separated into clear layers:

```text
Strategy / signals
→ Governance / allocation / routing
→ Risk checks / permission gates
→ Executor bridge
→ Reconciliation / audit logs
→ Human approval gate for live
```

No model should have a direct path from forecast to live order. Every action must pass through schema validation, risk gates, mode checks, kill switches, and audit logging.

---

## 2. Current Architecture Problem

The Replit audit found that `Alex-Automates` is acting as more than marketing infrastructure. It includes marketing/outreach systems plus executor-related namespaces for Hyperliquid and Praxis. This creates a dangerous blast-radius issue.

Target separation:

```text
alex-automates
  marketing, CRM, Twin, Calendly, Dune, courses, lead capture

tetrad-agent
  governance, allocation, routing, MLTT/RORO permissioning

tetrad-strategies
  strategy definitions, signal schemas, backtests, TradingView/Pine references

kronos
  timing engine, regime model, forecast outputs

praxis-executor
  Praxis-specific paper/testnet/live lane, disabled by default

tetrad-live-executor
  exchange bridge, disabled by default, accepts only approved order intents

tetrad-control-tower
  admin, approvals, observability, human-in-the-loop controls

tetrad-protocol-site
  public website and onboarding only
```

---

## 3. Required Source-of-Truth Repos

| System | Target repo | Status |
|---|---|---|
| Marketing/outreach | `Spicygryngo/alex-automates` | Existing, needs boundary cleanup |
| Governance/router | `Spicygryngo/tetrad-agent` | Locate or create after approval |
| Strategies/signals | `Spicygryngo/tetrad-strategies` | Locate real algorithm code first |
| Kronos/timing | `Spicygryngo/kronos` | Runtime not yet located |
| Praxis execution lane | `Spicygryngo/praxis-executor` | Extract from current co-location |
| Exchange executor bridge | `Spicygryngo/tetrad-live-executor` | Extract from current co-location |
| Admin/control | `Spicygryngo/tetrad-control-tower` | Existing |
| Public website | `Spicygryngo/tetrad-protocol-site` | Existing, dual deployment must be resolved |
| TradingView relay | `Spicygryngo/Bybit-Forwarder` | Existing |
| Strategy vaults | `Spicygryngo/TetradStrategyVaults` | Existing |
| Archive | `Spicygryngo/tetrad-archive-2025` | Needed for stale prototype apps |

---

## 4. Paper Trading Readiness Checklist

Paper is the first acceptable governed state.

Required before paper mode:

- Strategy signal schema defined.
- Model decision record schema defined.
- Allocation/routing schema defined.
- Paper ledger exists.
- Duplicate-bar and duplicate-order guard exists.
- Position state model exists.
- Pre-trade risk checks exist.
- Post-trade reconciliation exists against paper ledger.
- Append-only audit events exist.
- Dry-run is the safe default.
- Kill switches fail closed.
- No production execution credentials are required for paper.

Paper invariant:

```text
Paper mode may create simulated orders only.
Paper mode must not call any live or testnet executor.
```

---

## 5. Testnet Readiness Checklist

Testnet comes only after paper is stable.

Required before testnet mode:

- Paper results reconcile cleanly.
- Testnet configuration is isolated from live.
- Testnet notional and quantity caps exist.
- Reduce-only behavior is verified.
- Open-order behavior is verified.
- Testnet executor bridge is separately permissioned.
- Kill switch behavior is tested.
- First testnet order requires explicit approval.
- Reconciliation runs after every testnet order.
- Any mismatch triggers alert and blocks new risk.

Testnet invariant:

```text
Testnet mode may submit testnet orders only.
Live mode must remain disabled while testnet is active.
```

---

## 6. Live Readiness Checklist

Live is last and requires explicit approval.

Required before live mode:

- Paper stable.
- Testnet stable.
- Live executor isolated.
- Human approval gate enabled.
- Kill switch tested.
- Maximum position limits set.
- Maximum daily loss limits set.
- Maximum strategy allocation limits set.
- Duplicate order protection tested.
- Reconciliation tested against the venue.
- Emergency flat procedure documented.
- Audit log dashboard visible.
- Explicit approval recorded before first live order.

Live invariant:

```text
No model may directly place a live order.
The live executor only accepts approved, schema-valid order intents from governance.
```

---

## 7. Required Kill Switches

| Switch | Scope | Default behavior |
|---|---|---|
| `GLOBAL_TRADING_KILL_SWITCH` | All trading | Fail closed |
| `PAPER_TRADING_KILL_SWITCH` | Paper | Stop simulated order creation |
| `TESTNET_TRADING_KILL_SWITCH` | Testnet | Stop testnet submission |
| `LIVE_TRADING_KILL_SWITCH` | Live | Stop live submission |
| `PRAXIS_EXECUTOR_KILL_SWITCH` | Praxis | Stop Praxis lane |
| `HYPERLIQUID_EXECUTOR_KILL_SWITCH` | Hyperliquid | Stop Hyperliquid lane |
| `SIGNUM_EXECUTOR_KILL_SWITCH` | Signum | Stop Signum lane |

Rule:

```text
If a switch is missing, unreadable, or malformed, treat it as enabled.
```

---

## 8. Required Dry-Run Flags

| Flag | Scope | Required default |
|---|---|---|
| `DRY_RUN` | Global | `true` |
| `TWIN_EMITTER_DRY_RUN` | Marketing/Twin | `true` |
| `PAPER_ORDERING_DRY_RUN` | Paper | Stage-specific |
| `TESTNET_ORDERING_DRY_RUN` | Testnet | `true` until approved |
| `LIVE_ORDERING_DRY_RUN` | Live | `true` until approved |
| `PRAXIS_EXECUTOR_DRY_RUN` | Praxis | `true` until approved |
| `HYPERLIQUID_EXECUTOR_DRY_RUN` | Hyperliquid | `true` until approved |

Rule:

```text
Missing dry-run flag means dry-run is enabled.
```

---

## 9. Model Decision Record Schema

Every governance decision must produce a durable record before it can become an order intent.

```json
{
  "schema": "tetrad.model_decision_record.v1",
  "decision_id": "uuid",
  "created_at": "ISO-8601",
  "mode": "paper|testnet|live",
  "strategy_id": "string",
  "symbol": "string",
  "venue": "paper|testnet|live-venue",
  "timeframe": "string",
  "regime": "string",
  "signals": [],
  "model_outputs": [],
  "allocation": {
    "target_weight_pct": 0,
    "max_notional_usdc": 0,
    "leverage": 1
  },
  "risk": {
    "approved": false,
    "hard_blocks": [],
    "warnings": []
  },
  "decision": {
    "intent": "hold|open|add|reduce|close|block",
    "side": "long|short|flat",
    "reduce_only": true,
    "approved_for_executor": false
  },
  "audit": {
    "trace_id": "uuid",
    "source_repo": "owner/repo",
    "source_commit": "sha"
  }
}
```

---

## 10. Allocation / Routing Schema

```json
{
  "schema": "tetrad.allocation_signal.v1",
  "allocation_id": "uuid",
  "created_at": "ISO-8601",
  "mode": "paper|testnet|live",
  "portfolio_id": "string",
  "capital_base_usdc": 0,
  "routing_policy": "mltt_roro_v1",
  "risk_budget": {
    "max_portfolio_drawdown_pct": 0,
    "max_daily_loss_pct": 0,
    "max_symbol_weight_pct": 0,
    "max_strategy_weight_pct": 0
  },
  "sleeves": [
    {
      "strategy_id": "string",
      "enabled": true,
      "target_weight_pct": 0,
      "max_weight_pct": 0,
      "side_allowed": "long|short|both|flat",
      "permission": "allow|block|reduce_only"
    }
  ],
  "executor_target": {
    "executor_id": "paper-ledger|testnet-executor|live-executor",
    "allowed": false,
    "reason": "string"
  }
}
```

---

## 11. Pre-Trade Risk Checks

| Check | Type | Behavior |
|---|---|---|
| Mode check | Hard | Block if mode is ambiguous. |
| Kill switch check | Hard | Block if switch is enabled or missing. |
| Dry-run check | Hard | Block if execution mode is unsafe. |
| Venue check | Hard | Block if venue does not match mode. |
| Duplicate signal check | Hard | Block duplicate bar/order. |
| Position state check | Hard | Block on inconsistent state. |
| Reduce-only check | Hard | Enforce reduce-only on exits. |
| Max notional check | Hard | Block excessive order size. |
| Max quantity check | Hard | Block excessive quantity. |
| Max leverage check | Hard | Block excessive leverage. |
| Max daily loss check | Hard | Block new risk if breached. |
| Strategy permission check | Hard | Block disabled sleeves/sides. |
| Model confidence check | Policy | Warn or block by stage. |
| Staleness check | Hard | Block stale candles/signals/model outputs. |

---

## 12. Post-Trade Reconciliation

Reconciliation must run after every order intent and on schedule.

```json
{
  "schema": "tetrad.reconciliation_record.v1",
  "reconciliation_id": "uuid",
  "created_at": "ISO-8601",
  "mode": "paper|testnet|live",
  "venue": "string",
  "strategy_id": "string",
  "expected_position": {
    "side": "long|short|flat",
    "qty": 0,
    "entry_price": 0
  },
  "actual_position": {
    "side": "long|short|flat",
    "qty": 0,
    "entry_price": 0
  },
  "status": "in_sync|mismatch|stale|unknown",
  "action_required": "none|repair|manual_review|kill_switch"
}
```

SLA:

```text
Paper: every decision cycle.
Testnet: after every order and at least every 30 minutes.
Live: after every order, on heartbeat, and before any new risk is opened.
```

---

## 13. Audit Logging

Audit logs must be append-only.

Event types:

```text
MODEL_DECISION_CREATED
ALLOCATION_CREATED
PRE_TRADE_CHECK_STARTED
PRE_TRADE_CHECK_BLOCKED
PRE_TRADE_CHECK_APPROVED
ORDER_INTENT_CREATED
ORDER_INTENT_BLOCKED
ORDER_SENT_TO_EXECUTOR
ORDER_ACKNOWLEDGED
ORDER_REJECTED
RECONCILIATION_STARTED
RECONCILIATION_MISMATCH
RECONCILIATION_REPAIRED
KILL_SWITCH_ENABLED
KILL_SWITCH_DISABLED
HUMAN_APPROVAL_REQUESTED
HUMAN_APPROVAL_GRANTED
HUMAN_APPROVAL_DENIED
DEPLOYMENT_CHANGED
ENV_SCHEMA_CHANGED
```

---

## 14. Rollback Plan

Trigger rollback if any of the following occur:

- Unexpected execution.
- Mode confusion.
- Duplicate order intent.
- Position mismatch.
- Daily loss threshold breach.
- Missing audit logs.
- Stale model output driving a decision.
- Configuration exposure concern.
- Approval gate bypass.

Rollback steps:

1. Enable global kill switch.
2. Enable executor-specific kill switches.
3. Force dry-run mode.
4. Stop testnet/live executor workers.
5. Reconcile actual positions.
6. Freeze deployments.
7. Export audit logs.
8. Identify offending commit/config change.
9. Revert to last known-good state.
10. Run paper-only validation before re-enabling anything.

---

## 15. First 10 Tasks for Fable 5

1. Read both handoff files and summarize the risk map.
2. Resolve the `tetrad-protocol-site` dual-deployment plan.
3. Back up or archive `Tetrad Protocol DEX Bots Hyperliquid`.
4. Locate real MLTT/RORO, Kronos, Praxis, Signum, TradingView, and executor code paths.
5. Identify or create the source-of-truth repo plan.
6. Draft the Alex-Automates separation PR plan.
7. Design paper-only governance ledger.
8. Design testnet approval gates and caps.
9. Design live approval gates and rollback procedure.
10. Propose the first implementation PR. No code changes until approved.

---

## 16. First PR Recommendation

The first implementation PR should be safety documentation/config only:

```text
Title: Establish Tetrad governance safety boundaries
Scope:
- Add architecture docs.
- Add env var schema docs.
- Add mode and kill-switch invariant docs.
- Add paper/testnet/live readiness checklist.
- No execution changes.
```

The first code PR should come after review:

```text
Title: Add paper-only governance decision ledger
Scope:
- Paper-only model decision records.
- Allocation records.
- Pre-trade check records.
- No exchange connectivity.
```

---

## 17. Non-Negotiable Constraints

```text
No live trading until explicit approval.
No secret values in reports, logs, prompts, or PRs.
No wallet or credential handling in marketing apps.
No direct model-to-executor path.
No execution without pre-trade risk record.
No execution without post-trade reconciliation.
No live execution without human approval gate.
No code changes before Fable 5 produces and receives approval on the first implementation PR plan.
```

---

## 18. Ready State

Fable 5 is ready to begin after:

- Replit MCP is connected.
- GitHub repo access is available.
- These two markdown files are committed.
- No live secrets were exposed.
- No deployments were changed.
- No execution was touched.

The correct first action is controlled planning, not live integration.
