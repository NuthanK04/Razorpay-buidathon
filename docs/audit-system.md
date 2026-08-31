# Immutable Audit System & AC-XXXXX Ledger

## 1. Audit Trail Structure

Every AI intent, product recommendation, upsell offer, user approval, policy evaluation, order creation, and payment verification emits an immutable audit record.

```typescript
interface AuditRecord {
  auditCode: string;          // e.g. "AC-10492"
  sessionId?: string;         // AI conversation session
  merchantId: string;         // Merchant identifier
  actionType: string;         // "INTENT_EXTRACTION" | "UPSELL_OFFERED" | "POLICY_EVALUATION" | "PAYMENT_VERIFIED"
  toolName?: string;          // Tool invoked (e.g. "recommend_upsell")
  inputSummary: string;       // User query or parameters
  decisionSummary: string;    // Action decided
  reason?: string;            // Safety/explainability rationale
  policyResult: "PASSED" | "VIOLATION" | "BYPASS";
  executionResult: "SUCCESS" | "FAILED" | "BLOCKED";
  relatedOrderId?: string;    // Associated DB order ID
  timestamp: string;          // ISO timestamp
  status: "COMMITTED";        // Write-once state
}
```

---

## 2. Sample Audit Entry

```
AUDIT ID: AC-10492
ACTION TYPE: PAYMENT_VERIFIED
TOOL: verify_razorpay_payment
INPUT: Order #ORD-2026-8492 - Razorpay Payment ID: pay_74981290
DECISION: Payment verified. Total: ₹77,498 (Upsell: ₹2,499)
REASON: Server-side HMAC-SHA256 signature verified. Order confirmed and inventory updated.
POLICY RESULT: PASSED
EXECUTION RESULT: SUCCESS
ORDER NUMBER: ORD-2026-8492
STATUS: COMMITTED
```
