"use client";
import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // NEW: Track click state
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window));
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    
    const mouseDown = () => setIsClicked(true);
    const mouseUp = () => setIsClicked(false);

    if (!isMobile) {
      window.addEventListener("mousemove", moveMouse);
      window.addEventListener("mousedown", mouseDown);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("resize", checkDevice);
    };
  }, [isMobile, mouseX, mouseY]);

  if (isMobile) return null;

  return (
    <>
     
      <motion.div
        animate={{ scale: isClicked ? 0.5 : 1 }} 
        style={{
          position: "fixed",
          left: 0, top: 0,
          width: 8, height: 8,
          backgroundColor: "skyblue",
          borderRadius: "50%",
          zIndex: 9999,
          pointerEvents: "none",
          x: mouseX, y: mouseY,
          translateX: "-50%", translateY: "-50%",
        }}
      />
      
    
      <motion.div
        animate={{ 
          scale: isClicked ? 0.8 : 1, 
          borderColor: isClicked ? "#ffffff" : "skyblue" 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          position: "fixed",
          left: 0, top: 0,
          width: 40, height: 40,
          border: "1px solid skyblue",
          borderRadius: "50%",
          zIndex: 9998,
          pointerEvents: "none",
          x: smoothX, y: smoothY,
          translateX: "-50%", translateY: "-50%",
          mixBlendMode: "difference", 
        }}
      />
    </>
  );
}
