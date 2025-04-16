"use client";

import {
  EloFeature,
  initializeFeature,
  updateRatings,
  updateRatingsForDraw,
} from "./elo";

// Types for feature selection
export interface FeatureSelection {
  selectedFeature: string;
  rejectedFeature: string;
  comparisonType: "impact" | "ease" | "confidence";
  timestamp: number;
}

export interface FeatureComparisonResult {
  selectedFeature: string;
  rejectedFeature: string;
  comparisonType: "impact" | "ease" | "confidence";
  isDraw: boolean;
}

// Check if code is running in browser environment
const isBrowser = typeof window !== "undefined";

// Save features to localStorage
export function saveFeaturesToStorage(features: string[]): void {
  if (!isBrowser) return;

  localStorage.setItem("featureList", JSON.stringify(features));

  // Initialize Elo ratings for new features if they don't exist
  const existingRatings = loadFeatureRatings();
  const updatedRatings: Record<string, EloFeature> = { ...existingRatings };

  features.forEach((feature) => {
    if (!updatedRatings[feature]) {
      updatedRatings[feature] = initializeFeature(feature);
    }
  });

  // Save updated ratings
  localStorage.setItem("featureRatings", JSON.stringify(updatedRatings));
}

// Load features from localStorage
export function loadFeaturesFromStorage(): string[] {
  if (!isBrowser) return [];

  const savedFeatures = localStorage.getItem("featureList");
  if (!savedFeatures) return [];

  try {
    const parsedFeatures = JSON.parse(savedFeatures);
    return Array.isArray(parsedFeatures) ? parsedFeatures : [];
  } catch (error) {
    console.error("Error parsing features from localStorage:", error);
    return [];
  }
}

// Load feature ratings
export function loadFeatureRatings(): Record<string, EloFeature> {
  if (!isBrowser) return {};

  const savedRatings = localStorage.getItem("featureRatings");
  if (!savedRatings) return {};

  try {
    return JSON.parse(savedRatings);
  } catch (error) {
    console.error("Error parsing feature ratings from localStorage:", error);
    return {};
  }
}

// Save feature comparison result and update ratings
export function saveFeatureComparison(result: FeatureComparisonResult): void {
  if (!isBrowser) return;

  // Load existing selections and ratings
  const selections = loadFeatureSelections();
  const ratings = loadFeatureRatings();

  // Increment the completed comparisons count
  const completedCount = getCompletedComparisonsCount();
  saveCompletedComparisonsCount(completedCount + 1);

  // Create new selection record
  const newSelection: FeatureSelection = {
    selectedFeature: result.selectedFeature,
    rejectedFeature: result.rejectedFeature,
    comparisonType: result.comparisonType,
    timestamp: Date.now(),
  };

  // Add to selections
  selections.push(newSelection);
  localStorage.setItem("featureSelections", JSON.stringify(selections));

  // Ensure both features exist in ratings
  if (!ratings[result.selectedFeature]) {
    ratings[result.selectedFeature] = initializeFeature(result.selectedFeature);
  }

  if (!ratings[result.rejectedFeature]) {
    ratings[result.rejectedFeature] = initializeFeature(result.rejectedFeature);
  }

  // Get current ratings for the comparison type
  const winnerRating =
    ratings[result.selectedFeature].ratings[result.comparisonType];
  const loserRating =
    ratings[result.rejectedFeature].ratings[result.comparisonType];

  // Update ratings based on result
  if (result.isDraw) {
    const { newRatingA, newRatingB } = updateRatingsForDraw(
      winnerRating,
      loserRating
    );
    ratings[result.selectedFeature].ratings[result.comparisonType] = newRatingA;
    ratings[result.rejectedFeature].ratings[result.comparisonType] = newRatingB;
  } else {
    const { newWinnerRating, newLoserRating } = updateRatings(
      winnerRating,
      loserRating
    );
    ratings[result.selectedFeature].ratings[result.comparisonType] =
      newWinnerRating;
    ratings[result.rejectedFeature].ratings[result.comparisonType] =
      newLoserRating;
  }

  // Update match counts
  ratings[result.selectedFeature].matches[result.comparisonType]++;
  ratings[result.selectedFeature].matches.total++;
  ratings[result.rejectedFeature].matches[result.comparisonType]++;
  ratings[result.rejectedFeature].matches.total++;

  // Save updated ratings
  localStorage.setItem("featureRatings", JSON.stringify(ratings));
}

