# Changelog

All notable changes to the Zuv Tools project are documented here.

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