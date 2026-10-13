import { profile, stats, experience, projects, leadership, skills, achievements } from "./data";
import {
  Reveal, TopBar, MoleculeField, RotatingWord, Stats, Experience,
  TiltCard, Skills, Magnetic, CursorGlow, CopyEmail,
} from "./interactive";

const nav = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Leadership", "#leadership"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="section">
      <Reveal className="section-head">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </Reveal>
      <div>{children}</div>
    </section>
  );
}

const marquee = [
  "ESG", "Scope 1–3 Emissions", "Water Footprinting", "GRI Reporting", "ISO 14001",
  "Biotechnology", "Cooling Tower Optimisation", "Power BI", "SA8000", "Circular Economy",
];

export default function Home() {
  return (
    <>
      <CursorGlow />
      <TopBar nav={nav} />

      <div className="hero-wrap">
        <MoleculeField />
        <main id="top" className="wrap">
          <section className="hero">
            <p className="eyebrow fade-up" style={{ animationDelay: "0ms" }}>
              <span className="pulse" /> Currently: Sustainability Intern, Jindal Steel Oman
            </p>
            <h1 className="fade-up" style={{ animationDelay: "120ms" }}>
              Making heavy industry <RotatingWord words={["lighter", "cleaner", "smarter", "greener"]} /> on the planet.
            </h1>
            <p className="lede fade-up" style={{ animationDelay: "240ms" }}>{profile.headline}</p>
            <div className="cta fade-up" style={{ animationDelay: "360ms" }}>
              <Magnetic className="primary" href={`mailto:${profile.email}`}>Get in touch</Magnetic>
              <Magnetic href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</Magnetic>
            </div>
            <a href="#about" className="scroll-cue" aria-label="Scroll to About"><span /></a>
          </section>
        </main>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}>{m}<i>✦</i></span>
          ))}
        </div>
      </div>

      <div className="wrap">
        <Stats stats={stats} />

        <Section id="about" eyebrow="01" title="About">
          <div className="about">
            {profile.summary.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 120}>{p}</Reveal>
            ))}
          </div>
        </Section>

        <Section id="experience" eyebrow="02" title="Experience">
          <Experience items={experience} />
        </Section>

        <Section id="projects" eyebrow="03" title="Research projects">
          <div className="cards">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <TiltCard className="card">
                  <span className="card-num">0{i + 1}</span>
                  <span className="period">{p.period} · Manipal University Jaipur</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                  <div className="chips">
                    {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="leadership" eyebrow="04" title="Leadership & brand roles">
          <div className="lead-grid">
            {leadership.map((l, i) => (
              <Reveal key={l.org + l.role} delay={(i % 2) * 90}>
                <TiltCard className="lead">
                  <span className="period">{l.period}</span>
                  <h3>{l.role}</h3>
                  <p className="org">{l.org}</p>
                  {l.note && <p className="note">{l.note}</p>}
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="skills" eyebrow="05" title="Skills">
          <Skills groups={skills} />
        </Section>

        <Section id="beyond" eyebrow="06" title="Achievements & beyond">
          <dl className="achievements">
            {achievements.map((a, i) => (
              <Reveal key={a.title} delay={(i % 2) * 90} className="ach">
                <dt>{a.title}</dt>
                <dd>{a.detail}</dd>
              </Reveal>
            ))}
          </dl>
        </Section>

        <Reveal as="section" id="contact" className="contact">
          <div className="contact-orb" aria-hidden="true" />
          <h2>Let's work on something sustainable.</h2>
          <p>Open to graduate roles and collaborations in ESG, sustainability consulting and biotech.</p>
          <div className="cta">
            <Magnetic className="primary" href={`mailto:${profile.email}`}>{profile.email}</Magnetic>
            <CopyEmail email={profile.email} />
            <Magnetic className="ghost-light" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</Magnetic>
          </div>
        </Reveal>
      </div>

      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} Pihu Malhotra</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
