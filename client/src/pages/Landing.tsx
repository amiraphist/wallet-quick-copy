// Style: Neo-industrial product field guide — graphite surfaces, Lime Signal actions, asymmetric editorial rhythm.
import { ArrowUpRight, Check, ChevronDown, CircleCheckBig, Copy, ExternalLink, LockKeyhole, MousePointerClick, ShieldCheck, WalletCards } from "lucide-react";
import { Link } from "wouter";

const HERO_IMAGE = "/manus-storage/quickcopy-hero-terminal_66fe5c56.png";
const FLOW_IMAGE = "/manus-storage/quickcopy-flow-detail_b1ce2744.png";
const LOCAL_IMAGE = "/manus-storage/quickcopy-local-first_13f5439b.png";
const FIREFOX_PACKAGE = "/manus-storage/quickcopy-firefox_0c0dcdef.zip";
const CHROMIUM_PACKAGE = "/manus-storage/quickcopy-chromium_7e584803.zip";

function QuickCopyLogo() {
  return <img src="/manus-storage/quickcopy-nested-logo_da2ae5c5.png" alt="QuickCopy" />;
}

function QuickCopyWordmark() {
  return <strong className="quickcopy-wordmark"><i>q</i>uick<span>copy</span></strong>;
}

const browsers = [
  { name: "Firefox", family: "Firefox", icon: "/manus-storage/firefox_184ae9b8.svg", download: FIREFOX_PACKAGE, file: "quickcopy-firefox.zip" },
  { name: "Chrome", family: "Chromium", icon: "/manus-storage/googlechrome_cc3a975d.svg", download: CHROMIUM_PACKAGE, file: "quickcopy-chromium.zip" },
  { name: "Brave", family: "Chromium", icon: "/manus-storage/brave_3dbc3401.svg", download: CHROMIUM_PACKAGE, file: "quickcopy-chromium.zip" },
  { name: "Opera", family: "Chromium", icon: "/manus-storage/opera_383802da.svg", download: CHROMIUM_PACKAGE, file: "quickcopy-chromium.zip" },
  { name: "Arc", family: "Chromium", icon: "/manus-storage/arc_16409c5f.svg", download: CHROMIUM_PACKAGE, file: "quickcopy-chromium.zip" },
];

