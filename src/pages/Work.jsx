import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import Marquee from "../components/Marquee";

const HERO_LINE1 = "VINAY".split("");
const HERO_LINE2 = "DODLA".split("");

const PROJECTS = [
  {
    num: "01",
    name: "StockSense AI",
    tags: ["React", "FastAPI", "Gemini AI", "Recharts"],
    desc: "Full-stack AI stock dashboard with real-time market data, technical indicators, and AI-generated insights.",
    live: "https://stocksense-ai-ten.vercel.app",
    github: "https://github.com/vinay23is/stocksense-ai",
  },
  {
    num: "02",
    name: "Financial Docs RAG",
    tags: ["LangChain", "ChromaDB", "Gemini", "Streamlit"],
    desc: "RAG chatbot for SEC 10-K filings. Ask Apple, Alphabet, or Tesla anything.",
    live: "https://financial-docs-rag-bky4wws43jxf6xxvty4yhn.streamlit.app",
    github: "https://github.com/vinay23is/financial-docs-rag",
  },
  {
    num: "03",
    name: "HireIQ Resume Screener",
    tags: ["Multi-Agent AI", "Gemini Flash", "Streamlit"],
    desc: "Multi-agent AI that scores resumes against job descriptions with keyword gap analysis.",
    live: "https://smart-resume-screener-amn8x57pgp2fzg4phappiuo.streamlit.app",
    github: "https://github.com/vinay23is/smart-resume-screener",
  },
  {
    num: "04",
    name: "Anchor",
    tags: ["React", "Firebase", "Gemini AI", "Vercel"],
    desc: "AI-powered peer support platform connecting users with humans or AI for emotional support.",
    live: "https://anchor-app-git-main-vinay-dodlas-projects.vercel.app/login",
    github: "https://github.com/vinay23is/anchor-app",
  },
];

const EXPERIENCE = [
  {
    id: "ku-nccs",
    company: "University of Kansas — NCCS",
    role: "Graduate Research Assistant",
    period: "Jan 2024 – Jan 2025",
    bullets: [
      "Developed 3D visual simulations for robotic construction systems using OpenGL and C++.",
      "Built Python data analysis and visualization pipelines.",
      "Collaborated across engineering and CS teams.",
    ],
  },
  {
    id: "ku-grader",
    company: "University of Kansas",
    role: "Grader — MATH 126 (Calculus)",
    period: "Jan 2024 – Jan 2025",
    bullets: [
      "Evaluated assignments and exams with accuracy.",
      "Provided constructive feedback to students.",
    ],
  },
  {
    id: "ku-fafsa",
    company: "University of Kansas",
    role: "FAFSA Advisor",
    period: "May 2024 – Aug 2024",
    bullets: [
      "Guided students and families through FAFSA completion via virtual and in-person sessions.",
      "Improved completion outcomes through direct outreach.",
    ],
  },
  {
    id: "ku-it",
    company: "University of Kansas",
    role: "IT Student Technician",
    period: "Aug 2023 – Jan 2024",
    bullets: [
      "Resolved IT issues via calls and chat.",
      "Installed operating systems and reimaged library loaner laptops.",
    ],
  },
  {
    id: "ltimindtree",
    company: "LTIMindtree",
    role: "Software Engineering Intern",
    period: "Jan 2023 – May 2023 · Pune, India",
    bullets: [
      "Built features using Java, Python, and JavaScript in collaborative agile workflows.",
    ],
  },
];

const EDUCATION = [
  {
    school: "University of Kansas",
    degree: "Master of Science, Computer Science",
    period: "2023 – 2025 · Lawrence, KS",
  },
  {
    school: "Sree Vidyanikethan Engineering College",
    degree: "Bachelor of Technology, Computer Science",
    period: "2019 – 2023 · Tirupati, India",
  },
];

const SKILLS = [
  { category: "AI / ML", items: ["LangChain", "RAG", "Multi-Agent AI", "Gemini", "TensorFlow Lite", "Scikit-learn"] },
  { category: "Languages", items: ["Python", "JavaScript", "TypeScript", "Java", "C++"] },
  { category: "Frontend", items: ["React", "Vite", "Tailwind", "Recharts", "HTML/CSS"] },
  { category: "Backend", items: ["FastAPI", "Firebase", "Firestore", "REST APIs"] },
  { category: "Cloud / IoT", items: ["AWS IoT Core", "MQTT", "ESP32", "Vercel", "Render"] },
  { category: "Tools", items: ["Git", "Docker", "Streamlit", "OpenGL"] },
];

