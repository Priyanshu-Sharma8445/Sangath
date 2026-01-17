
import React, { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

// --- HELPER: Generates random star patterns using CSS box-shadow ---
// This is defined outside the component so it only runs once.
const generateSpaceShadows = (count, color) => {
  let shadow = "";
  for (let i = 0; i < count; i++) {
    // Generate random coordinates across a large 2000x2000 space
    shadow += `${Math.random() * 2000}px ${Math.random() * 2000}px ${color}, `;
  }
  // Remove the trailing comma and space
  return shadow.slice(0, -2);
};

// Generate star layers with different densities and slight color tints
const smallStars = generateSpaceShadows(1000, "#ffffff"); // Many small white stars
const mediumStars = generateSpaceShadows(300, "#a78bfa"); // Some medium purple-ish stars
const largeStars = generateSpaceShadows(100, "#60a5fa");  // Few large blue-ish stars
// -------------------------------------------------------------------


const MainLayout = () => {
  return (
    // ROOT CONTAINER: Relative position to contain absolute backgrounds
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">

      {/* ================= GALAXY BACKGROUND LAYERS ================= */}
      
      {/* Layer 1: Deep Base Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-black opacity-80"></div>

      {/* Layer 2: Rotating Nebula Clouds (Blurred blobs) */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin-slow_120s_linear_infinite] opacity-30 mix-blend-screen pointer-events-none">
          <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-indigo-600/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[20%] right-[30%] w-[50vw] h-[50vw] bg-purple-600/30 rounded-full blur-[150px]"></div>
      </div>
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin-slower-reverse_180s_linear_infinite] opacity-20 mix-blend-screen pointer-events-none">
          <div className="absolute top-[40%] right-[40%] w-[30vw] h-[30vw] bg-blue-600/40 rounded-full blur-[100px]"></div>
      </div>

      {/* Layer 3: Parallax Star Fields 
          We use a single 1px div and apply hundreds of box-shadows to create stars.
          The 'after' pseudo-element creates a duplicate layer for seamless looping.
      */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Small Stars - Slowest speed */}
        <div 
           style={{ boxShadow: smallStars }} 
           className="absolute w-px h-px bg-transparent animate-[galaxyMoveUp_200s_linear_infinite] after:content-[''] after:absolute after:top-[2000px] after:w-px after:h-px after:bg-transparent after:shadow-[inherit]" 
        />
        {/* Medium Stars - Medium speed */}
        <div 
           style={{ boxShadow: mediumStars }} 
           className="absolute w-px h-px bg-transparent animate-[galaxyMoveUp_150s_linear_infinite] after:content-[''] after:absolute after:top-[2000px] after:w-px after:h-px after:bg-transparent after:shadow-[inherit]" 
        />
         {/* Large Stars - Fastest speed (creates depth) */}
        <div 
           style={{ boxShadow: largeStars }} 
           className="absolute w-px h-px bg-transparent animate-[galaxyMoveUp_100s_linear_infinite] after:content-[''] after:absolute after:top-[2000px] after:w-px after:h-px after:bg-transparent after:shadow-[inherit]" 
        />
      </div>

      {/* ================= ACTUAL APP CONTENT ================= */}
      {/* z-10: Ensures content sits ON TOP of the background layers.
          backdrop-blur-[1px]: Adds a very subtle blur to the galaxy behind the content.
      */}
      <div className="relative z-10 flex w-full h-screen overflow-hidden backdrop-blur-[1px]">
        
        <LeftSidebar />

        <div className="flex-1 h-full overflow-y-auto no-scrollbar">
            <Outlet />
        </div>
      </div>

    </div>
  )
}

export default MainLayout