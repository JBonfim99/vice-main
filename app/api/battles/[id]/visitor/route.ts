import { NextResponse } from "next/server";
import { incrementVisitor } from "@/lib/kv";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await incrementVisitor(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing visitor:", error);
    return NextResponse.json(
      { error: "Failed to increment visitor" },
      { status: 500 }
    );
  }
}
