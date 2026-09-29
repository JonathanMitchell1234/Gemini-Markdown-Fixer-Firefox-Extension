# Gemini Code LaTeX Fixer (Firefox Extension)

A lightweight browser extension that automatically fixes Google Gemini's LaTeX escaping bug in code blocks (e.g., PowerShell, Bash, PHP, etc.), restoring proper `$` symbols both in the rendered view and when copying code.

---

## 🎯 The Problem

When Google Gemini generates code containing dollar signs (such as PowerShell variables `$myVar`, Bash expressions, or inline string interpolations), its renderer or backend occasionally treats the dollar signs as LaTeX math delimiters. 

As a result:
- `$var` gets corrupted into `\(var\)` or `\)`.
- Tokens can end up improperly glued together (e.g., `-Parameter$value` instead of `-Parameter $value`).
- Clicking Gemini's native **Copy** button copies the broken `\(` / `\)` LaTeX escapes into your clipboard rather than valid executable code.

## ✨ Features

- **⚡ Real-Time DOM Correction**: Monitors incoming streaming tokens using a `MutationObserver` to automatically unescape `\(` and `\)` into `$` inside `<code>` and `<pre><code>` blocks as Gemini types.
- **📋 Native Copy Button Hook**: Injects a lightweight page script (`page-injector.js`) that intercepts `navigator.clipboard.writeText`, ensuring code copied via Gemini's UI copy button is clean and fixed.
- **🧠 Smart Syntax Formatting**: Automatically inserts missing whitespace when a lone `$` is glued to a previous parameter or identifier, while intelligently preserving PowerShell subexpression syntax like `$(...)`.
- **🔒 Privacy First**: Zero data collection (`"data_collection_permissions": {"required": ["none"]}`). Runs entirely locally within `gemini.google.com`.

---

## 📁 Repository Structure

```text
├── manifest.json       # Extension manifest (Manifest V3)
├── content.js          # Content script with MutationObserver for DOM scanning
├── page-injector.js    # Injected page-context script to hook clipboard copy calls
└── web-ext-artifacts/  # Packaged .xpi extension builds
```

---

## 🚀 Installation

### Firefox

#### Temporary Loading (for Testing & Development)
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file in this repository.
4. Navigate to [gemini.google.com](https://gemini.google.com) — the extension will now automatically fix code blocks!

#### Installing from XPI
If you have a signed or self-distributed build:
1. Open Firefox and go to `about:addons`.
2. Click the gear icon (⚙️) and select **Install Add-on From File...**.
3. Select the `.xpi` file inside `web-ext-artifacts/`.

---

## 🛠️ Development & Building

To package the extension into an `.xpi` file using [`web-ext`](https://github.com/mozilla/web-ext):

```bash
# Install web-ext globally (if not already installed)
npm install --global web-ext

# Build the extension package (.xpi)
web-ext build --overwrite-dest
```

The output `.xpi` bundle will be generated in `web-ext-artifacts/`.

---

## 🔐 Permissions

| Permission | Purpose |
| :--- | :--- |
| `https://gemini.google.com/*` | Restricts the extension to execute only on Gemini's web interface. |
| `clipboardWrite` | Enables fixing code snippet text copied to clipboard. |

---

## 📄 License

MIT License. Feel free to modify and distribute.
