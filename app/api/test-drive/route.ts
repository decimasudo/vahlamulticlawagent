// app/api/test-drive/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, skillName, skillDesc } = await req.json();

    const systemPrompt = `
      You are the Vahla "Auburn-01" Core Interface, a simulation layer for OpenClaw AI Agents.
      The user is testing the "${skillName}" skill.
      Skill Description: ${skillDesc}

      RULES:
      1. Respond in a cold, industrial, terminal-style tone.
      2. Use technical logs like [ANALYZING], [EXECUTING], or [SIMULATION_COMPLETE].
      3. Do not just chat; simulate what the skill would actually DO. If it's a "Web Builder", show mock HTML/CSS logs. If it's "Crypto", show mock wallet/transaction logs.
      4. If the user asks something unrelated, respond with: "PROTOCOL_ERROR: Request outside of ${skillName} functional boundaries."
      5. Keep responses concise and "machine-like".
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Efficient and fast for simulation
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json(data.choices[0].message);
  } catch (error) {
    return NextResponse.json({ error: "SIMULATION_FAILURE" }, { status: 500 });
  }
}
// EOF