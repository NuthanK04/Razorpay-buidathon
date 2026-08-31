import { StructuredIntent } from '../types/index.js';

export class IntentExtractor {
  /**
   * Parse natural language customer shopping query into structured requirements
   */
  public static extractIntent(query: string): StructuredIntent {
    const q = query.toLowerCase().trim();
    const intent: StructuredIntent = {
      raw_query: query,
      is_clarification_needed: false,
    };

    // 1. Detect Category
    if (q.includes('laptop') || q.includes('notebook') || q.includes('macbook')) {
      intent.category = 'laptops';
    } else if (q.includes('monitor') || q.includes('screen') || q.includes('display')) {
      intent.category = 'monitors';
    } else if (q.includes('phone') || q.includes('mobile') || q.includes('smartphone')) {
      intent.category = 'smartphones';
    } else if (q.includes('headphone') || q.includes('earbuds') || q.includes('audio')) {
      intent.category = 'headphones';
    } else if (q.includes('keyboard')) {
      intent.category = 'keyboards';
    } else if (q.includes('mouse')) {
      intent.category = 'mice';
    } else if (q.includes('warranty') || q.includes('protection plan')) {
      intent.category = 'warranty';
    } else if (q.includes('accessory') || q.includes('charger') || q.includes('hub')) {
      intent.category = 'accessories';
    }

    // 2. Detect Maximum Budget (e.g. "under 80000", "under ₹80,000", "below 80k", "budget 75,000")
    const budgetMatch =
      q.match(/(?:under|below|budget|within|max|less than|up to)\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)\s*(k|lakh|lac)?/i) ||
      q.match(/(?:rs\.?|inr|₹)\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)\s*(k|lakh|lac)?/i);

    if (budgetMatch) {
      const numStr = budgetMatch[1].replace(/,/g, '');
      let multiplier = 1;
      const unit = (budgetMatch[2] || '').toLowerCase();
      if (unit === 'k') multiplier = 1000;
      if (unit === 'lakh' || unit === 'lac') multiplier = 100000;

      const parsedNum = parseFloat(numStr) * multiplier;
      if (!isNaN(parsedNum) && parsedNum > 0) {
        intent.budget_max = parsedNum;
      }
    }

    // 3. Detect RAM requirement (e.g. "16GB RAM", "at least 16gb", "32 gb")
    const ramMatch = q.match(/([0-9]+)\s*(?:gb|gig|gigs)?\s*(?:of\s*)?ram/i) || q.match(/ram\s*(?:of|at least|>=|:)?\s*([0-9]+)\s*gb/i);
    if (ramMatch) {
      intent.ram_min = parseInt(ramMatch[1], 10);
    } else if (q.includes('16gb') || q.includes('16 gb')) {
      intent.ram_min = 16;
    } else if (q.includes('32gb') || q.includes('32 gb')) {
      intent.ram_min = 32;
    } else if (q.includes('8gb') || q.includes('8 gb')) {
      intent.ram_min = 8;
    }

    // 4. Detect GPU requirement
    if (
      q.includes('dedicated gpu') ||
      q.includes('gpu') ||
      q.includes('rtx') ||
      q.includes('gtx') ||
      q.includes('graphic') ||
      q.includes('nvidia') ||
      q.includes('radeon')
    ) {
      intent.gpu_required = true;
    }

    // 5. Detect Purpose / Workload
    if (q.includes('ai') || q.includes('deep learning') || q.includes('machine learning') || q.includes('llm')) {
      intent.purpose = 'AI development';
      intent.priority = 'performance_value';
      if (!intent.gpu_required) intent.gpu_required = true;
      if (!intent.ram_min) intent.ram_min = 16;
    } else if (q.includes('gaming') || q.includes('game')) {
      intent.purpose = 'Gaming';
      intent.priority = 'performance_value';
      if (!intent.gpu_required) intent.gpu_required = true;
    } else if (q.includes('coding') || q.includes('programming') || q.includes('software')) {
      intent.purpose = 'Software Development';
      intent.priority = 'performance_value';
    } else if (q.includes('video editing') || q.includes('content creation') || q.includes('rendering')) {
      intent.purpose = 'Content Creation';
      intent.priority = 'performance_value';
      intent.gpu_required = true;
    } else if (q.includes('student') || q.includes('office') || q.includes('study')) {
      intent.purpose = 'General & Productivity';
      intent.priority = 'budget_first';
    }

    // 6. Handle Underspecified Requests
    const wordCount = q.split(/\s+/).length;
    if (!intent.category && !intent.budget_max && !intent.purpose && wordCount <= 6) {
      intent.is_clarification_needed = true;
      intent.clarification_question = 'Could you specify your preferred device category, maximum budget, and primary use case?';
    } else if (intent.category && !intent.budget_max && !intent.purpose && !intent.ram_min && !intent.gpu_required && wordCount <= 6) {
      intent.is_clarification_needed = true;
      intent.clarification_question = `What is your maximum budget and primary use case for the ${intent.category}?`;
    }

    return intent;
  }
}
