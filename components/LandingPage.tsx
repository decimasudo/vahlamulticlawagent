// components/LandingPage.tsx
"use client";

interface Props {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute top-10 left-10 font-terminal text-[15vw] opacity-[0.03] pointer-events-none font-bold select-none">
        SECURE_REPO
      </div>

      <div className="max-w-4xl w-full z-10 space-y-12">
        <div className="space-y-4">
          <div className="inline-block bg-industrial text-black px-3 py-1 font-bold tracking-[0.3em] text-sm mb-4">
            VAHLA_SECURITY_MAINFRAME // AUBURN-01
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none uppercase">
            Hardened <span className="text-amber">OpenClaw</span> <br />
            Repositories.
          </h1>
          <p className="text-gunmetal font-terminal max-w-2xl text-lg">
            We provide 1700+ OpenClaw skills that have been integrated with <span className="text-industrial">ClawSec Armor</span>. Assemble your Agent now; security is no longer an option, but a built-in standard of Vahla.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gunmetal/30">
          <div className="space-y-2 group">
            <span className="text-amber font-terminal text-xs">// DATABASE_VAHLA</span>
            <h3 className="font-bold text-xl uppercase group-hover:text-industrial transition-colors">1700+ Pre-Secured Skills</h3>
            <p className="text-gunmetal text-sm font-terminal">Access to the largest skill repository that has passed ClawSec integration validation.</p>
          </div>
          <div className="space-y-2 group">
            <span className="text-amber font-terminal text-xs">// FOUNDRY_PROCESS</span>
            <h3 className="font-bold text-xl uppercase group-hover:text-industrial transition-colors">Instant Agent Armoring</h3>
            <p className="text-gunmetal text-sm font-terminal">Choose any skill, and we will automatically inject Vahla Core Security into your Agent.</p>
          </div>
        </div>

        <div className="pt-8">
          <button 
            onClick={onEnter}
            className="group relative flex items-center gap-6 bg-industrial p-1 pr-12 transition-all hover:pr-16"
          >
            <div className="bg-black text-industrial p-4 font-bold text-2xl tracking-widest uppercase">
              Access_The_Foundry
            </div>
            <span className="text-black font-bold text-xl group-hover:translate-x-2 transition-transform">
              `{'>'}` `{'>'}` 
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
// EOF