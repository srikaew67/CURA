import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const files = ["server.js", ...findJSFiles("src")];

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function findJSFiles(dir) {
  const out = [];

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      out.push(...findJSFiles(path));
    } else if (entry.endsWith(".js")) {
      out.push(path);
    }
  }

  return out;
}
