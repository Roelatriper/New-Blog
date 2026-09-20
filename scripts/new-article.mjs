import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [, , title, requestedSlug] = process.argv;

if (!title) {
  console.log('用法：npm run new:article -- "文章标题" english-slug');
  console.log('示例：npm run new:article -- "本周科创情报" weekly-tech-news');
  process.exit(1);
}

const slug = requestedSlug?.trim().toLowerCase();
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("请提供只包含小写英文字母、数字和短横线的 slug，例如 weekly-tech-news。");
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const targetDirectory = resolve("src/content/articles");
const targetFile = resolve(targetDirectory, `${slug}.md`);
const template = `---
title: "${title.replaceAll('"', '\\"')}"
description: "用一句话说明读者能从这篇文章得到什么。"
category: "科创情报"
publishedAt: ${today}
updatedAt: ${today}
readingMinutes: 5
featured: false
accent: mint
# image: "images/your-image.jpg"
imageAlt: ""
imageBlur: 10
imageBrightness: 0.62
imagePosition: "center"
draft: true
order: 100
---

## 第一个小节

从这里开始写正文。
`;

await mkdir(targetDirectory, { recursive: true });
try {
  await writeFile(targetFile, template, { encoding: "utf8", flag: "wx" });
  console.log(`已创建：${targetFile}`);
  console.log("写完后把 draft 改为 false，文章就会出现在首页。");
} catch (error) {
  if (error?.code === "EEXIST") {
    console.error(`文件已存在：${targetFile}`);
    process.exit(1);
  }
  throw error;
}
