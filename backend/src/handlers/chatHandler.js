import { buildChatReply } from "../services/chatService.js";
import { readJSON, writeJSON } from "../utils/http.js";
import { normalizeLang } from "../utils/lang.js";

export async function handleChat(req, res) {
  if (req.method !== "POST") {
    return writeJSON(res, 405, { error: "method not allowed" });
  }

  const body = await readJSON(req);
  if (!body.ok) {
    return writeJSON(res, 400, { error: "invalid json" });
  }

  const chatReq = {
    userId: String(body.value.userId ?? "").trim() || "demo",
    message: String(body.value.message ?? "").trim(),
    lang: normalizeLang(String(body.value.lang ?? "").trim()),
    previousResponseId: String(body.value.previousResponseId ?? "").trim(),
  };

  if (!chatReq.message) {
    return writeJSON(res, 400, { error: "message is required" });
  }

  try {
    const { reply, responseId } = await buildChatReply(chatReq);
    return writeJSON(res, 200, { reply, responseId });
  } catch (err) {
    console.error("openai responses error:", err);
    return writeJSON(res, 500, { error: "ai_failed" });
  }
}
