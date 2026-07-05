import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createApp } from "./src/app.js";
import { env, loadEnv } from "./src/config/env.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load from the single root .env (one directory above backend/)
loadEnv(join(__dirname, "..", ".env"));

const port = env("PORT", "8080");
const server = createServer(createApp({ port }));

server.listen(Number(port), () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
