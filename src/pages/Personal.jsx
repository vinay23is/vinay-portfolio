import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

// ── Data ────────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { name: "Telugu", level: "Native" },
  { name: "Hindi", level: "Fluent" },
  { name: "English", level: "Fluent" },
  { name: "Japanese", level: "Learning", streak: "122日連続 — 122 day streak and counting" },
];

const TILES = [
  {
    id: "ducati",
    emoji: "🏍",
    name: "Ducati Diavel V4",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    desc: "The most beautiful machine ever made. Cruiser soul, superbike heart.",
    rotate: -3,
    size: "large",
  },
  {
    id: "kawasaki",
    emoji: "🏍",
    name: "Kawasaki H2",
    image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80",
    desc: "Supercharged. Borderline illegal. Absolutely necessary.",
    rotate: 2,
    size: "small",
  },
  {
    id: "omega",
    emoji: "⌚",
    name: "Omega Speedmaster Snoopy Moonswatch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    desc: "A watch that makes you smile every time you look at it. That's rare.",
    rotate: -1.5,
    size: "medium",
  },
  {
    id: "sneakers",
    emoji: "👟",
    name: "Sneakers",
    image: "https://images.unsplash.com/photo-1605118287452-f3e319a92c9c?w=800&q=80",
    desc: "Off-White collab. TS x AJ1. The ones that got away. Still watching.",
    rotate: 3.5,
    size: "large",
  },
  {
    id: "pdm",
    emoji: "🌸",
    name: "Parfums de Marly Layton",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80",
    desc: "Still mapping the world of scent. Every bottle is a new vocabulary word.",
    rotate: -2.5,
    size: "medium",
  },
  {
    id: "bvlgari",
    emoji: "🌸",
    name: "Bvlgari Le Gemme Tygar",
    image: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=800&q=80",
    desc: "Bulgari went somewhere unexpected. I followed.",
    rotate: 1.5,
    size: "small",
  },
  {
    id: "verstappen",
    emoji: "🏎",
    name: "Max Verstappen",
    image: "https://images.unsplash.com/photo-1558618047-3c7e6c2b6eee?w=800&q=80",
    desc: "Four world titles. Doesn't care what you think. That's the only way to operate.",
    rotate: -3.5,
    size: "small",
  },
  {
    id: "cinema",
    emoji: "🎬",
    name: "Cinema",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    desc: "Telugu. Hindi. English. Japanese. A good film hits differently in its native language.",
    rotate: 2.5,
    size: "medium",
  },
  {
    id: "music",
    emoji: "🎵",
    name: "Music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    desc: "Songs across four languages. If it moves me, it counts.",
    rotate: -1,
    size: "large",
  },
];

const STATS = [
  { num: "4", label: "Languages spoken or learning" },
  { num: "122", label: "Duolingo streak days (Japanese)" },
  { num: "0", label: "Dunks owned (yet)" },
  { num: "3+", label: "Live AI apps deployed" },
];

const DAILY = [
  { time: "7:00 AM", activity: "Wake up, resist phone" },
  { time: "8:00 AM", activity: "Study / Build" },
  { time: "12:00 PM", activity: "Cook (yes, from scratch)" },
  { time: "1:00 PM", activity: "Deep work / Projects" },
  { time: "5:30 PM", activity: "Duolingo — 122 day streak 🇯🇵" },
  { time: "6:00 PM", activity: "Gym / Walk" },
  { time: "8:00 PM", activity: "Dinner + decompress" },
  { time: "9:00 PM", activity: "Anime / Series / Movies" },
  { time: "10:30 PM", activity: "Overthink everything" },
  { time: "11:30 PM", activity: "Actually sleep" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function CountUp({ target, inView }) {
  const [count, setCount] = useState(0);
  const isSpecial = isNaN(parseInt(target));

  useEffect(() => {
    if (!inView || isSpecial) return;
    const end = parseInt(target);
    const duration = 1600;
    const steps = 50;
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

// ── Carousel image component ─────────────────────────────────────────────────

function CarouselImage({ images, paused }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 2500);
    return () => clearInterval(t);
  }, [paused, images.length]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      ))}
    </div>
  );
}

// ── Mood board tile ──────────────────────────────────────────────────────────

const SIZE_MAP = {
  small: { minHeight: "200px", flex: "1 1 200px", maxWidth: "280px" },
  medium: { minHeight: "260px", flex: "1 1 260px", maxWidth: "340px" },
  large: { minHeight: "300px", flex: "1 1 300px", maxWidth: "420px" },
};

function MoodTile({ tile, index }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const sizeStyle = SIZE_MAP[tile.size];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotate: tile.rotate }}
      animate={
        inView
          ? { opacity: 1, y: 0, rotate: hovered ? 0 : tile.rotate }
          : { opacity: 0, y: 30, rotate: tile.rotate }
      }
      transition={{
        opacity: { duration: 0.5, delay: index * 0.07 },
        y: { duration: 0.6, delay: index * 0.07, ease: [0.33, 1, 0.68, 1] },
        rotate: { type: "spring", stiffness: 260, damping: 22 },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "6px",
        border: hovered ? "1.5px solid #e8ff47" : "1px solid #1f1f1f",
        ...sizeStyle,
        cursor: "default",
        transition: "border-color 0.2s ease",
        flexShrink: 0,
      }}
    >
      {/* Background image */}
      {tile.carousel ? (
        <CarouselImage images={tile.image} paused={hovered} />
      ) : (
        <img
          src={tile.image}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: hovered ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.62)",
          transition: "background-color 0.35s ease",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: "0.4rem",
        }}
      >
        <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{tile.emoji}</span>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "#f0f0f0",
            lineHeight: 1.3,
          }}
        >
          {tile.name}
        </span>
        <motion.span
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "0.68rem",
            color: "#cccccc",
            lineHeight: 1.55,
          }}
        >
          {tile.desc}
        </motion.span>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

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
              {lang.streak && (
                <span
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: "0.68rem",
                    color: "#555555",
                    lineHeight: 1.5,
                  }}
                >
                  {lang.streak}
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
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
            alignItems: "flex-start",
          }}
        >
          {TILES.map((tile, i) => (
            <MoodTile key={tile.id} tile={tile} index={i} />
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
            { label: "Learning", value: "Japanese (日本語) — 122 day streak" },
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
                  letterSpacing: "0.06em",
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          {DAILY.map((entry, i) => (
            <motion.div
              key={entry.time}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                gap: "2rem",
                padding: "0.9rem 0",
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
