import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import Marquee from "../components/Marquee";

// Three.js is heavy — code-split it so it never blocks first paint.
const ParticleBackground = lazy(() => import("../components/ParticleBackground"));

const HERO_LINE1 = "VINAY".split("");
const HERO_LINE2 = "DODLA".split("");

// Featured work — ordered to show range across backend, data engineering,
// distributed systems, and applied AI/ML in the first few cards.
const FEATURED_PROJECTS = [
  {
    num: "01",
    name: "PulseOps",
    tags: ["Java", "Spring Boot", "Redis", "PostgreSQL", "Docker", "React"],
    desc: "API uptime-monitoring and incident-alerting platform. Redis-backed workers poll registered endpoints on a schedule, persist results to Postgres, and raise alerts when a service degrades. JWT auth, public status pages, a /metrics endpoint, and Docker Compose deployment.",
    live: "https://pulseops-frontend.onrender.com",
    github: "https://github.com/vinay23is/pulseops-api-monitoring-paas",
  },
  {
    num: "02",
    name: "Fraud Detection Pipeline",
    tags: ["Python", "Kafka", "Redis", "XGBoost", "FastAPI"],
    desc: "Real-time transaction scoring. Kafka streams transactions, Redis holds rolling per-account velocity features computed on the fly, and an XGBoost model behind FastAPI scores each event. Model artifacts are versioned and a dashboard tracks live scoring metrics.",
    live: "https://fraud-detection-pipeline-pdv9.onrender.com/docs",
    github: "https://github.com/vinay23is/fraud-detection-pipeline",
  },
  {
    num: "03",
    name: "Job Data Ingestion Pipeline",
    tags: ["AWS Lambda", "S3", "Snowflake", "Snowpipe", "SQL"],
    desc: "Event-driven data pipeline on AWS and Snowflake. A Lambda pulls a jobs REST API into S3, Snowpipe auto-loads each new file, and Snowflake Streams + Tasks run LATERAL FLATTEN and MERGE to keep a deduplicated, analytics-ready table current with no manual steps.",
    live: "https://github.com/vinay23is/automated-job-data-ingestion-pipeline",
    github: "https://github.com/vinay23is/automated-job-data-ingestion-pipeline",
  },
  {
    num: "04",
    name: "Distributed Chat",
    tags: ["Java", "WebSocket", "Redis Pub/Sub", "Kafka", "PostgreSQL"],
    desc: "Horizontally scaled chat backend. Redis Pub/Sub fans WebSocket messages out across multiple server instances so users on different nodes stay in sync, Kafka handles durable notification delivery, and Postgres stores message history.",
    live: "https://github.com/vinay23is/distributed-chat-system",
    github: "https://github.com/vinay23is/distributed-chat-system",
  },
  {
    num: "05",
    name: "StockSense AI",
    tags: ["React", "FastAPI", "Gemini", "Recharts", "yFinance"],
    desc: "Full-stack market dashboard. A FastAPI backend pulls live quotes, computes RSI/MACD, and asks Gemini for plain-English commentary; a React front end charts it and compares multiple tickers. Request-logging middleware and a /metrics endpoint on the API.",
    live: "https://stocksense-ai-ten.vercel.app",
    github: "https://github.com/vinay23is/stocksense-ai",
  },
];

// Additional work — still real, kept discoverable below the featured set.
const MORE_PROJECTS = [
  {
    num: "06",
    name: "Customer Intent Router",
    tags: ["Python", "FastAPI", "LangChain", "Gemini", "Pydantic"],
    desc: "LLM router that classifies support messages by intent and dispatches each to a specialized agent — FAQ, escalation, offer, follow-up — with schema-constrained Pydantic outputs, confidence-aware routing, and an offline eval set.",
    live: "https://github.com/vinay23is/customer-intent-router",
    github: "https://github.com/vinay23is/customer-intent-router",
  },
  {
    num: "07",
    name: "Fintech Risk Analytics",
    tags: ["dbt", "DuckDB", "Snowflake", "SQL", "Power BI"],
    desc: "Analytics-engineering project: dbt models layered staging → intermediate → marts on DuckDB/Snowflake, with data-quality tests and dashboard-ready risk metrics.",
    live: "https://github.com/vinay23is/fintech-risk-analytics-platform",
    github: "https://github.com/vinay23is/fintech-risk-analytics-platform",
  },
];

