import { getCollection } from "astro:content";
import guide from "./articles/cpp-environment/index.astro?raw";
import chooser from "../components/EnvironmentChooser.astro?raw";

export const prerender = true;
const plain = (text: string) => text
  .replace(/^---[\s\S]*?---/, "")
  .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
  .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
  .replace(/[#*_`|]/g, " ")
  .replace(/\s+/g, " ").trim();
export async function GET() {
  const base = import.meta.env.BASE_URL;
  const articles = await getCollection("articles", ({ data }) => !data.draft);
  const entries = articles.map(({ id, data, body }) => ({
    title: data.title, description: data.description, category: data.category,
    url: `${base}articles/${id}/`, text: plain(body ?? ""),
  }));
  entries.unshift({ title: "Windows 下的 C++ 环境怎么选？", description: "从选择路线、安装配置到 A+B 验收。", category: "配置指南", url: `${base}articles/cpp-environment/`, text: plain(`${guide}\n${chooser}`) });
  return new Response(JSON.stringify(entries), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
