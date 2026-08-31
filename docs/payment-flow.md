# Razorpay Test Mode Payment Pipeline

## 1. End-to-End Payment Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant UI as Customer UI
    participant Agent as AgentCart Orchestrator
    participant Policy as Policy Engine
    participant PaymentSvc as Payment Service
    participant RZP as Razorpay Test Mode Gateway
    participant Audit as Audit System (AC-XXXXX)

    Customer->>UI: Selects Product & Approves Upsell
    UI->>Agent: Request Purchase Confirmation
    Agent->>Policy: Validate Order Policy (Amount, Consent, Stock)
    Policy-->>Agent: PASSED
    Agent->>PaymentSvc: Initialize Order (Server Calculated Total)
    PaymentSvc->>RZP: Create Order (amount_in_paise)
    RZP-->>PaymentSvc: razorpay_order_id
    PaymentSvc->>Audit: Log Order Creation (AC-XXXXX)
    PaymentSvc-->>UI: Launch Razorpay Checkout Modal
    Customer->>UI: Submits Payment Details (Test Card / UPI)
    UI->>PaymentSvc: Submit razorpay_payment_id + signature
    PaymentSvc->>PaymentSvc: Verify HMAC-SHA256 Signature
    alt Signature Valid
        PaymentSvc->>PaymentSvc: Transition Order Status to PAID & Deduct Stock
        PaymentSvc->>Audit: Log Payment Verified (AC-XXXXX)
        PaymentSvc-->>UI: Payment Success & Order Confirmation
    else Signature Invalid
        PaymentSvc->>PaymentSvc: Mark Order FAILED (Non-charged state)
        PaymentSvc->>Audit: Log Payment Failure (AC-XXXXX)
        PaymentSvc-->>UI: Safe Rejection & Retry Options
    end
```

---

## 2. Server-Side Cryptographic Signature Verification

All payment verification logic is isolated server-side. The frontend signature is validated using `crypto.createHmac`:

```typescript
const generatedSignature = crypto
  .createHmac('sha256', CONFIG.RAZORPAY_KEY_SECRET)
  .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
  .digest('hex');

const isValid = generatedSignature === data.razorpaySignature;
```

---

## 3. Order Lifecycle State Machine

$$\text{PENDING} \xrightarrow{\text{Policy Pass}} \text{PROCESSING} \xrightarrow{\text{Signature Verified}} \text{PAID}$$
$$\text{PROCESSING} \xrightarrow{\text{Signature Failed / Gateway Error}} \text{FAILED}$$
