# AgentCart AI Commerce Agent & Tool Orchestration

## 1. Agent Reasoning Lifecycle

The **AgentCart Commerce Agent** operates using a disciplined, transparent reasoning state machine:

$$\text{OBSERVE} \rightarrow \text{UNDERSTAND} \rightarrow \text{SEARCH} \rightarrow \text{RANK} \rightarrow \text{RECOMMEND} \rightarrow \text{IDENTIFY REVENUE OPPORTUNITY} \rightarrow \text{ASK USER APPROVAL} \rightarrow \text{VALIDATE POLICY} \rightarrow \text{EXECUTE ACTION} \rightarrow \text{VERIFY RESULT} \rightarrow \text{LOG ACTION}$$

---

## 2. Intent Extraction Engine

The agent converts natural-language customer queries into structured intent JSON:

```json
{
  "category": "laptops",
  "budget_max": 80000,
  "ram_min": 16,
  "gpu_required": true,
  "purpose": "AI development",
  "priority": "performance_value"
}
```

If an ambiguous query is provided (e.g. *"I need a laptop"*), the agent returns an interactive clarification query (*"What is your maximum budget and primary use case?"*) instead of guessing.

---

## 3. Deterministic Multi-Factor Product Scoring

Product rankings are calculated deterministically via a weighted scoring formula rather than unstructured LLM hallucinations:

$$\text{Score} = w_1 \cdot \text{Match} + w_2 \cdot \text{PriceFit} + w_3 \cdot \text{Rating} + w_4 \cdot \text{Stock} + w_5 \cdot \text{Priority}$$

Where:
* $w_1 = 0.35$ (Requirement match for RAM, GPU, and workload tags)
* $w_2 = 0.25$ (Price fit within max budget)
* $w_3 = 0.15$ (Customer reviews and rating score)
* $w_4 = 0.15$ (Real-time warehouse inventory availability)
* $w_5 = 0.10$ (Merchant catalog priority score)

---

## 4. 13 Required Commerce Tools

1. `search_products()` — Deterministic catalog search with multi-factor scoring.
2. `get_product_details()` — Retrieves hardware specifications and inventory.
3. `compare_products()` — Side-by-side spec and value comparison matrix.
4. `check_inventory()` — Real-time warehouse availability validation.
5. `calculate_cart_total()` — Authoritative server-side price recalculation.
6. `recommend_upsell()` — Identifies high-margin protection plans with reasoned pitches.
7. `recommend_cross_sell()` — Recommends ergonomic and productivity accessories.
8. `create_cart()` — Initializes or updates session cart with verified consent.
9. `validate_order_policy()` — Executes financial limit and discount checks.
10. `create_razorpay_order()` — Generates Razorpay Test Mode order ID.
11. `verify_razorpay_payment()` — Cryptographically validates signature.
12. `get_order_status()` — Live fulfillment and payment state query.
13. `create_audit_event()` — Commits immutable record into `AC-XXXXX` ledger.
