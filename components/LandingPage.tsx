// components/LandingPage.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { 
  Search, 
  ShoppingCart, 
  ShieldAlert, 
  DownloadCloud, 
  ArrowRight,
  Zap,
  CheckCircle2
} from "lucide-react";

interface Props {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: Props) {
  const [imageSrc, setImageSrc] = useState("/scifi-girl.jpeg");
  const [isStriking, setIsStriking] = useState(false); // State untuk efek petir
  const [isRedActive, setIsRedActive] = useState(false);

  useEffect(() => {
    // 1. Tunggu 3 Detik (3000ms) sesuai request
    const startTimer = setTimeout(() => {
      
      // 2. Mulai "Lightning Strike" (Flash Putih Terang)
      setIsStriking(true);

      // 3. Swap gambar di tengah kilatan cahaya (sangat cepat, 50ms)
      setTimeout(() => {
        setImageSrc("/scifi-girl-red.jpeg");
        setIsRedActive(true);
      }, 50);

      // 4. Matikan efek kilatan dengan cepat (total durasi petir ~200-300ms)
      setTimeout(() => {
        setIsStriking(false);
      }, 250);

    }, 3000);

    return () => clearTimeout(startTimer);
  }, []);

  const steps = [
    {
      id: "01",
      title: "Browse & Select",
      desc: "Explore the Vahla directory of 1700+ capabilities. Use the search bar to find specific modules like 'Crypto Analysis' or 'Web Scraping'.",
      icon: Search,
      color: "text-blue-400"
    },
    {
      id: "02",
      title: "Assemble in Foundry",
      desc: "Add your selected skills to the Neural Foundry. Here you can mix and match modules to create a specialized agent archetype.",
      icon: ShoppingCart,
      color: "text-white"
    },
    {
      id: "03",
      title: "ClawSec Injection",
      desc: "This is the Vahla difference. Our system automatically wraps your agent blueprint with ClawSec monitoring and audit logging tools.",
      icon: ShieldAlert,
      color: "text-amber"
    },
    {
      id: "04",
      title: "Deploy Locally",
      desc: "Download the generated .bat installer. Run it on your local machine to spin up your high-agency, secure AI unit.",
      icon: DownloadCloud,
      color: "text-industrial"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Giant Background Text */}
      <div className="absolute top-20 left-10 font-terminal text-[12vw] opacity-[0.02] pointer-events-none font-bold select-none leading-none">
        VAHLA_INDUSTRIES
      </div>

      {/* Landing Section */}
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        <div className="max-w-7xl w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Branding & Copywriting */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 bg-industrial/10 border border-industrial/30 px-3 py-1">
              <span className="w-2 h-2 bg-industrial animate-pulse" />
              <span className="font-terminal text-[10px] text-industrial tracking-[0.3em] font-bold">
                OFFICIAL_HARDENED_REPOSITORY
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] uppercase">
              Forge <span className="text-amber">Secure</span> <br />
              AI Agents.
            </h1>

            <p className="text-gray-400 font-terminal max-w-xl text-lg leading-relaxed">
              Engineered for high-agency autonomy. Access 1700+ OpenClaw skills pre-fortified with 
              <a href="https://github.com/prompt-security/clawsec/" target="_blank" className="text-industrial hover:underline mx-1">
                ClawSec Armor
              </a>. Build, secure, and deploy in one unified mainframe.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button 
                onClick={onEnter}
                className="group relative flex items-center gap-6 bg-industrial p-1 pr-12 transition-all hover:pr-16"
              >
                <div className="bg-black text-industrial p-5 font-bold text-xl tracking-widest uppercase">
                  Enter_Foundry
                </div>
                <span className="text-black font-bold text-2xl group-hover:translate-x-2 transition-transform">
                  {'>'}
                </span>
              </button>

              <a 
                href="https://github.com/prompt-security/clawsec/" 
                target="_blank"
                className="flex items-center gap-3 border border-gunmetal px-6 py-4 hover:border-industrial transition-all group"
              >
                <span className="font-terminal text-sm text-gunmetal group-hover:text-industrial">VIEW_SECURITY_REPO</span>
              </a>
            </div>
          </div>

