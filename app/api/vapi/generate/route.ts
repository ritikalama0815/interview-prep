import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: true, data: "VAPI SDK is ready to use" },
    { status: 200 }
  );
}