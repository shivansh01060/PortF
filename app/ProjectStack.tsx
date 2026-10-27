"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { work, type Work } from "./data";
import { AimVisual, AspcVisual, DebtVisual, PortalVisual, SolarVisual } from "./ProjectVisuals";

type Layout = "right" | "left" | "wide";
type Look = { accent: string; layout: Layout; inset?: boolean; Visual?: () => ReactElement };
// per-project art direction, keyed by the item number in data.ts (unknown items fall back to a plain card)
const looks: Record<string, Look> = {
  "01": { accent: "#f5a524", layout: "right", Visual: SolarVisual },
  "02": { accent: "#22d3ee", layout: "wide", Visual: AimVisual },
  "03": { accent: "#e4572e", layout: "left", Visual: AspcVisual },
  "04": { accent: "#a78bfa", layout: "right", Visual: PortalVisual },
  "05": { accent: "#34d399", layout: "left", inset: true, Visual: DebtVisual },
};
const fallback: Look = { accent: "#61dafb", layout: "right" };

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(max-width: 700px)");
    const sync = () => setMobile(q.matches);
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, []);
  return mobile;
}

type CardProps = { item: Work; i: number; total: number; progress: MotionValue<number>; step: number; animate: boolean };

function StackCard({ item, i, total, progress, step, animate }: CardProps) {
  // card i is fully pinned once scroll progress reaches i / (total - 1); every later card then covers it a bit more
  const last = Math.max(1, total - 1);
  const start = Math.min(i / last, 0.999);
  const depth = total - 1 - i; // how many cards will still stack on top of this one
  const scale = useTransform(progress, [start, 1], [1, 1 - depth * step]);
  const bright = useTransform(progress, [start, 1], [1, Math.max(0.5, 1 - depth * 0.1)]);
  const filter = useMotionTemplate`brightness(${bright})`;

  const look = looks[item.n] ?? fallback;
  const Visual = look.Visual;
  const [idx, kind] = [item.n, item.type];

  const inner = (
    <>
      <div className="card-copy">
        <div className="row">
          <span className="idx">{idx}</span><span className="sep" /><span>{kind}</span>
          {item.date && <span className="date">{item.date}</span>}
        </div>
        <h3>{item.title}</h3>
        <div className="body">
          {item.role && <div className="role"><b>ROLE</b>{item.role}</div>}
          <p>{item.desc}</p>
          <div className="chips">{item.tags.map((t) => <span key={t}>{t}</span>)}</div>
          {item.link && (
            <span className="cta">{item.link.includes("github") ? "View on GitHub" : "Visit website"} <i>↗</i></span>
          )}
        </div>
      </div>
      {Visual && (
        <div className={`card-visual${look.inset ? " inset" : ""}`} aria-hidden="true"><Visual /></div>
      )}
    </>
  );

  const vars = { "--i": i, "--a": look.accent } as CSSProperties;
  const motionStyle = animate ? { scale, filter, transformOrigin: "50% 0%" } : undefined;
  const common = { className: "card", "data-n": item.n, "data-layout": Visual ? look.layout : "none", style: { ...vars, ...motionStyle } };

  return (
    <div className="sc-pin" style={{ zIndex: i + 1, ...vars }}>
      {item.link ? (
        <motion.a {...common} href={item.link} target="_blank" rel="noopener noreferrer">{inner}</motion.a>
      ) : (
        <motion.div {...common}>{inner}</motion.div>
      )}
    </div>
  );
}

export default function ProjectStack() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const animate = !reduce;

  return (
    <div ref={ref} className={`cards${animate ? "" : " sc-flat"}`} style={{ ["--n" as string]: work.length }}>
      {work.map((item, i) => (
        <StackCard key={item.n} item={item} i={i} total={work.length} progress={scrollYProgress} step={mobile ? 0.03 : 0.05} animate={animate} />
      ))}
    </div>
  );
}
