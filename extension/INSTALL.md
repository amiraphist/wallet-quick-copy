# QuickCopy Installation

QuickCopy is a desktop browser extension for managing public Ethereum and Solana addresses while using X on the web. It never requests seed phrases or private keys and never presses the final Post button for you.

## Firefox

For normal daily use, install QuickCopy from the official Firefox Add-ons listing:

https://addons.mozilla.org/addon/quickcopy-wallet-control/

For local testing, extract the Firefox package, open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**, and select the `manifest.json` file inside the extracted folder. Temporary installations are removed when Firefox closes.

## Chrome, Brave, Opera, and Arc

These browsers use the shared Chromium package. Extract the ZIP into a folder you will not move or delete. Do not select the ZIP file itself.

1. Open the browser's extensions page.
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Opera: `opera://extensions`
   - Arc: open the Extensions page from the browser menu.
2. Turn on **Developer mode**.
3. Select **Load unpacked**.
4. Choose the extracted `quickcopy-chromium` folder, the folder containing `manifest.json`.
5. Open or refresh X after the extension is loaded.

## First use

Open the QuickCopy extension popup, add only public Ethereum or Solana addresses, and give each address a recognizable label. On a relevant X post, select the QuickCopy trigger, choose an address, and review the reply draft before pressing Post yourself.

## Privacy and safety

QuickCopy stores wallet labels, public addresses, order, theme, and trigger appearance locally in the browser. It does not request wallet connections, signing credentials, passwords, seed phrases, recovery phrases, or private keys. It does not send replies automatically.

## Source and releases

Source code is available at:

https://github.com/amiraphist/wallet-quick-copy

Official release assets are distributed through the project's GitHub Releases. Verify the release tag and checksum before installing when checksums are provided.
