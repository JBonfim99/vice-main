export interface Battle {
  id: string;
  title: string;
  description?: string;
  features: string[];
  votes: Record<
    string,
    {
      impact: number;
      ease: number;
      confidence: number;
      total: number;
    }
  >;
  created_at: number;
  comparison_count: number;
  total_visitors: number;
  settings: {
    compareImpact: boolean;
    compareEase: boolean;
    compareConfidence: boolean;
  };
}

export interface BattleCreation {
  title: string;
  description?: string;
  features: string[];
  settings?: {
    compareImpact?: boolean;
    compareEase?: boolean;
    compareConfidence?: boolean;
  };
}

export interface BattleVote {
  battleId: string;
  winner: string;
  loser: string;
  type: "impact" | "ease" | "confidence";
  timestamp: number;
}
