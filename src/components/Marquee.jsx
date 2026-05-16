import { useRef, useState } from "react";
import { motion } from "framer-motion";

const ITEMS =
  "REACT · FASTAPI · PYTHON · LANGCHAIN · RAG · GEMINI AI · FIREBASE · TAILWIND · ESP32 · AWS IOT · OPENGL · C++ · MACHINE LEARNING · ";

export default function Marquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        position: "relative",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
        padding: "1rem 0",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        style={{
          display: "flex",
          gap: 0,
          whiteSpace: "nowrap",
        }}
        animate={paused ? { x: 0 } : { x: [0, "-50%"] }}
        transition={
          paused
            ? { duration: 0 }
            : {
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                },
              }
        }
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "0.7rem",
              color: "#555555",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              paddingRight: "2rem",
            }}
          >
            {ITEMS}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
