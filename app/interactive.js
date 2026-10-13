"use client";

import { useEffect, useRef, useState } from "react";

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Reveal on scroll ---------- */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion()) { setShown(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- Scroll progress + active nav ---------- */
export function TopBar({ nav }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
      let current = "";
      for (const [, href] of nav) {
        const el = document.querySelector(href);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) current = href;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [nav]);

  return (
    <header className="topbar">
      <div className="progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="wrap topbar-inner">
        <a href="#top" className="mark"><span className="mark-dot" />Pihu Malhotra</a>
        <nav aria-label="Sections" className={open ? "open" : ""}>
          {nav.map(([label, href]) => (
            <a key={href} href={href} className={active === href ? "active" : ""} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="topbar-actions">
          <ThemeToggle />
          <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Theme toggle ---------- */
function ThemeToggle() {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    const t = document.documentElement.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(t);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    setTheme(next);
  };
  return (
    <button className="icon-btn" onClick={toggle} aria-label="Toggle colour theme" title="Toggle theme">
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
      )}
    </button>
  );
}

/* ---------- Hero: interactive molecule / water-network canvas ---------- */
export function MoleculeField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], raf;
    const mouse = { x: -9999, y: -9999 };
    const still = reduceMotion();

    const color = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 11000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.2 + 1.2,
        warm: Math.random() < 0.18,
      }));
    };

    const draw = () => {
      const accent = color("--accent"), sand = color("--sand");
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!still) {
          const dx = n.x - mouse.x, dy = n.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const f = (1 - Math.sqrt(d2) / 140) * 0.6;
            n.vx += (dx / Math.sqrt(d2 + 1)) * f;
            n.vy += (dy / Math.sqrt(d2 + 1)) * f;
          }
          n.vx *= 0.96; n.vy *= 0.96;
          n.vx += (Math.random() - 0.5) * 0.03; n.vy += (Math.random() - 0.5) * 0.03;
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          n.x = Math.max(0, Math.min(w, n.x)); n.y = Math.max(0, Math.min(h, n.y));
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.globalAlpha = (1 - d / 120) * 0.35;
            ctx.strokeStyle = accent;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = n.warm ? sand : accent;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!still) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };

    resize(); draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return <canvas ref={ref} className="molecules" aria-hidden="true" />;
}

/* ---------- Rotating word ---------- */
export function RotatingWord({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduceMotion()) return;
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="rotator" aria-live="polite">
      <span key={i} className="rotator-word">{words[i]}</span>
    </span>
  );
}

/* ---------- Count-up stats ---------- */
function parseStat(v) {
  const m = v.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!m) return null;
  const num = parseFloat(m[2].replace(/,/g, ""));
  const decimals = (m[2].split(".")[1] || "").length;
  return { pre: m[1], num, post: m[3], decimals, comma: m[2].includes(",") };
}

function CountUp({ value }) {
  const ref = useRef(null);
  const p = parseStat(value);
  const [n, setN] = useState(p ? 0 : null);
  useEffect(() => {
    if (!p) return;
    if (reduceMotion()) { setN(p.num); return; }
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now(), dur = 1600;
      const tick = (t) => {
        const k = Math.min(1, (t - start) / dur);
        setN(p.num * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!p) return <span>{value}</span>;
  const shown = p.comma
    ? Math.round(n).toLocaleString("en-US")
    : n.toFixed(p.decimals);
  return <span ref={ref}>{p.pre}{shown}{p.post}</span>;
}

export function Stats({ stats }) {
  return (
    <section className="stats" aria-label="Highlights">
      {stats.map((s, i) => (
        <Reveal key={s.label} className="stat" delay={i * 90}>
          <div className="stat-value"><CountUp value={s.value} /></div>
          <div className="stat-label">{s.label}</div>
        </Reveal>
      ))}
    </section>
  );
}

/* ---------- Experience: filter + expanding timeline ---------- */
export function Experience({ items }) {
  const tags = ["All", ...Array.from(new Set(items.map((e) => e.tag)))];
  const [filter, setFilter] = useState("All");
  const [openIdx, setOpenIdx] = useState(0);
  const railRef = useRef(null);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = railRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const k = (window.innerHeight * 0.6 - r.top) / r.height;
      setFill(Math.max(0, Math.min(1, k)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [filter]);

  const shown = items.map((e, i) => ({ ...e, i })).filter((e) => filter === "All" || e.tag === filter);

  return (
    <div>
      <div className="filters" role="tablist" aria-label="Filter experience">
        {tags.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={filter === t}
            className={`filter ${filter === t ? "on" : ""}`}
            onClick={() => { setFilter(t); setOpenIdx(items.findIndex((e) => t === "All" || e.tag === t)); }}
          >
            {t}
            <span className="count">{t === "All" ? items.length : items.filter((e) => e.tag === t).length}</span>
          </button>
        ))}
      </div>

      <ol className="timeline" ref={railRef}>
        <span className="rail" aria-hidden="true"><span style={{ transform: `scaleY(${fill})` }} /></span>
        {shown.map((e, k) => {
          const isOpen = openIdx === e.i;
          return (
            <Reveal as="li" key={e.role + e.period} delay={k * 60} className={`job ${isOpen ? "open" : ""}`}>
              <span className="node" aria-hidden="true" />
              <button className="job-head" aria-expanded={isOpen} onClick={() => setOpenIdx(isOpen ? -1 : e.i)}>
                <div className="job-title">
                  <span className="period">{e.period} · {e.place}</span>
                  <h3>{e.role}</h3>
                  <p className="org">{e.org}</p>
                </div>
                <span className="tag">{e.tag}</span>
                <span className="chev" aria-hidden="true">+</span>
              </button>
              <div className="job-body">
                <div>
                  <ul>
                    {e.points.map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Tilt + spotlight card ---------- */
export function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (reduceMotion()) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 7}deg) translateY(-3px)`;
  };
  const onLeave = () => { ref.current.style.transform = ""; };
  return (
    <article ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </article>
  );
}

/* ---------- Skills explorer ---------- */
export function Skills({ groups }) {
  const [active, setActive] = useState(0);
  const g = groups[active];
  return (
    <div className="skills-x">
      <div className="skill-tabs" role="tablist">
        {groups.map((x, i) => (
          <button key={x.group} role="tab" aria-selected={i === active}
            className={`skill-tab ${i === active ? "on" : ""}`} onClick={() => setActive(i)}>
            <span className="skill-num">0{i + 1}</span>
            <span>{x.group}</span>
            <span className="skill-count">{x.items.length}</span>
          </button>
        ))}
      </div>
      <div className="skill-panel" key={active}>
        {g.items.map((s, i) => (
          <span key={s} className="skill-pill" style={{ animationDelay: `${i * 40}ms` }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Magnetic button ---------- */
export function Magnetic({ children, className = "", ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (reduceMotion()) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
  };
  const onLeave = () => { ref.current.style.transform = ""; };
  return (
    <a ref={ref} className={`btn magnetic ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
    </a>
  );
}

/* ---------- Cursor glow (desktop only) ---------- */
export function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    if (reduceMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    let x = 0, y = 0, tx = 0, ty = 0, raf;
    const move = (e) => { tx = e.clientX; ty = e.clientY; el.style.opacity = 1; };
    const loop = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}

/* ---------- Copy email ---------- */
export function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.location.href = `mailto:${email}`; }
  };
  return (
    <button className="btn ghost-light" onClick={copy}>
      {copied ? "Copied ✓" : "Copy email"}
    </button>
  );
}
