# Zuv Tools & VS Code Extension (zuv-tools)

A dedicated Language Server Protocol (LSP) implementation and VS Code Extension for the **Zuv** programming language toolchain.

## Features
- **Stdio JSON-RPC 2.0**: Implements language server protocol transport layer.
- **Initialize & Shutdown Handlers**: Supports client handshake capabilities.
- **Diagnostics & Hover**: Provides live static checks and documentation hovering.
- **VS Code Client Integration**: TypeScript client connecting VS Code editor to `zuv-lsp.exe`.

---

## Build Instructions

### 1. Build Standalone Language Server (`zuv-lsp.exe`)

Make sure you include `-Isrc` when running from the `sub_projects/zuv-tools` directory:

```bash
# Navigate to the subproject directory
cd sub_projects/zuv-tools

# Compile the C++ language server binary
clang++ -std=c++17 -Isrc -o zuv-lsp.exe src/main.cpp src/LSP.cpp
```

*Or from the repository root:*
```bash
clang++ -std=c++17 -Isub_projects/zuv-tools/src -o sub_projects/zuv-tools/zuv-lsp.exe sub_projects/zuv-tools/src/main.cpp sub_projects/zuv-tools/src/LSP.cpp
```

---

### 2. Build & Package VS Code Extension

To install and compile the TypeScript VS Code extension client:

```bash
# Navigate to the VS Code extension directory
cd sub_projects/zuv-tools/editors/vscode

# Install Node.js dependencies
npm install

# Compile TypeScript source (src/extension.ts -> out/extension.js)
npm run compile

# (Optional) Package extension into a .vsix installer
npx vsce package
```