function MagneticButton({ children, href, filled, target }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target || (href?.startsWith("http") ? "_blank" : undefined)}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        x: springX,
        y: springY,
        display: "inline-block",
        padding: "0.75rem 2rem",
        border: "1px solid #e8ff47",
        borderRadius: "2px",
        fontFamily: "DM Mono, monospace",
        fontSize: "0.75rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        textDecoration: "none",
        backgroundColor: filled ? "#e8ff47" : "transparent",
        color: filled ? "#080808" : "#e8ff47",
        fontWeight: filled ? 600 : 400,
        transition: "background-color 0.2s, color 0.2s",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
    >
      {children}
    </motion.a>
  );
}

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "80px 1fr auto",
        gap: "2rem",
        alignItems: "center",
        padding: "2rem",
        border: "1px solid #1f1f1f",
        borderLeft: hovered ? "3px solid #e8ff47" : "1px solid #1f1f1f",
        backgroundColor: hovered ? "#111111" : "transparent",
        transform: hovered ? "translateX(6px)" : "translateX(0)",
        transition: "all 0.25s ease",
        borderRadius: "2px",
      }}
    >
      <span
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "3rem",
          fontWeight: 800,
          color: "#1f1f1f",
          lineHeight: 1,
        }}
      >
        {project.num}
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: 0,
          }}
        >
          {project.name}
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "0.65rem",
                color: "#e8ff47",
                border: "1px solid #e8ff47",
                borderRadius: "100px",
                padding: "2px 10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <p
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.8rem",
            color: "#555555",
            margin: 0,
            lineHeight: 1.6,
            maxWidth: "520px",
          }}
        >
          {project.desc}
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555555", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8ff47")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
          title="Live site"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555555", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8ff47")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
          title="GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .project-card-grid {
            grid-template-columns: 50px 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

function ExperienceEntry({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "2rem",
        paddingLeft: "2rem",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "-5px",
          top: "6px",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          border: "2px solid #e8ff47",
          backgroundColor: "#080808",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#f0f0f0",
          }}
        >
          {item.company}
        </span>
        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.72rem",
            color: "#e8ff47",
          }}
        >
          {item.role}
        </span>
        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.68rem",
            color: "#555555",
            marginBottom: "0.4rem",
          }}
        >
          {item.period}
        </span>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {item.bullets.map((b, bi) => (
            <li
              key={bi}
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "0.75rem",
                color: "#888888",
                lineHeight: 1.6,
                display: "flex",
                gap: "0.6rem",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "#e8ff4766", flexShrink: 0, marginTop: "2px" }}>—</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function EducationEntry({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "2rem",
        paddingLeft: "2rem",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "-5px",
          top: "6px",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          border: "2px solid #e8ff47",
          backgroundColor: "#080808",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#f0f0f0",
          }}
        >
          {item.school}
        </span>
        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.72rem",
            color: "#e8ff47",
          }}
        >
          {item.degree}
        </span>
        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.68rem",
            color: "#555555",
          }}
        >
          {item.period}
        </span>
      </div>
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return (
    <span
      style={{
        fontFamily: "DM Mono, monospace",
        fontSize: "0.65rem",
        color: "#555555",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        display: "block",
        marginBottom: "1rem",
      }}
    >
      {children}
    </span>
  );
}

export default function Work() {
  const heroRef = useRef(null);

  return (
    <div>
      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "8rem 2rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Available tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.7rem",
            color: "#e8ff47",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            border: "1px solid #e8ff4733",
            borderRadius: "2px",
            padding: "6px 16px",
            marginBottom: "3rem",
          }}
        >
          [ Available for work · Open to relocation ]
        </motion.div>

        {/* Giant name */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(5rem, 16vw, 14rem)",
              fontWeight: 800,
              lineHeight: 0.9,
              color: "#f0f0f0",
              letterSpacing: "-0.02em",
              overflow: "hidden",
            }}
          >
            <div style={{ overflow: "hidden" }}>
              {HERO_LINE1.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.5 + i * 0.06,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <div style={{ overflow: "hidden" }}>
              {HERO_LINE2.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.7 + i * 0.06,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.8rem",
            color: "#555555",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          MS Computer Science &nbsp;·&nbsp; AI Engineer &nbsp;·&nbsp; Builder
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          <MagneticButton href="#work-section" filled>
            View Work
          </MagneticButton>
          <MagneticButton href="/resume.html" target="_blank">
            Download Resume
          </MagneticButton>
        </motion.div>

        {/* Marquee at bottom of hero */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Marquee />
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="work-section"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "6rem 2rem",
        }}
      >
        <SectionLabel>03 — WORK</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: "0 0 3rem",
          }}
        >
          Selected Projects
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.num} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem 6rem",
        }}
      >
        <SectionLabel>04 — EXPERIENCE</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: "0 0 3rem",
          }}
        >
          Experience
        </motion.h2>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "2.5rem",
            paddingLeft: "1rem",
          }}
        >
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#1f1f1f",
            }}
          />
          {EXPERIENCE.map((item, i) => (
            <ExperienceEntry key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem 6rem",
        }}
      >
        <SectionLabel>05 — EDUCATION</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: "0 0 3rem",
          }}
        >
          Education
        </motion.h2>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "2.5rem",
            paddingLeft: "1rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#1f1f1f",
            }}
          />
          {EDUCATION.map((item, i) => (
            <EducationEntry key={item.school} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem 8rem",
        }}
      >
        <SectionLabel>06 — SKILLS</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: "0 0 3rem",
          }}
        >
          Skills
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {SKILLS.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
              style={{
                padding: "1.5rem",
                border: "1px solid #1f1f1f",
                borderRadius: "2px",
                backgroundColor: "#111111",
              }}
            >
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.65rem",
                  color: "#e8ff47",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "1rem",
                }}
              >
                {group.category}
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {group.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: "0.7rem",
                      color: "#f0f0f0",
                      backgroundColor: "#080808",
                      border: "1px solid #1f1f1f",
                      borderRadius: "100px",
                      padding: "3px 10px",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
