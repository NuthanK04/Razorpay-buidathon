# Financial Policy Engine

## 1. Overview & Guardrails

The **Financial Policy Engine** acts as an authoritative boundary between the AI sales agent and financial transactions.

Every action involving monetary commitments, discounts, cart additions, or payment triggers must pass evaluation before reaching execution layers.

---

## 2. Policy Rule Definitions

| Policy Code | Rule Description | Default Limit | Enforcement Severity |
| :--- | :--- | :--- | :--- |
| `MAX_TRANSACTION_AMOUNT` | Caps single autonomous transaction value | ₹1,00,000 INR | **CRITICAL** |
| `MAX_DISCOUNT_PERCENT` | Maximum permissible bundle/promotional discount | 15% | **HIGH** |
| `UPSELL_REQUIRES_CUSTOMER_APPROVAL` | Mandatory affirmative click before upsell inclusion | `true` | **CRITICAL** |
| `PAYMENT_REQUIRES_CUSTOMER_CONFIRMATION` | Mandatory customer confirmation before Razorpay launch | `true` | **CRITICAL** |
| `REFUND_REQUIRES_MERCHANT_APPROVAL` | Refunds cannot be triggered autonomously by AI | `true` | **HIGH** |

---

## 3. Violation Handling & Feedback

When a policy check fails:
1. The transaction is immediately blocked.
2. The order status transitions to `FAILED` or `BLOCKED`.
3. An audit log with `policyResult: "VIOLATION"` and `executionResult: "BLOCKED"` is recorded.
4. A clear, user-safe explanation is returned (e.g. *"Action blocked because the requested discount exceeds the merchant's configured maximum of 15%."*).
