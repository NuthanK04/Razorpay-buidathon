import { describe, it, expect } from 'vitest';
import { IntentExtractor } from '../ai/intentExtractor.js';

describe('IntentExtractor Test Suite', () => {
  it('extracts structured requirements for AI laptop under 80000', () => {
    const query = 'I need a laptop for AI development under ₹80,000 with at least 16GB RAM and a dedicated GPU.';
    const intent = IntentExtractor.extractIntent(query);

    expect(intent.category).toBe('laptops');
    expect(intent.budget_max).toBe(80000);
    expect(intent.ram_min).toBe(16);
    expect(intent.gpu_required).toBe(true);
    expect(intent.purpose).toBe('AI development');
    expect(intent.priority).toBe('performance_value');
    expect(intent.is_clarification_needed).toBe(false);
  });

  it('detects underspecified queries and requests polite clarification', () => {
    const query = 'I need a good laptop.';
    const intent = IntentExtractor.extractIntent(query);

    expect(intent.is_clarification_needed).toBe(true);
    expect(intent.clarification_question).toBeDefined();
  });
});
