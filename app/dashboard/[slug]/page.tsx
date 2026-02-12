// app/dashboard/[slug]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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
  Zap, 
  Shield, 
  Copy, 
  Check,
  Cpu,
  Lock,
  Search,
  FileCode,
  AlertCircle,
  Activity
} from "lucide-react";

export default function SkillDetail() {
  const { slug } = useParams();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [securedCopied, setSecuredCopied] = useState(false);

  // --- SECURITY SCAN STATE ---
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<"IDLE" | "SCANNING" | "SECURE">("IDLE");
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = (skillsData.skills as unknown as Skill[]).find(s => s.slug === slug);
    if (found) {
      setSkill(found);
      // Auto-start scan simulation on load
      setTimeout(() => runSecurityScan(found.name), 500);
    }
  }, [slug]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [scanLogs]);

  const copyCmd = (command: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(command);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  // --- LOGIC: SIMULASI SECURITY SCAN ---
  const runSecurityScan = (name: string) => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStatus("SCANNING");
    setScanProgress(0);
    setScanLogs([`> INITIALIZING CLAWSEC PROTOCOL v4.0...`]);

    const steps = [
      { pct: 10, msg: `> FETCHING SOURCE CHECKSUM FOR: ${name}` },
      { pct: 30, msg: `> ANALYZING DEPENDENCY TREE...` },
      { pct: 45, msg: `> SCANNING FOR KNOWN CVE VULNERABILITIES...` },
      { pct: 60, msg: `> VERIFYING AUTHOR SIGNATURE... [OK]` },
      { pct: 75, msg: `> CHECKING PERMISSION REQUESTS...` },
      { pct: 90, msg: `> RUNNING STATIC CODE ANALYSIS (SAST)...` },
      { pct: 100, msg: `> AUDIT COMPLETE. NO THREATS DETECTED.` },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setIsScanning(false);
        setScanStatus("SECURE");
        return;
      }

      const step = steps[currentStep];
      setScanProgress(step.pct);
      setScanLogs(prev => [...prev, step.msg]);
      currentStep++;
    }, 600); // Kecepatan animasi log
  };

  if (!skill) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-terminal text-industrial animate-pulse">
      [SEARCHING_NEURAL_ARCHIVES...]
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 pb-20 p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="scanline pointer-events-none z-50" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-industrial/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Test Drive Modal Overlay */}
      <TestDriveModal 
        isOpen={isTestDriveOpen} 
        onClose={() => setIsTestDriveOpen(false)} 
        skill={skill} 
      />

      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 relative z-10">
        
        {/* Breadcrumb / Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gunmetal hover:text-industrial transition-colors font-terminal text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          BACK_TO_FOUNDRY_INDEX
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b-2 border-gunmetal/20 pb-12">
          <div className="flex gap-6 items-center">
            <div className="p-5 bg-industrial/10 border-2 border-industrial text-industrial shadow-[0_0_30px_rgba(255,204,0,0.1)] relative group">
              <Terminal className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-industrial animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-industrial" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <span className="text-[10px] font-terminal text-amber tracking-[0.3em] uppercase">Module_Class: {skill.category}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">{skill.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gunmetal font-terminal text-sm mt-3">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 uppercase">Author:</span>
                    <span className="text-industrial border-b border-industrial/30">{skill.author}</span>
                </div>
                <span className="opacity-30">|</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 uppercase">Integrity:</span>
                    <span className="text-green-500 font-bold flex items-center gap-1">
                        <Shield className="w-3 h-3" /> VERIFIED
                    </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <a 
               href={skill.github_url} 
               target="_blank" 
               className="flex items-center gap-3 px-6 py-3 border-2 border-gunmetal bg-black hover:border-industrial hover:text-industrial transition-all font-terminal text-xs uppercase group"
             >
               <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
               Source_Code
             </a>
          </div>
        </div>

        {/* Hero Interaction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Content & Installers */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Installers */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                 <Cpu className="w-5 h-5 text-amber" />
                 <h3 className="font-bold text-xl uppercase tracking-widest text-amber">Deployment_Protocols</h3>
              </div>
              
              {/* Standard Command */}
              <div className="border-2 border-gunmetal/30 bg-black overflow-hidden group transition-all hover:border-gunmetal/60">
                <div className="bg-white/5 px-4 py-3 flex justify-between items-center border-b border-white/5">
                  <span className="text-[10px] font-terminal text-gunmetal uppercase tracking-widest">Standard_Injection</span>
                  <button onClick={() => copyCmd(skill.install_command, setCopied)} className="text-[10px] font-terminal text-industrial flex items-center gap-2 hover:text-white transition-colors">
                    {copied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} 
                    {copied ? 'COPIED_TO_CLIPBOARD' : 'COPY_COMMAND'}
                  </button>
                </div>
                <div className="p-6 md:p-8 font-mono text-sm md:text-base bg-[#050505] relative">
                  <div className="absolute inset-0 bg-industrial/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <span className="text-industrial mr-4 select-none">$</span> 
                  <span className="text-gray-200">{skill.install_command}</span>
                </div>
              </div>

              {/* Vahla Secured Command */}
              <div className="border-2 border-industrial/30 bg-industrial/5 overflow-hidden group transition-all hover:border-industrial hover:shadow-[0_0_20px_rgba(255,204,0,0.1)]">
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
                <div className="p-6 md:p-8 font-mono text-sm md:text-base bg-[#050505] text-amber">
                  <span className="text-amber mr-4 select-none">$</span> 
                  {skill.install_command} <span className="text-industrial">&& npx clawsec install</span>
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <section className="space-y-6 pt-6">
              <h3 className="font-bold text-xl uppercase tracking-widest border-l-4 border-industrial pl-4">Functional_Overview</h3>
              <p className="text-gray-400 leading-relaxed font-terminal text-base md:text-lg">
                {skill.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                 <div className="p-5 border border-gunmetal/20 bg-white/5 space-y-3 hover:bg-white/10 transition-colors">
                    <Zap className="text-industrial w-6 h-6" />
                    <h4 className="font-bold uppercase text-sm text-white">Autonomous Optimization</h4>
                    <p className="text-xs text-gray-400 font-terminal">Module is tuned for high-agency execution with minimal manual overhead.</p>
                 </div>
                 {/* DIGANTI DENGAN TOMBOL VIEW SECURITY REPORT */}
                 <div 
                   onClick={() => runSecurityScan(skill.name)}
                   className="p-5 border border-gunmetal/20 bg-white/5 space-y-3 hover:bg-white/10 transition-colors cursor-pointer group"
                 >
                    <Activity className="text-amber w-6 h-6 group-hover:animate-pulse" />
                    <h4 className="font-bold uppercase text-sm text-white">Live Security Audit</h4>
                    <p className="text-xs text-gray-400 font-terminal">Click to re-run ClawSec integrity verification protocols.</p>
                 </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Interactive Modules */}
          <aside className="space-y-8">
            
            {/* --- NEW: CLAWSEC HEURISTIC SCANNER --- */}
            <div className="border border-gunmetal/30 bg-[#080808] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-black p-4 border-b border-gunmetal/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Lock className={`w-4 h-4 ${scanStatus === 'SECURE' ? 'text-green-500' : 'text-amber animate-pulse'}`} />
                        <span className="font-bold text-xs uppercase text-gray-300">ClawSec_Scanner</span>
                    </div>
                    <span className={`text-[10px] font-terminal px-2 py-0.5 rounded ${scanStatus === 'SECURE' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber'}`}>
                        {scanStatus}
                    </span>
                </div>
                
                {/* Visualizer */}
                <div className="p-6 relative min-h-[200px] flex flex-col font-terminal text-xs">
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-gray-800 mb-4">
                        <div 
                           className="h-full bg-industrial transition-all duration-300 ease-out" 
                           style={{ width: `${scanProgress}%`}}
                        />
                    </div>

                    {/* Terminal Window */}
                    <div 
                        ref={logsContainerRef}
                        className="flex-1 overflow-y-auto max-h-[150px] space-y-1 scrollbar-thin scrollbar-thumb-gunmetal/50 pr-2"
                    >
                        {scanLogs.map((log, i) => (
                            <div key={i} className="text-gray-500">
                                {log}
                            </div>
                        ))}
                        {isScanning && (
                           <div className="text-industrial animate-pulse">_</div>
                        )}
                    </div>

                    {/* Overlay Result */}
                    {scanStatus === "SECURE" && !isScanning && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in zoom-in duration-300">
                            <div className="text-center space-y-2">
                                <Shield className="w-12 h-12 text-green-500 mx-auto" />
                                <h4 className="text-xl font-bold text-white uppercase tracking-widest">PASSED</h4>
                                <p className="text-[10px] text-green-500 font-terminal">0 Vulnerabilities Found</p>
                                <button 
                                  onClick={() => runSecurityScan(skill.name)}
                                  className="mt-4 text-[10px] text-gray-500 hover:text-white underline decoration-dashed"
                                >
                                  Run Diagnostics Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer Check List */}
                <div className="grid grid-cols-2 gap-px bg-gunmetal/20 border-t border-gunmetal/30">
                   <div className="bg-[#0c0c0c] p-3 flex items-center gap-2">
                      <FileCode className="w-3 h-3 text-gray-500" />
                      <span className="text-[9px] text-gray-400 uppercase">Static Analysis</span>
                   </div>
                   <div className="bg-[#0c0c0c] p-3 flex items-center gap-2">
                      <Search className="w-3 h-3 text-gray-500" />
                      <span className="text-[9px] text-gray-400 uppercase">CVE Database</span>
                   </div>
                   <div className="bg-[#0c0c0c] p-3 flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-gray-500" />
                      <span className="text-[9px] text-gray-400 uppercase">Perm Check</span>
                   </div>
                   <div className="bg-[#0c0c0c] p-3 flex items-center gap-2">
                      <Check className="w-3 h-3 text-gray-500" />
                      <span className="text-[9px] text-gray-400 uppercase">Author Verify</span>
                   </div>
                </div>
            </div>

            {/* Test Drive Button */}
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

            {/* Metadata Box */}
            <div className="p-8 border-2 border-gunmetal/30 bg-black/40 font-terminal space-y-6 relative overflow-hidden">
               <div className="absolute -right-8 top-10 rotate-90 opacity-10 text-[40px] font-bold select-none text-white">DATA</div>
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
                    <span className="text-green-500 font-bold tracking-widest flex items-center gap-1">
                        <Check className="w-3 h-3" /> ACTIVE
                    </span>
                  </div>
               </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}
// EOF