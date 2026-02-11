// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";
import LandingPage from "@/components/LandingPage";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function Root() {
  // Kita mulai dengan state 'CHECKING' untuk menghindari flicker/flash splash screen
  const [currentStep, setCurrentStep] = useState<"BOOT" | "LANDING" | "CHECKING">("CHECKING");
  const router = useRouter();

  useEffect(() => {
    // Cek apakah user sudah pernah melewati boot sequence di sesi ini
    const hasBooted = sessionStorage.getItem("vahla_booted");
    
    if (hasBooted === "true") {
      setCurrentStep("LANDING");
    } else {
      setCurrentStep("BOOT");
    }
  }, []);

  const handleBootComplete = () => {
    // Simpan status ke sessionStorage agar refresh/navigasi balik tidak memicu boot lagi
    sessionStorage.setItem("vahla_booted", "true");
    setCurrentStep("LANDING");
  };

  // Jangan render apapun selama pengecekan awal untuk menghindari flash
  if (currentStep === "CHECKING") {
    return <div className="min-h-screen bg-[#151515]" />;
  }

  if (currentStep === "BOOT") {
    return <SplashScreen onComplete={handleBootComplete} />;
  }

  return (
    <main className="min-h-screen relative selection:bg-industrial selection:text-black">
      <div className="scanline" />
      <InteractiveBackground />
      
      {/* Navigasi ke /dashboard */}
      <LandingPage onEnter={() => router.push("/dashboard")} />
    </main>
  );
}
// EOF