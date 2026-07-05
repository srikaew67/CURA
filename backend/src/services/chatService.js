import { callOpenAIResponses } from "../clients/openai.js";
import { supabaseGetJSON, supabaseInsertJSON } from "../clients/supabase.js";
import { detectLangFromText } from "../utils/lang.js";
import { isOK } from "../utils/status.js";

export async function buildChatReply(chatReq) {
  const lang = detectLangFromText(chatReq.message);
  let langRule = lang === "th" ? "Answer in Thai." : "Answer in English.";
  langRule += " Reply strictly in that language.";

  const productContext = await getProductContext();

  let systemPrompt = `You are a helpful customer service AI agent.
UserId: ${chatReq.userId}
${langRule} Keep responses concise and helpful.
If the user asks about a product, answer based on the product catalog below.`;

  if (productContext) {
    systemPrompt += `\n\n${productContext}`;
  }

  let previousResponseId = chatReq.previousResponseId;
  if (!previousResponseId) {
    previousResponseId = await fetchLatestResponseID(chatReq.userId, lang);
    if (previousResponseId) {
      console.log(
        `[chat] using DB previous_response_id=${previousResponseId} for user=${chatReq.userId}`,
      );
    }
  } else {
    console.log(
      `[chat] using client previous_response_id=${previousResponseId}`,
    );
  }

  const result = await callOpenAIResponses(
    systemPrompt,
    previousResponseId,
    chatReq.message,
  );

  supabaseInsertJSON("chat_histories", {
    user_id: chatReq.userId,
    question: chatReq.message,
    answer: result.reply,
    lang,
    openai_response_id: result.responseId,
  }).catch((err) => console.error("Failed to save chat history:", err));

  return result;
}

async function getProductContext() {
  try {
    const { data, status } = await supabaseGetJSON(
      "/rest/v1/products?select=name,description,companies(name)&order=name.asc",
    );
    if (!isOK(status) || !Array.isArray(data) || data.length === 0) {
      return "";
    }

    const lines = ["Product Catalog:"];
    for (const product of data) {
      lines.push(
        `- ${product.name} (by ${product.companies?.name ?? ""}): ${product.description ?? ""}`,
      );
    }
    console.log(`[chat] injected ${data.length} products into context`);
    return lines.join("\n");
  } catch {
    return "";
  }
}

async function fetchLatestResponseID(userId, lang) {
  if (!userId) {
    return "";
  }

  const sessionStart = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const path = `/rest/v1/chat_histories?select=openai_response_id&user_id=eq.${encodeURIComponent(userId)}&lang=eq.${encodeURIComponent(lang)}&created_at=gte.${encodeURIComponent(sessionStart)}&openai_response_id=not.is.null&order=created_at.desc&limit=1`;
  const { data, status } = await supabaseGetJSON(path);

  if (!isOK(status) || !Array.isArray(data) || data.length === 0) {
    return "";
  }

  return data[0].openai_response_id ?? "";
}
