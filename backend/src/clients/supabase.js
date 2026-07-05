import { env } from "../config/env.js";

export function supabaseGetJSON(pathWithQuery) {
  return supabaseFetchJSON(pathWithQuery, { method: "GET", timeoutMs: 20_000 });
}

export function supabaseInsertJSON(table, data) {
  return supabaseWriteJSON(
    "POST",
    `/rest/v1/${table}`,
    data,
    "supabase insert failed",
  );
}

export function supabaseUpdateJSON(table, id, data) {
  return supabaseWriteJSON(
    "PATCH",
    `/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
    data,
    "supabase update failed",
  );
}

export function supabaseDeleteJSON(table, id) {
  return supabaseWriteJSON(
    "DELETE",
    `/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
    undefined,
    "supabase delete failed",
  );
}

export async function supabaseFetchJSON(pathWithQuery, options) {
  const base = supabaseURL();
  const key = supabaseKey();
  if (!base || !key) {
    throw new Error("SUPABASE_URL or SUPABASE_KEY is empty");
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.prefer) {
    headers.Prefer = options.prefer;
  }

  const res = await fetch(`${base}${pathWithQuery}`, {
    method: options.method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(options.timeoutMs),
  });

  const raw = await res.text();
  let data = raw;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  return { data, status: res.status };
}

async function supabaseWriteJSON(method, path, data, message) {
  const { status } = await supabaseFetchJSON(path, {
    method,
    body: data,
    prefer: "return=minimal",
    timeoutMs: 10_000,
  });

  if (status >= 300) {
    throw new Error(`${message}: status ${status}`);
  }
}

function supabaseURL() {
  return env("SUPABASE_URL", "").replace(/\/+$/, "");
}

function supabaseKey() {
  const anon = process.env.SUPABASE_ANON_KEY?.trim() ?? "";
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || anon;
}