export default function Landing() {
  return <div className="marketing-shell">
    <header className="marketing-nav">
      <Link href="/" className="marketing-brand" aria-label="QuickCopy home"><span className="marketing-mark"><QuickCopyLogo /></span><span><QuickCopyWordmark /><small>PUBLIC WALLET UTILITY</small></span></Link>
      <nav aria-label="Product navigation"><a href="#workflow">Workflow</a><a href="#compatibility">Compatibility</a><a href="#safety">Safety</a></nav>
      <Link href="/dashboard" className="nav-dashboard">Open dashboard <ArrowUpRight size={15} /></Link>
    </header>

    <main>
      <section className="marketing-hero">
        <div className="hero-copy">
          <div className="marketing-kicker"><span /> PUBLIC ADDRESS CONTROL</div>
          <h1>Copy once.<br /><em>Move with intent.</em></h1>
          <p>Keep Ethereum and Solana public addresses ready for whitelist replies on X. Pick one, copy it, and place it in the reply composer—without sending anything for you.</p>
          <div className="hero-actions"><Link href="/dashboard" className="primary-cta">Open wallet dashboard <ArrowUpRight size={17} /></Link><a href="#workflow" className="text-cta">See the flow <ChevronDown size={16} /></a></div>
          <div className="hero-assurance"><span><Check size={14} /> Public addresses only</span><span><Check size={14} /> Never auto-posts</span></div>
          <div className="hero-telemetry" aria-label="QuickCopy operating status"><div><span>WALLET SLOTS</span><strong>10 READY</strong></div><div><span>NETWORKS</span><strong>ETH · SOL</strong></div><div><span>REPLY MODE</span><strong>REVIEW FIRST</strong></div></div>
        </div>
        <div className="hero-frame"><img src={HERO_IMAGE} alt="Abstract QuickCopy browser workflow" /><div className="hero-frame-note"><MousePointerClick size={15} /><span>Choose. Copy. Review. Post.</span></div></div>
      </section>

      <section id="workflow" className="process-section">
        <div className="section-heading"><div><div className="marketing-kicker"><span /> THE FAST PATH</div><h2>Three deliberate steps.<br />No hidden automation.</h2></div><p>QuickCopy keeps the final decision with you. It speeds up repetitive address handling, not your voice on X.</p></div>
        <div className="process-grid">
          <article><span className="step-number">01</span><div className="process-state"><span>LIBRARY</span><strong>10 SLOTS</strong></div><WalletCards size={22} /><h3>Save public addresses</h3><p>Add up to ten Ethereum or Solana addresses, label them clearly, and set the order you want to see.</p></article>
          <article><span className="step-number">02</span><div className="process-state"><span>TRIGGER</span><strong>ACTIVE</strong></div><Copy size={22} /><h3>Choose from the post</h3><p>On relevant X posts, one compact trigger opens the wallet list you already configured.</p></article>
          <article><span className="step-number">03</span><div className="process-state"><span>POST MODE</span><strong>MANUAL</strong></div><CircleCheckBig size={22} /><h3>Review, then post</h3><p>The selected address is copied and inserted into the reply composer. You remain responsible for the final Post action.</p></article>
        </div>
      </section>

      <section className="detail-band">
        <div className="detail-image"><img src={FLOW_IMAGE} alt="Abstract wallet picker detail" /><div className="detail-stamp">WALLET PICKER<br /><span>ONE POST · ONE DECISION</span></div></div>
        <div className="detail-copy"><div className="marketing-kicker"><span /> DESIGNED FOR THE MOMENT</div><h2>Your wallet list,<br /><em>where it matters.</em></h2><p>The in-page chooser only appears when a post asks for a compatible wallet address. It stays compact, reflects your saved labels, and never creates a reply by itself.</p><div className="wallet-readout"><span className="readout-rail" /><div><small>ACTIVE LABEL</small><strong>Main Ethereum</strong></div><code>0x7A3f...e3cB</code><CircleCheckBig size={15} /></div><Link href="/dashboard" className="inline-link">Set up your ten addresses <ArrowUpRight size={16} /></Link></div>
      </section>

      <section id="compatibility" className="compatibility-section compatibility-single">
        <div className="compatibility-copy"><div className="marketing-kicker"><span /> DESKTOP EXTENSION COVERAGE</div><h2>Built for the browsers<br />people actually use.</h2><p>Choose your browser and download its matching package. Firefox receives its own build; Chrome, Brave, Opera, and Arc share the Chromium build.</p><div className="compatibility-status"><span>INSTALL CONSOLE</span><strong><i /> 5 TARGETS · 2 PACKAGES</strong><code>QC/EXT-01</code></div><div className="browser-downloads" aria-label="QuickCopy browser package downloads">{browsers.map((browser) => <a key={browser.name} className="browser-download" href={browser.download} download={browser.file} title={`Download QuickCopy for ${browser.name}`}><img src={browser.icon} alt="" /><span><strong>{browser.name}</strong><small>{browser.family}</small></span><ArrowUpRight size={15} /></a>)}</div><p className="download-note">Both package manifests are built and checked; the Chromium package is smoke-loaded in Chromium in this workspace. Firefox needs signed distribution for persistent installation. Chromium browsers use the same package after “Load unpacked.”</p></div>
      </section>

      <section id="safety" className="safety-section"><div className="safety-copy"><div className="marketing-kicker"><span /> LOCAL BY DESIGN</div><h2>Public data only.<br /><em>Control stays with you.</em></h2><p>Wallet labels, public addresses, ordering, and appearance preferences are stored locally. QuickCopy does not ask for seed phrases or private keys, and it does not send replies automatically.</p><Link href="/dashboard" className="primary-cta">Manage public addresses <ArrowUpRight size={17} /></Link></div><div className="safety-visual"><img src={LOCAL_IMAGE} alt="Abstract privacy and local control concept" /><div className="safety-badge"><LockKeyhole size={17} /><span><strong>LOCAL FIRST</strong><small>No seed phrases. No private keys.</small></span></div></div></section>
    </main>

    <footer className="marketing-footer"><div className="marketing-brand"><span className="marketing-mark"><QuickCopyLogo /></span><span><QuickCopyWordmark /><small>WALLET CONTROL</small></span></div><p>Copy public addresses with precision. The final reply is always yours.</p><div><a href="https://github.com/amiraphist/wallet-quick-copy" target="_blank" rel="noreferrer">Source <ExternalLink size={13} /></a><a href="https://x.com/amiraphist" target="_blank" rel="noreferrer">A project by @amiraphist</a></div></footer>
  </div>;
}
