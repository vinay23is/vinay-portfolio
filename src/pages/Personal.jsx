import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const LANGUAGES = [
  { name: "Telugu", level: "Native" },
  { name: "Hindi", level: "Fluent" },
  { name: "English", level: "Fluent" },
  { name: "Japanese", level: "Learning", note: "(頑張ってます)" },
];

const OBSESSIONS = [
  {
    emoji: "🏍",
    name: "Ducati Diavel V4",
    desc: "The most beautiful machine ever made. Cruiser soul, superbike heart.",
  },
  {
    emoji: "🏍",
    name: "Kawasaki H2",
    desc: "Supercharged. Borderline illegal. Absolutely necessary.",
  },
  {
    emoji: "⌚",
    name: "Omega Speedmaster Snoopy Moonswatch",
    desc: "A watch that makes you smile every time you look at it. That's rare.",
  },
  {
    emoji: "👟",
    name: "SB Dunks",
    desc: "Can't get them. Still want them. The ones I'd actually get: Yeezy 350, TS x Air Jordan Low, Off-White collabs.",
  },
  {
    emoji: "🌸",
    name: "Perfumery",
    desc: "Still mapping the world of scent. Every bottle is a new vocabulary word.",
  },
  {
    emoji: "🎬",
    name: "Cinema",
    desc: "Movies in Telugu, Hindi, English, Japanese. A good film hits differently in its native language.",
  },
  {
    emoji: "🎵",
    name: "Music",
    desc: "Songs across all four languages. If it moves me, it counts.",
  },
];

const DAILY = [
  { time: "7:00 AM", activity: "Wake up, resist phone" },
  { time: "8:00 AM", activity: "Study / Build" },
  { time: "12:00 PM", activity: "Gym (3-4x a week)" },
  { time: "2:00 PM", activity: "Deep work / Projects" },
  { time: "7:00 PM", activity: "Movies / Music / Japanese" },
  { time: "10:00 PM", activity: "Overthink everything" },
  { time: "11:30 PM", activity: "Actually sleep" },
];

const STATS = [
  { num: "4", label: "Languages spoken/learning" },
  { num: "3+", label: "Live AI apps deployed" },
  { num: "∞", label: "Films watched across languages" },
  { num: "0", label: "Dunks owned (yet)" },
];

function CountUp({ target, inView }) {
  const [count, setCount] = useState(0);
  const isSpecial = isNaN(parseInt(target));

  useEffect(() => {
    if (!inView || isSpecial) return;
    const end = parseInt(target);
    const duration = 1500;
    const steps = 40;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, isSpecial]);

  if (isSpecial) return <>{target}</>;
  return <>{target.includes("+") ? `${count}+` : count}</>;
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

export default function Personal() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "10rem 2rem 6rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            fontWeight: 800,
            color: "#f0f0f0",
            margin: "0 0 1.5rem",
            lineHeight: 1.05,
          }}
        >
          Hello, I'm Vinay.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.9rem",
            color: "#f0f0f0",
            margin: "0 0 1rem",
            letterSpacing: "0.04em",
          }}
        >
          Engineer by training. Observer by nature. Curious about everything.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.8rem",
            color: "#555555",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          "I notice things most people walk past — in code, in conversations, and in the world."
        </motion.p>
      </section>

      {/* LANGUAGES */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem",
          borderTop: "1px solid #1f1f1f",
        }}
      >
        <SectionLabel>LANGUAGES</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: "0 0 2.5rem",
          }}
        >
          I speak in many tongues.
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
          }}
        >
          {LANGUAGES.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                padding: "1.5rem",
                border: "1px solid #1f1f1f",
                borderRadius: "4px",
                backgroundColor: "#111111",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e8ff4755")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}
            >
              <span
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#f0f0f0",
                }}
              >
                {lang.name}
              </span>
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.65rem",
                  color: "#e8ff47",
                  border: "1px solid #e8ff47",
                  borderRadius: "100px",
                  padding: "2px 10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  alignSelf: "flex-start",
                }}
              >
                {lang.level}
              </span>
              {lang.note && (
                <span
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: "0.7rem",
                    color: "#555555",
                  }}
                >
                  {lang.note}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* OBSESSIONS */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem",
          borderTop: "1px solid #1f1f1f",
        }}
      >
        <SectionLabel>CURRENT OBSESSIONS</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: "0 0 2.5rem",
          }}
        >
          Things I lose sleep over.
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {OBSESSIONS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(232, 255, 71, 0.08)" }}
              style={{
                padding: "1.5rem",
                border: "1px solid #1f1f1f",
                borderRadius: "4px",
                backgroundColor: "#111111",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e8ff4740")}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1f1f1f";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "2rem" }}>{item.emoji}</span>
              <span
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#f0f0f0",
                  lineHeight: 1.3,
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.72rem",
                  color: "#555555",
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CURRENTLY */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem",
          borderTop: "1px solid #1f1f1f",
        }}
      >
        <SectionLabel>CURRENTLY</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            { label: "Watching", value: "Whatever's on — across all four languages" },
            { label: "Learning", value: "Japanese (日本語)" },
            { label: "Listening", value: "Music across Telugu, Hindi, English, Japanese" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.65rem",
                  color: "#e8ff47",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.8rem",
                  color: "#f0f0f0",
                  lineHeight: 1.6,
                }}
              >
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section
        ref={statsRef}
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem",
          borderTop: "1px solid #1f1f1f",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "2rem",
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  fontWeight: 800,
                  color: "#e8ff47",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                <CountUp target={stat.num} inView={statsInView} />
              </div>
              <div
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.7rem",
                  color: "#555555",
                  letterSpacing: "0.08em",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DAILY RHYTHM */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem",
          borderTop: "1px solid #1f1f1f",
        }}
      >
        <SectionLabel>DAILY RHYTHM</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: "0 0 2.5rem",
          }}
        >
          A day in the life.
        </motion.h2>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}
        >
          {DAILY.map((entry, i) => (
            <motion.div
              key={entry.time}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                gap: "2rem",
                padding: "1rem 0",
                borderBottom: i < DAILY.length - 1 ? "1px solid #1f1f1f" : "none",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.7rem",
                  color: "#e8ff47",
                  letterSpacing: "0.06em",
                }}
              >
                {entry.time}
              </span>
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.85rem",
                  color: "#f0f0f0",
                }}
              >
                {entry.activity}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CLOSING LINE */}
      <section
        style={{
          padding: "6rem 2rem 8rem",
          textAlign: "center",
          borderTop: "1px solid #1f1f1f",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Built from curiosity.{" "}
          <span style={{ color: "#e8ff47" }}>Runs on chai and conviction.</span>
        </motion.h2>
      </section>
    </div>
  );
}
