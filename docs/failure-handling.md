# Graceful Failure Handling & Resilience Scenarios

## 1. Resilience Philosophy

AgentCart is designed to **fail safely** across all edge conditions:

* **No False Claims**: The system never claims a customer was charged when a payment fails.
* **Order Integrity**: Orders remain in `FAILED` or `PENDING` states until cryptographic proof of payment is confirmed.
* **Graceful Degradation**: If an AI provider encounters rate limits or downtime, the core store and Razorpay checkout continue functioning seamlessly.

---

## 2. Interactive Failure Simulations for Judges

The top **DemoBar** includes one-click simulation toggles:

1. **Simulate Payment Gateway Failure**:
   * *Trigger*: Toggle **Payment Failure: ON** in DemoBar.
   * *Behavior*: Razorpay checkout rejects the charge with a clear, safe message: *"Payment gateway is temporarily unavailable. No charges were made to your account."*
   * *State*: Order remains unfulfilled with `status: FAILED` and an immutable failure audit log is emitted.

2. **Simulate Policy Engine Violation**:
   * *Trigger*: Toggle **Policy Violation: ON** in DemoBar.
   * *Behavior*: Action is blocked prior to payment initiation with explanation: *"Action blocked by Policy Engine: Simulated policy check failure for Buildathon resilience evaluation."*

3. **Simulate AI Provider Outage**:
   * *Behavior*: System switches automatically to deterministic catalog search and standard browsing without throwing application crashes.
