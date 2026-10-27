import type { ReactNode } from "react";

/* Decorative, CSS-built interface compositions. They only use labels taken from the project descriptions —
   no screenshots, numbers or features are invented. All are aria-hidden (the card text carries the content). */

function Browser({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="win">
      <div className="win-bar"><i /><i /><i /><em>{url}</em></div>
      <div className="win-body">{children}</div>
    </div>
  );
}

const Sk = ({ w = "100%", a = false }: { w?: string; a?: boolean }) => <div className={`sk${a ? " a" : ""}`} style={{ width: w }} />;

/* 01 — SunSolarOne: business management platform modules */
export function SolarVisual() {
  const modules = ["Leads", "Proposals", "Invoices", "Payments", "Inventory", "Customer portal"];
  return (
    <Browser url="Business management platform">
      <div className="side">{modules.map((m, i) => <span key={m} className={i === 1 ? "on" : ""}>{m}</span>)}</div>
      <div className="pane">
        <Sk w="46%" a />
        <div className="blk"><Sk w="80%" /><Sk w="64%" /><Sk w="72%" /></div>
        <div className="blk"><Sk w="58%" /><Sk w="88%" /></div>
      </div>
    </Browser>
  );
}

/* 02 — Aim Divine: destination explorer + student journey */
export function AimVisual() {
  const dest = ["Australia", "UK", "USA", "Canada", "Germany", "New Zealand", "Ireland"];
  const steps = ["Profile evaluation", "University selection", "Application support", "Visa preparation"];
  return (
    <Browser url="Study destinations">
      <div className="map">
        <Sk w="38%" a />
        <div className="dest">{dest.map((d, i) => <span key={d} className={i === 0 ? "on" : ""}>{d}</span>)}</div>
        <div className="journey">{steps.map((s, i) => <div key={s}><b>0{i + 1}</b>{s}</div>)}</div>
      </div>
    </Browser>
  );
}

/* 03 — ASPC Spices: brand website */
export function AspcVisual() {
  return (
    <Browser url="aspcspices.in">
      <div className="brand">
        <div className="wordmark">ASPC<span>Spices</span></div>
        <div className="sw"><i style={{ background: "#c2410c" }} /><i style={{ background: "#eab308" }} /><i style={{ background: "#65a30d" }} /><i style={{ background: "#57534e" }} /><i style={{ background: "#e7e5e4" }} /></div>
        <div className="steps"><span>Design</span><span>Build</span><span>Optimise</span><span>Maintain</span></div>
      </div>
    </Browser>
  );
}

/* 04 — Business Management Portal: AI catalog generation pipeline */
export function PortalVisual() {
  return (
    <div className="panel">
      <small>AI catalog generation</small>
      <div className="flow">
        <div className="nd">Product record</div>
        <div className="ar" />
        <div className="nd ai">AI model</div>
        <div className="ar" />
        <div className="outs"><div className="nd">Description</div><div className="nd">Specifications</div><div className="nd">Category</div></div>
      </div>
      <div className="chips"><span>10,000+ products</span><span>15+ REST APIs</span></div>
    </div>
  );
}

/* 05 — DebtWise: finance areas */
export function DebtVisual() {
  const t = [["Income", "58%"], ["Expenses", "72%"], ["Loans", "34%"], ["Savings", "46%"], ["Goals", "63%"]];
  return (
    <div className="tiles">
      {t.map(([n, w]) => (
        <div key={n} className="tile"><b>{n}</b><div className="bar" style={{ ["--w" as string]: w }} /></div>
      ))}
    </div>
  );
}
