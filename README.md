# QuickCopy

QuickCopy is a local-first public-wallet helper for X on the web. Save up to ten **Ethereum** or **Solana** public addresses, choose one from a compact in-page menu when a relevant post appears, copy it, and insert it into the reply composer. QuickCopy never sends the reply for you.

## What QuickCopy does

QuickCopy keeps public address handling fast without taking control away from the user.

| Capability | Behavior |
|---|---|
| Wallet library | Create, edit, delete, and reorder up to ten labelled public addresses. |
| X workflow | Detects relevant X/Twitter posts, shows one wallet-picker trigger, copies the chosen address, and inserts it into the reply composer. |
| Final reply | The user always reviews and manually presses the final Post button. |
| Local-first settings | Wallet labels, public addresses, order, theme, and trigger appearance are stored locally in the browser. |
| Safety boundary | Seed phrases, private keys, signing credentials, and automatic posting are not supported. |

## Browser support

QuickCopy uses one source extension with two install targets: **Firefox** and **Chromium**. The Chromium target is intended for the major Chromium-based desktop browsers below.

| Platform | Browser target | Status | Installation route |
|---|---|---|---|
| Windows and macOS | Firefox | Package manifest validated | Firefox package output. Production distribution requires Mozilla signing or AMO publication; live runtime testing remains a target-device step. |
| Windows and macOS | Chrome | Chromium package smoke-tested | Chromium package output, then `chrome://extensions` → Developer mode → Load unpacked. |
| Windows and macOS | Brave | Shares Chromium package | Individual live-browser test remains a target-device step. |
| Windows and macOS | Opera | Shares Chromium package | Individual live-browser test remains a target-device step. |
| Windows and macOS | Arc | Shares Chromium package | Individual live-browser test remains a target-device step. |

## Local development

```bash
pnpm install
pnpm dev
```

The product site runs at `/`; the wallet dashboard is at `/dashboard`.

## Build extension packages

```bash
pnpm extension:firefox
pnpm extension:chromium
```

Both commands build from the same `extension/` source directory. The generated directories are written under `artifacts/` and are deliberately ignored by Git. The product site provides matching Firefox and Chromium ZIP downloads from web storage; they are not committed to the public source repository.

| Command | Output |
|---|---|
| `pnpm extension:firefox` | `artifacts/quickcopy-firefox/` |
| `pnpm extension:chromium` | `artifacts/quickcopy-chromium/` |
| `pnpm extension:all` | Both outputs |

## Install for local testing

### Firefox

Open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**, and select `artifacts/quickcopy-firefox/manifest.json`. Temporary loading is for testing; a persistent public Firefox install needs signed distribution through Mozilla’s supported route.

### Chrome, Brave, Opera, and Arc

Open the browser’s extensions page, enable **Developer mode**, choose **Load unpacked**, and select `artifacts/quickcopy-chromium/`. When testing on X, refresh the X tab after the extension has been loaded.

## Safety

QuickCopy only accepts public wallet addresses. Never enter seed phrases, private keys, recovery phrases, signing credentials, or anything that grants wallet access. The extension copies an address and can insert it into an open reply composer; it never submits a reply automatically.

## Repository policy

The public repository is [github.com/amiraphist/wallet-quick-copy](https://github.com/amiraphist/wallet-quick-copy). It contains only final project source and required configuration. Reports, task notes, TODO files, screenshots, build outputs, logs, ZIP files, local package artifacts, and Manus metadata are excluded by `.gitignore` and must never be committed.

## External platform references

- [Chrome extension installation guidance](https://support.google.com/chrome_webstore/answer/2664769?hl=en)
- [Arc extensions on macOS and Windows](https://resources.arc.net/hc/en-us/articles/19434259167767-Extensions-in-Arc-How-to-Import-Add-Open)
