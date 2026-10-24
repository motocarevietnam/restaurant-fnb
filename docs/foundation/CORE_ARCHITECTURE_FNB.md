# Restaurant F&B — Core Architecture Contract v1

Status: foundational specification; NOT a production migration. Align with current NestJS + Prisma/PostgreSQL backend, Next.js frontend, existing auth/RBAC and orders code before implementation.

## Operating model
Restaurant (tenant) -> Branch -> Shift + Staff assignments -> Orders, Menu prices, KDS stations, Payment accounts, Cash custody.
One restaurant-wide catalog of menu categories/items/images. A branch overlay controls enabled status, price, availability, tax mapping and station assignment. No destructive edits to historical sold items or paid prices.

## Shared order pipeline
Inputs: staff service (DINE_IN / TAKEAWAY / DELIVERY), table QR, website order, optionally kiosk.
All inputs -> authenticated/verified channel adapter -> **one OrdersService/Order Engine** -> persisted order and items -> outbox events -> station KDS/print -> READY -> service or delivery handoff -> completed.
Payment timing is a branch/configured policy and may happen before or after cooking. Customer-visible order completion must not bypass financial settlement requirements.
For each order item, station routing and printing are tracked separately. Print jobs have unique idempotency keys and explicit retry/reprint audit.

## Required backend guarantees
1. Tenant and branch authorization enforced on every query and mutation; deny by default.
2. Action permissions from role/permission tables, not role-name equality conditions.
3. Idempotency keys unique per tenant/channel/client request; concurrent submissions return the same order, not duplicate orders.
4. Transactional money math in integer minor units or precise Decimal; server computes tax, discounts and snapshot unit prices.
5. No direct database order writes from POS/QR/website/KDS/Delivery. The same service validates stock, price, modifiers, state transitions, shifts, and permissions.
6. Transactions + row locking or conditional updates for payment/refund, ledger postings and shift close. Append-only audit/ledger; reversals via compensating entries, not history edits.
7. Event/outbox for station delivery and print jobs to survive restarts. Separate events from authoritative order state.
8. Offline-capable clients require queued commands, bounded retries, conflict resolution and explicit degraded-payment behavior; do not claim offline bank transfer confirmation.

## Cash custody: 'Tiền đang ở đâu?'
Payment `cash` -> cash movement credit to collecting employee's shift drawer -> proposed handover -> receiving party confirms counted amount -> transfer postings -> branch safe / owner / bank.
Never equate 'paid' with 'owner received cash'. Cash closing does not erase who holds unsettled money. Reconcile opening float + collections - refunds - expenses - confirmed transfers = expected drawer balance. Record counted, differences, maker/checker, timestamps, reason and audit.
Bank transfer uses verified provider/bank reconciliation before confirmed; prepaid wallet has double-entry liability ledger and safe debit/reversal behavior.

## Data boundaries and migration direction
Existing Prisma schema includes `Restaurant`, `Branch`, branch-scoped `MenuItem`, `MenuCategory`, `KitchenStation`, `Shift`, `CashClosing`. Do NOT assume a global catalog and branch overlay already exist.
Incrementally introduce canonical catalog + branch menu offering tables only after migration plan and backfill/dual-read checks, preserving order item snapshots and foreign keys.
Use explicit contracts (schemas/DTOs) for branch context, source channel, order command, order items, station assignment, payments, cash ledger, handovers, idempotency and audit events.
Config hierarchy: platform defaults -> restaurant setting -> branch override -> authorized shift override when allowed. Store settings with validation, versioning, audit; cache invalidation on change.
KDS station IDs, local printer routing and supported payment gateways always come from branch settings, not static code arrays.

## Scope and permission model
Owner sees own restaurant's all branches; Branch Manager sees explicitly assigned branches; staff see only permitted roles/actions within assigned branches.
Dashboard hash tabs are *presentation only*: API must always enforce independent authorization.
QR table token is opaque, revocable and bound to active table/session; throttling, anti-replay and order ownership verification required.

## Implementation gates
G0 inventory existing modules/routes/schema and write compatibility map.
G1 lock shared contracts + design token usage; add unit tests.
G2 implement repository/service guards, idempotency and financial invariants behind feature flags.
G3 migrate catalog/branch overlay safely with production data migration, rollback plan and dual validation.
G4 integrate UI routes and shift cash custody; e2e across staff, table QR, website, KDS, payments.
G5 staged deployment, test printer/network loss and simultaneous updates, verify account reconciliation before rollout.

## Explicitly NOT done by this specification
No new Prisma migrations, no production deployment, no changes to existing menu/checkout behavior, and no proof that present code already satisfies these invariants.
