// components/SplashScreen.tsx
"use client";

import { useState, useEffect } from "react";

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const bootSequence = [
    "INITIALIZING VAHLA KERNEL v4.0...",
    "CHECKING BIOMETRICS... [MATCH: AUBURN-01]",
    "LOADING CLAWSEC PROTOCOLS...",
    "> SOUL-GUARDIAN: ACTIVE",
    "> AUDIT-WATCHDOG: ONLINE",
    "ESTABLISHING SECURE CONNECTION...",
    "SYSTEM INTEGRITY: 100%",
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
      delay += Math.random() * 200 + 50; 
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
    <div className="fixed inset-0 z-50 bg-[#151515] flex flex-col items-center justify-center p-8 font-terminal text-[#FFCC00]">
      <div className="w-full max-w-2xl border border-[#333] p-8 bg-black/50 backdrop-blur-sm relative shadow-[0_0_30px_rgba(255,204,0,0.1)]">
        <div className="absolute top-0 left-0 bg-[#FFCC00] text-black px-2 py-1 text-xs font-bold tracking-widest uppercase">
          SYSTEM_BOOT // VAHLA_OS
        </div>
        <div className="space-y-2 mt-4 min-h-[300px]">
          {lines.map((line, i) => (
            <p key={i} className="text-sm md:text-base tracking-wider uppercase">
              <span className="text-[#666] mr-2">{`0${i + 1} ::`}</span>
              {line}
            </p>
          ))}
          {!isReady && (
            <span className="inline-block w-2 h-4 bg-[#FFCC00] cursor-blink ml-1"></span>
          )}
        </div>
        {isReady && (
          <div className="mt-8 border-t border-[#333] pt-6 animate-pulse">
            <p className="text-xl md:text-2xl text-[#FF9900] font-bold text-center">
              PRESS [ENTER] TO ACCESS AGENT FOUNDRY
            </p>
            <p className="text-center text-[#666] text-xs mt-2 uppercase">
              SECURE CHANNEL ENCRYPTED
            </p>
          </div>
        )}
      </div>
      <div className="fixed bottom-8 right-8 text-[#666] text-xs font-terminal text-right uppercase">
        ID: AUBURN-CYBER-01 <br />
        STATUS: STABLE_SESSION
      </div>
    </div>
  );
}
// EOF