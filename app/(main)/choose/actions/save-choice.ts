'use server';

export type ComparisonType = 'impact' | 'ease' | 'confidence';

export interface ChoiceResult {
  selectedConcept: {
    id: string;
    name: string;
  };
  rejectedConcept: {
    id: string;
    name: string;
  };
  comparisonType: ComparisonType;
  isDraw: boolean;
  aiPrediction: {
    predictedConceptId: string;
    reasoning: string;
  };
  isMatch: boolean;
}

/**
 * Server action to save user choice between two features
 * 
 * In a real implementation, this would save to a database
 * Currently, the client saves this data to localStorage
 */
export async function saveChoice(
  selectedFeature: string, 
  rejectedFeature: string,
  comparisonType: ComparisonType,
  isDraw: boolean = false
): Promise<ChoiceResult> {
  try {
    // Generate a mock ID for the features
    const selectedId = createMockId(selectedFeature);
    const rejectedId = createMockId(rejectedFeature);
    
    // Randomly decide if AI would have made the same choice
    const aiChoosesSame = Math.random() > 0.5;
    
    // Create a result
    const result: ChoiceResult = {
      selectedConcept: {
        id: selectedId,
        name: selectedFeature
      },
      rejectedConcept: {
        id: rejectedId,
        name: rejectedFeature
      },
      comparisonType,
      isDraw,
      aiPrediction: {
        predictedConceptId: aiChoosesSame ? selectedId : rejectedId,
        reasoning: isDraw
          ? `Based on my analysis, I also think these features have similar ${comparisonType}.`
          : `Based on analysis of your past choices, I predicted you would favor the ${comparisonType} of ${aiChoosesSame ? selectedFeature : rejectedFeature}.`
      },
      isMatch: aiChoosesSame
    };
    
    return result;
  } catch (error) {
    console.error('Error saving choice:', error);
    throw new Error('Failed to save your choice');
  }
}

// Helper to create a deterministic ID for a feature name
function createMockId(featureName: string): string {
  const hash = Array.from(featureName)
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
    .toString(16);
    
  return `feature-${hash}`;
}
