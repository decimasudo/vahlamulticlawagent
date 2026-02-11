// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";
import LandingPage from "@/components/LandingPage";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function Root() {
  const [currentStep, setCurrentStep] = useState<"BOOT" | "LANDING" | "CHECKING">("CHECKING");
  const router = useRouter();

  useEffect(() => {
    const hasBooted = sessionStorage.getItem("vahla_booted");
    if (hasBooted === "true") {
      setCurrentStep("LANDING");
    } else {
      setCurrentStep("BOOT");
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem("vahla_booted", "true");
    setCurrentStep("LANDING");
  };

  if (currentStep === "CHECKING") {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  return (
    <main className="min-h-screen relative selection:bg-industrial selection:text-black">
      {/* Background selalu jalan di paling belakang (-z-10) */}
      <InteractiveBackground />
      <div className="scanline" />

      {currentStep === "BOOT" ? (
        <SplashScreen onComplete={handleBootComplete} />
      ) : (
        <LandingPage onEnter={() => router.push("/dashboard")} />
      )}
    </main>
  );
}
// EOF