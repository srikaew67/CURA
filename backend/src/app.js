import { env } from "./config/env.js";
import { handleLogin } from "./handlers/authHandler.js";
import { handleChat } from "./handlers/chatHandler.js";
import { handleCompanies } from "./handlers/companyHandlers.js";
import {
  handleProductCatalog,
  handleProducts,
} from "./handlers/productHandlers.js";
import { setCORSHeaders, writeJSON } from "./utils/http.js";

export function createApp({ port }) {
  const frontendOrigin = env("FRONTEND_ORIGIN", "http://localhost:5173");

  return async function app(req, res) {
    setCORSHeaders(res, frontendOrigin);

    if (req.method === "OPTIONS") {
      return writeJSON(res, 204, null);
    }

    const url = new URL(
      req.url ?? "/",
      `http://${req.headers.host ?? `localhost:${port}`}`,
    );

    try {
      if (url.pathname === "/health" && req.method === "GET") {
        return writeJSON(res, 200, {
          ok: true,
          port,
          time: new Date().toISOString(),
        });
      }

      if (url.pathname === "/api/chat") {
        return handleChat(req, res);
      }

      if (url.pathname === "/api/auth/login") {
        return handleLogin(req, res);
      }

      if (url.pathname === "/api/companies") {
        return handleCompanies(req, res);
      }

      if (url.pathname === "/api/products/catalog") {
        return handleProductCatalog(req, res);
      }

      if (url.pathname === "/api/products") {
        return handleProducts(req, res, url);
      }

      return writeJSON(res, 404, { error: "not_found" });
    } catch (err) {
      console.error("unhandled error:", err);
      return writeJSON(res, 500, { error: "internal_error" });
    }
  };
}
