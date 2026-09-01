# Reviewer notes — corrective version 0.1.1

## Scope and test procedure

QuickCopy is a local public-address helper for direct replies on `x.com` and `twitter.com`. It supports only public Ethereum and Solana addresses. No reviewer account or credentials are required.

1. Install the extension and open its popup.
2. Add a clearly non-sensitive test value as an Ethereum or Solana public address, for example `0x1111111111111111111111111111111111111111`.
3. Open an X post containing a direct address request, such as “Drop your SOL address below” or “Comment your wallet.” A QuickCopy control is added beside that post only.
4. Select the QuickCopy control, then deliberately select the saved address. The address is copied and may be inserted into the reply draft.
5. Confirm that the user, not QuickCopy, must press X’s final Post button. The extension contains no click, keyboard, or API call that invokes final posting.
6. For a negative case, view a post such as “The Solana ecosystem looks active today” or “A whitelist mint begins next week.” No QuickCopy control should appear.

## Transparency and data handling

The injected control has the accessible name “QuickCopy: choose a public wallet address.” Its menu states “PUBLIC ONLY · NO AUTO-POST.” The extension does not modify post text, change X settings, redirect navigation, add affiliate tags, use remote code, call external APIs, or transmit data. It does not handle seed phrases, recovery phrases, private keys, credentials, wallet connections, transaction signing, or payments.

All wallet labels, public addresses, display order, and visual settings remain in browser extension local storage. The Firefox manifest declares `data_collection_permissions.required: ["none"]`.

## Permission rationale

| Permission | Reason |
|---|---|
| `storage` | Store user-selected labels, public addresses, display order, and visual preferences locally. |
| `clipboardWrite` | Copy only the public address deliberately selected by the user. |
| `https://x.com/*`, `https://twitter.com/*` | Detect explicit public-address-request phrasing, display QuickCopy’s own picker, and place the user-selected public address in the reply draft. |

## Reviewable source and reproducible build

The readable source is available at https://github.com/amiraphist/wallet-quick-copy. The extension does not use a bundler, minifier, code generator, template engine, or remote source. To reproduce the Firefox archive, run `pnpm install --frozen-lockfile` and then `pnpm extension:firefox`. The output is `artifacts/quickcopy-firefox.zip`.
