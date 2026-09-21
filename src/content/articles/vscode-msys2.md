---
title: "VS Code + MSYS2：理解工具链路线"
description: "安装现代 GCC 工具链，让 VS Code 负责编写、构建与调试。"
category: "配置指南"
publishedAt: 2026-09-20
updatedAt: 2026-09-21
readingMinutes: 15
featured: true
accent: ink
order: 10
---

## 先理解你要安装什么

VS Code 是编辑器，不自带 C++ 编译器。C/C++ 扩展提供代码补全和调试适配，真正把 `.cpp` 变成 `.exe` 的是 GCC；这里通过 MSYS2 安装并更新 GCC、GDB 等工具。

这条路线步骤比小熊猫 C++ 等解决方案多，但每一层职责都很清楚，后续加入 CMake、第三方库或多文件项目时更容易维护。

我个人倾向于推荐使用这样的解决方案，在安装与使用中，你将逐渐感受到使用灵活的开发环境所带来的便利。

## 第一步：安装 VS Code 与扩展

1. 从 [VS Code 官网](https://code.visualstudio.com/)下载安装程序。
2. 安装时勾选“添加到 PATH”和“通过 Code 打开”相关选项，方便从终端与文件夹启动。
3. 打开扩展页面，安装 Microsoft 发布的 **C/C++** 扩展。发布者应显示为 Microsoft。

## 第二步：安装 MSYS2

1. 打开 [MSYS2 官方安装页](https://www.msys2.org/)。
2. 下载 64 位安装程序并使用默认目录 `C:\msys64`。
3. 安装结束后启动 **MSYS2 UCRT64** 终端。不要使用名称只有“MSYS”的终端来编译 Windows 程序。
4. 先更新基础系统：

```bash
pacman -Syu
```

如果终端提示关闭，请关闭后重新打开 **MSYS2 UCRT64**，再次运行 `pacman -Syu`，直到没有核心更新需要继续。

5. 安装完整的 MinGW-w64 UCRT64 工具链：

```bash
pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain
```

出现包选择列表时直接按 Enter 接受默认全部安装，再输入 `Y` 确认。

VS Code 的[官方 MinGW 指南](https://code.visualstudio.com/docs/cpp/config-mingw)同样使用这套 UCRT64 工具链。MSYS2 当前的 GCC 单包名是 `mingw-w64-ucrt-x86_64-gcc`；安装完整 toolchain 还会同时获得 GDB 与常用构建工具。

## 第三步：加入 PATH

把下面目录加入 Windows 用户环境变量 `Path`：

```text
C:\msys64\ucrt64\bin
```

操作完成后，**彻底关闭并重新打开 VS Code 和终端**。旧进程不会自动读取新的环境变量。

在 PowerShell 中检查：

```powershell
g++ --version
gdb --version
where.exe g++
```

`where.exe g++` 应优先显示 `C:\msys64\ucrt64\bin\g++.exe`。如果出现其他 MinGW 路径，说明电脑里存在多套编译器，需要调整 Path 顺序。

## 第四步：创建并编译 A+B

新建一个英文路径文件夹，例如 `D:\code\a-plus-b`，用 VS Code 打开整个文件夹，再创建 `main.cpp`：

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

打开 VS Code 集成终端（Terminal），执行：

```powershell
g++ main.cpp -std=c++17 -Wall -Wextra -g -o main.exe
.\main.exe
```

输入 `1 2`，看到 `3`，说明编译器与程序本身都没有问题。

## 第五步：让 VS Code 调用编译器

保持 `main.cpp` 为当前文件，点击右上角运行按钮，第一次运行时选择带有 `g++.exe` 的“生成并调试活动文件”选项。VS Code 会在 `.vscode` 目录生成 `tasks.json`。

如果自动检测失败，可建立 `.vscode/tasks.json`：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "cppbuild",
      "label": "C/C++: g++.exe 生成活动文件",
      "command": "C:\\msys64\\ucrt64\\bin\\g++.exe",
      "args": [
        "-fdiagnostics-color=always",
        "-g",
        "-Wall",
        "-Wextra",
        "-std=c++17",
        "${file}",
        "-o",
        "${fileDirname}\\${fileBasenameNoExtension}.exe"
      ],
      "options": { "cwd": "${fileDirname}" },
      "problemMatcher": ["$gcc"],
      "group": { "kind": "build", "isDefault": true },
      "detail": "使用 MSYS2 UCRT64 的 g++ 编译当前文件"
    }
  ]
}
```

按 `Ctrl + Shift + B` 即可构建当前文件。`${file}` 只代表当前打开的文件：如果 `main.cpp` 用到了 `add.cpp` 中定义的函数，编译时就需要把两个文件都交给编译器，例如 `g++ main.cpp add.cpp -o app.exe`。文件变多后，可以用 CMake 或 Make 管理，不必逐个手写命令。这里不做深入讨论。

有些人可能会说：那我搜到的教程让我写成`*.cpp`呢?

这是旧写法，MSYS2 自 2024 年不再默认由 MinGW 程序自行展开这类通配符；如果调用它的环境没有先展开，编译器收到的就只是字面量 `*.cpp`。在 MSYS2 Bash 中直接运行 `g++ *.cpp -o app.exe` 则是另一回事：Bash 通常会先把 `*.cpp` 展开成实际文件名。

## 第六步：配置断点调试

按 `F5`，选择 C++ (GDB/LLDB)，再选择 `g++.exe`。自动配置正常时，VS Code 会生成 `launch.json` 并调用 `C:\msys64\ucrt64\bin\gdb.exe`。

在 `cin` 后一行设置断点。程序停下后，观察变量 `a` 与 `b`，再单步执行输出语句。这一步同时验证编译参数 `-g`、GDB 与 VS Code 调试适配器。

## 常见问题

### `g++` 不是内部或外部命令

检查工具链是否安装成功、Path 是否写成 `C:\msys64\ucrt64\bin`，并重新启动全部终端。不要把 `C:\msys64\usr\bin` 当作这条路线的 GCC 路径。

### 运行按钮找不到编译器

先在 VS Code 终端执行 `g++ --version`。如果终端都找不到，先修复 Path；如果终端能找到，使用命令面板执行“C/C++: 编辑配置(UI)”并把编译器路径指向 UCRT64 的 `g++.exe`。

### 代码能编译但出现红色波浪线

执行“C/C++: 选择 IntelliSense 配置”，选择同一个 UCRT64 `g++.exe`。编译配置与 IntelliSense 配置是两套信息，必须指向同一工具链。

## 下一步

回到[环境选择总指南](../cpp-environment/)完成在线评测验收，再阅读[编辑器、编译器和代码是什么关系](../toolchain-basics/)。

### 参考

- [VS Code：Using GCC with MinGW](https://code.visualstudio.com/docs/cpp/config-mingw)
- [MSYS2 安装说明](https://www.msys2.org/)
- [MSYS2 环境说明](https://www.msys2.org/docs/environments/)
- [MSYS2 UCRT64 GCC 软件包](https://packages.msys2.org/packages/mingw-w64-ucrt-x86_64-gcc)