// Load feature selection history
export function loadFeatureSelections(): FeatureSelection[] {
  if (!isBrowser) return [];

  const savedSelections = localStorage.getItem("featureSelections");
  if (!savedSelections) return [];

  try {
    const parsedSelections = JSON.parse(savedSelections);
    return Array.isArray(parsedSelections) ? parsedSelections : [];
  } catch (error) {
    console.error("Error parsing feature selections from localStorage:", error);
    return [];
  }
}

// Get completed comparisons count from localStorage
export function getCompletedComparisonsCount(): number {
  if (!isBrowser) return 0;

  const count = localStorage.getItem("completedComparisons");
  if (!count) return 0;

  try {
    return parseInt(count, 10);
  } catch (error) {
    console.error("Error parsing completed comparisons count:", error);
    return 0;
  }
}

// Save completed comparisons count to localStorage
export function saveCompletedComparisonsCount(count: number): void {
  if (!isBrowser) return;

  localStorage.setItem("completedComparisons", count.toString());
}

// Create all possible pairs from an array and shuffle them
export function createAllPossiblePairs<T>(items: T[]): Array<[T, T]> {
  if (items.length < 2) return [];

  const pairs: Array<[T, T]> = [];

  // Generate all possible unique pairs (n choose 2)
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]]);
    }
  }

  // Shuffle the pairs array
  return pairs.sort(() => Math.random() - 0.5);
}

// Function to create pairs (now generates all possible pairs)
// Name kept for backward compatibility, though it now creates ALL pairs in random order
export function createPairs<T>(items: T[]): Array<[T, T]> {
  return createAllPossiblePairs(items);
}

// Legacy function name, maintained for backward compatibility
// @deprecated Use createPairs instead
export function createRandomPairs<T>(items: T[]): Array<[T, T]> {
  console.warn("createRandomPairs is deprecated, use createPairs instead");
  return createPairs(items);
}

// Reset all scores and clear comparison history while keeping features
export function resetScoresAndComparisons(): boolean {
  if (!isBrowser) return false;

  try {
    // Keep the feature list intact
    const features = loadFeaturesFromStorage();

    // Reset all feature ratings to initial values
    const resetRatings: Record<string, EloFeature> = {};
    features.forEach((feature) => {
      resetRatings[feature] = initializeFeature(feature);
    });

    // Save reset ratings
    localStorage.setItem("featureRatings", JSON.stringify(resetRatings));

    // Clear selection history
    localStorage.setItem("featureSelections", JSON.stringify([]));

    // Reset completed comparisons count
    saveCompletedComparisonsCount(0);

    return true;
  } catch (error) {
    console.error("Error resetting scores and comparisons:", error);
    return false;
  }
}

// Delete a feature from storage
export function deleteFeatureFromStorage(featureName: string): boolean {
  if (!isBrowser) return false;

  try {
    // Load features list
    const features = loadFeaturesFromStorage();
    console.log("Features before deletion:", features);
    console.log("Feature to delete:", featureName);

    // Remove the feature from the list
    const updatedFeatures = features.filter((f) => f !== featureName);
    localStorage.setItem("featureList", JSON.stringify(updatedFeatures));
    console.log("Features after deletion:", updatedFeatures);

    // Load and update ratings
    const ratings = loadFeatureRatings();
    if (ratings[featureName]) {
      delete ratings[featureName];
      localStorage.setItem("featureRatings", JSON.stringify(ratings));
    }

    // Update selection history and recalculate completed comparisons
    const selections = loadFeatureSelections();
    const updatedSelections = selections.filter(
      (s) =>
        s.selectedFeature !== featureName && s.rejectedFeature !== featureName
    );
    localStorage.setItem(
      "featureSelections",
      JSON.stringify(updatedSelections)
    );

    // Update completed comparisons count based on remaining selections
    saveCompletedComparisonsCount(updatedSelections.length);

    return true;
  } catch (error) {
    console.error("Error deleting feature from storage:", error);
    return false;
  }
}
