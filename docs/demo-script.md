# 5-Minute Buildathon Judge Demo Script

Follow this step-by-step walkthrough to evaluate the complete AgentCart platform:

---

### Step 1: Open AgentCart
* Navigate to the Landing Page.
* Observe the header banner: *"Turn Every Conversation Into Verified Revenue."*

---

### Step 2: Launch Demo Prompt
* Click the blue **"Load Demo Prompt (₹80k AI Laptop)"** button in the top floating **DemoBar** (or click **"Try AI Shopping"**).
* The prompt is submitted:
  > *"I need a laptop for AI development under ₹80,000 with at least 16GB RAM and a dedicated GPU."*

---

### Step 3: Inspect AI Understanding & Deterministic Ranking
* The AI extracts:
  * Category: `laptops`
  * Budget: `₹80,000`
  * RAM: `>= 16GB`
  * GPU: `Dedicated (CUDA/Tensor)`
* AI returns the top 3 ranked options with the **ASUS TUF Gaming A15 (AI Edition)** as the Best Match (₹74,999).
* Observe the explainability reason badge under the laptop card.

---

### Step 4: Compare Top Products
* Ask: *"Compare the top two options"* (or click **"Compare"** on the card).
* View the side-by-side specification and value matrix modal.

---

### Step 5: Select ASUS Laptop
* Click **"Select Product"** on the ASUS TUF A15 card.
* The laptop is added to your session cart.

---

### Step 6: Consent-Gated Upsell Recommendation
* The agent identifies the high-value laptop and recommends:
  > *"Since this is a high-value laptop for AI development, a 2-year protection plan covers accidental liquid damage and repairs for ₹2,499. Would you like to add it?"*
* Observe the explicit consent card with **"Accept & Add for ₹2,499"** and **"No thanks, skip"**.

---

### Step 7: Approve Upsell
* Click **"Accept & Add for ₹2,499"**.
* The cart updates server-side to **₹77,498** (Base: ₹74,999 + Warranty: ₹2,499).

---

### Step 8: Policy Engine Validation & Razorpay Checkout
* Click **"Confirm Purchase & Launch Razorpay Test Mode Checkout"**.
* The **Financial Policy Engine** validates:
  * `MAX_TRANSACTION_AMOUNT` (₹77,498 $\le$ ₹1,00,000): **PASSED**
  * `UPSELL_REQUIRES_CUSTOMER_APPROVAL`: **PASSED**
  * `PAYMENT_REQUIRES_CUSTOMER_CONFIRMATION`: **PASSED**
* The **Razorpay Checkout Modal** opens in Test Mode.

---

### Step 9: Complete Payment
* Click **"Pay ₹77,498 (Test Mode)"**.
* Backend validates HMAC-SHA256 signature, transitions order to `PAID`, deducts inventory stock, and triggers confetti celebration.

---

### Step 10: Verify Merchant Revenue Impact & Audit Trail
* Click **"View Updated Merchant Revenue Dashboard"**:
  * Total revenue increments by ₹77,498.
  * Upsell revenue reflects ₹2,499 expansion.
  * AOV uplift is updated.
* Click **"Inspect Immutable Audit Trail"** to view the audit record (`AC-XXXXX`).

---

### Step 11: Test Failure Resilience
* Click **"Payment Failure: ON"** in the top DemoBar.
* Launch a test payment and observe graceful refusal without unauthorized charges.
