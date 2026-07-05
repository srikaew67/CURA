import { supabaseGetJSON } from "../clients/supabase.js";
import { writeJSON } from "../utils/http.js";
import { isOK } from "../utils/status.js";

export async function handleCompanies(req, res) {
  if (req.method !== "GET") {
    return writeJSON(res, 405, { error: "method not allowed" });
  }

  const { data, status } = await supabaseGetJSON(
    "/rest/v1/companies?select=id,name&order=name.asc",
  );
  if (!isOK(status)) {
    return writeJSON(res, 502, { error: "supabase_failed", status });
  }

  return writeJSON(res, 200, data);
}
