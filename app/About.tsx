"use client";

import { useRef, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { stack, type StackGroup } from "./data";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
// one orchestrated entrance: label, then headline, then each paragraph
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

type LayerProps = {
  g: StackGroup;
  i: number;
  total: number;
  progress: MotionValue<number>;
  animate: boolean;
};

// each layer lights up as scroll progress through the diagram reaches it (and dims again on reverse scroll)
function Layer({ g, i, total, progress, animate }: LayerProps) {
  const from = (i / total) * 0.75;
  const opacity = useTransform(progress, [from, from + 0.22], [0.3, 1]);
  const y = useTransform(progress, [from, from + 0.22], [14, 0]);
  const style = { "--g": g.accent, "--i": i } as CSSProperties;

  return (
    <motion.li
      className="ab-layer"
      style={animate ? { ...style, opacity, y } : style}
    >
      <i className="ab-node" aria-hidden="true" />
      <div className="ab-card">
        <h4>{g.title}</h4>
        <ul className="ab-items">
          {g.items.map((t) => (
            <li key={t.name} className="ab-item">
              <span className="m" aria-hidden="true">
                {t.mark}
              </span>
              {t.name}
            </li>
          ))}
        </ul>
        {g.note && <p className="ab-note">{g.note}</p>}
      </div>
    </motion.li>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function Mindset({ animate }: { animate: boolean }) {
  return (
    <motion.div
      className="mind"
      variants={container}
      initial={animate ? "hidden" : "show"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="mind-top" variants={rise}>
        <span>A LITTLE ABOUT ME</span>
        <span>01 / THE MINDSET</span>
      </motion.div>
      <motion.h3 variants={rise}>
        I was never very good at thinking inside the box.
      </motion.h3>
      <motion.div className="mind-copy" variants={rise}>
        <p>
          I&apos;m drawn to ideas that challenge the obvious, questions without
          easy answers, and possibilities that haven&apos;t been explored yet. I
          like connecting dots that don&apos;t seem related, experimenting with
          different perspectives, and finding unexpected ways to look at
          familiar things.
        </p>
        <p>
          I don&apos;t believe in having everything figured out. I&apos;d rather
          stay curious, embrace the uncomfortable parts of learning, and keep
          becoming someone I couldn&apos;t have imagined a few years ago.
        </p>
      </motion.div>
      <motion.div className="mind-cards" variants={container}>
        <motion.article
          className="mind-card"
          variants={rise}
          style={{ "--g": "#7cc4f5" } as CSSProperties}
        >
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="3" />
            <circle cx="19" cy="5" r="2" />
            <path d="M20.34 6.48A10 10 0 0 1 10.27 21.85" />
            <path d="M3.66 17.52A10 10 0 0 1 13.74 2.15" />
          </svg>
          <small>HOW I THINK</small>
          <h4>Question the obvious.</h4>
          <p>Curiosity before assumptions. Possibilities before limitations.</p>
        </motion.article>
        <motion.article
          className="mind-card"
          variants={rise}
          style={{ "--g": "#b794f6" } as CSSProperties}
        >
          <svg {...iconProps}>
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <small>HOW I GROW</small>
          <h4>Never stay still.</h4>
          <p>Learn relentlessly. Experiment often. Evolve intentionally.</p>
        </motion.article>
      </motion.div>
      <motion.div className="mind-quote" variants={rise}>
        <small>A PERSONAL PHILOSOPHY</small>
        <p>Be curious enough to start. Be ambitious enough to continue.</p>
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  const reduce = useReducedMotion();
  const animate = !reduce;
  // progress is measured on the grid cell (not the sticky diagram inside it) so it keeps advancing while the diagram is pinned
  const side = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: side,
    offset: ["start 85%", "end 55%"],
  });
  const spine = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  // the grid texture drifts slightly against the content
  const drift = useTransform(scrollYProgress, [0, 1], [-22, 22]);

  return (
    <section className="about" id="about">
      <motion.div
        variants={container}
        initial={animate ? "hidden" : "show"}
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div className="ab-head" variants={rise}>
          <h2>ABOUT</h2>
          <span className="rule" aria-hidden="true" />
          <span>Full-stack developer</span>
        </motion.div>

        <div className="ab-intro">
          <motion.h3 variants={rise}>
            From the interface to the database, with AI built in.
          </motion.h3>
          {/* <div className="ab-copy">
            <motion.p variants={rise}>
              I build full-stack web products with React, Node.js, Express and
              MongoDB. I work in TypeScript and Tailwind CSS and design REST
              APIs on MongoDB and PostgreSQL.
            </motion.p>
            <motion.p variants={rise}>
              I also bring Generative AI into real products, like a catalog
              generator trained on 10,000+ records.
            </motion.p>
          </div> */}
        </div>
      </motion.div>

      <div className="ab-grid">
        <Mindset animate={animate} />

        <div className="ab-side" ref={side}>
          <motion.div
            className="ab-stack"
            variants={rise}
            initial={animate ? "hidden" : "show"}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="ab-gridbg"
              aria-hidden="true"
              style={animate ? { y: drift } : undefined}
            />
            <div className="ab-layers">
              <span className="ab-spine" aria-hidden="true">
                <motion.i style={{ scaleY: animate ? spine : 1 }} />
              </span>
              <ul className="ab-list" aria-label="Technology stack">
                {stack.map((g, i) => (
                  <Layer
                    key={g.title}
                    g={g}
                    i={i}
                    total={stack.length}
                    progress={scrollYProgress}
                    animate={animate}
                  />
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
