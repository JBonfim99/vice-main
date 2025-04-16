'use server';

export interface FeatureWithScore {
  name: string;
  viceScore: number;
  impactScore: number;
  easeScore: number;
  confidenceScore: number;
  impactRating: number;
  easeRating: number;
  confidenceRating: number;
  totalMatches: number;
}

/**
 * Calculates the vice scores for features based on user selections
 * This is a server action but in this implementation, the scores are actually
 * computed client-side using localStorage data. In a real implementation,
 * this would query a database to get the selection history.
 */
export async function getFeatureLeaderboard(): Promise<FeatureWithScore[]> {
  try {
    // In a real implementation, this would fetch data from a database
    // and calculate scores server-side
    
    // Here we're just returning an empty array as we're calculating 
    // scores on the client using localStorage
    return [];
  } catch (error) {
    console.error('Error getting feature leaderboard:', error);
    throw new Error('Failed to load feature leaderboard.');
  }
}
