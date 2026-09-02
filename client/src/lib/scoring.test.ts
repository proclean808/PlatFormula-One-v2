import { describe, it, expect } from "vitest";
import {
  scoreClarity,
  scoreConcision,
  scoreDifferentiation,
  scoreAnswer,
  detectWeakSlides,
  computeBPI,
  computeSAS,
  scoreICP,
  computePVI,
} from "./scoring";

// ─── scoreClarity ─────────────────────────────────────────────────────────────
describe("scoreClarity", () => {
  it("returns 1 for very short sentences", () => {
    const score = scoreClarity("Short sentence. Another one.");
    expect(score).toBeGreaterThan(0.8);
  });

  it("returns lower score for very long sentences", () => {
    const longText = "This is a very long sentence that goes on and on with many words and clauses that make it extremely difficult to parse and understand for any reader.";
    const score = scoreClarity(longText);
    expect(score).toBeLessThan(0.7);
  });

  it("returns 1 for empty string (no sentences = zero avg length = max clarity)", () => {
    expect(scoreClarity("")).toBe(1);
  });
});

// ─── scoreConcision ───────────────────────────────────────────────────────────
describe("scoreConcision", () => {
  it("returns 0 for empty string", () => {
    expect(scoreConcision("")).toBe(0);
  });

  it("penalizes text exceeding word limit", () => {
    const longText = Array(200).fill("word").join(" ");
    const score = scoreConcision(longText, 150);
    expect(score).toBeLessThan(1);
  });

  it("rewards text near 60% of word limit", () => {
    const text = Array(90).fill("word").join(" "); // 90 words, 60% of 150
    const score = scoreConcision(text, 150);
    expect(score).toBeGreaterThan(0.9);
  });
});

// ─── scoreDifferentiation ─────────────────────────────────────────────────────
describe("scoreDifferentiation", () => {
  it("rewards explicit differentiator language", () => {
    const text = "Unlike our competitors, we provide 10x faster results with 50% lower cost.";
    const score = scoreDifferentiation(text);
    expect(score).toBeGreaterThan(0.5);
  });

  it("penalizes vague verbs", () => {
    const text = "We improve and optimize and enhance and streamline processes.";
    const score = scoreDifferentiation(text);
    expect(score).toBeLessThan(0.5);
  });
});

// ─── scoreAnswer ──────────────────────────────────────────────────────────────
describe("scoreAnswer", () => {
  it("returns all four score fields", () => {
    const result = scoreAnswer("We help CTOs at Series A companies reduce infra costs by 40%.");
    expect(result).toHaveProperty("clarity");
    expect(result).toHaveProperty("concision");
    expect(result).toHaveProperty("differentiation");
    expect(result).toHaveProperty("overall");
  });

  it("all scores are between 0 and 1", () => {
    const result = scoreAnswer("Test answer with some content.");
    expect(result.clarity).toBeGreaterThanOrEqual(0);
    expect(result.clarity).toBeLessThanOrEqual(1);
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(1);
  });
});

// ─── detectWeakSlides ─────────────────────────────────────────────────────────
describe("detectWeakSlides", () => {
  it("returns no flags for empty slides", () => {
    const flags = detectWeakSlides({});
    expect(flags).toHaveLength(0);
  });

  it("flags traction slide with no numbers", () => {
    const flags = detectWeakSlides({ traction: "We have many users and great growth." });
    const tractionFlag = flags.find(f => f.slideId === "traction");
    expect(tractionFlag).toBeDefined();
    expect(tractionFlag?.severity).toBe("critical");
  });

  it("does not flag traction slide with numbers", () => {
    const flags = detectWeakSlides({ traction: "We have 500 paying customers and $50K MRR, growing 20% MoM." });
    const tractionFlag = flags.find(f => f.slideId === "traction");
    expect(tractionFlag).toBeUndefined();
  });

  it("flags problem slide that is too brief", () => {
    const flags = detectWeakSlides({ problem: "Short problem." });
    const problemFlag = flags.find(f => f.slideId === "problem");
    expect(problemFlag).toBeDefined();
  });

  it("flags market slide with no numbers", () => {
    const flags = detectWeakSlides({ market: "The market is large and growing fast." });
    const marketFlag = flags.find(f => f.slideId === "market");
    expect(marketFlag).toBeDefined();
    expect(marketFlag?.severity).toBe("critical");
  });

  it("includes slideId, rule, description on each flag", () => {
    const flags = detectWeakSlides({ traction: "We have great traction." });
    expect(flags[0]).toHaveProperty("slideId");
    expect(flags[0]).toHaveProperty("rule");
    expect(flags[0]).toHaveProperty("description");
    expect(flags[0]).toHaveProperty("severity");
  });
});

// ─── computeBPI ───────────────────────────────────────────────────────────────
describe("computeBPI", () => {
  it("returns 0 for all-zero inputs", () => {
    const bpi = computeBPI({ clarityScore: 0, differentiationScore: 0, hasTraction: false, programAlignment: 0 });
    expect(bpi).toBe(0);
  });

  it("returns higher score with traction", () => {
    const withTraction = computeBPI({ clarityScore: 0.5, differentiationScore: 0.5, hasTraction: true, programAlignment: 0.5 });
    const withoutTraction = computeBPI({ clarityScore: 0.5, differentiationScore: 0.5, hasTraction: false, programAlignment: 0.5 });
    expect(withTraction).toBeGreaterThan(withoutTraction);
  });

  it("caps at 100", () => {
    const bpi = computeBPI({ clarityScore: 1, differentiationScore: 1, hasTraction: true, programAlignment: 1 });
    expect(bpi).toBeLessThanOrEqual(100);
  });
});

// ─── computeSAS ───────────────────────────────────────────────────────────────
describe("computeSAS", () => {
  it("returns 0 for all-zero inputs", () => {
    const sas = computeSAS({ icpMatchScore: 0, marketSizeScore: 0, teamNarrativeScore: 0 });
    expect(sas).toBe(0);
  });

  it("caps at 100", () => {
    const sas = computeSAS({ icpMatchScore: 1, marketSizeScore: 1, teamNarrativeScore: 1 });
    expect(sas).toBeLessThanOrEqual(100);
  });
});

// ─── scoreICP ─────────────────────────────────────────────────────────────────
describe("scoreICP", () => {
  it("returns 100 for max inputs", () => {
    const score = scoreICP(10, 10, 10);
    expect(score).toBe(100);
  });

  it("returns 0 for zero inputs", () => {
    const score = scoreICP(0, 0, 0);
    expect(score).toBe(0);
  });

  it("returns proportional score for mid inputs", () => {
    const score = scoreICP(5, 5, 5);
    expect(score).toBe(50);
  });
});

// ─── computePVI ───────────────────────────────────────────────────────────────
describe("computePVI", () => {
  it("returns 100 for max inputs", () => {
    const pvi = computePVI(10, 10, 10);
    expect(pvi).toBe(100);
  });

  it("returns 0 for zero inputs", () => {
    const pvi = computePVI(0, 0, 0);
    expect(pvi).toBe(0);
  });

  it("weights urgency highest", () => {
    const highUrgency = computePVI(0, 10, 0);
    const highFrequency = computePVI(10, 0, 0);
    expect(highUrgency).toBeGreaterThan(highFrequency);
  });
});
