# Reviewer notes

QuickCopy appears only on x.com and twitter.com when a post contains wallet-request wording. To test, add a public Ethereum or Solana address in the popup, open a relevant X post, select the QuickCopy trigger, and choose the saved address.

The extension copies the selected public address and opens or reuses the reply composer. It inserts the address into the draft but never presses the final Post button. No login credentials, seed phrases, private keys, wallet connections, transaction signing, payments, or external APIs are involved.

## Permission rationale

| Permission | Reason |
|---|---|
| `storage` | Keep user-selected labels, public addresses, order, and visual preferences locally. |
| `clipboardWrite` | Copy only the address explicitly selected by the user. |
| `https://x.com/*`, `https://twitter.com/*` | Detect relevant posts, display the picker, and place the user-selected public address in the reply draft. |
