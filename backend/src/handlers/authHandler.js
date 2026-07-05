import { supabaseGetJSON } from "../clients/supabase.js";
import { readJSON, writeJSON } from "../utils/http.js";
import { isOK } from "../utils/status.js";

export async function handleLogin(req, res) {
  if (req.method !== "POST") {
    return writeJSON(res, 405, { error: "method not allowed" });
  }

  const body = await readJSON(req);
  if (!body.ok) {
    return writeJSON(res, 400, { error: "invalid json" });
  }

  const username = String(body.value.username ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.value.password ?? "")
    .trim()
    .toLowerCase();

  if (!username || !password) {
    return writeJSON(res, 400, { error: "username and password required" });
  }
  if (username !== password) {
    return writeJSON(res, 401, { error: "invalid credentials" });
  }

  const path = `/rest/v1/companies?select=id,name&name=ilike.${encodeURIComponent(username)}&limit=1`;
  const { data, status } = await supabaseGetJSON(path);
  if (!isOK(status)) {
    return writeJSON(res, 500, { error: "db_failed" });
  }

  if (!Array.isArray(data) || data.length === 0) {
    return writeJSON(res, 401, { error: "invalid credentials" });
  }

  return writeJSON(res, 200, {
    ok: true,
    company_id: data[0].id,
    company: data[0].name,
  });
}
