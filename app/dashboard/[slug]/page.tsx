// app/dashboard/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import skillsData from "@/data/skills.json";
import { Skill } from "@/types";
import TestDriveModal from "@/components/TestDriveModal";
import { 
  Terminal, 
  Github, 
  Play, 
  ArrowLeft, 
  Bookmark, 
  Zap, 
  Shield, 
  Copy, 
  Check,
  Cpu
} from "lucide-react";

export default function SkillDetail() {
  const { slug } = useParams();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [securedCopied, setSecuredCopied] = useState(false);

  useEffect(() => {
    const found = (skillsData.skills as unknown as Skill[]).find(s => s.slug === slug);
    if (found) setSkill(found);
  }, [slug]);

  const copyCmd = (command: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(command);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  if (!skill) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-terminal text-industrial">
      [SCANNING_DATABASE...]
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 pb-20 p-6 md:p-12 relative">
      <div className="scanline" />
      
      {/* Test Drive Modal Overlay */}
      <TestDriveModal 
        isOpen={isTestDriveOpen} 
        onClose={() => setIsTestDriveOpen(false)} 
        skill={skill} 
      />

      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Breadcrumb / Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gunmetal hover:text-industrial transition-colors font-terminal text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          BACK_TO_FOUNDRY_INDEX
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b-2 border-gunmetal/20 pb-12">
          <div className="flex gap-6 items-center">
            <div className="p-5 bg-industrial/10 border-2 border-industrial text-industrial shadow-[0_0_30px_rgba(255,204,0,0.1)] relative">
              <Terminal className="w-10 h-10" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-industrial" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <span className="text-[10px] font-terminal text-amber tracking-[0.3em] uppercase">Module_Class: {skill.category}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-white">{skill.name}</h1>
              <div className="flex items-center gap-3 text-gunmetal font-terminal text-sm mt-3">
                <span className="text-gray-500 uppercase">Author:</span>
                <span className="text-industrial">{skill.author}</span>
                <span className="opacity-30">|</span>
                <span className="text-gray-500 uppercase">Status:</span>
                <span className="text-green-500">HARDENED</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <a 
               href={skill.github_url} 
               target="_blank" 
               className="flex items-center gap-3 px-6 py-3 border-2 border-gunmetal bg-black hover:border-industrial hover:text-industrial transition-all font-terminal text-xs uppercase"
             >
               <Github className="w-4 h-4" /> 
               Source_Code
             </a>
          </div>
        </div>

        {/* Hero Interaction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Deployment Protocols (Installers) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                 <Cpu className="w-5 h-5 text-amber" />
                 <h3 className="font-bold text-xl uppercase tracking-widest text-amber">Deployment_Protocols</h3>
              </div>
              
              {/* Standard Command */}
              <div className="border-2 border-gunmetal/30 bg-black overflow-hidden group">
                <div className="bg-white/5 px-4 py-3 flex justify-between items-center border-b border-white/5">
                  <span className="text-[10px] font-terminal text-gunmetal uppercase tracking-widest">Standard_Injection</span>
                  <button onClick={() => copyCmd(skill.install_command, setCopied)} className="text-[10px] font-terminal text-industrial flex items-center gap-2 hover:text-white transition-colors">
                    {copied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} 
                    {copied ? 'COPIED_TO_CLIPBOARD' : 'COPY_COMMAND'}
                  </button>
                </div>
                <div className="p-8 font-mono text-base md:text-lg bg-[#050505] relative">
                  <div className="absolute inset-0 bg-industrial/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <span className="text-industrial mr-4 select-none">$</span> 
                  <span className="text-gray-200">{skill.install_command}</span>
                </div>
              </div>

              {/* Vahla Secured Command */}
              <div className="border-2 border-industrial/30 bg-industrial/5 overflow-hidden group">
                <div className="bg-industrial/10 px-4 py-3 flex justify-between items-center border-b border-industrial/20">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-industrial" />
                    <span className="text-[10px] font-terminal text-industrial uppercase tracking-widest">Hardened_Vahla_Protocol</span>
                  </div>
                  <button onClick={() => copyCmd(`${skill.install_command} && npx clawsec install`, setSecuredCopied)} className="text-[10px] font-terminal text-amber flex items-center gap-2 hover:text-white transition-colors">
                    {securedCopied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} 
                    {securedCopied ? 'COPIED_SECURE_CMD' : 'COPY_WITH_ARMOR'}
                  </button>
                </div>
                <div className="p-8 font-mono text-base md:text-lg bg-[#050505] text-amber">
                  <span className="text-amber mr-4 select-none">$</span> 
                  {skill.install_command} <span className="text-industrial">&& npx clawsec install</span>
                </div>
              </div>
            </div>

            {/* Comprehensive Description */}
            <section className="space-y-6 pt-6">
              <h3 className="font-bold text-xl uppercase tracking-widest border-l-4 border-industrial pl-4">Functional_Overview</h3>
              <p className="text-gray-400 leading-relaxed font-terminal text-lg">
                {skill.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                 <div className="p-5 border border-gunmetal/20 bg-white/5 space-y-3">
                    <Zap className="text-industrial w-6 h-6" />
                    <h4 className="font-bold uppercase text-sm">Autonomous Optimization</h4>
                    <p className="text-xs text-gunmetal font-terminal">Module is tuned for high-agency execution with minimal manual overhead.</p>
                 </div>
                 <div className="p-5 border border-gunmetal/20 bg-white/5 space-y-3">
                    <Shield className="text-amber w-6 h-6" />
                    <h4 className="font-bold uppercase text-sm">ClawSec Integration</h4>
                    <p className="text-xs text-gunmetal font-terminal">Pre-validated with ClawSec CVE monitoring for zero-day threat prevention.</p>
                 </div>
              </div>
            </section>
          </div>

          {/* Sidebar Action & Meta */}
          <aside className="space-y-6">
            <button 
              onClick={() => setIsTestDriveOpen(true)}
              className="w-full py-10 bg-industrial text-black font-bold flex flex-col items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_15px_50px_rgba(255,204,0,0.15)] group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-black/10 animate-pulse" />
              <Play className="w-10 h-10 fill-current group-hover:scale-125 transition-transform duration-500" />
              <div className="text-center">
                <span className="block text-xl tracking-[0.3em] font-black uppercase">Test_Drive</span>
                <span className="text-[10px] opacity-60 font-terminal">Initialize Neural Simulation</span>
              </div>
            </button>

            <div className="p-8 border-2 border-gunmetal/30 bg-black/40 font-terminal space-y-6 relative overflow-hidden">
               <div className="absolute -right-8 top-10 rotate-90 opacity-10 text-[40px] font-bold select-none">DATA</div>
               <h4 className="text-xs font-bold text-gunmetal border-b border-gunmetal/20 pb-2 uppercase tracking-widest">Integrity_Metadata</h4>
               <div className="space-y-4 text-xs">
                  <div className="flex justify-between border-b border-gunmetal/10 pb-2">
                    <span className="text-gunmetal uppercase">Version:</span>
                    <span className="text-white">1.0.5-STABLE</span>
                  </div>
                  <div className="flex justify-between border-b border-gunmetal/10 pb-2">
                    <span className="text-gunmetal uppercase">License:</span>
                    <span className="text-white">MIT_INDUSTRIAL</span>
                  </div>
                  <div className="flex justify-between border-b border-gunmetal/10 pb-2">
                    <span className="text-gunmetal uppercase">Last_Patch:</span>
                    <span className="text-white">2026.02.09</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gunmetal uppercase">ClawSec:</span>
                    <span className="text-green-500 font-bold tracking-widest">VERIFIED</span>
                  </div>
               </div>
            </div>

            <div className="p-6 border border-industrial/20 bg-industrial/5">
                <span className="block text-[10px] font-terminal text-industrial mb-2 uppercase tracking-widest">Technical_Note</span>
                <p className="text-[10px] text-gunmetal leading-relaxed">
                  Run this module within a sandboxed environment for maximum operational security. 
                  Audit logs will be transmitted to the local Watchdog service.
                </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
// EOF