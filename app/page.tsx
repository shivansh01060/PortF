"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL, PHONE_LABEL, PHONE_TEL } from "./data";
import About from "./About";
import ProjectStack from "./ProjectStack";

type Particle = {
  tx: number;
  ty: number;
  x: number;
  y: number;
  l: number;
  h: number;
  r: number;
  p: number;
};
type Dust = { x: number; y: number; a: number; v: number };

const links = [
  ["HOME", "#home"],
  ["ABOUT", "#about"],
  ["PROJECTS", "#projects"],
  ["CONTACT", "#contact"],
];
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const bigRef = useRef<HTMLAnchorElement>(null);
  const phoneRef = useRef<HTMLAnchorElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const cv = canvasRef.current,
      word = wordRef.current,
      dot = dotRef.current,
      nav = navRef.current;
    const sub = subRef.current,
      stage = stageRef.current,
      bar = barRef.current,
      big = bigRef.current,
      phone = phoneRef.current;
    if (
      !cv ||
      !word ||
      !dot ||
      !nav ||
      !sub ||
      !stage ||
      !bar ||
      !big ||
      !phone
    )
      return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let dead = false,
      reveal = false,
      raf = 0,
      t = 0,
      sp = 0,
      W = 0,
      H = 0;
    let dust: Dust[] = [],
      pts: Particle[] = [];
    const mouse = { x: -999, y: -999 };
    const img = new Image();

    /* ---------- particle portrait ---------- */
    const build = () => {
      if (!img.complete || !W) return;
      const S = Math.min(H * 0.78, W * 0.9),
        x0 = (W - S) / 2,
        y0 = H * 0.04,
        N = Math.round(S / 4.2);
      const off = document.createElement("canvas");
      off.width = off.height = N;
      const o2 = off.getContext("2d");
      if (!o2) return;
      o2.drawImage(img, 0, 0, N, N);
      const d = o2.getImageData(0, 0, N, N).data;
      const next: Particle[] = [];
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const k = (j * N + i) * 4;
          const l = (d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11) / 255;
          const fx = i / N - 0.5,
            fy = j / N - 0.5;
          const fade = Math.max(0, 1 - Math.hypot(fx * 1.05, fy * 1.05) * 0.95);
          if (l * fade > 0.16) {
            next.push({
              tx: x0 + (i * S) / N,
              ty: y0 + (j * S) / N,
              x: Math.random() * W,
              y: Math.random() * H,
              l: Math.min(1, l * 1.6) * fade + 0.15,
              h: 215 + Math.random() * 25,
              r: (S / N) * 0.42,
              p: Math.random(),
            });
          }
        }
      }
      pts = next;
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dust = Array.from({ length: Math.min(700, (W * H) / 1800 || 0) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        a: Math.random() * 0.6 + 0.1,
        v: (Math.random() - 0.5) * 0.15,
      }));
      build();
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      t++;
      ctx.clearRect(0, 0, W, H);
      for (const p of dust) {
        p.y += p.v;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.fillStyle = `rgba(200,210,230,${p.a * (0.6 + 0.4 * Math.sin(t / 40 + p.x))})`;
        ctx.fillRect(p.x, p.y, 1.2, 1.2);
      }
      const k = reveal ? 0.06 : 0,
        fa = 1 - sp * 0.92;
      for (const p of pts) {
        const tx = p.tx + (p.p - 0.5) * sp * W * 0.9;
        const ty = p.ty - sp * H * 0.45 * (0.3 + p.p);
        if (!reveal) {
          p.x += (Math.random() - 0.5) * 1.2;
          p.y += (Math.random() - 0.5) * 1.2;
        } else {
          const dx = p.x - mouse.x,
            dy = p.y - mouse.y,
            dd = dx * dx + dy * dy;
          if (dd < 6400) {
            const f = ((80 - Math.sqrt(dd)) / 80) * 6,
              a = Math.atan2(dy, dx);
            p.x += Math.cos(a) * f;
            p.y += Math.sin(a) * f;
          }
          p.x += (tx - p.x) * k;
          p.y += (ty - p.y) * k;
        }
        const tw = 0.7 + 0.3 * Math.sin(t / 25 + p.p * 20);
        ctx.fillStyle = `hsla(${p.h},45%,${55 + p.l * 35}%,${(reveal ? p.l * fa : 0.12) * tw})`;
        ctx.fillRect(p.x, p.y, p.r * 2, p.r * 2);
      }
    };

    /* ---------- intro animation ---------- */
    const setWord = (text: string, tumble: boolean) => {
      word.innerHTML = "";
      return [...text].map((ch) => {
        const s = document.createElement("span");
        s.textContent = ch;
        if (tumble) {
          s.style.transition = "none";
          s.style.opacity = "0";
          s.style.transform = `translate(${(Math.random() - 0.5) * 300}px,${-200 - Math.random() * 200}px) rotate(${(Math.random() - 0.5) * 160}deg)`;
        }
        word.appendChild(s);
        return s;
      });
    };

    const intro = async () => {
      dot.style.opacity = "1";
      await wait(700);
      if (dead) return;
      dot.style.width = "14px";
      dot.style.height = "90px";
      dot.style.borderRadius = "7px";
      await wait(900);
      if (dead) return;
      dot.style.opacity = "0";
      let sp2 = setWord("SHIVANSH", true);
      void word.offsetWidth;
      sp2.forEach((s, i) =>
        setTimeout(() => {
          s.style.transition =
            "transform 1s cubic-bezier(.2,.9,.2,1),opacity .5s";
          s.style.opacity = "1";
          s.style.transform = "none";
        }, i * 90),
      );
      await wait(2100);
      if (dead) return;
      sp2.forEach((s) => (s.style.opacity = "0"));
      await wait(500);
      if (dead) return;
      sp2 = setWord("PORTFOLIO", false);
      sp2.forEach((s) => (s.style.opacity = "0"));
      void word.offsetWidth;
      sp2.forEach((s, i) => setTimeout(() => (s.style.opacity = "1"), i * 70));
      await wait(900);
      if (dead) return;
      sub.classList.add("on");
      await wait(500);
      if (dead) return;
      nav.classList.add("on");
      reveal = true;
    };

    /* ---------- scroll-driven transformations ---------- */
    // About manages its own heading and motion, so it is excluded here
    const heads = [
      ...document.querySelectorAll<HTMLElement>("section:not(.about) h2"),
    ];
    const vp = (el: Element, a: number, b: number) =>
      clamp(
        (innerHeight * a - el.getBoundingClientRect().top) / (innerHeight * b),
      );

    const onScroll = () => {
      const y = scrollY,
        vh = innerHeight;
      sp = clamp(y / (vh * 0.9));
      bar.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - vh)})`;
      stage.style.transform = `translateY(${-sp * vh * 0.1}px) scale(${1 + sp * 0.4})`;
      stage.style.opacity = String(1 - sp * 1.15);
      heads.forEach((h) => {
        const q = vp(h, 1, 0.3);
        h.style.opacity = String(q);
        h.style.transform = `translateY(${(1 - q) * 30}px)`;
      });
      // email and phone share the same size and the same scroll-in effect, each measured from its own position
      for (const el of [big, phone]) {
        const b = vp(el, 1, 0.7);
        el.style.transform = `scale(${0.6 + 0.4 * b})`;
        el.style.opacity = String(0.2 + 0.8 * b);
      }
    };
    const onScrollRaf = () => requestAnimationFrame(onScroll);
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -999;
    };
    let lw = innerWidth,
      lh = innerHeight;
    const onResize = () => {
      // mobile URL-bar show/hide fires resize; don't rebuild the particles for that
      if (innerWidth !== lw || Math.abs(innerHeight - lh) > 150) {
        lw = innerWidth;
        lh = innerHeight;
        size();
      }
      onScroll();
    };

    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    addEventListener("resize", onResize);
    addEventListener("scroll", onScrollRaf, { passive: true });
    img.onload = size;
    img.src = "/portrait.jpg";
    size();
    onScroll();
    frame();
    intro();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      removeEventListener("resize", onResize);
      removeEventListener("scroll", onScrollRaf);
    };
  }, []);

  return (
    <>
      <div id="bar" ref={barRef} />
      <header className="hero" id="home">
        <canvas ref={canvasRef} />
        <div className="dot" ref={dotRef} />
        <nav ref={navRef}>
          <b>SHIVANSH NARAYAN</b>
          <ul>
            <li>
              <a href="#home">HOME</a>
            </li>
            <li>
              <a href="#about">ABOUT</a>
            </li>
            <li>
              <a href="#projects">PROJECTS</a>
            </li>
            <li>
              <a href="#contact">CONTACT</a>
            </li>
          </ul>
          <button
            type="button"
            className="burger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
          <div
            className={`menu${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {links.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
        </nav>
        <div className="stage" ref={stageRef}>
          <div className="word" ref={wordRef} />
          <div className="sub" ref={subRef}>
            <b>
              Full Stack <span style={{ fontWeight: 800 }}>Developer</span>
            </b>
            <i>MERN · TypeScript · AI</i>
            <a className="pill" href="#contact">
              Contact
            </a>
          </div>
        </div>
      </header>

      <About />

      <section id="projects">
        <h2>WORK &amp; PROJECTS</h2>
        <ProjectStack />
      </section>

      <section className="contact" id="contact">
        <h2>CONTACT</h2>
        <a className="big" ref={bigRef} href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        <a className="big" ref={phoneRef} href={`tel:${PHONE_TEL}`}>
          {PHONE_LABEL}
        </a>
      </section>
      <footer>© 2026 Shivansh Narayan</footer>
    </>
  );
}
