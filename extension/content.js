const QUICKCOPY_KEY = 'quickcopy_wallets';
const SETTINGS_KEY = 'quickcopy_settings';
const INJECTED = 'data-quickcopy-injected';
const DEFAULT_SETTINGS = { color: 'lime', label: true, shape: 'rounded', size: 'medium' };
const NETWORK_WORDS = { Ethereum: /\b(evm|ethereum|eth|base|polygon|arbitrum|optimism|bnb|avalanche)\b/i, Solana: /\bsolana|sol\b/i };
const ADDRESS_REQUEST_PATTERNS = [
  /\b(?:drop|send|paste|comment|give)\s+(?:(?:your|ur|my)\s+)?(?:\$?(?:eth|ethereum|evm|sol|solana)\s+)?(?:wallet(?:\s+address)?|address|addy)\b/i,
  /\b(?:drop|send|give)\s+(?:your|ur)\s+(?:eth|ethereum|evm|sol|solana)\b/i,
  /\b(?:rt|like)\b.{0,40}\b(?:drop|send|paste|comment)\s+(?:(?:your|ur)\s+)?(?:wallet(?:\s+address)?|address|addy)\b/i,
  /\b(?:dont|don't)\s+say\s+anything.{0,50}\bdrop\s+(?:your|ur)\s+addy\b/i,
  /\b(?:wallet|address|addy)\s+below\b/i,
  /\b(?:sol|solana)\s+addy\b/i,
  /\b(?:evm|eth|ethereum)\s+(?:or|\/)\s+(?:sol|solana)\b/i,
  /\bwallet\s+drop\b/i,
  /\b(?:drop|send)\s+addy\b/i,
  /\bgive\s+(?:me\s+)?(?:your|ur)\s+(?:eth|ethereum|evm|sol|solana)\s+(?:wallet(?:\s+address)?|address|addy)\b/i,
  /\bsend\s+(?:me\s+)?(?:your|ur)?\s*(?:evm|eth|ethereum|sol|solana)(?:\s*\/\s*(?:evm|eth|ethereum|sol|solana))?\b/i
];
const fallbackWallets = [{ id: 'demo', name: 'Main Ethereum', network: 'Ethereum', address: '0x7A3f19d5B7D6a44f6aE3cE6aC7bF1b2a91cB' }];

function reportQuickCopyError(stage, error) { console.warn(`[QuickCopy] ${stage}`, error); }
function readStorage(key, fallback) { return new Promise((resolve) => chrome.storage.local.get({ [key]: fallback }, (result) => resolve(result[key]))); }
function short(value) { return value.length > 18 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value; }
function groupFor(wallet) { return NETWORK_WORDS.Solana.test(`${wallet.name} ${wallet.network}`) ? 'Solana' : 'Ethereum'; }
function isWalletRequest(text) { const normalized = text.replace(/\s+/g, ' ').trim(); return Boolean(normalized && normalized.length <= 1000 && ADDRESS_REQUEST_PATTERNS.some((pattern) => pattern.test(normalized))); }
function postText(post) { return post.innerText || post.textContent || ''; }
function findActions(post) { return post.querySelector('[role="group"]') || post.querySelector('[data-testid="reply"]')?.parentElement?.parentElement || null; }
function isDarkSurface() { const colors = [getComputedStyle(document.body).backgroundColor, getComputedStyle(document.documentElement).backgroundColor]; const color = colors.find((value) => value && !value.includes('0)')) || 'rgb(255,255,255)'; const rgb = color.match(/\d+(?:\.\d+)?/g)?.map(Number) || [255, 255, 255]; return (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) < 145; }
function clearInjected(post) { post.removeAttribute(INJECTED); post.querySelectorAll('.quickcopy-wrapper').forEach((node) => node.remove()); }
function htmlElement(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
function svgElement(tag, attributes) { const node = document.createElementNS('http://www.w3.org/2000/svg', tag); Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value)); return node; }
function createNetworkMark(network) { const svg = svgElement('svg', { class: 'quickcopy-network-mark', viewBox: '0 0 24 24', 'aria-label': network }); const path = svgElement('path', { d: network === 'Solana' ? 'M5 6h11l3 3H8L5 6Zm3 4h11l-3 3H5l3-3Zm-3 5h11l3 3H8l-3-3Z' : 'm12 2 6 10-6 3.5L6 12l6-10Zm0 15.5 6-3.3-6 7.8-6-7.8 6 3.3Z', fill: 'currentColor' }); svg.appendChild(path); return svg; }
function createBrandMark() { const svg = svgElement('svg', { class: 'quickcopy-brand-mark', viewBox: '0 0 128 128', 'aria-hidden': 'true' }); svg.append(svgElement('rect', { width: '128', height: '128', rx: '28', fill: 'currentColor' }), svgElement('rect', { x: '36', y: '36', width: '40', height: '40', rx: '6', fill: 'none', stroke: '#000', 'stroke-width': '7' }), svgElement('rect', { x: '52', y: '52', width: '40', height: '40', rx: '6', fill: '#000' }), svgElement('path', { d: 'M78 58 L68 78 L76 78 L70 92 L88 68 L80 68 L86 58 Z', fill: 'currentColor' })); return svg; }
function isVisible(element) { const rect = element?.getBoundingClientRect?.(); return Boolean(rect && rect.width && rect.height); }
function findComposer(scope) { const selectors = ['[contenteditable="true"][role="textbox"]', '[data-testid^="tweetTextarea"] [contenteditable="true"]', 'textarea[data-testid^="tweetTextarea"]']; const candidates = selectors.flatMap((selector) => [...scope.querySelectorAll(selector)]); return candidates.find(isVisible) || null; }
function waitForComposer(post) { return new Promise((resolve) => { const started = Date.now(); const tick = () => { const composer = findComposer(post) || findComposer(document); if (composer) return resolve(composer); if (Date.now() - started > 1800) return resolve(null); window.setTimeout(tick, 60); }; tick(); }); }
function insertIntoComposer(composer, value) { composer.focus(); if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) { const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set; setter?.call(composer, (composer.value || '') + value); composer.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value })); return; } const selection = window.getSelection(); const range = document.createRange(); range.selectNodeContents(composer); range.collapse(false); selection?.removeAllRanges(); selection?.addRange(range); const inserted = document.execCommand('insertText', false, value); if (!inserted) { const text = document.createTextNode(value); range.insertNode(text); range.setStartAfter(text); range.collapse(true); selection?.removeAllRanges(); selection?.addRange(range); } composer.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value })); composer.dispatchEvent(new Event('change', { bubbles: true })); }
async function pasteIntoReply(post, value) { let composer = findComposer(post) || findComposer(document); if (!composer) { post.querySelector('[data-testid="reply"], button[aria-label*="Reply" i]')?.click(); composer = await waitForComposer(post); } if (!composer) return false; insertIntoComposer(composer, value); return true; }

