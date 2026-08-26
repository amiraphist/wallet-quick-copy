// Style: reference-aligned wallet utility with local-first ordering, editing, and tactile copy feedback.
import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, Circle, Copy, GripVertical, Moon, PencilLine, Plus, Search, Settings2, ShieldCheck, Square, Sun, Trash2, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

type Wallet = { id: number; name: string; network: "Ethereum" | "Solana"; address: string; full: string; color: string; uses: number; pinned: boolean };
type QuickCopySettings = { color: string; label: boolean; shape: "circle" | "rounded"; size: "medium" | "large" };
type Theme = "dark" | "light";
const WALLET_LIMIT = 10;

const initialWallets: Wallet[] = [
  { id: 1, name: "Main Ethereum", network: "Ethereum", address: "0x7A3f...91cB", full: "0x7A3f19d5B7D6a44f6aE3cE6aC7bF1b2a91cB", color: "lime", uses: 42, pinned: true },
  { id: 2, name: "Solana WL", network: "Solana", address: "7xKp...mQ2z", full: "7xKp9QvY4sR2nL8dA6cF3mQ2z", color: "violet", uses: 18, pinned: false },
];

function QuickCopyLogo() { return <img src="/manus-storage/quickcopy-nested-logo_da2ae5c5.png" alt="QuickCopy" />; }

function NetworkMark({ network }: { network: string }) {
  return network === "Solana" ? <svg viewBox="0 0 24 24" aria-label="Solana"><path d="M5 6h11l3 3H8L5 6Zm3 4h11l-3 3H5l3-3Zm-3 5h11l3 3H8l-3-3Z" fill="currentColor" /></svg> : <svg viewBox="0 0 24 24" aria-label="Ethereum"><path d="m12 2 6 10-6 3.5L6 12l6-10Zm0 15.5 6-3.3-6 7.8-6-7.8 6 3.3Z" fill="currentColor" /></svg>;
}

function ShapeIcon({ shape }: { shape: QuickCopySettings["shape"] }) {
  return shape === "circle" ? <Circle size={19} strokeWidth={1.7} /> : <Square size={18} strokeWidth={1.7} className="rounded-shape" />;
}

function SizeIcon({ size }: { size: QuickCopySettings["size"] }) {
  return <span className={`size-preview size-preview-${size}`} />;
}

