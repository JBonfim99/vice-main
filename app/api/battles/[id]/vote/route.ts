import { NextResponse } from "next/server";
import { recordVote } from "@/lib/kv";
import { BattleVote } from "@/types/battle";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const voteData = await req.json();

    // Validações básicas
    if (!voteData.winner || !voteData.loser || !voteData.type) {
      return NextResponse.json(
        { error: "Winner, loser and type are required" },
        { status: 400 }
      );
    }

    const vote: BattleVote = {
      battleId: params.id,
      winner: voteData.winner,
      loser: voteData.loser,
      type: voteData.type,
      timestamp: Date.now(),
    };

    await recordVote(vote);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}