async function addQuickCopy(post) {
  if (post.hasAttribute(INJECTED) || !isWalletRequest(postText(post))) return;
  const actions = findActions(post); if (!actions) return;
  post.setAttribute(INJECTED, 'true');
  const wallets = (await readStorage(QUICKCOPY_KEY, fallbackWallets)).slice(0, 10); if (!wallets.length) { post.removeAttribute(INJECTED); return; }
  const settings = { ...DEFAULT_SETTINGS, ...(await readStorage(SETTINGS_KEY, DEFAULT_SETTINGS)) }; const shape = settings.shape === 'circle' ? 'circle' : 'rounded';
  actions.classList.add('quickcopy-anchor-host');
  const wrapper = htmlElement('div', 'quickcopy-wrapper quickcopy-fixed');
  const trigger = htmlElement('button', `quickcopy-trigger quickcopy-color-${settings.color} quickcopy-shape-${shape} quickcopy-size-${settings.size} ${isDarkSurface() ? 'quickcopy-on-dark' : 'quickcopy-on-light'}`); trigger.setAttribute('aria-label', 'QuickCopy: choose a public wallet address'); trigger.title = 'QuickCopy: choose a public address'; trigger.appendChild(createBrandMark());
  if (settings.label) { trigger.append(htmlElement('span', 'quickcopy-text', 'COPY WALLET'), htmlElement('span', 'quickcopy-chevron', '⌄')); }
  const menu = htmlElement('div', 'quickcopy-menu'); menu.setAttribute('role', 'menu');
  const heading = htmlElement('div', 'quickcopy-menu-heading'); heading.append(htmlElement('span', '', 'YOUR ADDRESSES'), htmlElement('small', '', 'PUBLIC ONLY · NO AUTO-POST')); menu.appendChild(heading);
  const list = htmlElement('div', 'quickcopy-list'); menu.appendChild(list);
  const copyWallet = async (wallet, item) => { try { if (!navigator.clipboard?.writeText) throw new Error('Clipboard API is unavailable.'); await navigator.clipboard.writeText(wallet.address); const pasted = await pasteIntoReply(post, wallet.address); item.classList.add('is-copied'); item.querySelector('.quickcopy-copy').textContent = pasted ? 'PASTED' : 'COPIED'; trigger.classList.add('is-copied'); const label = trigger.querySelector('.quickcopy-text'); if (label) label.textContent = pasted ? 'PASTED' : 'COPIED'; menu.classList.remove('is-open'); setTimeout(() => { item.classList.remove('is-copied'); item.querySelector('.quickcopy-copy').textContent = 'COPY'; trigger.classList.remove('is-copied'); if (label) label.textContent = 'COPY WALLET'; }, 1400); } catch (error) { reportQuickCopyError('copy or reply insertion failed', error); item.querySelector('.quickcopy-copy').textContent = 'TRY AGAIN'; } };
  wallets.forEach((wallet) => { const network = groupFor(wallet); const item = htmlElement('button', 'quickcopy-item'); item.setAttribute('role', 'menuitem'); const networkIcon = htmlElement('span', `quickcopy-network-icon network-${network.toLowerCase()}`); networkIcon.appendChild(createNetworkMark(network)); const info = htmlElement('span', 'quickcopy-item-info'); info.append(htmlElement('b', '', wallet.name), htmlElement('small', '', `${network} · ${short(wallet.address)}`)); item.append(networkIcon, info, htmlElement('span', 'quickcopy-copy', 'COPY')); item.onclick = (event) => { event.stopPropagation(); copyWallet(wallet, item); }; list.appendChild(item); });
  trigger.onclick = (event) => { event.stopPropagation(); document.querySelectorAll('.quickcopy-menu.is-open').forEach((openMenu) => { if (openMenu !== menu) openMenu.classList.remove('is-open'); }); menu.classList.toggle('is-open'); };
  wrapper.append(trigger, menu); actions.appendChild(wrapper);
}
function scan() { document.querySelectorAll('article[data-testid="tweet"], article[role="article"]').forEach((post) => { if (!post.hasAttribute(INJECTED)) addQuickCopy(post).catch((error) => { post.removeAttribute(INJECTED); reportQuickCopyError('post injection failed', error); }); }); }
function safeScan() { try { scan(); } catch (error) { reportQuickCopyError('post scan failed', error); } }
const observer = new MutationObserver(safeScan); observer.observe(document.documentElement, { childList: true, subtree: true });
chrome.storage.onChanged.addListener((changes, area) => { if (area !== 'local' || (!changes[SETTINGS_KEY] && !changes[QUICKCOPY_KEY])) return; document.querySelectorAll(`[${INJECTED}]`).forEach(clearInjected); safeScan(); });
safeScan();
