import { NextRequest, NextResponse } from "next/server";

import { pool } from "@/utils/database";
import { setAccessCookies } from "@/utils/cookies";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  console.log(`in check_verification_code, code=${code}, email=${email}`);

  if (!email || !code) {
    return NextResponse.json({
      success: false,
      message: "missing email or code",
    });
  }

  const lowerCaseEmail = email.toLowerCase();
  const client = await pool.connect();

  try {
    const userResult = await client.query(
      "SELECT * FROM breezed_users WHERE email = $1",
      [lowerCaseEmail]
    );
    const user = userResult.rows[0];

    if (user && code === user.email_verification_code) {
      const response = NextResponse.json({
        success: true,
        message: "code matches",
      });
      setAccessCookies(
        response,
        user.email,
        user.subscribed_monthly,
        user.subscribed_lifetime
      );

      user.logins += 1;
      await client.query("UPDATE breezed_users SET logins = $1 WHERE email = $2", [
        user.logins,
        lowerCaseEmail,
      ]);

      return response;
    } else {
      return NextResponse.json({
        success: false,
        message: "code does not match",
      });
    }
  } catch (error) {
    console.error(
      "some sort of error finding the user or setting access code",
      error
    );
    return NextResponse.json({ success: false, message: "user not found" });
  } finally {
    client.release();
  }
}
