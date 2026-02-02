"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import * as THREE from "three";

function InteractivePulse() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const targetX = state.mouse.x * 5;
    const targetY = state.mouse.y * 3;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);

    if (meshRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.1;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }

    if (ringRef.current) {
      const speed = 1.5;
      const cycle = (time % speed) / speed;
      const ringScale = 1 + cycle * 4;
      ringRef.current.scale.set(ringScale, ringScale, ringScale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - cycle;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="skyblue" emissive="skyblue" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="skyblue" transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function ContactPage() {
  const [showProjects, setShowProjects] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {

      mouseX.set(e.clientX - 450); 
      mouseY.set(e.clientY - 125);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const projects = [
    { name: "The Design Lounge", year: "2026", type: "E-Commerce", img: "design.png", url: "https://thedesignlounge.vercel.app" },
    { name: "THE WUN", year: "2026", type: "Contact Page", img: "thewun.png", url: "https://thewun-sigma.vercel.app" },
    { name: "Skinstric AI", year: "2026", type: "AI Scanning", img: "skinstric.png", url: "https://skinstricai-sage.vercel.app" },
    { name: "Ultraverse", year: "2025", type: "Social Media", img: "ultra.png", url: "https://geoff-internship.vercel.app" },
    { name: "Netflix Clone", year: "2025", type: "Streaming", img: "netflix.jpg", url: "https://netflixclone-gilt-two.vercel.app" },
    { name: "Summarist", year: "2025", type: "E-Commerce", img: "sum.png", url: "https://summaristproject-tau.vercel.app" },
  ];

  return (
    <main style={{ background: "#050505", minHeight: "100vh", color: "white", fontFamily: "'Inter', sans-serif" }}>
      <section style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
        
        <div style={{ position: "absolute", top: "40px", left: "40px", zIndex: 100, display: "flex", gap: "20px" }}>
          <Link href="/" style={glassButtonStyle}>←</Link>
          <button onClick={() => setShowProjects(true)} style={glassButtonStyle}>RECENT PROJECTS</button>
        </div>

        <AnimatePresence>
          {showProjects && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={drawerStyle}
            >
              <button onClick={() => setShowProjects(false)} style={closeButtonStyle}> ✕</button>
              <h2 style={{ letterSpacing: "5px", fontSize: "12px", color: "skyblue", marginBottom: "40px" }}>ARCHIVE</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                {projects.map((proj, i) => (
                  <Link key={i} href={proj.url} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <motion.div 
                      whileHover={{ x: 10 }}
                      onMouseEnter={() => setHoveredImage(proj.img)}
                      onMouseLeave={() => setHoveredImage(null)}
                      style={{ borderBottom: "1px solid #222", paddingBottom: "15px", cursor: "pointer" }}
                    >
                      <div style={{ fontSize: "20px", fontWeight: "300" }}>{proj.name}</div>
                      <div style={{ fontSize: "10px", color: "#666", marginTop: "5px", letterSpacing: "2px" }}>{proj.type} / {proj.year}</div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hoveredImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                x: springX,
                y: springY,
                zIndex: 300, 
                width: "400px",
                height: "250px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(135, 206, 235, 0.4)",
                pointerEvents: "none",
                boxShadow: "0 30px 60px rgba(0,0,0,0.8)"
              }}
            >
              <img src={hoveredImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="preview" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, width: "100%", maxWidth: "400px", padding: "20px", pointerEvents: "none" }}>
          <h1 style={{ fontSize: "42px", fontWeight: "200", textAlign: "center", marginBottom: "40px", pointerEvents: "auto" }}>
            The <span style={{ color: "skyblue" }}>Connection</span>
          </h1> 
          <form style={{ display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "auto" }}>
            <input type="text" placeholder="NAME" style={inputStyle} />
            <input type="email" placeholder="EMAIL" style={inputStyle} />
            <textarea placeholder="MESSAGE" rows={4} style={inputStyle} />
            <button style={submitButtonStyle}>SEND MESSAGE</button>
          </form>
        </div>

      
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
              <ambientLight intensity={0.5} />
              <InteractivePulse />
              <EffectComposer>
                <Bloom luminanceThreshold={1} intensity={2.5} mipmapBlur />
              </EffectComposer>
            </Canvas>
        </div>
      </section>
    </main>
  );
}

const glassButtonStyle: React.CSSProperties = {
  color: "#888",
  textDecoration: "none",
  fontSize: "12px",
  letterSpacing: "2px",
  padding: "10px 20px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "4px",
  cursor: "pointer",
};

const drawerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  width: "350px",
  height: "100vh",
  background: "rgba(10, 10, 10, 0.95)",
  backdropFilter: "blur(20px)",
  zIndex: 200,
  padding: "80px 40px",
  borderLeft: "1px solid #222",
};

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "40px",
  right: "40px",
  background: "none",
  border: "none",
  color: "#666",
  fontSize: "10px",
  letterSpacing: "2px",
  cursor: "pointer"
};

const inputStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.4)",
  border: "none",
  borderBottom: "1px solid rgba(135, 206, 235, 0.2)",
  padding: "12px",
  color: "white",
  outline: "none",
  backdropFilter: "blur(5px)"
};

const submitButtonStyle: React.CSSProperties = {
  background: "skyblue",
  color: "black",
  border: "none",
  padding: "18px",
  fontWeight: "bold",
  letterSpacing: "3px",
  cursor: "pointer"
};
