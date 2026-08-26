# QuickCopy store submission kit

This directory contains publishable text and review information only. It contains no package archives, screenshots, credentials, or private user data.

## Firefox Add-ons (AMO)

Run `pnpm extension:firefox`. The workflow creates `artifacts/quickcopy-firefox.zip` with the manifest at the archive root, ready to upload through AMO Developer Hub. Use the copy in `amo-listing.md` and `reviewer-notes.md`; declare that the extension stores wallet labels and public addresses locally and does not transmit seed phrases, private keys, or reply content.

## Chrome Web Store

Run `pnpm extension:chromium`. The workflow creates `artifacts/quickcopy-chromium.zip` with the manifest at the archive root, ready to upload to the Chrome Developer Dashboard. Use the copy in `chrome-listing.md` and `reviewer-notes.md`. Chrome Web Store developer registration requires a one-time registration fee; this project prepares the package and listing but does not begin registration, payment, or submission.

## Required submission assets

Use current, truthful screenshots of the popup and the X in-page picker. Do not show seed phrases, private keys, mock reviews, ratings, or user testimonials. Provide the same privacy statement in both stores and a support contact before submitting.

## Safety and review boundary

QuickCopy is a public-address utility. It may copy a selected address and place it into an X reply composer, but it never submits the reply. The add-on does not collect, transmit, or request wallet credentials.
