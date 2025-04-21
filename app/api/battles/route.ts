import { NextResponse } from "next/server";
import { createBattle, getBattle } from "@/lib/kv";
import { BattleCreation } from "@/types/battle";

export async function POST(req: Request) {
  try {
    const battleData: BattleCreation = await req.json();

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

    const battle = await createBattle(battleData);
    return NextResponse.json(battle);
  } catch (error) {
    console.error("Error creating battle:", error);
    return NextResponse.json(
      { error: "Failed to create battle" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Battle ID is required" },
        { status: 400 }
      );
    }

    const battle = await getBattle(id);

    if (!battle) {
      return NextResponse.json({ error: "Battle not found" }, { status: 404 });
    }

    return NextResponse.json(battle);
  } catch (error) {
    console.error("Error fetching battle:", error);
    return NextResponse.json(
      { error: "Failed to fetch battle" },
      { status: 500 }
    );
  }
}
