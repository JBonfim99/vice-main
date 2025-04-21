import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const battleData = await request.json();

  if (
    !battleData.title ||
    !battleData.features ||
    battleData.features.length < 2
  ) {
    return NextResponse.json({ error: "Invalid battle data" }, { status: 400 });
  }

  const battle = await prisma.battle.update({
    where: { id: params.id },
    data: battleData,
  });

  return NextResponse.json(battle);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const battle = await prisma.battle.delete({
    where: { id: params.id },
  });

  return NextResponse.json(battle);
}
