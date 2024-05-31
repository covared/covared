import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("access_token", "", { maxAge: -1 });
  return response;
}
