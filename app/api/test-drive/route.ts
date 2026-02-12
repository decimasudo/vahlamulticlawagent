// app/api/test-drive/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, skillName, skillDesc } = await req.json();

    const systemPrompt = `
      You are "Auburn-01", the tactical neural interface for Vahla MultiClaw.
      Current Task: Simulate the "${skillName}" skill.
      Context: ${skillDesc}

      OPERATIONAL PROTOCOL:
      1. Tone: Cold, industrial, and machine-like.
      2. If the user asks for "SHOW_CAPABILITIES", you MUST list at least 3 high-agency things this specific skill can do based on its description.
      3. If the user asks to "SIMULATE_RUN", provide a detailed mock-log of the execution process.
      4. If the user asks for "SECURITY_AUDIT", perform a comprehensive security audit simulation, checking for potential vulnerabilities, compliance with ClawSec protocols, and security measures in place.
      5. Never say "outside functional boundaries" for commands related to the skill's purpose. 
      6. Use [ANALYZING], [EXECUTING], and [COMPLETE] tags.

      STRICT: Be creative but stay within the technical realm of "${skillName}".
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json(data.choices[0].message);
  } catch (error) {
    return NextResponse.json({ role: "assistant", content: "CRITICAL_ERROR" }, { status: 500 });
  }
}
// EOF