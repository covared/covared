import { initDb } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  await initDb();
  return NextResponse.json({ Message: "BD READY" });
}
