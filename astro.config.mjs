import { defineConfig } from "astro/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const [owner = "", repository = ""] = (process.env.GITHUB_REPOSITORY ?? "/").split("/");
const isUserSite = repository.toLowerCase() === `${owner}.github.io`.toLowerCase();
const site = process.env.SITE_URL ?? (owner ? `https://${owner}.github.io` : "http://localhost:4321");
const base = process.env.BASE_PATH ?? (repository && !isUserSite ? `/${repository}` : "/");
const faviconVersion = createHash("sha256")
  .update(readFileSync(new URL("./public/favicon.svg", import.meta.url)))
  .digest("hex")
  .slice(0, 8);

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  vite: {
    define: {
      __FAVICON_VERSION__: JSON.stringify(faviconVersion),
    },
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
