# Zuv Tools & VS Code Extension

Developer tools for the **[Zuv programming language](https://github.com/zuv-lang/zuv)**, including the Zuv Language Server and official VS Code extension.

## Features

* **Language Server Protocol (LSP)**: Provides language-aware development features.
* **Stdio JSON-RPC 2.0**: LSP communication over standard input/output.
* **Diagnostics & Hover**: Live code diagnostics and documentation information.
* **VS Code Integration**: Official VS Code extension for Zuv.
* **Automatic LSP Management**: Downloads the matching LSP release for the user's platform when required.
* **Cross-Platform LSP**:

  * Windows x64
  * Linux x64
  * macOS ARM64

## VS Code Extension

Install the official **[Zuv VS Code Extension](https://marketplace.visualstudio.com/items?itemName=zuv-lang.vscode-zuv)** from the Visual Studio Code Marketplace.

The extension automatically detects the user's platform and downloads the matching Zuv Language Server from GitHub Releases when it is not already available.

The LSP is stored in:

```text
Windows: C:\Users\<user>\zuv\bin
Linux:   /home/<user>/zuv/bin
macOS:   /Users/<user>/zuv/bin
```

## Build Language Server

From the `zuv-tools` directory:

```bash
clang++ -std=c++17 -Isrc -o zuv-lsp src/main.cpp src/LSP.cpp
```

## Build VS Code Extension

```bash
# Navigate to the VS Code extension directory
cd editors/vscode

# Install Node.js dependencies
npm install

# Compile TypeScript source (src/extension.ts -> out/extension.js)
npm run compile

# Package the extension, including the already-built zuv-lsp.exe server
npx vsce package

# Install the packaged extension in VS Code
code --install-extension vscode-zuv-0.0.1.vsix --force
```

## Project Links

* **Zuv Language:** https://github.com/zuv-lang/zuv
* **Zuv Tools:** https://github.com/zuv-lang/zuv-tools
* **VS Code Extension:** https://marketplace.visualstudio.com/items?itemName=zuv-lang.vscode-zuv

## License

MIT
