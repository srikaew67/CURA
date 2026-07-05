export async function readJSON(req) {
  try {
    const chunks = [];
    let size = 0;

    for await (const chunk of req) {
      size += chunk.length;
      if (size > 1_000_000) {
        return { ok: false };
      }
      chunks.push(chunk);
    }

    const raw = Buffer.concat(chunks).toString("utf8");
    return { ok: true, value: raw ? JSON.parse(raw) : {} };
  } catch {
    return { ok: false };
  }
}

export function writeJSON(res, status, value) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (status === 204) {
    return res.end();
  }

  return res.end(JSON.stringify(value));
}

export function setCORSHeaders(res, origin) {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
}
