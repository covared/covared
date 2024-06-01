import { NextRequest, NextResponse } from "next/server";

import { pool } from "@/utils/database";
import { setAccessCookies } from "@/utils/cookies";
import { getReportWriterPrompt, sendPromptToGpt } from "@/utils/gptUtils";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { student_name, class_name, competencies, topics, email, use_gpt4 } =
    data;
  const lowerCaseEmail = email.toLowerCase();

  const client = await pool.connect();
  try {
    let userResult = await client.query(
      "SELECT * FROM breezed_users WHERE email = $1",
      [lowerCaseEmail]
    );
    let user = userResult.rows[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      !user.subscribed_lifetime &&
      !user.subscribed_monthly &&
      user.api_calls >= 5
    ) {
      return NextResponse.json({
        report:
          "You have reached your limit of 5 better layouts, please subscribe",
      });
    }

    user.api_calls += 1;
    await client.query("UPDATE breezed_users SET api_calls = $1 WHERE email = $2", [
      user.api_calls,
      lowerCaseEmail,
    ]);

    const system_prompt = getReportWriterPrompt(
      student_name,
      class_name,
      topics,
      competencies
    );
    try {
      const answer = await sendPromptToGpt(system_prompt, use_gpt4);
      const res = NextResponse.json({ report: answer });
      setAccessCookies(
        res,
        email,
        user.subscribed_monthly,
        user.subscribed_lifetime
      );

      return res;
    } catch (error) {
      console.error("error generating report", error);
      return NextResponse.json({ report: "Error generating report" });
    }
  } finally {
    client.release();
  }
}
