// app/dashboard/page.tsx (NEW WELCOME SCREEN)
"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Cpu, 
  Store, 
  Activity, 
  ShieldCheck,
  Github,
  Twitter
} from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="min-h-full flex flex-col justify-center items-center p-8 lg:p-20 relative">
      
      {/* Decorative Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-industrial/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full space-y-12 relative z-10">
        
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-industrial/10 border border-industrial/30 rounded-full text-[10px] font-bold text-industrial uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Online
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-industrial to-amber-600">Operator.</span>
          </h1>
          <p className="text-gray-500 font-terminal max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Vahla Neural Foundry v4.0 is ready. Select an operation mode to begin assembling your high-agency units.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <a 
              href="https://github.com/decimasudo/vahlamulticlawagent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 bg-black/50 border border-gunmetal/30 hover:border-industrial/50 rounded-sm flex items-center justify-center transition-all hover:scale-110 group"
            >
              <Github className="w-4 h-4 text-gray-400 group-hover:text-industrial transition-colors" />
            </a>
            <a 
              href="https://x.com/vahlamulticlaw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 bg-black/50 border border-gunmetal/30 hover:border-industrial/50 rounded-sm flex items-center justify-center transition-all hover:scale-110 group"
            >
              <Twitter className="w-4 h-4 text-gray-400 group-hover:text-industrial transition-colors" />
            </a>
          </div>
        </div>

        {/* Action Grid (Kartu Besar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Skill Market (Manual) */}
          <Link href="/dashboard/browse" className="group relative border border-gunmetal/30 bg-black/40 hover:border-industrial/50 transition-all p-8 flex flex-col justify-between h-64 overflow-hidden rounded-sm">
            <div className="absolute top-0 right-0 p-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-black border border-gunmetal rounded-sm flex items-center justify-center mb-6 group-hover:border-industrial transition-colors">
                <Store className="w-6 h-6 text-gray-400 group-hover:text-industrial" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase mb-2">Browse Skill Market</h3>
              <p className="text-xs text-gray-500 font-terminal">
                Manually select from 1700+ hardened modules to build a custom unit from scratch.
              </p>
            </div>

            <div className="flex items-center gap-2 text-industrial text-xs font-bold uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Agent Templates (Instant) */}
          <Link href="/dashboard/agents" className="group relative border border-gunmetal/30 bg-black/40 hover:border-industrial/50 transition-all p-8 flex flex-col justify-between h-64 overflow-hidden rounded-sm">
            <div className="absolute top-0 right-0 p-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-black border border-gunmetal rounded-sm flex items-center justify-center mb-6 group-hover:border-industrial transition-colors">
                <Cpu className="w-6 h-6 text-gray-400 group-hover:text-amber" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase mb-2">Deploy Templates</h3>
              <p className="text-xs text-gray-500 font-terminal">
                Use pre-configured blueprints (Crypto, CyberSec, Dev) for instant deployment.
              </p>
            </div>

            <div className="flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform">
              Select Blueprint <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-gunmetal/20">
          <div className="text-center md:text-left">
            <span className="block text-2xl font-black text-white">1,708</span>
            <span className="text-[10px] text-gray-500 font-terminal uppercase tracking-widest">Total Modules</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-2xl font-black text-white">99.9%</span>
            <span className="text-[10px] text-gray-500 font-terminal uppercase tracking-widest">Uptime</span>
          </div>
          <div className="text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-2">
               <ShieldCheck className="w-5 h-5 text-industrial" />
               <span className="text-2xl font-black text-white">Active</span>
             </div>
             <span className="text-[10px] text-gray-500 font-terminal uppercase tracking-widest">ClawSec Armor</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-2xl font-black text-white">v4.0.5</span>
            <span className="text-[10px] text-gray-500 font-terminal uppercase tracking-widest">Kernel Ver</span>
          </div>
        </div>
      </div>
    </div>
  );
}
// EOF