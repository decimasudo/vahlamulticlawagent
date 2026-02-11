// components/SplashScreen.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const bootSequence = [
    "INITIALIZING VAHLA KERNEL v4.0.5...",
    "UPLINK_STATUS: ESTABLISHED",
    "DECODING BIOMETRIC DATA...",
    "OPERATOR_ID: AUBURN-CYBER-01",
    "STATUS: MATCH_CONFIRMED",
    "LOADING CLAWSEC ARMOR MODULES...",
    "> SOUL-GUARDIAN: ACTIVE",
    "> AUDIT-WATCHDOG: ONLINE",
    "NEURAL_LINK: SYNCHRONIZING...",
    "SYSTEM_INTEGRITY: 100%",
    "WARNING: HIGH AGENCY AUTHORIZED.",
  ];

  useEffect(() => {
    let delay = 0;
    bootSequence.forEach((line, index) => {
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (index === bootSequence.length - 1) {
          setTimeout(() => setIsReady(true), 800);
        }
      }, delay);
      delay += Math.random() * 150 + 50; 
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isReady) {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden">
      
      {/* Layout Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-stretch relative z-10">
        
        {/* KOLOM KIRI: Terminal Logs */}
        <div className="flex flex-col animate-in slide-in-from-left-10 duration-1000">
          <div className="flex-grow bg-black/60 border-2 border-gunmetal/30 p-8 backdrop-blur-md relative overflow-hidden flex flex-col">
            
            {/* Header Terminal */}
            <div className="flex justify-between items-center mb-8 border-b border-gunmetal/20 pb-4 shrink-0">
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-industrial animate-pulse" />
                  <span className="font-terminal text-xs text-industrial font-bold uppercase tracking-[0.3em]">
                    SYSTEM_BOOT_SEQUENCE
                  </span>
               </div>
               <span className="font-terminal text-[10px] text-gunmetal">KERNEL_v4.0.5</span>
            </div>

            {/* Log Output - FIXED HEIGHT TO PREVENT JUMPING */}
            <div className="flex-grow font-terminal h-[350px] overflow-hidden space-y-3">
              {lines.map((line, i) => (
                <p key={i} className="text-sm md:text-lg tracking-wider text-industrial uppercase flex gap-4">
                  <span className="text-gunmetal/40">{`0${i + 1}`}</span>
                  <span className="glitch-text">{line}</span>
                </p>
              ))}
              {!isReady && (
                <span className="inline-block w-2 h-5 bg-industrial cursor-blink ml-1"></span>
              )}
            </div>

            {/* Prompt CTA - RESERVED SPACE TO PREVENT JUMPING */}
            <div className="h-20 mt-6 flex flex-col items-center justify-center border-t border-gunmetal/20 shrink-0">
              {isReady && (
                <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                  <p className="text-xl md:text-2xl text-amber font-bold tracking-tighter animate-pulse uppercase">
                    `{'>'}``{'>'}`   PRESS [ENTER] TO INITIALIZE
                  </p>
                  <div className="flex gap-2 mt-2">
                     <div className="w-2 h-1 bg-industrial" />
                     <div className="w-12 h-1 bg-industrial/20" />
                     <div className="w-2 h-1 bg-industrial" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Karakter Auburn-01 (Differentiated View) */}
        <div className="hidden lg:block relative animate-in slide-in-from-right-10 duration-1000">
          <div className="relative w-full h-full min-h-[500px] border-[12px] border-industrial shadow-[0_0_50px_rgba(255,204,0,0.1)]">
             {/* Baut Industrial */}
             <div className="absolute -top-4 -left-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black z-20" />
             <div className="absolute -top-4 -right-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black z-20" />
             <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black z-20" />
             <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black z-20" />

             {/* Karakter Image - TWEAKED FOR SPLASH SCREEN */}
             <div className="absolute inset-0 overflow-hidden bg-black">
                <Image 
                  src="/scifi-girl.jpeg" 
                  alt="Auburn-01 Biometric Scan" 
                  fill 
                  // Perbedaan: Zoom lebih dalam (scale-125) dan filter sepia/amber
                  className="object-cover object-top scale-125 grayscale sepia brightness-50 contrast-125 opacity-70"
                  priority
                />
                
                {/* Overlay Scanning Bar (Animasi garis naik turun) */}
                <div className="absolute top-0 left-0 w-full h-1 bg-industrial/50 shadow-[0_0_15px_rgba(255,204,0,0.8)] animate-[scan_3s_linear_infinite] z-10" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
             </div>

             {/* Label Vertikal */}
             <div className="absolute -right-12 top-1/2 -rotate-90 origin-right font-terminal text-[10px] text-industrial tracking-[0.5em] font-bold whitespace-nowrap bg-black/50 px-2">
                BIO_SCAN: IN_PROGRESS // AUBURN-01
             </div>
          </div>
        </div>
      </div>

      {/* Tailwind Custom Keyframes (Tambahkan di globals.css jika belum ada) */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
// EOF