function CopyButton({ wallet }: { wallet: Wallet }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(wallet.full);
    setCopied(true);
    toast.success(`${wallet.name} copied`, { description: wallet.address, duration: 1800 });
    window.setTimeout(() => setCopied(false), 1500);
  };
  return <button type="button" onClick={copy} aria-label={`Copy ${wallet.name}`} className={`copy-button compact copy-icon-button ${copied ? "is-copied" : ""}`}>{copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}<span className="copy-success-text">Copied</span></button>;
}

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    try { const saved = JSON.parse(localStorage.getItem("quickcopy_dashboard_wallets") ?? "null"); return Array.isArray(saved) ? saved : initialWallets; } catch { return initialWallets; }
  });
  const [query, setQuery] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem("quickcopy_dashboard_theme") === "light" ? "light" : "dark");
  const [settings, setSettings] = useState<QuickCopySettings>(() => {
    try { return { color: "lime", label: true, shape: "rounded", size: "medium", ...JSON.parse(localStorage.getItem("quickcopy_settings") ?? "null") }; } catch { return { color: "lime", label: true, shape: "rounded", size: "medium" }; }
  });
  const [newName, setNewName] = useState("");
  const [newNetwork, setNewNetwork] = useState<Wallet["network"]>("Ethereum");
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => { localStorage.setItem("quickcopy_settings", JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem("quickcopy_dashboard_wallets", JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem("quickcopy_dashboard_theme", theme); }, [theme]);

  const filtered = useMemo(() => wallets.filter((wallet) => `${wallet.name} ${wallet.network} ${wallet.address}`.toLowerCase().includes(query.toLowerCase())), [wallets, query]);
  const editingWallet = editingId === null ? null : wallets.find((wallet) => wallet.id === editingId) ?? null;

  const openCreate = () => { setEditingId(null); setNewName(""); setNewNetwork("Ethereum"); setNewAddress(""); setShowEditor(true); };
  const openEdit = (wallet: Wallet) => { setEditingId(wallet.id); setNewName(wallet.name); setNewNetwork(wallet.network); setNewAddress(wallet.full); setShowEditor(true); };
  const saveWallet = () => {
    if (!newName.trim() || !newAddress.trim()) return toast.error("Add a name and public address first");
    const full = newAddress.trim();
    const address = `${full.slice(0, 6)}...${full.slice(-4)}`;
    if (editingId !== null) {
      setWallets((items) => items.map((wallet) => wallet.id === editingId ? { ...wallet, name: newName.trim(), network: newNetwork, full, address, color: newNetwork === "Solana" ? "violet" : "lime" } : wallet));
      toast.success("Wallet updated");
    } else {
      if (wallets.length >= WALLET_LIMIT) return toast.error("Wallet limit reached");
      setWallets((items) => [...items, { id: Date.now(), name: newName.trim(), network: newNetwork, address, full, color: newNetwork === "Solana" ? "violet" : "lime", uses: 0, pinned: false }]);
      toast.success("Wallet added");
    }
    setShowEditor(false);
  };
  const removeWallet = (id: number) => setWallets((items) => items.filter((wallet) => wallet.id !== id));
  const moveWallet = (sourceId: number, targetId: number) => {
    if (sourceId === targetId) return;
    setWallets((items) => {
      const next = [...items]; const sourceIndex = next.findIndex((wallet) => wallet.id === sourceId); const targetIndex = next.findIndex((wallet) => wallet.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return items;
      const [moved] = next.splice(sourceIndex, 1); next.splice(targetIndex, 0, moved); return next;
    });
  };

  return <div className={`app-shell ${theme === "light" ? "light-mode" : ""}`}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark brand-logo"><QuickCopyLogo /></div><div><strong>quick<span>copy</span></strong><small>WALLET CONTROL</small></div></div>
      <div className="side-label">Workspace</div>
      <nav>
        <button className="nav-item active"><WalletCards size={17} /> Wallets <b>{wallets.length}</b></button>
        <button className="nav-item" onClick={() => document.getElementById("settings")?.scrollIntoView({ behavior: "smooth" })}><Settings2 size={17} /> Preferences</button>
        <button className="nav-item theme-switch" onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />} {theme === "dark" ? "Light mode" : "Dark mode"}</button>
      </nav>
      <div className="side-bottom"><div className="security-note"><ShieldCheck size={18} /><div><strong>Local first</strong><span>Your addresses never leave this device.</span></div></div><a className="sidebar-byline" href="https://x.com/amiraphist" target="_blank" rel="noreferrer">A project by @amiraphist ↗</a><div className="version">BUILD 0.1.0 <span>●</span> READY</div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><i>/</i><strong>Wallets</strong></div><Link href="/" className="product-link">Product site <span>↗</span></Link></header>
      <section className="hero"><div><div className="eyebrow"><span className="pulse-dot" /> PERSONAL CONTROL DECK</div><h1>Copy once.<br /><em>Move faster.</em></h1><p>Your public addresses, one click away from the next whitelist.</p></div><aside className="deck-rail" aria-label="Dashboard status"><div><span>LOCAL STORAGE</span><strong><ShieldCheck size={14} /> READY</strong></div><div><span>WALLET SLOTS</span><strong>{wallets.length} / {WALLET_LIMIT}</strong></div><div><span>FINAL ACTION</span><strong>MANUAL POST</strong></div></aside></section>
      <section className="workspace-head"><div><div className="section-kicker">YOUR TOOLKIT <span>·</span> {wallets.length}/{WALLET_LIMIT} ADDRESSES</div><h2>Wallet library</h2></div><button className="add-btn" onClick={openCreate} disabled={wallets.length >= WALLET_LIMIT}><Plus size={18} /> {wallets.length >= WALLET_LIMIT ? "Limit reached" : "Add wallet"}</button></section>
      <div className="toolbar"><div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search wallets or networks" /></div></div>
      <div className="wallet-list">
        {filtered.map((wallet) => <article key={wallet.id} onDragOver={(event) => { event.preventDefault(); if (draggedId !== wallet.id) setDragOverId(wallet.id); }} onDrop={(event) => { event.preventDefault(); if (draggedId !== null) moveWallet(draggedId, wallet.id); setDraggedId(null); setDragOverId(null); }} className={`wallet-row ${wallet.pinned ? "is-pinned" : ""} ${dragOverId === wallet.id ? "drag-over" : ""}`}>
          <button type="button" draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; setDraggedId(wallet.id); }} onDragEnd={() => { setDraggedId(null); setDragOverId(null); }} className="drag-handle" aria-label={`Reorder ${wallet.name}`} title="Drag to reorder"><GripVertical size={16} /></button>
          <div className={`network-icon ${wallet.color}`}><NetworkMark network={wallet.network} /></div>
          <div className="wallet-row-main"><div className="wallet-row-title"><strong>{wallet.name}</strong>{wallet.pinned && <span className="pin">PINNED</span>}</div><span>{wallet.network}</span></div>
          <code>{wallet.address}</code><span className="wallet-uses">{wallet.uses} copies</span><CopyButton wallet={wallet} />
          <button type="button" className="row-edit" onClick={() => openEdit(wallet)} aria-label={`Edit ${wallet.name}`}><PencilLine size={15} strokeWidth={2.1} /></button>
          <button type="button" className="row-delete" onClick={() => removeWallet(wallet.id)} aria-label={`Delete ${wallet.name}`}><Trash2 size={15} /></button>
        </article>)}
        {filtered.length === 0 && <div className="empty-row">No wallets match your search.</div>}
        <button className="empty-add row-add" onClick={openCreate} disabled={wallets.length >= WALLET_LIMIT}><Plus size={18} /><span>{wallets.length >= WALLET_LIMIT ? "Wallet limit reached" : "Add another wallet"}</span></button>
      </div>
      <section id="settings" className="settings-section compact-settings"><div className="settings-intro"><div><div className="section-kicker">CONTROL PANEL <span>·</span> EXTENSION UI</div><h2>Button style</h2><p>Keep the action clear and consistent in every X theme.</p></div><div className="settings-saved"><Check size={14} /> Saved locally</div></div><div className="settings-layout settings-layout-single"><div className="settings-controls">
        <div className="setting-group"><label>BUTTON SHAPE <span>Pick the silhouette used on X</span></label><div className="shape-row">{([{ id: "circle", label: "Circle" }, { id: "rounded", label: "Rounded" }] as const).map((shape) => <button key={shape.id} aria-label={shape.label} className={`shape-choice shape-${shape.id} ${settings.shape === shape.id ? "chosen" : ""}`} onClick={() => setSettings((current) => ({ ...current, shape: shape.id }))}><ShapeIcon shape={shape.id} /></button>)}</div></div>
        <div className="setting-group"><label>BUTTON SIZE <span>Choose the footprint used on X</span></label><div className="size-row">{([{ id: "medium", label: "Medium" }, { id: "large", label: "Large" }] as const).map((size) => <button key={size.id} aria-label={size.label} className={`size-choice ${settings.size === size.id ? "chosen" : ""}`} onClick={() => setSettings((current) => ({ ...current, size: size.id }))}><SizeIcon size={size.id} /></button>)}</div></div>
        <div className="setting-group"><label>ACCENT COLOR <span>Applies to the X trigger only</span></label><div className="color-row color-row-single">{[{ id: "lime", hex: "#D7FF4F", name: "Lime Signal" }, { id: "sky", hex: "#85D8FF", name: "Sky Relay" }, { id: "coral", hex: "#FF9C72", name: "Coral Pulse" }, { id: "violet", hex: "#C2A5FF", name: "Soft Violet" }].map((color) => <button key={color.id} className={`color-choice ${settings.color === color.id ? "chosen" : ""}`} onClick={() => setSettings((current) => ({ ...current, color: color.id }))}><span style={{ background: color.hex }} />{color.name}</button>)}</div></div>
        <div className="toggle-row"><div><strong>Show label</strong><span>Display “Copy wallet” beside the icon</span></div><button className={`toggle ${settings.label ? "on" : ""}`} onClick={() => setSettings((current) => ({ ...current, label: !current.label }))}><span /></button></div>
      </div></div></section>
      <footer><span>QUICKCOPY / PRIVATE UTILITY</span><span>Never paste a seed phrase. Only use public addresses.</span></footer>
    </main>
    {showEditor && <div className="modal-backdrop" onClick={() => setShowEditor(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><div className="modal-top"><div><div className="section-kicker">{editingWallet ? "EDIT ENTRY" : "NEW ENTRY"}</div><h2>{editingWallet ? "Edit wallet" : "Add a wallet"}</h2></div><button className="icon-btn" onClick={() => setShowEditor(false)}>×</button></div><label>Wallet name<input autoFocus value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="e.g. Mint pass" /></label><label>Network<select value={newNetwork} onChange={(event) => setNewNetwork(event.target.value as Wallet["network"])}><option value="Ethereum">Ethereum</option><option value="Solana">Solana</option></select></label><label>Public address<input value={newAddress} onChange={(event) => setNewAddress(event.target.value)} placeholder="0x... or wallet address" /></label><div className="modal-warning"><ShieldCheck size={16} /> Never add a seed phrase or private key.</div><button className="save-btn" onClick={saveWallet}>{editingWallet ? "Save changes" : "Save wallet"} <Check size={17} /></button></div></div>}
  </div>;
}