          {/* Right Side: The Character with Industrial Frame */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-72 h-96 md:w-[400px] md:h-[500px]">
              {/* Main Image Frame */}
              <div className="absolute inset-0 border-[12px] border-industrial z-10 shadow-[0_0_40px_rgba(255,204,0,0.15)]">
                 <div className="absolute -top-4 -left-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black" />
                 <div className="absolute -top-4 -right-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black" />
                 <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black" />
                 <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black" />
              </div>

              {/* The Image */}
              <div className="absolute inset-2 overflow-hidden bg-black">
                <Image 
                  src={imageSrc} 
                  alt="Auburn-Cyber-01 Interface" 
                  fill 
                  priority
                  className={`
                    object-cover transition-all duration-75 ease-out
                    ${isStriking 
                      ? 'scale-105 brightness-[5.0] contrast-200 blur-[1px]' // EFEK PETIR (Sangat Terang & Cepat)
                      : 'scale-100'
                    }
                    ${isRedActive && !isStriking
                      ? 'grayscale-0' // Warna Merah Menyala
                      : 'grayscale hover:grayscale-0' // Biru/Original (Grayscale default)
                    }
                  `}
                />
                
                {/* Lightning Flash Overlay (Layer tambahan untuk kilatan putih) */}
                <div 
                    className={`
                        absolute inset-0 bg-white mix-blend-hard-light pointer-events-none transition-opacity duration-75
                        ${isStriking ? 'opacity-80' : 'opacity-0'}
                    `} 
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Label Overlay */}
              <div className="absolute -right-8 top-1/2 -rotate-90 origin-right font-terminal text-[10px] text-gunmetal tracking-[0.5em] font-bold">
                MODEL: AUBURN-01 // SECURITY: VERIFIED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#111111] text-white pb-24">
        <div className="px-8 py-20 text-center bg-gradient-to-b from-industrial/10 via-transparent to-transparent border-b border-gunmetal/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.03)_0%,transparent_70%)]"></div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 relative z-10">
            From Blueprint to <span className="text-industrial">Reality</span>
          </h1>
          <p className="text-sm text-gray-500 font-terminal max-w-2xl mx-auto relative z-10">
            Understanding the Vahla lifecycle. How we transform raw OpenClaw skills into hardened, production-ready AI agents.
          </p>
        </div>

        <div className="p-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-900 via-amber/50 to-industrial/50 z-0" />

              {steps.map((step, index) => (
                <div key={step.id} className="relative z-10 group">
                  <div className="bg-[#0a0a0a] border border-gunmetal/30 p-6 pt-10 h-full hover:border-industrial/50 transition-all duration-500 hover:-translate-y-2">
                    <div className={`
                      absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#111] border-2 border-gunmetal 
                      flex items-center justify-center shadow-xl group-hover:border-industrial transition-colors
                    `}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <div className="text-center mb-4">
                      <span className="font-terminal text-[10px] text-gunmetal uppercase tracking-[0.3em]">
                        Step_{step.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-center uppercase mb-3 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 text-center leading-relaxed font-terminal">
                      {step.desc}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center py-4 text-gunmetal">
                      <ArrowRight className="w-6 h-6 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 border border-white/5 rounded-sm flex items-start gap-4">
                <Zap className="w-8 h-8 text-industrial shrink-0" />
                <div>
                  <h4 className="font-bold text-white uppercase text-sm mb-1">Zero-Latency</h4>
                  <p className="text-[10px] text-gray-400">Agents run locally on your machine, ensuring maximum speed.</p>
                </div>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-sm flex items-start gap-4">
                <ShieldAlert className="w-8 h-8 text-amber shrink-0" />
                <div>
                  <h4 className="font-bold text-white uppercase text-sm mb-1">CVE Monitoring</h4>
                  <p className="text-[10px] text-gray-400">Real-time scanning against known vulnerabilities.</p>
                </div>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-sm flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white uppercase text-sm mb-1">Open Source</h4>
                  <p className="text-[10px] text-gray-400">Fully compatible with the standard OpenClaw ecosystem.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
// EOF