"use client";
import  { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Group } from 'three';
import Link from "next/link";

interface ProjectCubeProps {
  onSelect: (projectName: string) => void;
}


function ProjectCube({ onSelect }: ProjectCubeProps) {
  const groupRef = useRef<Group>(null!);
  
  const colors = ["#D4AF37", "#B76E79", "#E5E4E2", "#2C3E50", "#043927", "#1A1A1A"];
  const projects = ["E-Commerce", "3D Experiences", "Attention To Detail", "Luxury Branding", "Portfolio Sites", "Custom Apps"];

  const faceMaterials = colors.map((col, i) => (
    <meshStandardMaterial 
      key={i} attach={`material-${i}`} 
      color={col} metalness={0.9} roughness={0.1} 
    />
  ));

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const cubelets = [];
  for (let x = -1; x <= 1; x++) 
    for (let y = -1; y <= 1; y++) 
      for (let z = -1; z <= 1; z++) 
        cubelets.push([x, y, z]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {cubelets.map((pos, i) => (
          <mesh 
            key={i} 
            position={pos as [number, number, number]} 
            onClick={(e) => {
              e.stopPropagation();

              onSelect(projects[e.face!.materialIndex]);
            }}
          >
            <boxGeometry args={[0.94, 0.94, 0.94]} />
            {faceMaterials}
          </mesh>
        ))}
      </group>
    </Float>
  );
}


export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <main style={{ background: "#050505", minHeight: "100vh", color: "white", fontFamily: "'Inter', sans-serif" }}>
      
     
      <section style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
        
      
        <nav style={{ position: "absolute", top: 0, width: "100%", padding: "40px", display: "flex", justifyContent: "space-between", zIndex: 10 }}>
          <div style={{ letterSpacing: "5px", fontSize: "12px", fontWeight: "bold" }}>PORTFOLIO / GEOFFREY CARTER</div>
          <div style={{ display: "flex", gap: "30px", fontSize: "11px", letterSpacing: "2px" }}>
          
          
          </div>
        </nav>

      
        <div style={{ position: "absolute", bottom: "10%", left: "40px", zIndex: 10, maxWidth: "500px" }}>
          <h1 style={{ fontSize: "64px", fontWeight: "200", margin: 0, lineHeight: 0.9 }}>Experience In<span style={{ color: "skyblue" }}> 3D</span></h1>
          <p style={{ color: "#888", marginTop: "20px", fontSize: "14px", lineHeight: "1.6", letterSpacing: "1px" }}>
            Frontend Developer specializing in high-performance Next.js, React, and Typescript applications and immersive 3D web experiences.
          </p>
          <p style={{ fontSize: "10px", color: "skyblue", marginTop: "30px", letterSpacing: "3px" }}>CLICK THE CUBE TO EXPLORE EXPERTISE</p>
        </div>


        {selectedProject && (
          <div style={{ position: "absolute", top: "25%", right: "40px", width: "300px", background: "rgba(255,255,255,0.03)", padding: "30px", backdropFilter: "blur(10px)", border: "1px solid white", zIndex: 20 }}>
            <h2 style={{ fontSize: "18px", color: "skyblue", margin: 0 }}>{selectedProject}</h2>
            <p style={{ fontSize: "13px", color: "#ccc", margin: "15px 0" }}>High-end solutions built with Three.js, Next.js, and Typescript for maximum engagement.</p>
            <button onClick={() => setSelectedProject(null)} style={{ background: "none", border: "none", color: "#888", fontSize: "11px", cursor: "pointer", padding: 0 }}>CLOSE</button>
          </div>
        )}

        <Canvas camera={{ position: [6, 6, 6], fov: 35 }}>
          <Environment preset="city" /> 
          <ProjectCube onSelect={setSelectedProject} />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} />
          <OrbitControls enableZoom={false} autoRotate={false} />
          <EffectComposer>
            <Bloom luminanceThreshold={1} intensity={1.2} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </section>

   
      <section id="services" style={{ padding: "120px 40px", borderTop: "1px solid #111" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "12px", letterSpacing: "8px", color: "skyblue", marginBottom: "60px" }}>SKILLS</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px" }}>
            <div>
              <h3 style={{ fontWeight: "300", fontSize: "24px" }}>Web Presence</h3>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.8" }}>Building scalable e-commerce and portfolio sites that convert visitors into clients.</p>
            </div>
            <div>
              <h3 style={{ fontWeight: "300", fontSize: "24px" }}>3D Immersion</h3>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.8" }}>Utilizing React Three Fiber to create interactive products that stand out from the competition.</p>
            </div>
            <div id="contact" style={{ background: "#111", padding: "40px", border: "1px solid #222" }}>
              <h3 style={{ fontWeight: "300", fontSize: "24px", color: "skyblue" }}>Contact Me</h3>
              <p style={{ color: "#888", fontSize: "14px" }}>Currently looking to explore new projects</p>
              <Link href="/contact" style={{ textDecoration: 'none', width: '100%' }}>
              <button style={{ width: "100%", padding: "15px", marginTop: "20px", background: "skyblue", border: "none", color: "black", fontWeight: "bold", cursor: "pointer" }}>INQUIRE NOW</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
