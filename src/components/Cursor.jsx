import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [isTouch] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );
  const [isHovering, setIsHovering] = useState(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  const dotX = useSpring(rawX, { stiffness: 2000, damping: 100, mass: 0.1 });
  const dotY = useSpring(rawY, { stiffness: 2000, damping: 100, mass: 0.1 });

  const orbX = useSpring(rawX, { stiffness: 80, damping: 25 });
  const orbY = useSpring(rawY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    if (isTouch) return;

    const onMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    const onOver = (e) => {
      const t = e.target;
      if (
        t.tagName === "A" ||
        t.tagName === "BUTTON" ||
        t.closest("a") ||
        t.closest("button") ||
        t.dataset.hover === "true"
      ) {
        setIsHovering(true);
      }
    };

    const onOut = () => setIsHovering(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [isTouch, rawX, rawY]);

  if (isTouch) return null;

  return (
    <>
      {/* Glow orb — lags behind dot */}
      <motion.div
        style={{
          position: "fixed",
          left: orbX,
          top: orbY,
          translateX: "-175px",
          translateY: "-175px",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 70%)",
          zIndex: 9998,
          pointerEvents: "none",
        }}
        animate={{
          scale: isHovering ? 1.4 : 1,
          opacity: isHovering ? 1 : 0.85,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 25 }}
      />

      {/* Small dot — exact position, no lag */}
      <motion.div
        style={{
          position: "fixed",
          left: dotX,
          top: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#e8ff47",
          zIndex: 9999,
          pointerEvents: "none",
        }}
        animate={{ scale: isHovering ? 2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </>
  );
}
