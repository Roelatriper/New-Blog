一个使用 Astro 构建的静态个人博客。首页自动读取文章并以瀑布卡片展示；C++ 环境配置总指南包含交互式路线推荐、学习进度和完成反馈。

## 第一次运行

准备 Node.js 22 或 24，然后在本目录执行：

```powershell
npm install
npm run dev
```

浏览器访问终端显示的地址，通常是 `http://localhost:4321/`。

停止预览时，在终端按 `Ctrl + C`。

## 常用命令

```powershell
# 本地编辑与实时预览
npm run dev

# 检查内容与代码，然后生成正式网站
npm run build

# 在本地查看生成后的正式版本
npm run preview

# 创建一篇新文章草稿
npm run new:article -- "文章标题" english-slug
```

## 最常改的地方

| 想修改什么 | 文件位置 |
| --- | --- |
| 首页自我介绍和“三份承诺” | `src/pages/index.astro` |
| 网站名称、导航栏 | `src/components/Header.astro` |
| 全站颜色、字号、卡片和暗色模式 | `src/styles/global.css` |
| C++ 环境推荐与总流程 | `src/pages/articles/cpp-environment/index.astro` |
| 推荐问题和判断结果 | `src/components/EnvironmentChooser.astro` |
| 各条详细教程 | `src/content/articles/*.md` |
| 页脚文字、页面标题规则 | `src/layouts/BaseLayout.astro` |
| 左上角和浏览器页签图标 | `public/favicon.svg` |

## 添加文章

推荐使用命令创建：

```powershell
npm run new:article -- "本周科创情报" weekly-tech-news
```

它会创建 `src/content/articles/weekly-tech-news.md`。文件顶部是文章信息：

```yaml
---
title: "本周科创情报"
description: "首页卡片和搜索摘要中显示的一句话。"
category: "科创情报"
publishedAt: 2026-09-20
updatedAt: 2026-09-20
readingMinutes: 5
featured: false
accent: mint
image: "images/weekly-tech-news.jpg"
imageAlt: "实验室桌面上的电脑与开发板"
imageBlur: 10
imageBrightness: 0.62
imagePosition: "center"
draft: true
order: 100
---
```

- `category` 只能使用：`配置指南`、`基础原理`、`科创情报`、`协作文档`。
- `accent` 只能使用：`mint`、`violet`、`pink`、`ink`。
- `image` 是首页卡片图片，图片应放在 `public/images`，这里填写 `images/文件名`。
- `imageBlur` 是高斯模糊半径，范围为 `0` 到 `32`，单位为像素。
- `imageBrightness` 控制图片亮度，范围为 `0.2` 到 `1.2`，推荐从 `0.45` 到 `0.75` 调整。
- `imagePosition` 控制图片焦点，可写 `center`、`left center` 或 `50% 30%`。
- `featured: true` 会放大卡片头图区域，适合置顶文章。
- `draft: true` 不会生成页面，也不会出现在首页。写完改为 `false`。
- `order` 数字越小，首页位置越靠前。
- 文件名就是网址。`weekly-tech-news.md` 对应 `/articles/weekly-tech-news/`。

正文使用 Markdown。二级标题 `##` 和三级标题 `###` 会自动出现在文章目录里。

## 为首页卡片添加图片

1. 在项目的 `public` 目录中新建 `images` 文件夹。
2. 把图片放进去，例如 `public/images/cpp-cover.webp`。
3. 在对应文章的 frontmatter 中加入：

```yaml
image: "images/cpp-cover.webp"
imageAlt: "显示 C++ 代码的电脑屏幕"
imageBlur: 10
imageBrightness: 0.58
imagePosition: "50% 40%"
```

图片会铺满卡片顶部，并应用可调节的高斯模糊、亮度和渐变蒙版。标题继续显示在蒙版上方。

如果删除 `image` 这一行，卡片会自动恢复为原来的 Material You 纯色样例，不需要修改组件代码。

建议使用横向 WebP、AVIF 或 JPG 图片，宽度约 1200–1600 像素，单张尽量控制在 500 KB 以内。`imageAlt` 应简短说明图片内容；纯装饰图片可以保留空字符串。

需要统一修改所有卡片的默认值时，可编辑：

- `src/content.config.ts`：frontmatter 的默认模糊和亮度。
- `src/components/ArticleCard.astro`：组件的备用默认值。
- `src/styles/global.css` 中的 `.card-image-mask`：蒙版颜色与渐变强度。

## 修改推荐逻辑

推荐器位于 `src/components/EnvironmentChooser.astro`：

1. `questions` 保存三个问题和选项。
2. 每个选项最后一个值是判断标记，例如 `redpanda`。
3. `results` 保存推荐名称、说明、目标文章 slug 和三个理由。
4. 修改后执行 `npm run build`，确认没有拼写或结构错误。

总指南监听 `baiyi:route` 事件来显示推荐结果。普通文章不依赖推荐器，可以单独修改。

## 修改主题

全站颜色集中在 `src/styles/global.css` 顶部的 CSS 变量：

```css
--miku: #39c5bb;
--miku-deep: #087c76;
--pink: #ee7aa9;
--violet: #8379d9;
```

页面默认跟随系统明暗模式。导航栏中的 `◐` 可以手动切换，选择会保存在浏览器中。

## 发布到 GitHub Pages

项目已经包含 `.github/workflows/deploy.yml`。配置过程：

1. 在 GitHub 创建一个空仓库。
2. 把本目录作为仓库内容提交，并推送到 `main` 分支。
3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment** 的 Source 中选择 **GitHub Actions**。
5. 再次推送，或到 Actions 页面手动运行 `Deploy to GitHub Pages`。
6. 部署完成后，Pages 页面会显示访问地址。

`astro.config.mjs` 会在 GitHub Actions 中自动读取用户名和仓库名：

- 普通仓库自动使用 `https://用户名.github.io/仓库名/`。
- 名为 `用户名.github.io` 的特殊仓库自动使用根路径。

所以通常不需要手动修改 `site` 或 `base`。如果使用自定义域名，可设置环境变量 `SITE_URL`，并按 Astro 官方文档添加 `public/CNAME`。

## 修改后发布的固定流程

```powershell
npm run build
git add .
git commit -m "更新文章"
git push
```

推送后 GitHub Actions 会自动重新构建并发布。

## 更新工具版本和下载链接

C++ 工具会更新。修改教程时优先核对这些官方来源：

- 小熊猫 C++：<https://github.com/royqh1979/RedPanda-CPP>
- Visual Studio：<https://visualstudio.microsoft.com/downloads/>
- VS Code C++：<https://code.visualstudio.com/docs/cpp/config-mingw>
- MSYS2：<https://www.msys2.org/>

Dev-C++ 5.11 没有适合作为日常下载入口的现代官方页面。比赛兼容文章因此要求读者优先使用当届赛事、学校或教师提供的指定安装包。

## 常见维护问题

### 新文章没有出现在首页

检查 `draft` 是否仍为 `true`，分类和主题颜色是否使用允许值，然后运行 `npm run build` 查看错误信息。

### 本地能打开，GitHub Pages 样式丢失

不要手写以 `/` 开头的站内绝对路径。Astro 组件中应使用 `import.meta.env.BASE_URL`；Markdown 文章之间使用 `../另一篇文章/` 这样的相对链接。

### 构建提示 frontmatter 错误

通常是日期格式、分类、主题颜色或布尔值写错。参考已有文章顶部的写法逐项比较。