// group: "relevant" = engineering / data / research roles (given prominence);
// "additional" = campus jobs kept for completeness but de-emphasized.
const EXPERIENCE = [
  {
    id: "bits-and-binaries",
    company: "Bits and Binaries, Inc.",
    role: "Research Informatics Analyst",
    period: "Aug 2026 – Present · Remote",
    group: "relevant",
    bullets: [
      "Build Python, SQL, and PySpark ETL workflows on Snowflake and AWS to ingest, transform, and validate research and operational datasets.",
      "Design scalable pipelines across relational databases, cloud storage, and analytical platforms with layered raw-to-curated processing.",
      "Work across AWS services (S3, Lambda, RDS, Athena, IAM, CloudWatch) and implement validation and reconciliation checks to improve data reliability.",
    ],
  },
  {
    id: "ku-nccs",
    company: "University of Kansas — NCCS",
    role: "Graduate Research Assistant",
    period: "Jan 2024 – May 2024",
    group: "relevant",
    bullets: [
      "Developed 3D visual simulations for robotic construction systems using OpenGL and C++.",
      "Built Python data analysis and visualization pipelines.",
      "Collaborated across engineering and CS teams.",
    ],
  },
  {
    id: "ltimindtree",
    company: "LTIMindtree",
    role: "Software Engineering Intern",
    period: "Jan 2023 – May 2023 · Pune, India",
    group: "relevant",
    bullets: [
      "Built features using Java, Python, and JavaScript in collaborative agile workflows.",
    ],
  },
  {
    id: "ku-grader",
    company: "University of Kansas",
    role: "Grader — MATH 126 (Calculus)",
    period: "Jan 2024 – Jan 2025",
    group: "additional",
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
    group: "additional",
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
    group: "additional",
    bullets: [
      "Resolved IT issues via calls and chat.",
      "Installed operating systems and reimaged library loaner laptops.",
    ],
  },
];

// Research roles. Kept concise — the Experience section already lists the KU
// role; this frames the same work in a research context for reviewers.
const RESEARCH = [
  {
    id: "ku-nccs-research",
    company: "University of Kansas — NCCS",
    role: "Graduate Research Assistant",
    period: "Jan 2024 – May 2024",
    bullets: [
      "Robotic construction / automated construction simulation.",
      "Python and C++ with OpenGL-based 3D simulation.",
      "Data analysis and visualization, collaborating across computer science and engineering.",
    ],
  },
];

// Publications. Structured as a list so more can be added later. A `doi` is
// only set where it was verified to resolve (via doi.org / Crossref); entries
// without a verified link are shown without one rather than with a broken link.
const PUBLICATIONS = [
  {
    id: "transformer-pulmonary",
    title:
      "Compact Transformer Neural Network for Pulmonary Disease Classification from Radiological Imaging",
    venue: "Intelligent Healthcare and Computational Neural Modelling (ICIHCNN), Springer",
    year: "2024",
    type: "Conference paper",
    doi: "10.1007/978-981-99-2832-3_9",
  },
  {
    id: "harmony-search-dl",
    title: "Adopting Harmony Search Algorithm in Deep Learning",
    venue: "Intelligent Healthcare and Computational Neural Modelling (ICIHCNN), Springer",
    year: "2024",
    type: "Conference paper",
    doi: "10.1007/978-981-99-2832-3_71",
  },
  {
    id: "telugu-ocr-dl",
    title: "Isolated Telugu Language Character Recognition Using Deep Learning",
    venue: "Intelligent Healthcare and Computational Neural Modelling (ICIHCNN), Springer",
    year: "2024",
    type: "Conference paper",
    doi: "10.1007/978-981-99-2832-3_46",
  },
  {
    id: "cnn-alzheimers",
    title: "Implementation of Convolutional Neural Networks for Detection of Alzheimer's Disease",
    venue: "BioGecko: A Journal for New Zealand Herpetology, 12(1), 71–82",
    year: "2023",
    type: "Journal article",
  },
  {
    id: "cs-teaching-online-learning",
    title:
      "The Computer Science Based Teaching Strategy on Impact of a Student Knowledge in Online Learning",
    venue: "International Journal of Early Childhood Special Education, 14(5), 6349–6356",
    year: "2022",
    type: "Journal article",
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
  { category: "Backend", items: ["Java", "Spring Boot", "FastAPI", "REST APIs", "JWT", "WebSocket"] },
  { category: "Data", items: ["PostgreSQL", "Redis", "Kafka", "dbt", "DuckDB", "Snowflake", "PySpark", "SQL"] },
  { category: "ML", items: ["Deep learning", "CNNs", "PyTorch", "TensorFlow Lite", "XGBoost", "Scikit-learn", "Feature engineering"] },
  { category: "AI / LLM", items: ["LangChain", "Gemini", "RAG", "LLM agents", "Pydantic structured output"] },
  { category: "Frontend", items: ["React", "TypeScript", "Vite", "Tailwind", "Streamlit"] },
  { category: "Infra", items: ["Docker", "Docker Compose", "AWS Lambda", "GitHub Actions", "Prometheus", "Grafana"] },
  { category: "Languages", items: ["Python", "Java", "TypeScript", "JavaScript", "C++"] },
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
      className="project-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
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
            color: "#b0b0b0",
            margin: 0,
            lineHeight: 1.6,
            maxWidth: "560px",
          }}
        >
          {project.desc}
        </p>
      </div>

      <div className="project-links" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {project.live && project.live !== project.github && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} — live site`}
            style={{ color: "#9a9a9a", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8ff47")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9a9a9a")}
            title="Live site"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} — GitHub repository`}
          style={{ color: "#9a9a9a", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8ff47")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9a9a9a")}
          title="GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}

function MoreProjectCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1.5rem",
        border: "1px solid #1f1f1f",
        borderRadius: "2px",
        backgroundColor: hovered ? "#111111" : "transparent",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
        borderColor: hovered ? "#e8ff4755" : "#1f1f1f",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: 0,
          }}
        >
          {project.name}
        </h3>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexShrink: 0 }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} — GitHub repository`}
            style={{ color: "#9a9a9a", transition: "color 0.2s", display: "inline-flex" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8ff47")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9a9a9a")}
            title="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "0.6rem",
              color: "#9a9a9a",
              border: "1px solid #2a2a2a",
              borderRadius: "100px",
              padding: "2px 9px",
              letterSpacing: "0.05em",
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
          fontSize: "0.75rem",
          color: "#b0b0b0",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {project.desc}
      </p>
    </motion.div>
  );
}

// Publications render as a divided list (not a boxed card) so the section
// reads as an intentional list with a single entry and scales cleanly as more
// are added. Fonts follow the site system: Syne title, DM Mono metadata.
function PublicationRow({ pub, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
        padding: "1.4rem 1.25rem",
        borderBottom: "1px solid #1f1f1f",
        borderLeft: hovered ? "2px solid #e8ff47" : "2px solid transparent",
        backgroundColor: hovered ? "#111111" : "transparent",
        transition: "background-color 0.25s ease, border-left-color 0.25s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.6rem",
            color: "#e8ff47",
            border: "1px solid #e8ff47",
            borderRadius: "100px",
            padding: "2px 9px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {pub.type}
        </span>
        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.68rem",
            color: "#9a9a9a",
            letterSpacing: "0.06em",
          }}
        >
          {pub.year}
        </span>
        {pub.doi && (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${pub.title} — DOI ${pub.doi}`}
            title={`doi.org/${pub.doi}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              marginLeft: "auto",
              fontFamily: "DM Mono, monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#9a9a9a",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8ff47")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9a9a9a")}
          >
            DOI
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
      <h3
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "1.15rem",
          fontWeight: 700,
          color: "#f0f0f0",
          margin: 0,
          lineHeight: 1.35,
          overflowWrap: "anywhere",
        }}
      >
        {pub.title}
      </h3>
      <span
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "0.75rem",
          color: "#b0b0b0",
          lineHeight: 1.5,
          overflowWrap: "anywhere",
        }}
      >
        {pub.venue}
      </span>
    </motion.div>
  );
}

function ExperienceEntry({ item, index, compact = false }) {
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
            fontSize: compact ? "0.95rem" : "1.05rem",
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
            color: compact ? "#b0b0b0" : "#e8ff47",
          }}
        >
          {item.role}
        </span>
        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.68rem",
            color: "#9a9a9a",
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
            color: "#9a9a9a",
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
        color: "#9a9a9a",
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
  const prefersReducedMotion = useReducedMotion();

  // Mouse parallax — disabled on touch devices
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const nameX = useSpring(rawX, { stiffness: 50, damping: 20 });
  const nameY = useSpring(rawY, { stiffness: 50, damping: 20 });

  const tagRawX = useMotionValue(0);
  const tagRawY = useMotionValue(0);
  const tagX = useSpring(tagRawX, { stiffness: 50, damping: 20 });
  const tagY = useSpring(tagRawY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    // Skip parallax on touch devices and when reduced motion is requested.
    if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;
    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      rawX.set(x);
      rawY.set(y);
      tagRawX.set(x * 0.5);
      tagRawY.set(y * 0.5);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [prefersReducedMotion, rawX, rawY, tagRawX, tagRawY]);

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
        {/* Particle field — behind everything. Lazy-loaded, and skipped
            entirely when the visitor prefers reduced motion. */}
        {!prefersReducedMotion && (
          <Suspense fallback={null}>
            <ParticleBackground />
          </Suspense>
        )}

        {/* Available tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: "DM Mono, monospace",
            fontSize: "11px",
            color: "#9a9a9a",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            border: "1px solid #2a2a2a",
            borderRadius: "2px",
            padding: "6px 16px",
            marginBottom: "3rem",
          }}
        >
          [ Open to new opportunities · Open to relocation ]
        </motion.div>

        {/* Giant name — parallax layer 1 */}
        <motion.div style={{ x: nameX, y: nameY, position: "relative", zIndex: 1, textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(12vw, 16vw, 220px)",
              fontWeight: 800,
              lineHeight: 0.85,
              color: "#f0f0f0",
              letterSpacing: "-0.03em",
            }}
          >
            <div style={{ overflow: "hidden", whiteSpace: "nowrap", display: "block", width: "100%" }}>
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
            <div style={{ overflow: "hidden", whiteSpace: "nowrap", display: "block", width: "100%" }}>
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
        </motion.div>

        {/* Positioning — parallax layer 2 (half speed) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            x: tagX,
            y: tagY,
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            marginBottom: "3rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)",
              fontWeight: 700,
              color: "#f0f0f0",
              letterSpacing: "-0.01em",
            }}
          >
            AI, Data &amp; Software Engineer
          </span>
          <span
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "clamp(11px, 1.4vw, 13px)",
              color: "#b0b0b0",
              letterSpacing: "0.06em",
              lineHeight: 1.6,
              maxWidth: "34rem",
            }}
          >
            MS Computer Science. Backend services, data pipelines, applied ML —
            built to run in production and hold up there.
          </span>
        </motion.div>

        {/* CTA Buttons — no parallax */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          style={{ position: "relative", zIndex: 1, display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1.5rem" }}
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
            zIndex: 1,
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
          {FEATURED_PROJECTS.map((project, i) => (
            <ProjectCard key={project.num} project={project} index={i} />
          ))}
        </div>

        {/* More projects — kept discoverable, visually lighter */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.7rem",
            color: "#9a9a9a",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "3.5rem 0 1.5rem",
          }}
        >
          More projects
        </motion.h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {MORE_PROJECTS.map((project, i) => (
            <MoreProjectCard key={project.num} project={project} index={i} />
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

        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.68rem",
            color: "#9a9a9a",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "1.75rem",
          }}
        >
          Relevant / Technical
        </span>
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
          {EXPERIENCE.filter((e) => e.group === "relevant").map((item, i) => (
            <ExperienceEntry key={item.id} item={item} index={i} />
          ))}
        </div>

        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.68rem",
            color: "#9a9a9a",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            display: "block",
            margin: "3.5rem 0 1.75rem",
          }}
        >
          Additional Experience
        </span>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            paddingLeft: "1rem",
            opacity: 0.78,
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
          {EXPERIENCE.filter((e) => e.group === "additional").map((item, i) => (
            <ExperienceEntry key={item.id} item={item} index={i} compact />
          ))}
        </div>
      </section>

      {/* RESEARCH & PUBLICATIONS */}
      <section
        id="research-section"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem 6rem",
        }}
      >
        <SectionLabel>05 — RESEARCH &amp; PUBLICATIONS</SectionLabel>
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
          Research &amp; Publications
        </motion.h2>

        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.68rem",
            color: "#9a9a9a",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "1.75rem",
          }}
        >
          Research
        </span>
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
          {RESEARCH.map((item, i) => (
            <ExperienceEntry key={item.id} item={item} index={i} />
          ))}
        </div>

        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.68rem",
            color: "#9a9a9a",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            display: "block",
            margin: "3.5rem 0 1.75rem",
          }}
        >
          Publications
        </span>
        <div style={{ borderTop: "1px solid #1f1f1f", maxWidth: "760px" }}>
          {PUBLICATIONS.map((pub, i) => (
            <PublicationRow key={pub.id} pub={pub} index={i} />
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
        <SectionLabel>06 — EDUCATION</SectionLabel>
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
        <SectionLabel>07 — SKILLS</SectionLabel>
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
