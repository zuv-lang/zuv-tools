# Changelog

All notable changes to the Zuv Tools project are documented here.

## [0.1.0] - 2026-08-20

### Added

* Enhanced TextMate syntax grammar (`zuv.tmLanguage.json`) for comprehensive syntax coloring:
  * Function declarations and parameter highlighting (`funcName arg1, arg2 {`).
  * Parenthesis-less and parenthesized function call expressions with argument-aware lookahead.
  * Return arrow (`->`) and pattern matching arrow (`=>`) operators.
  * Dot member access and standard library method invocations (`.ln`, `.cnt`, `.sub`, `.slc`, `.chr`, `.cat`, `.eq`).
  * Object literal property keys (`key: value`).
  * Standard library modules (`str`, `arr`, `fs`, `time`, `math`, `io`, `sys`, `net`, `json`).
  * Built-in functions and standard shortforms (`prnt`, `lg`, `wrn`, `inf`, `err`, `sh`, `rF`, `wF`, `fE`, `sF`, `nw`, `sl`, `panic`, `assert`).
  * String escape sequences (`\n`, `\t`, `\"`, `\xHH`, `\uHHHH`) and block comments (`/* ... */`).
* VS Code language configuration (`language-configuration.json`):
  * Auto-closing and surrounding bracket/quote pairs (`{}`, `[]`, `()`, `""`, `''`).
  * Line and block comment toggling shortcuts.
  * Smart indentation rules for blocks and control structures.
  * Identifier word boundary regex pattern.
* Code snippets (`snippets/zuv.json`):
  * Templates for function declarations (`fn`), `main`, `if`, `ifelse`, `wh`, `mch`, `obj`, `asc`, `lg`, and `imp`.

## [0.0.2] - 2026-08-16

### Added

* Automatic Zuv LSP download on VS Code extension startup.
* Platform-specific LSP builds:

  * Windows x64
  * Linux x64
  * macOS ARM64
* Local Zuv tool directory at `~/zuv/bin`.
* Automatic use of the locally installed LSP when available.
* Automatic download of the matching LSP version from GitHub Releases.
* GitHub Actions CI and release workflows.

## [0.0.1] - 2026-08-16

### Added

* Initial Zuv Language Server release.
* VS Code extension for Zuv language support.
* Zuv `.zv` file support.
* Language Server Protocol (LSP) integration.