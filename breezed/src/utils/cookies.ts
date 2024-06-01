import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";

export function setAccessCookies(
  response: NextResponse,
  email: string,
  isSubscribedMonthly: boolean,
  isSubscribedLifetime: boolean
) {
  const expiration = DateTime.now().plus({ hours: 2 }).toSeconds();
  const tokenData = {
    email,
    exp: expiration,
    isSubscribedMonthly,
    isSubscribedLifetime,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY as string, {
    algorithm: process.env.JWT_ALGORITHM as jwt.Algorithm,
  });

  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: expiration * 1000,
  });
}
