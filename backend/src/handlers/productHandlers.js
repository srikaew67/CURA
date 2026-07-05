import {
  supabaseDeleteJSON,
  supabaseGetJSON,
  supabaseInsertJSON,
  supabaseUpdateJSON,
} from "../clients/supabase.js";
import { readJSON, writeJSON } from "../utils/http.js";
import { isOK } from "../utils/status.js";

export async function handleProducts(req, res, url) {
  if (req.method === "GET") {
    const companyId = url.searchParams.get("company_id")?.trim() ?? "";
    let path =
      "/rest/v1/products?select=id,company_id,name,description,image_url&order=name.asc";
    if (companyId) {
      path += `&company_id=eq.${encodeURIComponent(companyId)}`;
    }

    const { data, status } = await supabaseGetJSON(path);
    if (!isOK(status)) {
      return writeJSON(res, 502, { error: "supabase_failed", status });
    }
    return writeJSON(res, 200, data);
  }

  if (req.method === "POST") {
    const body = await readJSON(req);
    if (!body.ok) {
      return writeJSON(res, 400, { error: "invalid json" });
    }

    const companyId = String(body.value.company_id ?? "").trim();
    const name = String(body.value.name ?? "").trim();
    if (!name || !companyId) {
      return writeJSON(res, 400, { error: "name and company_id required" });
    }

    await supabaseInsertJSON("products", {
      company_id: companyId,
      name,
      description: String(body.value.description ?? ""),
      image_url: String(body.value.image_url ?? ""),
    });
    return writeJSON(res, 201, { ok: true });
  }

  if (req.method === "PUT") {
    const productId = url.searchParams.get("id")?.trim() ?? "";
    if (!productId) {
      return writeJSON(res, 400, { error: "id is required" });
    }

    const body = await readJSON(req);
    if (!body.ok) {
      return writeJSON(res, 400, { error: "invalid json" });
    }

    await supabaseUpdateJSON("products", productId, {
      name: String(body.value.name ?? ""),
      description: String(body.value.description ?? ""),
      image_url: String(body.value.image_url ?? ""),
    });
    return writeJSON(res, 200, { ok: true });
  }

  if (req.method === "DELETE") {
    const productId = url.searchParams.get("id")?.trim() ?? "";
    if (!productId) {
      return writeJSON(res, 400, { error: "id is required" });
    }

    await supabaseDeleteJSON("products", productId);
    return writeJSON(res, 200, { ok: true });
  }

  return writeJSON(res, 405, { error: "method not allowed" });
}

export async function handleProductCatalog(req, res) {
  if (req.method !== "GET") {
    return writeJSON(res, 405, { error: "method not allowed" });
  }

  const { data, status } = await supabaseGetJSON(
    "/rest/v1/products?select=id,name,description,image_url,company_id,companies(name)&order=name.asc",
  );
  if (!isOK(status)) {
    return writeJSON(res, 502, { error: "supabase_failed", status });
  }

  return writeJSON(res, 200, data);
}
