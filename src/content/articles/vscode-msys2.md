---
title: "VS Code + MSYS2：在编辑器里运行 C++"
description: "装好 GCC，让 VS Code 的运行按钮编译并启动你的第一份 C++ 程序。"
category: "配置指南"
publishedAt: 2026-09-20
updatedAt: 2026-09-22
readingMinutes: 12
featured: true
accent: ink
order: 10
---

这条路线以 **x86-64 Windows** 为例，适合想使用 VS Code、又愿意花一点时间把 C++ 环境配好的同学。**当你能运行这些，你就得到了~~Wonderful Answer~~!：在 VS Code 里点运行按钮，输入 `1 2`，看到 `3`。**

VS Code 本身不带 C++ 编译器。我们用 **MSYS2** 安装 GCC，再让 VS Code 调用它。下面只安装一次；以后新建单文件题目，直接在 VS Code 里编译运行。

## 1. 装 VS Code 和 C/C++ 扩展

1. 从 [VS Code 官网](https://code.visualstudio.com/)下载安装并打开。
2. 点击左侧“四个方块”扩展图标，搜索 **C/C++**，安装发布者为 **Microsoft** 的扩展。

> 这里不需要另外安装 Code Runner。后面用的是 Microsoft C/C++ 扩展提供的运行入口。

## 2. 用 MSYS2 装编译器

1. 从 [MSYS2 官网](https://www.msys2.org/)下载 x86-64 安装程序，安装位置保持默认的 `C:\msys64`。
2. 安装完成后打开 **MSYS2 UCRT64** 终端。开始菜单里可能还有一个叫“MSYS2 MSYS”的入口，这篇不要选它。
3. 在 **UCRT64** 终端粘贴下面这行，按回车更新：

```bash
pacman -Syu
```

如果它要求关掉终端，就关闭并重新打开 **MSYS2 UCRT64**，再运行一次 `pacman -Syu`，直到更新完成。

4. 接着在同一个 **UCRT64** 终端安装工具链：

```bash
pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain
```

出现软件包选择时直接按回车接受默认选择；询问是否继续时输入 `Y` 再回车。等它装完，不要提前关闭窗口。

> 这一步会装好 `g++.exe`。它才是稍后真正编译 `main.cpp` 的程序；扩展本身不会帮你下载编译器。

## 3. 让 VS Code 找到 `g++`

1. 在 Windows 开始菜单搜索“编辑账户的环境变量”（也可能显示“编辑系统环境变量”）。打开“环境变量”，在**用户变量**里选中 `Path`，点击“编辑 → 新建”。
2. 添加这一行，然后一路点“确定”保存：

```text
C:\msys64\ucrt64\bin
```

3. **彻底关闭 VS Code，再重新打开。**VS Code 需要重新读取你刚改的 `Path`。
4. 在 VS Code 中打开“终端 → 新建终端”，选择 **PowerShell**，输入：

```powershell
g++ --version
where g++
```

看到版本号，且 `where.exe g++` 的第一条是 `C:\msys64\ucrt64\bin\g++.exe`，再继续下一步。这里的终端只用来检查安装是否到位；编译运行会从 VS Code 的按钮完成。

> 如果提示找不到 `g++`，先别改代码。回头检查 UCRT64 工具链有没有安装、`Path` 有没有少写 `ucrt64\bin`，以及 VS Code 是否真的重启过。

## 4. 在 VS Code 里编译运行 A+B

1. 新建一个文件夹，例如 `D:\code\a-plus-b`，在 VS Code 中选择“文件 → 打开文件夹”，打开它。若弹出工作区信任提示，你自己创建的文件夹可以选择信任。
2. 在左侧文件列表点“新建文件”，命名为 `main.cpp`。粘贴下面的代码，并按 `Ctrl + S` 保存：

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

3. 保持 `main.cpp` 打开，点击编辑器**右上角的三角形运行按钮**。如果有下拉选项，选择“运行 C/C++ 文件”（Run C/C++ File）；首次询问编译器时，选路径在 `C:\msys64\ucrt64\bin` 下的 **g++.exe**。
4. 等待编译完成，在 VS Code 底部的**终端（Terminal）**输入 `1 2`，按回车。看到 `3` 就完成了。

> 第一次选择编译器后，扩展可能在 `.vscode` 文件夹生成 `tasks.json`。这是它保存编译方式的配置文件；现在不用手写或逐项理解它。

想核对在线评测，可把同一份代码提交到[洛谷 P1001](https://www.luogu.com.cn/problem/P1001)。本地看到 `3` 是本地环境跑通，评测是否 Accepted 以洛谷页面为准。

## 后记

这样，你便得到了一个项目的编译文件。但是如果打开新文件夹，要重新配置环境。

幸好，你已经有了样本，可以直接参考着配置新项目。

## 卡住时，按现象处理

- **没看到运行按钮或 C/C++ 选项**:确认 `main.cpp` 是当前打开的文件，并确认 Microsoft 的 C/C++ 扩展已安装且启用。
- **编译器列表没有 UCRT64 的 `g++.exe`：**先回到第 3 步，确认 `where.exe g++` 的结果；如果电脑里有多套 GCC，要选 `C:\msys64\ucrt64\bin\g++.exe`，不要凭“都是 g++”随便选。
- **点了按钮，只在“输出”面板看到文字，无法输入 `1 2`：**确认选的是 C/C++ 的“运行 C/C++ 文件”，并切到底部的**终端**标签。不要用 Code Runner 的“输出”面板当输入窗口。
- **代码标红但编译成功**:用命令面板(ctrl+shift+p)执行“C/C++: 选择 IntelliSense 配置”，也选 UCRT64 的 `g++.exe`。红色波浪线和真正的编译错误不是同一回事。
- **想用断点**:运行按钮旁可选择调试 C/C++ 文件；这篇只负责让程序跑通，不赘述 Debug 配置。

- **请更新IncludePath**:一般是前面三个文件没有写对，一般先检查 ``c_cpp_properties.json`` 的 ``includePath``、``compilerPath`` 或 ``compileCommands`` 是否写对。``tasks.json`` 和 ``launch.json`` 也要配置正确.

本文的运行按钮按**当前打开的单个 `.cpp` 文件**构建。以后写多文件项目时，别在tasks.json里直接写 `*.cpp` 来赌通配符是否展开；应明确列出源文件或使用 Make/CMake。想弄明白编辑器、编译器和这些配置文件的关系，再读[原理篇](../toolchain-basics/)；想换路线，回到[环境选择总指南](../cpp-environment/)。
