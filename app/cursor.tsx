"use client";
import  { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveMouse);
    return () => window.removeEventListener("mousemove", moveMouse);
  }, [mouseX, mouseY]);

  return (
    <>
   
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 8,
          height: 8,
          backgroundColor: "skyblue",
          borderRadius: "50%",
          zIndex: 9999,
          pointerEvents: "none",
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 40,
          height: 40,
          border: "1px solid skyblue",
          borderRadius: "50%",
          zIndex: 9998,
          pointerEvents: "none",
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference", 
        }}
      />
    </>
  );
}
