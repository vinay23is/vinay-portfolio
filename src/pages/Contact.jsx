import { motion } from "framer-motion";

const LINKS = [
  {
    label: "dodlavinay012@gmail.com",
    href: "mailto:dodlavinay012@gmail.com",
  },
  {
    label: "linkedin.com/in/vinay-dodla-695232213",
    href: "https://linkedin.com/in/vinay-dodla-695232213",
  },
  {
    label: "github.com/vinay23is",
    href: "https://github.com/vinay23is",
  },
];

function ContactLink({ link, index }) {
  return (
    <motion.a
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 + index * 0.12 }}
      style={{
        display: "block",
        fontFamily: "DM Mono, monospace",
        fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
        color: "#f0f0f0",
        textDecoration: "none",
        padding: "1.25rem 0",
        borderBottom: "1px solid #1f1f1f",
        position: "relative",
        overflow: "hidden",
        transition: "color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#e8ff47";
        const line = e.currentTarget.querySelector(".hover-line");
        if (line) line.style.transform = "scaleX(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#f0f0f0";
        const line = e.currentTarget.querySelector(".hover-line");
        if (line) line.style.transform = "scaleX(0)";
      }}
    >
      {link.label}
      <span
        className="hover-line"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: "#e8ff47",
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.3s ease",
        }}
      />
    </motion.a>
  );
}

export default function Contact() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8rem 2rem",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: 800,
          color: "#f0f0f0",
          margin: "0 0 1.5rem",
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        Let's build{" "}
        <span style={{ color: "#e8ff47" }}>something.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "0.8rem",
          color: "#555555",
          textAlign: "center",
          lineHeight: 1.7,
          maxWidth: "480px",
          margin: "0 0 4rem",
        }}
      >
        Open to full-time roles in AI/ML Engineering, Data Science, and Software Engineering.
        Open to remote and relocation.
      </motion.p>

      <div style={{ width: "100%" }}>
        {LINKS.map((link, i) => (
          <ContactLink key={link.label} link={link} index={i} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "0.7rem",
          color: "#555555",
          textAlign: "center",
          marginTop: "3rem",
          letterSpacing: "0.1em",
        }}
      >
        Lawrence, KS · Available now
      </motion.p>
    </div>
  );
}
