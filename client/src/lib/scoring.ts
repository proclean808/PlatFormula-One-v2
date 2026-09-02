/**
 * Deterministic Scoring Engine
 * NO LLM involvement. Pure rule-based logic.
 * AI augmentation layer is separate (optimize pipeline only).
 */

// ─── Text Analysis Primitives ─────────────────────────────────────────────────

function avgSentenceLength(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  const totalWords = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0);
  return totalWords / sentences.length;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function hasNumbers(text: string): boolean {
  return /\d/.test(text);
}

function hasNamedICP(text: string): boolean {
  const icpPatterns = [
    /\b(cto|ceo|vp|director|manager|engineer|developer|founder|startup|enterprise|smb|mid-market)\b/i,
    /\b(company|companies|team|teams|organization|firm|business)\b/i,
  ];
  return icpPatterns.some(p => p.test(text));
}

function hasVagueVerbs(text: string): boolean {
  const vagueVerbs = ['improve', 'optimize', 'enhance', 'streamline', 'leverage', 'utilize', 'facilitate', 'enable', 'empower'];
  const lower = text.toLowerCase();
  return vagueVerbs.filter(v => lower.includes(v)).length >= 2;
}

function hasSpecificClaim(text: string): boolean {
  return /\d+%|\$\d+|\d+x|\d+ (customers|users|companies|clients|teams)/i.test(text);
}

function hasDifferentiator(text: string): boolean {
  return /unlike|compared to|instead of|vs\.|versus|not like|different from|only [a-z]+ that/i.test(text);
}

// ─── Answer Scoring ──────────────────────────────────────────────────────────

export function scoreClarity(text: string): number {
  const avgLen = avgSentenceLength(text);
  const score = Math.max(0, 1 - (avgLen / 40));
  return Math.round(score * 100) / 100;
}

export function scoreConcision(text: string, wordLimit: number = 150): number {
  const wc = wordCount(text);
  if (wc === 0) return 0;
  if (wc > wordLimit) return Math.max(0, 1 - ((wc - wordLimit) / wordLimit));
  return Math.min(1, wc / (wordLimit * 0.6)); // reward hitting 60%+ of limit
}

export function scoreDifferentiation(text: string): number {
  let score = 0;
  if (hasDifferentiator(text)) score += 0.4;
  if (hasSpecificClaim(text)) score += 0.35;
  if (!hasVagueVerbs(text)) score += 0.25;
  return Math.round(score * 100) / 100;
}

export function scoreAnswer(text: string, wordLimit = 150): {
  clarity: number;
  concision: number;
  differentiation: number;
  overall: number;
} {
  const clarity = scoreClarity(text);
  const concision = scoreConcision(text, wordLimit);
  const differentiation = scoreDifferentiation(text);
  const overall = Math.round(((clarity * 0.35) + (concision * 0.25) + (differentiation * 0.4)) * 100) / 100;
  return { clarity, concision, differentiation, overall };
}

// ─── Weak Slide Detector ─────────────────────────────────────────────────────

export interface SlideFlag {
  slideId: string;
  slide: string;
  rule: string;
  issue: string;
  description: string;
  suggestion?: string;
  severity: 'critical' | 'warning' | 'info';
  type?: 'content' | 'narrative';
}

