import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert at writing git commit messages following the Conventional Commits specification.
Given a git diff, generate exactly 3 distinct commit message options.

Rules:
- Format: <type>(<optional scope>): <short description>
- Types: feat, fix, refactor, docs, chore, style, test, perf, ci, build
- Subject line must be ≤72 characters, all lowercase after the type prefix
- Each option must take a meaningfully different angle (different type, scope, or emphasis)
- Return ONLY a valid JSON array of 3 strings — no markdown, no explanation`;

export async function POST(req: NextRequest) {
  try {
    const { diff } = (await req.json()) as { diff: string };

    if (!diff || diff.trim().length === 0) {
      return NextResponse.json({ error: "No diff provided." }, { status: 400 });
    }

    if (diff.length > 20000) {
      return NextResponse.json(
        { error: "Diff is too large (max 20 000 characters)." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Git diff:\n\`\`\`\n${diff}\n\`\`\`\n\nReturn the JSON array now.`,
        },
      ],
    });

    const raw = message.content[0];
    if (raw.type !== "text") {
      throw new Error("Unexpected response type from API.");
    }

    // Strip any accidental markdown fences the model might add
    const cleaned = raw.text.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    const messages: string[] = JSON.parse(cleaned);

    if (!Array.isArray(messages) || messages.length !== 3) {
      throw new Error("Model returned an unexpected structure.");
    }

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[generate]", err);
    const message =
      err instanceof SyntaxError
        ? "Failed to parse AI response. Please try again."
        : (err as Error).message ?? "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
