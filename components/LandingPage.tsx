// components/LandingPage.tsx
"use client";

import Image from "next/image";

interface Props {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Giant Background Text */}
      <div className="absolute top-20 left-10 font-terminal text-[12vw] opacity-[0.02] pointer-events-none font-bold select-none leading-none">
        VAHLA_INDUSTRIES
      </div>

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
               {/* Decorative Bolts */}
               <div className="absolute -top-4 -left-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black" />
               <div className="absolute -top-4 -right-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black" />
               <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black" />
               <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-gunmetal rounded-full border-2 border-black" />
            </div>

            {/* The Image */}
            <div className="absolute inset-2 overflow-hidden bg-black">
              <Image 
                src="/scifi-girl.jpeg" 
                alt="Auburn-Cyber-01 Interface" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 hover:scale-100"
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
  );
}
// EOF