export function detectWeakSlides(slides: Record<string, string>): SlideFlag[] {
  const flags: SlideFlag[] = [];

  const problem = slides['problem'] || '';
  if (problem.length > 0 && problem.length < 120) {
    flags.push({ slideId: 'problem', slide: 'Problem', rule: 'Minimum length', issue: 'Too brief', description: 'Problem slide is too brief — add specific pain point with context, frequency, and cost.', suggestion: 'Add: who suffers, how often, what it costs them.', severity: 'critical', type: 'content' });
  }
  if (problem.length > 0 && !problem.toLowerCase().includes('specific') && !hasSpecificClaim(problem)) {
    flags.push({ slideId: 'problem', slide: 'Problem', rule: 'Specificity', issue: 'No specific evidence', description: 'No specific evidence or data — add a stat, named scenario, or customer quote.', suggestion: 'Include a number: "X% of [ICP] lose $Y per month to this problem."', severity: 'critical', type: 'content' });
  }

  const traction = slides['traction'] || '';
  if (traction.length > 0 && !hasNumbers(traction)) {
    flags.push({ slideId: 'traction', slide: 'Traction', rule: 'Numbers required', issue: 'No metrics', description: 'Traction slide has no numbers — add MRR, users, growth %, or LOIs.', suggestion: 'Add: "$X MRR, Y paying customers, Z% MoM growth."', severity: 'critical', type: 'content' });
  }

  const market = slides['market'] || '';
  if (market.length > 0 && !hasNumbers(market)) {
    flags.push({ slideId: 'market', slide: 'Market', rule: 'Market size evidence', issue: 'Generic market size', description: 'Generic market size — add TAM/SAM/SOM with a credible source.', suggestion: 'Add: "$XB TAM (source), $YM SAM for [ICP]."', severity: 'critical', type: 'content' });
  }
  if (market.length > 0 && !hasNamedICP(market)) {
    flags.push({ slideId: 'market', slide: 'Market', rule: 'Named ICP', issue: 'No named ICP', description: 'No named ICP — specify who exactly you are targeting.', suggestion: 'Name a role: "CTOs at Series A–B SaaS companies."', severity: 'warning', type: 'content' });
  }

  const solution = slides['solution'] || '';
  if (solution.length > 0 && hasVagueVerbs(solution)) {
    flags.push({ slideId: 'solution', slide: 'Solution', rule: 'Vague language', issue: 'Vague verbs', description: 'Vague verbs detected (improve/optimize/enhance) — be specific about mechanism.', suggestion: 'Replace "improve" with the exact action: "reduces X by Y% via Z mechanism."', severity: 'warning', type: 'content' });
  }

  const competition = slides['competition'] || '';
  if (competition.length > 0 && !hasDifferentiator(competition)) {
    flags.push({ slideId: 'competition', slide: 'Competition', rule: 'Differentiation statement', issue: 'No differentiator', description: 'No clear differentiator — add an "unlike X, we do Y" statement.', suggestion: 'Add: "Unlike [competitor], we [specific advantage]."', severity: 'critical', type: 'content' });
  }

  // Narrative consistency
  if (problem.length > 50 && solution.length > 50) {
    const problemWords = new Set(problem.toLowerCase().split(/\s+/).filter(w => w.length > 4));
    const solutionWords = new Set(solution.toLowerCase().split(/\s+/).filter(w => w.length > 4));
    const overlap = Array.from(problemWords).filter(w => solutionWords.has(w));
    if (overlap.length < 2) {
      flags.push({ slideId: 'solution', slide: 'Solution', rule: 'Narrative alignment', issue: 'Problem-solution gap', description: 'Problem and Solution share few common concepts — ensure solution directly addresses stated problem.', suggestion: 'Mirror key terms from your Problem slide in your Solution.', severity: 'warning', type: 'narrative' });
    }
  }

  return flags;
}

// ─── Narrative Consistency Check ─────────────────────────────────────────────

export interface ConsistencyIssue {
  type: 'contradiction' | 'gap' | 'misalignment';
  description: string;
}

export function checkNarrativeConsistency(slides: Record<string, string>): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];
  const problem = slides['problem'] || '';
  const solution = slides['solution'] || '';
  const market = slides['market'] || '';

  // Check problem → solution alignment
  const problemWords = new Set(problem.toLowerCase().split(/\s+/).filter(w => w.length > 4));
  const solutionWords = new Set(solution.toLowerCase().split(/\s+/).filter(w => w.length > 4));
  const overlap = Array.from(problemWords).filter(w => solutionWords.has(w));
  if (overlap.length < 2 && problem.length > 50 && solution.length > 50) {
    issues.push({ type: 'misalignment', description: 'Problem and Solution share few common concepts — ensure solution directly addresses stated problem' });
  }

  // Check market → solution alignment
  if (market.length > 50 && solution.length > 50) {
    const marketWords = new Set(market.toLowerCase().split(/\s+/).filter(w => w.length > 4));
    const solMarketOverlap = Array.from(marketWords).filter(w => solutionWords.has(w));
    if (solMarketOverlap.length < 1) {
      issues.push({ type: 'gap', description: 'Market slide and Solution slide appear disconnected — ensure target customer is consistent' });
    }
  }

  return issues;
}

// ─── BPI: Bullseye Probability Index ─────────────────────────────────────────

export function computeBPI(params: {
  clarityScore: number;
  differentiationScore: number;
  hasTraction: boolean;
  programAlignment: number; // 0–1
}): number {
  const { clarityScore, differentiationScore, hasTraction, programAlignment } = params;
  const tractionBonus = hasTraction ? 0.2 : 0;
  const raw = (clarityScore * 0.25) + (differentiationScore * 0.3) + tractionBonus + (programAlignment * 0.25);
  return Math.round(Math.min(100, raw * 100));
}

// ─── SAS: Strategic Alignment Score ──────────────────────────────────────────

export function computeSAS(params: {
  icpMatchScore: number;    // 0–1: how well ICP matches program thesis
  marketSizeScore: number;  // 0–1: based on TAM indicators
  teamNarrativeScore: number; // 0–1: consistency of team story
}): number {
  const { icpMatchScore, marketSizeScore, teamNarrativeScore } = params;
  const raw = (icpMatchScore * 0.4) + (marketSizeScore * 0.35) + (teamNarrativeScore * 0.25);
  return Math.round(Math.min(100, raw * 100));
}

// ─── ICP Scoring ─────────────────────────────────────────────────────────────

export function scoreICP(painIntensity: number, willingnessToPay: number, accessibility: number): number {
  return Math.round(((painIntensity + willingnessToPay + accessibility) / 30) * 100);
}

// ─── Problem Validation Index ─────────────────────────────────────────────────

export function computePVI(frequency: number, urgency: number, existingSpend: number): number {
  return Math.round(((frequency * 0.3) + (urgency * 0.4) + (existingSpend * 0.3)) / 10 * 100);
}
