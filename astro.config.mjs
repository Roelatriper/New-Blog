import { defineConfig } from "astro/config";

const [owner = "", repository = ""] = (process.env.GITHUB_REPOSITORY ?? "/").split("/");
const isUserSite = repository.toLowerCase() === `${owner}.github.io`.toLowerCase();
const site = process.env.SITE_URL ?? (owner ? `https://${owner}.github.io` : "http://localhost:4321");
const base = process.env.BASE_PATH ?? (repository && !isUserSite ? `/${repository}` : "/");

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always"
});
