// app/dashboard/how-it-works/page.tsx
"use client";

import { 
  Search, 
  ShoppingCart, 
  ShieldAlert, 
  DownloadCloud, 
  ArrowRight,
  Zap,
  CheckCircle2
} from "lucide-react";

export default function HowItWorksPage() {
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
    <div className="flex flex-col h-full bg-[#050505] text-white">
      
      {/* Hero Header */}
      <div className="px-8 py-16 text-center bg-gradient-to-b from-industrial/5 to-transparent border-b border-gunmetal/20">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
          From Blueprint to <span className="text-industrial">Reality</span>
        </h1>
        <p className="text-sm text-gray-500 font-terminal max-w-2xl mx-auto">
          Understanding the Vahla lifecycle. How we transform raw OpenClaw skills into hardened, production-ready AI agents.
        </p>
      </div>

      {/* Steps Container */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Diagram Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-900 via-amber/50 to-industrial/50 z-0" />

            {steps.map((step, index) => (
              <div key={step.id} className="relative z-10 group">
                {/* Step Card */}
                <div className="bg-[#0a0a0a] border border-gunmetal/30 p-6 pt-10 h-full hover:border-industrial/50 transition-all duration-500 hover:-translate-y-2">
                  
                  {/* Icon Bubble */}
                  <div className={`
                    absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#111] border-2 border-gunmetal 
                    flex items-center justify-center shadow-xl group-hover:border-industrial transition-colors
                  `}>
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                  </div>

                  {/* Step Number */}
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

                {/* Arrow (Mobile/Tablet only) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4 text-gunmetal">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Feature Highlights */}
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
  );
}