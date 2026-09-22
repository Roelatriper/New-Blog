---
title: "Visual Studio 2026：用完整 IDE 跑 C++"
description: "选对 C++ 工作负载，创建控制台项目，在 Visual Studio 中运行 A+B。"
category: "配置指南"
publishedAt: 2026-09-20
updatedAt: 2026-09-22
readingMinutes: 7
featured: false
accent: violet
order: 40
---

准备做 Windows C++ 项目、希望项目管理和编译工具都在一个软件里？选择 Visual Studio。它比小熊猫 C++ 占用更多空间，但不需要再单独安装 GCC。这篇只做一件事：让你在 Visual Studio 里建项目并运行 A+B。

## 1. 安装 C++ 工作负载

1. 打开 [Visual Studio 官方下载页](https://visualstudio.microsoft.com/downloads/)，选择 **Visual Studio Community 2026**。个人学习可以使用 Community；团队或组织使用前请查看许可条件。
2. 运行下载的 Visual Studio Installer。在“工作负载”页面勾选 **使用 C++ 的桌面开发**（Desktop development with C++）。
3. 保留该工作负载默认选择的 MSVC 和 Windows SDK。查看安装器显示的预计空间，再点击“安装”。

> **焚决**：只装 Visual Studio 外壳，未勾选“使用 C++ 的桌面开发”，创建项目时就可能找不到 C++ 控制台模板。这里是最容易漏的一格。

## 2. 创建第一个控制台项目

1. 打开 Visual Studio，点击“创建新项目”。
2. 在搜索框输入“控制台”，把语言筛选为 **C++**，选择“控制台应用”。
3. 项目名称填 `APlusB`，选一个容易找到的文件夹，点击“创建”。
4. 在解决方案资源管理器里打开项目生成的 `.cpp` 文件，找到 `main` 函数，用下面这份代码替换文件内容，然后按 `Ctrl + S` 保存。

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << '\n';
    return 0;
}
```

> **注意：**Visual Studio 和 VS Code 是两个不同软件。这里要**新建 C++ 控制台项目**，不要只在 Visual Studio 里打开一个孤零零的 `main.cpp` 就等着运行按钮替你创建项目。

## 3. 在 Visual Studio 中运行

按 `Ctrl + F5`（菜单“调试 → 开始执行〔不调试〕”）。控制台窗口打开后直接输入 `1 2`，按回车；输出 `3` 就成功了。`Ctrl + F5` 会完成构建并启动程序，不需要另开命令行输入编译命令。

你也可以把这份代码提交到[洛谷 P1001](https://www.luogu.com.cn/problem/P1001)。本地输出 `3` 说明本地环境跑通；是否通过在线评测，以洛谷页面结果为准。

> **注意**：每次改完代码先保存，再按 `Ctrl + F5`。如果要打断点，`F5` 是启动调试。

## 卡住时，先看这里

- **找不到“控制台应用”模板：**打开 Visual Studio Installer，找到当前版本并点“修改”，补选“使用 C++ 的桌面开发”。
- **出现生成错误：**打开“错误列表”或“输出”，先看第一条编译错误；确认你替换的是项目内的 `.cpp` 文件，并且代码与上面一致。
- **程序窗口马上关闭：**确认使用的是 `Ctrl + F5`，而不是双击生成的 `.exe`。

学习 A+B 时不用先改 Debug/Release 或语言标准；如果课程、比赛指定了标准，再到“项目 → 属性 → C/C++ → 语言 → C++ 语言标准”按要求调整。想理解 Visual Studio 为什么能一次包办这些事，读[原理篇](../toolchain-basics/)；想重新选软件，回到[环境选择总指南](../cpp-environment/)。
