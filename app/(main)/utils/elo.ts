'use client';

// Define constants for Elo calculation
const DEFAULT_K_FACTOR = 32; // K-factor determines how much ratings change after each comparison
const DEFAULT_INITIAL_RATING = 1400; // Starting rating for new features

export interface EloRating {
  impact: number;
  ease: number;
  confidence: number;
}

export interface EloFeature {
  name: string;
  ratings: EloRating;
  matches: {
    impact: number;
    ease: number;
    confidence: number;
    total: number;
  };
}

// Initialize a new feature with default ratings
export function initializeFeature(name: string): EloFeature {
  return {
    name,
    ratings: {
      impact: DEFAULT_INITIAL_RATING,
      ease: DEFAULT_INITIAL_RATING,
      confidence: DEFAULT_INITIAL_RATING
    },
    matches: {
      impact: 0,
      ease: 0,
      confidence: 0,
      total: 0
    }
  };
}

// Calculate expected outcome based on current ratings
export function calculateExpectedOutcome(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

// Update ratings after a match
export function updateRatings(
  winnerRating: number, 
  loserRating: number, 
  kFactor: number = DEFAULT_K_FACTOR
): { newWinnerRating: number; newLoserRating: number } {
  const expectedWinnerOutcome = calculateExpectedOutcome(winnerRating, loserRating);
  const expectedLoserOutcome = calculateExpectedOutcome(loserRating, winnerRating);
  
  // Winner gets a "1" for winning, loser gets a "0"
  const newWinnerRating = Math.round(winnerRating + kFactor * (1 - expectedWinnerOutcome));
  const newLoserRating = Math.round(loserRating + kFactor * (0 - expectedLoserOutcome));
  
  return { newWinnerRating, newLoserRating };
}

// Update ratings for a draw
export function updateRatingsForDraw(
  ratingA: number, 
  ratingB: number, 
  kFactor: number = DEFAULT_K_FACTOR
): { newRatingA: number; newRatingB: number } {
  const expectedOutcomeA = calculateExpectedOutcome(ratingA, ratingB);
  const expectedOutcomeB = calculateExpectedOutcome(ratingB, ratingA);
  
  // Both get a "0.5" for a draw
  const newRatingA = Math.round(ratingA + kFactor * (0.5 - expectedOutcomeA));
  const newRatingB = Math.round(ratingB + kFactor * (0.5 - expectedOutcomeB));
  
  return { newRatingA, newRatingB };
}

// Calculate VICE score from Elo ratings
export function calculateViceScore(feature: EloFeature): number {
  // Normalize each rating to a 0-100 scale (assuming ratings typically range from 1000-2000)
  const normalizeRating = (rating: number) => {
    const min = 1000;
    const max = 2000;
    return Math.min(100, Math.max(0, ((rating - min) / (max - min)) * 100));
  };
  
  const impactScore = normalizeRating(feature.ratings.impact);
  const easeScore = normalizeRating(feature.ratings.ease);
  const confidenceScore = normalizeRating(feature.ratings.confidence);
  
  // VICE score is the product of normalized impact, confidence, and ease scores
  // Take the cube root to keep it on a 0-100 scale
  return Math.round(Math.pow(impactScore * easeScore * confidenceScore, 1/3));
}
