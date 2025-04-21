import { NextRequest, NextResponse } from "next/server";
import { updateBattle, deleteBattle } from "@/lib/kv";
import { BattleCreation } from "@/types/battle";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const battleData: BattleCreation = await request.json();

    // Validações básicas
    if (!battleData.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!battleData.features || battleData.features.length < 2) {
      return NextResponse.json(
        { error: "At least 2 features are required" },
        { status: 400 }
      );
    }

    const battle = await updateBattle(params.id, battleData);
    return NextResponse.json(battle);
  } catch (error) {
    console.error("Error updating battle:", error);
    return NextResponse.json(
      { error: "Failed to update battle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteBattle(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting battle:", error);
    return NextResponse.json(
      { error: "Failed to delete battle" },
      { status: 500 }
    );
  }
}
