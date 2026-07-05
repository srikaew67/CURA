import { env } from "../config/env.js";

export async function callOpenAIResponses(
  systemPrompt,
  previousResponseId,
  userMessage,
) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is empty");
  }

  const payload = {
    model: env("OPENAI_MODEL", "gpt-4.1-mini"),
    input: [{ role: "user", content: userMessage }],
    instructions: systemPrompt,
    temperature: 0.7,
    max_output_tokens: 512,
  };

  if (previousResponseId) {
    payload.previous_response_id = previousResponseId;
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60_000),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`openai responses status=${res.status} body=${raw}`);
  }

  const parsed = JSON.parse(raw);
  for (const output of parsed.output ?? []) {
    if (output.type === "message") {
      for (const content of output.content ?? []) {
        if (content.type === "output_text") {
          return {
            reply: String(content.text ?? "").trim(),
            responseId: parsed.id ?? "",
          };
        }
      }
    }
  }

  throw new Error("no output_text in responses API response");
}
