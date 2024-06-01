import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ isLoggedIn: false });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      email: string;
      isSubscribedMonthly: boolean;
      isSubscribedLifetime: boolean;
    };

    return NextResponse.json({
      isLoggedIn: true,
      email: payload.email,
      isSubscribedMonthly: payload.isSubscribedMonthly,
      isSubscribedLifetime: payload.isSubscribedLifetime,
    });
  } catch (err) {
    return NextResponse.json({ isLoggedIn: false });
  }
}
